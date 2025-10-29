"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Bottombar from "@/app/components/Bottombar";
import Sidebar from "@/app/components/Sidebar";
import { FaArrowLeft, FaCheck, FaTimes, FaPrint, FaDownload } from "react-icons/fa";

export default function WorksheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.id;

  const [worksheet, setWorksheet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedQuestions, setCompletedQuestions] = useState({});

  useEffect(() => {
    if (worksheetId) {
      fetchWorksheet();
    }
  }, [worksheetId]);

  const fetchWorksheet = async () => {
    try {
      const res = await fetch(`/api/worksheet/${worksheetId}`);
      const data = await res.json();

      if (data.success) {
        setWorksheet(data.data);
        setQuestions(data.data.questions || []);
        
        // Initialize completed status from struggled flags
        const completed = {};
        data.data.questions?.forEach(q => {
          completed[q.id] = q.struggled !== null ? !q.struggled : null;
        });
        setCompletedQuestions(completed);
      }
    } catch (err) {
      console.error("Error loading worksheet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkQuestion = async (questionId, understood) => {
    setCompletedQuestions(prev => ({
      ...prev,
      [questionId]: understood
    }));

    // Update in database
    try {
      await fetch(`/api/question/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ struggled: !understood })
      });
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
        <div className="w-fit 2xl:w-[15%] h-screen hidden md:block print:hidden">
          <Sidebar />
        </div>
        <Bottombar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading worksheet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="w-full h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
        <div className="w-fit 2xl:w-[15%] h-screen hidden md:block print:hidden">
          <Sidebar />
        </div>
        <Bottombar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Worksheet not found</p>
            <button
              onClick={() => router.push("/dashboard/worksheet")}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const completedCount = Object.values(completedQuestions).filter(v => v === true).length;
  const struggledCount = Object.values(completedQuestions).filter(v => v === false).length;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* Sidebar - Hidden on print */}
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block print:hidden">
        <Sidebar />
      </div>
      <Bottombar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 print:bg-white pb-20 md:pb-0">{/* Added pb-20 for mobile bottom bar space */}
        {/* Action Bar - Hidden on print */}
        <div className="bg-white border-b border-gray-200 p-3 md:p-4 print:hidden sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              onClick={() => router.push("/dashboard/worksheet")}
              className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
            >
              <FaArrowLeft />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="text-xs md:text-sm text-gray-600">
                Progress: <span className="font-bold text-indigo-600">{completedCount}/{totalQuestions}</span>
              </div>
              <button
                onClick={handlePrint}
                className="cursor-pointer px-3 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FaPrint />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Exam Paper */}
        <div className="p-4 md:p-8 print:p-0">
          <div className="max-w-5xl mx-auto bg-white print:shadow-none shadow-lg">
            {/* Exam Header */}
            <div className="border-2 md:border-4 border-black p-3 md:p-6 print:border-2">
              {/* Top Box */}
              <div className="border-2 border-black p-2 md:p-4 mb-3 md:mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="border border-black p-2">
                    <p className="text-xs font-semibold mb-1">Candidate surname</p>
                  </div>
                  <div className="border border-black p-2">
                    <p className="text-xs font-semibold mb-1">Other names</p>
                  </div>
                </div>

                <div className="mb-3 md:mb-4">
                  <h1 className="text-xl md:text-3xl font-bold mb-2">Practice Worksheet</h1>
                  <h2 className="text-lg md:text-2xl font-bold">A-Level Mathematics</h2>
                </div>

                <div className="border-2 border-black p-2 md:p-3 mb-3 md:mb-4">
                  <p className="text-lg md:text-2xl font-bold">
                    {new Date().toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                  <div className="border border-black p-2">
                    <p className="text-xs md:text-sm">Time: {Math.ceil(totalQuestions * 1.5)} minutes</p>
                  </div>
                  <div className="border border-black p-2">
                    <p className="text-xs md:text-sm font-semibold">Paper Reference: {worksheet.difficulty || 'CUSTOM'}</p>
                  </div>
                </div>

                <div className="border-2 border-black p-3 md:p-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Mathematics</h3>
                  <p className="font-bold text-sm md:text-base">{worksheet.title || 'Custom Practice Worksheet'}</p>
                  <p className="text-xs md:text-sm mt-2">Paper 1: Pure Mathematics</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="border-2 border-black p-3 md:p-4">
                <h4 className="font-bold mb-2 text-base md:text-lg">Instructions</h4>
                <ul className="space-y-1 text-xs md:text-sm list-disc list-inside">
                  <li>Use <strong>black</strong> ink or ball-point pen.</li>
                  <li>Answer <strong>all</strong> questions and ensure your answers are clearly labelled.</li>
                  <li>Answer the questions in the spaces provided.</li>
                  <li>You should show sufficient working to make your methods clear.</li>
                  <li>Answers without working may not gain full credit.</li>
                  <li>Answers should be given to three significant figures unless otherwise stated.</li>
                </ul>

                <h4 className="font-bold mt-3 md:mt-4 mb-2 text-base md:text-lg">Information</h4>
                <ul className="space-y-1 text-xs md:text-sm list-disc list-inside">
                  <li>There are {totalQuestions} questions in this worksheet.</li>
                  <li>The total mark for this paper is {totalQuestions * 5}.</li>
                  <li>A calculator may be used for this paper.</li>
                </ul>
              </div>
            </div>

            {/* Questions */}
            <div className="p-4 md:p-8 print:p-6">
              <div className="border-t-2 border-black mb-4 md:mb-6"></div>
              
              <p className="font-bold text-center mb-6 md:mb-8 text-sm md:text-lg">
                Answer ALL questions. Write your answers in the spaces provided.
              </p>

              <div className="space-y-8 md:space-y-12">
                {questions.map((question, index) => (
                  <div key={question.id} className="page-break-inside-avoid">
                    {/* Question Number and Marks */}
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{index + 1}.</h3>
                      <div className="text-right">
                        <div className="border-2 border-black px-2 md:px-3 py-1 inline-block">
                          <span className="font-bold text-sm md:text-base">({Math.floor(Math.random() * 3) + 3})</span>
                        </div>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="ml-4 md:ml-8">
                      {/* Question Text */}
                      {question.text && (
                        <p className="mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
                          {question.text}
                        </p>
                      )}

                      {/* Question Image */}
                      {question.image_url && (
                        <div className="mb-4 md:mb-6 border border-gray-300 p-2 bg-gray-50">
                          <img
                            src={question.image_url}
                            alt={`Question ${index + 1}`}
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}

                      {/* Answer Space - Hidden on print unless you want lines */}
                      <div className="print:hidden">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-3 md:mb-4">
                          <p className="text-xs md:text-sm text-blue-800 font-semibold mb-2">
                            Did you understand this question?
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                            <button
                              onClick={() => handleMarkQuestion(question.id, true)}
                              className={`cursor-pointer flex-1 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                                completedQuestions[question.id] === true
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400"
                              }`}
                            >
                              <FaCheck />
                              Yes, understood
                            </button>
                            <button
                              onClick={() => handleMarkQuestion(question.id, false)}
                              className={`cursor-pointer flex-1 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                                completedQuestions[question.id] === false
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400"
                              }`}
                            >
                              <FaTimes />
                              Need more practice
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Answer Lines for Print */}
                      <div className="hidden print:block">
                        <div className="space-y-4">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="border-b border-gray-300 h-8"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Question Separator */}
                    {index < questions.length - 1 && (
                      <div className="border-t border-gray-300 mt-6 md:mt-8"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* End of Paper */}
              <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t-2 border-black">
                <p className="text-center font-bold text-base md:text-lg">END</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card - Hidden on print */}
        <div className="max-w-5xl mx-auto p-4 md:p-8 print:hidden">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">Worksheet Summary</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalQuestions}</p>
                <p className="text-xs md:text-sm text-gray-600">Total Questions</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                <p className="text-2xl md:text-3xl font-bold text-green-600">{completedCount}</p>
                <p className="text-xs md:text-sm text-gray-600">Understood</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg">
                <p className="text-2xl md:text-3xl font-bold text-red-600">{struggledCount}</p>
                <p className="text-xs md:text-sm text-gray-600">Need Practice</p>
              </div>
            </div>
            
            {struggledCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
                <p className="text-amber-800 font-semibold mb-2 text-sm md:text-base">📚 Recommendation</p>
                <p className="text-xs md:text-sm text-amber-700">
                  You marked {struggledCount} question{struggledCount > 1 ? 's' : ''} for more practice. 
                  Consider creating a follow-up worksheet focusing on these topics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .page-break-inside-avoid {
            page-break-inside: avoid;
          }

          /* Hide all navigation elements when printing */
          nav,
          [class*="Sidebar"],
          [class*="Bottombar"],
          [class*="bottombar"],
          [class*="bottom-bar"],
          [class*="navigation"],
          footer,
          header,
          aside {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }

          /* Ensure only main content shows */
          body > *:not(.print\\:block) {
            overflow: visible !important;
          }

          /* Remove any fixed/sticky positioning */
          * {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}