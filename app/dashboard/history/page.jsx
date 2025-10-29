// /app/dashboard/history/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bottombar from "@/app/components/Bottombar";
import Sidebar from "@/app/components/Sidebar";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const HistoryPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
        }
      } catch (err) {
        console.error("Error loading questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleCardClick = (questionId) => {
    router.push(`/dashboard/solve/results?id=${questionId}`);
  };

  const handleImageError = (questionId) => {
    setImageErrors(prev => ({ ...prev, [questionId]: true }));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
        <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
          <Sidebar />
        </div>
        <Bottombar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading your history...</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Question History</h1>
            <p className="text-gray-600">
              View all your past questions and solutions • {questions.length} total questions
            </p>
          </div>

          {/* Questions Grid */}
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FaEye className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Start solving questions to build your history and track your progress.
              </p>
              <button
                onClick={() => router.push("/dashboard/solve")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Solve Your First Question
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {questions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleCardClick(q.id)}
                  className="group border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-200 bg-white cursor-pointer"
                >
                  {/* Header with Date and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(q.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(q.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {q.topic || "General"}
                        </span>
                        {q.struggled && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            Struggled
                          </span>
                        )}
                      </div>
                    </div>
                    {q.is_correct !== null && (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        q.is_correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {q.is_correct ? (
                          <>
                            <FaCheckCircle size={12} />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle size={12} />
                            <span>Incorrect</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Text */}
                  {q.text && (
                    <p className="text-gray-700 mb-3 line-clamp-2 text-sm">
                      {q.text}
                    </p>
                  )}

                  {/* Question Image */}
                  {q.image_url && !imageErrors[q.id] ? (
                    <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={q.image_url}
                        alt="Question"
                        onError={(e) => {
                          console.error('Image failed to load:', q.image_url);
                          handleImageError(q.id);
                        }}
                        onLoad={() => console.log('Image loaded successfully:', q.image_url)}
                        className="w-full h-48 object-contain bg-white group-hover:scale-105 transition-transform duration-200"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : q.image_url && imageErrors[q.id] ? (
                    <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Image failed to load</p>
                        <a 
                          href={q.image_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-indigo-600 hover:underline mt-1 block"
                        >
                          Open image in new tab
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Footer with Stats */}
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        ⏱️ {q.time_spent_seconds || 0}s
                      </span>
                      <span className="text-gray-600 capitalize">
                        📘 {q.difficulty || "medium"}
                      </span>
                    </div>
                    <button className="text-indigo-600 font-semibold text-sm group-hover:text-indigo-700 flex items-center gap-1">
                      View Solution
                      <FaEye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;