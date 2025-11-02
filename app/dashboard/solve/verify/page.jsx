// app/dashboard/solve/verify/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import TextComparisonHelper from "@/app/components/TextComparisonHelper";
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaLightbulb, FaImage, FaEdit } from "react-icons/fa";

const VerifyTextPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get data from URL params (passed from solve page)
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Editable text states
  const [questionText, setQuestionText] = useState("");
  const [markSchemeText, setMarkSchemeText] = useState("");
  const [studentWorkText, setStudentWorkText] = useState("");
  
  // Confidence scores
  const [questionConfidence, setQuestionConfidence] = useState(1.0);
  const [markSchemeConfidence, setMarkSchemeConfidence] = useState(1.0);
  const [studentWorkConfidence, setStudentWorkConfidence] = useState(1.0);
  
  // Image URLs for reference
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [markSchemeImageUrl, setMarkSchemeImageUrl] = useState("");
  const [studentWorkImageUrl, setStudentWorkImageUrl] = useState("");
  
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get data from sessionStorage (set by solve page)
    const storedData = sessionStorage.getItem('verificationData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setVerificationData(data);
      
      // Set editable text
      setQuestionText(data.extractedQuestionText || "");
      setMarkSchemeText(data.extractedMarkSchemeText || "");
      setStudentWorkText(data.extractedStudentWorkText || "");
      
      // Set confidence scores
      setQuestionConfidence(data.questionOcrConfidence || 1.0);
      setMarkSchemeConfidence(data.markSchemeOcrConfidence || 1.0);
      setStudentWorkConfidence(data.studentWorkOcrConfidence || 1.0);
      
      // Set image URLs
      setQuestionImageUrl(data.questionUrl || "");
      setMarkSchemeImageUrl(data.markSchemeUrl || "");
      setStudentWorkImageUrl(data.studentWorkUrl || "");
      
      setTopic(data.topic || "");
      setLoading(false);
    } else {
      // No data, redirect back
      router.push("/dashboard/solve");
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      setError("Question text cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Create FormData with verified text
      const formData = new FormData();
      
      // Add the original images (we need to fetch them from URLs)
      // Or better: include file references from sessionStorage
      const filesData = sessionStorage.getItem('uploadedFiles');
      if (filesData) {
        const files = JSON.parse(filesData);
        
        if (files.questionImage) {
          const blob = await fetch(files.questionImage).then(r => r.blob());
          formData.append('questionImage', blob, 'question.jpg');
        }
        if (files.markSchemeImage) {
          const blob = await fetch(files.markSchemeImage).then(r => r.blob());
          formData.append('markSchemeImage', blob, 'markscheme.jpg');
        }
        if (files.studentWorkImage) {
          const blob = await fetch(files.studentWorkImage).then(r => r.blob());
          formData.append('studentWorkImage', blob, 'studentwork.jpg');
        }
      }
      
      // Add verified/corrected text
      formData.append('manualQuestionText', questionText);
      if (markSchemeText) {
        formData.append('manualMarkSchemeText', markSchemeText);
      }
      if (studentWorkText) {
        formData.append('manualStudentWorkText', studentWorkText);
      }
      formData.append('topic', topic);
      formData.append('struggled', 'false');

      const res = await fetch('/api/solve', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit');
      }

      // Clear sessionStorage
      sessionStorage.removeItem('verificationData');
      sessionStorage.removeItem('uploadedFiles');

      // Redirect to results
      router.push(`/dashboard/solve/results?id=${data.questionId}`);

    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
        <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
          <Sidebar />
        </div>
        <Bottombar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const TextVerificationCard = ({ title, text, setText, confidence, imageUrl, icon: Icon, color }) => {
    const [isEditing, setIsEditing] = useState(confidence < 0.7);
    const [showImage, setShowImage] = useState(true);

    return (
      <div className={`border-2 rounded-xl overflow-hidden ${
        confidence < 0.7 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
      }`}>
        {/* Header */}
        <div className={`p-4 ${color} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Icon className="text-white text-xl" />
            <div>
              <h3 className="font-bold text-white">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  confidence >= 0.9 ? 'bg-green-500' :
                  confidence >= 0.7 ? 'bg-yellow-500' :
                  'bg-red-500'
                } text-white font-semibold`}>
                  {Math.round(confidence * 100)}% Confidence
                </span>
                {confidence < 0.7 && (
                  <span className="text-xs text-white flex items-center gap-1">
                    <FaExclamationTriangle />
                    Please verify
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowImage(!showImage)}
            className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white text-sm font-medium transition-colors"
          >
            {showImage ? 'Hide' : 'Show'} Image
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Original Image */}
          {showImage && imageUrl && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Original Image:</p>
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full h-auto rounded-lg border-2 border-gray-300"
              />
            </div>
          )}

          {/* Extracted Text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Extracted Text:</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm font-medium transition-colors"
              >
                <FaEdit />
                {isEditing ? 'Done Editing' : 'Edit Text'}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 p-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                placeholder={`Edit the extracted text for ${title.toLowerCase()}...`}
              />
            ) : (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 min-h-[12rem]">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {text || `No text extracted for ${title.toLowerCase()}`}
                </pre>
              </div>
            )}
          </div>

          {/* Character count */}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {text.length} characters
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <button
            onClick={() => router.push("/dashboard/solve")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Upload</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Extracted Text</h1>
            <p className="text-gray-600">
              Review and correct the text extracted from your images. Low confidence scores need your attention! 👀
            </p>
          </div>

          {/* Warning Banner */}
          {(questionConfidence < 0.7 || markSchemeConfidence < 0.7 || studentWorkConfidence < 0.7) && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6 flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Low OCR Confidence Detected</h3>
                <p className="text-yellow-800 text-sm">
                  Some text may have been extracted incorrectly. Please review carefully and make corrections before proceeding.
                  Compare against the original images shown below.
                </p>
              </div>
            </div>
          )}

          {/* Verification Cards */}
          <div className="space-y-6 mb-8">
            {/* Question Text */}
            {questionText !== undefined && (
              <TextVerificationCard
                title="Question"
                text={questionText}
                setText={setQuestionText}
                confidence={questionConfidence}
                imageUrl={questionImageUrl}
                icon={FaImage}
                color="bg-gradient-to-r from-indigo-600 to-blue-600"
              />
            )}

            {/* Mark Scheme Text */}
            {markSchemeText !== undefined && markSchemeText !== "" && (
              <TextVerificationCard
                title="Mark Scheme"
                text={markSchemeText}
                setText={setMarkSchemeText}
                confidence={markSchemeConfidence}
                imageUrl={markSchemeImageUrl}
                icon={FaCheck}
                color="bg-gradient-to-r from-purple-600 to-pink-600"
              />
            )}

            {/* Student Work Text */}
            {studentWorkText !== undefined && studentWorkText !== "" && (
              <TextVerificationCard
                title="Your Work"
                text={studentWorkText}
                setText={setStudentWorkText}
                confidence={studentWorkConfidence}
                imageUrl={studentWorkImageUrl}
                icon={FaEdit}
                color="bg-gradient-to-r from-green-600 to-emerald-600"
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard/solve")}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !questionText.trim()}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck />
                  Confirm & Continue
                </>
              )}
            </button>
          </div>

          {/* Help Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">💡 Verification Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">✓</span>
                <span>Compare extracted text with the image above each section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">✓</span>
                <span>Pay special attention to mathematical symbols (±, ×, ÷, ², ³)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">✓</span>
                <span>Check for sign errors (+ vs -) and exponents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">✓</span>
                <span>Verify fractions are written correctly (1/2 not 12)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">✓</span>
                <span>Make sure all working steps are captured</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTextPage;