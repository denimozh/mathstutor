// app/dashboard/solve/results/page.jsx
// REPLACE EXISTING FILE - Now includes marking and clean math display

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import { CompleteSolution, HandwrittenWorkDisplay } from "@/app/components/CleanMathDisplay";
import MarkedSolutionDisplay from "@/app/components/MarkedSolutionDisplay";

export default function SolveResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");
  const shouldMark = searchParams.get("mark") === "true";
  
  const [question, setQuestion] = useState(null);
  const [solution, setSolution] = useState(null);
  const [marking, setMarking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingInProgress, setMarkingInProgress] = useState(false);
  const [struggled, setStruggled] = useState(false);
  const [view, setView] = useState('solution'); // 'solution' | 'marking'

  useEffect(() => {
    if (!questionId) {
      router.push("/dashboard/solve");
      return;
    }
    fetchQuestionAndSolution();
  }, [questionId, router]);

  const fetchQuestionAndSolution = async () => {
    try {
      const res = await fetch(`/api/question/${questionId}`);
      const data = await res.json();

      if (data.success) {
        setQuestion(data.data);
        setStruggled(data.data.struggled || false);
        
        // Check if already marked
        if (data.data.marking_result) {
          setMarking(data.data.marking_result);
          setView('marking');
        }
        
        // Get AI solution if available
        if (data.data.ai_solution) {
          setSolution(data.data.ai_solution);
        } else {
          await generateAISolution(data.data);
        }

        // If should mark, trigger marking
        if (shouldMark && !data.data.marking_result && data.data.structured_steps) {
          await markStudentWork(data.data);
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

  const markStudentWork = async (question) => {
    setMarkingInProgress(true);
    try {
      console.log('📝 Starting marking process...');

      // Construct student work from structured steps
      const studentWork = question.structured_steps
        ? question.structured_steps.map(s => s.content).join('\n')
        : question.text;

      const res = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          studentWork: studentWork
        })
      });

      const data = await res.json();
      if (data.success) {
        console.log('✅ Marking completed');
        setMarking(data.marking);
        setView('marking');
      }
    } catch (err) {
      console.error('Error marking work:', err);
    } finally {
      setMarkingInProgress(false);
    }
  };

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

  const handleRequestMarking = async () => {
    if (!question) return;
    await markStudentWork(question);
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
            <p className="text-lg text-gray-600">Your AI tutor is working on this...</p>
            <p className="text-sm text-gray-500 mt-2">Analyzing, solving, and preparing feedback...</p>
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
            <p className="text-xl text-gray-600 mb-4">Question not found</p>
            <button
              onClick={() => router.push("/dashboard/solve")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-x-hidden">
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard/solve")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Solve</span>
        </button>

        <div className="max-w-6xl mx-auto">
          {/* View Toggle */}
          {marking && (
            <div className="mb-6 flex gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <button
                onClick={() => setView('solution')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  view === 'solution'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📚 AI Solution
              </button>
              <button
                onClick={() => setView('marking')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  view === 'marking'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📝 Your Marked Work
              </button>
            </div>
          )}

          {/* Marking in Progress */}
          {markingInProgress && (
            <div className="mb-6 bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Marking Your Work</h3>
                  <p className="text-indigo-700">This may take 10-30 seconds...</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {view === 'solution' && (
            <>
              {/* Your Handwritten Work */}
              {question.structured_steps && question.structured_steps.length > 0 && (
                <div className="mb-6">
                  <HandwrittenWorkDisplay
                    structuredSteps={question.structured_steps}
                    originalImage={question.image_url}
                  />

                  {/* Mark My Work Button */}
                  {!marking && !markingInProgress && (
                    <button
                      onClick={handleRequestMarking}
                      className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      📝 Mark My Work Against Official Mark Scheme
                    </button>
                  )}
                </div>
              )}

              {/* AI Solution */}
              {solution && (
                <CompleteSolution solution={solution} />
              )}

              {/* Struggle Feedback */}
              <div className="mt-6 bg-white border-2 border-gray-200 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  Did you struggle with this question?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMarkStruggled(true)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      struggled
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Yes, I struggled
                  </button>
                  <button
                    onClick={() => handleMarkStruggled(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      struggled === false
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    No, I understood
                  </button>
                </div>
              </div>
            </>
          )}

          {view === 'marking' && marking && (
            <MarkedSolutionDisplay
              marking={marking}
              questionText={question.text}
              originalImage={question.image_url}
            />
          )}

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
}