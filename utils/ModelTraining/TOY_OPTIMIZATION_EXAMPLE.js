// 3D GEOMETRY WITH CALCULUS OPTIMIZATION
// This combines geometry, volume/surface area, and differentiation

const TOY_OPTIMIZATION_EXAMPLE = {
  topic: "3D Geometry - Surface Area Optimization with Calculus",
  question: "A company makes toys for children. Figure 5 shows the design for a solid toy that looks like a piece of cheese. The toy is modelled so that: face ABC is a sector of a circle with radius r cm and centre A; angle BAC = 0.8 radians; faces ABC and DEF are congruent; edges AD, CF and BE are perpendicular to faces ABC and DEF; edges AD, CF and BE have length h cm. Given that the volume of the toy is 240 cm³, (a) show that the surface area of the toy, S cm², is given by S = 0.8r² + 1680/r, making your method clear. Using algebraic differentiation, (b) find the value of r for which S has a stationary point. (c) Prove, by further differentiation, that this value of r gives the minimum surface area of the toy.",
  
  // PART (a) - Separate numbering
  part_a_steps: [
    {
      step: 1,
      title: "Identify all surfaces of the toy",
      explanation: "This 3D shape (like a cheese wedge) has 5 faces: 2 sector faces (top and bottom), 2 rectangular faces (sides), and 1 curved face (the arc). We need to find the area of each.",
      working: "The toy has 5 faces:\n1. Sector ABC (top)\n2. Sector DEF (bottom) - congruent to ABC\n3. Rectangle ABED (side)\n4. Rectangle ACFD (side)\n5. Curved surface BCFE (the arc side)",
      formula: "Total Surface Area = 2×(sector) + 2×(rectangle) + curved surface"
    },
    {
      step: 2,
      title: "Find area of sector ABC",
      explanation: "A sector area is given by A = (1/2)r²θ where θ is in radians. Here r is the radius and θ = 0.8 rad",
      working: "Area of sector ABC = (1/2)r²θ\n= (1/2)r²(0.8)\n= 0.4r²",
      formula: "Area of one sector = 0.4r² cm²"
    },
    {
      step: 3,
      title: "Find area of two sectors (top and bottom)",
      explanation: "Since ABC and DEF are congruent, they have the same area",
      working: "Total area of both sectors = 2 × 0.4r²\n= 0.8r²",
      formula: "Area of both sectors = 0.8r² cm²"
    },
    {
      step: 4,
      title: "Find area of rectangular sides ABED and ACFD",
      explanation: "These rectangles have dimensions: length = r (the radius), height = h",
      working: "Area of rectangle ABED = r × h = rh\nArea of rectangle ACFD = r × h = rh\nTotal area of both rectangles = 2rh",
      formula: "Area of both rectangles = 2rh cm²"
    },
    {
      step: 5,
      title: "Find area of curved surface BCFE",
      explanation: "This is a curved rectangle. Its width is the arc length BC, and its height is h. Arc length = rθ where θ = 0.8 rad",
      working: "Arc length BC = rθ = r(0.8) = 0.8r\nArea of curved surface = arc length × height\n= 0.8r × h\n= 0.8rh",
      formula: "Area of curved surface = 0.8rh cm²"
    },
    {
      step: 6,
      title: "Express total surface area in terms of r and h",
      explanation: "Add all five surface areas together",
      working: "S = (both sectors) + (both rectangles) + (curved surface)\nS = 0.8r² + 2rh + 0.8rh\nS = 0.8r² + 2.8rh",
      formula: "S = 0.8r² + 2.8rh"
    },
    {
      step: 7,
      title: "Find volume formula for the toy",
      explanation: "Volume of this prism = (area of cross-section) × height. The cross-section is the sector ABC",
      working: "Volume = (area of sector) × h\nV = (1/2)r²θ × h\nV = (1/2)r²(0.8) × h\nV = 0.4r²h",
      formula: "V = 0.4r²h cm³"
    },
    {
      step: 8,
      title: "Use given volume to express h in terms of r",
      explanation: "We're told the volume is 240 cm³, so substitute V = 240 and rearrange for h",
      working: "0.4r²h = 240\nr²h = 240 ÷ 0.4\nr²h = 600\nh = 600/r²",
      formula: "h = 600/r²"
    },
    {
      step: 9,
      title: "Substitute h into surface area formula",
      explanation: "Replace h with 600/r² in S = 0.8r² + 2.8rh to get S in terms of r only",
      working: "S = 0.8r² + 2.8rh\nS = 0.8r² + 2.8r(600/r²)\nS = 0.8r² + (2.8 × 600)r/r²\nS = 0.8r² + 1680r/r²\nS = 0.8r² + 1680/r",
      formula: "S = 0.8r² + 1680/r ✓",
      exam_tip: "This is a 'show that' question, so your final line must exactly match the given formula. Show every algebraic step clearly."
    }
  ],
  
  part_a_answer: {
    formula: "S = 0.8r² + 1680/r"
  },
  
  // PART (b) - Separate numbering starting from 1
  part_b_steps: [
    {
      step: 1,
      title: "Rewrite S in a form suitable for differentiation",
      explanation: "Write 1680/r as 1680r⁻¹ so we can use the power rule",
      working: "S = 0.8r² + 1680/r\nS = 0.8r² + 1680r⁻¹",
      formula: "S = 0.8r² + 1680r⁻¹"
    },
    {
      step: 2,
      title: "Differentiate S with respect to r",
      explanation: "Use the power rule: d/dr(rⁿ) = nrⁿ⁻¹",
      working: "dS/dr = d/dr(0.8r²) + d/dr(1680r⁻¹)\ndS/dr = 0.8(2r) + 1680(-1r⁻²)\ndS/dr = 1.6r - 1680r⁻²\ndS/dr = 1.6r - 1680/r²",
      formula: "dS/dr = 1.6r - 1680/r²"
    },
    {
      step: 3,
      title: "Set derivative equal to zero for stationary point",
      explanation: "At a stationary point, the derivative equals zero",
      working: "dS/dr = 0\n1.6r - 1680/r² = 0",
      formula: "1.6r - 1680/r² = 0"
    },
    {
      step: 4,
      title: "Solve for r",
      explanation: "Rearrange the equation to isolate r",
      working: "1.6r = 1680/r²\nMultiply both sides by r²:\n1.6r³ = 1680\nr³ = 1680/1.6\nr³ = 1050\nr = ∛1050\nr = 10.1817...",
      formula: "r = 10.2 (to 3 s.f.)",
      exam_tip: "Always show the cube root calculation explicitly. Don't jump straight to the decimal answer."
    },
    {
      step: 5,
      title: "Verify the calculation",
      explanation: "Check: 1.6 × 1050 should equal 1680",
      working: "Check: 1.6 × 1050 = 1680 ✓",
      formula: "r = 10.2 cm (3 s.f.)"
    }
  ],
  
  part_b_answer: {
    r_value: "10.2 cm (or ∛1050 cm exactly)"
  },
  
  // PART (c) - Separate numbering starting from 1
  part_c_steps: [
    {
      step: 1,
      title: "State what we need to prove",
      explanation: "To prove this is a minimum, we need to show that d²S/dr² > 0 at r = ∛1050",
      working: "For a minimum: d²S/dr² > 0\nFor a maximum: d²S/dr² < 0\nWe need to find d²S/dr² and check its sign",
      formula: "Need to find d²S/dr²"
    },
    {
      step: 2,
      title: "Find the second derivative",
      explanation: "Differentiate dS/dr = 1.6r - 1680r⁻² with respect to r again",
      working: "dS/dr = 1.6r - 1680r⁻²\n\nd²S/dr² = d/dr(1.6r) - d/dr(1680r⁻²)\nd²S/dr² = 1.6(1) - 1680(-2r⁻³)\nd²S/dr² = 1.6 + 3360r⁻³\nd²S/dr² = 1.6 + 3360/r³",
      formula: "d²S/dr² = 1.6 + 3360/r³"
    },
    {
      step: 3,
      title: "Evaluate the second derivative at r = ∛1050",
      explanation: "Substitute r³ = 1050 (from part b) into the second derivative",
      working: "When r³ = 1050:\nd²S/dr² = 1.6 + 3360/1050\nd²S/dr² = 1.6 + 3.2\nd²S/dr² = 4.8",
      formula: "d²S/dr² = 4.8 at r = ∛1050"
    },
    {
      step: 4,
      title: "State the conclusion",
      explanation: "Since d²S/dr² = 4.8 > 0, this confirms we have a minimum",
      working: "d²S/dr² = 4.8 > 0\nTherefore the stationary point is a MINIMUM",
      formula: "r = ∛1050 gives minimum surface area ✓",
      exam_tip: "Always state the conclusion explicitly: 'Since d²S/dr² > 0, this is a minimum.' Never assume the examiner will infer it."
    }
  ],
  
  part_c_answer: {
    proof: "d²S/dr² = 4.8 > 0, therefore minimum"
  },
  
  final_answer: {
    part_a: "S = 0.8r² + 1680/r (proven)",
    part_b: "r = 10.2 cm (or ∛1050 cm)",
    part_c: "Proven minimum since d²S/dr² = 4.8 > 0"
  },
  
  key_concepts: [
    "3D geometry - identifying all surfaces",
    "Sector area: A = (1/2)r²θ",
    "Arc length: l = rθ",
    "Volume of prism: V = (cross-sectional area) × height",
    "Expressing one variable in terms of another using constraints",
    "Differentiation with negative and fractional powers",
    "Finding stationary points: dS/dr = 0",
    "Second derivative test: d²S/dr² > 0 for minimum",
    "Cube roots and algebraic manipulation"
  ],
  
  common_mistakes: [
    "Missing one or more of the five surfaces in part (a)",
    "Forgetting that there are TWO sector faces (top and bottom)",
    "Not recognizing the curved surface area = arc length × height",
    "Not using the volume constraint to eliminate h",
    "Arithmetic errors: 2.8 × 600 = 1680 (not 1400 or other values)",
    "Not rewriting 1680/r as 1680r⁻¹ before differentiating",
    "Sign error when differentiating: d/dr(r⁻¹) = -r⁻² (negative!)",
    "Not simplifying r³ = 1050 when finding r = ∛1050",
    "In part (c), finding d²S/dr² but not evaluating it at the stationary point",
    "Forgetting to state the conclusion in part (c)",
    "Not showing that d²S/dr² > 0 (just finding it isn't enough)"
  ],
  
  exam_technique: "This is a multi-part question where each part builds on the previous. Part (a) requires careful geometry - list all surfaces systematically. Use the volume constraint to eliminate variables. In part (b), show all algebraic steps when solving for r. In part (c), you MUST evaluate the second derivative AND state the conclusion. Don't assume the examiner knows what you mean - be explicit!"
};

export default TOY_OPTIMIZATION_EXAMPLE;