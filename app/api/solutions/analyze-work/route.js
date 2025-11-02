// app/api/solutions/analyze-work/route.js
import { createClient } from "@/utils/supabase/server.js";
import { analyzeStudentWork, validateAnalysis } from "@/utils/ai-work-analysis";

export async function POST(request) {
  try {
    const { questionId } = await request.json();
    
    if (!questionId) {
      return Response.json(
        { success: false, error: 'Question ID required' },
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

    console.log('🔍 Analyzing work for question:', questionId);

    // Get question with mark scheme and student work
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    if (!question) {
      return Response.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if we have mark scheme and student work
    if (!question.mark_scheme_text || !question.student_work_text) {
      return Response.json(
        { 
          success: false, 
          message: 'Both mark scheme and student work are required for analysis' 
        },
        { status: 400 }
      );
    }

    // Run AI analysis
    const result = await analyzeStudentWork(
      question.text,
      question.mark_scheme_text,
      question.student_work_text
    );

    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    const analysis = result.analysis;

    // Validate analysis structure
    if (!validateAnalysis(analysis)) {
      console.error('❌ Invalid analysis structure');
      throw new Error('Generated analysis is invalid');
    }

    // Update question with analysis
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        work_analysis: analysis,
        is_correct: analysis.marks_awarded === analysis.total_marks
      })
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    console.log('✅ Work analysis saved successfully');

    return Response.json({
      success: true,
      analysis: analysis,
      marks: {
        awarded: analysis.marks_awarded,
        total: analysis.total_marks,
        percentage: Math.round((analysis.marks_awarded / analysis.total_marks) * 100)
      }
    });

  } catch (error) {
    console.error('❌ Error in work analysis endpoint:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to analyze work',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve existing analysis
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

    const { data, error } = await supabase
      .from('questions')
      .select('work_analysis, marks_awarded, total_marks')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return Response.json({
      success: true,
      analysis: data.work_analysis,
      hasAnalysis: !!data.work_analysis
    });

  } catch (error) {
    console.error('❌ Get work analysis error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}