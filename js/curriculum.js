/**
 * TuitionBoard AI - Pre-built Multi-Disciplinary Tuition Curriculum
 * Structured in 5 progressive pedagogical stages:
 * 1. Intuitive Hook & Real-World Analogy
 * 2. Core Principles, Equations & Formulations
 * 3. Step-by-Step Worked Example / Derivation
 * 4. Interactive Checkpoint Challenge (Check for Understanding)
 * 5. Exam Pitfalls, Memory Tips & Revision Sheet
 */

window.TUITION_CURRICULUM = [
  {
    id: "calc-derivative-chain-rule",
    title: "Calculus: The Derivative & Chain Rule Intuition",
    subject: "Mathematics",
    gradeLevel: "High School & Undergrad",
    icon: "sigma",
    tagline: "Master calculus not by memorizing formulas, but by understanding gear ratios and rates of change.",
    stages: [
      {
        stageNumber: 1,
        title: "The Intuition: Why Do We Need Derivatives?",
        tutorDialogue: "Hello and welcome to today's tuition! Forget cold equations for a moment. Imagine you're driving a car. Your speedometer doesn't tell you the total distance you drove today—it tells you how fast your position is changing at this EXACT split-second. That is the derivative: the instantaneous rate of change! Let's write this down on the board.",
        boardItems: [
          {
            type: "title",
            content: "Concept 1: Instantaneous Rate of Change"
          },
          {
            type: "analogy",
            title: "Car Speedometer Analogy",
            content: "Average Speed = (Total Distance) / (Total Time)\nInstant Speed = Distance traveled over an infinitesimally tiny blink of time (dt)"
          },
          {
            type: "latex",
            label: "The Formal Definition of Derivative:",
            formula: "\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Key Intuition: The slope of the tangent line to the curve at any single point x."
          }
        ],
        diagram: "derivativeSlope"
      },
      {
        stageNumber: 2,
        title: "The Chain Rule: Interlocking Gears",
        tutorDialogue: "Now, what if functions are nested inside each other, like f(g(x))? Think of two connected bicycle gears! If gear A turns 3 times as fast as gear B, and gear B turns 2 times as fast as the wheel, how fast does gear A turn relative to the wheel? You simply multiply: 3 times 2 = 6! That is the Chain Rule!",
        boardItems: [
          {
            type: "title",
            content: "Concept 2: The Chain Rule (Nested Functions)"
          },
          {
            type: "analogy",
            title: "The Gear Ratio Principle",
            content: "Rate(Gear A -> Wheel) = Rate(Gear A -> Gear B) * Rate(Gear B -> Wheel)"
          },
          {
            type: "latex",
            label: "Leibniz Notation (Intuitive Rate Multiplier):",
            formula: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}"
          },
          {
            type: "latex",
            label: "Lagrange Notation (Outer * Inner):",
            formula: "\\frac{d}{dx}\\big[ f(g(x)) \\big] = f'(g(x)) \\cdot g'(x)"
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "Tuition Golden Rule: 'Differentiate the outside first, keep the inside untouched, then multiply by the derivative of the inside!'"
          }
        ],
        diagram: "gearRatio"
      },
      {
        stageNumber: 3,
        title: "Step-by-Step Worked Problem",
        tutorDialogue: "Let's work through an actual exam problem together on the board. We need to find the derivative of y = sin(3x^2 + 5). Watch how we isolate the inside and outside step-by-step.",
        boardItems: [
          {
            type: "title",
            content: "Worked Example: Differentiate y = \\sin(3x^2 + 5)"
          },
          {
            type: "stepList",
            steps: [
              {
                stepNum: "1",
                desc: "Identify the Inner Function u and Outer Function f(u):",
                latex: "u = 3x^2 + 5 \\quad \\implies \\quad y = \\sin(u)"
              },
              {
                stepNum: "2",
                desc: "Differentiate the Outer Function with respect to u:",
                latex: "\\frac{dy}{du} = \\frac{d}{du}[\\sin(u)] = \\cos(u)"
              },
              {
                stepNum: "3",
                desc: "Differentiate the Inner Function with respect to x:",
                latex: "\\frac{du}{dx} = \\frac{d}{dx}[3x^2 + 5] = 6x + 0 = 6x"
              },
              {
                stepNum: "4",
                desc: "Multiply together and substitute u back:",
                latex: "\\frac{dy}{dx} = \\cos(u) \\cdot 6x = \\mathbf{6x \\cos(3x^2 + 5)}"
              }
            ]
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "Notice: The inside function (3x^2 + 5) stays intact inside cosine, followed by the 6x multiplier outside!"
          }
        ]
      },
      {
        stageNumber: 4,
        title: "Tuition Checkpoint: Test Your Understanding",
        tutorDialogue: "It's your turn! Try solving this quick question on your scratchpad. Don't worry if you make a mistake—that's how we master the concept.",
        boardItems: [
          {
            type: "title",
            content: "Quick Tuition Checkpoint Challenge"
          },
          {
            type: "quiz",
            question: "What is the derivative of f(x) = (2x + 7)^4 with respect to x?",
            options: [
              "4(2x + 7)^3",
              "8(2x + 7)^3",
              "8(2x + 7)^4",
              "2(2x + 7)^3"
            ],
            correctIndex: 1,
            explanation: "Using Chain Rule: Power rule on outside gives 4(2x+7)^3. Then multiply by derivative of inside (2x+7)' = 2. So: 4 * (2x+7)^3 * 2 = 8(2x+7)^3.",
            hint: "Don't forget to multiply by the derivative of (2x + 7)!"
          }
        ]
      },
      {
        stageNumber: 5,
        title: "Exam Pitfalls & Revision Summary",
        tutorDialogue: "Awesome job! Here is your chalkboard cheat sheet. Keep these 3 common mistakes in mind before your exams.",
        boardItems: [
          {
            type: "title",
            content: "Summary & Exam Tips: Calculus Chain Rule"
          },
          {
            type: "chalkNote",
            color: "coral",
            text: "PITFALL 1: Forgetting the inner derivative. (e.g. writing d/dx[e^(5x)] = e^(5x) instead of 5e^(5x))."
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "PITFALL 2: Changing the inner function while differentiating the outer."
          },
          {
            type: "latex",
            label: "Mastery Formula To Memorize:",
            formula: "\\frac{d}{dx}[u^n] = n u^{n-1} \\cdot u' \\qquad \\frac{d}{dx}[e^u] = e^u \\cdot u' \\qquad \\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}"
          }
        ]
      }
    ]
  },
  {
    id: "phys-quantum-duality",
    title: "Quantum Physics: Wave-Particle Duality & Double Slit",
    subject: "Physics",
    gradeLevel: "High School & College",
    icon: "atom",
    tagline: "Explore why electrons act like waves until you look at them, and how reality behaves at the quantum scale.",
    stages: [
      {
        stageNumber: 1,
        title: "The Mystery: Is Light a Particle or a Wave?",
        tutorDialogue: "Welcome to Quantum Physics! For centuries, Newton argued light was tiny bullet particles, while Young proved light forms wave ripples. Einstein resolved this: light is BOTH! Photons are quantized packets of wave energy.",
        boardItems: [
          {
            type: "title",
            content: "Concept 1: Wave-Particle Duality"
          },
          {
            type: "analogy",
            title: "The Platypus Analogy",
            content: "A platypus is neither purely a duck nor a beaver—it has characteristics of both. Similarly, quantum entities are neither pure classical waves nor classical billiard balls."
          },
          {
            type: "latex",
            label: "Planck-Einstein Energy Relation:",
            formula: "E = h\\nu = \\frac{hc}{\\lambda}"
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s} (Planck's constant: the fundamental granularity of physics)"
          }
        ],
        diagram: "waveInterference"
      },
      {
        stageNumber: 2,
        title: "De Broglie Matter Waves",
        tutorDialogue: "De Broglie proposed: If light waves act like particles, then matter particles like electrons must have a wavelength too!",
        boardItems: [
          {
            type: "title",
            content: "Concept 2: De Broglie Wavelength"
          },
          {
            type: "latex",
            label: "De Broglie Wavelength Formula:",
            formula: "\\lambda = \\frac{h}{p} = \\frac{h}{m \\cdot v}"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Why don't humans diffract through doors? With mass m = 70 kg, wavelength is ~10^-36 m (undetectable). For an electron (m = 9.1x10^-31 kg), wavelength is atomic scale (~0.1 nm)!"
          }
        ],
        diagram: "matterWaves"
      },
      {
        stageNumber: 3,
        title: "The Double-Slit Experiment",
        tutorDialogue: "Look at the double slit simulation. When electrons pass unobserved through two slits, they form wave interference bands. But the moment a detector looks at the slit, the wave collapses into two particle stripes!",
        boardItems: [
          {
            type: "title",
            content: "The Double-Slit Experiment"
          },
          {
            type: "stepList",
            steps: [
              {
                stepNum: "1",
                desc: "Unobserved (Wave Behavior):",
                latex: "\\psi(x) = \\psi_1(x) + \\psi_2(x) \\implies |\\psi|^2 \\text{ produces interference bands}"
              },
              {
                stepNum: "2",
                desc: "Observed (Wavefunction Collapse):",
                latex: "P(x) = P_1(x) + P_2(x) \\implies \\text{Two classical particle stripes}"
              }
            ]
          },
          {
            type: "chalkNote",
            color: "coral",
            text: "Feynman: 'The double slit contains the central mystery of quantum mechanics.'"
          }
        ]
      },
      {
        stageNumber: 4,
        title: "Tuition Checkpoint: Quantum Test",
        tutorDialogue: "Let's check your physics intuition with this calculation question.",
        boardItems: [
          {
            type: "title",
            content: "Tuition Checkpoint: Wavelength & Momentum"
          },
          {
            type: "quiz",
            question: "If an electron's speed is doubled (v -> 2v), what happens to its de Broglie wavelength λ?",
            options: [
              "It doubles (2λ)",
              "It halves (λ / 2)",
              "It quadruples (4λ)",
              "It remains unchanged"
            ],
            correctIndex: 1,
            explanation: "Since λ = h / (m * v), wavelength is inversely proportional to velocity. Doubling v cuts λ in half (λ / 2).",
            hint: "Check the formula λ = h / (m * v). Where does velocity v sit?"
          }
        ]
      },
      {
        stageNumber: 5,
        title: "Real World Applications & Summary",
        tutorDialogue: "Without wave-particle duality, we wouldn't have Transmission Electron Microscopes or semiconductor quantum tunneling in modern chips!",
        boardItems: [
          {
            type: "title",
            content: "Summary: Quantum Duality In Real Life"
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "1. Electron Microscopes: Utilize short electron wavelength to image atoms and viruses."
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "2. Quantum Tunneling: Enables flash storage, SSDs, and nuclear fusion in stars."
          },
          {
            type: "latex",
            label: "Core Equations:",
            formula: "p = \\frac{h}{\\lambda} \\qquad E = h\\nu = \\hbar \\omega"
          }
        ]
      }
    ]
  },
  {
    id: "cs-neural-networks-backprop",
    title: "AI & CS: How Neural Networks Learn (Backprop Intuition)",
    subject: "Computer Science",
    gradeLevel: "High School & Undergrad",
    icon: "network",
    tagline: "Unpack how artificial brains adjust billions of weights to learn patterns using gradient descent.",
    stages: [
      {
        stageNumber: 1,
        title: "The Intuition: Tuning a Guitar Peg",
        tutorDialogue: "How does an AI model learn? Think of tuning a guitar. You pluck a string (forward pass), hear the pitch error (loss function), and turn the tuning peg in the right direction to fix the error (backpropagation!). Let's write the artificial neuron formula on the board.",
        boardItems: [
          {
            type: "title",
            content: "Concept 1: The Artificial Neuron"
          },
          {
            type: "analogy",
            title: "Guitar String Tuning Analogy",
            content: "1. Forward Pass: Compute prediction.\n2. Loss Calculation: Measure error from truth.\n3. Backward Pass: Adjust each weight peg towards smaller error."
          },
          {
            type: "latex",
            label: "Neuron Forward Equation:",
            formula: "z = \\sum_{i=1}^n w_i x_i + b \\qquad a = \\sigma(z) = \\frac{1}{1 + e^{-z}}"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Weights (w) control feature importance; Bias (b) controls firing threshold."
          }
        ],
        diagram: "neuralNet"
      },
      {
        stageNumber: 2,
        title: "Gradient Descent: Walking Down the Valley",
        tutorDialogue: "The loss function forms a multidimensional valley. The gradient points UP the hill, so we take steps in the OPPOSITE direction (Downhill!).",
        boardItems: [
          {
            type: "title",
            content: "Concept 2: Gradient Descent Optimization"
          },
          {
            type: "latex",
            label: "Loss Function & Weight Update:",
            formula: "L = \\frac{1}{2}(y - \\hat{y})^2 \\qquad w_{new} = w_{old} - \\eta \\frac{\\partial L}{\\partial w}"
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "η (eta) is the Learning Rate: the step size. Too big = overshoots; too small = crawls slowly."
          }
        ]
      },
      {
        stageNumber: 3,
        title: "Backpropagation via Calculus Chain Rule",
        tutorDialogue: "Backprop is just the calculus chain rule chained across layers from output back to input!",
        boardItems: [
          {
            type: "title",
            content: "The Backpropagation Chain Rule"
          },
          {
            type: "stepList",
            steps: [
              {
                stepNum: "1",
                desc: "Loss w.r.t Output Activation:",
                latex: "\\frac{\\partial L}{\\partial \\hat{y}} = - (y - \\hat{y})"
              },
              {
                stepNum: "2",
                desc: "Activation w.r.t Linear Sum z:",
                latex: "\\frac{\\partial \\hat{y}}{\\partial z} = \\sigma'(z) = \\hat{y}(1 - \\hat{y})"
              },
              {
                stepNum: "3",
                desc: "Linear Sum w.r.t Weight w_i:",
                latex: "\\frac{\\partial z}{\\partial w_i} = x_i"
              },
              {
                stepNum: "4",
                desc: "Total Weight Gradient:",
                latex: "\\frac{\\partial L}{\\partial w_i} = -(y - \\hat{y}) \\cdot \\hat{y}(1 - \\hat{y}) \\cdot x_i"
              }
            ]
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "Every weight in GPT-4 and Claude is updated using this exact chain rule equation!"
          }
        ]
      },
      {
        stageNumber: 4,
        title: "Tuition Checkpoint: AI Concepts",
        tutorDialogue: "Let's check your understanding of training dynamics.",
        boardItems: [
          {
            type: "title",
            content: "Tuition Checkpoint: Learning Rate Dynamics"
          },
          {
            type: "quiz",
            question: "What happens during neural network training if the learning rate η is set excessively high?",
            options: [
              "The network learns instantly in 1 step",
              "The loss oscillates wildly and may diverge to infinity",
              "Weights get stuck at 0 (Vanishing Gradient)",
              "The model converts automatically to a Decision Tree"
            ],
            correctIndex: 1,
            explanation: "An excessively large learning rate causes updates to overshoot the loss minimum, causing divergence (NaN loss).",
            hint: "Think about taking gigantic leaps across a narrow canyon."
          }
        ]
      },
      {
        stageNumber: 5,
        title: "Summary & Training Loop Recap",
        tutorDialogue: "Here is your machine learning cheat sheet!",
        boardItems: [
          {
            type: "title",
            content: "Summary: The Deep Learning Loop"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "1. Forward Pass: Compute predictions \\hat{y} = f(x; W)"
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "2. Loss Calculation: Measure error against ground truth."
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "3. Backpropagation: Distribute gradients via Chain Rule."
          },
          {
            type: "chalkNote",
            color: "coral",
            text: "4. Optimizer Step: Update weights W = W - \\eta \\nabla_W L."
          }
        ]
      }
    ]
  },
  {
    id: "econ-supply-demand-equilibrium",
    title: "Economics: Supply, Demand & Market Equilibrium",
    subject: "Economics & Finance",
    gradeLevel: "High School & Undergrad",
    icon: "trending-up",
    tagline: "Understand the invisible hand that sets prices, wages, and trade equilibria in competitive markets.",
    stages: [
      {
        stageNumber: 1,
        title: "The Intuition: The Umbrella in the Rain",
        tutorDialogue: "Welcome to Economics! Why does an umbrella cost $5 on a sunny day but $15 during a sudden thunderstorm? Because price balances buyers' demand and sellers' available supply.",
        boardItems: [
          {
            type: "title",
            content: "Concept 1: The Law of Demand & Supply"
          },
          {
            type: "analogy",
            title: "The Thunderstorm Umbrella Analogy",
            content: "Sudden rain -> Demand surges rightward -> Limited umbrella stock -> Sellers raise prices until buyers and stock balance."
          },
          {
            type: "latex",
            label: "Linear Demand and Supply Functions:",
            formula: "Q_d = a - bP \\qquad Q_s = c + dP"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Demand slopes DOWN (higher price = fewer buyers). Supply slopes UP (higher price = more profit incentive to produce)."
          }
        ],
        diagram: "supplyDemand"
      },
      {
        stageNumber: 2,
        title: "Market Equilibrium: Where Curves Cross",
        tutorDialogue: "When buyers and sellers negotiate, the market settles at Equilibrium Price (P*) where quantity demanded equals quantity supplied.",
        boardItems: [
          {
            type: "title",
            content: "Concept 2: Equilibrium (No Shortage, No Surplus)"
          },
          {
            type: "latex",
            label: "Equilibrium Condition:",
            formula: "Q_d(P^*) = Q_s(P^*) \\implies a - bP^* = c + dP^* \\implies P^* = \\frac{a - c}{b + d}"
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "If Price > P*: Surplus (Glut of unsold items -> Sellers cut prices)."
          },
          {
            type: "chalkNote",
            color: "coral",
            text: "If Price < P*: Shortage (Long queues -> Buyers bid up prices)."
          }
        ]
      },
      {
        stageNumber: 3,
        title: "Step-by-Step Worked Problem",
        tutorDialogue: "Let's calculate equilibrium price and quantity from actual linear equations on the board.",
        boardItems: [
          {
            type: "title",
            content: "Worked Problem: Finding Equilibrium"
          },
          {
            type: "stepList",
            steps: [
              {
                stepNum: "1",
                desc: "Given Demand & Supply equations:",
                latex: "Q_d = 120 - 4P \\quad \\text{and} \\quad Q_s = 20 + 6P"
              },
              {
                stepNum: "2",
                desc: "Equate Q_d = Q_s to solve for P*:",
                latex: "120 - 4P = 20 + 6P \\implies 100 = 10P \\implies \\mathbf{P^* = \\$10}"
              },
              {
                stepNum: "3",
                desc: "Substitute P* = 10 into Demand equation:",
                latex: "Q^* = 120 - 4(10) = 120 - 40 = \\mathbf{80 \\text{ units}}"
              },
              {
                stepNum: "4",
                desc: "Verify with Supply equation:",
                latex: "Q_s = 20 + 6(10) = 20 + 60 = 80 \\quad \\checkmark"
              }
            ]
          }
        ]
      },
      {
        stageNumber: 4,
        title: "Tuition Checkpoint: Market Shocks",
        tutorDialogue: "Let's see how well you analyze supply and demand shifts.",
        boardItems: [
          {
            type: "title",
            content: "Tuition Checkpoint: Supply Shift"
          },
          {
            type: "quiz",
            question: "A new breakthrough automation technology cuts the cost of manufacturing solar panels by 50%. What happens to the solar panel market equilibrium?",
            options: [
              "Supply shifts right -> Price decreases, Quantity increases",
              "Demand shifts left -> Price decreases, Quantity decreases",
              "Supply shifts left -> Price increases, Quantity decreases",
              "Both price and quantity remain completely unchanged"
            ],
            correctIndex: 0,
            explanation: "Cheaper manufacturing shifts Supply to the right. The new intersection yields a lower price (P*) and a higher quantity (Q*).",
            hint: "Does cheaper technology affect buyers' desire or sellers' production capacity?"
          }
        ]
      },
      {
        stageNumber: 5,
        title: "Summary & Exam Cheat Sheet",
        tutorDialogue: "Keep this essential distinction in mind for tests: Movement along curve vs Shift of curve.",
        boardItems: [
          {
            type: "title",
            content: "Summary: Shifts vs Movements"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Movement along curve: Caused ONLY by a change in that good's own price."
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "Shift of curve: Caused by external factors (Income, Consumer Taste, Technology, Input Costs, Taxes)."
          },
          {
            type: "latex",
            label: "Price Elasticity of Demand:",
            formula: "E_d = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{dQ_d}{dP} \\cdot \\frac{P}{Q}"
          }
        ]
      }
    ]
  },
  {
    id: "bio-dna-replication-fork",
    title: "Biology: DNA Replication & Leading vs Lagging Strand",
    subject: "Biology & Genetics",
    gradeLevel: "High School & College",
    icon: "dna",
    tagline: "Discover how molecular nanomachines unzip and faithfully copy 3 billion letters of human DNA in minutes.",
    stages: [
      {
        stageNumber: 1,
        title: "The Intuition: The One-Way Zipper Dilemma",
        tutorDialogue: "Welcome to Molecular Biology! Imagine an unzipping jacket with two tracks. One construction worker can walk forward smoothly paving new track. But the second worker is legally only allowed to walk backwards! That is DNA replication: Polymerase can only build in the 5' to 3' direction!",
        boardItems: [
          {
            type: "title",
            content: "Concept 1: The Asymmetry of the Replication Fork"
          },
          {
            type: "analogy",
            title: "The One-Way Construction Crew Analogy",
            content: "DNA Polymerase adds nucleotides only to the 3' -OH end of an existing strand. Because strands are antiparallel (5'->3' and 3'->5'), one side is continuous while the other is synthesized in fragmented backward leaps!"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "Golden Rule of Molecular Biology: DNA is synthesized 5' -> 3' (Five prime to Three prime)."
          }
        ],
        diagram: "dnaFork"
      },
      {
        stageNumber: 2,
        title: "The Molecular Machinery",
        tutorDialogue: "Let's catalog the 4 superstar enzymes working at the replication fork on the chalkboard.",
        boardItems: [
          {
            type: "title",
            content: "The Molecular Machinery"
          },
          {
            type: "stepList",
            steps: [
              {
                stepNum: "1",
                desc: "Helicase (The Unzipper):",
                latex: "\\text{Breaks hydrogen bonds between base pairs (A=T, G}\\equiv\\text{C)}"
              },
              {
                stepNum: "2",
                desc: "RNA Primase (The Starter):",
                latex: "\\text{Lays down a short RNA primer to provide a 3'-OH starting block}"
              },
              {
                stepNum: "3",
                desc: "DNA Polymerase III (The Builder):",
                latex: "\\text{Adds complementary dNTPs rapidly (1000 nucleotides/sec)}"
              },
              {
                stepNum: "4",
                desc: "DNA Ligase (The Glue):",
                latex: "\\text{Seals phosphodiester backbone nicks between Okazaki fragments}"
              }
            ]
          }
        ]
      },
      {
        stageNumber: 3,
        title: "Leading vs Lagging Strand",
        tutorDialogue: "Notice how the Leading strand points towards the opening fork (smooth continuous synthesis), whereas the Lagging strand points away from the fork, forming Okazaki fragments that must be stitched together by Ligase.",
        boardItems: [
          {
            type: "title",
            content: "Comparison: Leading vs Lagging Strand"
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "Leading Strand: Synthesized continuously in the 5' -> 3' direction towards the fork. Requires only 1 RNA primer."
          },
          {
            type: "chalkNote",
            color: "coral",
            text: "Lagging Strand: Synthesized discontinuously away from the fork as Okazaki fragments (~100-200 bp in eukaryotes). Requires multiple RNA primers & DNA Ligase."
          },
          {
            type: "latex",
            label: "Base Pairing Complementarity:",
            formula: "A \\longleftrightarrow T \\quad (2 \\text{ H-bonds}) \\qquad G \\longleftrightarrow C \\quad (3 \\text{ H-bonds})"
          }
        ]
      },
      {
        stageNumber: 4,
        title: "Tuition Checkpoint: Enzyme Identification",
        tutorDialogue: "Let's check your knowledge of replication enzymes with this checkpoint question.",
        boardItems: [
          {
            type: "title",
            content: "Tuition Checkpoint: Enzymatic Roles"
          },
          {
            type: "quiz",
            question: "Which enzyme is responsible for joining the sugar-phosphate backbones of Okazaki fragments on the lagging strand?",
            options: [
              "DNA Helicase",
              "DNA Ligase",
              "RNA Primase",
              "Topoisomerase"
            ],
            correctIndex: 1,
            explanation: "DNA Ligase catalyzes the formation of phosphodiester bonds, effectively 'gluing' the Okazaki fragments together into one continuous strand.",
            hint: "Think of the molecular 'glue' or 'sealer'."
          }
        ]
      },
      {
        stageNumber: 5,
        title: "Mastery Summary & Exam Tips",
        tutorDialogue: "Here is your biology revision sheet. Remember the directionality and enzyme sequence for your upcoming exams!",
        boardItems: [
          {
            type: "title",
            content: "Summary: DNA Replication Key Takeaways"
          },
          {
            type: "chalkNote",
            color: "yellow",
            text: "1. Semi-conservative: Each new double helix has 1 original parental strand and 1 newly synthesized daughter strand."
          },
          {
            type: "chalkNote",
            color: "cyan",
            text: "2. Directionality: Template read 3' -> 5', new strand synthesized 5' -> 3'."
          },
          {
            type: "chalkNote",
            color: "lime",
            text: "3. Proofreading: DNA Polymerase has 3' -> 5' exonuclease activity, reducing errors to 1 in 10 billion!"
          }
        ]
      }
    ]
  }
];
