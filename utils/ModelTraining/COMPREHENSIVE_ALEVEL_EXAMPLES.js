// COMPREHENSIVE A-LEVEL PURE MATHEMATICS EXAMPLES
// Covers all major topics from Papers 1, 2, and 3
// Based on Edexcel past paper patterns 2018-2023

const COMPREHENSIVE_ALEVEL_EXAMPLES = [
  {
    topic: "Calculus - Differentiation with Chain Rule",
    question: "A curve has equation y = (3x² - 5)⁴. Find dy/dx and hence find the equation of the normal to the curve at the point where x = 2.",
    solution_steps: [
      {
        step: 1,
        title: "Apply the chain rule",
        explanation: "Let u = 3x² - 5, so y = u⁴. Using chain rule: dy/dx = dy/du × du/dx",
        working: "Let u = 3x² - 5\ny = u⁴\ndu/dx = 6x\ndy/du = 4u³",
        formula: "dy/dx = 4u³ × 6x = 4(3x² - 5)³ × 6x"
      },
      {
        step: 2,
        title: "Simplify the derivative",
        explanation: "Multiply out the constants to get the final form of dy/dx",
        working: "dy/dx = 24x(3x² - 5)³",
        formula: "dy/dx = 24x(3x² - 5)³"
      },
      {
        step: 3,
        title: "Find gradient at x = 2",
        explanation: "Substitute x = 2 into the derivative to find the gradient at this point",
        working: "When x = 2:\ndy/dx = 24(2)(3(4) - 5)³\n= 48(12 - 5)³\n= 48(7)³\n= 48 × 343\n= 16,464",
        formula: "Gradient of curve = 16,464"
      },
      {
        step: 4,
        title: "Find y-coordinate when x = 2",
        explanation: "Substitute x = 2 into the original equation to find the point",
        working: "y = (3(4) - 5)⁴\ny = (12 - 5)⁴\ny = 7⁴\ny = 2,401",
        formula: "Point is (2, 2401)"
      },
      {
        step: 5,
        title: "Find gradient of normal",
        explanation: "The normal is perpendicular to the tangent, so multiply gradients to get -1",
        working: "Gradient of tangent = 16,464\nGradient of normal = -1/16,464",
        formula: "m_normal = -1/16,464"
      },
      {
        step: 6,
        title: "Find equation of normal",
        explanation: "Use point-slope form: y - y₁ = m(x - x₁)",
        working: "y - 2401 = (-1/16,464)(x - 2)\ny = (-1/16,464)x + 2/16,464 + 2401\ny = (-1/16,464)x + 2401.0001",
        formula: "y = (-1/16,464)x + 2401",
        exam_tip: "For very small fractions like 2/16,464, you can often ignore them in the final answer unless specifically asked to include them"
      }
    ],
    final_answer: {
      derivative: "dy/dx = 24x(3x² - 5)³",
      normal: "y = (-1/16,464)x + 2401"
    },
    key_concepts: [
      "Chain rule",
      "Composite functions",
      "Normal to a curve (perpendicular gradient)",
      "Point-slope form"
    ],
    common_mistakes: [
      "Forgetting to multiply by the derivative of the inside function (6x)",
      "Confusing normal with tangent - they are perpendicular",
      "Not finding the y-coordinate of the point",
      "Sign errors when calculating -1/gradient"
    ],
    exam_technique: "Always write out 'let u = ...' clearly when using chain rule. Examiners look for this to award method marks."
  },

  {
    topic: "Algebra - Binomial Expansion",
    question: "Find the first 4 terms, in ascending powers of x, of the binomial expansion of (2 + 3x)⁷. Hence find the coefficient of x³ in the expansion of (1 - x)(2 + 3x)⁷.",
    solution_steps: [
      {
        step: 1,
        title: "Apply binomial expansion formula",
        explanation: "Use (a + b)ⁿ = Σ(ⁿCᵣ)aⁿ⁻ʳbʳ. Here a = 2, b = 3x, n = 7",
        working: "(2 + 3x)⁷ = ⁷C₀(2)⁷ + ⁷C₁(2)⁶(3x) + ⁷C₂(2)⁵(3x)² + ⁷C₃(2)⁴(3x)³ + ...",
        formula: "Start with ⁿCᵣ calculations"
      },
      {
        step: 2,
        title: "Calculate binomial coefficients",
        explanation: "Find ⁷C₀, ⁷C₁, ⁷C₂, ⁷C₃",
        working: "⁷C₀ = 1\n⁷C₁ = 7\n⁷C₂ = 21\n⁷C₃ = 35",
        formula: "Coefficients: 1, 7, 21, 35"
      },
      {
        step: 3,
        title: "Calculate each term",
        explanation: "Multiply out each term completely",
        working: "Term 1: 1 × 2⁷ = 128\nTerm 2: 7 × 2⁶ × 3x = 7 × 64 × 3x = 1344x\nTerm 3: 21 × 2⁵ × 9x² = 21 × 32 × 9x² = 6048x²\nTerm 4: 35 × 2⁴ × 27x³ = 35 × 16 × 27x³ = 15,120x³",
        formula: "128 + 1344x + 6048x² + 15,120x³"
      },
      {
        step: 4,
        title: "Expand (1 - x)(2 + 3x)⁷",
        explanation: "Multiply the polynomial by (1 - x) to find terms up to x³",
        working: "(1 - x)(128 + 1344x + 6048x² + 15,120x³ + ...)\n= 128 + 1344x + 6048x² + 15,120x³\n  - 128x - 1344x² - 6048x³ - ...",
        formula: "Collect terms"
      },
      {
        step: 5,
        title: "Find coefficient of x³",
        explanation: "Add all the x³ terms together",
        working: "x³ terms come from:\n15,120x³ (from 1 × term 4)\n- 6,048x³ (from -x × term 3)\n= 15,120 - 6,048\n= 9,072",
        formula: "Coefficient of x³ = 9,072"
      }
    ],
    final_answer: {
      expansion: "128 + 1344x + 6048x² + 15,120x³",
      coefficient: "9,072"
    },
    key_concepts: [
      "Binomial expansion",
      "Binomial coefficients ⁿCᵣ",
      "Polynomial multiplication",
      "Collecting like terms"
    ],
    common_mistakes: [
      "Forgetting to raise 3x to the power (getting (3x)² = 9x², not 3x²)",
      "Calculation errors with large numbers",
      "Missing terms when multiplying by (1 - x)",
      "Not collecting all x³ terms in the final part"
    ],
    exam_technique: "Write out binomial coefficients separately first, then calculate each term. This makes checking easier and shows clear method."
  },

  {
    topic: "Trigonometry - Identities and Equations",
    question: "Prove that (sin θ + cos θ)² = 1 + 2sin θ cos θ. Hence solve, for 0° ≤ θ < 360°, the equation (sin θ + cos θ)² = 1.5, giving your answers to 1 decimal place.",
    solution_steps: [
      {
        step: 1,
        title: "Expand the left side",
        explanation: "Expand (sin θ + cos θ)² as you would any binomial",
        working: "(sin θ + cos θ)²\n= sin²θ + 2sin θ cos θ + cos²θ",
        formula: "sin²θ + 2sin θ cos θ + cos²θ"
      },
      {
        step: 2,
        title: "Apply Pythagorean identity",
        explanation: "Use sin²θ + cos²θ = 1 to simplify",
        working: "sin²θ + 2sin θ cos θ + cos²θ\n= (sin²θ + cos²θ) + 2sin θ cos θ\n= 1 + 2sin θ cos θ ✓",
        formula: "= 1 + 2sin θ cos θ (proven)"
      },
      {
        step: 3,
        title: "Set up equation using proven identity",
        explanation: "Substitute the identity into the equation to solve",
        working: "(sin θ + cos θ)² = 1.5\n1 + 2sin θ cos θ = 1.5\n2sin θ cos θ = 0.5",
        formula: "2sin θ cos θ = 0.5"
      },
      {
        step: 4,
        title: "Use double angle formula",
        explanation: "Recall that 2sin θ cos θ = sin(2θ)",
        working: "2sin θ cos θ = 0.5\nsin(2θ) = 0.5",
        formula: "sin(2θ) = 0.5"
      },
      {
        step: 5,
        title: "Solve for 2θ",
        explanation: "Find all values of 2θ where sin(2θ) = 0.5 in the range 0° ≤ 2θ < 720°",
        working: "sin(2θ) = 0.5\n2θ = 30°, 150°, 390°, 510°\n(using sin⁻¹(0.5) = 30° and symmetry)",
        formula: "2θ = 30°, 150°, 390°, 510°"
      },
      {
        step: 6,
        title: "Solve for θ",
        explanation: "Divide all values by 2 to find θ",
        working: "θ = 30°/2, 150°/2, 390°/2, 510°/2\nθ = 15°, 75°, 195°, 255°",
        formula: "θ = 15.0°, 75.0°, 195.0°, 255.0°",
        exam_tip: "Always check your range - here 0° ≤ θ < 360°, so we need 0° ≤ 2θ < 720° to catch all solutions"
      }
    ],
    final_answer: {
      proof: "Proven: (sin θ + cos θ)² = 1 + 2sin θ cos θ",
      solutions: "θ = 15.0°, 75.0°, 195.0°, 255.0°"
    },
    key_concepts: [
      "Pythagorean identity: sin²θ + cos²θ = 1",
      "Double angle formula: sin(2θ) = 2sin θ cos θ",
      "Solving trigonometric equations",
      "Symmetry in sine function"
    ],
    common_mistakes: [
      "Forgetting to double the range when solving for 2θ",
      "Missing solutions due to not considering full period",
      "Not using the proven identity in part 2",
      "Confusing sin(2θ) with 2sin(θ)"
    ],
    exam_technique: "For 'hence' questions, you MUST use the result from the previous part - examiners look for this."
  },

  {
    topic: "Sequences - Arithmetic and Geometric Series",
    question: "The sum of the first n terms of an arithmetic series is given by Sₙ = 2n² + 3n. (a) Find the first term and the common difference. (b) Find the 20th term. (c) Which term of the series is equal to 157?",
    solution_steps: [
      {
        step: 1,
        title: "Find the first term",
        explanation: "The first term is S₁ (sum of first 1 term)",
        working: "S₁ = 2(1)² + 3(1)\n= 2 + 3\n= 5",
        formula: "u₁ = 5"
      },
      {
        step: 2,
        title: "Find the second term",
        explanation: "u₂ = S₂ - S₁ (second term equals sum of first two minus first term)",
        working: "S₂ = 2(2)² + 3(2)\n= 8 + 6\n= 14\nu₂ = S₂ - S₁ = 14 - 5 = 9",
        formula: "u₂ = 9"
      },
      {
        step: 3,
        title: "Find the common difference",
        explanation: "In an arithmetic series, d = u₂ - u₁",
        working: "d = u₂ - u₁\nd = 9 - 5\nd = 4",
        formula: "d = 4"
      },
      {
        step: 4,
        title: "Verify using nth term formula",
        explanation: "Check using uₙ = Sₙ - Sₙ₋₁ to ensure our d is correct",
        working: "uₙ = Sₙ - Sₙ₋₁\n= [2n² + 3n] - [2(n-1)² + 3(n-1)]\n= 2n² + 3n - [2n² - 4n + 2 + 3n - 3]\n= 2n² + 3n - 2n² + 4n - 2 - 3n + 3\n= 4n + 1",
        formula: "uₙ = 4n + 1"
      },
      {
        step: 5,
        title: "Find the 20th term",
        explanation: "Substitute n = 20 into uₙ = 4n + 1",
        working: "u₂₀ = 4(20) + 1\n= 80 + 1\n= 81",
        formula: "u₂₀ = 81"
      },
      {
        step: 6,
        title: "Find which term equals 157",
        explanation: "Set uₙ = 157 and solve for n",
        working: "4n + 1 = 157\n4n = 156\nn = 39",
        formula: "39th term = 157",
        exam_tip: "Always verify using both methods if time allows - if u₁ = 5 and d = 4, then uₙ = 5 + (n-1)4 = 4n + 1 ✓"
      }
    ],
    final_answer: {
      first_term: "5",
      common_difference: "4",
      twentieth_term: "81",
      term_equal_157: "39th term"
    },
    key_concepts: [
      "Sum of arithmetic series: Sₙ",
      "Finding uₙ from Sₙ - Sₙ₋₁",
      "Arithmetic sequence formula: uₙ = a + (n-1)d",
      "Solving linear equations"
    ],
    common_mistakes: [
      "Thinking u₁ = S₀ instead of S₁",
      "Forgetting that uₙ = Sₙ - Sₙ₋₁ for n ≥ 2",
      "Calculation errors when expanding (n-1)²",
      "Not simplifying the expression for uₙ fully"
    ],
    exam_technique: "When given Sₙ, find u₁ directly from S₁, then use uₙ = Sₙ - Sₙ₋₁ to find the general term."
  },

  {
    topic: "Coordinate Geometry - Parametric Equations",
    question: "A curve is defined by the parametric equations x = 2t + 1, y = t² - 3t. (a) Find dy/dx in terms of t. (b) Find the coordinates of the point where the curve crosses the x-axis. (c) Find the equation of the tangent at this point.",
    solution_steps: [
      {
        step: 1,
        title: "Find dx/dt and dy/dt",
        explanation: "Differentiate both parametric equations with respect to t",
        working: "x = 2t + 1\ndx/dt = 2\n\ny = t² - 3t\ndy/dt = 2t - 3",
        formula: "dx/dt = 2, dy/dt = 2t - 3"
      },
      {
        step: 2,
        title: "Find dy/dx using chain rule",
        explanation: "Use dy/dx = (dy/dt)/(dx/dt)",
        working: "dy/dx = (dy/dt)/(dx/dt)\n= (2t - 3)/2",
        formula: "dy/dx = (2t - 3)/2"
      },
      {
        step: 3,
        title: "Find where curve crosses x-axis",
        explanation: "At x-axis, y = 0. Solve t² - 3t = 0",
        working: "y = 0\nt² - 3t = 0\nt(t - 3) = 0\nt = 0 or t = 3",
        formula: "t = 0 or t = 3"
      },
      {
        step: 4,
        title: "Find x-coordinates",
        explanation: "Substitute both values of t into x = 2t + 1",
        working: "When t = 0: x = 2(0) + 1 = 1\nWhen t = 3: x = 2(3) + 1 = 7",
        formula: "Points: (1, 0) and (7, 0)"
      },
      {
        step: 5,
        title: "Choose a point for tangent",
        explanation: "Use t = 3 (or t = 0, both are valid). Let's use t = 3 at point (7, 0)",
        working: "At t = 3:\ndy/dx = (2(3) - 3)/2\n= (6 - 3)/2\n= 3/2",
        formula: "Gradient at (7, 0) is 3/2"
      },
      {
        step: 6,
        title: "Find equation of tangent",
        explanation: "Use y - y₁ = m(x - x₁) with point (7, 0) and m = 3/2",
        working: "y - 0 = (3/2)(x - 7)\ny = (3/2)x - 21/2\ny = (3/2)x - 10.5",
        formula: "y = (3/2)x - 21/2",
        exam_tip: "You could also use t = 0 giving point (1, 0) with gradient -3/2, giving y = (-3/2)x + 3/2"
      }
    ],
    final_answer: {
      derivative: "dy/dx = (2t - 3)/2",
      x_axis_points: "(1, 0) and (7, 0)",
      tangent: "y = (3/2)x - 21/2 at (7, 0)"
    },
    key_concepts: [
      "Parametric differentiation: dy/dx = (dy/dt)/(dx/dt)",
      "Solving quadratic equations",
      "Equation of tangent",
      "Parametric curves"
    ],
    common_mistakes: [
      "Forgetting to divide by dx/dt when finding dy/dx",
      "Finding only one point where curve crosses x-axis",
      "Not simplifying dy/dx",
      "Using wrong point or gradient in tangent equation"
    ],
    exam_technique: "Always state which point you're using if there are multiple options. Both are correct but you must be consistent."
  },

  {
    topic: "Integration - Integration by Parts",
    question: "Find ∫x cos(x) dx",
    solution_steps: [
      {
        step: 1,
        title: "Choose u and dv/dx",
        explanation: "Use LATE rule (Logarithmic, Algebraic, Trigonometric, Exponential). Choose u = x (algebraic) and dv/dx = cos(x)",
        working: "Let u = x, so du/dx = 1\nLet dv/dx = cos(x), so v = sin(x)",
        formula: "u = x, v = sin(x), du/dx = 1"
      },
      {
        step: 2,
        title: "Apply integration by parts formula",
        explanation: "Use ∫u(dv/dx)dx = uv - ∫v(du/dx)dx",
        working: "∫x cos(x) dx = x sin(x) - ∫sin(x) × 1 dx\n= x sin(x) - ∫sin(x) dx",
        formula: "= x sin(x) - ∫sin(x) dx"
      },
      {
        step: 3,
        title: "Complete the integration",
        explanation: "Integrate sin(x) to get -cos(x)",
        working: "= x sin(x) - (-cos(x)) + c\n= x sin(x) + cos(x) + c",
        formula: "= x sin(x) + cos(x) + c"
      },
      {
        step: 4,
        title: "Verify by differentiation",
        explanation: "Check our answer by differentiating",
        working: "d/dx[x sin(x) + cos(x) + c]\n= sin(x) + x cos(x) - sin(x) + 0\n= x cos(x) ✓",
        formula: "Verified correct",
        exam_tip: "If you have time, always verify integration by differentiating your answer"
      }
    ],
    final_answer: {
      integral: "x sin(x) + cos(x) + c"
    },
    key_concepts: [
      "Integration by parts: ∫u dv = uv - ∫v du",
      "LATE rule for choosing u",
      "Product rule in reverse",
      "Verification by differentiation"
    ],
    common_mistakes: [
      "Choosing u and v the wrong way round",
      "Forgetting the +c",
      "Sign errors when integrating sin(x)",
      "Not simplifying fully"
    ],
    exam_technique: "Write out 'let u = ..., let dv/dx = ...' clearly. This shows method and makes checking easier."
  },

  {
    topic: "Functions - Composite and Inverse Functions",
    question: "Functions f and g are defined by f(x) = 2x + 3, x ∈ ℝ and g(x) = x² - 1, x ∈ ℝ, x ≥ 0. (a) Find fg(x) and gf(x). (b) Solve fg(x) = gf(x). (c) Find g⁻¹(x) and state its domain.",
    solution_steps: [
      {
        step: 1,
        title: "Find fg(x)",
        explanation: "fg(x) means f(g(x)) - substitute g(x) into f",
        working: "fg(x) = f(g(x))\n= f(x² - 1)\n= 2(x² - 1) + 3\n= 2x² - 2 + 3\n= 2x² + 1",
        formula: "fg(x) = 2x² + 1"
      },
      {
        step: 2,
        title: "Find gf(x)",
        explanation: "gf(x) means g(f(x)) - substitute f(x) into g",
        working: "gf(x) = g(f(x))\n= g(2x + 3)\n= (2x + 3)² - 1\n= 4x² + 12x + 9 - 1\n= 4x² + 12x + 8",
        formula: "gf(x) = 4x² + 12x + 8"
      },
      {
        step: 3,
        title: "Solve fg(x) = gf(x)",
        explanation: "Set the two composite functions equal and solve",
        working: "2x² + 1 = 4x² + 12x + 8\n0 = 2x² + 12x + 7\n2x² + 12x + 7 = 0",
        formula: "2x² + 12x + 7 = 0"
      },
      {
        step: 4,
        title: "Use quadratic formula",
        explanation: "Apply quadratic formula with a = 2, b = 12, c = 7",
        working: "x = (-12 ± √(144 - 56))/4\n= (-12 ± √88)/4\n= (-12 ± 2√22)/4\n= (-6 ± √22)/2",
        formula: "x = (-6 ± √22)/2"
      },
      {
        step: 5,
        title: "Check domain restrictions",
        explanation: "g(x) requires x ≥ 0, so check which solutions are valid",
        working: "x = (-6 + √22)/2 ≈ (-6 + 4.69)/2 ≈ -0.65 (invalid, x < 0)\nx = (-6 - √22)/2 ≈ (-6 - 4.69)/2 ≈ -5.35 (invalid, x < 0)",
        formula: "No solutions (both values < 0)"
      },
      {
        step: 6,
        title: "Find g⁻¹(x)",
        explanation: "Set y = x² - 1 and make x the subject, considering domain x ≥ 0",
        working: "y = x² - 1\ny + 1 = x²\nx = ±√(y + 1)\nSince x ≥ 0 in g, we take positive root:\nx = √(y + 1)",
        formula: "g⁻¹(x) = √(x + 1)"
      },
      {
        step: 7,
        title: "State domain of g⁻¹",
        explanation: "Domain of g⁻¹ equals range of g. Since g(x) = x² - 1 and x ≥ 0, minimum value is g(0) = -1",
        working: "Range of g: y ≥ -1\nTherefore domain of g⁻¹: x ≥ -1",
        formula: "Domain: x ≥ -1",
        exam_tip: "Domain of f⁻¹ = Range of f. This is a key relationship always true for inverse functions."
      }
    ],
    final_answer: {
      fg: "2x² + 1",
      gf: "4x² + 12x + 8",
      solutions: "No solutions",
      inverse: "g⁻¹(x) = √(x + 1), x ≥ -1"
    },
    key_concepts: [
      "Composite functions",
      "Function notation",
      "Inverse functions",
      "Domain and range",
      "Quadratic formula"
    ],
    common_mistakes: [
      "Confusing fg(x) with f(x)g(x)",
      "Not checking domain restrictions on solutions",
      "Forgetting to state domain of inverse",
      "Taking both ± roots for inverse when function is one-to-one"
    ],
    exam_technique: "Always check your solutions against domain restrictions. An algebraically correct answer outside the domain scores 0."
  },

  {
    topic: "Proof - Mathematical Induction",
    question: "Prove by mathematical induction that for all positive integers n, 1 + 3 + 5 + ... + (2n - 1) = n²",
    solution_steps: [
      {
        step: 1,
        title: "Base case: Verify for n = 1",
        explanation: "Check the formula works for the first value (n = 1)",
        working: "When n = 1:\nLHS = 2(1) - 1 = 1\nRHS = 1² = 1\nLHS = RHS ✓",
        formula: "True for n = 1"
      },
      {
        step: 2,
        title: "Inductive hypothesis",
        explanation: "Assume the formula is true for n = k (where k is some positive integer)",
        working: "Assume: 1 + 3 + 5 + ... + (2k - 1) = k²",
        formula: "Assumption: Σ(2i-1) = k² for i=1 to k"
      },
      {
        step: 3,
        title: "Prove for n = k + 1",
        explanation: "We need to show: 1 + 3 + 5 + ... + (2k - 1) + (2(k+1) - 1) = (k+1)²",
        working: "LHS = [1 + 3 + 5 + ... + (2k - 1)] + (2(k+1) - 1)\nUsing our assumption:\n= k² + (2k + 2 - 1)\n= k² + 2k + 1\n= (k + 1)²\n= RHS ✓",
        formula: "LHS = (k + 1)² = RHS"
      },
      {
        step: 4,
        title: "Conclusion",
        explanation: "State that we've proven the statement by mathematical induction",
        working: "• True for n = 1 (base case)\n• Assumed true for n = k\n• Proven true for n = k + 1\n• Therefore true for all positive integers n by mathematical induction",
        formula: "Proven by induction",
        exam_tip: "Always write a clear conclusion stating 'by mathematical induction' - this is required for full marks"
      }
    ],
    final_answer: {
      proof: "Proven by mathematical induction for all n ∈ ℤ⁺"
    },
    key_concepts: [
      "Mathematical induction",
      "Base case verification",
      "Inductive hypothesis",
      "Proof structure"
    ],
    common_mistakes: [
      "Not verifying base case",
      "Not clearly stating the assumption",
      "Not using the assumption in the k+1 step",
      "Forgetting the conclusion statement"
    ],
    exam_technique: "Structure is key: (1) Base case, (2) Assume for k, (3) Prove for k+1, (4) Conclude. Missing any part loses marks."
  },

  {
    topic: "Calculus - Definite Integration and Area",
    question: "The curve y = x³ - 4x² + 3x intersects the x-axis at x = 0, x = 1, and x = 3. Find the total area enclosed between the curve and the x-axis.",
    solution_steps: [
      {
        step: 1,
        title: "Sketch the curve",
        explanation: "Understanding the shape helps identify where the curve is above/below x-axis",
        working: "Factorize: y = x(x² - 4x + 3) = x(x - 1)(x - 3)\nRoots at x = 0, 1, 3\nCurve crosses x-axis at these points",
        formula: "y = x(x - 1)(x - 3)"
      },
      {
        step: 2,
        title: "Determine regions above and below x-axis",
        explanation: "Test points to see where curve is positive/negative",
        working: "Test x = 0.5: y = 0.5(-0.5)(-2.5) = 0.625 > 0 (above)\nTest x = 2: y = 2(1)(-1) = -2 < 0 (below)\nRegion 1 (0 to 1): above x-axis\nRegion 2 (1 to 3): below x-axis",
        formula: "Two regions to consider"
      },
      {
        step: 3,
        title: "Find area of region 1 (0 to 1)",
        explanation: "Integrate from 0 to 1. Curve is above x-axis so result will be positive",
        working: "A₁ = ∫₀¹ (x³ - 4x² + 3x) dx\n= [x⁴/4 - 4x³/3 + 3x²/2]₀¹\n= (1/4 - 4/3 + 3/2) - 0\n= (3/12 - 16/12 + 18/12)\n= 5/12",
        formula: "A₁ = 5/12"
      },
      {
        step: 4,
        title: "Find area of region 2 (1 to 3)",
        explanation: "Integrate from 1 to 3. Curve is below x-axis so we take absolute value",
        working: "A₂ = |∫₁³ (x³ - 4x² + 3x) dx|\n= |[x⁴/4 - 4x³/3 + 3x²/2]₁³|\n= |(81/4 - 36 + 27/2) - (1/4 - 4/3 + 3/2)|\n= |(81/4 - 144/4 + 54/4) - (3/12 - 16/12 + 18/12)|\n= |(-9/4) - (5/12)|\n= |-27/12 - 5/12|\n= |-32/12|\n= 32/12 = 8/3",
        formula: "A₂ = 8/3"
      },
      {
        step: 5,
        title: "Calculate total area",
        explanation: "Add the absolute values of both regions",
        working: "Total area = A₁ + A₂\n= 5/12 + 8/3\n= 5/12 + 32/12\n= 37/12",
        formula: "Total area = 37/12 square units",
        exam_tip: "When curve goes below x-axis, you must take absolute value of the integral to get actual area"
      }
    ],
    final_answer: {
      total_area: "37/12 square units"
    },
    key_concepts: [
      "Definite integration",
      "Area under curves",
      "Absolute values for area below x-axis",
      "Factorization to find roots"
    ],
    common_mistakes: [
      "Not taking absolute value when curve is below x-axis",
      "Forgetting to split into regions",
      "Arithmetic errors with fractions",
      "Using wrong limits of integration"
    ],
    exam_technique: "Always sketch the curve first. Identify regions clearly. Remember: area is always positive, but integrals can be negative."
  },

  {
    topic: "Algebra - Partial Fractions",
    question: "Express (5x + 7)/((x + 1)(x + 3)) in partial fractions.",
    solution_steps: [
      {
        step: 1,
        title: "Set up partial fraction form",
        explanation: "Since we have two linear factors, use the form A/(x+1) + B/(x+3)",
        working: "(5x + 7)/((x + 1)(x + 3)) = A/(x + 1) + B/(x + 3)",
        formula: "(5x + 7)/((x + 1)(x + 3)) = A/(x + 1) + B/(x + 3)"
      },
      {
        step: 2,
        title: "Multiply through by denominator",
        explanation: "Multiply both sides by (x + 1)(x + 3) to clear fractions",
        working: "5x + 7 = A(x + 3) + B(x + 1)",
        formula: "5x + 7 = A(x + 3) + B(x + 1)"
      },
      {
        step: 3,
        title: "Substitute x = -1",
        explanation: "Choose x = -1 to make the (x + 1) term zero and solve for A",
        working: "When x = -1:\n5(-1) + 7 = A(-1 + 3) + B(0)\n-5 + 7 = 2A\n2 = 2A\nA = 1",
        formula: "A = 1"
      },
      {
        step: 4,
        title: "Substitute x = -3",
        explanation: "Choose x = -3 to make the (x + 3) term zero and solve for B",
        working: "When x = -3:\n5(-3) + 7 = A(0) + B(-3 + 1)\n-15 + 7 = -2B\n-8 = -2B\nB = 4",
        formula: "B = 4"
      },
      {
        step: 5,
        title: "Write final answer",
        explanation: "Substitute A and B values back into partial fraction form",
        working: "(5x + 7)/((x + 1)(x + 3)) = 1/(x + 1) + 4/(x + 3)",
        formula: "= 1/(x + 1) + 4/(x + 3)"
      },
      {
        step: 6,
        title: "Verify (optional but recommended)",
        explanation: "Check by combining fractions back together",
        working: "1/(x + 1) + 4/(x + 3)\n= (x + 3 + 4(x + 1))/((x + 1)(x + 3))\n= (x + 3 + 4x + 4)/((x + 1)(x + 3))\n= (5x + 7)/((x + 1)(x + 3)) ✓",
        formula: "Verified correct",
        exam_tip: "Substitution method is fastest for linear factors. For repeated factors or irreducible quadratics, use equating coefficients."
      }
    ],
    final_answer: {
      partial_fractions: "1/(x + 1) + 4/(x + 3)"
    },
    key_concepts: [
      "Partial fractions",
      "Linear factors",
      "Substitution method",
      "Algebraic manipulation"
    ],
    common_mistakes: [
      "Wrong form for partial fractions (e.g., using (Ax + B) for linear factors)",
      "Arithmetic errors when substituting",
      "Not checking the answer",
      "Sign errors when expanding"
    ],
    exam_technique: "Use substitution method for distinct linear factors - it's quick and accurate. Always choose x values that make terms zero."
  }
];

// Export all examples
export default COMPREHENSIVE_ALEVEL_EXAMPLES;

// Also export by topic for easier filtering
export const EXAMPLES_BY_TOPIC = {
  calculus: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Calculus')),
  algebra: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Algebra')),
  trigonometry: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Trigonometry')),
  sequences: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Sequences')),
  functions: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Functions')),
  coordinate_geometry: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Coordinate Geometry')),
  proof: COMPREHENSIVE_ALEVEL_EXAMPLES.filter(ex => ex.topic.includes('Proof'))
};

// Helper to merge with existing examples
export function mergeWithExistingExamples(existingExamples = []) {
  return [...existingExamples, ...COMPREHENSIVE_ALEVEL_EXAMPLES];
}