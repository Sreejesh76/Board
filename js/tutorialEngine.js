/**
 * TuitionBoard AI - Interactive Guided Onboarding Tour
 * Gives new users an interactive, step-by-step spotlight walk-through of every function in the app
 * with voice narration, highlighted visual elements, and controls.
 */

class TutorialEngine {
  constructor() {
    this.currentStepIndex = 0;
    this.isActive = false;
    this.overlay = null;
    this.spotlight = null;
    this.tooltip = null;

    this.tourSteps = [
      {
        targetId: "tutorAvatarContainer",
        title: "👋 Meet Professor Antigravity (AI Tutor)",
        content: "Your private AI tuition teacher! As you learn, the tutor explains concepts verbally using natural speech narration, synchronized with board animations and soundwave pulses.",
        speech: "Welcome to TuitionBoard AI! I am Professor Antigravity, your private tuition tutor. I will explain concepts step-by-step just like a real classroom tuition session.",
        position: "right"
      },
      {
        targetId: "stageTimeline",
        title: "📈 5-Stage Tuition Progression",
        content: "Every lesson is structured for deep understanding: 1) Intuitive Analogy, 2) Core Formula, 3) Worked Problem, 4) Checkpoint Challenge, and 5) Exam Revision Sheet.",
        speech: "We structure every topic into 5 progressive stages so you never feel lost: from real-life analogies to worked exam problems.",
        position: "right"
      },
      {
        targetId: "chalkboardContainer",
        title: "🖍️ The Smart Classroom Blackboard",
        content: "Your active canvas! Real-time mathematical formulas rendered via KaTeX, dynamic interactive diagrams (gears, neural nets, waves), analogies, and chalk notes appear here.",
        speech: "Here is your smart classroom chalkboard! It renders beautiful mathematical equations, diagrams, and step-by-step handwriting.",
        position: "center"
      },
      {
        targetId: "chalkboardFloatingToolbar",
        title: "✏️ Drawing & Chalk Text Typing Toolbar",
        content: "Use the Chalk Pen, Highlighter, Laser Pointer, or the new Chalk Text Typer (⌨️) to write anywhere! Pick from 5 chalk colors, undo mistakes, or snapshot the board as an image.",
        speech: "Use this floating toolbar to draw, highlight, point with a laser, or type custom chalk notes directly onto the blackboard.",
        position: "top"
      },
      {
        targetId: "askTutorSection",
        title: "✋ Raise Hand & AI Problem Solver",
        content: "Got a doubt or a homework question? Type or speak with your microphone! The AI will answer out loud and write instant chalk notes and derivations on the board.",
        speech: "Whenever you have a question or need a problem solved step-by-step, raise your hand or click AI Solve to let me work through it on the board.",
        position: "right"
      },
      {
        targetId: "headerCenterTopicBtn",
        title: "📚 Topic Library & Custom Topic AI",
        content: "Explore pre-built masterclasses in Calculus, Quantum Physics, Neural Networks, and Economics—or type ANY custom topic to build a fresh 5-stage tuition lesson instantly!",
        speech: "You can switch between subjects or type any custom topic you want to learn. Our AI will construct a complete tuition lesson for you.",
        position: "bottom"
      },
      {
        targetId: "sessionTimerSection",
        title: "⏳ Pomodoro Study Timer & Notes Export",
        content: "Stay focused with the 25-minute tuition session timer, and click 'Notes' in the header anytime to export your chalkboard as a Markdown revision sheet.",
        speech: "Keep your focus sharp with our tuition timer and download your study notes anytime. Let's begin learning!",
        position: "right"
      }
    ];

    this.init();
  }

  init() {
    this.createDomElements();

    // Check if new user
    const tourDone = localStorage.getItem("TUITION_TOUR_COMPLETED");
    if (!tourDone) {
      setTimeout(() => {
        this.startTour();
      }, 1200);
    }
  }

  createDomElements() {
    // Overlay backdrop
    let overlay = document.getElementById("tourOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "tourOverlay";
      overlay.className = "tour-overlay";
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;

    // Tooltip card
    let tooltip = document.getElementById("tourTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tourTooltip";
      tooltip.className = "tour-tooltip-card animate-pop-in";
      document.body.appendChild(tooltip);
    }
    this.tooltip = tooltip;
  }

  startTour() {
    this.currentStepIndex = 0;
    this.isActive = true;
    if (this.overlay) this.overlay.style.display = "block";
    this.showStep(0);
    if (window.soundEffects) window.soundEffects.playClick();
  }

  endTour() {
    this.isActive = false;
    localStorage.setItem("TUITION_TOUR_COMPLETED", "true");
    if (this.overlay) this.overlay.style.display = "none";
    if (this.tooltip) this.tooltip.style.display = "none";

    // Remove any active spotlight highlights
    document.querySelectorAll(".tour-highlighted-element").forEach(el => {
      el.classList.remove("tour-highlighted-element");
    });

    if (window.soundEffects) window.soundEffects.playSuccessChime();
    if (window.confetti) {
      window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    if (window.speechEngine) {
      window.speechEngine.speak("You are all set! Feel free to pick a topic or start writing on the board.");
    }
  }

  showStep(index) {
    if (index < 0 || index >= this.tourSteps.length) {
      this.endTour();
      return;
    }

    this.currentStepIndex = index;
    const step = this.tourSteps[index];

    // Remove previous highlights
    document.querySelectorAll(".tour-highlighted-element").forEach(el => {
      el.classList.remove("tour-highlighted-element");
    });

    const target = document.getElementById(step.targetId);
    if (target) {
      target.classList.add("tour-highlighted-element");
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Render tooltip content
    this.tooltip.innerHTML = `
      <div class="tour-tooltip-header">
        <span class="tour-step-badge">Step ${index + 1} of ${this.tourSteps.length}</span>
        <button class="tour-skip-btn" onclick="window.tutorialEngine.endTour()">Skip Tour ✕</button>
      </div>
      <h4 class="tour-tooltip-title">${step.title}</h4>
      <p class="tour-tooltip-text">${step.content}</p>
      <div class="tour-tooltip-actions">
        <button class="btn-secondary btn-mini" onclick="window.tutorialEngine.prevStep()" ${index === 0 ? 'disabled' : ''}>
          ◀ Back
        </button>
        <div class="tour-dots">
          ${this.tourSteps.map((_, i) => `<span class="tour-dot ${i === index ? 'active' : ''}"></span>`).join('')}
        </div>
        <button class="btn-primary btn-mini" onclick="window.tutorialEngine.nextStep()">
          ${index === this.tourSteps.length - 1 ? 'Finish 🎓' : 'Next ➔'}
        </button>
      </div>
    `;

    this.positionTooltip(target, step.position);
    this.tooltip.style.display = "block";

    // Spoken explanation
    if (window.speechEngine && !window.speechEngine.isMuted) {
      window.speechEngine.speak(step.speech);
    }
  }

  positionTooltip(targetEl, position) {
    if (!targetEl || !this.tooltip) return;
    const rect = targetEl.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const margin = 14;

    let top = 0;
    let left = 0;

    if (position === "right") {
      top = rect.top + rect.height / 2 - 80;
      left = rect.right + margin;
    } else if (position === "left") {
      top = rect.top + rect.height / 2 - 80;
      left = rect.left - tooltipRect.width - margin;
    } else if (position === "bottom") {
      top = rect.bottom + margin;
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    } else if (position === "top") {
      top = rect.top - tooltipRect.height - margin;
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    } else {
      // Center
      top = window.innerHeight / 2 - 120;
      left = window.innerWidth / 2 - 160;
    }

    // Viewport bounding clamp
    top = Math.max(20, Math.min(window.innerHeight - 240, top));
    left = Math.max(20, Math.min(window.innerWidth - 340, left));

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  nextStep() {
    this.showStep(this.currentStepIndex + 1);
    if (window.soundEffects) window.soundEffects.playClick();
  }

  prevStep() {
    this.showStep(this.currentStepIndex - 1);
    if (window.soundEffects) window.soundEffects.playClick();
  }
}

window.tutorialEngine = new TutorialEngine();
