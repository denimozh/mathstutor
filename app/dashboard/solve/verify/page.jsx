// app/dashboard/solve/verify/page.jsx
// NEW FILE - Clean verify page with better layout

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import { HandwrittenWorkDisplay } from "@/app/components/CleanMathDisplay";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ocrData, setOcrData] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedLatex, setEditedLatex] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get OCR data from query params or session storage
    const ocrDataStr = searchParams.get('data');
    if (ocrDataStr) {
      try {
        const data = JSON.parse(decodeURIComponent(ocrDataStr));
        setOcrData(data);
        setEditedText(data.extractedText || "");
        setEditedLatex(data.extractedLatex || "");
        setTopic(data.topic || "");
      } catch (err) {
        console.error('Error parsing OCR data:', err);
      }
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!editedText.trim()) {
      alert("Please enter the question text");
      return;
    }

    if (!topic) {
      alert("Please select a topic");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Create a new File object from the stored image data if available
      if (ocrData?.imageUrl) {
        try {
          // Fetch the image and create a File object
          const response = await fetch(ocrData.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'question.jpg', { type: blob.type || 'image/jpeg' });
          formData.append('image', file);
          console.log('📎 Image attached:', file.name, file.size, 'bytes');
        } catch (imgError) {
          console.error('Error fetching image:', imgError);
          throw new Error('Failed to load image. Please try uploading again.');
        }
      } else {
        throw new Error('No image URL available');
      }

      formData.append('manualText', editedText);
      formData.append('manualLatex', editedLatex);
      formData.append('topic', topic);
      formData.append('struggled', 'false');

      const res = await fetch('/api/solve', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Navigate to results with marking
      router.push(`/dashboard/solve/results?id=${data.questionId}&mark=true`);

    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!ocrData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify & Edit Your Work
          </h1>
          <p className="text-gray-600 mb-6">
            Check the OCR extraction and make any corrections needed
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Original Image */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Original Image
              </h3>
              {ocrData.imageUrl && (
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <img 
                    src={ocrData.imageUrl}
                    alt="Question"
                    className="max-h-[400px] w-auto object-contain rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* OCR Confidence */}
              <div className="mt-4 bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    OCR Confidence:
                  </span>
                  <span className={`text-lg font-bold ${
                    ocrData.ocrConfidence >= 0.8 ? 'text-green-600' :
                    ocrData.ocrConfidence >= 0.6 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {Math.round(ocrData.ocrConfidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Structured Steps Preview */}
              {ocrData.structuredSteps && ocrData.structuredSteps.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                    Detected Steps:
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                    {ocrData.structuredSteps.map((step, idx) => (
                      <div key={idx} className="mb-2 text-sm">
                        {step.type === 'equation' ? (
                          <InlineMath math={step.content} />
                        ) : (
                          <p className="text-gray-700">{step.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Edit Fields */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit & Verify
              </h3>

              {/* Topic Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">Select topic...</option>
                  <option value="Algebra">Algebra</option>
                  <option value="Differentiation">Differentiation</option>
                  <option value="Integration">Integration</option>
                  <option value="Trigonometry">Trigonometry</option>
                  <option value="Statistics">Statistics</option>
                  <option value="Mechanics">Mechanics</option>
                  <option value="Vectors">Vectors</option>
                  <option value="Probability">Probability</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              {/* Plain Text Edit */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Text (Edit if needed)
                </label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none font-mono text-sm resize-none"
                  rows={8}
                  placeholder="Edit the extracted text here..."
                />
              </div>

              {/* LaTeX Edit (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LaTeX (Optional - for advanced users)
                </label>
                <textarea
                  value={editedLatex}
                  onChange={(e) => setEditedLatex(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none font-mono text-sm resize-none"
                  rows={6}
                  placeholder="Edit LaTeX here if needed..."
                />
                
                {/* LaTeX Preview */}
                {editedLatex && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Preview:</p>
                    <BlockMath math={editedLatex} />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !editedText.trim() || !topic}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    ✓ Looks Good - Mark My Work
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2">💡 How it works</h4>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>The AI reads your handwriting using specialized math OCR</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Check the extracted text is correct (edit if needed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Your work will be marked against the official A-Level mark scheme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Get detailed feedback with correct continuation from errors</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}