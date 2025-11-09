import { createClient } from "@/utils/supabase/server.js";
import { extractTextFromImage } from "@/utils/ocr-mathpix"; // ← Changed import

export async function POST(request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get('image');
    const topic = formData.get('topic');
    const manualText = formData.get('manualText');

    if (!imageFile) {
      return Response.json(
        { success: false, message: 'No image provided' },
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
    
    const userId = user.id;
    console.log('📤 Processing question for user:', userId);

    // 1️⃣ Upload image
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
    
    const { data: { publicUrl } } = supabase.storage
      .from('questions-images')
      .getPublicUrl(filePath);

    console.log('✅ Image uploaded:', publicUrl);

    // 2️⃣ Extract text using Mathpix OCR
    let extractedText;
    let ocrConfidence = 1.0;

    if (manualText) {
      extractedText = manualText;
      console.log('📝 Using manually edited text');
    } else {
      console.log('🔍 Running Mathpix OCR...');
      const ocrResult = await extractTextFromImage(imageFile);
      
      // Use the cleaned LaTeX from Mathpix
      extractedText = ocrResult.latex || ocrResult.text;
      ocrConfidence = ocrResult.confidence;
      
      console.log('✅ OCR completed');
      console.log('📝 Extracted LaTeX:', extractedText);
      console.log('📊 OCR Confidence:', ocrConfidence);
    }

    const needsVerification = ocrConfidence < 0.7 || !extractedText.trim();

    if (needsVerification && !manualText) {
      return Response.json({
        success: true,
        needsVerification: true,
        extractedText: extractedText,
        ocrConfidence: ocrConfidence,
        imageUrl: publicUrl,
        message: "Please verify the extracted text"
      });
    }

    // 3️⃣ Insert question
    console.log('💾 Saving question to database...');
    
    const { data: questionData, error: dbError } = await supabase
      .rpc('insert_question', {
        p_user_id: userId,
        p_text: extractedText,
        p_topic: topic,
        p_struggled: false,
        p_image_url: publicUrl
      });

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(dbError.message);
    }

    const questionId = questionData[0].id;
    console.log('✅ Question saved with ID:', questionId);

    // 4️⃣ Update confidence
    await supabase
      .from('questions')
      .update({ ai_confidence: ocrConfidence })
      .eq('id', questionId);

    return Response.json({
      success: true,
      needsVerification: false,
      questionId: questionId,
      extractedText: extractedText,
      ocrConfidence: ocrConfidence,
      message: "Question uploaded successfully"
    });

  } catch (error) {
    console.error('❌ Solve route error:', error);
    
    // Proper JSON error
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to process question',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}