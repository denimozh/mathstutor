"use client";
import React, { useState, DragEvent } from "react";

export default function QuestionInput() {
  const [questionText, setQuestionText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [struggled, setStruggled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

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
          headers: { "Content-Type": "application/json", },
          
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
          isDragging ? "border-violet-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        {imageFile ? (
          <div className="space-y-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
              className="mx-auto max-h-40 rounded-lg"
            />
            <p className="text-sm text-gray-600">{imageFile.name}</p>
          </div>
        ) : (
          <p className="text-gray-600">
            Drag & drop an image here, or{" "}
            <label className="text-blue-600 cursor-pointer hover:underline">
              click to upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </p>
        )}
      </div>

      {/* Text question */}
      <textarea
        placeholder="Or type your question here..."
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
        rows={3}
      />

      {/* Topic input */}
      <input
        type="text"
        placeholder="Topic (optional)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {/* Solve button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full cursor-pointer bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Solve"}
      </button>

      {/* Response */}
      {response && (
        <div
          className={`p-4 rounded-xl mt-4 ${
            response.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <p className="font-medium text-gray-800">
            {response.success ? "Success ✅ Tutor is answering..." : "Error ❌"}
          </p>
        </div>
      )}
    </div>
  );
}
