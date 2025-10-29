import { createClient } from "@/utils/supabase/server.js";

// GET - Fetch a specific worksheet with its questions
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the worksheet
    const { data: worksheetData, error: worksheetError } = await supabase
      .from('worksheets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (worksheetError) throw worksheetError;

    if (!worksheetData) {
      return Response.json(
        { success: false, message: 'Worksheet not found' },
        { status: 404 }
      );
    }

    // Get all questions associated with this worksheet
    const { data: worksheetQuestions, error: wqError } = await supabase
      .from('worksheet_questions')
      .select(`
        question_id,
        questions (*)
      `)
      .eq('worksheet_id', id);

    if (wqError) throw wqError;

    // Extract the actual question objects
    const questions = worksheetQuestions?.map(wq => wq.questions) || [];

    return Response.json({
      success: true,
      data: {
        ...worksheetData,
        questions
      }
    });
  } catch (error) {
    console.error('GET worksheet error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}