import sharp from 'sharp';

export async function extractTextFromImage(imageFile) {
  try {
    console.log('🔍 Starting OCR with Google Vision...');
    
    // Convert image file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Preprocess image
    console.log('🎨 Preprocessing image...');
    const enhancedBuffer = await preprocessImage(buffer);
    const base64Image = enhancedBuffer.toString('base64');
    console.log('✅ Image preprocessed');

    // Call Google Vision API
    console.log('🌐 Calling Google Vision API...');
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log('📡 Google Vision response:', JSON.stringify(data, null, 2));

    // Check for API errors
    if (data.responses && data.responses[0].error) {
      throw new Error(`Google Vision API error: ${data.responses[0].error.message}`);
    }

    // Check if text was detected
    if (data.responses && data.responses[0].textAnnotations && data.responses[0].textAnnotations.length > 0) {
      const text = data.responses[0].textAnnotations[0].description;
      const confidence = 0.85; // Google Vision doesn't always provide confidence scores

      console.log('✅ OCR completed');
      console.log('📝 Extracted text:', text);
      console.log('📊 Confidence:', confidence);

      // Clean up the text
      const cleanedText = text.trim().replace(/\s+/g, ' ');

      return {
        text: cleanedText,
        latex: null,
        confidence: confidence,
        raw: text,
      };
    } else {
      // No text detected - return low confidence so user can verify
      console.log('⚠️ No text detected in image');
      return {
        text: '',
        latex: null,
        confidence: 0.3, // Low confidence triggers verification UI
        raw: '',
      };
    }
  } catch (error) {
    console.error('❌ OCR extraction failed:', error);
    console.error('Error details:', error.message);
    
    // Return empty text with low confidence instead of throwing
    return {
      text: '',
      latex: null,
      confidence: 0.1,
      raw: '',
      error: error.message
    };
  }
}

// Preprocess image for better OCR accuracy
async function preprocessImage(buffer) {
  try {
    const enhancedBuffer = await sharp(buffer)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .grayscale()
      .normalize()
      .sharpen()
      .modulate({
        brightness: 1.1,
      })
      .png()
      .toBuffer();

    return enhancedBuffer;
  } catch (error) {
    console.error('⚠️ Image preprocessing failed, using original:', error);
    return buffer;
  }
}