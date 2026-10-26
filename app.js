/**
 * Intelligent Cloud Economics Control Plane — Enterprise Architecture Map Explorer
 * 
 * Relationship-driven Enterprise Target Architecture visualization matching the
 * Master Architecture Document, Component Catalogue, and Reference Specifications.
 * 
 * Key Architectural Principles:
 * - Connected, multi-layered enterprise map with parallel responsibilities and explicit cross-layer relationships.
 * - Spatially organized into 8 documented architectural areas (Area A through Area H).
 * - Dynamic SVG vector connectors drawn directly from ARCH.edges data, with dynamic anchor points,
 *   cubic Bezier curves, interactive highlights (upstream Forest Green, downstream Copper),
 *   and contextual relationship labels.
 * - Interactive 2D canvas with pan, zoom, fit-to-view, reset, and edge toggling.
 * - Deep collapsible Technical Inspector drawer with rich input/output contracts and upstream/downstream navigation.
 * - Interactive workflow trace playback (Traces A, B, C) that steps through execution paths,
 *   pulsing active nodes and animating path connectors.
 * - Search autocomplete with auto-scroll & deep inspection across all 54 components.
 * - Multi-view, status, and execution mode filters.
 * - Static hosting compatibility (zero backend, works on GitHub Pages).
 */

(() => {
  const A = window.ARCH;
  if (!A) return;

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Dictionaries & Labels
  const MODE_LABEL = {
    ai: "AI REASONING",
    det: "DETERMINISTIC",
    mix: "HYBRID",
    infra: "INFRASTRUCTURE"
  };

  const ST_LABEL = {
    proto: "In Prototype (partly)",
    prop: "Designed Target State",
    future: "Future Extension"
  };

  const ST_SHORT = {
    proto: "Prototype",
    prop: "Target",
    future: "Future"
  };

  // State
  let activeView = "overview";
  let activeStatus = "all";
  let activeMode = "all";
  let selectedNodeId = null;
  let activeWorkflow = null;
  let workflowStep = 0;
  let workflowPlaying = false;
  let workflowTimer = null;
  let edgesVisible = true;

  // Pan & Zoom Navigation State
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let hasDragged = false;

  // Node & Layer Maps for O(1) lookups
  const nodeMap = Object.fromEntries(A.nodes.map(n => [n.id, n]));
  const layerMap = Object.fromEntries(A.layers.map(l => [l.id, l]));

  /* ========================================================================
     Helper: Render a Single Component Card
     ======================================================================== */
  function renderCard(node) {
    if (!node) return "";
    return `
      <article class="arch-card" id="card-${node.id}" data-id="${node.id}" data-layer="${node.layer}" data-status="${node.status}" data-mode="${node.mode}" role="button" tabindex="0" aria-label="Component: ${node.name}">
        <div class="arch-card-top">
          <span class="arch-mode-tag mode-${node.mode}">${MODE_LABEL[node.mode] || node.mode}</span>
          <span class="arch-status-indicator">
            <span class="arch-status-pip ${node.status}"></span>
            ${ST_SHORT[node.status] || node.status}
          </span>
        </div>
        <h3 class="arch-card-title">${node.name}</h3>
        <p class="arch-card-summary">${node.summary}</p>
        <ul class="arch-card-actions">
          ${(node.actions || []).slice(0, 3).map(a => `<li>${a}</li>`).join("")}
        </ul>
      </article>
    `;
  }

  /* ========================================================================
     1. Build 2D Enterprise Architecture Map DOM (Areas A through H)
     ======================================================================== */
  function renderFlowStage() {
    const stage = $("#arch-flow-stage");
    if (!stage) return;

    let html = `
      <!-- Title Block -->
      <div class="arch-title-block">
        <div class="arch-eyebrow">INTELLIGENT CLOUD ECONOMICS CONTROL PLANE · ENTERPRISE TARGET ARCHITECTURE</div>
        <h1 class="arch-heading">Cloud Economics Platform Topology Map</h1>
        <div class="arch-tagline">
          <span><b>8</b> Governed Areas</span>
          <span><b>54</b> Canonical Components</span>
          <span><b>84</b> Active Relationships</span>
          <span>Planner–Executor Control Plane</span>
          <span>Decoupled Agent Mesh</span>
          <span>Deterministic Safety Bounds</span>
          <span>Multi-Cloud Integrations</span>
        </div>
      </div>

      <!-- Spatial Enterprise Architecture Grid Layout -->
      <div class="arch-map-layout">

        <!-- ================= ROW 1: INGRESS, CONTROL PLANE & OUTCOMES ================= -->
        <div class="arch-map-row row-top">
          
          <!-- AREA A: User Experience & Ingress Entry Points -->
          <section class="arch-area area-ui" id="area-ui" data-layer="ui">
            <span class="arch-area-badge">AREA A · INGRESS &amp; INTERFACES</span>
            <div class="arch-area-head">
              <span class="ico">🖥️</span>
              <h2>Area A · Experience &amp; Ingress Points</h2>
              <span class="cnt">5 Ingress Nodes</span>
            </div>
            <p class="arch-area-desc">
              Unified entry points for conversational natural language queries, ClearView visual dashboards, scheduled optimization sweeps, native cloud alert webhooks, and IDE extension plugins.
            </p>
            <div class="arch-grid g2">
              ${renderCard(nodeMap['cmd'])}
              ${renderCard(nodeMap['plan'])}
              ${renderCard(nodeMap['trig'])}
              ${renderCard(nodeMap['dash'])}
            </div>
            <div style="margin-top: 10px;">
              ${renderCard(nodeMap['mcp'])}
            </div>
          </section>

          <!-- AREA B: Control Plane & Orchestration Backbone -->
          <section class="arch-area area-ctl" id="area-ctl" data-layer="ctl">
            <span class="arch-area-badge">AREA B · CONTROL PLANE &amp; ORCHESTRATION</span>
            <div class="arch-area-head">
              <span class="ico">🧠</span>
              <h2>Area B · Control Plane Backbone</h2>
              <span class="cnt">6 Core Components</span>
            </div>
            <p class="arch-area-desc">
              Central runtime coordinator implementing a LangGraph-style stateful Planner–Executor pattern, decoupled event bus, isolated execution state, strict customer tenant boundaries, and configuration.
            </p>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">⚡</span> Core Coordination &amp; Event Backbone
              </div>
              <div class="arch-grid g2">
                ${renderCard(nodeMap['orch'])}
                ${renderCard(nodeMap['bus'])}
              </div>
            </div>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">🛡️</span> State, Tenant Isolation &amp; Configuration
              </div>
              <div class="arch-grid g4">
                ${renderCard(nodeMap['state'])}
                ${renderCard(nodeMap['tenant'])}
                ${renderCard(nodeMap['auth'])}
                ${renderCard(nodeMap['cfg'])}
              </div>
            </div>
          </section>

          <!-- AREA G: Results, Governance & Outcomes -->
          <section class="arch-area area-res" id="area-res" data-layer="res">
            <span class="arch-area-badge">AREA G · GOVERNANCE &amp; OUTCOMES</span>
            <div class="arch-area-head">
              <span class="ico">🧑‍⚖️</span>
              <h2>Area G · Results &amp; Governance</h2>
              <span class="cnt">5 Governance Nodes</span>
            </div>
            <p class="arch-area-desc">
              Standardized recommendation contracts with full evidence dossiers, mandatory Human-in-the-Loop review gates, GitOps pull-request remediation, outcome audit tracking, and multi-channel notifications.
            </p>
            <div class="arch-grid g2">
              ${renderCard(nodeMap['rec'])}
              ${renderCard(nodeMap['appr'])}
              ${renderCard(nodeMap['iac'])}
              ${renderCard(nodeMap['audit'])}
            </div>
            <div style="margin-top: 10px;">
              ${renderCard(nodeMap['notify'])}
            </div>
          </section>

        </div>

        <!-- ================= ROW 2: SPECIALIZED DOMAIN AGENT MESH ================= -->
        <div class="arch-map-row row-agents">
          <section class="arch-area area-agt" id="area-agt" data-layer="agt">
            <span class="arch-area-badge">AREA C · DOMAIN INTELLIGENCE MESH</span>
            <div class="arch-area-head">
              <span class="ico">🕸️</span>
              <h2>Area C · Specialized Domain Intelligence Agent Mesh</h2>
              <span class="cnt">8 Autonomous Agents</span>
            </div>
            <p class="arch-area-desc">
              Collaborative mesh of decoupled domain agents reasoning over natural language FinOps questions, telemetry synthesis, rightsizing opportunities, spending forecasts, commitment strategies, cost allocation, and incident triage.
            </p>
            <div class="arch-grid g4">
              ${renderCard(nodeMap['scribe'])}
              ${renderCard(nodeMap['nexus'])}
              ${renderCard(nodeMap['watcher'])}
              ${renderCard(nodeMap['plumb'])}
              ${renderCard(nodeMap['augur'])}
              ${renderCard(nodeMap['apex'])}
              ${renderCard(nodeMap['charta'])}
              ${renderCard(nodeMap['triage'])}
            </div>
          </section>
        </div>

        <!-- ================= ROW 3: DETERMINISTIC ENGINES & DATA INFRASTRUCTURE ================= -->
        <div class="arch-map-row row-engines-data">
          
          <!-- AREA D: Deterministic Computation & Safety Bounds -->
          <section class="arch-area area-eng" id="area-eng" data-layer="eng">
            <span class="arch-area-badge">AREA D · DETERMINISTIC ENGINES &amp; SAFETY</span>
            <div class="arch-area-head">
              <span class="ico">📐</span>
              <h2>Area D · Deterministic Decision &amp; Safety Engines</h2>
              <span class="cnt">7 Mathematical Engines</span>
            </div>
            <p class="arch-area-desc">
              Rigid mathematical computation, linear programming commitment solvers, statistical reductions, schema governance, and mandatory operational safety gates — zero LLM arithmetic in calculations.
            </p>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">🔢</span> Sub-Layer 4A · Mathematical, Statistical &amp; Optimization Solvers
              </div>
              <div class="arch-grid g4">
                ${renderCard(nodeMap['stat'])}
                ${renderCard(nodeMap['price'])}
                ${renderCard(nodeMap['fc'])}
                ${renderCard(nodeMap['solver'])}
              </div>
            </div>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">🛡️</span> Sub-Layer 4B · Operational Safety Gates, Diffs &amp; Schemas
              </div>
              <div class="arch-grid g3">
                ${renderCard(nodeMap['safety'])}
                ${renderCard(nodeMap['diff'])}
                ${renderCard(nodeMap['rtr'])}
              </div>
            </div>
          </section>

          <!-- AREA E: Signal Infrastructure & Historical Data Stores -->
          <section class="arch-area area-dat" id="area-dat" data-layer="dat">
            <span class="arch-area-badge">AREA E · DATA &amp; HISTORICAL INTELLIGENCE</span>
            <div class="arch-area-head">
              <span class="ico">🗄️</span>
              <h2>Area E · Signal Infrastructure &amp; Historical Data Stores</h2>
              <span class="cnt">6 Data Stores &amp; Engines</span>
            </div>
            <p class="arch-area-desc">
              Continuous background telemetry reductions, high-frequency signal storage, point-in-time topology snapshots, data lifecycle compaction, Graph RAG knowledge graphs, and versioned policies.
            </p>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">⚡</span> Sub-Layer 5A · Telemetry Reductions &amp; Snapshots
              </div>
              <div class="arch-grid g3">
                ${renderCard(nodeMap['sigdb'])}
                ${renderCard(nodeMap['raw'])}
                ${renderCard(nodeMap['snap'])}
              </div>
            </div>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">📚</span> Sub-Layer 5B · Lifecycle Compaction &amp; Historical Knowledge
              </div>
              <div class="arch-grid g3">
                ${renderCard(nodeMap['roll'])}
                ${renderCard(nodeMap['graph'])}
                ${renderCard(nodeMap['policy'])}
              </div>
            </div>
          </section>

        </div>

        <!-- ================= ROW 4: SHARED INTEGRATION BOUNDARY ================= -->
        <div class="arch-map-row row-integrations">
          <section class="arch-area area-int" id="area-int" data-layer="int">
            <span class="arch-area-badge">AREA F · SHARED INTEGRATION BOUNDARY</span>
            <div class="arch-area-head">
              <span class="ico">☁️</span>
              <h2>Area F · Tool Gateway, Multi-Cloud Adapters &amp; Delivery Channels</h2>
              <span class="cnt">12 Integration Adapters</span>
            </div>
            <p class="arch-area-desc">
              Shared integration boundary providing idempotent least-privilege cloud execution gateways, cloud capability registries, multi-cloud API adapters (Azure, AWS, GCP, OCI), and enterprise communication channels.
            </p>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">🧰</span> Central Tool Execution Layer &amp; Provider Registry
              </div>
              <div class="arch-grid g2">
                ${renderCard(nodeMap['tools'])}
                ${renderCard(nodeMap['preg'])}
              </div>
            </div>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">🌐</span> Multi-Cloud Infrastructure Adapters
              </div>
              <div class="arch-grid g5">
                ${renderCard(nodeMap['azure'])}
                ${renderCard(nodeMap['aws'])}
                ${renderCard(nodeMap['gcp'])}
                ${renderCard(nodeMap['oci'])}
                ${renderCard(nodeMap['newp'])}
              </div>
            </div>
            <div class="arch-subgroup">
              <div class="arch-subgroup-title">
                <span class="sub-ico">📣</span> Enterprise Collaboration &amp; Notification Channels
              </div>
              <div class="arch-grid g5">
                ${renderCard(nodeMap['slack'])}
                ${renderCard(nodeMap['teams'])}
                ${renderCard(nodeMap['gchat'])}
                ${renderCard(nodeMap['mail'])}
                ${renderCard(nodeMap['newc'])}
              </div>
            </div>
          </section>
        </div>

        <!-- ================= ROW 5: PLATFORM OPERATIONS & CROSS-CUTTING FOUNDATION ================= -->
        <div class="arch-map-row row-foundation">
          <section class="arch-area area-xc" id="area-xc" data-layer="xc">
            <span class="arch-area-badge">AREA H · PLATFORM OPERATIONS &amp; FOUNDATION</span>
            <div class="arch-area-head">
              <span class="ico">🔭</span>
              <h2>Area H · Platform Operations &amp; Cross-Cutting Capabilities</h2>
              <span class="cnt">5 Platform Services</span>
            </div>
            <p class="arch-area-desc">
              Cross-cutting platform foundation ensuring distributed OpenTelemetry tracing, tenant credential isolation, resilient circuit breakers, automated regression QA, and CI/CD release engineering.
            </p>
            <div class="arch-grid g5">
              ${renderCard(nodeMap['obs'])}
              ${renderCard(nodeMap['sec'])}
              ${renderCard(nodeMap['rel'])}
              ${renderCard(nodeMap['qa'])}
              ${renderCard(nodeMap['cicd'])}
            </div>
          </section>
        </div>

      </div>
    `;

    stage.innerHTML = html;

    // Attach card click & hover listeners
    $$(".arch-card").forEach(card => {
      card.addEventListener("click", () => {
        if (hasDragged) return;
        const id = card.getAttribute("data-id");
        if (!id) return;
        if (selectedNodeId === id) {
          selectNode(null);
        } else {
          selectNode(id);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });

      // Hover preview when no card is actively selected and no workflow is active
      card.addEventListener("mouseenter", () => {
        if (selectedNodeId || activeWorkflow) return;
        const id = card.getAttribute("data-id");
        highlightHoverEdges(id);
      });

      card.addEventListener("mouseleave", () => {
        if (selectedNodeId || activeWorkflow) return;
        clearHoverEdges();
      });
    });

    // Deselect on clicking empty canvas/stage area
    const stageEl = $("#stage");
    if (stageEl) {
      stageEl.addEventListener("click", (e) => {
        if (hasDragged) return;
        if (!e.target.closest(".arch-card") && 
            !e.target.closest("#wf-player-bar") && 
            !e.target.closest(".legend-popover") &&
            !e.target.closest(".stage-floating-fs-btn") &&
            !e.target.closest("#inspector")) {
          if (selectedNodeId) {
            selectNode(null);
          }
        }
      });
    }

    // Escape key to deselect & close drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && selectedNodeId) {
        selectNode(null);
      }
    });
  }

  /* ========================================================================
     2. SVG Defs & Arrowhead Markers
     ======================================================================== */
  function setupSvgDefs() {
    const defs = $("#svg-defs");
    if (!defs) return;
    defs.innerHTML = `
      <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8CA096" />
      </marker>
      <marker id="arrow-sync" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#5E7268" />
      </marker>
      <marker id="arrow-async" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4A5F55" />
      </marker>
      <marker id="arrow-data" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6F8479" />
      </marker>
      <marker id="arrow-approval" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#B86227" />
      </marker>
      <marker id="arrow-future" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#A8B4AE" />
      </marker>
      <marker id="arrow-upstream" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2D6A4F" />
      </marker>
      <marker id="arrow-downstream" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#B86227" />
      </marker>
      <marker id="arrow-workflow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D97706" />
      </marker>
    `;
  }

  /* ========================================================================
     3. Dynamic SVG Vector Connector Renderer (Cubic Bezier Curves)
     ======================================================================== */
  function renderEdges() {
    const edgesGroup = $("#svg-edges-group");
    const labelsGroup = $("#svg-labels-group");
    const canvasEl = $("#arch-canvas");
    if (!edgesGroup || !labelsGroup || !canvasEl) return;

    edgesGroup.innerHTML = "";
    labelsGroup.innerHTML = "";

    const canvasRect = canvasEl.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    // Calculate unscaled card bounding boxes relative to the canvas origin
    const nodeCoords = {};
    A.nodes.forEach(n => {
      const el = document.getElementById(`card-${n.id}`);
      if (el) {
        const r = el.getBoundingClientRect();
        nodeCoords[n.id] = {
          x: (r.left - canvasRect.left) / zoom,
          y: (r.top - canvasRect.top) / zoom,
          w: r.width / zoom,
          h: r.height / zoom
        };
      }
    });

    let edgesHtml = "";
    let labelsHtml = "";

    A.edges.forEach(edge => {
      const s = nodeCoords[edge.from];
      const t = nodeCoords[edge.to];
      if (!s || !t) return;

      const sc = { x: s.x + s.w / 2, y: s.y + s.h / 2 };
      const tc = { x: t.x + t.w / 2, y: t.y + t.h / 2 };

      const dx = tc.x - sc.x;
      const dy = tc.y - sc.y;

      let start, end, c1, c2;
      const isVert = Math.abs(dy) >= Math.abs(dx);

      if (isVert) {
        if (dy > 0) {
          start = { x: sc.x, y: s.y + s.h };
          end = { x: tc.x, y: t.y };
          const curv = Math.max(30, Math.min(120, dy * 0.45));
          c1 = { x: start.x, y: start.y + curv };
          c2 = { x: end.x, y: end.y - curv };
        } else {
          start = { x: sc.x, y: s.y };
          end = { x: tc.x, y: t.y + t.h };
          const curv = Math.max(30, Math.min(120, -dy * 0.45));
          c1 = { x: start.x, y: start.y - curv };
          c2 = { x: end.x, y: end.y + curv };
        }
      } else {
        if (dx > 0) {
          start = { x: s.x + s.w, y: sc.y };
          end = { x: t.x, y: tc.y };
          const curv = Math.max(30, Math.min(120, dx * 0.45));
          c1 = { x: start.x + curv, y: start.y };
          c2 = { x: end.x - curv, y: end.y };
        } else {
          start = { x: s.x, y: sc.y };
          end = { x: t.x + t.w, y: tc.y };
          const curv = Math.max(30, Math.min(120, -dx * 0.45));
          c1 = { x: start.x - curv, y: start.y };
          c2 = { x: end.x + curv, y: end.y };
        }
      }

      const d = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
      const edgeId = `edge-${edge.from}-${edge.to}`;
      const marker = `url(#arrow-${edge.type || 'default'})`;

      edgesHtml += `<path id="${edgeId}" class="edge-path edge-${edge.type}" data-from="${edge.from}" data-to="${edge.to}" data-type="${edge.type}" d="${d}" marker-end="${marker}" />`;

      // Label at Bezier curve midpoint (t = 0.5)
      const mx = 0.125 * start.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * end.x;
      const my = 0.125 * start.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * end.y;
      const labelText = edge.note || edge.type || "";
      const pillW = Math.max(64, labelText.length * 6.8 + 16);

      labelsHtml += `
        <g class="edge-label-group" id="lbl-${edge.from}-${edge.to}" data-from="${edge.from}" data-to="${edge.to}">
          <rect class="edge-label-bg" x="${(mx - pillW / 2).toFixed(1)}" y="${(my - 10).toFixed(1)}" width="${pillW.toFixed(1)}" height="20" rx="10" />
          <text class="edge-label-text" x="${mx.toFixed(1)}" y="${my.toFixed(1)}">${labelText}</text>
        </g>
      `;
    });

    edgesGroup.innerHTML = edgesHtml;
    labelsGroup.innerHTML = labelsHtml;
  }

  /* Hover helper */
  function highlightHoverEdges(nodeId) {
    $$(".edge-path").forEach(e => {
      const from = e.getAttribute("data-from");
      const to = e.getAttribute("data-to");
      const type = e.getAttribute("data-type") || "default";

      if (to === nodeId) {
        e.className = `edge-path edge-${type} edge-highlight-upstream`;
        e.setAttribute("marker-end", "url(#arrow-upstream)");
        const lbl = document.getElementById(`lbl-${from}-${to}`);
        if (lbl) lbl.className = "edge-label-group active upstream";
      } else if (from === nodeId) {
        e.className = `edge-path edge-${type} edge-highlight-downstream`;
        e.setAttribute("marker-end", "url(#arrow-downstream)");
        const lbl = document.getElementById(`lbl-${from}-${to}`);
        if (lbl) lbl.className = "edge-label-group active downstream";
      } else {
        e.classList.add("edge-dimmed");
      }
    });
  }

  function clearHoverEdges() {
    $$(".edge-path").forEach(e => {
      const type = e.getAttribute("data-type") || "default";
      e.className = `edge-path edge-${type}`;
      e.setAttribute("marker-end", `url(#arrow-${type})`);
    });
    $$(".edge-label-group").forEach(lbl => {
      lbl.className = "edge-label-group";
    });
  }

  /* ========================================================================
     4. Canvas Pan, Zoom & Navigation Manager
     ======================================================================== */
  function applyTransform(animate = false) {
    const canvasEl = $("#arch-canvas");
    if (!canvasEl) return;
    if (animate) {
      canvasEl.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => { canvasEl.style.transition = "none"; }, 300);
    } else {
      canvasEl.style.transition = "none";
    }
    canvasEl.style.transform = `translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px) scale(${zoom.toFixed(3)})`;
  }

  function zoomBy(factor, centerX, centerY) {
    const viewport = $("#arch-viewport");
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const cx = centerX !== undefined ? centerX : rect.width / 2;
    const cy = centerY !== undefined ? centerY : rect.height / 2;

    const newZoom = Math.min(1.8, Math.max(0.35, zoom * factor));
    panX = cx - (cx - panX) * (newZoom / zoom);
    panY = cy - (cy - panY) * (newZoom / zoom);
    zoom = newZoom;
    applyTransform(true);
  }

  function fitView() {
    const viewport = $("#arch-viewport");
    const canvasEl = $("#arch-canvas");
    if (!viewport || !canvasEl) return;
    const vRect = viewport.getBoundingClientRect();
    const stageEl = $("#arch-flow-stage");
    const sWidth = stageEl ? stageEl.offsetWidth : 1680;
    const sHeight = stageEl ? stageEl.offsetHeight : 1200;

    const scaleX = (vRect.width - 48) / sWidth;
    const scaleY = (vRect.height - 48) / sHeight;
    zoom = Math.min(1.0, Math.max(0.35, Math.min(scaleX, scaleY)));
    panX = Math.max(16, (vRect.width - sWidth * zoom) / 2);
    panY = Math.max(16, (vRect.height - sHeight * zoom) / 2);
    applyTransform(true);
  }

  function resetView() {
    const viewport = $("#arch-viewport");
    if (!viewport) return;
    const vRect = viewport.getBoundingClientRect();
    zoom = 1.0;
    const stageEl = $("#arch-flow-stage");
    const sWidth = stageEl ? stageEl.offsetWidth : 1680;
    panX = Math.max(20, (vRect.width - sWidth) / 2);
    panY = 24;
    applyTransform(true);
  }

  function centerNode(nodeId) {
    const viewport = $("#arch-viewport");
    const card = document.getElementById(`card-${nodeId}`);
    if (!viewport || !card) return;
    const vRect = viewport.getBoundingClientRect();
    const cardLeft = card.offsetLeft;
    const cardTop = card.offsetTop;
    const cardW = card.offsetWidth;
    const cardH = card.offsetHeight;

    panX = (vRect.width / 2) - (cardLeft + cardW / 2) * zoom;
    panY = (vRect.height / 2) - (cardTop + cardH / 2) * zoom;
    applyTransform(true);
  }

  function initPanZoom() {
    const viewport = $("#arch-viewport");
    if (!viewport) return;

    viewport.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (e.target.closest("button") || e.target.closest("input")) return;

      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      viewport.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const newPanX = e.clientX - dragStartX;
      const newPanY = e.clientY - dragStartY;

      if (Math.abs(newPanX - panX) > 4 || Math.abs(newPanY - panY) > 4) {
        hasDragged = true;
      }

      panX = newPanX;
      panY = newPanY;
      applyTransform(false);
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        viewport.classList.remove("is-dragging");
      }
    });

    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(1.8, Math.max(0.35, zoom * factor));

      panX = mouseX - (mouseX - panX) * (newZoom / zoom);
      panY = mouseY - (mouseY - panY) * (newZoom / zoom);
      zoom = newZoom;
      applyTransform(false);
    }, { passive: false });

    // Canvas toolbar buttons
    $("#btn-zoom-in")?.addEventListener("click", () => zoomBy(1.25));
    $("#btn-zoom-out")?.addEventListener("click", () => zoomBy(0.8));
    $("#btn-fit-view")?.addEventListener("click", fitView);
    $("#btn-reset-view")?.addEventListener("click", resetView);

    const btnToggleEdges = $("#btn-toggle-edges");
    if (btnToggleEdges) {
      btnToggleEdges.addEventListener("click", () => {
        edgesVisible = !edgesVisible;
        const svg = $("#arch-svg-edges");
        if (svg) svg.style.display = edgesVisible ? "block" : "none";
        btnToggleEdges.classList.toggle("active", edgesVisible);
        btnToggleEdges.textContent = edgesVisible ? "Edges: ON" : "Edges: OFF";
      });
    }
  }

  /* ========================================================================
     5. Component Selection & Dependency Highlighting
     ======================================================================== */
  function selectNode(nodeId) {
    selectedNodeId = nodeId;

    if (activeWorkflow) {
      exitWorkflow();
    }

    // Reset card classes
    $$(".arch-card").forEach(c => {
      c.classList.remove("selected-primary", "focused-upstream", "focused-downstream", "arch-dimmed", "wf-active-node");
    });
    $$(".arch-area").forEach(a => a.classList.remove("arch-dimmed"));

    // Reset edges
    $$(".edge-path").forEach(e => {
      const type = e.getAttribute("data-type") || "default";
      e.className = `edge-path edge-${type}`;
      e.setAttribute("marker-end", `url(#arrow-${type})`);
    });
    $$(".edge-label-group").forEach(lbl => {
      lbl.className = "edge-label-group";
    });

    if (!nodeId) {
      renderInspector(null);
      applyFilters();
      return;
    }

    const node = nodeMap[nodeId];
    if (!node) return;

    // Upstream and downstream
    const upstreamEdges = A.edges.filter(e => e.to === nodeId);
    const downstreamEdges = A.edges.filter(e => e.from === nodeId);
    const upstreamIds = upstreamEdges.map(e => e.from);
    const downstreamIds = downstreamEdges.map(e => e.to);
    const relatedIds = new Set([nodeId, ...upstreamIds, ...downstreamIds]);

    // Cards highlight
    $$(".arch-card").forEach(c => {
      const cid = c.getAttribute("data-id");
      if (cid === nodeId) {
        c.classList.add("selected-primary");
      } else if (upstreamIds.includes(cid)) {
        c.classList.add("focused-upstream");
      } else if (downstreamIds.includes(cid)) {
        c.classList.add("focused-downstream");
      } else {
        c.classList.add("arch-dimmed");
      }
    });

    // Areas highlight
    $$(".arch-area").forEach(a => {
      const hasRelated = Array.from(a.querySelectorAll(".arch-card")).some(c => relatedIds.has(c.getAttribute("data-id")));
      if (!hasRelated) {
        a.classList.add("arch-dimmed");
      }
    });

    // Edges highlight
    $$(".edge-path").forEach(e => {
      const from = e.getAttribute("data-from");
      const to = e.getAttribute("data-to");
      const type = e.getAttribute("data-type") || "default";

      if (to === nodeId) {
        e.className = `edge-path edge-${type} edge-highlight-upstream`;
        e.setAttribute("marker-end", "url(#arrow-upstream)");
        const lbl = document.getElementById(`lbl-${from}-${to}`);
        if (lbl) lbl.className = "edge-label-group active upstream";
      } else if (from === nodeId) {
        e.className = `edge-path edge-${type} edge-highlight-downstream`;
        e.setAttribute("marker-end", "url(#arrow-downstream)");
        const lbl = document.getElementById(`lbl-${from}-${to}`);
        if (lbl) lbl.className = "edge-label-group active downstream";
      } else {
        e.className = `edge-path edge-${type} edge-dimmed`;
      }
    });

    centerNode(nodeId);
    renderInspector(node, upstreamIds, downstreamIds);
  }

  /* ========================================================================
     6. Deep Technical Inspector Drawer
     ======================================================================== */
  function renderInspector(node, upstreamIds = [], downstreamIds = []) {
    const inspector = $("#inspector");
    if (!inspector) return;

    if (!node) {
      inspector.classList.remove("open");
      inspector.innerHTML = "";
      return;
    }

    inspector.classList.add("open");

    const layer = layerMap[node.layer] || { name: node.layer, c: "#1F4E38" };
    const upstreamNodes = upstreamIds.map(id => nodeMap[id]).filter(Boolean);
    const downstreamNodes = downstreamIds.map(id => nodeMap[id]).filter(Boolean);

    let html = `
      <div class="inspector-content">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px;">
          <div>
            <span class="inspector-layer-pill" style="color: ${layer.c}; background: ${layer.c}18;">${layer.name}</span>
            <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin: 6px 0 0; color: var(--ink); line-height: 1.25;">${node.name}</h2>
          </div>
          <button id="btn-inspector-close" class="btn-tool" style="padding: 4px 10px; font-size: 0.8rem; cursor: pointer; flex-shrink: 0;" aria-label="Close Inspector">✕ Close</button>
        </div>
        
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <span class="arch-mode-tag mode-${node.mode}">${MODE_LABEL[node.mode] || node.mode}</span>
          <span class="arch-status-indicator" style="background: var(--paper-warm); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--paper-border);">
            <span class="arch-status-pip ${node.status}"></span>
            ${ST_LABEL[node.status] || node.status}
          </span>
        </div>
        
        <div class="inspector-section-title">Summary</div>
        <p class="inspector-summary">${node.summary}</p>
        
        <div class="inspector-section-title">Core Responsibilities</div>
        <ul class="inspector-actions-list">
          ${(node.actions || []).map(a => `<li>${a}</li>`).join("")}
        </ul>
        
        <div class="inspector-section-title">Input Contract</div>
        <div class="inspector-contract-box">${node.in || "None (Ingress Source / External Trigger)"}</div>
        
        <div class="inspector-section-title">Output Contract</div>
        <div class="inspector-contract-box">${node.out || "None (Terminal Sink / User Interface Output)"}</div>
        
        <div class="inspector-section-title">Upstream Inputs (${upstreamNodes.length})</div>
        <div class="inspector-dep-pills">
          ${upstreamNodes.length ? upstreamNodes.map(u => `
            <button class="inspector-dep-btn up" data-id="${u.id}" title="Inspect upstream feeder: ${u.name}">← ${u.name}</button>
          `).join("") : '<span style="font-size: 0.78rem; color: var(--ink-muted);">Root Ingress / External Trigger</span>'}
        </div>
        
        <div class="inspector-section-title">Downstream Dependents (${downstreamNodes.length})</div>
        <div class="inspector-dep-pills">
          ${downstreamNodes.length ? downstreamNodes.map(d => `
            <button class="inspector-dep-btn down" data-id="${d.id}" title="Inspect downstream receiver: ${d.name}">→ ${d.name}</button>
          `).join("") : '<span style="font-size: 0.78rem; color: var(--ink-muted);">Terminal Sink / User Interface Output</span>'}
        </div>
    `;

    if (node.note && node.note.trim() && !node.note.includes("undefined")) {
      html += `
        <div class="inspector-section-title" style="margin-top: 16px;">Architectural Context &amp; Reference</div>
        <div class="inspector-note-box">${node.note}</div>
      `;
    }

    html += `</div>`;
    inspector.innerHTML = html;

    $("#btn-inspector-close")?.addEventListener("click", () => selectNode(null));

    $$(".inspector-dep-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-id");
        selectNode(targetId);
      });
    });
  }

  /* ========================================================================
     7. Search & Autocomplete
     ======================================================================== */
  function initSearch() {
    const q = $("#q");
    const ql = $("#ql");
    if (!q || !ql) return;

    ql.innerHTML = A.nodes.map(n => `<option value="${n.name}">${n.summary ? n.summary.slice(0, 60) + '...' : ''}</option>`).join("");

    const doSearch = (val) => {
      if (!val) return;
      const lower = val.toLowerCase().trim();
      const match = A.nodes.find(n => n.name.toLowerCase() === lower || n.id.toLowerCase() === lower) ||
                    A.nodes.find(n => n.name.toLowerCase().includes(lower) || (n.summary && n.summary.toLowerCase().includes(lower)));
      if (match) {
        selectNode(match.id);
      }
    };

    q.addEventListener("input", (e) => {
      const val = e.target.value;
      const match = A.nodes.find(n => n.name.toLowerCase() === val.toLowerCase().trim());
      if (match) {
        doSearch(val);
      }
    });

    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch(q.value);
      }
    });
  }

  /* ========================================================================
     8. Filters & View Switcher
     ======================================================================== */
  function applyFilters() {
    if (selectedNodeId) return;
    if (activeWorkflow) return;

    const v = A.views[activeView];
    const allowedLayers = v && v.layers ? v.layers : null;
    const allowedNodes = v && v.nodes ? v.nodes : null;

    $$(".arch-area").forEach(p => {
      const layerId = p.getAttribute("data-layer");
      let panelMatch = true;
      if (allowedLayers && layerId && !allowedLayers.includes(layerId)) {
        panelMatch = false;
      }
      p.classList.toggle("arch-dimmed", !panelMatch);
    });

    $$(".arch-card").forEach(c => {
      const status = c.getAttribute("data-status");
      const mode = c.getAttribute("data-mode");
      const layer = c.getAttribute("data-layer");
      const id = c.getAttribute("data-id");

      let match = true;

      if (allowedLayers) {
        if (!allowedLayers.includes(layer) && (!allowedNodes || !allowedNodes.includes(id))) {
          match = false;
        }
      }

      if (activeStatus !== "all" && status !== activeStatus) {
        match = false;
      }

      if (activeMode !== "all" && mode !== activeMode) {
        match = false;
      }

      c.classList.toggle("arch-dimmed", !match);
    });

    // Dim edges connected to dimmed cards
    $$(".edge-path").forEach(e => {
      const from = e.getAttribute("data-from");
      const to = e.getAttribute("data-to");
      const fromCard = document.getElementById(`card-${from}`);
      const toCard = document.getElementById(`card-${to}`);
      const dimmed = !fromCard || !toCard || fromCard.classList.contains("arch-dimmed") || toCard.classList.contains("arch-dimmed");
      e.classList.toggle("edge-dimmed", dimmed);
    });
  }

  function initToolbar() {
    // 1. Views
    const viewsContainer = $("#views");
    if (viewsContainer && A.views) {
      viewsContainer.innerHTML = Object.entries(A.views).map(([key, v]) => `
        <button class="btn-tool ${key === 'overview' ? 'active' : ''}" data-view="${key}">${v.name}</button>
      `).join("");

      viewsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-view]");
        if (!btn) return;
        $$("#views button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeView = btn.getAttribute("data-view");
        selectNode(null);
        applyFilters();
      });
    }

    // 2. Status Filters
    const filtersContainer = $("#filters");
    if (filtersContainer) {
      filtersContainer.innerHTML = `
        <span class="mono" style="font-size:0.75rem; color:var(--ink-muted); margin-right:4px;">STATUS:</span>
        <button class="btn-tool active" data-status="all">All</button>
        <button class="btn-tool" data-status="proto">Prototype</button>
        <button class="btn-tool" data-status="prop">Target State</button>
        <button class="btn-tool" data-status="future">Future</button>
      `;

      filtersContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-status]");
        if (!btn) return;
        $$("#filters button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeStatus = btn.getAttribute("data-status");
        selectNode(null);
        applyFilters();
      });
    }

    // 3. Mode Filters
    const modeContainer = $("#mode-filters");
    if (modeContainer) {
      modeContainer.innerHTML = `
        <span class="mono" style="font-size:0.75rem; color:var(--ink-muted); margin-right:4px;">MODE:</span>
        <button class="btn-tool active" data-mode="all">All</button>
        <button class="btn-tool" data-mode="ai">AI Reasoning</button>
        <button class="btn-tool" data-mode="det">Deterministic</button>
        <button class="btn-tool" data-mode="mix">Hybrid</button>
        <button class="btn-tool" data-mode="infra">Infrastructure</button>
      `;

      modeContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-mode]");
        if (!btn) return;
        $$("#mode-filters button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeMode = btn.getAttribute("data-mode");
        selectNode(null);
        applyFilters();
      });
    }

    // 4. Workflow Traces
    const wfContainer = $("#wf");
    if (wfContainer && A.workflows) {
      wfContainer.innerHTML = `
        <span class="mono" style="font-size:0.75rem; color:var(--copper); margin-right:4px;">FLOWS:</span>
        ${A.workflows.map((w, idx) => `
          <button class="btn-tool" data-wf="${idx}" title="${w.note}">${w.name.split(':')[0] || 'Trace ' + (idx + 1)}</button>
        `).join("")}
      `;

      wfContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-wf]");
        if (!btn) return;
        const idx = parseInt(btn.getAttribute("data-wf"), 10);
        if (activeWorkflow === A.workflows[idx]) {
          exitWorkflow();
        } else {
          $$("#wf button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          startWorkflow(A.workflows[idx]);
        }
      });
    }

    // 5. Legend Popover
    const btnLegend = $("#btn-legend");
    const legendPopover = $("#legend-popover");
    const btnLegendClose = $("#btn-legend-close");
    const legendBody = $("#legend-body");

    if (legendBody) {
      legendBody.innerHTML = `
        <div class="legend-group-title">Implementation Status</div>
        <div class="legend-item"><span class="legend-pip proto" style="background: #2D6A4F;"></span> In Prototype (Proven telemetry reduction &amp; baseline math)</div>
        <div class="legend-item"><span class="legend-pip prop" style="background: #B86227;"></span> Designed Target State (Phase 2.1 specifications)</div>
        <div class="legend-item"><span class="legend-pip future" style="background: #94A3B8;"></span> Future Multi-Cloud Extension</div>

        <div class="legend-group-title" style="margin-top: 12px;">Execution Modes</div>
        <div class="legend-item"><span class="arch-mode-tag mode-ai">AI REASONING</span> Cognitive interpretation &amp; intent classification</div>
        <div class="legend-item"><span class="arch-mode-tag mode-det">DETERMINISTIC</span> Algorithmic math, solvers &amp; strict safety bounds</div>
        <div class="legend-item"><span class="arch-mode-tag mode-mix">HYBRID</span> AI pattern recognition verified by deterministic math</div>
        <div class="legend-item"><span class="arch-mode-tag mode-infra">INFRASTRUCTURE</span> Transport, storage, adapters &amp; execution gateways</div>

        <div class="legend-group-title" style="margin-top: 12px;">Dynamic SVG Connectors</div>
        <div class="legend-item"><span class="legend-line" style="background: #5E7268;"></span> Synchronous Invocation (Solid)</div>
        <div class="legend-item"><span class="legend-line" style="border-top: 2px dashed #4A5F55; height: 0;"></span> Asynchronous Event (Dashed)</div>
        <div class="legend-item"><span class="legend-line" style="border-top: 2px dotted #6F8479; height: 0;"></span> Telemetry / State Flow (Dotted)</div>
        <div class="legend-item"><span class="legend-line" style="background: #B86227; height: 3px;"></span> Governance &amp; Human Approval (Bold Copper)</div>
        <div class="legend-item"><span class="legend-line" style="border-top: 2px dashed #A8B4AE; height: 0;"></span> Future Extension Connector (Light Dashed)</div>

        <div class="legend-group-title" style="margin-top: 12px;">Interactive Relationships</div>
        <div class="legend-item"><span class="legend-line" style="background: #2D6A4F; height: 3px;"></span> Upstream Feeder / Input Source (Green)</div>
        <div class="legend-item"><span class="legend-line" style="background: #B86227; height: 3px;"></span> Downstream Receiver / Action Target (Copper)</div>
        <div class="legend-item"><span class="legend-line" style="background: #D97706; height: 3px;"></span> Active Workflow Execution Path (Glowing Amber)</div>
      `;
    }

    if (btnLegend && legendPopover) {
      btnLegend.addEventListener("click", () => {
        legendPopover.classList.toggle("open");
        legendPopover.setAttribute("aria-hidden", !legendPopover.classList.contains("open"));
      });
    }

    if (btnLegendClose && legendPopover) {
      btnLegendClose.addEventListener("click", () => {
        legendPopover.classList.remove("open");
        legendPopover.setAttribute("aria-hidden", "true");
      });
    }
  }

  /* ========================================================================
     9. Fullscreen Viewport Mode
     ======================================================================== */
  function initFullscreen() {
    const toggleFs = () => {
      const mainEl = document.querySelector(".explorer-main");
      if (!mainEl) return;

      if (!document.fullscreenElement && !mainEl.classList.contains("is-fullscreen")) {
        if (mainEl.requestFullscreen) {
          mainEl.requestFullscreen().catch(() => {
            mainEl.classList.add("is-fullscreen");
            updateFullscreenUi(true);
          });
        } else {
          mainEl.classList.add("is-fullscreen");
          updateFullscreenUi(true);
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {
            mainEl.classList.remove("is-fullscreen");
            updateFullscreenUi(false);
          });
        } else {
          mainEl.classList.remove("is-fullscreen");
          updateFullscreenUi(false);
        }
      }
    };

    const updateFullscreenUi = (isFs) => {
      const btns = [$("#btn-fullscreen"), $("#stage-fullscreen-btn")];
      btns.forEach(b => {
        if (!b) return;
        b.innerHTML = isFs ? "🗗 Exit Fullscreen" : "⛶ Fullscreen";
        b.classList.toggle("active", isFs);
      });
    };

    $("#btn-fullscreen")?.addEventListener("click", toggleFs);
    $("#stage-fullscreen-btn")?.addEventListener("click", toggleFs);

    document.addEventListener("fullscreenchange", () => {
      const isFs = !!document.fullscreenElement;
      const mainEl = document.querySelector(".explorer-main");
      if (mainEl) mainEl.classList.toggle("is-fullscreen", isFs);
      updateFullscreenUi(isFs);
    });
  }

  /* ========================================================================
     10. Workflow Trace Player with Active Connector Path Animation
     ======================================================================== */
  function startWorkflow(wf) {
    selectNode(null);
    activeWorkflow = wf;
    workflowStep = 0;
    workflowPlaying = true;

    const playerBar = $("#wf-player-bar");
    if (playerBar) playerBar.style.display = "flex";

    const playToggle = $("#wf-play-toggle");
    if (playToggle) playToggle.textContent = "Pause";

    // Dim cards not in workflow
    const activeNodes = new Set([...wf.steps, ...(wf.also || [])]);
    $$(".arch-card").forEach(c => {
      const id = c.getAttribute("data-id");
      c.classList.toggle("arch-dimmed", !activeNodes.has(id));
    });

    // Dim all edges initially
    $$(".edge-path").forEach(e => {
      const type = e.getAttribute("data-type") || "default";
      e.className = `edge-path edge-${type} edge-dimmed`;
      e.setAttribute("marker-end", `url(#arrow-${type})`);
    });
    $$(".edge-label-group").forEach(lbl => {
      lbl.className = "edge-label-group";
    });

    stepWorkflow();
  }

  function stepWorkflow() {
    if (!activeWorkflow) return;
    const steps = activeWorkflow.steps;
    if (workflowStep >= steps.length) {
      workflowStep = 0;
    }

    const currentId = steps[workflowStep];
    const currentNode = nodeMap[currentId];

    // Highlight active card
    $$(".arch-card").forEach(c => c.classList.remove("wf-active-node"));
    const currentCard = document.getElementById(`card-${currentId}`);
    if (currentCard) {
      currentCard.classList.add("wf-active-node");
      centerNode(currentId);
    }

    // Reset edges to dimmed state
    $$(".edge-path").forEach(e => {
      const type = e.getAttribute("data-type") || "default";
      e.className = `edge-path edge-${type} edge-dimmed`;
      e.setAttribute("marker-end", `url(#arrow-${type})`);
    });
    $$(".edge-label-group").forEach(lbl => {
      lbl.className = "edge-label-group";
    });

    // Animate connector between previous step and current step
    if (workflowStep > 0) {
      const prevId = steps[workflowStep - 1];
      const edgeEl = document.getElementById(`edge-${prevId}-${currentId}`);
      if (edgeEl) {
        const type = edgeEl.getAttribute("data-type") || "default";
        edgeEl.className = `edge-path edge-${type} edge-highlight-workflow`;
        edgeEl.setAttribute("marker-end", "url(#arrow-workflow)");
      }
      const lbl = document.getElementById(`lbl-${prevId}-${currentId}`);
      if (lbl) lbl.className = "edge-label-group active workflow";
    }

    // Update ticker text
    const ticker = $("#wf-ticker-text");
    if (ticker && currentNode) {
      ticker.textContent = `[Step ${workflowStep + 1}/${steps.length}] ${currentNode.name}: ${currentNode.summary}`;
    }

    // Auto-advance
    clearTimeout(workflowTimer);
    if (workflowPlaying) {
      workflowTimer = setTimeout(() => {
        workflowStep++;
        stepWorkflow();
      }, 3200);
    }
  }

  function exitWorkflow() {
    activeWorkflow = null;
    workflowPlaying = false;
    clearTimeout(workflowTimer);

    const playerBar = $("#wf-player-bar");
    if (playerBar) playerBar.style.display = "none";

    $$("#wf button").forEach(b => b.classList.remove("active"));
    $$(".arch-card").forEach(c => c.classList.remove("wf-active-node"));

    // Reset edges
    $$(".edge-path").forEach(e => {
      const type = e.getAttribute("data-type") || "default";
      e.className = `edge-path edge-${type}`;
      e.setAttribute("marker-end", `url(#arrow-${type})`);
    });
    $$(".edge-label-group").forEach(lbl => {
      lbl.className = "edge-label-group";
    });

    applyFilters();
  }

  function initWorkflowPlayer() {
    $("#wf-prev-step")?.addEventListener("click", () => {
      if (!activeWorkflow) return;
      workflowPlaying = false;
      $("#wf-play-toggle").textContent = "Play";
      clearTimeout(workflowTimer);
      workflowStep = (workflowStep - 1 + activeWorkflow.steps.length) % activeWorkflow.steps.length;
      stepWorkflow();
    });

    $("#wf-next-step")?.addEventListener("click", () => {
      if (!activeWorkflow) return;
      workflowPlaying = false;
      $("#wf-play-toggle").textContent = "Play";
      clearTimeout(workflowTimer);
      workflowStep = (workflowStep + 1) % activeWorkflow.steps.length;
      stepWorkflow();
    });

    $("#wf-play-toggle")?.addEventListener("click", () => {
      if (!activeWorkflow) return;
      workflowPlaying = !workflowPlaying;
      $("#wf-play-toggle").textContent = workflowPlaying ? "Pause" : "Play";
      if (workflowPlaying) {
        stepWorkflow();
      } else {
        clearTimeout(workflowTimer);
      }
    });

    $("#wf-exit-btn")?.addEventListener("click", exitWorkflow);
  }

  /* ========================================================================
     11. Execution Lifecycle Initialization
     ======================================================================== */
  renderFlowStage();
  setupSvgDefs();
  initPanZoom();
  renderInspector(null);
  initSearch();
  initToolbar();
  initFullscreen();
  initWorkflowPlayer();

  // Initial connector rendering after DOM layout settles
  requestAnimationFrame(() => {
    renderEdges();
    fitView();
  });

  // Re-calculate edge paths when window or canvas layout changes
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderEdges();
    }, 150);
  });

})();
