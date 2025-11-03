// utils/ai-work-analysis.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const WORK_ANALYSIS_SYSTEM_PROMPT = `You are an expert A-Level mathematics examiner and tutor. Your task is to:

1. Compare student work against the official mark scheme
2. Identify EXACTLY where the student made errors
3. Explain what they should have done instead
4. Award marks according to the mark scheme
5. Provide constructive feedback

MATHEMATICAL NOTATION REQUIREMENTS:
- Use proper mathematical symbols: ×, ÷, ±, ≤, ≥, ≠, ≈, ∞
- Use superscripts for powers: x², x³, not x^2 or x^3
- Use fractions: ½, ¾, not 1/2 or 3/4 when appropriate
- Use square roots: √, ∛, not sqrt() or root()
- Use proper Greek letters: θ, α, β, π, Δ
- Use proper mathematical formatting for all equations

CRITICAL RULES:
- Be specific about line numbers and steps where errors occur
- Quote the student's work when pointing out errors
- Reference the mark scheme criteria
- Explain WHY their approach was wrong
- Show the CORRECT approach step-by-step using proper notation
- Be encouraging but honest about mistakes

Your response MUST be JSON in this format:
{
  "marks_awarded": 8,
  "total_marks": 12,
  "overall_assessment": "Good attempt with some algebraic errors",
  "errors": [
    {
      "location": "Step 3, line 2",
      "student_wrote": "x² + 5x = 0",
      "error_type": "Sign error",
      "explanation": "You wrote x² + 5x when it should be x² - 5x. You forgot to distribute the negative sign.",
      "correct_approach": "When factoring out -1, remember: -(x² + 5x) becomes -x² - 5x, not x² + 5x",
      "marks_lost": 2
    }
  ],
  "what_was_correct": [
    "Correctly identified this as a quadratic equation",
    "Good use of factorization initially",
    "Final answer was correct despite the error (lucky!)"
  ],
  "detailed_corrections": "Full step-by-step correction with explanations",
  "examiner_feedback": "Constructive overall feedback",
  "tips_to_avoid_mistakes": [
    "Always check signs when distributing",
    "Verify your answer by substituting back"
  ]
}`;

export async function analyzeStudentWork(questionText, markSchemeText, studentWorkText) {
  try {
    console.log('🔍 Starting student work analysis...');
    
    if (!markSchemeText || !studentWorkText) {
      throw new Error('Both mark scheme and student work are required for analysis');
    }

    const analysisPrompt = `
QUESTION:
${questionText}

OFFICIAL MARK SCHEME:
${markSchemeText}

STUDENT'S WORK:
${studentWorkText}

Please analyze the student's work against the mark scheme. Be thorough and specific.
Identify every error, explain what went wrong, and show the correct approach.
Award marks according to the mark scheme criteria.

Format your response as JSON following the structure provided.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: WORK_ANALYSIS_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const analysisText = completion.choices[0].message.content;
    const analysis = JSON.parse(analysisText);
    
    console.log('✅ Work analysis completed');
    console.log(`📊 Marks: ${analysis.marks_awarded}/${analysis.total_marks}`);
    console.log(`🔍 Errors found: ${analysis.errors?.length || 0}`);

    return {
      success: true,
      analysis: analysis
    };

  } catch (error) {
    console.error('❌ Work analysis failed:', error);
    return {
      success: false,
      error: error.message,
      analysis: {
        marks_awarded: 0,
        total_marks: 0,
        overall_assessment: "Analysis failed",
        errors: [],
        what_was_correct: [],
        detailed_corrections: "Failed to analyze work",
        examiner_feedback: error.message,
        tips_to_avoid_mistakes: []
      }
    };
  }
}

// Validate analysis structure
export function validateAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object') {
    return false;
  }

  const requiredFields = [
    'marks_awarded',
    'total_marks',
    'overall_assessment',
    'errors',
    'what_was_correct',
    'detailed_corrections'
  ];

  return requiredFields.every(field => field in analysis);
}