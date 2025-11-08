'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const cleanLatex = (latex) => {
  if (!latex) return '';
  let cleaned = latex.replace(/\\\[|\\\]/g, '').trim();
  cleaned = cleaned.replace(/\\\(|\\\)/g, '').trim();
  cleaned = cleaned.replace(/\$\$/g, '').trim();
  cleaned = cleaned.replace(/\$/g, '').trim();
  return cleaned;
};

export function MathInline({ children }) {
  if (!children) return null;
  const cleaned = cleanLatex(String(children));
  if (!cleaned) return null;
  
  try {
    return <InlineMath math={cleaned} />;
  } catch (error) {
    return <span className="text-gray-700">{children}</span>;
  }
}

export function MathBlock({ children }) {
  if (!children) return null;
  const cleaned = cleanLatex(String(children));
  if (!cleaned) return null;
  
  try {
    return <BlockMath math={cleaned} />;
  } catch (error) {
    return <div className="text-gray-700">{children}</div>;
  }
}

export default function MathDisplay({ content, display = false }) {
  if (!content) return null;
  const cleaned = cleanLatex(String(content));
  if (!cleaned) return null;
  
  try {
    if (display) {
      return <BlockMath math={cleaned} />;
    } else {
      return <InlineMath math={cleaned} />;
    }
  } catch (error) {
    return <span className="text-gray-700">{content}</span>;
  }
}

export function convertToLatex(text) {
  if (!text) return '';
  let latex = text.replace(/\^(\d+)/g, '^{$1}');
  latex = latex.replace(/\^(\([^)]+\))/g, '^{$1}');
  latex = latex.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  return latex;
}