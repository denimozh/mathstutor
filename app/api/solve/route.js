import { createClient } from '@/utils/supabase/server'; // your server-side Supabase client

export async function POST(request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get('image');
    const topic = formData.get('topic');
    const struggled = formData.get('struggled') === 'true';

    const supabase = createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
    const userId = user.id;

    const timestamp = Date.now();
    const fileName = `${timestamp}-${imageFile.name}`;
    const filePath = `${userId}/${fileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('questions-images')
      .upload(filePath, imageFile);

    if (storageError) {
      throw new Error(storageError.message);
    }

    const { publicUrl } = supabase.storage.from('questions-images').getPublicUrl(filePath);

    const { data: questionData, error: dbError } = await supabase
      .from('questions')
      .insert([
        {
          user_id: userId,
          topic: topic,
          struggled: struggled,
          image_url: publicUrl,
        },
      ])
      .select(); // return the inserted row

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
