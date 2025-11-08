"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationTriangle,
  FaBook,
  FaGraduationCap,
  FaChartLine
} from 'react-icons/fa';
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import MathDisplay from "@/app/components/CleanMathDisplay";
import QuestionTextEditor from "@/app/components/QuestionTextEditor";
import SolutionStep from "@/app/components/SolutionStep";

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
      const res = await fetch(`/api/question/${questionId}`);
      const data = await res.json();

      if (data.success) {
        setQuestion(data.data);
        setStruggled(data.data.struggled || false);
        setIsCorrect(data.data.is_correct);
        
        if (data.data.ai_solution) {
          setSolution(data.data.ai_solution);
        } else {
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

  const handleQuestionTextUpdate = async (newText) => {
    try {
      const res = await fetch(`/api/question/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
      });

      if (res.ok) {
        setQuestion({ ...question, text: newText });
        // Optionally regenerate solution
      }
    } catch (err) {
      console.error("Error updating question text:", err);
    }
  };

  // Check if multi-part question
  const isMultiPart = solution && (solution.part_a_steps || solution.part_b_steps || solution.part_c_steps);
  const hasPart = (part) => solution && solution[`part_${part}_steps`] && solution[`part_${part}_steps`].length > 0;

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
            <p className="text-lg text-gray-600">Your A-Level tutor is working on this...</p>
            <p className="text-sm text-gray-500 mt-2">Calculating, verifying, and explaining...</p>
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
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      <div className="flex-1 p-4 md:p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
        <button
          onClick={() => router.push("/dashboard/solve")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Solve</span>
        </button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card with Editor */}
          <QuestionTextEditor
            initialText={question.text}
            imageUrl={question.image_url}
            onSave={handleQuestionTextUpdate}
          />

          {/* Status Badge */}
          {isCorrect !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit ${
              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
              <span className="font-semibold">{isCorrect ? "Correct" : "Incorrect"}</span>
            </div>
          )}

          {/* Struggle Buttons */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-3">Did you struggle with this question?</p>
            <div className="flex flex-col sm:flex-row gap-3">
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

          {/* Solution Display */}
          {solution && (
            <>
              {/* Warning Badges */}
              {solution.warning && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">Verification Warning</h4>
                    <p className="text-yellow-800 text-sm">{solution.warning}</p>
                  </div>
                </div>
              )}

              {solution.was_corrected && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 flex items-start gap-3">
                  <FaChartLine className="text-blue-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Self-Corrected Solution</h4>
                    <p className="text-blue-800 text-sm">
                      The AI detected an error and corrected itself for accuracy.
                    </p>
                  </div>
                </div>
              )}

              {/* Confidence Badge */}
              {solution.confidence && (
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    solution.confidence >= 0.9 
                      ? 'bg-green-100 text-green-700' 
                      : solution.confidence >= 0.7
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <FaGraduationCap />
                    <span className="font-semibold">
                      {solution.confidence >= 0.9 ? 'High' : solution.confidence >= 0.7 ? 'Medium' : 'Low'} Confidence
                    </span>
                    <span className="text-sm">({Math.round(solution.confidence * 100)}%)</span>
                  </div>
                </div>
              )}

              {/* Main Solution */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-600 p-3 rounded-lg">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Step-by-Step Solution</h3>
                    <p className="text-sm text-gray-600">Explained by your AI A-Level tutor</p>
                  </div>
                </div>

                {/* Part A */}
                {hasPart('a') && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">a</span>
                      Part (a)
                    </h4>
                    {solution.part_a_steps.map((step, idx) => (
                      <SolutionStep key={idx} step={step} index={idx} />
                    ))}
                    
                    {solution.part_a_answer && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 mt-4">
                        <h5 className="font-bold text-green-900 mb-2">Answer (a):</h5>
                        <div className="space-y-2">
                          {Object.entries(solution.part_a_answer).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-3">
                              <MathDisplay content={String(value)} display />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Part B - Only show if exists */}
                {hasPart('b') && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">b</span>
                      Part (b)
                    </h4>
                    {solution.part_b_steps.map((step, idx) => (
                      <SolutionStep key={idx} step={step} index={idx} />
                    ))}
                    
                    {solution.part_b_answer && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 mt-4">
                        <h5 className="font-bold text-green-900 mb-2">Answer (b):</h5>
                        <div className="space-y-2">
                          {Object.entries(solution.part_b_answer).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-3">
                              <MathDisplay content={String(value)} display />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Part C - Only show if exists */}
                {hasPart('c') && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">c</span>
                      Part (c)
                    </h4>
                    {solution.part_c_steps.map((step, idx) => (
                      <SolutionStep key={idx} step={step} index={idx} />
                    ))}
                    
                    {solution.part_c_answer && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 mt-4">
                        <h5 className="font-bold text-green-900 mb-2">Answer (c):</h5>
                        <div className="space-y-2">
                          {Object.entries(solution.part_c_answer).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-3">
                              <MathDisplay content={String(value)} display />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Single Part Question */}
                {!isMultiPart && solution.steps && (
                  <>
                    {solution.steps.map((step, idx) => (
                      <SolutionStep key={idx} step={step} index={idx} />
                    ))}
                    
                    {/* Final Answer */}
                    {solution.final_answer && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 mt-6">
                        <div className="flex items-center gap-3 mb-3">
                          <FaCheckCircle className="text-green-600 text-2xl" />
                          <h4 className="text-xl font-bold text-gray-900">Final Answer</h4>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          {typeof solution.final_answer === 'object' ? (
                            <div className="space-y-3">
                              {Object.entries(solution.final_answer).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-600 uppercase mb-1">
                                    {key.replace(/_/g, ' ')}:
                                  </span>
                                  <div className="text-2xl text-green-700 font-bold">
                                    <MathDisplay content={String(value)} display />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-2xl text-green-700 font-bold">
                              <MathDisplay content={String(solution.final_answer)} display />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Verification - Only show if has content */}
                {solution.verification && solution.verification.method && solution.verification.method !== "N/A" && (
                  <div className={`mt-6 rounded-xl p-5 border-2 ${
                    solution.verification.passes 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {solution.verification.passes ? (
                        <FaCheckCircle className="text-green-600 text-2xl" />
                      ) : (
                        <FaTimesCircle className="text-red-600 text-2xl" />
                      )}
                      <h4 className="text-xl font-bold text-gray-900">Verification Check</h4>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Method:</p>
                        <p className="text-gray-700">{solution.verification.method}</p>
                      </div>
                      
                      {solution.verification.working && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Working:</p>
                          <div className="bg-gray-50 p-3 rounded">
                            <MathDisplay content={solution.verification.working} display />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Result:</p>
                        <p className="text-lg font-bold text-gray-900">{solution.verification.result}</p>
                        {solution.verification.error_percentage && (
                          <span className="text-sm text-gray-600 ml-2">
                            (Error: {solution.verification.error_percentage})
                          </span>
                        )}
                      </div>

                      {solution.verification.interpretation && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Interpretation:</p>
                          <p className="text-gray-700">{solution.verification.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Concepts */}
              {solution.key_concepts && solution.key_concepts.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaBook className="text-blue-600 text-2xl" />
                    <h4 className="text-xl font-bold text-gray-900">Key A-Level Concepts</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {solution.key_concepts.map((concept, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes */}
              {solution.common_mistakes && solution.common_mistakes.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaExclamationTriangle className="text-red-600 text-2xl" />
                    <h4 className="text-xl font-bold text-gray-900">Common Mistakes to Avoid</h4>
                  </div>
                  <ul className="space-y-2">
                    {solution.common_mistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">✗</span>
                        <span className="text-gray-700">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam Technique */}
              {solution.exam_technique && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaGraduationCap className="text-purple-600 text-2xl" />
                    <h4 className="text-xl font-bold text-gray-900">Exam Technique</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{solution.exam_technique}</p>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
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