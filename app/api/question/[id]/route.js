import { createClient } from "@/utils/supabase/server.js";

// GET - Fetch a specific question by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');

    // Use RPC function to get the question
    const { data, error } = await supabase.rpc('get_question', {
      p_question_id: id
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return Response.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    // Verify the question belongs to the authenticated user
    if (data[0].user_id !== user.id) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    return Response.json({ success: true, data: data[0] });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a question (mainly for struggled flag)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { struggled, topic } = body;

    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');

    // First verify the question belongs to the user
    const { data: questionData, error: fetchError } = await supabase.rpc('get_question', {
      p_question_id: id
    });

    if (fetchError) throw fetchError;

    if (!questionData || questionData.length === 0) {
      return Response.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    if (questionData[0].user_id !== user.id) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the question using RPC function
    const { data, error } = await supabase.rpc('update_question', {
      p_question_id: id,
      p_struggled: struggled !== undefined ? struggled : null,
      p_topic: topic !== undefined ? topic : null
    });

    if (error) throw error;

    return Response.json({ success: true, data: data[0] });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a question
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');

    // First verify the question belongs to the user
    const { data: questionData, error: fetchError } = await supabase.rpc('get_question', {
      p_question_id: id
    });

    if (fetchError) throw fetchError;

    if (!questionData || questionData.length === 0) {
      return Response.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    if (questionData[0].user_id !== user.id) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the question using RPC function
    const { data, error } = await supabase.rpc('delete_question', {
      p_question_id: id
    });

    if (error) throw error;

    return Response.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}