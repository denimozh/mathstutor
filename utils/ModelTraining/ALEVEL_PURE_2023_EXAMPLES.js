// Edexcel A-Level Pure Mathematics 1 - June 2023
// Formatted examples for AI training

const ALEVEL_PURE_2023_EXAMPLES = [
  {
    topic: "Calculus - Stationary Points with Small Angle Approximation",
    question: "The curve C has equation y = f(x) where x ∈ ℝ. Given that f'(x) = 2x + (1/2)cos(x), the curve has a stationary point with x coordinate α, and α is small, use the small angle approximation for cos(x) to estimate the value of α to 3 decimal places.",
    solution_steps: [
      {
        step: 1,
        title: "Set derivative equal to zero at stationary point",
        explanation: "At a stationary point, the gradient of the curve is zero, so we set the derivative equal to zero and substitute α for x.",
        working: "f'(α) = 0\n2α + (1/2)cos(α) = 0\nMultiply through by 2:\n4α + cos(α) = 0",
        formula: "cos(α) = -4α"
      },
      {
        step: 2,
        title: "Apply small angle approximation",
        explanation: "Since α is small (|α| < 0.3 radians), we can use the approximation cos(α) ≈ 1 - α²/2",
        working: "cos(α) = -4α\n1 - α²/2 = -4α",
        formula: "1 - α²/2 = -4α"
      },
      {
        step: 3,
        title: "Rearrange into standard quadratic form",
        explanation: "Multiply through by -2 to eliminate the fraction and rearrange all terms to one side.",
        working: "1 - α²/2 = -4α\nMultiply by -2:\n-2 + α² = 8α\nRearrange:\nα² - 8α - 2 = 0",
        formula: "α² - 8α - 2 = 0"
      },
      {
        step: 4,
        title: "Apply quadratic formula",
        explanation: "Using the quadratic formula with a=1, b=-8, c=-2",
        working: "α = (8 ± √(64 + 8))/2\nα = (8 ± √72)/2\nα = (8 ± 6√2)/2\nα = 4 ± 3√2",
        formula: "α = 4 ± 3√2"
      },
      {
        step: 5,
        title: "Select appropriate root",
        explanation: "Since cos(α) = -4α, we need a negative value (as cos is positive for small positive angles). Therefore we take α = 4 - 3√2.",
        working: "α = 4 - 3√2\nα = 4 - 4.243...\nα ≈ -0.243",
        formula: "α = -0.243"
      },
      {
        step: 6,
        title: "Verify the solution",
        explanation: "Substitute α = -0.243 back into f'(x) to check it equals zero.",
        working: "f'(-0.243) = 2(-0.243) + (1/2)cos(-0.243)\n= -0.486 + (1/2)(0.971)\n= -0.486 + 0.486\n≈ 0.000",
        formula: "Error ≈ 0% ✓",
        exam_tip: "Always verify your answer by substituting back - this can catch sign errors or calculation mistakes common in small angle approximations."
      }
    ],
    final_answer: {
      alpha: "-0.243"
    },
    key_concepts: [
      "Stationary points (f'(x) = 0)",
      "Small angle approximations (cos x ≈ 1 - x²/2 for |x| < 0.3)",
      "Quadratic formula",
      "Verification by substitution"
    ],
    common_mistakes: [
      "Forgetting that cos(α) = -4α requires a negative value for α",
      "Making sign errors when rearranging the quadratic equation",
      "Using degrees instead of radians in the approximation",
      "Not verifying the answer by substitution",
      "Choosing the positive root when the equation requires negative"
    ],
    exam_technique: "When using small angle approximations, always: (1) check |x| < 0.3, (2) verify your answer satisfies the original equation, (3) show clear working for all algebraic steps to gain method marks even if final answer is slightly off."
  },

  {
    topic: "Algebra - Polynomial Factor Theorem",
    question: "f(x) = 4x³ + 5x² – 10x + 4a where a is a positive constant. Given (x – a) is a factor of f(x), (a) show that a(4a² + 5a – 6) = 0, (b)(i) find the value of a, (ii) use algebra to find the exact solutions of the equation f(x) = 3",
    solution_steps: [
      {
        step: 1,
        title: "Apply factor theorem",
        explanation: "If (x – a) is a factor of f(x), then f(a) = 0. Substitute x = a into the function.",
        working: "f(a) = 4a³ + 5a² – 10a + 4a\nf(a) = 4a³ + 5a² – 10a + 4a = 0",
        formula: "4a³ + 5a² – 10a + 4a = 0"
      },
      {
        step: 2,
        title: "Factor out a from the equation",
        explanation: "Take out the common factor of a to simplify the equation.",
        working: "4a³ + 5a² – 10a + 4a = 0\na(4a² + 5a – 10 + 4) = 0\na(4a² + 5a – 6) = 0",
        formula: "a(4a² + 5a – 6) = 0 ✓"
      },
      {
        step: 3,
        title: "Solve for a",
        explanation: "Since a is positive, a ≠ 0, so we solve 4a² + 5a – 6 = 0 using the quadratic formula.",
        working: "4a² + 5a – 6 = 0\na = (-5 ± √(25 + 96))/8\na = (-5 ± √121)/8\na = (-5 ± 11)/8\na = 6/8 or a = -16/8",
        formula: "a = 3/4 or a = -2"
      },
      {
        step: 4,
        title: "Choose positive value",
        explanation: "Since a is stated to be positive, we take a = 3/4",
        working: "a = 3/4 (positive)\na = -2 (rejected as negative)",
        formula: "a = 3/4"
      },
      {
        step: 5,
        title: "Set up equation f(x) = 3",
        explanation: "Substitute a = 3/4 into f(x) and set equal to 3.",
        working: "f(x) = 4x³ + 5x² – 10x + 4(3/4)\nf(x) = 4x³ + 5x² – 10x + 3\n4x³ + 5x² – 10x + 3 = 3\n4x³ + 5x² – 10x = 0",
        formula: "4x³ + 5x² – 10x = 0"
      },
      {
        step: 6,
        title: "Factor and solve",
        explanation: "Factor out x, then solve the resulting quadratic.",
        working: "x(4x² + 5x – 10) = 0\nSo x = 0 or 4x² + 5x – 10 = 0\nUsing quadratic formula:\nx = (-5 ± √(25 + 160))/8\nx = (-5 ± √185)/8",
        formula: "x = 0 or x = (-5 ± √185)/8",
        exam_tip: "Always factor out common factors first before using the quadratic formula - this saves time and reduces errors."
      }
    ],
    final_answer: {
      a: "3/4",
      solutions: "x = 0 or x = (-5 ± √185)/8"
    },
    key_concepts: [
      "Factor theorem",
      "Quadratic formula",
      "Factorization",
      "Exact solutions (using surds)"
    ],
    common_mistakes: [
      "Forgetting to substitute a = 3/4 correctly into the original function",
      "Not factoring out x before applying the quadratic formula",
      "Rounding √185 instead of leaving it exact",
      "Sign errors when collecting terms"
    ],
    exam_technique: "For 'show that' questions, you must show every step clearly. For exact answers, never round - leave surds and fractions in simplest form."
  },

  {
    topic: "Vectors - Magnitude and Inequalities",
    question: "Relative to a fixed origin O, the point A has position vector 5i + 3j + 2k and the point B has position vector 2i + 4j + ak where a is a positive integer. (a) Show that |OA| = √38, (b) Find the smallest value of a for which |OB| > |OA|",
    solution_steps: [
      {
        step: 1,
        title: "Calculate magnitude of OA",
        explanation: "The magnitude of a vector is found using Pythagoras' theorem in 3D: |v| = √(x² + y² + z²)",
        working: "|OA| = √(5² + 3² + 2²)\n= √(25 + 9 + 4)\n= √38",
        formula: "|OA| = √38 ✓"
      },
      {
        step: 2,
        title: "Express magnitude of OB in terms of a",
        explanation: "Use the same formula for |OB| but leave a as a variable.",
        working: "|OB| = √(2² + 4² + a²)\n= √(4 + 16 + a²)\n= √(20 + a²)",
        formula: "|OB| = √(20 + a²)"
      },
      {
        step: 3,
        title: "Set up inequality",
        explanation: "We need |OB| > |OA|, so √(20 + a²) > √38",
        working: "√(20 + a²) > √38\nSquare both sides:\n20 + a² > 38\na² > 18",
        formula: "a² > 18"
      },
      {
        step: 4,
        title: "Solve for a",
        explanation: "Take the square root and find the smallest positive integer satisfying the inequality.",
        working: "a² > 18\na > √18\na > 4.243...\nSmallest positive integer: a = 5",
        formula: "a = 5"
      },
      {
        step: 5,
        title: "Verify the answer",
        explanation: "Check that a = 5 works and a = 4 doesn't.",
        working: "When a = 4: |OB| = √(20 + 16) = √36 = 6 < √38 ✗\nWhen a = 5: |OB| = √(20 + 25) = √45 = 6.71... > √38 = 6.16... ✓",
        formula: "a = 5 ✓"
      }
    ],
    final_answer: {
      a: "5"
    },
    key_concepts: [
      "3D vectors",
      "Magnitude of vectors",
      "Solving inequalities",
      "Square roots and surds"
    ],
    common_mistakes: [
      "Forgetting to square root when solving a² > 18",
      "Not checking both a = 4 and a = 5",
      "Using = instead of > in the inequality",
      "Calculation errors with squares"
    ],
    exam_technique: "Always verify boundary values when solving inequalities with integers. Show your check working to demonstrate understanding."
  },

  {
    topic: "Logs - Laws of Logarithms",
    question: "Given a = log₂(x) and b = log₂(x + 8), express in terms of a and/or b: (a) log₂(√x), (b) log₂(x² + 8x), (c) log₂((8 + 64)/x) in simplest form",
    solution_steps: [
      {
        step: 1,
        title: "Part (a): Express log₂(√x)",
        explanation: "Use the power law: log(xⁿ) = n·log(x). Since √x = x^(1/2), we have log₂(√x) = (1/2)log₂(x)",
        working: "log₂(√x) = log₂(x^(1/2))\n= (1/2)log₂(x)\n= (1/2)a",
        formula: "log₂(√x) = a/2"
      },
      {
        step: 2,
        title: "Part (b): Factorize the expression",
        explanation: "Factor x² + 8x to use the addition law of logs.",
        working: "x² + 8x = x(x + 8)\nlog₂(x² + 8x) = log₂(x(x + 8))\n= log₂(x) + log₂(x + 8)\n= a + b",
        formula: "log₂(x² + 8x) = a + b"
      },
      {
        step: 3,
        title: "Part (c): Simplify the fraction",
        explanation: "Simplify the numerator first, then apply log laws.",
        working: "(8 + 64)/x = 72/x = 8·9/x = 8(x + 8)/x\nlog₂(8(x + 8)/x) = log₂(8) + log₂(x + 8) - log₂(x)\nlog₂(8) = log₂(2³) = 3\n= 3 + b - a",
        formula: "log₂((8 + 64)/x) = 3 + b - a"
      }
    ],
    final_answer: {
      part_a: "a/2",
      part_b: "a + b",
      part_c: "3 + b - a"
    },
    key_concepts: [
      "Laws of logarithms (product, quotient, power)",
      "Factorization",
      "Simplification",
      "log₂(8) = 3"
    ],
    common_mistakes: [
      "Trying to split log₂(x + 8) into log₂(x) + log₂(8) - this is WRONG",
      "Forgetting to factor x² + 8x before applying log laws",
      "Sign errors when using quotient law (subtraction)",
      "Not simplifying log₂(8) = 3"
    ],
    exam_technique: "Always factorize expressions before applying log laws. Remember: log(a + b) ≠ log(a) + log(b), but log(ab) = log(a) + log(b)."
  },

  {
    topic: "Functions - Inverse Functions",
    question: "The function f is defined by f(x) = 3 + √(x - 2), x ∈ ℝ, x > 2. (a) State the range of f, (b) Find f⁻¹",
    solution_steps: [
      {
        step: 1,
        title: "Find the range of f",
        explanation: "Since x > 2, the minimum value of (x - 2) is 0, so √(x - 2) ≥ 0, which means f(x) ≥ 3",
        working: "When x → 2⁺: f(x) → 3 + √0 = 3\nWhen x → ∞: f(x) → ∞\nSince x > 2, we have f(x) > 3",
        formula: "Range: f(x) > 3"
      },
      {
        step: 2,
        title: "Set up equation to find inverse",
        explanation: "Let y = f(x) and make x the subject. Start by setting y = 3 + √(x - 2)",
        working: "y = 3 + √(x - 2)\ny - 3 = √(x - 2)\n(y - 3)² = x - 2\nx = (y - 3)² + 2",
        formula: "x = (y - 3)² + 2"
      },
      {
        step: 3,
        title: "Write inverse function",
        explanation: "Swap x and y to get the inverse function. The domain of f⁻¹ is the range of f.",
        working: "f⁻¹(x) = (x - 3)² + 2",
        formula: "f⁻¹(x) = (x - 3)² + 2, x > 3"
      }
    ],
    final_answer: {
      range: "f(x) > 3",
      inverse: "f⁻¹(x) = (x - 3)² + 2, x > 3"
    },
    key_concepts: [
      "Domain and range",
      "Inverse functions",
      "Square root functions",
      "Algebraic manipulation"
    ],
    common_mistakes: [
      "Forgetting to state the domain of the inverse function",
      "Writing f(x) ≥ 3 instead of f(x) > 3 (the > comes from x > 2)",
      "Sign errors when rearranging",
      "Not squaring both sides correctly"
    ],
    exam_technique: "Always state the domain/range restrictions. The domain of f⁻¹ equals the range of f."
  }
];

// Export for use in your AI system
export default ALEVEL_PURE_2023_EXAMPLES;

// Helper function to add these to your existing examples
export function addToExistingExamples(currentExamples) {
  return [...currentExamples, ...ALEVEL_PURE_2023_EXAMPLES];
}

