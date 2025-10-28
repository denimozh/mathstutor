// /app/history/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Bottombar from "@/app/components/Bottombar";
import Sidebar from "@/app/components/Sidebar";

const HistoryPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-full h-screen flex flex-row bg-white">
      <div className="w-fit 2xl:w-[15%] h-full hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      <div className="flex flex-col w-full h-full min-w-0 gap-5 p-6 overflow-y-auto">
        <p className="text-3xl font-semibold text-gray-800">History</p>

        {loading ? (
          <p className="text-gray-500">Loading your questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500">No past questions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">
                    {new Date(q.created_at).toLocaleDateString()}{" "}
                    {new Date(q.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {q.is_correct !== null && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        q.is_correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {q.is_correct ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>

                <p className="font-medium text-gray-900 mb-1">{q.topic || "Untitled Topic"}</p>
                <p className="text-gray-700 mb-2 line-clamp-3">{q.text}</p>

                {q.image_url && (
                  <img
                    src={q.image_url}
                    alt="Question image"
                    className="rounded-lg mt-2 w-full h-40 object-cover"
                  />
                )}

                <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
                  <p>⏱ {q.time_spent_seconds ?? 0}s</p>
                  <p className="capitalize">📘 {q.difficulty || "medium"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
