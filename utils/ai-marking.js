// utils/ai-marking.js
// NEW FILE - AI examiner that marks student work against mark schemes

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const EXAMINER_SYSTEM_PROMPT = `You are a senior A-Level Mathematics examiner with 20+ years of experience marking Edexcel, AQA, and OCR exam papers.

Your role is to:
1. Mark student work EXACTLY against the official mark scheme
2. Identify where marks are awarded and lost
3. Provide constructive feedback on errors
4. Show the correct continuation from where the student went wrong

CRITICAL RULES:
- Be STRICT but FAIR - follow the mark scheme precisely
- Award partial credit for method marks even if answer is wrong
- Identify the EXACT point where working becomes incorrect
- Explain WHY marks were lost (not just that they were lost)
- Use proper mathematical terminology

For each step in the student's work, determine:
- Is it correct? (award marks)
- Is it incorrect? (explain the error clearly)
- Is it missing? (state what should have been done)
- Does it show method? (method marks even if wrong)

Output format MUST be valid JSON matching the schema provided.`;

/**
 * Mark student work against official mark scheme
 */
export async function markStudentWork(studentWork, markScheme, questionText, topic) {
  try {
    console.log('📝 Starting AI marking process...');
    console.log('Question topic:', topic);

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Using GPT-4 for better reasoning (upgrade from gpt-4o-mini)
      messages: [
        {
          role: "system",
          content: EXAMINER_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `
# QUESTION
${questionText}

# OFFICIAL MARK SCHEME
${markScheme}

# STUDENT'S WORKING
${studentWork}

# YOUR TASK
Mark this student's work step-by-step against the mark scheme. For EACH line/step in their working:

1. Identify what they did
2. Check against mark scheme requirements
3. Award marks if correct (state which marks from scheme)
4. Identify errors if incorrect (explain precisely what's wrong)
5. Note missing steps that should have been there

Then, from the FIRST ERROR onwards, show the correct solution in GREEN (marked as corrected_continuation).

Respond with JSON:
{
  "marks_awarded": <number>,
  "marks_available": <number>,
  "overall_feedback": "<brief summary>",
  "step_by_step_feedback": [
    {
      "step_number": <number>,
      "student_work": "<their working for this step>",
      "mark_scheme_requirement": "<what mark scheme says for this mark>",
      "status": "correct" | "incorrect" | "partially_correct" | "missing",
      "marks_awarded": <number>,
      "marks_available": <number>,
      "feedback": "<detailed explanation>",
      "error_type": "<if incorrect: calculation_error|method_error|conceptual_error|missing_step>"
    }
  ],
  "first_error_at_step": <number or null>,
  "corrected_continuation": {
    "from_step": <number>,
    "explanation": "<why we're correcting from here>",
    "steps": [
      {
        "step": <number>,
        "title": "<step title>",
        "explanation": "<why we do this>",
        "working": "<mathematical working>",
        "formula": "<result>"
      }
    ]
  },
  "exam_technique_advice": "<specific advice for this type of question>"
}
`
        }
      ],
      temperature: 0.2, // Low temperature for consistent marking
      response_format: { type: "json_object" }
    });

    const marking = JSON.parse(response.choices[0].message.content);
    
    console.log('✅ Marking completed');
    console.log(`📊 Score: ${marking.marks_awarded}/${marking.marks_available}`);

    return marking;

  } catch (error) {
    console.error('❌ AI marking failed:', error);
    throw error;
  }
}

/**
 * Generate a mark scheme for a question (if official one not available)
 */
