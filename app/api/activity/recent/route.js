import { createClient } from "@/utils/supabase/server.js";

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get recent questions as activities
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, topic, created_at, is_correct, time_spent_seconds')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (questionsError) throw questionsError;

    // Get recent worksheets as activities
    const { data: worksheets, error: worksheetsError } = await supabase
      .from('worksheets')
      .select('id, title, created_at, difficulty')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (worksheetsError) throw worksheetsError;

    // Transform questions into activity format
    const questionActivities = questions.map(q => ({
      id: `q-${q.id}`,
      activity_type: 'question_solved',
      topic: q.topic,
      result: q.is_correct === true ? 'correct' : 
              q.is_correct === false ? 'incorrect' : 
              'completed',
      duration_seconds: q.time_spent_seconds,
      created_at: q.created_at
    }));

    // Transform worksheets into activity format
    const worksheetActivities = worksheets.map(w => ({
      id: `w-${w.id}`,
      activity_type: 'worksheet_generated',
      topic: w.title || w.difficulty || 'Custom',
      result: 'completed',
      duration_seconds: null,
      created_at: w.created_at
    }));

    // Combine and sort by date
    const allActivities = [...questionActivities, ...worksheetActivities]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10); // Keep only the 10 most recent

    return Response.json({
      success: true,
      data: allActivities
    });

  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}