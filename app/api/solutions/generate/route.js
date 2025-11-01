// File: /app/api/solutions/generate/route.ts

import { NextResponse } from 'next/server';
import { generateSolution, validateSolution, getSolutionQuality } from '@/utils/ai';

export async function POST(req) {
  try {
    const { questionId, extractedText, topic } = await req.json();
    
    // Validate input
    if (!extractedText || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: extractedText or topic' },
        { status: 400 }
      );
    }

    console.log('🔍 Generating solution for:', { 
      questionId, 
      topic,
      textLength: extractedText.length 
    });

    // Generate solution using enhanced AI
    const result = await generateSolution(extractedText, topic);
    
    const { solution, confidence, verified, was_corrected, error } = result;

    // Validate the solution structure
    if (!validateSolution(solution)) {
      console.error('❌ Solution validation failed');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Generated solution is invalid',
          solution: solution // Return it anyway for debugging
        },
        { status: 500 }
      );
    }

    // Get quality metrics
    const quality = getSolutionQuality(solution);
    console.log('📊 Solution quality:', quality);

    // Add quality warnings if needed
    if (quality.score < 50) {
      solution.warning = solution.warning || 
        '⚠️ This solution has quality issues. Please review carefully.';
    }

    // Log for monitoring
    console.log('✅ Solution generated successfully', {
      questionId,
      confidence,
      verified,
      was_corrected,
      quality_score: quality.score,
      has_warning: !!solution.warning
    });

    // Optional: Save to database
    // Uncomment and adjust based on your database setup
    /*
    if (questionId) {
      await db.query(
        `UPDATE questions 
         SET ai_solution = $1, 
             confidence = $2, 
             verification_passed = $3,
             was_corrected = $4,
             quality_score = $5
         WHERE id = $6`,
        [
          JSON.stringify(solution),
          confidence,
          verified,
          was_corrected,
          quality.score,
          questionId
        ]
      );
    }
    */

    return NextResponse.json({
      success: true,
      solution: solution,
      metadata: {
        confidence,
        verified,
        was_corrected,
        quality_score: quality.score,
        model: result.model
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

// Optional: GET endpoint for solution statistics
export async function GET(req) {
  try {
    // This would pull stats from your database
    // Uncomment and adjust based on your needs
    
    
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_solutions,
        AVG(confidence) as avg_confidence,
        SUM(CASE WHEN verification_passed THEN 1 ELSE 0 END) as verified_count,
        SUM(CASE WHEN was_corrected THEN 1 ELSE 0 END) as corrected_count,
        AVG(quality_score) as avg_quality_score
      FROM questions
      WHERE ai_solution IS NOT NULL
    `);

    return NextResponse.json({
      success: true,
      statistics: stats.rows[0]
    });

  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}