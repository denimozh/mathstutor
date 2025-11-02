// app/dashboard/solve/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import { FaUpload, FaImage, FaTimes, FaCheckCircle, FaFileAlt, FaPencilAlt } from "react-icons/fa";

const SolvePage = () => {
  const router = useRouter();
  
  // Image states
  const [questionImage, setQuestionImage] = useState(null);
  const [markSchemeImage, setMarkSchemeImage] = useState(null);
  const [studentWorkImage, setStudentWorkImage] = useState(null);
  
  // Preview states
  const [questionPreview, setQuestionPreview] = useState(null);
  const [markSchemePreview, setMarkSchemePreview] = useState(null);
  const [studentWorkPreview, setStudentWorkPreview] = useState(null);
  
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadMode, setUploadMode] = useState("question-only"); // "question-only" | "with-markscheme" | "full-analysis"

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

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Set the appropriate image
      if (type === 'question') {
        setQuestionImage(file);
      } else if (type === 'markscheme') {
        setMarkSchemeImage(file);
      } else if (type === 'studentwork') {
        setStudentWorkImage(file);
      }
      
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'question') {
          setQuestionPreview(reader.result);
        } else if (type === 'markscheme') {
          setMarkSchemePreview(reader.result);
        } else if (type === 'studentwork') {
          setStudentWorkPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'question') {
      setQuestionImage(null);
      setQuestionPreview(null);
    } else if (type === 'markscheme') {
      setMarkSchemeImage(null);
      setMarkSchemePreview(null);
    } else if (type === 'studentwork') {
      setStudentWorkImage(null);
      setStudentWorkPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionImage) {
      setError("Please upload the question image");
      return;
    }

    if (uploadMode === "full-analysis" && (!markSchemeImage || !studentWorkImage)) {
      setError("For full analysis, please upload mark scheme and your work");
      return;
    }

    if (!topic) {
      setError("Please select a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('questionImage', questionImage);
      formData.append('topic', topic);
      formData.append('struggled', 'false');
      
      if (markSchemeImage) {
        formData.append('markSchemeImage', markSchemeImage);
      }
      
      if (studentWorkImage) {
        formData.append('studentWorkImage', studentWorkImage);
      }

      const res = await fetch('/api/solve', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to upload question');
      }

      // Check if verification is needed
      if (data.needsVerification) {
        // Store verification data in sessionStorage
        sessionStorage.setItem('verificationData', JSON.stringify({
          extractedQuestionText: data.extractedQuestionText,
          extractedMarkSchemeText: data.extractedMarkSchemeText,
          extractedStudentWorkText: data.extractedStudentWorkText,
          questionOcrConfidence: data.questionOcrConfidence,
          markSchemeOcrConfidence: data.markSchemeOcrConfidence,
          studentWorkOcrConfidence: data.studentWorkOcrConfidence,
          questionUrl: data.questionUrl,
          markSchemeUrl: data.markSchemeUrl,
          studentWorkUrl: data.studentWorkUrl,
          topic: topic
        }));

        // Store image previews for verification page
        sessionStorage.setItem('uploadedFiles', JSON.stringify({
          questionImage: questionPreview,
          markSchemeImage: markSchemePreview,
          studentWorkImage: studentWorkPreview
        }));

        // Redirect to verification page
        router.push('/dashboard/solve/verify');
        return;
      }

      // No verification needed, go straight to results
      router.push(`/dashboard/solve/results?id=${data.questionId}`);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const ImageUploadCard = ({ title, description, type, image, preview, icon: Icon }) => (
    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Icon className="text-indigo-600 text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e, type)}
            className="hidden"
            id={`${type}-upload`}
          />
          <label
            htmlFor={`${type}-upload`}
            className="cursor-pointer flex flex-col items-center"
          >
            <FaUpload className="text-gray-400 text-2xl mb-2" />
            <p className="text-sm font-medium text-gray-700">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </label>
        </div>
      ) : (
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt={title}
            className="w-full h-auto"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(type)}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <FaTimes size={14} />
          </button>
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <FaCheckCircle size={12} />
            Uploaded
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solve a Question</h1>
            <p className="text-gray-600">
              Upload your question and optionally compare your work against the mark scheme
            </p>
          </div>

          {/* Mode Selection */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Upload Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setUploadMode("question-only")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  uploadMode === "question-only"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <FaImage className="text-indigo-600 text-2xl mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Question Only</h3>
                <p className="text-xs text-gray-600">Get AI solution for your question</p>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode("with-markscheme")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  uploadMode === "with-markscheme"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <FaFileAlt className="text-purple-600 text-2xl mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">With Mark Scheme</h3>
                <p className="text-xs text-gray-600">Compare AI solution with official marks</p>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode("full-analysis")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  uploadMode === "full-analysis"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <FaPencilAlt className="text-green-600 text-2xl mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Full Analysis</h3>
                <p className="text-xs text-gray-600">Check your work against mark scheme</p>
              </button>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Uploads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Question Image - Always shown */}
              <ImageUploadCard
                title="Question"
                description="The problem to solve"
                type="question"
                image={questionImage}
                preview={questionPreview}
                icon={FaImage}
              />

              {/* Mark Scheme - Show if with-markscheme or full-analysis */}
              {(uploadMode === "with-markscheme" || uploadMode === "full-analysis") && (
                <ImageUploadCard
                  title="Mark Scheme"
                  description="Official marking criteria"
                  type="markscheme"
                  image={markSchemeImage}
                  preview={markSchemePreview}
                  icon={FaFileAlt}
                />
              )}

              {/* Student Work - Show only for full-analysis */}
              {uploadMode === "full-analysis" && (
                <ImageUploadCard
                  title="Your Work"
                  description="Your solution attempt"
                  type="studentwork"
                  image={studentWorkImage}
                  preview={studentWorkPreview}
                  icon={FaPencilAlt}
                />
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
              disabled={loading || !questionImage || !topic}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaImage />
                  {uploadMode === "full-analysis" ? "Analyze My Work" : "Solve Question"}
                </>
              )}
            </button>
          </form>

          {/* Info Boxes */}
          <div className="mt-8 space-y-4">
            {uploadMode === "question-only" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-2">💡 Question Only Mode</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Upload a clear photo of your math question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Get AI-generated step-by-step solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Learn exam techniques and common pitfalls</span>
                  </li>
                </ul>
              </div>
            )}

            {uploadMode === "full-analysis" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-900 mb-2">📊 Full Analysis Mode</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>AI compares your work line-by-line with the mark scheme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Identifies exactly where you made mistakes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Shows the correct method step-by-step</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Awards marks based on official criteria</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvePage;