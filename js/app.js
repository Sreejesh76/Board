/**
 * TuitionBoard AI - Main Application Coordinator
 * Manages lesson state, stage progression, AI problem solver, UI interactions, and tutorial walkthrough.
 */

class AppState {
  constructor() {
    this.currentLesson = null;
    this.currentStageIndex = 0;
    this.isAutoPlay = false;
    this.timerSeconds = 25 * 60; // 25-minute Pomodoro tuition session
    this.timerInterval = null;
    this.isTimerRunning = false;

    this.init();
  }

  init() {
    // Load first topic from curriculum
    if (window.TUITION_CURRICULUM && window.TUITION_CURRICULUM.length > 0) {
      this.currentLesson = window.TUITION_CURRICULUM[0];
    }

    // Initialize Chalkboard engine
    window.chalkboard = new window.ChalkboardEngine();

    // Hook up speech state listeners to animate tutor avatar
    if (window.speechEngine) {
      window.speechEngine.onSpeakingStateChange = (state) => {
        this.updateTutorAvatar(state.isSpeaking, state.isListening);
      };

      window.speechEngine.onSpeechRecognized = (transcript, isFinal) => {
        const questionInput = document.getElementById("askTeacherInput");
        if (questionInput) {
          questionInput.value = transcript;
        }
        if (isFinal) {
          const micBtn = document.getElementById("btnMicInput");
          if (micBtn) micBtn.classList.remove("mic-active");
          this.submitStudentQuestion();
        }
      };
    }

    // Initialize UI listeners and render initial lesson
    this.renderHeader();
    this.renderStageTimeline();
    this.loadStage(0);
    this.initDrawingToolbar();
    this.initTimer();
  }

  selectLesson(lessonId) {
    const found = window.TUITION_CURRICULUM.find(l => l.id === lessonId);
    if (found) {
      this.currentLesson = found;
      this.currentStageIndex = 0;
      this.renderHeader();
      this.renderStageTimeline();
      this.loadStage(0);
      this.closeModal("topicModal");
      if (window.soundEffects) window.soundEffects.playClick();
    }
  }

  loadStage(stageIndex) {
    if (!this.currentLesson || stageIndex < 0 || stageIndex >= this.currentLesson.stages.length) return;

    this.currentStageIndex = stageIndex;
    const stage = this.currentLesson.stages[stageIndex];

    // Update Chalkboard content
    if (window.chalkboard) {
      window.chalkboard.renderStageContent(stage);
    }

    // Update Tutor Dialogue bubble
    this.updateTutorBubble(stage);

    // Update Navigation buttons
    this.updateNavButtons();

    // Update Stage Timeline indicator
    this.updateStageTimeline();

    // Speak stage dialogue
    if (window.speechEngine && !window.speechEngine.isMuted) {
      window.speechEngine.speak(stage.tutorDialogue, () => {
        if (this.isAutoPlay && this.currentStageIndex < this.currentLesson.stages.length - 1) {
          setTimeout(() => this.nextStage(), 2500);
        }
      });
    }
  }

  nextStage() {
    if (!this.currentLesson) return;
    if (this.currentStageIndex < this.currentLesson.stages.length - 1) {
      this.loadStage(this.currentStageIndex + 1);
      if (window.soundEffects) window.soundEffects.playClick();
    } else {
      // Completed all stages!
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      }
      if (window.speechEngine) {
        window.speechEngine.speak("Congratulations! You have completed all 5 stages of this tuition masterclass.");
      }
    }
  }

  prevStage() {
    if (this.currentStageIndex > 0) {
      this.loadStage(this.currentStageIndex - 1);
      if (window.soundEffects) window.soundEffects.playClick();
    }
  }

  replayAudio() {
    if (!this.currentLesson) return;
    const stage = this.currentLesson.stages[this.currentStageIndex];
    if (window.speechEngine) {
      window.speechEngine.speak(stage.tutorDialogue);
    }
  }

  toggleSpeechMute() {
    if (window.speechEngine) {
      const isMuted = window.speechEngine.toggleVoiceMute();
      const btn = document.getElementById("btnVoiceToggle");
      if (btn) {
        btn.innerHTML = isMuted 
          ? `<span class="icon">🔇</span><span>Voice Muted</span>` 
          : `<span class="icon">🔊</span><span>Voice On</span>`;
        btn.classList.toggle("btn-active-state", !isMuted);
      }
    }
  }

  toggleSfxMute() {
    if (window.soundEffects) {
      const isMuted = window.soundEffects.toggleMute();
      const btn = document.getElementById("btnSfxToggle");
      if (btn) {
        btn.innerHTML = isMuted 
          ? `<span class="icon">🔕</span><span>SFX Off</span>` 
          : `<span class="icon">🔔</span><span>SFX On</span>`;
      }
    }
  }

  updateTutorBubble(stage) {
    const textEl = document.getElementById("tutorSpeechText");
    const stageTitleEl = document.getElementById("tutorStageTitle");
    if (textEl) {
      textEl.textContent = stage.tutorDialogue;
    }
    if (stageTitleEl) {
      stageTitleEl.textContent = `Stage ${stage.stageNumber}: ${stage.title}`;
    }
  }

  updateTutorAvatar(isSpeaking, isListening) {
    const avatar = document.getElementById("tutorAvatarContainer");
    const soundwaves = document.getElementById("tutorSoundwave");
    if (avatar) {
      if (isSpeaking) {
        avatar.classList.add("tutor-speaking");
      } else {
        avatar.classList.remove("tutor-speaking");
      }

      if (isListening) {
        avatar.classList.add("tutor-listening");
      } else {
        avatar.classList.remove("tutor-listening");
      }
    }
    if (soundwaves) {
      soundwaves.style.display = isSpeaking ? "flex" : "none";
    }
  }

  renderHeader() {
    if (!this.currentLesson) return;
    const titleEl = document.getElementById("headerTopicTitle");
    const subjectEl = document.getElementById("headerSubjectTag");
    if (titleEl) titleEl.textContent = this.currentLesson.title;
    if (subjectEl) subjectEl.textContent = this.currentLesson.subject;
  }

  renderStageTimeline() {
    const timelineEl = document.getElementById("stageTimeline");
    if (!timelineEl || !this.currentLesson) return;

    timelineEl.innerHTML = this.currentLesson.stages.map((stage, idx) => `
      <button class="stage-step-pill ${idx === this.currentStageIndex ? 'active' : ''}" 
              onclick="window.appState.loadStage(${idx})" 
              title="Stage ${stage.stageNumber}: ${stage.title}">
        <span class="step-num">${stage.stageNumber}</span>
        <span class="step-label">${stage.title.split(':')[0]}</span>
      </button>
    `).join('');
  }

  updateStageTimeline() {
    document.querySelectorAll(".stage-step-pill").forEach((pill, idx) => {
      if (idx === this.currentStageIndex) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  updateNavButtons() {
    const prevBtn = document.getElementById("btnPrevStage");
    const nextBtn = document.getElementById("btnNextStage");
    if (prevBtn) {
      prevBtn.disabled = this.currentStageIndex === 0;
    }
    if (nextBtn) {
      if (this.currentLesson && this.currentStageIndex === this.currentLesson.stages.length - 1) {
        nextBtn.innerHTML = `<span>Mastered! 🎉</span>`;
      } else {
        nextBtn.innerHTML = `<span>Next Step</span> ➔`;
      }
    }
  }

  /**
   * Raise hand / Ask Teacher dialogue submission
   */
  async submitStudentQuestion() {
    const input = document.getElementById("askTeacherInput");
    if (!input || !input.value.trim()) return;

    const question = input.value.trim();
    input.value = "";

    const statusEl = document.getElementById("askTeacherStatus");
    if (statusEl) {
      statusEl.style.display = "block";
      statusEl.textContent = "Teacher is preparing explanation...";
    }

    if (window.appState.currentLesson) {
      const currentStage = window.appState.currentLesson.stages[window.appState.currentStageIndex];
      const answer = await window.geminiService.askTutor(question, window.appState.currentLesson, currentStage);

      if (statusEl) {
        statusEl.style.display = "none";
      }

      // Update tutor speech and write on board
      if (answer && answer.speech) {
        const textEl = document.getElementById("tutorSpeechText");
        if (textEl) {
          textEl.innerHTML = `<strong>Q: "${question}"</strong><br><br>${answer.speech}`;
        }
        if (window.speechEngine) {
          window.speechEngine.speak(answer.speech);
        }
      }

      if (answer && answer.chalkNote && window.chalkboard) {
        window.chalkboard.appendLiveNote(answer.chalkNote);
      }
    }
  }

  /**
   * AI Step-by-Step Problem Solver
   */
  async solveCustomProblem(customText) {
    let problemText = customText;
    if (!problemText) {
      const input = document.getElementById("problemSolverInput");
      if (input && input.value.trim()) {
        problemText = input.value.trim();
      }
    }

    if (!problemText) return;

    const statusEl = document.getElementById("problemSolverStatus");
    const modal = document.getElementById("solverModal");
    if (statusEl) {
      statusEl.style.display = "block";
      statusEl.textContent = "🤖 AI Tutor is writing derivations on the chalkboard...";
    }

    const context = this.currentLesson ? `${this.currentLesson.title} (${this.currentLesson.subject})` : "";
    const solution = await window.geminiService.solveProblem(problemText, context);

    if (statusEl) statusEl.style.display = "none";
    if (modal) this.closeModal("solverModal");

    if (solution && window.chalkboard) {
      window.chalkboard.renderProblemSolution(solution);

      // Update tutor dialogue and speak
      const textEl = document.getElementById("tutorSpeechText");
      if (textEl) {
        textEl.innerHTML = `<strong>Solving: "${solution.problemTitle}"</strong><br><br>${solution.spokenSummary || solution.strategy}`;
      }
      if (window.speechEngine) {
        window.speechEngine.speak(solution.spokenSummary || solution.strategy);
      }
    }
  }

  solveCurrentCheckpointWithAI() {
    if (!this.currentLesson) return;
    const stage = this.currentLesson.stages[this.currentStageIndex];
    const qItem = stage.boardItems.find(i => i.type === "quiz");
    if (qItem) {
      this.solveCustomProblem(`Solve this checkpoint challenge step-by-step: "${qItem.question}"`);
    }
  }

  toggleVoiceRecognition() {
    if (window.speechEngine) {
      const micBtn = document.getElementById("btnMicInput");
      if (window.speechEngine.isListening) {
        window.speechEngine.stopListening();
        if (micBtn) micBtn.classList.remove("mic-active");
      } else {
        window.speechEngine.startListening();
        if (micBtn) micBtn.classList.add("mic-active");
      }
    }
  }

  /**
   * Custom Topic Generation
   */
  async createCustomTopic() {
    const promptInput = document.getElementById("customTopicInput");
    if (!promptInput || !promptInput.value.trim()) return;

    const topicQuery = promptInput.value.trim();
    const btn = document.getElementById("btnGenerateCustomTopic");
    const loader = document.getElementById("customTopicLoader");

    if (btn) btn.disabled = true;
    if (loader) loader.style.display = "block";

    try {
      const newLesson = await window.geminiService.generateCustomLesson(topicQuery);
      if (newLesson && newLesson.stages && newLesson.stages.length > 0) {
        // Add to curriculum and switch
        window.TUITION_CURRICULUM.unshift(newLesson);
        this.selectLesson(newLesson.id);
        promptInput.value = "";
      }
    } catch (err) {
      console.warn("Failed to generate custom lesson:", err);
      alert("Could not generate custom lesson. Please try another topic.");
    } finally {
      if (btn) btn.disabled = false;
      if (loader) loader.style.display = "none";
    }
  }

  initDrawingToolbar() {
    // Tool buttons
    document.querySelectorAll(".tool-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tool = btn.getAttribute("data-tool");
        if (tool && window.chalkboard) {
          window.chalkboard.currentTool = tool;
          document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          if (window.soundEffects) window.soundEffects.playClick();
        }
      });
    });

    // Color buttons
    document.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        const color = dot.getAttribute("data-color");
        if (color && window.chalkboard) {
          window.chalkboard.currentColor = color;
          document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
          dot.classList.add("active");
          if (window.soundEffects) window.soundEffects.playClick();
        }
      });
    });
  }

  // Modals management
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("modal-open");
      if (window.soundEffects) window.soundEffects.playClick();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("modal-open");
    }
  }

  // Pomodoro Tuition Session Timer
  initTimer() {
    const display = document.getElementById("sessionTimerDisplay");
    this.updateTimerDisplay();

    const toggleBtn = document.getElementById("btnTimerToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (this.isTimerRunning) {
          this.pauseTimer();
          toggleBtn.innerHTML = `<span>▶</span> Start`;
        } else {
          this.startTimer();
          toggleBtn.innerHTML = `<span>⏸</span> Pause`;
        }
      });
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
        if (window.soundEffects) window.soundEffects.playSuccessChime();
        if (window.speechEngine) window.speechEngine.speak("Great tuition session! Time for a short 5-minute break.");
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isTimerRunning = false;
  }

  updateTimerDisplay() {
    const display = document.getElementById("sessionTimerDisplay");
    if (!display) return;
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.appState = new AppState();
});
