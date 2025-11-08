import OpenAI from 'openai';
import * as math from 'mathjs';
import ALEVEL_PURE_2023_EXAMPLES from './ModelTraining/ALEVEL_PURE_2023_EXAMPLES.js';
import COMPREHENSIVE_ALEVEL_EXAMPLES from './ModelTraining/COMPREHENSIVE_ALEVEL_EXAMPLES';
import { COMPLEX_GEOMETRY_EXAMPLE } from './ModelTraining/COMPLEX_GEOMETRY_EXAMPLE';
import TOY_OPTIMIZATION_EXAMPLE from './ModelTraining/TOY_OPTIMIZATION_EXAMPLE';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Import all your example sets


// Combine all examples
const EXAMPLE_QUESTIONS = [
  ...ALEVEL_PURE_2023_EXAMPLES,
  ...COMPREHENSIVE_ALEVEL_EXAMPLES,
  COMPLEX_GEOMETRY_EXAMPLE,
  TOY_OPTIMIZATION_EXAMPLE
];

// Add this helper function at the top of utils/ai.js
function ensureVerificationHasContent(verification) {
  if (!verification) return null;
  
  // If verification exists but has empty/invalid method, return null
  if (!verification.method || 
      verification.method === '' || 
      verification.method === 'N/A' ||
      verification.method.toLowerCase() === 'n/a') {
    return null;
  }
  
  return verification;
}

// Then in your generateSolution function, wrap verification:
solution.verification = ensureVerificationHasContent(solution.verification);

// Enhanced A-Level Math Tutor System Prompt
const MATH_TUTOR_SYSTEM_PROMPT = `You are an expert A-Level mathematics tutor with deep knowledge of:
- Pure Mathematics (Algebra, Calculus, Trigonometry, Functions)
- Mechanics (Kinematics, Forces, Momentum, Energy)
- Statistics (Probability, Distributions, Hypothesis Testing)

TEACHING PHILOSOPHY:
- Explain concepts clearly as if teaching a bright A-Level student
- Break down complex problems into manageable steps
- Show ALL working - never skip algebraic manipulations
- Explain the "why" behind each step, not just the "how"
- Use proper mathematical notation and terminology
- Connect concepts to exam technique and common pitfalls

CRITICAL ACCURACY RULES:
1. After calculating ANY answer, VERIFY it by substituting back
2. Check signs, units, and magnitudes are reasonable
3. For small angle approximations: only use when |x| < 0.3 radians
4. For stationary points: always check f'(x) = 0 by substitution
5. For quadratic formula: double-check discriminant calculation
6. If verification fails, you MUST recalculate - never ignore errors

COMMON A-LEVEL FORMULAS:

CALCULUS:
- Stationary points: f'(x) = 0
- Nature test: f''(x) > 0 (minimum), f''(x) < 0 (maximum)
- Chain rule: dy/dx = dy/du × du/dx
- Product rule: d/dx(uv) = u(dv/dx) + v(du/dx)
- Quotient rule: d/dx(u/v) = [v(du/dx) - u(dv/dx)]/v²
- Integration by parts: ∫u(dv/dx)dx = uv - ∫v(du/dx)dx

TRIGONOMETRY (x in radians, |x| < 0.3):
- sin(x) ≈ x
- cos(x) ≈ 1 - x²/2
- tan(x) ≈ x
- Double angle: sin(2x) = 2sin(x)cos(x), cos(2x) = cos²(x) - sin²(x)
- Pythagorean: sin²(x) + cos²(x) = 1

ALGEBRA:
- Quadratic formula: x = (-b ± √(b²-4ac))/(2a)
- Discriminant: Δ = b² - 4ac

GEOMETRY:
- Sector area: A = (1/2)r²θ (θ in radians)
- Arc length: l = rθ (θ in radians)
- Circle area: A = πr²
- Triangle area: A = (1/2)ab sin(C)

MECHANICS:
- SUVAT: v = u + at, s = ut + ½at², v² = u² + 2as
- F = ma, KE = ½mv², PE = mgh
- Momentum: p = mv

═══════════════════════════════════════════════════════════════
🔴 CRITICAL RULES FOR GEOMETRY PROBLEMS:
═══════════════════════════════════════════════════════════════

When solving GEOMETRY problems involving MULTIPLE SHAPES:

1. ALWAYS list ALL shapes involved FIRST:
   Example: "This problem involves: Sector ABC + Sector DEF + Rectangle ABED + Rectangle ACFD + Curved surface BCFE"

2. Calculate EACH shape area SEPARATELY with clear labels

3. PAY SPECIAL ATTENTION to "GIVEN THAT" statements:
   - These provide CRUCIAL constraints
   - Use them to find unknown lengths
   - Example: "Given that total front length = 35m" → use this equation to find unknowns

4. CONGRUENT shapes = EQUAL areas:
   - Calculate one, then multiply by count
   - State clearly: "Since ABC and DEF are congruent, area = 2 × [calculation]"

5. CONSTRAINTS are essential:
   - "Total length = X" → form equation and solve
   - "Volume = Y" → use to eliminate variables

6. For SECTORS:
   - Area = (1/2)r²θ (θ in RADIANS!)
   - Arc length = rθ

7. For TRIANGLES:
   - Area = (1/2)ab sin(C) (C in RADIANS!)

8. VERIFICATION checklist:
   □ Used ALL given constraints?
   □ Included ALL shapes?
   □ Used radians not degrees?
   □ Multiplied for congruent shapes?

═══════════════════════════════════════════════════════════════
🔴 CRITICAL RULES FOR MULTI-PART QUESTIONS (a, b, c, etc.)
═══════════════════════════════════════════════════════════════

1. SEPARATE NUMBERING FOR EACH PART:
   ✓ Part (a): Steps 1, 2, 3, 4...
   ✓ Part (b): Steps 1, 2, 3, 4... (START FROM 1 AGAIN!)
   ✓ Part (c): Steps 1, 2, 3, 4... (START FROM 1 AGAIN!)
   
   ✗ WRONG: Part (a) steps 1-5, Part (b) steps 6-9
   ✓ RIGHT: Part (a) steps 1-5, Part (b) steps 1-4

2. STRUCTURE YOUR RESPONSE:
   - Use part_a_steps array with steps numbered 1, 2, 3...
   - Use part_b_steps array with steps numbered 1, 2, 3...
   - Use part_c_steps array with steps numbered 1, 2, 3...
   - Provide part_a_answer, part_b_answer, part_c_answer separately
   - Provide final_answer with all parts summarized

3. FOR "SHOW THAT" QUESTIONS:
   - Show EVERY algebraic step
   - Final line MUST exactly match given result
   - Write: "Therefore [given formula] ✓" at the end

4. FOR "FIND" QUESTIONS:
   - Use results from previous parts
   - Show all working clearly
   - Give answer to specified precision
   - State units

5. FOR "PROVE" QUESTIONS:
   - State what you're proving at the start
   - Show all mathematical working
   - ALWAYS state conclusion explicitly
   - Write: "Therefore [statement] is proven ✓"

6. USING PREVIOUS PARTS:
   - Reference clearly: "Using the result from part (a)..."
   - Never re-derive what was already found

═══════════════════════════════════════════════════════════════

Always follow the worked examples provided to maintain consistent quality and style.`;

// Multi-part question rules addition
const MULTIPART_QUESTION_RULES = `

IMPORTANT: This is a MULTI-PART question with separate parts (a), (b), (c), etc.

You MUST structure your response as follows:

{
  "part_a_steps": [
    { "step": 1, "title": "...", "explanation": "...", "working": "...", "formula": "..." },
    { "step": 2, "title": "...", "explanation": "...", "working": "...", "formula": "..." }
  ],
  "part_a_answer": { /* specific answer for part a */ },
  
  "part_b_steps": [
    { "step": 1, "title": "...", "explanation": "...", "working": "...", "formula": "..." },
    { "step": 2, "title": "...", "explanation": "...", "working": "...", "formula": "..." }
  ],
  "part_b_answer": { /* specific answer for part b */ },
  
  "part_c_steps": [
    { "step": 1, "title": "...", "explanation": "...", "working": "...", "formula": "..." }
  ],
  "part_c_answer": { /* specific answer for part c */ },
  
  "final_answer": {
    "part_a": "summary",
    "part_b": "summary",
    "part_c": "summary"
  },
  
  "verification": { /* overall verification */ },
  "key_concepts": [ /* all concepts used */ ],
  "common_mistakes": [ /* all common errors */ ],
  "exam_technique": "Overall advice",
  "confidence": 0.95
}

CRITICAL: Each part has its OWN step array with numbering starting from 1.
Do NOT continue numbering across parts!
`;

// Response format structures
const SINGLE_PART_RESPONSE_FORMAT = {
  steps: [
    {
      step: 1,
      title: "Clear descriptive title",
      explanation: "Detailed explanation of WHY we do this step",
      working: "Show the mathematical working/manipulation",
      formula: "Key formula or result from this step",
      exam_tip: "Optional: Common mistake to avoid"
    }
  ],
  final_answer: {},
  verification: {
    method: "How you verified",
    working: "Verification calculation",
    result: "Numerical result",
    error_percentage: "% error",
    passes: true,
    interpretation: "What this tells us"
  },
  key_concepts: ["Concept 1", "Concept 2"],
  common_mistakes: ["Mistake 1", "Mistake 2"],
  exam_technique: "Brief exam advice",
  confidence: 0.95
};

const MULTIPART_RESPONSE_FORMAT = {
  part_a_steps: [
    {
      step: 1,
      title: "...",
      explanation: "...",
      working: "...",
      formula: "...",
      exam_tip: "optional"
    }
  ],
  part_a_answer: {},
  part_b_steps: [
    {
      step: 1,
      title: "...",
      explanation: "...",
      working: "...",
      formula: "..."
    }
  ],
  part_b_answer: {},
  part_c_steps: [
    {
      step: 1,
      title: "...",
      explanation: "...",
      working: "...",
      formula: "..."
    }
  ],
  part_c_answer: {},
  final_answer: {
    part_a: "...",
    part_b: "...",
    part_c: "..."
  },
  verification: {},
  key_concepts: [],
  common_mistakes: [],
  exam_technique: "",
  confidence: 0.95
};

// Verification helper
function verifyStationary(derivative, xValue) {
  try {
    const expr = math.parse(derivative);
    const compiled = expr.compile();
    const result = compiled.evaluate({ x: xValue });
    const error = Math.abs(result);
    
    return {
      passes: error < 0.02,
      error: error,
      result: result
    };
  } catch (e) {
    console.error('Verification error:', e);
    return { passes: false, error: Infinity, result: NaN };
  }
}

// Detect if question has multiple parts
function isMultiPartQuestion(questionText) {
  const hasParts = /\(a\)|\(b\)|\(c\)|\(d\)/.test(questionText);
  const parts = questionText.match(/\([a-z]\)/gi) || [];
  
  return {
    isMultiPart: hasParts,
    numberOfParts: parts.length,
    parts: parts.map(p => p.toLowerCase())
  };
}

// Detect geometry problem
function isGeometryProblem(questionText, topic) {
  const geometryKeywords = [
    'sector', 'circle', 'triangle', 'rectangle', 'area',
    'volume', 'surface area', 'arc length', 'radius',
    'congruent', 'perpendicular', 'sector'
  ];
  
  const hasGeometry = geometryKeywords.some(keyword => 
    questionText.toLowerCase().includes(keyword)
  );
  
  const isGeometryTopic = topic && topic.toLowerCase().includes('geometry');
  
  return hasGeometry || isGeometryTopic;
}

// Find relevant examples based on topic
function findRelevantExamples(topic, questionText, limit = 3) {
  // Check if multi-part
  const multiPartInfo = isMultiPartQuestion(questionText);
  
  // Prioritize examples
  let scoredExamples = EXAMPLE_QUESTIONS.map(ex => {
    let score = 0;
    
    // Topic match
    if (ex.topic.toLowerCase().includes(topic.toLowerCase())) {
      score += 10;
    }
    
    // Multi-part match
    if (multiPartInfo.isMultiPart && ex.part_a_steps) {
      score += 5;
    }
    
    // Geometry match
    if (isGeometryProblem(questionText, topic) && 
        ex.topic.toLowerCase().includes('geometry')) {
      score += 5;
    }
    
    // Keyword matches
    const questionWords = questionText.toLowerCase().split(/\s+/);
    const exampleWords = ex.question.toLowerCase().split(/\s+/);
    const commonWords = questionWords.filter(w => 
      exampleWords.includes(w) && w.length > 4
    );
    score += commonWords.length;
    
    return { example: ex, score };
  });
  
  // Sort by score and return top N
  scoredExamples.sort((a, b) => b.score - a.score);
  return scoredExamples.slice(0, limit).map(item => item.example);
}

