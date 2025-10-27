import { createClient } from '@/utils/supabase/server.js'; // your server-side Supabase client

export async function GET(request) {
    try {
        const supabase = createClient();
        const { data, error } = (await supabase).from('worksheets').select('*');
        if (error) throw error;
        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
  try {
    const supabase = createClient();

    // 1️⃣ Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
    const userId = user.id;

    // 2️⃣ Parse request body
    const { topics = [], number_of_questions = 5 } = await request.json();

    // 3️⃣ Fetch question IDs that are already used in worksheets
    const { data: usedQuestionsData, error: usedError } = await supabase
      .from('worksheet_questions')
      .select('question_id');

    if (usedError) throw new Error(usedError.message);

    const usedQuestionIds = usedQuestionsData.map(q => q.question_id);

    // 4️⃣ Fetch available questions for the user that have NOT been used
    let query = supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId);

    if (usedQuestionIds.length > 0) query = query.not('id', 'in', `(${usedQuestionIds.join(',')})`);
    if (topics.length > 0) query = query.in('topic', topics);

    const { data: availableQuestions, error: fetchError } = await query;
    if (fetchError) throw new Error(fetchError.message);

    if (!availableQuestions || availableQuestions.length === 0) {
      return Response.json({ success: false, message: 'No unused questions available.' });
    }

    // 5️⃣ Shuffle and select the requested number of questions
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, number_of_questions);

    // 6️⃣ Insert new worksheet
    const { data: worksheetData, error: worksheetError } = await supabase
      .from('worksheets')
      .insert([{ user_id: userId }])
      .select();
    if (worksheetError) throw new Error(worksheetError.message);

    const worksheetId = worksheetData[0].id;

    // handle AI questions here
    // 7️⃣ Link selected questions to the worksheet
    const worksheetQuestions = selectedQuestions.map(q => ({
      worksheet_id: worksheetId,
      question_id: q.id,
    }));

    const { error: wqError } = await supabase
      .from('worksheet_questions')
      .insert(worksheetQuestions);
    if (wqError) throw new Error(wqError.message);

    // 8️⃣ Return the worksheet with question objects
    return Response.json({
      success: true,
      worksheet: {
        id: worksheetId,
        questions: selectedQuestions,
      },
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
