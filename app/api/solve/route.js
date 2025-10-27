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

    // ✅ Uncommented storage upload
    const timestamp = Date.now();
    const fileName = `${timestamp}-${imageFile.name}`;
    const filePath = `${userId}/${fileName}`;
    
    const { data: storageData, error: storageError } = await supabase.storage
      .from('questions-images')
      .upload(filePath, imageFile);
    
    if (storageError) {
      console.log('Storage error:', storageError);
      throw new Error(storageError.message);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('questions-images')
      .getPublicUrl(filePath);

    // ✅ Use RPC function with image_url
    const { data: questionData, error: dbError } = await supabase
      .rpc('insert_question', {
        p_user_id: userId,
        p_text: null,
        p_topic: topic,
        p_struggled: struggled,
        p_image_url: publicUrl
      });

    if (dbError) throw new Error(dbError.message);

    return Response.json({
      success: true,
      question: questionData[0],
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}