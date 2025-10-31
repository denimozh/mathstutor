'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function MathInline({ children }) {
  if (!children) return null;
  
  try {
    return <InlineMath math={children} />;
  } catch (error) {
    console.error('Math rendering error:', error);
    return <span className="text-red-500">{children}</span>;
  }
}

export function MathBlock({ children }) {
  if (!children) return null;
  
  try {
    return <BlockMath math={children} />;
  } catch (error) {
    console.error('Math rendering error:', error);
    return <div className="text-red-500">{children}</div>;
  }
}

// Helper function to convert ^ notation to LaTeX
export function convertToLatex(text) {
  if (!text) return '';
  
  // Convert powers: t^2 → t^{2}
  let latex = text.replace(/\^(\d+)/g, '^{$1}');
  
  // Convert powers with parentheses: t^(2+3) → t^{2+3}
  latex = latex.replace(/\^(\([^)]+\))/g, '^{$1}');
  
  // Convert fractions if needed: 1/2 → \frac{1}{2}
  latex = latex.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  
  return latex;
}