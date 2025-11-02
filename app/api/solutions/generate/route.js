// File: /app/api/solutions/generate/route.ts

import { NextResponse } from 'next/server';
import { validateSolution, getSolutionQuality, generateSolution } from '@/utils/ai';

export async function POST(req) {
  try {
    const { questionId, extractedText, topic } = await req.json();
    
    if (!extractedText || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔍 Generating solution for:', { 
      questionId, 
      topic,
      textLength: extractedText.length 
    });

    const result = await generateSolution(extractedText, topic);
    const { solution, confidence, verified, was_corrected } = result;

    // CRITICAL: Ensure solution has the correct structure for frontend
    const normalizedSolution = normalizeSolutionStructure(solution);

    // Validate
    if (!validateSolution(normalizedSolution)) {
      console.error('❌ Solution validation failed');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Generated solution is invalid',
          solution: normalizedSolution
        },
        { status: 500 }
      );
    }

    // Get quality metrics
    const quality = getSolutionQuality(normalizedSolution);
    console.log('📊 Solution quality:', quality);

    // Add quality warnings if needed
    if (quality.score < 50) {
      normalizedSolution.warning = normalizedSolution.warning || 
        '⚠️ This solution has quality issues. Please review carefully.';
    }

    console.log('✅ Solution generated successfully', {
      questionId,
      confidence,
      verified,
      was_corrected,
      quality_score: quality.score,
      has_warning: !!normalizedSolution.warning
    });

    return NextResponse.json({
      success: true,
      solution: normalizedSolution,
      metadata: {
        confidence,
        verified,
        was_corrected,
        quality_score: quality.score,
        model: result.model || 'gpt-4o-mini'
      }
    });

  } catch (error) {
    console.error('❌ Error in solution generation endpoint:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate solution',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Normalize solution structure to ensure frontend compatibility
 * This fixes the "Cannot read properties of undefined (reading 'map')" error
 */
function normalizeSolutionStructure(solution) {
  // If solution has multi-part structure, convert to single steps array for frontend
  if (solution.part_a_steps || solution.part_b_steps || solution.part_c_steps) {
    console.log('📋 Converting multi-part solution to single array for frontend');
    
    // Combine all parts into a single steps array with section markers
    const allSteps = [];
    
    // Part (a)
    if (solution.part_a_steps && Array.isArray(solution.part_a_steps)) {
      allSteps.push({
        step: allSteps.length + 1,
        title: "═══ PART (a) ═══",
        explanation: solution.part_a_answer ? 
          `Target: ${JSON.stringify(solution.part_a_answer)}` : 
          "Part (a) solution",
        working: "",
        formula: "Part (a)",
        exam_tip: "This is the beginning of part (a)"
      });
      
      solution.part_a_steps.forEach((step, index) => {
        allSteps.push({
          ...step,
          step: allSteps.length + 1, // Renumber for display
          title: `(a) Step ${step.step}: ${step.title}`
        });
      });
      
      if (solution.part_a_answer) {
        allSteps.push({
          step: allSteps.length + 1,
          title: "✓ Answer for Part (a)",
          explanation: "Final answer for this part",
          working: JSON.stringify(solution.part_a_answer, null, 2),
          formula: Object.values(solution.part_a_answer)[0] || "",
          exam_tip: "Part (a) complete"
        });
      }
    }
    
    // Part (b)
    if (solution.part_b_steps && Array.isArray(solution.part_b_steps)) {
      allSteps.push({
        step: allSteps.length + 1,
        title: "═══ PART (b) ═══",
        explanation: solution.part_b_answer ? 
          `Target: ${JSON.stringify(solution.part_b_answer)}` : 
          "Part (b) solution",
        working: "",
        formula: "Part (b)",
        exam_tip: "This is the beginning of part (b)"
      });
      
      solution.part_b_steps.forEach((step) => {
        allSteps.push({
          ...step,
          step: allSteps.length + 1,
          title: `(b) Step ${step.step}: ${step.title}`
        });
      });
      
      if (solution.part_b_answer) {
        allSteps.push({
          step: allSteps.length + 1,
          title: "✓ Answer for Part (b)",
          explanation: "Final answer for this part",
          working: JSON.stringify(solution.part_b_answer, null, 2),
          formula: Object.values(solution.part_b_answer)[0] || "",
          exam_tip: "Part (b) complete"
        });
      }
    }
    
    // Part (c)
    if (solution.part_c_steps && Array.isArray(solution.part_c_steps)) {
      allSteps.push({
        step: allSteps.length + 1,
        title: "═══ PART (c) ═══",
        explanation: solution.part_c_answer ? 
          `Target: ${JSON.stringify(solution.part_c_answer)}` : 
          "Part (c) solution",
        working: "",
        formula: "Part (c)",
        exam_tip: "This is the beginning of part (c)"
      });
      
      solution.part_c_steps.forEach((step) => {
        allSteps.push({
          ...step,
          step: allSteps.length + 1,
          title: `(c) Step ${step.step}: ${step.title}`
        });
      });
      
      if (solution.part_c_answer) {
        allSteps.push({
          step: allSteps.length + 1,
          title: "✓ Answer for Part (c)",
          explanation: "Final answer for this part",
          working: JSON.stringify(solution.part_c_answer, null, 2),
          formula: Object.values(solution.part_c_answer)[0] || "",
          exam_tip: "Part (c) complete"
        });
      }
    }
    
    // Create normalized solution
    return {
      steps: allSteps.length > 0 ? allSteps : [{
        step: 1,
        title: "Solution",
        explanation: "Multi-part solution generated",
        working: JSON.stringify(solution, null, 2),
        formula: ""
      }],
      final_answer: solution.final_answer || {
        part_a: solution.part_a_answer,
        part_b: solution.part_b_answer,
        part_c: solution.part_c_answer
      },
      verification: solution.verification || {
        method: "Multi-part solution",
        passes: true
      },
      hints: solution.common_mistakes || [],
      key_concepts: solution.key_concepts || [],
      common_mistakes: solution.common_mistakes || [],
      exam_technique: solution.exam_technique || "",
      confidence: solution.confidence || 0.85,
      was_multi_part: true
    };
  }
  
  // Single-part solution - ensure all required fields exist
  return {
    steps: Array.isArray(solution.steps) ? solution.steps : [{
      step: 1,
      title: "Solution",
      explanation: "Generated solution",
      working: JSON.stringify(solution, null, 2),
      formula: ""
    }],
    final_answer: solution.final_answer || {},
    verification: solution.verification || {
      method: "N/A",
      passes: false
    },
    hints: solution.hints || solution.common_mistakes || [],
    key_concepts: solution.key_concepts || [],
    common_mistakes: solution.common_mistakes || [],
    exam_technique: solution.exam_technique || "",
    confidence: solution.confidence || 0.85,
    warning: solution.warning
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Solution generation endpoint',
    note: 'POST to this endpoint with questionId, extractedText, and topic'
  });
}