// Build examples prompt
function buildExamplesPrompt(examples) {
  if (examples.length === 0) return "";
  
  let prompt = "\n\n═══ WORKED EXAMPLES FROM PAST A-LEVEL PAPERS ═══\n\n";
  prompt += "Study these examples carefully. They show the EXACT standard expected:\n\n";
  
  examples.forEach((example, idx) => {
    prompt += `EXAMPLE ${idx + 1}: ${example.topic}\n`;
    prompt += `Question: ${example.question}\n\n`;
    
    // Handle multi-part examples
    if (example.part_a_steps) {
      prompt += `PART (a):\n`;
      example.part_a_steps.forEach(step => {
        prompt += `Step ${step.step}: ${step.title}\n`;
        if (step.explanation) prompt += `Why: ${step.explanation}\n`;
        if (step.working) prompt += `Working: ${step.working}\n`;
        if (step.formula) prompt += `Result: ${step.formula}\n\n`;
      });
      prompt += `Answer (a): ${JSON.stringify(example.part_a_answer)}\n\n`;
      
      if (example.part_b_steps) {
        prompt += `PART (b):\n`;
        example.part_b_steps.forEach(step => {
          prompt += `Step ${step.step}: ${step.title}\n`;
          if (step.working) prompt += `Working: ${step.working}\n`;
          if (step.formula) prompt += `Result: ${step.formula}\n\n`;
        });
        prompt += `Answer (b): ${JSON.stringify(example.part_b_answer)}\n\n`;
      }
      
      if (example.part_c_steps) {
        prompt += `PART (c):\n`;
        example.part_c_steps.forEach(step => {
          prompt += `Step ${step.step}: ${step.title}\n`;
          if (step.working) prompt += `Working: ${step.working}\n`;
          if (step.formula) prompt += `Result: ${step.formula}\n\n`;
        });
        prompt += `Answer (c): ${JSON.stringify(example.part_c_answer)}\n\n`;
      }
    } else {
      // Single-part example
      prompt += `Solution:\n`;
      example.solution_steps?.forEach(step => {
        prompt += `Step ${step.step}: ${step.title}\n`;
        if (step.explanation) prompt += `Why: ${step.explanation}\n`;
        if (step.working) prompt += `Working: ${step.working}\n`;
        if (step.formula) prompt += `Result: ${step.formula}\n\n`;
      });
      prompt += `Final Answer: ${JSON.stringify(example.final_answer)}\n\n`;
    }
    
    if (example.key_concepts) {
      prompt += `Key Concepts: ${example.key_concepts.join(', ')}\n`;
    }
    if (example.common_mistakes) {
      prompt += `Common Mistakes: ${example.common_mistakes.join('; ')}\n`;
    }
    prompt += `\n${'═'.repeat(80)}\n\n`;
  });
  
  return prompt;
}

