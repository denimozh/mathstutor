// app/api/solve/route.js
// REPLACE EXISTING FILE - Now uses Mathpix OCR

import { createClient } from "@/utils/supabase/server.js";
import { extractTextFromImage } from "@/utils/ocr-mathpix"; // Changed from google-vision

export async function POST(request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get('image');
    const topic = formData.get('topic');
    const struggled = formData.get('struggled') === 'true';
    const manualText = formData.get('manualText'); // Optional: user-edited text
    const manualLatex = formData.get('manualLatex'); // Optional: user-edited LaTeX

    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
    const userId = user.id;

    console.log('📤 Processing question for user:', userId);

    // 1️⃣ Upload image to storage
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

    // 2️⃣ Extract text using Mathpix OCR (unless manually provided)
    let extractedText;
    let extractedLatex;
    let structuredSteps;
    let ocrConfidence = 1.0;

    if (manualText && manualLatex) {
      // User edited the text - use their version
      extractedText = manualText;
      extractedLatex = manualLatex;
      console.log('📝 Using manually edited text and LaTeX');
    } else {
      // Run Mathpix OCR
      console.log('🔍 Running OCR with Mathpix...');
      const ocrResult = await extractTextFromImage(imageFile);
      extractedText = ocrResult.text;
      extractedLatex = ocrResult.latex;
      structuredSteps = ocrResult.structuredSteps;
      ocrConfidence = ocrResult.confidence;
      
      console.log('✅ OCR completed');
      console.log('📝 Extracted text:', extractedText);
      console.log('📐 Extracted LaTeX:', extractedLatex);
      console.log('📊 OCR Confidence:', ocrConfidence);
    }

    // If OCR confidence is low or text is empty, we'll need user to verify
    const needsVerification = ocrConfidence < 0.7 || !extractedText.trim();

    if (needsVerification && !manualText) {
      // Return extracted text for user to verify/edit
      return Response.json({
        success: true,
        needsVerification: true,
        extractedText: extractedText,
        extractedLatex: extractedLatex,
        structuredSteps: structuredSteps,
        ocrConfidence: ocrConfidence,
        imageUrl: publicUrl,
        message: "Please verify the extracted text"
      });
    }

    // 3️⃣ Insert question into database
    console.log('💾 Saving question to database...');
    
    const { data: questionData, error: dbError } = await supabase
      .rpc('insert_question', {
        p_user_id: userId,
        p_text: extractedText,
        p_topic: topic,
        p_struggled: struggled,
        p_image_url: publicUrl
      });

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(dbError.message);
    }

    const questionId = questionData[0].id;
    console.log('✅ Question saved with ID:', questionId);

    // 4️⃣ Update with OCR data
    await supabase
      .from('questions')
      .update({
        ai_confidence: ocrConfidence,
        latex_content: extractedLatex,
        structured_steps: structuredSteps
      })
      .eq('id', questionId);

    // Return question ID to navigate to results
    return Response.json({
      success: true,
      needsVerification: false,
      questionId: questionId,
      extractedText: extractedText,
      extractedLatex: extractedLatex,
      structuredSteps: structuredSteps,
      ocrConfidence: ocrConfidence,
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