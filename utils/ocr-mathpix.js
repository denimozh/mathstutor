// utils/ocr-mathpix.js
// REPLACE utils/ocr-google-vision.js with this file

import sharp from 'sharp';

/**
 * Extract mathematical text from image using Mathpix OCR
 * This is specialized for handwritten math and produces LaTeX output
 */
export async function extractTextFromImage(imageFile) {
  try {
    console.log('🔍 Starting OCR with Mathpix...');
    
    // Convert image file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Preprocess image for better OCR
    console.log('🎨 Preprocessing image...');
    const enhancedBuffer = await preprocessImageForMath(buffer);
    const base64Image = enhancedBuffer.toString('base64');
    console.log('✅ Image preprocessed');

    // Call Mathpix API
    console.log('🌐 Calling Mathpix API...');
    const response = await fetch('https://api.mathpix.com/v3/text', {
      method: 'POST',
      headers: {
        'app_id': process.env.MATHPIX_APP_ID,
        'app_key': process.env.MATHPIX_APP_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src: `data:image/jpeg;base64,${base64Image}`,
        formats: ['text', 'latex_styled'],
        ocr: ['math', 'text'],
        skip_recrop: false,
        include_asciimath: true,
        include_latex: true,
        include_mathml: false,
        include_tsv: false,
        include_svg: false,
        include_table_html: false,
        include_line_data: false,
        include_word_data: false,
        alphabets_allowed: 'en',
        math_inline_delimiters: ['$', '$'],
        math_display_delimiters: ['$$', '$$'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Mathpix API error:', response.status, errorText);
      throw new Error(`Mathpix API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📡 Mathpix response:', JSON.stringify(data, null, 2));

    // Check for errors in response
    if (data.error) {
      throw new Error(`Mathpix error: ${data.error}`);
    }

    // Extract results
    const extractedText = data.text || '';
    const latexStyled = data.latex_styled || '';
    const confidence = data.confidence || 0;
    const detectionMap = data.detection_map || {};

    console.log('✅ OCR completed');
    console.log('📝 Extracted text:', extractedText);
    console.log('📐 LaTeX:', latexStyled);
    console.log('📊 Confidence:', confidence);

    // Parse the LaTeX to create structured steps
    const structuredSteps = parseLatexIntoSteps(latexStyled, extractedText);

    return {
      text: extractedText,
      latex: latexStyled,
      confidence: confidence,
      raw: data,
      structuredSteps: structuredSteps,
      detectionMap: detectionMap
    };

  } catch (error) {
    console.error('❌ OCR extraction failed:', error);
    console.error('Error details:', error.message);
    
    // Return empty result with low confidence instead of throwing
    return {
      text: '',
      latex: '',
      confidence: 0.1,
      raw: {},
      structuredSteps: [],
      error: error.message
    };
  }
}

/**
 * Preprocess image specifically for math OCR
 */
async function preprocessImageForMath(buffer) {
  try {
    // Mathpix works best with:
    // - High contrast (black on white)
    // - Sharp edges
    // - Moderate resolution (not too high, not too low)
    const enhancedBuffer = await sharp(buffer)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      // Convert to grayscale for better recognition
      .grayscale()
      // Increase contrast
      .normalize()
      // Sharpen edges
      .sharpen()
      // Slight brightness adjustment
      .modulate({
        brightness: 1.1,
      })
      // Output as JPEG (Mathpix prefers JPEG)
      .jpeg({ quality: 95 })
      .toBuffer();

    return enhancedBuffer;
  } catch (error) {
    console.error('⚠️ Image preprocessing failed, using original:', error);
    return buffer;
  }
}

/**
 * Parse LaTeX into structured steps for clean display
 */
function parseLatexIntoSteps(latex, plainText) {
  if (!latex) return [];

  const steps = [];
  
  // Split by common step indicators
  const lines = latex.split(/\\\\|\n/).filter(line => line.trim());
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect if this is an equation (contains =)
    const isEquation = trimmed.includes('=');
    
    // Clean up LaTeX formatting
    const cleaned = trimmed
      .replace(/\\text\{([^}]+)\}/g, '$1') // Remove \text{}
      .replace(/\\left|\\right/g, '') // Remove \left \right
      .trim();

    steps.push({
      type: isEquation ? 'equation' : 'text',
      content: cleaned,
      raw: trimmed,
      lineNumber: index + 1
    });
  });

  return steps;
}

/**
 * Verify Mathpix API credentials
 */
export async function verifyMathpixCredentials() {
  try {
    const response = await fetch('https://api.mathpix.com/v3/app_info', {
      method: 'GET',
      headers: {
        'app_id': process.env.MATHPIX_APP_ID,
        'app_key': process.env.MATHPIX_APP_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API credentials invalid: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Mathpix credentials verified:', data);
    return true;
  } catch (error) {
    console.error('❌ Mathpix credentials verification failed:', error);
    return false;
  }
}