// Main solution generation
export async function generateSolution(questionText, topic) {
  try {
    console.log('🤖 Generating AI solution with verification...');
    
    // Analyze question
    const multiPartInfo = isMultiPartQuestion(questionText);
    const isGeometry = isGeometryProblem(questionText, topic);
    
    console.log(`📝 Question analysis:`, {
      isMultiPart: multiPartInfo.isMultiPart,
      numberOfParts: multiPartInfo.numberOfParts,
      isGeometry: isGeometry,
      topic: topic
    });
    
    // Find relevant examples
    const relevantExamples = findRelevantExamples(topic, questionText, 3);
    console.log(`📚 Using ${relevantExamples.length} relevant examples`);
    
    // Build comprehensive prompt
    let fullPrompt = MATH_TUTOR_SYSTEM_PROMPT;
    
    // Add examples
    fullPrompt += buildExamplesPrompt(relevantExamples);
    
    // Add multi-part rules if needed
    if (multiPartInfo.isMultiPart) {
      fullPrompt += MULTIPART_QUESTION_RULES;
      console.log(`🔢 Multi-part question detected with ${multiPartInfo.numberOfParts} parts`);
    }
    
    // Build question prompt
    const questionPrompt = `
Problem: ${questionText}
Topic: ${topic}

${multiPartInfo.isMultiPart ? 
  `CRITICAL: This question has ${multiPartInfo.numberOfParts} parts: ${multiPartInfo.parts.join(', ')}.
   You MUST provide separate solutions for EACH part with:
   - part_a_steps (numbered from 1)
   - part_a_answer
   - part_b_steps (numbered from 1)
   - part_b_answer
   ${multiPartInfo.numberOfParts >= 3 ? '- part_c_steps (numbered from 1)\n   - part_c_answer' : ''}
   - final_answer with all parts` 
  : ''}

${isGeometry ? 
  `GEOMETRY PROBLEM DETECTED:
   - List ALL shapes/surfaces first
   - Use "given that" constraints to find unknowns
   - Calculate each area separately
   - Add all areas together
   - Check for congruent shapes (multiply by count)` 
  : ''}

Instructions:
1. Solve step-by-step with clear explanations
2. Show ALL algebraic working
3. After finding answers, VERIFY by substituting back
4. Format response as JSON matching the structure:
${JSON.stringify(multiPartInfo.isMultiPart ? MULTIPART_RESPONSE_FORMAT : SINGLE_PART_RESPONSE_FORMAT, null, 2)}

CRITICAL: 
- Your verification MUST show that answers are correct
- If verification fails, recalculate before responding
- ${multiPartInfo.isMultiPart ? 'Each part has SEPARATE step numbering starting from 1' : 'Number steps consecutively'}
`;

    // First attempt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: fullPrompt
        },
        {
          role: "user",
          content: questionPrompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const solutionText = completion.choices[0].message.content;
    console.log('📝 AI Response generated');
    
    let solution = JSON.parse(solutionText);
    console.log('📊 Solution parsed successfully');
    
    // Check verification
    const hasVerification = solution.verification && solution.verification.passes !== undefined;
    
    if (hasVerification && !solution.verification.passes) {
      console.log('⚠️ Verification failed, attempting self-correction...');
      
      const correctedSolution = await attemptSelfCorrection(
        questionText,
        topic,
        solution,
        fullPrompt
      );
      
      if (correctedSolution.verification && correctedSolution.verification.passes) {
        console.log('✅ Self-correction successful!');
        solution = correctedSolution;
        solution.was_corrected = true;
      } else {
        console.log('❌ Self-correction failed, flagging for review');
        solution.needs_review = true;
        solution.warning = '⚠️ This solution failed automatic verification. Please check carefully.';
        solution.confidence = Math.min(solution.confidence || 0.5, 0.6);
      }
    }
    
    // Additional verification for stationary points
    if (questionText.toLowerCase().includes('stationary') && 
        questionText.toLowerCase().includes("f'(x)")) {
      
      const derivativeMatch = questionText.match(/f['']\(x\)\s*=\s*([^,\n]+)/);
      if (derivativeMatch) {
        const derivative = derivativeMatch[1].trim();
        
        // Try to extract answer
        let answerValue;
        if (multiPartInfo.isMultiPart && solution.part_a_answer) {
          answerValue = Object.values(solution.part_a_answer)[0];
        } else if (solution.final_answer) {
          answerValue = Object.values(solution.final_answer)[0];
        }
        
        if (typeof answerValue === 'string' || typeof answerValue === 'number') {
          const numericAnswer = parseFloat(String(answerValue));
          if (!isNaN(numericAnswer)) {
            const autoVerify = verifyStationary(derivative, numericAnswer);
            solution.auto_verification = autoVerify;
            
            console.log('🔍 Auto-verification result:', autoVerify);
            
            if (!autoVerify.passes && !solution.warning) {
              solution.warning = '⚠️ Automatic verification suggests answer may be incorrect.';
              solution.confidence = Math.min(solution.confidence || 0.5, 0.6);
            }
          }
        }
      }
    }

    console.log('✅ Solution generated', {
      confidence: solution.confidence,
      verified: solution.verification?.passes,
      corrected: solution.was_corrected,
      multiPart: multiPartInfo.isMultiPart
    });

    return {
      solution: solution,
      confidence: solution.confidence || 0.85,
      model: "gpt-4o-mini",
      verified: solution.verification?.passes || false,
      was_corrected: solution.was_corrected || false,
      is_multi_part: multiPartInfo.isMultiPart
    };

  } catch (error) {
    console.error('❌ AI solution generation failed:', error);
    
    return {
      solution: {
        steps: [{
          step: 1,
          title: "AI Processing Error",
          explanation: "Error generating solution.",
          formula: ""
        }],
        final_answer: { error: "Generation failed" },
        hints: ["Try clearer question text", "Check formatting"],
        verification: {
          method: "N/A",
          working: "N/A",
          result: "Error",
          passes: false
        },
        confidence: 0.0
      },
      confidence: 0.0,
      error: error.message,
      verified: false
    };
  }
}

