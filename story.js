/**
 * Intelligent Cloud Economics Control Plane — Main Product Story Logic
 * Handles spatial canvas, scroll transitions, signal convergence,
 * lifecycle stepper, agent explorer, rightsizing simulator, and accordion.
 */

(() => {
  const A = window.ARCH;
  if (!A) return;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Node lookup map
  const nodeMap = Object.fromEntries(A.nodes.map(n => [n.id, n]));

  /* ========================================================================
     1. Scroll Progress & Spatial Reveal Observer
     ======================================================================== */
  const progressBar = $("#scroll-progress");
  const onScroll = () => {
    const docElem = document.documentElement;
    const totalHeight = docElem.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Spatial Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  }, { threshold: 0.12 });

  $$(".spatial-reveal").forEach(el => revealObserver.observe(el));

  /* ========================================================================
     1b. Compact Dropdown Navbar Interactions
     ======================================================================== */
  const dropdownToggle = $("#nav-dropdown-toggle");
  const dropdownMenu = $("#nav-dropdown-menu");
  const dropdownClose = $("#nav-dropdown-close");

  const closeDropdown = () => {
    if (!dropdownMenu) return;
    dropdownMenu.classList.remove("open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  };

  const openDropdown = () => {
    if (!dropdownMenu) return;
    dropdownMenu.classList.add("open");
    dropdownToggle?.setAttribute("aria-expanded", "true");
  };

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains("open");
      if (isOpen) closeDropdown();
      else openDropdown();
    });

    dropdownClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDropdown();
    });

    // Close when clicking any link inside dropdown
    $$(".nav-dropdown-link").forEach(link => {
      link.addEventListener("click", () => closeDropdown());
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== dropdownToggle && !dropdownToggle.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdownMenu.classList.contains("open")) {
        closeDropdown();
        dropdownToggle.focus();
      }
    });
  }

  /* ========================================================================
     2. Hero Spatial Particle & Telemetry Canvas
     ======================================================================== */
  const canvas = $("#hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let pointer = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const resizeCanvas = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    if (!RM) {
      window.addEventListener("pointermove", (e) => {
        pointer.tx = e.clientX;
        pointer.ty = e.clientY;
      }, { passive: true });
    }

    // Generate mesh particles representing cloud resources
    const particles = [];
    const numParticles = Math.min(38, Math.floor(width / 35));
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() > 0.8 ? 4 : 2.5,
        color: Math.random() > 0.7 ? "#B86227" : "#1F4E38",
        pulse: Math.random() * Math.PI * 2
      });
    }

    const renderHeroCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer lerp
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(31, 78, 56, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        if (!RM) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.pulse += 0.03;
        }

        // Slight parallax shift away from pointer
        const pdx = p.x - pointer.x;
        const pdy = p.y - pointer.y;
        const pdist = Math.hypot(pdx, pdy);
        const shift = Math.max(0, (250 - pdist) / 250) * 12;

        const renderX = p.x + (pdist > 0 ? (pdx / pdist) * shift : 0);
        const renderY = p.y + (pdist > 0 ? (pdy / pdist) * shift : 0);

        ctx.beginPath();
        const r = p.radius + Math.sin(p.pulse) * 0.8;
        ctx.arc(renderX, renderY, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(renderHeroCanvas);
    };

    renderHeroCanvas();
  }

  /* ========================================================================
     3. Interactive Signal Convergence Scene
     ======================================================================== */
  const convPin = $("#convergence-pin");
  const convSlider = $("#conv-slider");
  const chips = [
    { el: $("#chip-cost"), x: -320, y: -160 },
    { el: $("#chip-inv"), x: 300, y: -150 },
    { el: $("#chip-met"), x: -350, y: 130 },
    { el: $("#chip-log"), x: 340, y: 120 },
    { el: $("#chip-pol"), x: 0, y: -200 },
    { el: $("#chip-dep"), x: -20, y: 190 }
  ];
  const convCore = $("#convergence-core");
  const convStatus = $("#convergence-status-text");
  const convProgress = $("#convergence-progress-text");

  let manualConvergence = false;

  const applyConvergence = (factor) => {
    chips.forEach(c => {
      if (c.el) {
        const curX = c.x * (1 - factor);
        const curY = c.y * (1 - factor);
        // Cleanly fade out chips as they approach the center box so they completely disappear before going behind it
        let chipOpacity = 1;
        if (factor > 0.22) {
          chipOpacity = Math.max(0, 1 - (factor - 0.22) / 0.35); // Reaches 0 by factor = 0.57
        }
        c.el.style.transform = `translate(${curX}px, ${curY}px) scale(${1 - factor * 0.3})`;
        c.el.style.opacity = chipOpacity;
        c.el.style.visibility = chipOpacity <= 0.001 ? "hidden" : "visible";
      }
    });

    if (convCore) {
      const coreScale = 0.7 + factor * 0.3;
      const coreOpacity = Math.max(0, (factor - 0.15) * 1.3);
      convCore.style.transform = `scale(${coreScale})`;
      convCore.style.opacity = coreOpacity;
    }

    if (convProgress) {
      convProgress.textContent = `${Math.round(factor * 100)}% Converged`;
    }
    if (convStatus) {
      if (factor < 0.25) {
        convStatus.textContent = "Disparate signals: Billing, metrics, and logs sit in separate silos.";
      } else if (factor < 0.75) {
        convStatus.textContent = "Nexus continuously collects and synthesizes telemetry into unified representations.";
      } else {
        convStatus.textContent = "Connected: One unified decision context with operational safety bounds.";
      }
    }
  };

  const updateConvergence = () => {
    if (!convPin || manualConvergence) return;
    const rect = convPin.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, scrollableDistance)));
    const factor = RM ? 1 : progress;
    applyConvergence(factor);
    if (convSlider) {
      convSlider.value = Math.round(factor * 100);
    }
  };

  if (convSlider) {
    convSlider.addEventListener("input", (e) => {
      manualConvergence = true;
      const factor = parseFloat(e.target.value) / 100;
      applyConvergence(factor);
    });
    // On window scroll, return to scroll-driven mode
    window.addEventListener("scroll", () => {
      if (manualConvergence) {
        manualConvergence = false;
        updateConvergence();
      }
    }, { passive: true });
  }

  window.addEventListener("scroll", updateConvergence, { passive: true });
  updateConvergence();

  /* ========================================================================
     4. Render The 4 Architectural Gaps
     ======================================================================== */
  const gapsContainer = $("#gaps-container");
  if (gapsContainer && A.gaps) {
    gapsContainer.innerHTML = A.gaps.map(g => `
      <div class="gap-card spatial-reveal">
        <div class="gap-num">Gap ${g.num}</div>
        <h3>${g.title}</h3>
        <p class="gap-problem"><strong>Friction:</strong> ${g.problem}</p>
        <div class="gap-solution">
          <strong>Control Plane Solution:</strong> ${g.solution}
        </div>
      </div>
    `).join("");
    // Re-observe newly created elements
    $$(".gap-card").forEach(el => revealObserver.observe(el));
  }

  /* ========================================================================
     5. 9-Stage Decision Lifecycle Stepper
     ======================================================================== */
  const lifecycleTrack = $("#lifecycle-track");
  const lifecyclePanel = $("#lifecycle-panel");
  let activeStageIdx = 0;

  const renderLifecycleStage = (idx) => {
    activeStageIdx = idx;
    const stage = A.lifecycleStages[idx];
    if (!stage) return;

    // Update buttons
    $$(".stage-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === idx);
      btn.setAttribute("aria-selected", String(i === idx));
    });

    const isProto = stage.status === "proto";
    const statusBadgeClass = isProto ? "badge-proto" : "badge-prop";
    const statusText = stage.statusLabel || (isProto ? "Demonstrated in Prototype" : "Designed Target State");

    lifecyclePanel.innerHTML = `
      <div>
        <div class="stage-meta">
          <span class="badge-tag ${statusBadgeClass}">${statusText}</span>
          <span class="badge-tag badge-mode">${stage.mode}</span>
          <span class="badge-tag" style="background: rgba(184,98,39,0.1); color: var(--copper);">Stage ${stage.num} of 9</span>
        </div>
        <div class="stage-question">"${stage.question}"</div>
        <h3 class="serif" style="font-size: 2.2rem; margin-bottom: 14px; color: var(--ink);">${stage.title}</h3>
        <p class="stage-desc">${stage.desc}</p>
        
        <div class="stage-io-grid">
          <div class="stage-io-box">
            <h4>Primary Inputs</h4>
            <p>${stage.in}</p>
          </div>
          <div class="stage-io-box">
            <h4>Primary Outputs</h4>
            <p>${stage.out}</p>
          </div>
        </div>
      </div>
      
      <div class="stage-note-box">
        <strong>Execution Rigor:</strong> ${stage.mode} — Guarantees deterministic safety boundaries and explicit human auditability at Stage ${stage.num}.
      </div>
    `;
  };

  if (lifecycleTrack && A.lifecycleStages) {
    lifecycleTrack.innerHTML = A.lifecycleStages.map((s, i) => `
      <button class="stage-btn ${i === 0 ? "active" : ""}" data-idx="${i}" role="tab" aria-selected="${i === 0}">
        <span class="stage-num">${String(s.num).padStart(2, "0")}</span>
        <span class="stage-name">${s.title}</span>
      </button>
    `).join("");

    $$(".stage-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        renderLifecycleStage(idx);
      });
    });

    renderLifecycleStage(0);
  }

  /* ========================================================================
     6. The 7 Domain Agents Explorer
     ======================================================================== */
  const agentsNav = $("#agents-nav");
  const agentDisplay = $("#agent-display");
  const coreAgentIds = ["scribe", "nexus", "watcher", "plumb", "augur", "apex", "charta"];

  const renderAgentDetail = (agentId) => {
    const node = nodeMap[agentId];
    if (!node) return;

    $$(".agent-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.id === agentId);
      btn.setAttribute("aria-selected", String(btn.dataset.id === agentId));
    });

    const statusBadge = node.status === "proto" 
      ? '<span class="badge-tag badge-proto">In Prototype</span>'
      : '<span class="badge-tag badge-prop">Designed State</span>';

    const modeLabels = {
      ai: "AI Reasoning",
      det: "Deterministic Engine",
      mix: "Hybrid AI + Deterministic",
      infra: "Core Infrastructure"
    };

    // Find upstream and downstream nodes
    const upstream = A.edges.filter(e => e.to === agentId).map(e => nodeMap[e.from]).filter(Boolean);
    const downstream = A.edges.filter(e => e.from === agentId).map(e => nodeMap[e.to]).filter(Boolean);

    agentDisplay.innerHTML = `
      <div class="agent-header">
        <div class="agent-title-group">
          <div class="agent-sec-tag">${modeLabels[node.mode] || "Control Plane Agent"}</div>
          <h3 class="serif">${node.name}</h3>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          ${statusBadge}
          <span class="badge-tag badge-mode">${modeLabels[node.mode] || node.mode}</span>
        </div>
      </div>

      <p class="agent-summary">${node.summary}</p>

      <div class="agent-actions-box">
        <h4>Core Operational Responsibilities</h4>
        <ul class="agent-actions-list">
          ${(node.actions || []).map(action => `<li>${action}</li>`).join("")}
        </ul>
      </div>

      <div class="stage-io-grid" style="margin-bottom: 24px;">
        <div class="stage-io-box">
          <h4>Expected Inputs</h4>
          <p>${node.in || "Platform context and trigger events."}</p>
        </div>
        <div class="stage-io-box">
          <h4>Produced Outputs</h4>
          <p>${node.out || "Domain recommendations or signal updates."}</p>
        </div>
      </div>

      <div class="agent-connections">
        <span class="agent-connections-label">Connected Components:</span>
        ${[...upstream, ...downstream].slice(0, 6).map(n => `
          <a href="architecture.html" class="agent-connection-pill" title="${n.summary}">
            ${n.name}
          </a>
        `).join("")}
        <a href="architecture.html" class="agent-connection-pill" style="background: var(--paper-border); font-weight: 600;">
          + Explore Full Graph →
        </a>
      </div>
    `;
  };

  if (agentsNav) {
    agentsNav.innerHTML = coreAgentIds.map((id, i) => {
      const n = nodeMap[id];
      if (!n) return "";
      return `
        <button class="agent-nav-btn ${i === 3 ? "active" : ""}" data-id="${id}" role="tab" aria-selected="${i === 3}">
          <span>${n.name}</span>
        </button>
      `;
    }).join("");

    $$(".agent-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => renderAgentDetail(btn.dataset.id));
    });

    renderAgentDetail("plumb"); // Default to Plumb (rightsizer)
  }

  /* ========================================================================
     7. Architectural Differentiators (8 Pillars)
     ======================================================================== */
  const diffContainer = $("#diff-container");
  if (diffContainer && A.differentiators) {
    diffContainer.innerHTML = A.differentiators.map((d, i) => `
      <div class="diff-card">
        <span class="diff-subtitle">Pillar 0${i + 1} — ${d.subtitle}</span>
        <h3>${d.title}</h3>
        <p>${d.detail}</p>
      </div>
    `).join("");
  }

  /* ========================================================================
     8. Interactive Rightsizing Walkthrough Simulator
     ======================================================================== */
  const simStepsNav = $("#sim-steps-nav");
  const simDisplay = $("#sim-display");
  const simPlayBtn = $("#sim-play-btn");
  const simPrevBtn = $("#sim-prev-btn");
  const simNextBtn = $("#sim-next-btn");
  const simResetBtn = $("#sim-reset-btn");

  let simStep = 0;
  let simPlaying = false;
  let simTimer = null;

  const renderSimStep = (stepIdx) => {
    simStep = stepIdx;
    const stepData = A.walkthroughSteps[stepIdx];
    if (!stepData) return;

    $$(".sim-step-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === stepIdx);
    });

    const badgeClass = stepData.proto ? "proto" : "concept";
    const badgeLabel = stepData.proto ? "Implemented in Prototype" : "Designed Target State";

    simDisplay.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="sim-step-badge ${badgeClass}">${badgeLabel}</span>
          <span class="mono" style="color: var(--copper); font-size: 0.8rem;">STEP ${stepData.step} OF 9</span>
        </div>
        <h3 class="sim-step-title">${stepData.title}</h3>
        <div class="sim-step-component">Responsible Component: ${stepData.component}</div>
        <p class="sim-step-desc">${stepData.desc}</p>
        
        <div class="sim-data-card">
          <pre>${JSON.stringify(stepData.data, null, 2)}</pre>
        </div>
      </div>

      <div class="sim-actions-footer">
        <span class="mono" style="color: var(--dark-text-muted); font-size: 0.8rem;">
          Resource: vm-checkout-worker-01 (Azure VM)
        </span>
        <div style="display: flex; gap: 8px;">
          <button class="btn-sim" id="sim-footer-prev" ${stepIdx === 0 ? "disabled" : ""}>Previous</button>
          <button class="btn-sim active" id="sim-footer-next" ${stepIdx === 8 ? "disabled" : ""}>Next Step →</button>
        </div>
      </div>
    `;

    $("#sim-footer-prev")?.addEventListener("click", () => renderSimStep(Math.max(0, simStep - 1)));
    $("#sim-footer-next")?.addEventListener("click", () => renderSimStep(Math.min(8, simStep + 1)));
  };

  const startSimAutoPlay = () => {
    simPlaying = true;
    if (simPlayBtn) {
      simPlayBtn.textContent = "Pause";
      simPlayBtn.classList.add("active");
    }
    simTimer = setInterval(() => {
      if (simStep < A.walkthroughSteps.length - 1) {
        renderSimStep(simStep + 1);
      } else {
        renderSimStep(0); // loop
      }
    }, 4200);
  };

  const stopSimAutoPlay = () => {
    simPlaying = false;
    if (simTimer) clearInterval(simTimer);
    simTimer = null;
    if (simPlayBtn) {
      simPlayBtn.textContent = "Auto-Play";
      simPlayBtn.classList.remove("active");
    }
  };

  if (simStepsNav && A.walkthroughSteps) {
    simStepsNav.innerHTML = A.walkthroughSteps.map((s, i) => `
      <button class="sim-step-btn ${i === 0 ? "active" : ""}" data-step="${i}">
        <span>${s.step}. ${s.title}</span>
        <span class="sim-step-badge ${s.proto ? "proto" : "concept"}">${s.proto ? "Proto" : "Target"}</span>
      </button>
    `).join("");

    $$(".sim-step-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        stopSimAutoPlay();
        renderSimStep(parseInt(btn.dataset.step, 10));
      });
    });

    simPlayBtn?.addEventListener("click", () => {
      if (simPlaying) stopSimAutoPlay();
      else startSimAutoPlay();
    });

    simPrevBtn?.addEventListener("click", () => {
      stopSimAutoPlay();
      renderSimStep(Math.max(0, simStep - 1));
    });

    simNextBtn?.addEventListener("click", () => {
      stopSimAutoPlay();
      renderSimStep(Math.min(A.walkthroughSteps.length - 1, simStep + 1));
    });

    simResetBtn?.addEventListener("click", () => {
      stopSimAutoPlay();
      renderSimStep(0);
    });

    renderSimStep(0);
  }

  /* ========================================================================
     9. 5-Phase Roadmap Timeline
     ======================================================================== */
  const roadmapContainer = $("#roadmap-timeline");
  if (roadmapContainer && A.roadmapPhases) {
    roadmapContainer.innerHTML = A.roadmapPhases.map(p => `
      <div class="roadmap-card ${p.phase === 1 ? "active-phase" : ""}">
        <div class="roadmap-card-lead">
          <div class="roadmap-phase-num">Phase 0${p.phase} — ${p.status}</div>
          <h3 class="serif">${p.title.split(": ")[1] || p.title}</h3>
        </div>
        <div class="roadmap-card-content">
          <p class="roadmap-desc">${p.desc}</p>
          <div class="roadmap-components-row">
            <span class="roadmap-components-label">Components:</span>
            <div class="roadmap-pills">
              ${p.components.map(c => `<span class="roadmap-pill">${c}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  /* ========================================================================
     10. The 8 Open Architectural Questions Accordion
     ======================================================================== */
  const questionsList = $("#questions-list");
  if (questionsList && A.questions) {
    questionsList.innerHTML = A.questions.map((q, i) => {
      const parts = q.split(": ");
      const title = parts[0];
      const desc = parts.slice(1).join(": ");
      return `
        <div class="question-item ${i === 0 ? "open" : ""}">
          <button class="question-trigger" aria-expanded="${i === 0}">
            <span>${i + 1}. ${title}</span>
            <span class="question-icon" aria-hidden="true">+</span>
          </button>
          <div class="question-content">
            <p>${desc}</p>
          </div>
        </div>
      `;
    }).join("");

    $$(".question-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains("open");
        $$(".question-item").forEach(other => {
          other.classList.remove("open");
          other.querySelector(".question-trigger").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

})();