export async function generateMarkScheme(questionText, topic, difficulty) {
  try {
    console.log('📋 Generating mark scheme...');

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an A-Level exam board officer creating official mark schemes.

Create a detailed, official-style mark scheme that:
- Breaks down into method marks (M) and accuracy marks (A)
- Specifies exactly what students must show for each mark
- Includes alternative methods where valid
- Uses standard mark scheme notation (M1, A1, etc.)

Mark scheme should be strict but fair, following A-Level standards.`
        },
        {
          role: "user",
          content: `
Question: ${questionText}
Topic: ${topic}
Difficulty: ${difficulty}

Create an official A-Level mark scheme for this question. Include:
1. Total marks available
2. Breakdown of method marks and accuracy marks
3. Specific requirements for each mark
4. Common alternative methods accepted
5. Common errors to watch for

Format as a structured mark scheme.`
        }
      ],
      temperature: 0.3
    });

    const markScheme = response.choices[0].message.content;
    
    console.log('✅ Mark scheme generated');
    return markScheme;

  } catch (error) {
    console.error('❌ Mark scheme generation failed:', error);
    throw error;
  }
}

/**
 * Get mark scheme from database or generate if not available
 */
export async function getOrGenerateMarkScheme(questionId, questionText, topic, difficulty, supabase) {
  try {
    // First, try to get from database
    const { data: existingScheme, error } = await supabase
      .from('mark_schemes')
      .select('*')
      .eq('question_id', questionId)
      .single();

    if (existingScheme && !error) {
      console.log('✅ Using existing mark scheme from database');
      return existingScheme.content;
    }

    // Generate new mark scheme
    console.log('📝 No mark scheme found, generating...');
    const markScheme = await generateMarkScheme(questionText, topic, difficulty);

    // Save to database for future use
    const { error: insertError } = await supabase
      .from('mark_schemes')
      .insert([{
        question_id: questionId,
        content: markScheme,
        topic: topic,
        difficulty: difficulty
      }]);

    if (insertError) {
      console.warn('⚠️ Could not save mark scheme to database:', insertError);
    }

    return markScheme;

  } catch (error) {
    console.error('❌ Error getting/generating mark scheme:', error);
    // Return a basic fallback mark scheme
    return `Mark Scheme for ${topic} question:
- Method marks: Show clear working
- Accuracy marks: Correct final answer
- Communication marks: Proper mathematical notation`;
  }
}

/**
 * Compare two solutions and highlight differences
 */
export async function compareSolutions(studentSolution, correctSolution, questionText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are comparing a student's solution with the correct solution. Identify differences and explain where and why the student's approach differs."
        },
        {
          role: "user",
          content: `
Question: ${questionText}

Student's Solution:
${studentSolution}

Correct Solution:
${correctSolution}

Compare these solutions and identify:
1. Where they diverge
2. Whether student's alternative method is valid
3. Any calculation or logical errors
4. What marks would be awarded vs lost

Respond with JSON:
{
  "divergence_point": "<where solutions differ>",
  "student_method_valid": true/false,
  "errors": ["error 1", "error 2"],
  "marks_analysis": "<mark-by-mark comparison>"
}
`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (error) {
    console.error('❌ Solution comparison failed:', error);
    throw error;
  }
}

/**
 * Provide targeted feedback based on error type
 */
export function getTargetedFeedback(errorType, topic) {
  const feedbackMap = {
    'calculation_error': {
      message: 'Check your arithmetic carefully. It helps to verify calculations by substituting back.',
      resources: ['Practice mental math', 'Use calculator for complex calculations']
    },
    'method_error': {
      message: 'The method used is not appropriate for this problem type. Review the correct approach.',
      resources: [`Study ${topic} methods`, 'Review worked examples']
    },
    'conceptual_error': {
      message: 'There\'s a misunderstanding of the underlying concept. Review the theory.',
      resources: [`Revise ${topic} fundamentals`, 'Watch tutorial videos']
    },
    'missing_step': {
      message: 'You\'ve skipped a necessary step. In exams, showing all working is crucial for method marks.',
      resources: ['Practice showing full working', 'Review mark scheme requirements']
    },
    'sign_error': {
      message: 'Watch your signs (+ and -). This is a common error that loses marks.',
      resources: ['Double-check signs at each step', 'Use brackets to avoid confusion']
    },
    'notation_error': {
      message: 'Use correct mathematical notation. Clear notation prevents mistakes and gains marks.',
      resources: ['Review proper notation', 'Study mark scheme examples']
    }
  };

  return feedbackMap[errorType] || {
    message: 'Review this step carefully and compare with the mark scheme.',
    resources: [`Study ${topic} carefully`]
  };
}