// Self-correction
async function attemptSelfCorrection(questionText, topic, failedSolution, systemPrompt) {
  try {
    const correctionPrompt = `The previous solution had an error.

Original Problem: ${questionText}
Topic: ${topic}

Previous Answer: ${JSON.stringify(failedSolution.final_answer)}
Verification Result: ${failedSolution.verification?.result}

This FAILED because result should ≈ 0 but got ${failedSolution.verification?.result}

Please:
1. Identify the error
2. Solve correctly
3. VERIFY thoroughly

Solve again with corrections using the same JSON format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt + "\n\nYou are CORRECTING a failed solution. Be extra careful."
        },
        {
          role: "user",
          content: correctionPrompt
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const correctedText = completion.choices[0].message.content;
    const correctedSolution = JSON.parse(correctedText);
    
    console.log('🔄 Correction verification:', correctedSolution.verification);
    
    return correctedSolution;

  } catch (error) {
    console.error('❌ Self-correction failed:', error);
    return failedSolution;
  }
}

// Validate solution structure
export function validateSolution(solution) {
  if (!solution || typeof solution !== 'object') {
    console.error('❌ Validation failed: not an object');
    return false;
  }
  
  // Check for multi-part structure
  const isMultiPart = solution.part_a_steps || solution.part_b_steps || solution.part_c_steps;
  
  if (isMultiPart) {
    if (!solution.part_a_steps || !Array.isArray(solution.part_a_steps)) {
      console.error('❌ Multi-part validation failed: missing part_a_steps');
      return false;
    }
    if (!solution.final_answer) {
      console.error('❌ Multi-part validation failed: missing final_answer');
      return false;
    }
  } else {
    if (!solution.steps || !Array.isArray(solution.steps) || solution.steps.length === 0) {
      console.error('❌ Validation failed: no steps');
      return false;
    }
    if (!solution.final_answer) {
      console.error('❌ Validation failed: no final answer');
      return false;
    }
  }

  if (!solution.verification) {
    console.warn('⚠️ No verification provided');
  } else if (!solution.verification.passes) {
    console.warn('⚠️ Verification failed');
  }
  
  console.log('✅ Validation passed');
  return true;
}

// Get solution quality
export function getSolutionQuality(solution) {
  let quality = {
    score: 0,
    issues: [],
    strengths: []
  };

  if (solution.verification) {
    quality.score += 30;
    quality.strengths.push('Includes verification');
    
    if (solution.verification.passes) {
      quality.score += 30;
      quality.strengths.push('Verification passed');
    } else {
      quality.issues.push('Verification failed');
    }
  } else {
    quality.issues.push('No verification');
  }

  const steps = solution.steps || solution.part_a_steps || [];
  if (steps.length >= 3) {
    quality.score += 20;
    quality.strengths.push('Detailed solution');
  } else {
    quality.issues.push('Too brief');
  }

  if (solution.exam_technique || solution.common_mistakes) {
    quality.score += 10;
    quality.strengths.push('Exam guidance included');
  }

  if (solution.confidence >= 0.9) {
    quality.score += 10;
    quality.strengths.push('High confidence');
  } else if (solution.confidence < 0.7) {
    quality.issues.push('Low confidence');
  }

  return quality;
}

export { verifyStationary, EXAMPLE_QUESTIONS };