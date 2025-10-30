import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateSolution(questionText, topic) {
  try {
    console.log('🤖 Generating AI solution...');
    
    const prompt = `You are an expert A-Level Mathematics tutor. A student needs help with this question:

**Question:** ${questionText}
**Topic:** ${topic}

Provide a comprehensive solution with:
1. Step-by-step breakdown with clear explanations
2. Mathematical formulas or expressions for each step
3. The final answer
4. Helpful hints for similar problems
5. Common mistakes to avoid

Format your response as JSON with this exact structure:
{
  "steps": [
    {
      "step": 1,
      "title": "Clear step title",
      "explanation": "Detailed explanation of what we're doing and why",
      "formula": "Mathematical formula or expression used"
    }
  ],
  "final_answer": "The complete final answer",
  "hints": [
    "Helpful tip 1",
    "Helpful tip 2",
    "Helpful tip 3"
  ],
  "confidence": 0.95
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper and faster than gpt-4
      messages: [
        {
          role: "system",
          content: "You are an expert A-Level mathematics teacher who provides clear, accurate, step-by-step solutions. Always format responses as valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower = more consistent
      response_format: { type: "json_object" }
    });

    const solutionText = completion.choices[0].message.content;
    console.log('📝 AI Response:', solutionText);
    
    const solution = JSON.parse(solutionText);

    console.log('✅ AI solution generated successfully');

    return {
      solution: solution,
      confidence: solution.confidence || 0.85,
      model: "gpt-4o-mini"
    };

  } catch (error) {
    console.error('❌ AI solution generation failed:', error);
    
    // Return fallback solution if AI fails
    return {
      solution: {
        steps: [
          {
            step: 1,
            title: "AI Processing Error",
            explanation: "We encountered an error generating the solution. Please try again or contact support.",
            formula: ""
          }
        ],
        final_answer: "Solution generation failed",
        hints: ["Please try uploading a clearer image", "Make sure the question text is readable"],
        confidence: 0.0
      },
      confidence: 0.0,
      error: error.message
    };
  }
}

// Validate if the solution makes sense
export function validateSolution(solution) {
  if (!solution.steps || solution.steps.length === 0) {
    return false;
  }
  if (!solution.final_answer) {
    return false;
  }
  return true;
}