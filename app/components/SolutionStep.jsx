'use client';

import React from 'react';
import MathDisplay from './CleanMathDisplay';

export default function SolutionStep({ step, index }) {
  const renderWorking = (working) => {
    if (!working) return null;
    const lines = working.split('\n').filter(l => l.trim());
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="bg-gray-50 border-l-4 border-indigo-400 p-3 rounded">
            <MathDisplay content={line} display />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-4 border border-indigo-100 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
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
              {renderWorking(step.working)}
            </div>
          )}

          {step.formula && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded">
              <MathDisplay content={step.formula} display />
            </div>
          )}

          {step.exam_tip && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                💡 Exam Tip:
              </p>
              <p className="text-sm text-amber-900 mt-1">{step.exam_tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}