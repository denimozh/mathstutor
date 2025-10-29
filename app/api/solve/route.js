import { createClient } from "@/utils/supabase/server.js";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get('image');
    const topic = formData.get('topic');
    const struggled = formData.get('struggled') === 'true';

    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
    const userId = user.id;

    console.log('📤 Uploading for user:', userId);

    // Upload image to storage
    const timestamp = Date.now();
    const fileName = `${timestamp}-${imageFile.name}`;
    const filePath = `${userId}/${fileName}`;
    
    const { data: storageData, error: storageError } = await supabase.storage
      .from('questions-images')
      .upload(filePath, imageFile);
    
    if (storageError) {
      console.log('❌ Storage error:', storageError);
      throw new Error(storageError.message);
    }
    
    console.log('✅ Image uploaded:', filePath);
    
    const { data: { publicUrl } } = supabase.storage
      .from('questions-images')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL:', publicUrl);
    console.log('📝 Calling insert_question with:', {
      p_user_id: userId,
      p_text: null,
      p_topic: topic,
      p_struggled: struggled,
      p_image_url: publicUrl
    });

    // Insert question using RPC function
    const { data: questionData, error: dbError } = await supabase
      .rpc('insert_question', {
        p_user_id: userId,
        p_text: null,
        p_topic: topic,
        p_struggled: struggled,
        p_image_url: publicUrl
      });

    console.log('📊 RPC Response:', questionData);
    console.log('❌ RPC Error:', dbError);

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw new Error(dbError.message);
    }

    if (!questionData || questionData.length === 0) {
      throw new Error('Question was not created - no data returned');
    }

    const questionId = questionData[0].id;
    console.log('✅ Question created with ID:', questionId);

    // Verify the question was actually inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', questionId);

    console.log('🔍 Verification check:', verifyData);

    return Response.json({
      success: true,
      question: questionData[0],
      questionId: questionId,
      message: "Question uploaded successfully"
    });
  } catch (error) {
    console.error('❌ Solve route error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}