import { createClient } from '@/utils/supabase/server.js'; // your server-side Supabase client

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
        
        // Use RPC function
        const { data, error } = await supabase.rpc('get_user_worksheets', {
            p_user_id: user.id
        });
        
        if (error) throw error;
        
        return Response.json({ 
            success: true, 
            data: data || [] 
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }
    const userId = user.id;

    console.log('🔑 Authenticated user ID:', userId);
    console.log('📧 User email:', user.email);

    const { 
      topics = [], 
      number_of_questions = 5,
      difficulty = "Silver",
      title = "",
      generate_with_ai = false 
    } = await request.json();

    console.log('Creating worksheet for user:', userId);
    console.log('Requested topics:', topics);
    console.log('Number of questions:', number_of_questions);

    if (generate_with_ai) {
      return Response.json({ 
        success: false, 
        message: 'AI generation coming soon! For now, use existing questions.' 
      }, { status: 501 });
    }
    
    console.log('🔍 About to query questions table...');
    console.log('User ID for query:', userId);
    console.log('Topics for query:', topics);

    // First, let's see ALL questions for this user
    const { data: allQuestions, error: allError } = await supabase
      .from('questions')
      .select('id, topic, text, user_id')
      .eq('user_id', userId);

    console.log('All user questions:', allQuestions);
    console.log('Total questions found:', allQuestions?.length || 0);

    console.log('📊 Raw query result:', allQuestions);
    console.log('❌ Query error:', allError);

    if (allError) {
      console.error('Error fetching all questions:', allError);
      throw new Error(allError.message);
    }

    const { data: availableQuestions, error: fetchError } = await supabase
    .rpc('get_user_questions_by_topics', {
      p_user_id: userId,
      p_topics: topics.length > 0 ? topics : null
    });
    
    console.log('Filtered questions:', availableQuestions);
    console.log('Filtered count:', availableQuestions?.length || 0);

    if (fetchError) {
      console.error('Error fetching filtered questions:', fetchError);
      throw new Error(fetchError.message);
    }

    if (!availableQuestions || availableQuestions.length === 0) {
      // Show what topics actually exist
      const uniqueTopics = [...new Set(allQuestions?.map(q => q.topic) || [])];
      console.log('Available topics in DB:', uniqueTopics);
      
      return Response.json({ 
        success: false, 
        message: `No questions found for topics: ${topics.join(', ')}. Available topics: ${uniqueTopics.join(', ')}` 
      }, { status: 400 });
    }

    // Rest of your code...
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, number_of_questions);

    const worksheetTitle = title || 
      (topics.length > 0 
        ? `${topics.join(", ")} Practice` 
        : "Mixed Topics Practice");

    const { data: worksheetData, error: worksheetError } = await supabase
      .from('worksheets')
      .insert([{ 
        user_id: userId,
        title: worksheetTitle,
        difficulty: difficulty,
        question_ids: selectedQuestions.map(q => q.id)
      }])
      .select();
    
    if (worksheetError) throw new Error(worksheetError.message);

    const worksheetId = worksheetData[0].id;

    const worksheetQuestions = selectedQuestions.map(q => ({
      worksheet_id: worksheetId,
      question_id: q.id,
    }));

    const { error: wqError } = await supabase
      .from('worksheet_questions')
      .insert(worksheetQuestions);
    
    if (wqError) throw new Error(wqError.message);

    return Response.json({
      success: true,
      message: `Worksheet created with ${selectedQuestions.length} questions!`,
      worksheet: {
        ...worksheetData[0],
        questions: selectedQuestions,
      },
    });

  } catch (error) {
    console.error('Error creating worksheet:', error);
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}