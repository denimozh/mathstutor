// app/components/TextComparisonHelper.jsx
"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaExpand, FaCompress } from "react-icons/fa";

const TextComparisonHelper = ({ imageUrl, extractedText, onTextChange, title, confidence }) => {
  const [showImage, setShowImage] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Math symbols toolbar
  const mathSymbols = [
    { symbol: '×', label: 'multiply' },
    { symbol: '÷', label: 'divide' },
    { symbol: '±', label: 'plus-minus' },
    { symbol: '≤', label: 'less-equal' },
    { symbol: '≥', label: 'greater-equal' },
    { symbol: '≠', label: 'not-equal' },
    { symbol: '≈', label: 'approx' },
    { symbol: '∞', label: 'infinity' },
    { symbol: '²', label: 'squared' },
    { symbol: '³', label: 'cubed' },
    { symbol: '√', label: 'sqrt' },
    { symbol: '∛', label: 'cbrt' },
    { symbol: 'π', label: 'pi' },
    { symbol: 'θ', label: 'theta' },
    { symbol: 'α', label: 'alpha' },
    { symbol: 'β', label: 'beta' },
    { symbol: 'Δ', label: 'delta' },
    { symbol: '∑', label: 'sum' },
    { symbol: '∫', label: 'integral' },
    { symbol: '½', label: '1/2' },
    { symbol: '⅓', label: '1/3' },
    { symbol: '¼', label: '1/4' },
    { symbol: '⅔', label: '2/3' },
    { symbol: '¾', label: '3/4' },
  ];

  const insertSymbol = (symbol) => {
    // Insert at cursor position or end
    const textarea = document.getElementById(`textarea-${title}`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = extractedText.substring(0, start) + symbol + extractedText.substring(end);
      onTextChange(newText);
      
      // Set cursor position after inserted symbol
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 0);
    } else {
      onTextChange(extractedText + symbol);
    }
  };

  const detectPotentialErrors = (text) => {
    const warnings = [];
    
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
      isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''
    } ${confidence < 0.7 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
              confidence >= 0.9 ? 'bg-green-500' :
              confidence >= 0.7 ? 'bg-yellow-500' :
              'bg-red-500'
            } text-white`}>
              {Math.round(confidence * 100)}%
            </span>
            {warnings.length > 0 && (
              <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-0.5 rounded">
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
            {showImage ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`grid ${showImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-3 p-3`}>
        {/* Original Image - SMALLER */}
        {showImage && imageUrl && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Original Image:</p>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 max-h-64">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-contain max-h-60"
              />
            </div>
          </div>
        )}

        {/* Extracted/Editable Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">Extracted Text:</p>
            <span className="text-xs text-gray-500">{extractedText.length} chars</span>
          </div>

          {/* Math Symbols Toolbar */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-700 mb-2">Math Symbols:</p>
            <div className="flex flex-wrap gap-1">
              {mathSymbols.map((item) => (
                <button
                  key={item.label}
                  onClick={() => insertSymbol(item.symbol)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-indigo-50 hover:border-indigo-400 text-sm font-mono transition-colors"
                  title={item.label}
                >
                  {item.symbol}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            id={`textarea-${title}`}
            value={extractedText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full h-48 p-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
            placeholder="Edit the extracted text here..."
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 space-y-1">
              <p className="text-xs font-bold text-yellow-900">Potential Issues:</p>
              {warnings.map((warning, idx) => (
                <p key={idx} className="text-xs text-yellow-800">{warning}</p>
              ))}
            </div>
          )}

          {/* Quick Fix Buttons */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                const newText = extractedText
                  .replace(/O(?=\d)/g, '0')
                  .replace(/(?<=\d)O/g, '0');
                onTextChange(newText);
              }}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix O → 0
            </button>
            <button
              onClick={() => {
                const newText = extractedText
                  .replace(/\^2/g, '²')
                  .replace(/\^3/g, '³')
                  .replace(/\^4/g, '⁴')
                  .replace(/\^5/g, '⁵');
                onTextChange(newText);
              }}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix Powers
            </button>
            <button
              onClick={() => {
                const newText = extractedText.replace(/x(?=\s*[=\d(])/g, '×');
                onTextChange(newText);
              }}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix ×
            </button>
            <button
              onClick={() => {
                const newText = extractedText
                  .replace(/sqrt\((.*?)\)/g, '√($1)')
                  .replace(/sqrt/g, '√');
                onTextChange(newText);
              }}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
            >
              Fix √
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextComparisonHelper;