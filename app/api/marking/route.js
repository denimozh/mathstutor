// app/api/marking/route.js
// NEW FILE - Mark student work against mark schemes

import { createClient } from "@/utils/supabase/server.js";
import { markStudentWork, getOrGenerateMarkScheme } from "@/utils/ai-marking";

export async function POST(request) {
  try {
    const { questionId, studentWork } = await request.json();

    if (!questionId || !studentWork) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    console.log('📝 Starting marking for question:', questionId);

    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .single();

    if (questionError || !question) {
      throw new Error('Question not found');
    }

    console.log('📚 Question topic:', question.topic);

    // Get or generate mark scheme
    const markScheme = await getOrGenerateMarkScheme(
      questionId,
      question.text,
      question.topic,
      question.difficulty || 'medium',
      supabase
    );

    console.log('✅ Mark scheme obtained');

    // Mark the student's work
    const marking = await markStudentWork(
      studentWork,
      markScheme,
      question.text,
      question.topic
    );

    console.log('✅ Marking completed');
    console.log(`📊 Score: ${marking.marks_awarded}/${marking.marks_available}`);

    // Save marking to database
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        marking_result: marking,
        marks_awarded: marking.marks_awarded,
        marks_available: marking.marks_available,
        is_correct: marking.marks_awarded === marking.marks_available,
        marked_at: new Date().toISOString()
      })
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.warn('⚠️ Could not save marking to database:', updateError);
    }

    return Response.json({
      success: true,
      marking: marking
    });

  } catch (error) {
    console.error('❌ Marking error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Get existing marking for a question
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return Response.json(
        { success: false, message: 'Question ID required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data: question, error } = await supabase
      .from('questions')
      .select('marking_result, marks_awarded, marks_available')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return Response.json({
      success: true,
      marking: question.marking_result,
      marks_awarded: question.marks_awarded,
      marks_available: question.marks_available
    });

  } catch (error) {
    console.error('❌ Get marking error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}