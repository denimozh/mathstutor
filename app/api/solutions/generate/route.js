import { createClient } from "@/utils/supabase/server.js";
import { generateSolution } from "@/utils/ai";

export async function POST(request) {
  try {
    const { questionId, extractedText, topic } = await request.json();
    
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Generate AI solution
    const aiResult = await generateSolution(extractedText, topic);

    // Save solution to database
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        ai_solution: aiResult.solution,
        ai_confidence: aiResult.confidence
      })
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return Response.json({
      success: true,
      solution: aiResult.solution,
      confidence: aiResult.confidence
    });

  } catch (error) {
    console.error('Solution generation error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}