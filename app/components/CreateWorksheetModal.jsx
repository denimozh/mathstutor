"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaMagic } from "react-icons/fa";

const CreateWorksheetModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState("existing"); // 'existing' or 'ai'
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Silver");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Available topics (you can fetch these from DB later)
  const availableTopics = [
    "Algebra",
    "Differentiation",
    "Integration",
    "Trigonometry",
    "Statistics",
    "Mechanics",
    "Vectors",
    "Probability"
  ];

  const handleTopicToggle = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleCreate = async () => {
    setError("");
    
    if (mode === "existing" && selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    if (mode === "ai" && !title.trim()) {
      setError("Please enter a title for your worksheet");
      return;
    }

    setLoading(true);

    try {
      const body = mode === "existing" 
        ? {
            topics: selectedTopics,
            number_of_questions: numberOfQuestions,
            difficulty,
            title: title || `${selectedTopics.join(", ")} Practice`
          }
        : {
            title,
            number_of_questions: numberOfQuestions,
            difficulty,
            generate_with_ai: true,
            topics: selectedTopics // For AI mode, topics help guide generation
          };

      const res = await fetch("/api/worksheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create worksheet");
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMode("existing");
    setSelectedTopics([]);
    setNumberOfQuestions(5);
    setDifficulty("Silver");
    setTitle("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Worksheet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Worksheet Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("existing")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  mode === "existing"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaPlus className="mx-auto mb-2 text-indigo-600" size={24} />
                <p className="font-semibold text-gray-900">From My Questions</p>
                <p className="text-xs text-gray-500 mt-1">Use questions you've already solved</p>
              </button>
              
              <button
                onClick={() => setMode("ai")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  mode === "ai"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaMagic className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="font-semibold text-gray-900">AI Generated</p>
                <p className="text-xs text-gray-500 mt-1">Create custom exam-style questions</p>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Worksheet Title {mode === "ai" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={mode === "ai" ? "e.g., Algebra Practice Set 1" : "Optional: Custom title"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topics {mode === "existing" && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            {mode === "existing" && selectedTopics.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">Select topics to include in your worksheet</p>
            )}
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="20"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-indigo-600 min-w-[3ch] text-center">
                {numberOfQuestions}
              </span>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Bronze", "Silver", "Gold"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    difficulty === level
                      ? level === "Bronze"
                        ? "bg-yellow-100 border-2 border-yellow-600 text-yellow-900"
                        : level === "Silver"
                        ? "bg-slate-100 border-2 border-slate-600 text-slate-900"
                        : "bg-amber-100 border-2 border-amber-600 text-amber-900"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Info Box for AI Mode */}
          {mode === "ai" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>AI Generation:</strong> The AI will create brand new exam-style questions based on your selected topics and difficulty level. This feature will be available once AI integration is complete.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || (mode === "existing" && selectedTopics.length === 0)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                {mode === "ai" ? <FaMagic /> : <FaPlus />}
                Create Worksheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorksheetModal;