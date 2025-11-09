import sharp from 'sharp';

export async function extractTextFromImage(imageFile) {
  try {
    console.log('🔍 Starting OCR with Mathpix...');
    
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('🎨 Preprocessing image...');
    const enhancedBuffer = await preprocessImageForMath(buffer);
    const base64Image = enhancedBuffer.toString('base64');
    console.log('✅ Image preprocessed');

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
        formats: ['text', 'latex_styled']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Mathpix API error:', response.status, errorText);
      throw new Error(`Mathpix API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📡 Mathpix response received');

    if (data.error) {
      throw new Error(`Mathpix error: ${data.error}`);
    }

    const extractedText = data.text || '';
    const latexStyled = data.latex_styled || '';
    const confidence = data.confidence || 0;

    console.log('✅ OCR completed');
    console.log('📝 Extracted text:', extractedText);
    console.log('📊 Confidence:', confidence);

    // IMPORTANT: Clean the LaTeX output
    const cleanedLatex = cleanMathpixLatex(latexStyled);
    const structuredSteps = parseLatexIntoSteps(cleanedLatex, extractedText);

    return {
      text: extractedText,
      latex: cleanedLatex, // Return cleaned version
      confidence: confidence,
      raw: data,
      structuredSteps: structuredSteps,
    };

  } catch (error) {
    console.error('❌ OCR extraction failed:', error);
    
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
 * Clean Mathpix LaTeX output - Remove problematic environments
 */
function cleanMathpixLatex(latex) {
  if (!latex) return '';
  
  let cleaned = latex;
  
  // Remove \begin{array} and \end{array} with their parameters
  cleaned = cleaned.replace(/\\begin\{array\}\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\end\{array\}/g, '');
  
  // Remove \begin{aligned} and \end{aligned}
  cleaned = cleaned.replace(/\\begin\{aligned\}/g, '');
  cleaned = cleaned.replace(/\\end\{aligned\}/g, '');
  
  // Remove excessive \left and \right
  cleaned = cleaned.replace(/\\left\(/g, '(');
  cleaned = cleaned.replace(/\\right\)/g, ')');
  cleaned = cleaned.replace(/\\left\[/g, '[');
  cleaned = cleaned.replace(/\\right\]/g, ']');
  cleaned = cleaned.replace(/\\left\{/g, '{');
  cleaned = cleaned.replace(/\\right\}/g, '}');
  
  // Clean up multiple backslashes (line breaks)
  cleaned = cleaned.replace(/\\\\\s*/g, '\n');
  
  // Remove display math delimiters if present
  cleaned = cleaned.replace(/\\\[/g, '');
  cleaned = cleaned.replace(/\\\]/g, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

async function preprocessImageForMath(buffer) {
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
      .jpeg({ quality: 95 })
      .toBuffer();

    return enhancedBuffer;
  } catch (error) {
    console.error('⚠️ Image preprocessing failed, using original:', error);
    return buffer;
  }
}

function parseLatexIntoSteps(latex, plainText) {
  if (!latex) return [];

  const steps = [];
  const lines = latex.split(/\n/).filter(line => line.trim());
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const isEquation = trimmed.includes('=');
    
    const cleaned = trimmed
      .replace(/\\text\{([^}]+)\}/g, '$1')
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