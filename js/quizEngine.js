/**
 * TuitionBoard AI - Checkpoint Quiz Engine
 * Powers interactive check-for-understanding challenges with immediate chalkboard explanations,
 * AI step-by-step problem solver integration, and celebration confetti.
 */

class QuizEngine {
  constructor() {
    this.modal = document.getElementById("quizModal");
    this.currentQuizData = null;
    this.selectedOptionIndex = null;
    this.isAnswerSubmitted = false;
  }

  openStageQuiz(quizData) {
    if (!quizData && window.appState && window.appState.currentLesson) {
      const stage = window.appState.currentLesson.stages[window.appState.currentStageIndex];
      const qItem = stage.boardItems.find(i => i.type === "quiz");
      if (qItem) quizData = qItem;
    }
    if (!quizData) return;

    this.currentQuizData = quizData;
    this.selectedOptionIndex = null;
    this.isAnswerSubmitted = false;

    const modal = document.getElementById("quizModal");
    if (!modal) return;

    this.renderQuizModal();
    modal.classList.add("modal-open");
    if (window.soundEffects) window.soundEffects.playClick();
  }

  closeQuizModal() {
    const modal = document.getElementById("quizModal");
    if (modal) {
      modal.classList.remove("modal-open");
    }
  }

  renderQuizModal() {
    const q = this.currentQuizData;
    if (!q) return;

    const body = document.getElementById("quizModalBody");
    if (!body) return;

    body.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header-badge">🎯 Tuition Mastery Check</div>
        <h3 class="quiz-question-text">${this.escapeHTML(q.question)}</h3>

        <div class="quiz-options-list" id="quizOptionsList">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" data-index="${idx}" onclick="window.quizEngine.selectOption(${idx})">
              <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="option-label">${this.escapeHTML(opt)}</span>
            </button>
          `).join('')}
        </div>

        <div id="quizHintArea" class="quiz-hint-area" style="display:none;">
          <div class="hint-title">💡 Teacher's Hint:</div>
          <div class="hint-text">${this.escapeHTML(q.hint || "Review the formula written on the left of the board.")}</div>
        </div>

        <div id="quizFeedbackArea" class="quiz-feedback-area" style="display:none;"></div>

        <div class="quiz-action-bar">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-secondary" onclick="window.quizEngine.toggleHint()">
              💡 Hint
            </button>
            <button class="btn-secondary" style="color:var(--accent-cyan); border-color: rgba(6,182,212,0.4);" onclick="window.quizEngine.askAiToSolve()">
              🤖 AI Solve on Board
            </button>
          </div>
          <button class="btn-primary" id="btnSubmitQuiz" onclick="window.quizEngine.submitAnswer()" disabled>
            Check My Answer
          </button>
        </div>
      </div>
    `;
  }

  selectOption(index) {
    if (this.isAnswerSubmitted) return;
    this.selectedOptionIndex = index;

    document.querySelectorAll(".quiz-option-btn").forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add("selected");
      } else {
        btn.classList.remove("selected");
      }
    });

    const submitBtn = document.getElementById("btnSubmitQuiz");
    if (submitBtn) {
      submitBtn.removeAttribute("disabled");
    }
    if (window.soundEffects) window.soundEffects.playClick();
  }

  toggleHint() {
    const hint = document.getElementById("quizHintArea");
    if (hint) {
      hint.style.display = hint.style.display === "none" ? "block" : "none";
      if (window.soundEffects) window.soundEffects.playClick();
    }
  }

  async askAiToSolve() {
    if (!this.currentQuizData) return;
    this.closeQuizModal();

    if (window.appState) {
      await window.appState.solveCustomProblem(
        `Solve and explain this checkpoint question step-by-step: "${this.currentQuizData.question}" (Correct Answer: Option ${String.fromCharCode(65 + this.currentQuizData.correctIndex)})`
      );
    }
  }

  submitAnswer() {
    if (this.selectedOptionIndex === null || this.isAnswerSubmitted) return;
    this.isAnswerSubmitted = true;

    const q = this.currentQuizData;
    const isCorrect = this.selectedOptionIndex === q.correctIndex;
    const feedbackArea = document.getElementById("quizFeedbackArea");
    const submitBtn = document.getElementById("btnSubmitQuiz");

    document.querySelectorAll(".quiz-option-btn").forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add("correct");
      } else if (idx === this.selectedOptionIndex && !isCorrect) {
        btn.classList.add("incorrect");
      }
    });

    if (feedbackArea) {
      feedbackArea.style.display = "block";
      if (isCorrect) {
        feedbackArea.className = "quiz-feedback-area feedback-correct animate-pop-in";
        feedbackArea.innerHTML = `
          <div class="feedback-title">🎉 Brilliant! You got it right!</div>
          <div class="feedback-explanation">${this.escapeHTML(q.explanation)}</div>
        `;
        if (window.soundEffects) window.soundEffects.playSuccessChime();
        if (window.confetti) {
          window.confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        if (window.speechEngine) {
          window.speechEngine.speak("Brilliant work! You nailed this checkpoint question.");
        }
      } else {
        feedbackArea.className = "quiz-feedback-area feedback-incorrect animate-pop-in";
        feedbackArea.innerHTML = `
          <div class="feedback-title">⚠️ Not quite, but great effort!</div>
          <div class="feedback-explanation">${this.escapeHTML(q.explanation)}</div>
        `;
        if (window.speechEngine) {
          window.speechEngine.speak("Good attempt! Let's check the explanation on why option " + String.fromCharCode(65 + q.correctIndex) + " is correct.");
        }
      }
    }

    if (submitBtn) {
      submitBtn.textContent = "Continue Lesson ➔";
      submitBtn.onclick = () => {
        this.closeQuizModal();
        if (window.appState && isCorrect) {
          window.appState.nextStage();
        }
      };
    }
  }

  escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

window.quizEngine = new QuizEngine();
