# 🎓 TuitionBoard AI - Interactive Classroom Blackboard & AI Tutor

**TuitionBoard AI** is a web application designed to simulate an intimate, highly understandable **private tuition classroom experience**. It pairs an interactive, multi-themed smart blackboard (with chalk handwriting aesthetics, KaTeX math rendering, and live drawing tools) with a step-by-step pedagogical AI tutor that narrates lessons, writes on the board in real-time, answers student interruptions, and tests understanding through checkpoint quizzes.

---

## 🌟 Key Features

1. **Smart Interactive Classroom Blackboard**:
   - **4 Visual Classroom Themes**: Classic Green Chalkboard, Dark Slate Academic Board, Clean Modern Whiteboard, and Blueprint Tech Grid.
   - **Rich Chalkboard Cards**: Mathematical formulas rendered via **KaTeX**, real-world analogy cards, step-by-step worked calculations, and sticky notes with pushpins.
   - **Interactive Drawing Toolbar**: Freehand chalk pen (with 5 chalk colors: White, Yellow, Cyan, Mint, Coral), highlighter, laser pointer with glowing motion trail, eraser, undo, and one-click clear.
   - **Dynamic SVG/Canvas Diagrams**: Visual gear multipliers for calculus chain rule, quantum double slit wave interference, 3-layer neural network forward & backprop flow, supply & demand curve equilibrium, and DNA replication fork.

2. **Step-by-Step Tuition Learning Flow**:
   - 5 structured stages per lesson:
     1. *Intuitive Hook & Real-World Analogy*
     2. *Core Mathematical / Scientific Principle*
     3. *Step-by-Step Worked Problem*
     4. *Interactive Checkpoint Challenge (Check for Understanding)*
     5. *Exam Pitfalls, Memory Tips & Revision Sheet*

3. **Multi-Modal AI Tutor & Voice Narration**:
   - Built-in **Web Speech API** text-to-speech audio narration with animated tutor avatar soundwave pulses.
   - **"Raise Hand / Ask Teacher"** interactive dialogue: Student can type or click the microphone to speak questions (e.g., *"Why do we multiply in chain rule?"*). The tutor answers with spoken explanation and adds live chalk notes to the board.

4. **Multi-Disciplinary Curriculum + Custom Topic Generator**:
   - Pre-built high-yield masterclasses:
     - **Calculus**: *The Derivative & Chain Rule Intuition*
     - **Quantum Physics**: *Wave-Particle Duality & Double Slit*
     - **AI & CS**: *How Neural Networks Learn (Backprop Intuition)*
     - **Economics**: *Supply, Demand & Market Equilibrium*
     - **Biology**: *DNA Replication & Leading vs Lagging Strand*
   - **Custom Topic Builder**: Type ANY syllabus topic or question (e.g. *"Fourier Transform"*, *"Dijkstra's Algorithm"*); the engine dynamically generates a structured 5-stage tuition lesson.
   - Optional **Google Gemini API Key** support for unlimited live generative LLM tutoring.

5. **Checkpoint Quizzes & Study Tools**:
   - Multiple-choice questions with hints, immediate feedback, and celebration confetti.
   - **25-minute Pomodoro Tuition Timer**.
   - **Export Tools**: Snapshot the chalkboard as a high-resolution PNG image or export full structured study notes as Markdown.

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari, Brave).

### Option 2: Local HTTP Server (Python)
Open PowerShell in this directory and run:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.
