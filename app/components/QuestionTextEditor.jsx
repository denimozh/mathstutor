'use client';

import React, { useState, useEffect } from 'react';
import MathDisplay from './CleanMathDisplay';

export default function QuestionTextEditor({ initialText, onSave, imageUrl }) {
  const [lines, setLines] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (initialText) {
      const parsed = parseQuestionText(initialText);
      setLines(parsed);
    }
  }, [initialText]);

  const parseQuestionText = (text) => {
    const rawLines = text.split(/\\\\|\n/);
    return rawLines.map((line, idx) => ({
      id: idx,
      content: line.trim(),
      type: detectLineType(line)
    })).filter(line => line.content);
  };

  const detectLineType = (line) => {
    if (line.includes('\\frac')) return 'fraction';
    if (line.includes('\\sin') || line.includes('\\cos') || line.includes('\\tan')) return 'trig';
    if (line.includes('=')) return 'equation';
    if (line.includes('\\text')) return 'text';
    return 'math';
  };

  const updateLine = (id, newContent) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, content: newContent } : line
    ));
  };

  const addLine = () => {
    setLines([...lines, { id: lines.length, content: '', type: 'math' }]);
  };

  const removeLine = (id) => {
    setLines(lines.filter(line => line.id !== id));
  };

  const handleSave = () => {
    const reconstructed = lines.map(l => l.content).join('\n');
    onSave(reconstructed);
    setEditing(false);
  };

  const getLineIcon = (type) => {
    switch(type) {
      case 'fraction': return '➗';
      case 'trig': return '📐';
      case 'equation': return '=';
      case 'text': return '📝';
      default: return '🔢';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Question Text</h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            ✏️ Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              ✓ Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
            >
              ✗ Cancel
            </button>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
          <img src={imageUrl} alt="Question" className="w-full h-auto" />
        </div>
      )}

      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-start gap-2 md:gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
              {getLineIcon(line.type)}
            </div>
            
            {editing ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={line.content}
                  onChange={(e) => updateLine(line.id, e.target.value)}
                  placeholder="Enter equation or text..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  onClick={() => removeLine(line.id)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  🗑️
                </button>
              </div>
            ) : (
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <MathDisplay content={line.content} display />
              </div>
            )}
          </div>
        ))}

        {editing && (
          <button
            onClick={addLine}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 font-medium"
          >
            + Add Line
          </button>
        )}
      </div>

      {editing && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Use LaTeX notation like \frac{'{1}'}{'{2}'} for fractions, 
            \sin, \cos for trig functions, and x^{'{2}'} for powers.
          </p>
        </div>
      )}
    </div>
  );
}