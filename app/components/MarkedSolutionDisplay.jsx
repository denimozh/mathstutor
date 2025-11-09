// app/components/MarkedSolutionDisplay.jsx
// NEW FILE - Display marked work with color-coded feedback

'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Import from CleanMathDisplay
import { CleanMathStep, cleanLatex } from './MathDisplay';

/**
 * Complete marked solution display
 */
export default function MarkedSolutionDisplay({ marking, questionText, originalImage }) {
  if (!marking) return null;

  const {
    marks_awarded,
    marks_available,
    overall_feedback,
    step_by_step_feedback,
    first_error_at_step,
    corrected_continuation,
    exam_technique_advice
  } = marking;

  const percentage = Math.round((marks_awarded / marks_available) * 100);

  return (
    <div className="space-y-6">
      {/* Score Banner */}
      <div className={`rounded-2xl p-8 text-white ${
        percentage >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
        percentage >= 60 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
        'bg-gradient-to-r from-red-600 to-rose-600'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Score</h2>
            <p className="text-white/90">Marked against official A-Level mark scheme</p>
          </div>
          <div className="text-center">
            <div className="text-7xl font-bold mb-2">
              {marks_awarded}/{marks_available}
            </div>
            <div className="text-2xl font-semibold">
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Overall Feedback */}
      {overall_feedback && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📝 Examiner's Summary</h3>
          <p className="text-blue-800 leading-relaxed">{overall_feedback}</p>
        </div>
      )}

      {/* Original Question */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Question</h3>
        <p className="text-gray-700">{questionText}</p>
        {originalImage && (
          <img 
            src={originalImage} 
            alt="Question" 
            className="mt-4 max-w-md rounded-lg border border-gray-300"
          />
        )}
      </div>

      {/* Step-by-Step Marked Work */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          📋 Detailed Marking
        </h3>

        <div className="space-y-4">
          {step_by_step_feedback && step_by_step_feedback.map((step, idx) => (
            <StepFeedback 
              key={idx} 
              step={step} 
              isFirstError={first_error_at_step === step.step_number}
            />
          ))}
        </div>
      </div>

      {/* Corrected Continuation in GREEN */}
      {corrected_continuation && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 p-3 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                ✓ Correct Continuation
              </h3>
              <p className="text-green-800">
                From step {corrected_continuation.from_step} onwards
              </p>
            </div>
          </div>

          {corrected_continuation.explanation && (
            <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6">
              <p className="text-green-900 font-medium">
                {corrected_continuation.explanation}
              </p>
            </div>
          )}

          {corrected_continuation.steps && corrected_continuation.steps.map((step, idx) => (
            <div key={idx} className="mb-6">
              <CleanMathStep step={step} />
            </div>
          ))}
        </div>
      )}

      {/* Exam Technique Advice */}
      {exam_technique_advice && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500 p-2 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-purple-900 mb-2">
                🎓 Exam Technique
              </h4>
              <p className="text-purple-800 leading-relaxed">
                {exam_technique_advice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Practice Recommendations */}
      <PracticeRecommendations 
        stepFeedback={step_by_step_feedback}
        score={percentage}
      />
    </div>
  );
}

/**
 * Individual step feedback with color coding
 */
function StepFeedback({ step, isFirstError }) {
  const {
    step_number,
    student_work,
    mark_scheme_requirement,
    status,
    marks_awarded,
    marks_available,
    feedback,
    error_type
  } = step;

  const getStatusColor = () => {
    switch (status) {
      case 'correct':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          icon: 'bg-green-500',
          iconSymbol: '✓',
          text: 'text-green-800'
        };
      case 'partially_correct':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          icon: 'bg-amber-500',
          iconSymbol: '~',
          text: 'text-amber-800'
        };
      case 'incorrect':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: 'bg-red-500',
          iconSymbol: '✗',
          text: 'text-red-800'
        };
      case 'missing':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-400',
          icon: 'bg-gray-400',
          iconSymbol: '!',
          text: 'text-gray-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          icon: 'bg-gray-300',
          iconSymbol: '?',
          text: 'text-gray-800'
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-5 ${
      isFirstError ? 'ring-4 ring-red-300 ring-opacity-50' : ''
    }`}>
      {isFirstError && (
        <div className="mb-4 bg-red-100 border border-red-300 rounded-lg p-3">
          <p className="text-red-800 font-bold text-sm">
            ⚠️ First error detected here - solution corrected from this point
          </p>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${colors.icon} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
          {colors.iconSymbol}
        </div>

        <div className="flex-1">
          {/* Step Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold text-gray-900">
              Step {step_number}
            </h4>
            <div className="flex items-center gap-2">
              {status === 'correct' && (
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">
                  +{marks_awarded} {marks_awarded === 1 ? 'mark' : 'marks'}
                </span>
              )}
              {(status === 'incorrect' || status === 'partially_correct') && (
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                  -{marks_available - marks_awarded} lost
                </span>
              )}
            </div>
          </div>

          {/* Student's Work */}
          {student_work && (
            <div className="bg-white rounded-lg p-4 mb-3 border border-gray-300">
              <p className="text-xs font-semibold text-gray-500 mb-2">YOUR WORKING:</p>
              <div className="text-base">
                {student_work.includes('=') || student_work.includes('+') ? (
                  <InlineMath math={cleanLatex(student_work)} />
                ) : (
                  <p className="text-gray-800">{student_work}</p>
                )}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className={`${colors.text} mb-3`}>
            <p className="font-medium leading-relaxed">{feedback}</p>
          </div>

          {/* Mark Scheme Requirement */}
          {mark_scheme_requirement && status !== 'correct' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                📋 MARK SCHEME REQUIRES:
              </p>
              <p className="text-sm text-blue-800">{mark_scheme_requirement}</p>
            </div>
          )}

          {/* Error Type Badge */}
          {error_type && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                {error_type.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Practice recommendations based on errors
 */
function PracticeRecommendations({ stepFeedback, score }) {
  if (!stepFeedback || score >= 90) return null;

  // Analyze error types
  const errorTypes = stepFeedback
    .filter(step => step.status !== 'correct')
    .map(step => step.error_type)
    .filter(Boolean);

  const errorCounts = errorTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topErrors = Object.entries(errorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type);

  if (topErrors.length === 0) return null;

  const recommendations = {
    'calculation_error': {
      title: 'Arithmetic Practice',
      icon: '🔢',
      tips: [
        'Double-check calculations before moving on',
        'Use a calculator for complex arithmetic',
        'Verify answers by substituting back'
      ]
    },
    'method_error': {
      title: 'Method Review',
      icon: '📚',
      tips: [
        'Review the correct method for this topic',
        'Practice similar problems',
        'Study worked examples carefully'
      ]
    },
    'conceptual_error': {
      title: 'Concept Revision',
      icon: '💡',
      tips: [
        'Revisit fundamental concepts',
        'Watch tutorial videos',
        'Work through theory before practice'
      ]
    },
    'missing_step': {
      title: 'Show Full Working',
      icon: '✍️',
      tips: [
        'Always show every step of working',
        'Don\'t skip steps even if obvious',
        'Method marks require visible working'
      ]
    }
  };

  return (
    <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        📈 Recommendations to Improve
      </h3>
      <div className="space-y-4">
        {topErrors.map((errorType, idx) => {
          const rec = recommendations[errorType];
          if (!rec) return null;

          return (
            <div key={idx} className="bg-white rounded-lg p-4 border border-indigo-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{rec.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">{rec.title}</h4>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}