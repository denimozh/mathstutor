// app/dashboard/solve/page.jsx
// REPLACE EXISTING - Fixed image upload handling

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import { FaUpload, FaImage, FaTimes } from "react-icons/fa";

const SolvePage = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topics = [
    "Algebra",
    "Differentiation",
    "Integration",
    "Trigonometry",
    "Statistics",
    "Mechanics",
    "Vectors",
    "Probability",
    "Unknown"
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      console.log('📎 Image selected:', file.name, file.size, 'bytes', file.type);
      
      setSelectedImage(file);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    if (!topic) {
      setError("Please select a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('📤 Submitting question...');
      console.log('📎 Image:', selectedImage.name, selectedImage.size, 'bytes');
      console.log('📚 Topic:', topic);

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('topic', topic);
      formData.append('struggled', 'false');

      // Verify FormData contents
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, value.name, value.size, 'bytes', value.type);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const res = await fetch('/api/solve', {
        method: 'POST',
        body: formData // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to upload question');
      }

      console.log('✅ Upload successful:', data);

      // If needs verification, go to verify page
      if (data.needsVerification) {
        console.log('⚠️ OCR confidence low, redirecting to verify page');
        // Encode data for URL
        const ocrDataStr = encodeURIComponent(JSON.stringify({
          extractedText: data.extractedText,
          extractedLatex: data.extractedLatex,
          structuredSteps: data.structuredSteps,
          ocrConfidence: data.ocrConfidence,
          imageUrl: data.imageUrl,
          topic: topic
        }));
        router.push(`/dashboard/solve/verify?data=${ocrDataStr}`);
      } else {
        // High confidence, go straight to results
        console.log('✅ High confidence, redirecting to results');
        router.push(`/dashboard/solve/results?id=${data.questionId}`);
      }
      
    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solve a Question</h1>
            <p className="text-gray-600">
              Upload a photo of your math problem and get instant step-by-step solutions
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Question Image <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <FaUpload className="text-indigo-600 text-3xl" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <FaTimes />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {selectedImage.name} • {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Topic <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      topic === t
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedImage || !topic}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing with Mathpix AI...
                </>
              ) : (
                <>
                  <FaImage />
                  Solve Question
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 How it works</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Upload a clear photo of your handwritten math question</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Our AI reads your handwriting using Mathpix (specialized math OCR)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Verify the extracted text (edit if needed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Get your work marked against official A-Level mark schemes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                <span>See exactly where you lost marks with color-coded feedback</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvePage;