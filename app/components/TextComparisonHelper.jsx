// app/components/TextComparisonHelper.jsx
"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaExpand, FaCompress } from "react-icons/fa";

const TextComparisonHelper = ({ imageUrl, extractedText, onTextChange, title, confidence }) => {
  const [showImage, setShowImage] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Common OCR mistakes to highlight
  const commonMistakes = [
    { wrong: '0', right: 'O', type: 'Zero vs Letter O' },
    { wrong: '1', right: 'l', type: 'One vs lowercase L' },
    { wrong: '5', right: 'S', type: 'Five vs Letter S' },
    { wrong: '8', right: 'B', type: 'Eight vs Letter B' },
    { wrong: 'x', right: '×', type: 'x vs multiplication' },
    { wrong: '-', right: '−', type: 'Hyphen vs minus' },
    { wrong: '^', right: '²', type: 'Caret vs superscript' },
  ];

  const detectPotentialErrors = (text) => {
    const warnings = [];
    
    // Check for common OCR confusions
    if (text.includes('O') && /\d/.test(text)) {
      warnings.push("⚠️ Contains 'O' - might be zero (0)?");
    }
    if (text.includes('l') && /\d/.test(text)) {
      warnings.push("⚠️ Contains 'l' - might be one (1)?");
    }
    if (text.includes('x') && text.includes('×')) {
      warnings.push("⚠️ Mixed 'x' and '×' - check multiplication signs");
    }
    if (!text.includes('²') && text.includes('^2')) {
      warnings.push("💡 Use ² instead of ^2 for better formatting");
    }
    
    return warnings;
  };

  const warnings = detectPotentialErrors(extractedText);

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    } ${confidence < 0.7 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded font-semibold ${
              confidence >= 0.9 ? 'bg-green-500' :
              confidence >= 0.7 ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}>
              {Math.round(confidence * 100)}% Confidence
            </span>
            {warnings.length > 0 && (
              <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded">
                {warnings.length} warnings
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImage(!showImage)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white transition-colors"
            title={showImage ? "Hide image" : "Show image"}
          >
            {showImage ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`grid ${showImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4 p-4`}>
        {/* Original Image */}
        {showImage && imageUrl && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Original Image:</p>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-gray-500 italic">
              Tip: Compare this with the text below character by character
            </p>
          </div>
        )}

        {/* Extracted/Editable Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Extracted Text:</p>
            <span className="text-xs text-gray-500">{extractedText.length} chars</span>
          </div>
          
          <textarea
            value={extractedText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full h-64 lg:h-96 p-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
            placeholder="Edit the extracted text here..."
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 space-y-1">
              <p className="text-xs font-bold text-yellow-900">Potential Issues:</p>
              {warnings.map((warning, idx) => (
                <p key={idx} className="text-xs text-yellow-800">{warning}</p>
              ))}
            </div>
          )}

          {/* Quick Fix Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const newText = extractedText
                  .replace(/O(?=\d)/g, '0')
                  .replace(/(?<=\d)O/g, '0');
                onTextChange(newText);
              }}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix O → 0
            </button>
            <button
              onClick={() => {
                const newText = extractedText.replace(/\^2/g, '²').replace(/\^3/g, '³');
                onTextChange(newText);
              }}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix Powers (² ³)
            </button>
            <button
              onClick={() => {
                const newText = extractedText.replace(/x(?=\s*[=\d])/g, '×');
                onTextChange(newText);
              }}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix × symbols
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <details className="text-sm">
          <summary className="font-semibold text-gray-700 cursor-pointer hover:text-indigo-600">
            Common OCR Issues & Quick Fixes
          </summary>
          <div className="mt-3 space-y-2 text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                  <span className="font-mono font-bold text-red-600">{mistake.wrong}</span>
                  <span>→</span>
                  <span className="font-mono font-bold text-green-600">{mistake.right}</span>
                  <span className="text-xs text-gray-500">({mistake.type})</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default TextComparisonHelper;