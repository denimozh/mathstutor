// app/api/solve/route.js
import { createClient } from "@/utils/supabase/server.js";
import { extractTextFromImage } from "@/utils/ocr-google-vision";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const questionImage = formData.get('questionImage');
    const markSchemeImage = formData.get('markSchemeImage'); // NEW
    const studentWorkImage = formData.get('studentWorkImage'); // NEW
    const topic = formData.get('topic');
    const manualQuestionText = formData.get('manualQuestionText');
    const manualMarkSchemeText = formData.get('manualMarkSchemeText'); // NEW
    const manualStudentWorkText = formData.get('manualStudentWorkText'); // NEW

    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message || 'User not authenticated');
    const userId = user.id;

    console.log('📤 Processing question with mark scheme comparison for user:', userId);

    // 1️⃣ Upload question image
    let questionUrl = null;
    if (questionImage) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-question-${questionImage.name}`;
      const filePath = `${userId}/questions/${fileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('questions-images')
        .upload(filePath, questionImage);
      
      if (storageError) throw new Error(storageError.message);
      
      const { data: { publicUrl } } = supabase.storage
        .from('questions-images')
        .getPublicUrl(filePath);
      
      questionUrl = publicUrl;
      console.log('✅ Question image uploaded:', questionUrl);
    }

    // 2️⃣ Upload mark scheme image (if provided)
    let markSchemeUrl = null;
    if (markSchemeImage) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-markscheme-${markSchemeImage.name}`;
      const filePath = `${userId}/markschemes/${fileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('questions-images')
        .upload(filePath, markSchemeImage);
      
      if (storageError) throw new Error(storageError.message);
      
      const { data: { publicUrl } } = supabase.storage
        .from('questions-images')
        .getPublicUrl(filePath);
      
      markSchemeUrl = publicUrl;
      console.log('✅ Mark scheme image uploaded:', markSchemeUrl);
    }

    // 3️⃣ Upload student work image (if provided)
    let studentWorkUrl = null;
    if (studentWorkImage) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-studentwork-${studentWorkImage.name}`;
      const filePath = `${userId}/studentwork/${fileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('questions-images')
        .upload(filePath, studentWorkImage);
      
      if (storageError) throw new Error(storageError.message);
      
      const { data: { publicUrl } } = supabase.storage
        .from('questions-images')
        .getPublicUrl(filePath);
      
      studentWorkUrl = publicUrl;
      console.log('✅ Student work image uploaded:', studentWorkUrl);
    }

    // 4️⃣ Extract text from question (if not manually provided)
    let questionText;
    let questionOcrConfidence = 1.0;

    if (manualQuestionText) {
      questionText = manualQuestionText;
      console.log('📝 Using manually edited question text');
    } else if (questionImage) {
      console.log('🔍 Running OCR on question...');
      const ocrResult = await extractTextFromImage(questionImage);
      questionText = ocrResult.text;
      questionOcrConfidence = ocrResult.confidence;
      console.log('✅ Question OCR completed:', questionOcrConfidence);
    }

    // 5️⃣ Extract text from mark scheme (if provided)
    let markSchemeText = manualMarkSchemeText || '';
    let markSchemeOcrConfidence = 1.0;

    if (!manualMarkSchemeText && markSchemeImage) {
      console.log('🔍 Running OCR on mark scheme...');
      const ocrResult = await extractTextFromImage(markSchemeImage);
      markSchemeText = ocrResult.text;
      markSchemeOcrConfidence = ocrResult.confidence;
      console.log('✅ Mark scheme OCR completed:', markSchemeOcrConfidence);
    }

    // 6️⃣ Extract text from student work (if provided)
    let studentWorkText = manualStudentWorkText || '';
    let studentWorkOcrConfidence = 1.0;

    if (!manualStudentWorkText && studentWorkImage) {
      console.log('🔍 Running OCR on student work...');
      const ocrResult = await extractTextFromImage(studentWorkImage);
      studentWorkText = ocrResult.text;
      studentWorkOcrConfidence = ocrResult.confidence;
      console.log('✅ Student work OCR completed:', studentWorkOcrConfidence);
    }

    // Check if verification needed (always verify if any confidence is low)
    const needsVerification = 
      (questionOcrConfidence < 0.7 && !manualQuestionText) || 
      (markSchemeImage && markSchemeOcrConfidence < 0.7 && !manualMarkSchemeText) ||
      (studentWorkImage && studentWorkOcrConfidence < 0.7 && !manualStudentWorkText);

    // Also offer verification even for good OCR if user uploaded multiple images
    const shouldOfferVerification = 
      needsVerification || 
      (markSchemeImage && studentWorkImage && !manualQuestionText);

    if (shouldOfferVerification) {
      return Response.json({
        success: true,
        needsVerification: true,
        extractedQuestionText: questionText,
        extractedMarkSchemeText: markSchemeText,
        extractedStudentWorkText: studentWorkText,
        questionOcrConfidence: questionOcrConfidence,
        markSchemeOcrConfidence: markSchemeOcrConfidence,
        studentWorkOcrConfidence: studentWorkOcrConfidence,
        questionUrl: questionUrl,
        markSchemeUrl: markSchemeUrl,
        studentWorkUrl: studentWorkUrl,
        topic: topic,
        message: needsVerification 
          ? "Low confidence detected - please verify the extracted text" 
          : "Please verify the extracted text before analysis"
      });
    }

    // 7️⃣ Insert question into database with all data
    console.log('💾 Saving question to database...');
    
    const { data: questionData, error: dbError } = await supabase
      .from('questions')
      .insert([{
        user_id: userId,
        text: questionText,
        topic: topic,
        struggled: false,
        image_url: questionUrl,
        mark_scheme_url: markSchemeUrl,
        student_work_url: studentWorkUrl,
        mark_scheme_text: markSchemeText,
        student_work_text: studentWorkText,
        ai_confidence: Math.min(questionOcrConfidence, markSchemeOcrConfidence, studentWorkOcrConfidence)
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(dbError.message);
    }

    const questionId = questionData.id;
    console.log('✅ Question saved with ID:', questionId);

    // Return question ID to navigate to results
    return Response.json({
      success: true,
      needsVerification: false,
      questionId: questionId,
      hasMarkScheme: !!markSchemeText,
      hasStudentWork: !!studentWorkText,
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