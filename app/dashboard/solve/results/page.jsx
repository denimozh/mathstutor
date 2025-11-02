"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaCheckCircle, 
  FaLightbulb, 
  FaTimesCircle,
  FaExclamationTriangle,
  FaBook,
  FaGraduationCap,
  FaChartLine,
  FaAward,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";

const SolveResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");
  
  const [question, setQuestion] = useState(null);
  const [solution, setSolution] = useState(null);
  const [workAnalysis, setWorkAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingWork, setAnalyzingWork] = useState(false);
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
        
        // Check if we have work analysis
        if (data.data.work_analysis) {
          setWorkAnalysis(data.data.work_analysis);
        }
        
        if (data.data.ai_solution) {
          setSolution(data.data.ai_solution);
        } else {
          await generateAISolution(data.data);
        }

        // If we have mark scheme and student work but no analysis, trigger it
        if (data.data.mark_scheme_text && data.data.student_work_text && !data.data.work_analysis) {
          await analyzeStudentWork();
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

  const analyzeStudentWork = async () => {
    if (!question?.mark_scheme_text || !question?.student_work_text) {
      return;
    }

    setAnalyzingWork(true);
    try {
      const res = await fetch('/api/solutions/analyze-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questionId
        })
      });

      const data = await res.json();
      if (data.success) {
        setWorkAnalysis(data.analysis);
        setIsCorrect(data.marks.awarded === data.marks.total);
      }
    } catch (err) {
      console.error('Error analyzing work:', err);
    } finally {
      setAnalyzingWork(false);
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

      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-screen">
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

            {/* Show Mark Scheme if available */}
            {question.mark_scheme_url && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaBook className="text-purple-600" />
                  Mark Scheme
                </h3>
                <img
                  src={question.mark_scheme_url}
                  alt="Mark Scheme"
                  className="max-w-full h-auto rounded-lg border border-purple-200"
                />
              </div>
            )}

            {/* Show Student Work if available */}
            {question.student_work_url && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaEdit className="text-green-600" />
                  Your Work
                </h3>
                <img
                  src={question.student_work_url}
                  alt="Student Work"
                  className="max-w-full h-auto rounded-lg border border-green-200"
                />
              </div>
            )}

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

          {/* WORK ANALYSIS SECTION - NEW! */}
          {question.mark_scheme_text && question.student_work_text && (
            <div className="mb-6">
              {analyzingWork ? (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-indigo-900">Analyzing your work...</p>
                  <p className="text-sm text-indigo-700 mt-2">Comparing against mark scheme</p>
                </div>
              ) : workAnalysis ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
                  {/* Marks Summary */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl">
                      <FaAward className="text-white text-3xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">Work Analysis Results</h3>
                      <p className="text-gray-600">Compared against official mark scheme</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-purple-600">
                        {workAnalysis.marks_awarded}/{workAnalysis.total_marks}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((workAnalysis.marks_awarded / workAnalysis.total_marks) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Overall Assessment */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-2">📋 Overall Assessment</h4>
                    <p className="text-gray-700">{workAnalysis.overall_assessment}</p>
                  </div>

                  {/* Errors Found */}
                  {workAnalysis.errors && workAnalysis.errors.length > 0 && (
                    <div className="bg-white rounded-xl p-4 mb-4 border border-red-200">
                      <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <FaTimes className="text-red-600" />
                        Errors Identified ({workAnalysis.errors.length})
                      </h4>
                      <div className="space-y-4">
                        {workAnalysis.errors.map((error, idx) => (
                          <div key={idx} className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-red-900">{error.location}</span>
                                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-semibold">
                                    -{error.marks_lost} marks
                                  </span>
                                </div>
                                
                                <div className="mb-2">
                                  <p className="text-xs font-semibold text-gray-600 mb-1">YOU WROTE:</p>
                                  <code className="block bg-white p-2 rounded border border-red-300 text-red-900 text-sm">
                                    {error.student_wrote}
                                  </code>
                                </div>

                                <div className="mb-2">
                                  <p className="text-xs font-semibold text-gray-600 mb-1">ERROR TYPE:</p>
                                  <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                    {error.error_type}
                                  </span>
                                </div>

                                <div className="mb-2">
                                  <p className="text-xs font-semibold text-gray-600 mb-1">EXPLANATION:</p>
                                  <p className="text-gray-700 text-sm">{error.explanation}</p>
                                </div>

                                <div className="bg-green-50 border border-green-300 rounded p-3 mt-3">
                                  <p className="text-xs font-semibold text-green-800 mb-1">✓ CORRECT APPROACH:</p>
                                  <p className="text-green-900 text-sm">{error.correct_approach}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What Was Correct */}
                  {workAnalysis.what_was_correct && workAnalysis.what_was_correct.length > 0 && (
                    <div className="bg-white rounded-xl p-4 mb-4 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <FaCheck className="text-green-600" />
                        What You Got Right
                      </h4>
                      <ul className="space-y-2">
                        {workAnalysis.what_was_correct.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-green-800">
                            <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detailed Corrections */}
                  {workAnalysis.detailed_corrections && (
                    <div className="bg-white rounded-xl p-4 mb-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <FaEdit className="text-blue-600" />
                        Detailed Corrections
                      </h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{workAnalysis.detailed_corrections}</p>
                      </div>
                    </div>
                  )}

                  {/* Examiner Feedback */}
                  {workAnalysis.examiner_feedback && (
                    <div className="bg-white rounded-xl p-4 mb-4 border border-indigo-200">
                      <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-indigo-600" />
                        Examiner Feedback
                      </h4>
                      <p className="text-gray-700">{workAnalysis.examiner_feedback}</p>
                    </div>
                  )}

                  {/* Tips to Avoid Mistakes */}
                  {workAnalysis.tips_to_avoid_mistakes && workAnalysis.tips_to_avoid_mistakes.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-amber-200">
                      <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                        <FaLightbulb className="text-amber-600" />
                        Tips to Avoid These Mistakes
                      </h4>
                      <ul className="space-y-2">
                        {workAnalysis.tips_to_avoid_mistakes.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-amber-900">
                            <span className="text-amber-600 font-bold mt-1">→</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={analyzeStudentWork}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaChartLine />
                  Analyze My Work Against Mark Scheme
                </button>
              )}
            </div>
          )}

          {/* Regular AI Solution (if no work analysis or as supplement) */}
          {solution && !workAnalysis && (
            <>
              {/* Warning Badges */}
              {solution.warning && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">Verification Warning</h4>
                    <p className="text-yellow-800 text-sm">{solution.warning}</p>
                  </div>
                </div>
              )}

              {solution.was_corrected && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4 flex items-start gap-3">
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
              <div className="flex items-center gap-3 mb-6">
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

              {/* Solution Steps */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-600 p-3 rounded-lg">
                    <FaEdit className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Step-by-Step Solution</h3>
                    <p className="text-sm text-gray-600">
                      Explained by your AI A-Level tutor
                    </p>
                  </div>
                </div>

                {solution.steps?.map((step) => (
                  <div key={step.step} className="bg-white rounded-xl p-5 mb-4 border border-indigo-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                        
                        {step.explanation && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-500 font-semibold mb-1">WHY:</p>
                            <p className="text-gray-700">{step.explanation}</p>
                          </div>
                        )}

                        {step.working && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-500 font-semibold mb-1">WORKING:</p>
                            <div className="bg-gray-50 border-l-4 border-indigo-400 p-3 rounded">
                              <code className="text-gray-800 font-mono text-sm whitespace-pre-wrap">
                                {step.working}
                              </code>
                            </div>
                          </div>
                        )}

                        {step.formula && (
                          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded">
                            <code className="text-indigo-900 font-mono font-semibold">
                              {step.formula}
                            </code>
                          </div>
                        )}

                        {step.exam_tip && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                              <FaLightbulb className="text-amber-600" />
                              Exam Tip:
                            </p>
                            <p className="text-sm text-amber-900 mt-1">{step.exam_tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final Answer */}
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
                            <code className="text-2xl text-green-700 font-mono font-bold">
                              {String(value)}
                            </code>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <code className="text-2xl text-green-700 font-mono font-bold">
                        {String(solution.final_answer)}
                      </code>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Concepts */}
              {solution.key_concepts && solution.key_concepts.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
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
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
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
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
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