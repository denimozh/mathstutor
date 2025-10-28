"use client";
import React, { useState } from "react";

export default function QuestionInput() {
  const [questionText, setQuestionText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [struggled, setStruggled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const topics = [
    { name: "Algebra", icon: "📐" },
    { name: "Calculus", icon: "📊" },
    { name: "Geometry", icon: "📏" },
    { name: "Trigonometry", icon: "📐" },
    { name: "Statistics", icon: "📈" },
  ];

  const exampleProblems = [
    {
      icon: "📐",
      title: "Quadratic Equations",
      description: "Solve x² + 5x + 6 = 0",
      topic: "Algebra"
    },
    {
      icon: "📊",
      title: "Derivatives",
      description: "Find d/dx of x³ + 2x²",
      topic: "Calculus"
    },
    {
      icon: "📏",
      title: "Triangle Problems",
      description: "Find the area using base & height",
      topic: "Geometry"
    }
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleChipClick = (topicName) => {
    setSelectedChip(topicName);
    setTopic(topicName);
  };

  const handleExampleClick = (example) => {
    setQuestionText(example.description);
    setTopic(example.topic);
    setSelectedChip(example.topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!questionText && !imageFile) {
      alert("Please enter a question or upload an image.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      let res;
      // --- IMAGE-BASED QUESTION ---
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("topic", topic || "Unknown");
        formData.append("struggled", String(struggled));

        res = await fetch("/api/solve", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }
      // --- TEXT-BASED QUESTION ---
      else {
        res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: questionText,
            topic: topic || "Unknown",
            struggled,
          }),
        });
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Main Input Card */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg space-y-6">
        {/* Enhanced Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all duration-300 cursor-pointer hover:border-violet-500 hover:bg-violet-50 ${
            isDragging ? "border-violet-500 bg-violet-50 scale-[1.02]" : "border-gray-300 bg-gray-50"
          }`}
        >
          {imageFile ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="mx-auto max-h-48 rounded-lg shadow-md"
              />
              <p className="text-sm font-medium text-green-600">✓ {imageFile.name} uploaded</p>
              <p className="text-xs text-gray-500">Click to upload a different file</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-700 text-base">
                Drag & drop an image here, or{" "}
                <label className="text-violet-600 font-medium cursor-pointer hover:text-violet-700 hover:underline">
                  click to upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">Supports PNG, JPG, PDF • Max 10MB</p>
            </div>
          )}
        </div>

        {/* Text Question Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or type your question
          </label>
          <textarea
            placeholder="e.g., Solve for x: 2x² + 5x - 3 = 0"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            rows={4}
          />
        </div>

        {/* Topic Chips */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.name}
                onClick={() => handleChipClick(t.name)}
                className={`cursor-pointer px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200 hover:scale-105 ${
                  selectedChip === t.name
                    ? "bg-violet-500 border-violet-500 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-violet-500 hover:bg-violet-50"
                }`}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or specify a topic (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., quadratic equations, derivatives, Pythagorean theorem"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer w-full bg-violet-600 text-white py-4 rounded-xl font-semibold text-base hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? "🔄 Solving..." : "✨ Solve Problem"}
        </button>

        {/* Response */}
        {response && (
          <div
            className={`p-4 rounded-xl ${
              response.success
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}
          >
            <p className="font-medium text-gray-800">
              {response.success ? "Success ✅ Tutor is answering..." : "Error ❌"}
            </p>
            {response.message && (
              <p className="text-sm text-gray-600 mt-1">{response.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Example Problems Section */}
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">
          Try These Popular Problems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleProblems.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="bg-white cursor-pointer rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-violet-500 text-left"
            >
              <div className="text-4xl mb-3">{example.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{example.title}</h4>
              <p className="text-sm text-gray-600">{example.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}