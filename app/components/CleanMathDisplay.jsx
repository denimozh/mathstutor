// app/components/CleanMathDisplay.jsx
// NEW FILE - Professional math display like GauthMath

'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Clean math step display (GauthMath style)
 * No slashes, clean fractions, proper formatting
 */
export function CleanMathStep({ step }) {
  const { 
    step: stepNumber, 
    title, 
    explanation, 
    working, 
    formula,
    exam_tip 
  } = step;

  return (
    <div className="mb-8">
      {/* Step Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
        </div>
      </div>

      {/* Explanation - Natural language */}
      {explanation && (
        <div className="ml-13 mb-4">
          <p className="text-gray-700 leading-relaxed text-base">
            {explanation}
          </p>
        </div>
      )}

      {/* Working - Clean math display */}
      {working && (
        <div className="ml-13 mb-4">
          <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-indigo-500">
            <div className="space-y-3">
              {parseWorkingIntoLines(working).map((line, idx) => (
                <div key={idx} className="text-lg">
                  {line.type === 'text' ? (
                    <p className="text-gray-700 mb-2">{line.content}</p>
                  ) : (
                    <div className="flex items-center">
                      <BlockMath math={cleanLatex(line.content)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formula/Result - Highlighted */}
      {formula && (
        <div className="ml-13 mb-4">
          <div className="bg-indigo-50 border-l-4 border-indigo-600 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-indigo-800">RESULT:</span>
              <div className="text-lg">
                <InlineMath math={cleanLatex(formula)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Tip */}
      {exam_tip && (
        <div className="ml-13">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Exam Tip:</p>
                <p className="text-sm text-amber-800">{exam_tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Parse working text into clean lines
 */
function parseWorkingIntoLines(working) {
  if (!working) return [];
  
  const lines = working.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    const trimmed = line.trim();
    
    // Detect if line contains math (has =, +, -, ×, ÷, fractions, etc.)
    const hasMath = /[=+\-×÷∫∑√^()]/.test(trimmed) || 
                    /\d/.test(trimmed) ||
                    trimmed.includes('sin') ||
                    trimmed.includes('cos') ||
                    trimmed.includes('tan') ||
                    trimmed.includes('log');
    
    return {
      type: hasMath ? 'math' : 'text',
      content: trimmed
    };
  });
}

/**
 * Clean LaTeX for display (GauthMath style)
 * Convert to clean fractions, proper notation
 */
function cleanLatex(text) {
  if (!text) return '';
  
  let cleaned = text;
  
  // Convert division slashes to fractions
  // 1/2 → \frac{1}{2}
  cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  
  // Convert powers with ^ to proper notation
  // x^2 → x^{2}
  cleaned = cleaned.replace(/\^(\d+)/g, '^{$1}');
  cleaned = cleaned.replace(/\^([a-zA-Z])/g, '^{$1}');
  
  // Convert ** to ^
  cleaned = cleaned.replace(/\*\*/g, '^');
  
  // Ensure proper spacing around operators
  cleaned = cleaned.replace(/([=+\-])/g, ' $1 ');
  
  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Display complete solution (all steps)
 */
export function CompleteSolution({ solution }) {
  if (!solution) return null;

  const { steps, final_answer, verification } = solution;

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Step-by-Step Solution</h3>
            <p className="text-sm text-gray-600">Explained by your AI tutor</p>
          </div>
        </div>

        {steps && steps.map((step, idx) => (
          <CleanMathStep key={idx} step={step} />
        ))}
      </div>

      {/* Final Answer */}
      {final_answer && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Final Answer</h4>
          </div>
          <div className="bg-white rounded-lg p-5">
            {typeof final_answer === 'object' ? (
              <div className="space-y-3">
                {Object.entries(final_answer).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-gray-600 uppercase">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <div className="text-2xl">
                      <InlineMath math={cleanLatex(String(value))} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl">
                <InlineMath math={cleanLatex(String(final_answer))} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification */}
      {verification && (
        <div className={`rounded-xl p-6 border-2 ${
          verification.passes 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {verification.passes ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <h4 className="text-xl font-bold text-gray-900">Verification</h4>
          </div>
          
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Method:</p>
              <p className="text-gray-800">{verification.method}</p>
            </div>
            
            {verification.working && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Working:</p>
                <div className="bg-gray-50 p-3 rounded">
                  <InlineMath math={cleanLatex(verification.working)} />
                </div>
              </div>
            )}
            
            {verification.interpretation && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Result:</p>
                <p className="text-gray-800">{verification.interpretation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Display user's handwritten work in clean format
 */
export function HandwrittenWorkDisplay({ structuredSteps, originalImage }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Your Working</h3>
      
      {/* Original Image */}
      {originalImage && (
        <div className="mb-6">
          <img 
            src={originalImage} 
            alt="Original work" 
            className="max-w-md mx-auto rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Transcribed Work */}
      {structuredSteps && structuredSteps.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Transcribed:</h4>
          <div className="space-y-2 bg-gray-50 rounded-lg p-4">
            {structuredSteps.map((step, idx) => (
              <div key={idx} className="text-base">
                {step.type === 'equation' ? (
                  <BlockMath math={cleanLatex(step.content)} />
                ) : (
                  <p className="text-gray-700">{step.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export utility function
export { cleanLatex };