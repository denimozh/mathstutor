"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";

const SolveResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");
  
  const [question, setQuestion] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [struggled, setStruggled] = useState(false);

  const fetchQuestionAndSolution = async () => {
  try {
    // Fetch question
    const res = await fetch(`/api/question/${questionId}`);
    const data = await res.json();

    if (data.success) {
      setQuestion(data.data);
      setStruggled(data.data.struggled || false);
      setIsCorrect(data.data.is_correct);
      
      // Check if AI solution already exists
      if (data.data.ai_solution) {
        setSolution(data.data.ai_solution);
      } else {
        // Generate AI solution
        await generateAISolution(data.data);
      }
    }
  } catch (err) {
    console.error("Error fetching question:", err);
  } finally {
    setLoading(false);
  }
};

const generateAISolution = async (question) => {
  try {
    const res = await fetch('/api/solutions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
        extractedText: question.text,
        topic: question.topic
      })
    });

    const data = await res.json();
    if (data.success) {
      setSolution(data.solution);
    }
  } catch (err) {
    console.error('Error generating solution:', err);
  }
};

  useEffect(() => {
    if (!questionId) {
      router.push("/dashboard/solve");
      return;
    }
    fetchQuestionAndSolution();
  }, [questionId, router]);

  const handleMarkStruggled = async (didStruggle) => {
    try {
      const res = await fetch(`/api/question/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ struggled: didStruggle })
      });

      if (res.ok) {
        setStruggled(didStruggle);
      }
    } catch (err) {
      console.error("Error updating struggle status:", err);
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
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Solving your question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
        <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
          <Sidebar />
        </div>
        <Bottombar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Question not found</p>
            <button
              onClick={() => router.push("/dashboard/solve")}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        {/* Header with Back Button */}
        <button
          onClick={() => router.push("/dashboard/solve")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Solve</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Question</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {question.topic || "General"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {isCorrect !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                  <span className="font-semibold">{isCorrect ? "Correct" : "Incorrect"}</span>
                </div>
              )}
            </div>

            {question.text && (
              <div className="mb-4">
                <p className="text-gray-700 text-lg">{question.text}</p>
              </div>
            )}

            {question.image_url && (
              <div className="mb-4">
                <img
                  src={question.image_url}
                  alt="Question"
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Struggle Buttons */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-3">Did you struggle with this question?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleMarkStruggled(true)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    struggled
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Yes, I struggled
                </button>
                <button
                  onClick={() => handleMarkStruggled(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    struggled === false
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  No, I understood
                </button>
              </div>
            </div>
          </div>

          {/* Solution Steps */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 p-3 rounded-lg">
                <FaEdit className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Step-by-Step Solution</h3>
                <p className="text-sm text-gray-600">
                  {solution.confidence >= 0.9 ? "High confidence" : "Medium confidence"} • 
                  AI-powered explanation
                </p>
              </div>
            </div>

            {solution.steps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl p-5 mb-4 border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-700 mb-3">{step.explanation}</p>
                    {step.formula && (
                      <div className="bg-gray-100 border-l-4 border-indigo-600 p-3 rounded">
                        <code className="text-indigo-900 font-mono">{step.formula}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Final Answer */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 mt-6">
              <div className="flex items-center gap-3 mb-2">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <h4 className="text-xl font-bold text-gray-900">Final Answer</h4>
              </div>
              <div className="bg-white rounded-lg p-4 mt-3">
                <code className="text-2xl text-green-700 font-mono font-bold">
                  {solution.final_answer}
                </code>
              </div>
            </div>
          </div>

          {/* Hints & Tips */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaLightbulb className="text-amber-600 text-2xl" />
              <h4 className="text-xl font-bold text-gray-900">Helpful Tips</h4>
            </div>
            <ul className="space-y-2">
              {solution.hints.map((hint, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span className="text-gray-700">{hint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push("/dashboard/solve")}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Solve Another Question
            </button>
            <button
              onClick={() => router.push("/dashboard/history")}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveResultsPage;