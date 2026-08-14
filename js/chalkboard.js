/**
 * TuitionBoard AI - Chalkboard & Drawing Engine
 * Manages the realistic classroom blackboard, interactive drawing canvas,
 * KaTeX formula rendering, text typing on the board, laser pointer, and diagrams.
 */

class ChalkboardEngine {
  constructor() {
    this.container = document.getElementById("chalkboardContainer");
    this.canvas = document.getElementById("drawingCanvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.contentLayer = document.getElementById("boardContentLayer");
    this.diagramLayer = document.getElementById("boardDiagramLayer");

    // Drawing state
    this.currentTool = "pen"; // 'pen', 'highlighter', 'laser', 'eraser', 'text'
    this.currentColor = "#f5f5f0"; // Default chalk white
    this.brushSize = 3;
    this.isDrawing = false;
    this.strokes = []; // Saved paths for undo/redraw
    this.currentStroke = [];
    this.typedNotes = []; // User-typed text cards on the board

    // Laser pointer state
    this.laserPos = null;
    this.laserTrail = [];
    this.laserAnimId = null;

    // Theme: 'classic-green', 'dark-slate', 'whiteboard', 'blueprint'
    this.currentTheme = "classic-green";

    this.initCanvas();
    this.initEvents();
    this.initLaserLoop();
    this.initTextTypingTool();
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    const board = document.getElementById("chalkboardContainer");
    if (board) {
      board.className = `chalkboard-container theme-${themeName}`;
    }
    // Update default chalk color for whiteboard vs blackboard
    if (themeName === "whiteboard") {
      if (this.currentColor === "#f5f5f0") this.currentColor = "#1e293b";
    } else {
      if (this.currentColor === "#1e293b") this.currentColor = "#f5f5f0";
    }
    this.redrawStrokes();
  }

  initCanvas() {
    if (!this.canvas) return;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(dpr, dpr);
    this.redrawStrokes();
  }

  initEvents() {
    if (!this.canvas) return;

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => {
      if (this.currentTool === "text") {
        const pos = getPos(e);
        this.openFloatingTextInput(pos.x, pos.y);
        return;
      }

      if (this.currentTool === "laser") {
        this.laserPos = getPos(e);
        return;
      }

      this.isDrawing = true;
      const pos = getPos(e);
      this.currentStroke = {
        tool: this.currentTool,
        color: this.currentColor,
        size: this.brushSize,
        points: [pos]
      };
      if (window.soundEffects) {
        window.soundEffects.playChalkStroke();
      }
    };

    const drawMove = (e) => {
      const pos = getPos(e);
      if (this.currentTool === "laser") {
        this.laserPos = pos;
        this.laserTrail.push({ x: pos.x, y: pos.y, age: 1.0 });
        return;
      }

      if (!this.isDrawing || this.currentTool === "text") return;
      this.currentStroke.points.push(pos);
      this.renderStrokeSegment(this.currentStroke);

      if (Math.random() < 0.15 && window.soundEffects && this.currentTool !== "laser") {
        window.soundEffects.playChalkStroke();
      }
    };

    const endDraw = () => {
      if (this.isDrawing && this.currentStroke.points.length > 0) {
        this.strokes.push(this.currentStroke);
        this.currentStroke = [];
      }
      this.isDrawing = false;
    };

    this.canvas.addEventListener("mousedown", startDraw);
    this.canvas.addEventListener("mousemove", drawMove);
    window.addEventListener("mouseup", endDraw);

    this.canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    this.canvas.addEventListener("touchmove", (e) => { e.preventDefault(); drawMove(e); }, { passive: false });
    this.canvas.addEventListener("touchend", endDraw);
  }

  /* ==========================================================================
     Chalk Text Typing Tool
     ========================================================================== */
  initTextTypingTool() {
    let inputEl = document.getElementById("chalkFloatingInput");
    if (!inputEl) {
      inputEl = document.createElement("div");
      inputEl.id = "chalkFloatingInput";
      inputEl.className = "chalk-floating-input-wrap";
      inputEl.style.display = "none";
      inputEl.innerHTML = `
        <input type="text" id="chalkTextInputField" placeholder="Type chalk note (Press Enter to stamp)..." class="chalk-text-field" />
        <button id="btnStampChalkText" class="btn-stamp-chalk">✓ Stamp</button>
        <button id="btnCancelChalkText" class="btn-cancel-chalk">✕</button>
      `;
      if (this.container) {
        this.container.appendChild(inputEl);
      }
    }

    const field = document.getElementById("chalkTextInputField");
    const stampBtn = document.getElementById("btnStampChalkText");
    const cancelBtn = document.getElementById("btnCancelChalkText");

    const stampText = () => {
      if (!field || !field.value.trim()) {
        this.closeFloatingTextInput();
        return;
      }
      const text = field.value.trim();
      const x = parseFloat(inputEl.getAttribute("data-x") || "50");
      const y = parseFloat(inputEl.getAttribute("data-y") || "50");

      this.addTypedChalkNote(text, x, y, this.currentColor);
      field.value = "";
      this.closeFloatingTextInput();
    };

    if (stampBtn) stampBtn.onclick = stampText;
    if (cancelBtn) cancelBtn.onclick = () => this.closeFloatingTextInput();
    if (field) {
      field.onkeydown = (e) => {
        if (e.key === "Enter") stampText();
        if (e.key === "Escape") this.closeFloatingTextInput();
      };
    }
  }

  openFloatingTextInput(x, y) {
    const inputEl = document.getElementById("chalkFloatingInput");
    const field = document.getElementById("chalkTextInputField");
    if (!inputEl || !field) return;

    inputEl.setAttribute("data-x", x);
    inputEl.setAttribute("data-y", y);
    inputEl.style.left = `${x}px`;
    inputEl.style.top = `${y}px`;
    inputEl.style.display = "flex";
    inputEl.style.borderColor = this.currentColor;

    field.style.color = this.currentColor;
    field.value = "";
    setTimeout(() => field.focus(), 50);

    if (window.soundEffects) window.soundEffects.playClick();
  }

  closeFloatingTextInput() {
    const inputEl = document.getElementById("chalkFloatingInput");
    if (inputEl) inputEl.style.display = "none";
  }

  addTypedChalkNote(text, x, y, color) {
    if (!this.contentLayer) return;

    const noteEl = document.createElement("div");
    noteEl.className = "chalk-typed-note-item animate-pop-in";
    noteEl.style.color = color || this.currentColor;
    noteEl.innerHTML = `
      <span class="typed-text-content">${this.escapeHTML(text)}</span>
      <button class="btn-delete-typed-note" title="Remove Note" onclick="this.parentElement.remove()">✕</button>
    `;

    this.contentLayer.appendChild(noteEl);
    if (window.soundEffects) window.soundEffects.playChalkStroke();
  }

  renderStrokeSegment(stroke) {
    if (!this.ctx || stroke.points.length < 2) return;
    const pts = stroke.points;
    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];

    this.ctx.save();
    if (stroke.tool === "eraser") {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.lineWidth = stroke.size * 8;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    } else if (stroke.tool === "highlighter") {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.globalAlpha = 0.35;
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = stroke.size * 6;
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    } else {
      // Chalk pencil with subtle texture
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = stroke.size;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.shadowColor = stroke.color;
      this.ctx.shadowBlur = 1;

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();

      // Subtle chalk speckles
      if (Math.random() < 0.4) {
        this.ctx.fillStyle = stroke.color;
        this.ctx.globalAlpha = 0.4;
        const offsetX = (Math.random() - 0.5) * (stroke.size * 2);
        const offsetY = (Math.random() - 0.5) * (stroke.size * 2);
        this.ctx.fillRect(p2.x + offsetX, p2.y + offsetY, 1.2, 1.2);
      }
    }
    this.ctx.restore();
  }

  redrawStrokes() {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    for (const stroke of this.strokes) {
      if (stroke.points.length < 2) continue;
      this.ctx.save();
      if (stroke.tool === "eraser") {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.lineWidth = stroke.size * 8;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
      } else if (stroke.tool === "highlighter") {
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.globalAlpha = 0.35;
        this.ctx.strokeStyle = stroke.color;
        this.ctx.lineWidth = stroke.size * 6;
        this.ctx.lineCap = "round";
      } else {
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = stroke.color;
        this.ctx.lineWidth = stroke.size;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
      }

      this.ctx.beginPath();
      this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  undoStroke() {
    if (this.strokes.length > 0) {
      this.strokes.pop();
      this.redrawStrokes();
      if (window.soundEffects) window.soundEffects.playEraserWipe();
    }
  }

  clearCanvas() {
    this.strokes = [];
    if (this.ctx && this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.clearRect(0, 0, rect.width, rect.height);
    }
    if (window.soundEffects) {
      window.soundEffects.playEraserWipe();
    }
  }

  initLaserLoop() {
    const loop = () => {
      if (this.currentTool === "laser" && this.ctx && this.canvas) {
        // Redraw base strokes
        this.redrawStrokes();

        // Draw laser trail
        for (let i = 0; i < this.laserTrail.length; i++) {
          const pt = this.laserTrail[i];
          pt.age -= 0.04;
          if (pt.age > 0) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, 4 * pt.age, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(239, 68, 68, ${pt.age * 0.7})`;
            this.ctx.shadowColor = "#ef4444";
            this.ctx.shadowBlur = 8 * pt.age;
            this.ctx.fill();
            this.ctx.restore();
          }
        }
        this.laserTrail = this.laserTrail.filter(pt => pt.age > 0);

        // Draw laser head
        if (this.laserPos) {
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(this.laserPos.x, this.laserPos.y, 6, 0, Math.PI * 2);
          this.ctx.fillStyle = "#ff4444";
          this.ctx.shadowColor = "#ff0000";
          this.ctx.shadowBlur = 12;
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.arc(this.laserPos.x, this.laserPos.y, 2.5, 0, Math.PI * 2);
          this.ctx.fillStyle = "#ffffff";
          this.ctx.fill();
          this.ctx.restore();
        }
      }
      this.laserAnimId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * Render structured lesson items on the chalkboard surface
   */
  renderStageContent(stage) {
    if (!this.contentLayer) return;

    this.contentLayer.innerHTML = "";

    // Animate blackboard card entrance
    const wrapper = document.createElement("div");
    wrapper.className = "chalkboard-stage-wrapper fade-in-chalk";

    // Stage Header Tag
    const stageBadge = document.createElement("div");
    stageBadge.className = "chalk-stage-badge";
    stageBadge.innerHTML = `<span class="chalk-icon">✏️</span> <strong>STAGE ${stage.stageNumber}:</strong> ${stage.title}`;
    wrapper.appendChild(stageBadge);

    // Render Board Items
    stage.boardItems.forEach((item, index) => {
      const itemEl = this.createBoardItemElement(item, index);
      if (itemEl) {
        wrapper.appendChild(itemEl);
      }
    });

    this.contentLayer.appendChild(wrapper);

    // Trigger KaTeX math formulas typesetting
    this.typesetMath();

    // Render interactive diagram if present
    this.renderDiagram(stage.diagram);
  }

  /**
   * Render an AI Problem Solution directly onto the chalkboard!
   */
  renderProblemSolution(sol) {
    if (!this.contentLayer) return;

    const solWrapper = document.createElement("div");
    solWrapper.className = "chalk-problem-solution-card animate-slide-up";

    let stepsHtml = `<div class="chalk-step-list">`;
    sol.steps.forEach(step => {
      stepsHtml += `
        <div class="chalk-step-row">
          <div class="step-badge">${step.stepNum}</div>
          <div class="step-content">
            <div class="step-desc">${this.escapeHTML(step.desc)}</div>
            ${step.latex ? `<div class="step-latex math-display" data-formula="${this.escapeAttribute(step.latex)}">\\[ ${step.latex} \\]</div>` : ''}
          </div>
        </div>
      `;
    });
    stepsHtml += `</div>`;

    solWrapper.innerHTML = `
      <div class="sol-header">
        <span class="sol-badge">🤖 AI Step-by-Step Problem Solution</span>
        <button class="sol-close-btn" onclick="this.closest('.chalk-problem-solution-card').remove()">✕</button>
      </div>
      <h3 class="chalk-title">${this.escapeHTML(sol.problemTitle)}</h3>
      
      ${sol.strategy ? `
        <div class="chalk-analogy-box" style="margin-bottom:1rem; border-color: rgba(103, 232, 249, 0.6);">
          <div class="analogy-header">
            <span class="analogy-icon">🎯</span>
            <span class="analogy-label" style="color: var(--chalk-cyan);">Strategy & Intuition</span>
          </div>
          <p class="analogy-body">${this.escapeHTML(sol.strategy)}</p>
        </div>
      ` : ''}

      ${stepsHtml}

      ${sol.finalAnswer ? `
        <div class="chalk-latex-card" style="margin-top:1rem; border-left-color: var(--chalk-green); background: rgba(34, 197, 94, 0.1);">
          <div class="latex-label" style="color: var(--chalk-green); font-weight: 700;">Final Boxed Answer:</div>
          <div class="latex-formula math-display" data-formula="${this.escapeAttribute(sol.finalAnswer)}">
            \\[ ${sol.finalAnswer} \\]
          </div>
        </div>
      ` : ''}

      ${sol.cautionTip ? `
        <div class="chalk-sticky-note note-coral" style="margin-top:1rem;">
          <div class="note-pin">📌</div>
          <div class="note-text"><strong>Teacher Caution:</strong> ${this.escapeHTML(sol.cautionTip)}</div>
        </div>
      ` : ''}
    `;

    this.contentLayer.prepend(solWrapper);
    this.typesetMath();
    if (window.soundEffects) window.soundEffects.playSuccessChime();
  }

  createBoardItemElement(item, index) {
    const el = document.createElement("div");
    el.className = `chalk-board-item chalk-item-${item.type} animate-slide-up`;
    el.style.animationDelay = `${index * 0.12}s`;

    switch (item.type) {
      case "title":
        el.innerHTML = `<h2 class="chalk-title">${this.escapeHTML(item.content)}</h2>`;
        break;

      case "analogy":
        el.innerHTML = `
          <div class="chalk-analogy-box">
            <div class="analogy-header">
              <span class="analogy-icon">💡</span>
              <span class="analogy-label">${this.escapeHTML(item.title || "Tuition Analogy")}</span>
            </div>
            <p class="analogy-body">${this.escapeHTML(item.content).replace(/\n/g, '<br>')}</p>
          </div>
        `;
        break;

      case "latex":
        el.innerHTML = `
          <div class="chalk-latex-card">
            ${item.label ? `<div class="latex-label">${this.escapeHTML(item.label)}</div>` : ''}
            <div class="latex-formula math-display" data-formula="${this.escapeAttribute(item.formula)}">
              \\[ ${item.formula} \\]
            </div>
          </div>
        `;
        break;

      case "stepList":
        let stepsHtml = `<div class="chalk-step-list">`;
        item.steps.forEach(step => {
          stepsHtml += `
            <div class="chalk-step-row">
              <div class="step-badge">${step.stepNum}</div>
              <div class="step-content">
                <div class="step-desc">${this.escapeHTML(step.desc)}</div>
                ${step.latex ? `<div class="step-latex math-display" data-formula="${this.escapeAttribute(step.latex)}">\\[ ${step.latex} \\]</div>` : ''}
              </div>
            </div>
          `;
        });
        stepsHtml += `</div>`;
        el.innerHTML = stepsHtml;
        break;

      case "chalkNote":
        const colorClass = `note-${item.color || 'yellow'}`;
        el.innerHTML = `
          <div class="chalk-sticky-note ${colorClass}">
            <div class="note-pin">📌</div>
            <div class="note-text">${this.escapeHTML(item.text)}</div>
          </div>
        `;
        break;

      case "quiz":
        el.innerHTML = `
          <div class="chalk-quiz-prompt-card">
            <div class="quiz-prompt-header">🎯 Checkpoint Challenge</div>
            <div class="quiz-prompt-question">${this.escapeHTML(item.question)}</div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="chalk-btn-interactive" onclick="window.quizEngine.openStageQuiz()">
                Solve on Chalkboard ➔
              </button>
              <button class="chalk-btn-interactive" style="background: var(--accent-cyan);" onclick="window.appState.solveCurrentCheckpointWithAI()">
                🤖 Ask AI to Solve Step-by-Step
              </button>
            </div>
          </div>
        `;
        break;

      default:
        el.innerHTML = `<div>${this.escapeHTML(item.content || '')}</div>`;
    }

    return el;
  }

  appendLiveNote(chalkNote) {
    if (!this.contentLayer) return;
    const noteEl = document.createElement("div");
    noteEl.className = `chalk-board-item chalk-live-annotation animate-pop-in note-${chalkNote.color || 'yellow'}`;
    noteEl.innerHTML = `
      <div class="live-teacher-badge">👨‍🏫 Teacher Chalk Note</div>
      <div class="note-text">${this.escapeHTML(chalkNote.text)}</div>
    `;
    this.contentLayer.appendChild(noteEl);
    if (window.soundEffects) window.soundEffects.playChalkStroke();
  }

  typesetMath() {
    if (window.katex) {
      document.querySelectorAll(".math-display").forEach(el => {
        const formula = el.getAttribute("data-formula");
        if (formula) {
          try {
            window.katex.render(formula, el, {
              displayMode: true,
              throwOnError: false
            });
          } catch (err) {
            console.warn("KaTeX render error:", err);
          }
        }
      });
    }
  }

  /**
   * Render dynamic interactive SVG / Canvas diagrams on the chalkboard
   */
  renderDiagram(diagramType) {
    if (!this.diagramLayer) return;
    this.diagramLayer.innerHTML = "";
    if (!diagramType) {
      this.diagramLayer.style.display = "none";
      return;
    }
    this.diagramLayer.style.display = "block";

    switch (diagramType) {
      case "derivativeSlope":
        this.renderDerivativeDiagram();
        break;
      case "gearRatio":
        this.renderGearRatioDiagram();
        break;
      case "waveInterference":
        this.renderWaveInterferenceDiagram();
        break;
      case "matterWaves":
        this.renderMatterWavesDiagram();
        break;
      case "neuralNet":
        this.renderNeuralNetDiagram();
        break;
      case "supplyDemand":
        this.renderSupplyDemandDiagram();
        break;
      case "dnaFork":
        this.renderDnaForkDiagram();
        break;
      default:
        this.diagramLayer.style.display = "none";
    }
  }

  renderDerivativeDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">📈 Visualizing Tangent Slope: \\( \\frac{\\Delta y}{\\Delta x} \\to \\frac{dy}{dx} \\)</div>
        <svg viewBox="0 0 400 180" class="chalk-svg">
          <!-- Axes -->
          <line x1="40" y1="150" x2="360" y2="150" stroke="#a3e635" stroke-width="2" stroke-dasharray="3,3" />
          <line x1="50" y1="20" x2="50" y2="160" stroke="#a3e635" stroke-width="2" stroke-dasharray="3,3" />
          <text x="350" y="168" fill="#a3e635" font-family="Caveat, cursive" font-size="16">x</text>
          <text x="30" y="30" fill="#a3e635" font-family="Caveat, cursive" font-size="16">y</text>
          
          <!-- Curve f(x) = x^2 -->
          <path d="M 60 140 Q 180 135 340 30" fill="none" stroke="#67e8f9" stroke-width="3" />
          <text x="310" y="25" fill="#67e8f9" font-family="Caveat, cursive" font-size="15">f(x)</text>

          <!-- Tangent Line at x=200 -->
          <line x1="120" y1="155" x2="280" y2="45" stroke="#facc15" stroke-width="2" stroke-dasharray="5,3" />
          
          <!-- Tangent Point -->
          <circle cx="200" cy="100" r="5" fill="#f87171" />
          <text x="210" y="95" fill="#f87171" font-family="Caveat, cursive" font-size="14">Point (x, f(x))</text>
          
          <!-- Slope Triangle -->
          <line x1="200" y1="100" x2="250" y2="100" stroke="#f43f5e" stroke-width="1.5" />
          <line x1="250" y1="100" x2="250" y2="65" stroke="#f43f5e" stroke-width="1.5" />
          <text x="215" y="115" fill="#f43f5e" font-family="Caveat, cursive" font-size="13">dx</text>
          <text x="255" y="85" fill="#f43f5e" font-family="Caveat, cursive" font-size="13">dy</text>
        </svg>
      </div>
    `;
  }

  renderGearRatioDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">⚙️ Chain Rule: Gear Multiplier Principle</div>
        <svg viewBox="0 0 400 160" class="chalk-svg">
          <!-- Gear A -->
          <g transform="translate(100, 80)" class="spin-clockwise">
            <circle cx="0" cy="0" r="40" fill="none" stroke="#67e8f9" stroke-width="2.5" stroke-dasharray="8,4" />
            <circle cx="0" cy="0" r="10" fill="#67e8f9" opacity="0.3" />
            <text x="-25" y="5" fill="#67e8f9" font-family="Caveat, cursive" font-size="14">Gear A (3x)</text>
          </g>
          <!-- Gear B -->
          <g transform="translate(190, 80)" class="spin-counter">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="6,4" />
            <circle cx="0" cy="0" r="8" fill="#facc15" opacity="0.3" />
            <text x="-22" y="5" fill="#facc15" font-family="Caveat, cursive" font-size="13">Gear B (2x)</text>
          </g>
          <!-- Final Wheel -->
          <g transform="translate(290, 80)" class="spin-clockwise">
            <circle cx="0" cy="0" r="45" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-dasharray="10,5" />
            <circle cx="0" cy="0" r="12" fill="#4ade80" opacity="0.3" />
            <text x="-20" y="5" fill="#4ade80" font-family="Caveat, cursive" font-size="13">Wheel</text>
          </g>
          
          <!-- Arrows -->
          <text x="145" y="40" fill="#f87171" font-family="Caveat, cursive" font-size="14">x 3</text>
          <text x="235" y="40" fill="#f87171" font-family="Caveat, cursive" font-size="14">x 2</text>
          <text x="110" y="145" fill="#ffffff" font-family="Caveat, cursive" font-size="16">Total Multiplier = 3 * 2 = 6x!</text>
        </svg>
      </div>
    `;
  }

  renderWaveInterferenceDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">🌊 Quantum Double Slit Interference</div>
        <svg viewBox="0 0 400 160" class="chalk-svg">
          <!-- Electron Gun -->
          <rect x="20" y="70" width="30" height="20" fill="#38bdf8" rx="3" />
          <text x="15" y="105" fill="#38bdf8" font-family="Caveat, cursive" font-size="12">e- Gun</text>
          
          <!-- Slit Barrier -->
          <line x1="130" y1="10" x2="130" y2="55" stroke="#f5f5f0" stroke-width="4" />
          <line x1="130" y1="75" x2="130" y2="85" stroke="#f5f5f0" stroke-width="4" />
          <line x1="130" y1="105" x2="130" y2="150" stroke="#f5f5f0" stroke-width="4" />
          
          <!-- Waves passing through -->
          <path d="M 60 80 Q 90 70 120 80" stroke="#67e8f9" fill="none" stroke-width="2" />
          <path d="M 140 65 Q 220 30 310 30" stroke="#facc15" stroke-dasharray="3,3" fill="none" opacity="0.7" />
          <path d="M 140 95 Q 220 130 310 130" stroke="#facc15" stroke-dasharray="3,3" fill="none" opacity="0.7" />
          
          <!-- Screen with Bright/Dark bands -->
          <line x1="340" y1="15" x2="340" y2="145" stroke="#94a3b8" stroke-width="3" />
          <rect x="345" y="25" width="25" height="15" fill="#4ade80" opacity="0.8" />
          <rect x="345" y="55" width="35" height="18" fill="#4ade80" />
          <rect x="345" y="85" width="35" height="18" fill="#4ade80" />
          <rect x="345" y="115" width="25" height="15" fill="#4ade80" opacity="0.8" />
          <text x="315" y="155" fill="#4ade80" font-family="Caveat, cursive" font-size="12">Interference Screen</text>
        </svg>
      </div>
    `;
  }

  renderNeuralNetDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">🧠 3-Layer Neural Network Forward & Backprop</div>
        <svg viewBox="0 0 400 160" class="chalk-svg">
          <!-- Input Nodes -->
          <circle cx="60" cy="40" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
          <text x="54" y="45" fill="#fff" font-size="12">x₁</text>
          <circle cx="60" cy="110" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
          <text x="54" y="115" fill="#fff" font-size="12">x₂</text>
          
          <!-- Hidden Nodes -->
          <circle cx="190" cy="30" r="14" fill="#7c3aed" stroke="#a78bfa" stroke-width="2" />
          <text x="184" y="35" fill="#fff" font-size="12">h₁</text>
          <circle cx="190" cy="80" r="14" fill="#7c3aed" stroke="#a78bfa" stroke-width="2" />
          <text x="184" y="85" fill="#fff" font-size="12">h₂</text>
          <circle cx="190" cy="130" r="14" fill="#7c3aed" stroke="#a78bfa" stroke-width="2" />
          <text x="184" y="135" fill="#fff" font-size="12">h₃</text>
          
          <!-- Output Node -->
          <circle cx="320" cy="80" r="16" fill="#059669" stroke="#34d399" stroke-width="2" />
          <text x="312" y="85" fill="#fff" font-size="13">ŷ</text>

          <!-- Synaptic Connections -->
          <line x1="74" y1="40" x2="176" y2="30" stroke="#facc15" stroke-width="1.5" opacity="0.6" />
          <line x1="74" y1="40" x2="176" y2="80" stroke="#facc15" stroke-width="1.5" opacity="0.6" />
          <line x1="74" y1="110" x2="176" y2="80" stroke="#facc15" stroke-width="1.5" opacity="0.6" />
          <line x1="74" y1="110" x2="176" y2="130" stroke="#facc15" stroke-width="1.5" opacity="0.6" />
          <line x1="204" y1="30" x2="304" y2="80" stroke="#38bdf8" stroke-width="2" opacity="0.7" />
          <line x1="204" y1="80" x2="304" y2="80" stroke="#38bdf8" stroke-width="2" opacity="0.7" />
          <line x1="204" y1="130" x2="304" y2="80" stroke="#38bdf8" stroke-width="2" opacity="0.7" />

          <!-- Backprop Gradient Arrow -->
          <path d="M 300 115 L 200 150 L 80 145" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,2" />
          <text x="180" y="155" fill="#ef4444" font-family="Caveat, cursive" font-size="14">← Red Gradient Flow (∂L/∂w)</text>
        </svg>
      </div>
    `;
  }

  renderSupplyDemandDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">📊 Supply & Demand Market Equilibrium</div>
        <svg viewBox="0 0 400 160" class="chalk-svg">
          <!-- Axes -->
          <line x1="50" y1="130" x2="350" y2="130" stroke="#94a3b8" stroke-width="2" />
          <line x1="60" y1="20" x2="60" y2="140" stroke="#94a3b8" stroke-width="2" />
          <text x="340" y="145" fill="#94a3b8" font-family="Caveat, cursive" font-size="15">Quantity (Q)</text>
          <text x="15" y="30" fill="#94a3b8" font-family="Caveat, cursive" font-size="15">Price (P)</text>

          <!-- Demand Curve (Downward) -->
          <line x1="80" y1="30" x2="320" y2="120" stroke="#f43f5e" stroke-width="3" />
          <text x="325" y="125" fill="#f43f5e" font-family="Caveat, cursive" font-size="16">Demand (D)</text>

          <!-- Supply Curve (Upward) -->
          <line x1="80" y1="120" x2="320" y2="30" stroke="#38bdf8" stroke-width="3" />
          <text x="325" y="35" fill="#38bdf8" font-family="Caveat, cursive" font-size="16">Supply (S)</text>

          <!-- Equilibrium Point -->
          <circle cx="200" cy="75" r="6" fill="#facc15" />
          <text x="210" y="70" fill="#facc15" font-family="Caveat, cursive" font-size="16">Equilibrium (P*, Q*)</text>
          
          <!-- Dashed lines to axes -->
          <line x1="60" y1="75" x2="200" y2="75" stroke="#facc15" stroke-dasharray="3,3" />
          <line x1="200" y1="75" x2="200" y2="130" stroke="#facc15" stroke-dasharray="3,3" />
        </svg>
      </div>
    `;
  }

  renderDnaForkDiagram() {
    this.diagramLayer.innerHTML = `
      <div class="chalk-diagram-card">
        <div class="diagram-title">🧬 DNA Replication Fork (5' ➔ 3' Synthesis)</div>
        <svg viewBox="0 0 400 160" class="chalk-svg">
          <!-- Parental Fork Strands -->
          <path d="M 40 40 L 180 75 L 350 30" fill="none" stroke="#94a3b8" stroke-width="3" />
          <path d="M 40 120 L 180 85 L 350 130" fill="none" stroke="#94a3b8" stroke-width="3" />
          
          <!-- Helicase Enzyme at Fork -->
          <polygon points="175,65 195,80 175,95" fill="#f59e0b" />
          <text x="150" y="60" fill="#f59e0b" font-family="Caveat, cursive" font-size="13">Helicase</text>

          <!-- Leading Strand (Continuous) -->
          <path d="M 200 45 L 340 38" fill="none" stroke="#4ade80" stroke-width="3" />
          <polygon points="340,35 348,38 340,41" fill="#4ade80" />
          <text x="220" y="30" fill="#4ade80" font-family="Caveat, cursive" font-size="13">Leading Strand (Continuous 5'->3')</text>

          <!-- Lagging Strand (Okazaki Fragments) -->
          <path d="M 220 115 L 260 122" fill="none" stroke="#f43f5e" stroke-width="3" />
          <path d="M 280 125 L 320 128" fill="none" stroke="#f43f5e" stroke-width="3" />
          <text x="210" y="150" fill="#f43f5e" font-family="Caveat, cursive" font-size="13">Okazaki Fragments (Lagging)</text>
        </svg>
      </div>
    `;
  }

  escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  escapeAttribute(str) {
    if (!str) return "";
    return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}

window.ChalkboardEngine = ChalkboardEngine;
