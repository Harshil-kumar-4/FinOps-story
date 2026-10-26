// Single source of truth for Cloud Economics Control Plane.
// Grounded strictly in the three reference documents:
// 1. Initial Pitch Document
// 2. Master Architecture Document
// 3. Complete Component & Responsibility Catalogue
// Status vocabulary:
//   proto  = partly shown by current prototype
//   prop   = designed / proposed target state
//   future = future extension / validation required
// Mode vocabulary:
//   ai    = AI reasoning & cognitive interpretation
//   det   = Deterministic computation & mathematical algorithms
//   mix   = Hybrid AI reasoning + deterministic validation
//   infra = Core infrastructure, storage, transport & adapters

var root = typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this);

root.ARCH = {
  layers: [
    { id: "ui", name: "Area A · Ingress & Interfaces", c: "#2F4B7C", desc: "User entry points, CLI, natural language parser, event triggers, persistent dashboard, and MCP bridge" },
    { id: "ctl", name: "Area B · Control Plane & Orchestration", c: "#4A4F6B", desc: "Planner–executor orchestrator, state store, decoupled event bus, customer tenancy, identity, and configuration" },
    { id: "agt", name: "Area C · Domain Intelligence Mesh", c: "#8A5A1F", desc: "Specialized intelligence agents for questions, telemetry synthesis, rightsizing, forecasting, commitments, and allocation" },
    { id: "eng", name: "Area D · Deterministic Engines & Safety", c: "#3E6B57", desc: "Precise mathematical engines, statistical calculations, pricing models, and production safety evaluation" },
    { id: "dat", name: "Area E · Data & Historical Intelligence", c: "#2C6B73", desc: "Signal database, raw observation store, topology snapshots, deltas, and business policy registry" },
    { id: "res", name: "Area G · Results, Governance & Outcomes", c: "#7A3F5C", desc: "Standardized recommendation contracts, human approval gateway, GitOps remediation, and outcome audit" },
    { id: "int", name: "Area F · Tools & Integration Boundary", c: "#5E6B2A", desc: "Centralized tool execution layer, multi-cloud provider adapters, and notification channel integrations" },
    { id: "xc", name: "Area H · Platform Operations & Foundation", c: "#6B6B66", desc: "Observability, execution tracing, security boundaries, reliability, evaluation, and CI/CD" }
  ],

  views: {
    overview: { name: "Overview (All Areas)", layers: null },
    agents: { name: "Domain Intelligence & Reasoning", layers: ["agt", "eng"], desc: "Specialized cognitive agents paired with deterministic mathematical engines" },
    data: { name: "Historical Intelligence & Data", layers: ["dat", "agt"], nodes: ["nexus", "watcher", "scribe", "plumb", "sigdb", "snap", "raw", "roll", "graph", "policy"], desc: "Continuous signal engine, time-series aggregation, and contextual graph knowledge" },
    integ: { name: "Tools & Integrations", layers: ["int"], desc: "Centralized tool gateway, provider abstractions (Azure, AWS, GCP, OCI), and communication channels" },
    decide: { name: "Decision & Governance", layers: ["agt", "eng", "res"], desc: "End-to-end decision path from candidate identification to safety evaluation, approval, and outcome audit" },
    gov: { name: "Security & Platform Operations", layers: ["res", "xc", "ctl"], desc: "Tenant isolation, least-privilege cloud authorization, policy gates, and verifiable audit trails" }
  },

  nodes: [
    // Layer 1: Interfaces & Triggers (ui)
    {
      id: "cmd",
      sec: "8",
      name: "Command Interface",
      layer: "ui",
      status: "prop",
      mode: "mix",
      summary: "Operational interface where users state intent in natural language or configure agents, scope, time range, and options explicitly.",
      actions: [
        "Parses intent in natural language or accepts structured manual parameter configurations",
        "Allows selection of target agents (e.g. Scribe, Plumb, Augur, Apex, Charta) or automatic agent routing",
        "Resolves target resource scope across subscriptions, resource groups, namespaces, or tags",
        "Normalizes time-range inputs using unambiguous duration tokens (1mo, 15d, 4h)",
        "Captures execution options including dry-run flags, confidence thresholds, and notification targets"
      ],
      in: "User intent, agent selection, resource scope, time range, execution flags",
      out: "Validated configuration or execution request payload passed to Intent Parser",
      note: "The analysis range specified by the user is distinct from Nexus's continuous collection cadence."
    },
    {
      id: "plan",
      sec: "9",
      name: "Intent Parser & Planner",
      layer: "ui",
      status: "prop",
      mode: "ai",
      summary: "Translates conversational requests or manual options into a validated, deterministic execution plan; clarifies ambiguities rather than guessing.",
      actions: [
        "Interprets requested outcome from user prompt using LLM-assisted semantic analysis",
        "Identifies required domain agents and deterministic tools needed for the task",
        "Resolves requested resource scope against available permissions and tenant boundaries",
        "Identifies missing or ambiguous constraints (e.g., unspecified environment or time window)",
        "Produces a validated, structured execution plan graph for the Orchestrator",
        "Requests user clarification when intent or target scope cannot be safely resolved"
      ],
      in: "Raw request string, tenant permissions, catalog of available data and tools",
      out: "Structured, validated execution plan graph passed to Orchestrator",
      note: "Must never run heavy analytical agents (Plumb, Augur, Apex) for simple historical information queries."
    },
    {
      id: "trig",
      sec: "10",
      name: "Trigger Manager",
      layer: "ui",
      status: "prop",
      mode: "det",
      summary: "Initiates workflows from manual requests, scheduled crons, cloud provider alerts, internal bus events, or external API/MCP calls.",
      actions: [
        "Listens for scheduled cron cadences (e.g. recurring 4-hour Nexus signal scans)",
        "Ingests incoming cloud alerts and webhook signals (e.g. Azure Monitor, AWS EventBridge)",
        "Deduplicates repeated trigger signals to prevent redundant workflow execution",
        "Validates incoming trigger payloads against tenant security policies",
        "Constructs standardized execution records and dispatches them to the Orchestrator"
      ],
      in: "Schedules, cloud webhooks, Event Bus messages, API calls, MCP triggers",
      out: "Standardized execution event dispatched to Planner–Executor Orchestrator"
    },
    {
      id: "dash",
      sec: "11",
      name: "Dashboard & Reporting",
      layer: "ui",
      status: "prop",
      mode: "infra",
      summary: "Persistent visual interface providing scan history, cost trends, resource exploration, recommendation details, approval status, and outcome audits.",
      actions: [
        "Renders executive summary of cloud spend, identified opportunities, and realized savings",
        "Provides searchable historical scan explorer with drill-down into specific execution runs",
        "Visualizes multi-cloud cost trends and budget tracking curves",
        "Presents resource explorer showing utilization metrics, anomalies, and active recommendations",
        "Houses the Human Approval Gateway UI for review of candidate optimizations",
        "Tracks outcome auditing metrics comparing predicted savings against actual billing invoices"
      ],
      in: "Stored signals from Signal Database, recommendations, execution records, audit histories",
      out: "Interactive visual data visualizations, user approval actions, and CSV/PDF report exports",
      note: "Dashboard acts as a persistent system of record, separate from transient notification alerts."
    },
    {
      id: "mcp",
      sec: "36",
      name: "MCP Integration Layer",
      layer: "ui",
      status: "prop",
      mode: "infra",
      summary: "Exposes selected platform tools and read-only resources to AI agents, IDEs (Claude Desktop, Cursor), and external developer tools via Model Context Protocol.",
      actions: [
        "Exposes governed FinOps tools and resource models via standard Model Context Protocol (MCP)",
        "Enforces platform tenant boundaries and role-based permissions on all MCP client calls",
        "Provides read-only access to resource inventory, historical spend, and signal summaries",
        "Reuses centralized tool validation and audit logging mechanisms",
        "Prevents external MCP clients from bypassing human approval gates for infrastructure changes"
      ],
      in: "MCP client tool requests, prompt context queries, external agent invocations",
      out: "Structured JSON responses, formatted context blocks, and telemetry payloads"
    },

    // Layer 2: Control Plane & Orchestration (ctl)
    {
      id: "orch",
      sec: "29",
      name: "Planner–Executor Orchestrator",
      layer: "ctl",
      status: "proto",
      mode: "mix",
      summary: "Runtime coordinator implementing a LangGraph-style Planner–Executor model; manages dependency trees, parallel execution, retries, and state persistence.",
      actions: [
        "Planner phase: Formulates deterministic execution graph based on request and scope",
        "Executor phase: Executes graph nodes, coordinates agent dependencies, and dispatches tool calls",
        "Coordinates parallel agent execution when dependencies allow (e.g. concurrent metric collection)",
        "Manages retry policies, exponential backoff, circuit breaking, and failure recovery",
        "Persists execution checkpoints and step states into Execution State Store",
        "Current prototype demonstrates a static orchestrated rightsizing sequence"
      ],
      in: "Validated execution plan graph from Planner or Trigger Manager",
      out: "Agent execution commands, aggregated results, and immutable execution trace records",
      note: "The Executor must never execute unvalidated instructions directly generated by an LLM."
    },
    {
      id: "bus",
      sec: "7",
      name: "Event Bus & Workflow Events",
      layer: "ctl",
      status: "prop",
      mode: "infra",
      summary: "Asynchronous messaging backbone distributing system events (ScanCompleted, AnomalyDetected, RecommendationCreated, ApprovalRequired) across components.",
      actions: [
        "Publishes asynchronous platform events across decoupled components",
        "Distributes ScanCompleted events from Nexus to downstream consumers (Watcher, Dashboards)",
        "Routes AnomalyDetected events from Watcher to notification dispatcher and incident systems",
        "Dispatches ApprovalRequired events when Plumb or Apex generate actionable recommendations",
        "Supports decoupled event-driven workflows with guaranteed message ordering semantics"
      ],
      in: "Event payloads emitted by domain agents, engines, and trigger managers",
      out: "Dispatched event streams to subscribed consumers and background workers",
      note: "Open architectural decision: at-least-once delivery requires strictly idempotent consumers."
    },
    {
      id: "state",
      sec: "30",
      name: "Execution State Store",
      layer: "ctl",
      status: "prop",
      mode: "infra",
      summary: "Stores execution run metadata, step progress, retry state, checkpoints, and references to artifacts; strictly isolated from the Signal Database.",
      actions: [
        "Maintains unique execution run IDs, timestamps, and invoking identities",
        "Records granular step-level execution status (Pending, Running, Succeeded, Failed, Skipped)",
        "Stores execution checkpoints allowing resumption after transient system interruptions",
        "Maintains references to generated recommendation artifacts and intermediate signal tables",
        "Enforces strict data isolation between concurrent tenant execution runs"
      ],
      in: "Execution updates from Orchestrator and agent worker processes",
      out: "Execution state queries, run status reports, and checkpoint recovery records"
    },
    {
      id: "tenant",
      sec: "2",
      name: "Customer & Tenant Management",
      layer: "ctl",
      status: "prop",
      mode: "infra",
      summary: "Manages customer workspaces, role bindings, provider connection mappings, and strict isolation of data, credentials, and scan history.",
      actions: [
        "Enforces multi-tenant data isolation across databases, storage, and caching tiers",
        "Manages customer workspace definitions, organizational hierarchies, and cost centers",
        "Associates cloud provider connection credentials with specific customer tenants",
        "Maintains tenant-specific configuration profiles, approval policies, and feature flags",
        "Propagates explicit tenant identity on all internal service invocations; never infers tenant"
      ],
      in: "Tenant provisioning commands, workspace configurations, access control requests",
      out: "Tenant context attributes, workspace boundaries, and isolation policies"
    },
    {
      id: "auth",
      sec: "3",
      name: "Identity & Authentication",
      layer: "ctl",
      status: "prop",
      mode: "det",
      summary: "Handles user sign-in, RBAC, cloud provider authorization, short-lived tokens, credential rotation, and read-only defaults.",
      actions: [
        "Authenticates platform users via enterprise IdP (OIDC, SAML, Azure AD / Entra ID)",
        "Enforces Role-Based Access Control (Admin, FinOps Practitioner, SRE Reviewer, Viewer)",
        "Manages cloud provider integration credentials (OIDC federated credentials, IAM roles)",
        "Issues short-lived, least-privilege tokens for cloud API calls; supports automated rotation",
        "Enforces read-only defaults; write permissions granted only when remediation is enabled"
      ],
      in: "User login requests, IdP claims, cloud credential configuration, token requests",
      out: "Authenticated session tokens, cloud provider access tokens, and permission grants",
      note: "Open architectural decision: balancing federated OIDC roles vs customer-managed app credentials."
    },
    {
      id: "cfg",
      sec: "41",
      name: "Configuration & Features",
      layer: "ctl",
      status: "prop",
      mode: "infra",
      summary: "Versioned, auditable repository of customer-specific settings: agent cadence, data retention, notification routing, and approval policies.",
      actions: [
        "Stores customer-level agent execution schedules (e.g. 2h, 4h, or 6h Nexus scan cadences)",
        "Maintains data retention settings for raw observations vs rolled-up statistical signals",
        "Configures notification channel bindings per team and environment criticality",
        "Maintains approval mode settings (manual review required vs auto-PR generation)",
        "Provides an immutable audit log of all configuration modifications"
      ],
      in: "Configuration update requests from administrators and API clients",
      out: "Versioned configuration records served to Orchestrator and Domain Agents"
    },

    // Layer 3: Domain Agents (agt)
    {
      id: "scribe",
      sec: "12",
      name: "Scribe — Informational Agent",
      layer: "agt",
      status: "prop",
      mode: "mix",
      summary: "Conversational information agent: answers questions about existing cloud spend, activity, resource state, and historical patterns using stored records.",
      actions: [
        "Parses natural-language queries about infrastructure spend, inventory, and historical activity",
        "Resolves query scope (e.g. 'production AKS clusters in West Europe over the past 30 days')",
        "Retrieves precomputed records from Signal DB and Snapshot Engine without expensive raw queries",
        "Synthesizes concise, structured answers with explicit data citations and timestamp provenance",
        "Answers plain informational questions without invoking heavyweight analytical rightsizing workflows"
      ],
      in: "Conversational user query, time window, resource scope, caller permissions",
      out: "Evidence-backed textual and tabular answer with data citations and execution record",
      note: "Scribe must never trigger rightsizing analysis or forecast computations for simple factual questions; never executes changes."
    },
    {
      id: "nexus",
      sec: "13",
      name: "Nexus — Signal Engine",
      layer: "agt",
      status: "proto",
      mode: "mix",
      summary: "Signal collection & continuous signal engine: discovers resources, filters candidates, resolves schemas, collects telemetry, computes statistics, and tracks deltas.",
      actions: [
        "Step 1 — Discovers cloud resources across subscriptions via provider adapters",
        "Step 2 — Filters out fixed-cost, non-variable, or policy-excluded resources",
        "Step 3 — Resolves metric schemas via governed Resource Type Registry or cached definitions",
        "Step 4 — Collects required multi-dimensional telemetry (CPU, Memory, IOPS, Network)",
        "Step 5 — Invokes Statistical Engine to compute deterministic statistics (P95, P99, averages)",
        "Step 6 — Persists compact statistical signals into Signal Database",
        "Step 7 — Compares inventory with previous snapshot to compute state deltas",
        "Step 8 — Emits ScanCompleted event on Event Bus to trigger downstream watchers",
        "Prototype status: Demonstrates variable filtering, schema resolution, telemetry fetch, and parameter calculation."
      ],
      in: "Provider inventory, cloud metrics, Resource Type Registry schemas, schedule triggers",
      out: "Processed statistical signal records, inventory snapshots, state deltas, ScanCompleted event",
      note: "Continuous telemetry collection is performed in the background; statistics are strictly deterministic, not LLM-generated."
    },
    {
      id: "watcher",
      sec: "14",
      name: "Watcher — Change & Anomaly Agent",
      layer: "agt",
      status: "prop",
      mode: "mix",
      summary: "Change and anomaly detection agent: compares newly collected Nexus signals against historical baselines to detect noteworthy drift, cost spikes, and anomalies.",
      actions: [
        "Activates upon receipt of ScanCompleted events from Nexus",
        "Compares latest statistical parameters against rolling 14-day and 30-day baseline models",
        "Identifies noteworthy changes: sudden cost surges, utilization drop-offs, unexpected scale events",
        "Correlates infrastructure anomalies with recent deployment markers and configuration changes",
        "Filters out benign expected cyclical patterns using historical variance models",
        "Emits AnomalyDetected events and writes findings to the persistent record"
      ],
      in: "ScanCompleted event, latest Nexus signals, historical baselines from Signal DB",
      out: "Structured anomaly findings, severity assessments, AnomalyDetected events",
      note: "Watcher is scan-driven and consumes Nexus outputs; it does not collect raw telemetry independently."
    },
    {
      id: "plumb",
      sec: "15",
      name: "Plumb — Rightsizing & Safety Agent",
      layer: "agt",
      status: "proto",
      mode: "mix",
      summary: "Production-aware rightsizing agent: evaluates sizing opportunities while balancing financial savings, workload behavior, and operational risk.",
      actions: [
        "Step 1 — Receives execution request with target resource scope and analysis window",
        "Step 2 — Retrieves precomputed Nexus statistical signals from Signal DB",
        "Step 3 — Identifies candidate resources exhibiting persistent over-provisioning or under-provisioning",
        "Step 4 — Applies business policy exclusions, criticalities, and maintenance freeze rules",
        "Step 5 — Conducts targeted operational investigation via Production Safety Evaluation (JIT logs/KQL)",
        "Step 6 — Formulates candidate sizing options (downsize, upsize, no change, block, request evidence)",
        "Step 7 — Calculates exact financial savings using deterministic Pricing Engine",
        "Step 8 — Constructs standardized Recommendation Contract with explicit evidence and confidence",
        "Step 9 — Routes consequential recommendations to Human Approval Gateway",
        "Prototype status: Implements candidate identification, targeted log analysis, and compact report generation."
      ],
      in: "Resource scope, analysis window, Nexus statistical signals, business policy rules, operational logs",
      out: "Evidence-backed recommendation contract, pricing differential, risk score, confidence rating",
      note: "Blocking an unsafe change due to operational exception signals is considered a successful, high-value outcome."
    },
    {
      id: "augur",
      sec: "16",
      name: "Augur — Forecasting Agent",
      layer: "agt",
      status: "prop",
      mode: "mix",
      summary: "Forecasting agent: estimates future cloud spend trajectories and budget variance; numerical models perform forecasting, AI synthesizes explanatory context.",
      actions: [
        "Ingests historical spending signals, seasonal patterns, and growth trends from Signal DB",
        "Invokes deterministic Forecasting Engine to compute 30, 60, and 90-day spend projections",
        "Evaluates project budget burn rates and flags projected overruns ahead of time",
        "Applies contextual AI reasoning to formulate plain-language explanations of projected trends",
        "Identifies underlying cost drivers (e.g. organic data growth vs new service provisioning)",
        "Generates scenario-based forecasts incorporating planned architecture migrations"
      ],
      in: "Historical cost signals, budget targets, forecast horizons, planned migration markers",
      out: "Spend forecast models, confidence bands, budget variance alerts, narrative explanations",
      note: "Forecasting calculations are performed by numerical statistical engines; AI only frames scenarios and explains results."
    },
    {
      id: "apex",
      sec: "17",
      name: "Apex — Commitment Optimization Agent",
      layer: "agt",
      status: "prop",
      mode: "mix",
      summary: "Commitment and discount strategy agent: evaluates Reserved Instances and Savings Plans; AI frames scenarios, while a mathematical solver optimizes commitments.",
      actions: [
        "Analyzes stable baseline consumption curves across virtual machines, databases, and services",
        "Retrieves cloud provider discount schedules, commitment offerings, and cancellation terms",
        "Formulates optimization constraints (e.g. maximum payback period, regional risk limits)",
        "Invokes deterministic Optimization Solver to calculate optimal 1-year and 3-year commitment mixes",
        "Evaluates financial sensitivity against potential workload reduction or architecture changes",
        "Generates reviewable commitment recommendations with explicit break-even and risk metrics"
      ],
      in: "Historical usage baselines, provider discount catalogs, risk tolerance constraints",
      out: "Commitment purchase scenarios, break-even timelines, risk profiles, recommendation contracts",
      note: "Commitment decisions are risk-constrained; recommendations must never claim zero financial risk."
    },
    {
      id: "charta",
      sec: "18",
      name: "Charta — Cost Allocation & Governance",
      layer: "agt",
      status: "prop",
      mode: "mix",
      summary: "Cost allocation and governance agent: evaluates tag compliance, allocates shared platform costs, and generates auditable showback and chargeback models.",
      actions: [
        "Inspects resource metadata, tag schemas, and ownership labels via Tool Layer",
        "Evaluates tag compliance against rules defined in the Business Policy Registry",
        "Identifies untagged or orphaned cloud infrastructure and notifies resource owners",
        "Applies deterministic allocation rules to distribute shared platform costs (e.g. shared Kubernetes clusters)",
        "Generates departmental showback and chargeback reporting models with line-item traceability",
        "Identifies cost allocation anomalies where shared infrastructure growth is misattributed"
      ],
      in: "Resource tags, billing line items, allocation policies, organizational cost-center hierarchy",
      out: "Tag compliance audits, shared-cost allocation tables, chargeback reports, remediation alerts",
      note: "Charta applies approved deterministic business rules; it must never invent arbitrary allocation ratios."
    },
    {
      id: "triage",
      sec: "19",
      name: "Incident Triage — Optional Future Agent",
      layer: "agt",
      status: "future",
      mode: "ai",
      summary: "Optional future agent: investigates unhealthy or distressed workloads discovered during Plumb or Watcher scans and coordinates hand-off to SRE engineers.",
      actions: [
        "Triggered when Plumb or Watcher detects severe operational distress on candidate resources",
        "Gathers correlated telemetry, error logs, and recent deployment events for the affected service",
        "Synthesizes an operational incident brief summarizing timeline, symptom, and impacted resources",
        "Dispatches triage notification to engineering escalation channels (PagerDuty, Slack, Teams)",
        "Proposes non-intrusive diagnostic queries to assist on-call engineers with root cause analysis"
      ],
      in: "Distressed resource alerts from Plumb or Watcher, correlated logs, deployment markers",
      out: "Incident investigation brief, escalation alerts, recommended diagnostic paths"
    },

    // Layer 4: Deterministic Engines & Safety (eng)
    {
      id: "safety",
      sec: "4.7",
      name: "Production Safety Evaluation",
      layer: "eng",
      status: "proto",
      mode: "mix",
      summary: "Crucial operational safety gate: validates candidates against real SRE telemetry (exceptions, latency, memory saturation, throttling) before any change is actionable.",
      actions: [
        "Acts as an mandatory safety gate before any optimization recommendation can become actionable",
        "Conducts Just-In-Time (JIT) log analysis (e.g. Azure Log Analytics / KQL queries) for application exceptions",
        "Evaluates multi-dimensional capacity envelope: CPU, Memory, Latency, Error rates, Connection pools, Throttling",
        "Distinguishes benign low utilization from unhealthy failure states (e.g. crashing app, network partition)",
        "Flags operational red flags that immediately block downsizing to protect system reliability",
        "Prototype status: Demonstrates targeted KQL exception query and application safety signal evaluation."
      ],
      in: "Candidate resource identifiers, analysis time window, operational telemetry, log stores",
      out: "Safety verdict (Safe, Blocked, Review Required, Inconclusive), exception counts, risk metrics",
      note: "A failed log query must never be interpreted as evidence of zero errors; query health is tracked explicitly."
    },
    {
      id: "stat",
      sec: "28",
      name: "Statistical Engine",
      layer: "eng",
      status: "proto",
      mode: "det",
      summary: "Deterministic engine computing percentiles (P95, P99), rolling averages, peak values, and variance over time-series metrics.",
      actions: [
        "Computes robust statistical metrics across multi-interval time series: min, max, mean, median",
        "Calculates percentiles (P50, P90, P95, P99) to capture peak demand without outlier distortion",
        "Computes rolling variance, coefficient of variation, and workload volatility scores",
        "Detects statistical trend directionality (increasing, decreasing, cyclical, stationary)",
        "Prototype status: Used by Nexus to transform raw metrics into compact statistical parameters."
      ],
      in: "Raw time-series metric points from cloud provider APIs",
      out: "Structured statistical parameter records (P95 CPU, peak memory, traffic variance)",
      note: "Raw high-frequency time series are never fed directly to an LLM; only compact statistics are consumed."
    },
    {
      id: "price",
      sec: "27",
      name: "Pricing & Savings Engine",
      layer: "eng",
      status: "proto",
      mode: "det",
      summary: "Deterministic pricing engine: maps current and candidate SKU configurations to provider price sheets, regional rates, and currency tables to calculate exact savings.",
      actions: [
        "Maintains updated rate cards and pricing APIs across cloud providers and geographical regions",
        "Maps current resource SKU and proposed target SKU to exact hourly and monthly costs",
        "Calculates deterministic cost differentials: monthly savings, annual savings, percentage reductions",
        "Incorporates customer enterprise agreement discounts, active reservations, and currency conversion",
        "Prototype status: Provides verifiable, deterministic savings calculations for Plumb reports."
      ],
      in: "Current SKU, proposed target SKU, region, operating system, licensing, discount profile",
      out: "Exact price breakdown, monthly savings estimate, annual projected savings, pricing provenance",
      note: "Financial math is strictly deterministic; generative LLMs are never used as financial calculators."
    },
    {
      id: "fc",
      sec: "28",
      name: "Forecasting Engine",
      layer: "eng",
      status: "prop",
      mode: "det",
      summary: "Numerical time-series forecasting engine implementing statistical algorithms (Holt-Winters, seasonal ARIMA, polynomial regression) for Augur.",
      actions: [
        "Applies statistical time-series forecasting models to historical cost and utilization sequences",
        "Identifies and isolates weekly, monthly, and quarterly seasonality patterns",
        "Computes upper and lower prediction confidence intervals around forecast trajectories",
        "Calculates projected budget exhaustion dates based on current run rates",
        "Exports deterministic forecasting arrays consumed and explained by Augur"
      ],
      in: "Historical daily/weekly spending series, forecast horizon (30d, 60d, 90d), confidence parameters",
      out: "Predicted spending curve, confidence boundary arrays, projected budget variance metrics"
    },
    {
      id: "solver",
      sec: "28",
      name: "Optimization Solver",
      layer: "eng",
      status: "prop",
      mode: "det",
      summary: "Mathematical constraint-based optimization solver (linear programming / mixed-integer solver) calculating optimal commitment portfolios for Apex.",
      actions: [
        "Constructs mathematical optimization problem modeling multi-year cloud commitment options",
        "Incorporates multi-dimensional constraints: budget limits, regional commitments, flexibility tiers",
        "Solves for maximum net financial savings while minimizing underutilization risk",
        "Performs sensitivity analysis evaluating portfolio performance under varying demand scenarios",
        "Outputs optimal commitment purchasing mix with break-even curves and risk boundaries"
      ],
      in: "Consumption baseline profiles, provider discount offerings, risk limits, budget constraints",
      out: "Optimal commitment portfolio allocation, sensitivity matrix, deterministic savings projections"
    },
    {
      id: "diff",
      sec: "28",
      name: "Diff & Validation Engines",
      layer: "eng",
      status: "prop",
      mode: "det",
      summary: "Deterministic validation engine: verifies inventory changes between snapshots, checks policy rules, and validates structured recommendation schemas.",
      actions: [
        "Calculates exact structural diffs between point-in-time topology snapshots",
        "Identifies created, deleted, modified, reconfigured, or moved cloud resources",
        "Validates candidate recommendations against JSON schemas and type constraints",
        "Verifies that proposed changes do not violate hard business policy constraints",
        "Ensures all required fields (evidence, confidence, risk, impact) are present and valid"
      ],
      in: "Topology snapshots, proposed configuration payloads, policy constraint models",
      out: "Structured inventory delta tables, validation pass/fail reports, schema error diagnostics"
    },
    {
      id: "rtr",
      sec: "20",
      name: "Resource Type Registry (RTR)",
      layer: "eng",
      status: "proto",
      mode: "det",
      summary: "Governed catalogue of resource types and metric schemas. AI can propose schemas for unfamiliar resources, but proposals are validated before promotion.",
      actions: [
        "Maintains governed repository of supported resource types across cloud providers",
        "Defines required primary metrics (e.g. CPU, Memory) and operational metrics per resource",
        "Stores collection methods, aggregation rules, and unit normalizations for each metric",
        "Enables AI to propose metric schemas for newly discovered or custom cloud services",
        "Enforces review and validation gate before promoting proposed schemas into active registry",
        "Prototype status: Resolves and caches metric schemas during the rightsizing scan."
      ],
      in: "Resource type identifiers, schema query requests, AI-proposed schema definitions",
      out: "Validated metric collection schemas, aggregation parameters, registry governance records",
      note: "Governed schemas prevent hallucinated or incorrect metrics from corrupting optimization decisions."
    },

    // Layer 5: Data & Historical Intelligence (dat)
    {
      id: "sigdb",
      sec: "21",
      name: "Signal Database",
      layer: "dat",
      status: "prop",
      mode: "infra",
      summary: "High-performance time-series data store for processed statistical signals, parameters, metadata, and quality provenance; shared by all domain agents.",
      actions: [
        "Persists compact, multi-interval statistical parameter tables computed by Nexus",
        "Maintains data provenance, quality indicators, and freshness timestamps for all metrics",
        "Provides optimized query paths for downstream agents (Plumb, Watcher, Scribe, Augur, Apex)",
        "Tracks missing intervals and data collection gaps explicitly rather than interpolating blindly",
        "Implements partitioning and indexing strategies optimized for analytical queries"
      ],
      in: "Processed statistical signal records from Nexus, snapshot metadata, quality flags",
      out: "Fast historical signal lookups, parameter slices, and time-series summaries served to agents"
    },
    {
      id: "raw",
      sec: "22",
      name: "Raw Observation Store",
      layer: "dat",
      status: "prop",
      mode: "infra",
      summary: "Short-term storage for granular, high-frequency raw telemetry and observation points, retained temporarily before statistical roll-up.",
      actions: [
        "Ingests high-fidelity, short-term raw telemetry observations collected during scans",
        "Maintains granular diagnostic records needed for deep-dive investigation of anomalous candidates",
        "Tracks failed, missing, or throttled metric collection intervals",
        "Enforces short retention windows (e.g. 7 to 14 days) to prevent storage bloat",
        "Supplies raw data points to the Roll-up & Retention Manager before scheduled expiry"
      ],
      in: "Raw high-frequency metric points from provider adapters, collection diagnostics",
      out: "Raw observation batches served to Roll-up Manager and diagnostic investigations",
      note: "Open architectural decision: determining whether storing raw points is necessary or interval statistics suffice."
    },
    {
      id: "snap",
      sec: "24",
      name: "Snapshot & Delta Engine",
      layer: "dat",
      status: "prop",
      mode: "det",
      summary: "Captures point-in-time infrastructure topology snapshots and computes precise inventory deltas (created, deleted, resized, reconfigured).",
      actions: [
        "Records complete point-in-time snapshots of cloud resource inventory and configuration",
        "Maintains relationship graphs between resources (e.g. VMs, disks, NICs, subnets, databases)",
        "Invokes Diff Engine to compute state differences between consecutive scan snapshots",
        "Identifies drift: resized instances, configuration changes, newly spun-up workloads",
        "Stores immutable snapshot references linked to specific scan run IDs"
      ],
      in: "Discovered resource inventories from Nexus, previous snapshot baseline records",
      out: "Point-in-time topology snapshots, inventory change deltas, configuration drift reports"
    },
    {
      id: "roll",
      sec: "23",
      name: "Roll-up & Retention Manager",
      layer: "dat",
      status: "prop",
      mode: "det",
      summary: "Manages data lifecycle: compacts detailed short-term observations into long-term statistical summaries and guarantees persistence before pruning.",
      actions: [
        "Executes scheduled roll-up jobs transforming detailed intervals into long-term statistical trends",
        "Compresses high-frequency metrics into daily and weekly percentiles and variance profiles",
        "Verifies successful creation and persistence of long-term summaries before purging raw data",
        "Enforces retention policies: e.g. 14 days raw, 45 days high-fidelity signals, 365 days rolled-up trends",
        "Logs data retention operations to maintain compliance and audit requirements"
      ],
      in: "Raw observations from Raw Store, detailed signals from Signal DB, retention schedules",
      out: "Rolled-up long-term trend tables, data purge confirmations, storage volume metrics",
      note: "Target design: approx. 40 days detailed signals, 1+ year rolled-up patterns; scans every 4 hours."
    },
    {
      id: "graph",
      sec: "25",
      name: "Historical Knowledge & Graph RAG",
      layer: "dat",
      status: "prop",
      mode: "mix",
      summary: "Contextual knowledge store maintaining relationship graphs, historical decisions, workload patterns, and semantic memory with temporal validity.",
      actions: [
        "Maintains property graph representing cloud resource topology, dependencies, and ownership",
        "Stores historical decision context: previous rightsizing actions, outcomes, and rationales",
        "Attaches temporal timestamps and validity windows to all stored knowledge items",
        "Flags stale operational patterns and outdated assumptions during contextual retrieval",
        "Supplies Graph RAG context to Scribe and Plumb to inform current decisions"
      ],
      in: "Topology snapshots, decision records, outcome histories, organizational metadata",
      out: "Contextual relationship subgraphs, historical precedent records, semantic knowledge blocks",
      note: "Historical behavior is treated as contextual evidence, never as unquestioned permanent truth."
    },
    {
      id: "policy",
      sec: "26",
      name: "Business Policy Registry",
      layer: "dat",
      status: "prop",
      mode: "det",
      summary: "Governed, versioned registry of organizational policies: exclusions, criticality tiers, freeze periods, budget limits, and approval mandates.",
      actions: [
        "Maintains versioned business rules and constraints governing optimization eligibility",
        "Records resource exclusion lists (e.g. dedicated benchmark hosts, disaster recovery instances)",
        "Stores environment criticality ratings (Production, Staging, QA, Development)",
        "Defines organizational freeze periods (e.g. Black Friday, end-of-quarter change freezes)",
        "Specifies mandatory approval thresholds (e.g. changes > $500/mo require director sign-off)",
        "Enforces strict versioning; the LLM can never silently modify or override policy rules"
      ],
      in: "Policy definitions, governance rules, exclusion lists, approval tier configurations",
      out: "Active policy constraints served to Plumb, Apex, Charta, and Orchestrator",
      note: "Policies are deterministic, versioned, and owned by humans; AI reasoning cannot alter policy."
    },

    // Layer 6: Results & Execution Controls (res)
    {
      id: "rec",
      sec: "32",
      name: "Recommendation Contract & Reports",
      layer: "res",
      status: "prop",
      mode: "det",
      summary: "Standardized contract for optimization findings: pairs recommended action with structured evidence, algorithmic confidence, operational risk, and estimated savings.",
      actions: [
        "Formats all agent optimization findings into a standardized, machine-readable JSON contract",
        "Structures recommendation payload: Target Resource, Current SKU, Proposed SKU, Action Type",
        "Attaches explicit evidence blocks: P95 utilization, peak metrics, log analysis findings",
        "Calculates and embeds quantitative confidence rating and operational risk classification",
        "Calculates and embeds deterministic financial impact: monthly savings, annual savings, ROI",
        "Includes complete data freshness timestamps and provenance tracking",
        "Prototype status: Emits compact scan reports with SKU recommendations, evidence, and savings."
      ],
      in: "Candidate findings from Plumb, Augur, Apex, Charta; pricing from Pricing Engine",
      out: "Standardized Recommendation Contract payloads routed to Dashboard, Notification, and Approval Gateway",
      note: "Confidence must derive from a defined algorithmic method, not an arbitrary number invented by an LLM."
    },
    {
      id: "appr",
      sec: "33",
      name: "Human Approval Gateway",
      layer: "res",
      status: "prop",
      mode: "det",
      summary: "Mandatory control gateway where human reviewers inspect evidence, confidence, risk, and impact before consequential changes proceed.",
      actions: [
        "Renders complete recommendation contract, supporting evidence, and risk analysis to reviewers",
        "Enforces organizational separation of duties (engineers cannot approve their own changes)",
        "Captures reviewer decision: Approved, Rejected, Modification Requested, Snoozed",
        "Records mandatory reviewer rationale and timestamp into immutable audit history",
        "Gates downstream GitOps remediation or automated change execution",
        "Provides reusable approval workflows for Plumb rightsizing, Apex commitments, and IaC PRs"
      ],
      in: "Recommendation Contract payloads requiring human review, reviewer credentials",
      out: "Signed approval records, rejection rationales, authorized execution events"
    },
    {
      id: "iac",
      sec: "34",
      name: "Remediation & IaC (GitOps)",
      layer: "res",
      status: "future",
      mode: "mix",
      summary: "Future GitOps remediation engine: translates approved recommendations into Infrastructure-as-Code pull requests (Terraform, Bicep) with automated diffs.",
      actions: [
        "Locates corresponding Infrastructure-as-Code repository and file for the approved resource",
        "Generates clean code modification (Terraform resource parameter update, Bicep config diff)",
        "Executes syntax validation, linter checks, and plan generation on the proposed change",
        "Opens reviewable Pull Request on customer Git platform (GitHub, GitLab, Azure DevOps)",
        "Includes full evidence trail, approval signature, and rollback instructions in PR description",
        "Observes PR review, merge, and deployment pipeline execution"
      ],
      in: "Approved recommendation event from Human Approval Gateway, target IaC repository configuration",
      out: "Git Pull Request, automated code diff, CI/CD validation results, deployment status events",
      note: "Read-only inspection, branch creation, and code applying require strictly separated permissions."
    },
    {
      id: "audit",
      sec: "35",
      name: "Outcome Auditor & Decision History",
      layer: "res",
      status: "prop",
      mode: "det",
      summary: "Measures what happened after decisions: tracks acceptance rates, compares predicted vs realized savings, monitors reliability impacts, and calibrates confidence.",
      actions: [
        "Step 1 — Retrieves original recommendation, predicted savings, and confidence score",
        "Step 2 — Tracks decision lifecycle: Accepted, Rejected, Implemented, Ignored, Rolled back",
        "Step 3 — Collects post-implementation cloud billing invoices to compute actual realized savings",
        "Step 4 — Monitors post-change operational telemetry to detect any reliability degradation or errors",
        "Step 5 — Compares predicted savings against realized savings to evaluate pricing accuracy",
        "Step 6 — Calibrates confidence models over time based on historical decision correctness",
        "Step 7 — Maintains immutable, auditable record of all decisions, rationale, and verified outcomes"
      ],
      in: "Original recommendation contracts, human approval records, post-change telemetry, billing invoices",
      out: "Realized savings reports, prediction accuracy metrics, confidence calibration parameters, audit logs",
      note: "Distinguishes between Potential, Approved, Implemented, and Realized savings; never claims 100% realization."
    },
    {
      id: "notify",
      sec: "5.1",
      name: "Notification Dispatcher",
      layer: "res",
      status: "prop",
      mode: "det",
      summary: "Formats and dispatches structured reports, alerts, and approval requests to configured communication channels; guarantees message delivery tracking.",
      actions: [
        "Receives reports, alerts, approval requests, and execution events from platform components",
        "Determines event priority, classification, and intended recipient teams",
        "Selects configured delivery channels (Slack, Microsoft Teams, Google Chat, Email)",
        "Transforms recommendations into channel-optimized interactive message cards",
        "Tracks delivery status, handles retry backoff, and ensures messages are not silently dropped"
      ],
      in: "Recommendation contracts, scan reports, anomaly alerts, approval requests",
      out: "Dispatched messages across external communication channels, delivery receipt logs"
    },

    // Layer 7: Tools & Integrations (int)
    {
      id: "tools",
      sec: "6",
      name: "Centralized Tool Layer",
      layer: "int",
      status: "proto",
      mode: "det",
      summary: "Centralized execution layer providing validated, permissioned, rate-limited, and audited access to cloud APIs, logs, pricing, and notification tools.",
      actions: [
        "Provides standardized abstraction for all infrastructure and operational tool calls",
        "Enforces strict input validation and type checking before executing any tool command",
        "Verifies tenant scope and caller permissions prior to dispatching external API calls",
        "Applies rate limiting, exponential backoff, and caching to protect cloud provider API quotas",
        "Emits comprehensive execution audit logs for every invoked tool call",
        "Prototype status: Centralizes cloud resource filtering, metric retrieval, and KQL log queries."
      ],
      in: "Tool invocation requests from agents and orchestrator",
      out: "Validated tool execution outputs, provider responses, telemetry datasets, execution logs"
    },
    {
      id: "preg",
      sec: "4.1",
      name: "Provider Registry",
      layer: "int",
      status: "prop",
      mode: "det",
      summary: "Maintains catalogue of supported cloud providers, capabilities, API endpoints, authentication mechanisms, and per-tenant connection health.",
      actions: [
        "Maintains catalog of supported cloud providers (Azure, AWS, GCP, Oracle Cloud)",
        "Tracks supported capability matrix per provider (e.g. inventory discovery, metric telemetry, cost APIs)",
        "Manages per-tenant provider connection status and credential health checks",
        "Routes generalized tool requests to provider-specific adapter implementations",
        "Gracefully signals unsupported capabilities rather than faking uniform provider behaviors"
      ],
      in: "Provider queries, connection registration requests, capability lookups",
      out: "Provider adapter routing, capability flags, connection health status records"
    },
    {
      id: "azure",
      sec: "4.2",
      name: "Azure Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Provider adapter for Microsoft Azure: Azure Resource Graph (inventory), Monitor (telemetry), Cost Management (billing), and Log Analytics / KQL (SRE logs).",
      actions: [
        "Executes Azure Resource Graph KQL queries for high-speed multi-subscription inventory discovery",
        "Retrieves multi-dimensional metric time series via Azure Monitor Metrics API",
        "Ingests detailed billing and amortized cost data via Azure Cost Management API",
        "Performs targeted KQL exception and error log queries via Azure Log Analytics / Application Insights",
        "Prototype status: Prototype is Azure-focused, demonstrating VM discovery, metrics, and KQL analysis."
      ],
      in: "Azure API requests from Tool Layer, tenant Azure credentials",
      out: "Normalized Azure resource schemas, metric streams, cost records, log query results"
    },
    {
      id: "aws",
      sec: "4.3",
      name: "AWS Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Provider adapter for Amazon Web Services: Resource Groups Tagging API, CloudWatch (metrics/logs), and Cost and Usage Report (CUR).",
      actions: [
        "Discovers AWS resources across accounts and regions via Resource Groups Tagging API",
        "Pulls utilization and saturation metrics via AWS CloudWatch Metrics API",
        "Ingests detailed billing records via AWS Cost and Usage Reports (CUR) and Cost Explorer",
        "Retrieves application and system logs via AWS CloudWatch Logs Insights",
        "Normalizes AWS EC2 instance families, EBS volumes, and RDS databases to platform schema"
      ],
      in: "AWS API requests from Tool Layer, IAM role credentials",
      out: "Normalized AWS resource models, CloudWatch telemetry, CUR line items, log records"
    },
    {
      id: "gcp",
      sec: "4.4",
      name: "GCP Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Provider adapter for Google Cloud Platform: Cloud Asset Inventory, Cloud Monitoring, Cloud Logging, and BigQuery billing exports.",
      actions: [
        "Discovers GCP resources across projects and folders via Cloud Asset Inventory API",
        "Retrieves multi-dimensional time series via Google Cloud Monitoring (Stackdriver) API",
        "Ingests cloud billing exports via BigQuery billing export datasets",
        "Queries application exceptions and latency events via Google Cloud Logging API",
        "Normalizes Compute Engine instances, Persistent Disks, and Cloud SQL to platform models"
      ],
      in: "GCP API requests from Tool Layer, service account credentials",
      out: "Normalized GCP resource objects, Monitoring time series, billing lines, log records"
    },
    {
      id: "oci",
      sec: "4.5",
      name: "Oracle Cloud Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Provider adapter for Oracle Cloud Infrastructure (OCI): Search Service, Monitoring Service, and Usage Cost Reports.",
      actions: [
        "Discovers OCI compute instances, block volumes, and autonomous databases across compartments",
        "Retrieves compute and storage telemetry via OCI Monitoring Service",
        "Pulls usage reports and cost data via OCI Usage API",
        "Normalizes OCI shapes and resource compartments into platform unified models"
      ],
      in: "OCI API requests from Tool Layer, OCI API signing credentials",
      out: "Normalized OCI resource data, monitoring metrics, and billing lines"
    },
    {
      id: "newp",
      sec: "4.6",
      name: "Future Provider Adapter",
      layer: "int",
      status: "future",
      mode: "infra",
      summary: "Extensibility contract for future cloud and specialized infrastructure providers (e.g. Databricks, Snowflake, Kubernetes clusters).",
      actions: [
        "Defines standard interface contract for onboarding new infrastructure providers",
        "Declares supported capabilities: inventory discovery, metrics, pricing, logging, modification",
        "Reports unavailable capabilities explicitly without faking functionality"
      ],
      in: "Standardized provider interface calls",
      out: "Provider-specific API mapping and response normalization"
    },
    {
      id: "slack",
      sec: "5.2",
      name: "Slack Channel Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Channel adapter for Slack: delivers interactive Block Kit message cards for scan summaries, anomaly alerts, and one-click approval notifications.",
      actions: [
        "Formats recommendation summaries into interactive Slack Block Kit cards",
        "Posts high-priority anomaly alerts to designated engineering and FinOps channels",
        "Renders interactive approval buttons for designated approvers directly within Slack",
        "Routes interactive button clicks back to Human Approval Gateway via signed webhooks"
      ],
      in: "Formatted notification payloads from Notification Dispatcher",
      out: "Dispatched Slack messages, interactive action webhooks"
    },
    {
      id: "gchat",
      sec: "5.2",
      name: "Google Chat Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Channel adapter for Google Chat: delivers structured Card v2 messages and interactive optimization notices to Google Workspace spaces.",
      actions: [
        "Renders recommendation summaries and scan reports into Google Chat Card v2 formats",
        "Delivers structured alerts and trend summaries to project spaces",
        "Supports interactive action buttons for review workflows in Google Workspace"
      ],
      in: "Notification payloads from Notification Dispatcher",
      out: "Delivered Google Chat card messages"
    },
    {
      id: "teams",
      sec: "5.2",
      name: "Microsoft Teams Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Channel adapter for Microsoft Teams: delivers Adaptive Cards with rich evidence breakdowns and approval buttons to Microsoft 365 channels.",
      actions: [
        "Renders recommendation contracts into Microsoft Adaptive Cards format",
        "Posts structured scan results and anomaly alerts to Teams channels",
        "Enables interactive approval and rejection workflows directly within Teams client"
      ],
      in: "Notification payloads from Notification Dispatcher",
      out: "Delivered Microsoft Teams Adaptive Cards"
    },
    {
      id: "mail",
      sec: "5.2",
      name: "Email / Outlook Adapter",
      layer: "int",
      status: "prop",
      mode: "infra",
      summary: "Channel adapter for Email / Microsoft Outlook: delivers responsive HTML digest reports, executive summaries, and actionable Outlook cards.",
      actions: [
        "Generates responsive HTML email digests for weekly executive cloud spend summaries",
        "Dispatches detailed scan report notifications with CSV attachment links",
        "Supports Actionable Messages for Microsoft Outlook reviewers"
      ],
      in: "Digest payloads and alert summaries from Notification Dispatcher",
      out: "Sent email messages via SMTP / Microsoft Graph API"
    },
    {
      id: "newc",
      sec: "5.2",
      name: "Future Channel Adapter",
      layer: "int",
      status: "future",
      mode: "infra",
      summary: "Extensibility contract for enterprise ticketing and incident systems (Jira, ServiceNow, PagerDuty).",
      actions: [
        "Defines interface for creating and updating tickets in enterprise workflow management tools",
        "Maps recommendation contracts to Jira tickets or ServiceNow change requests"
      ],
      in: "Standardized ticketing requests from Notification Dispatcher",
      out: "Ticket IDs, workflow links, status synchronizations"
    },

    // Layer 8: Cross-Cutting Capabilities (xc)
    {
      id: "obs",
      sec: "37",
      name: "Observability & Tracing",
      layer: "xc",
      status: "prop",
      mode: "infra",
      summary: "System observability: distributed tracing, tool invocation timings, model token usage, prompt versioning, and latency tracking (e.g. LangFuse candidate).",
      actions: [
        "Captures distributed execution traces across Orchestrator, Agents, and Tool Layer",
        "Records granular LLM analytics: prompt versions, input/output tokens, latency, cost",
        "Monitors execution duration and success/failure rates for every tool and database call",
        "Provides real-time dashboards tracking platform health and operational bottlenecks"
      ],
      in: "Telemetry events, trace spans, and token counters emitted by platform processes",
      out: "Distributed traces, performance dashboards, cost-per-execution metrics"
    },
    {
      id: "sec",
      sec: "38",
      name: "Security & Compliance",
      layer: "xc",
      status: "prop",
      mode: "infra",
      summary: "Cross-cutting security: least privilege, strict tenant separation, encryption at rest and in transit, credential isolation, and tamper-proof audit trails.",
      actions: [
        "Enforces least-privilege cloud authorization boundaries across all operations",
        "Guarantees hardware and database tenant data isolation across all storage tiers",
        "Encrypts all data in transit (TLS 1.3) and at rest (AES-256) with customer-managed key support",
        "Maintains tamper-proof, append-only security logs for compliance and audit requirements"
      ],
      in: "Security policy definitions, compliance standards, cryptographic keys",
      out: "Enforced security boundaries, encrypted data streams, immutable compliance logs"
    },
    {
      id: "rel",
      sec: "39",
      name: "Reliability & Recovery",
      layer: "xc",
      status: "prop",
      mode: "infra",
      summary: "Resilience engineering: API timeouts, exponential backoff, checkpoint recovery, idempotency keys, and explicit handling of partial query failures.",
      actions: [
        "Applies exponential backoff and jitter to external cloud provider API calls",
        "Enforces circuit breakers on downstream dependencies to prevent cascade failures",
        "Ensures idempotency across all workflow executions to support safe retries",
        "Strictly separates 'zero errors reported' from 'query failed' in operational analysis"
      ],
      in: "Transient network failures, API error responses, recovery checkpoints",
      out: "Resilient workflow retries, failover executions, incident alerts"
    },
    {
      id: "qa",
      sec: "40",
      name: "Evaluation & QA",
      layer: "xc",
      status: "prop",
      mode: "infra",
      summary: "Automated test suites: unit verification of pricing and statistical math, adapter contract tests, policy enforcement tests, and confidence calibration.",
      actions: [
        "Executes deterministic unit test suites for pricing and statistical algorithms",
        "Runs contract compliance tests against multi-cloud provider adapters",
        "Validates policy boundary enforcement and tenant isolation guarantees",
        "Calibrates recommendation confidence algorithms against known benchmark datasets"
      ],
      in: "Test scenarios, synthetic telemetry datasets, calibration benchmarks",
      out: "QA test reports, algorithm precision ratings, regression alerts"
    },
    {
      id: "cicd",
      sec: "42",
      name: "Deployment & CI/CD",
      layer: "xc",
      status: "prop",
      mode: "infra",
      summary: "Platform deployment lifecycle: build, test, and release pipelines for the platform itself, strictly separated from customer cloud infrastructure changes.",
      actions: [
        "Builds, tests, and packages platform containers and serverless components",
        "Executes automated security vulnerability and dependency scans in build pipeline",
        "Manages blue-green and canary deployments of platform services",
        "Maintains clear separation between platform software releases and customer infrastructure changes"
      ],
      in: "Platform source code, configuration manifests, build triggers",
      out: "Deployed platform services, release artifacts, deployment audit logs"
    }
  ],

  edges: [
    // UI to Control Plane
    { from: "cmd", to: "plan", type: "sync", label: "user intent / manual config" },
    { from: "plan", to: "orch", type: "sync", label: "validated execution plan" },
    { from: "trig", to: "orch", type: "sync", label: "execution trigger record" },
    { from: "orch", to: "state", type: "data", label: "step status & checkpoints" },
    { from: "bus", to: "trig", type: "async", label: "workflow events" },
    { from: "mcp", to: "tools", type: "sync", label: "governed MCP requests" },

    // Orchestrator to Domain Agents
    { from: "orch", to: "scribe", type: "sync", label: "informational query" },
    { from: "orch", to: "nexus", type: "sync", label: "scan trigger" },
    { from: "orch", to: "plumb", type: "sync", label: "rightsizing analysis" },
    { from: "orch", to: "augur", type: "sync", label: "forecast request" },
    { from: "orch", to: "apex", type: "sync", label: "commitment scenario" },
    { from: "orch", to: "charta", type: "sync", label: "cost allocation run" },

    // Nexus Signal Engine Pipeline
    { from: "nexus", to: "rtr", type: "data", label: "resolve metric schemas" },
    { from: "nexus", to: "stat", type: "sync", label: "compute parameters" },
    { from: "nexus", to: "sigdb", type: "data", label: "persist statistical signals" },
    { from: "nexus", to: "raw", type: "data", label: "store raw observations" },
    { from: "nexus", to: "snap", type: "sync", label: "record topology state" },
    { from: "snap", to: "diff", type: "sync", label: "compare inventory deltas" },
    { from: "raw", to: "roll", type: "data", label: "expiring raw points" },
    { from: "roll", to: "graph", type: "data", label: "long-term summaries" },
    { from: "sigdb", to: "graph", type: "data", label: "historical patterns" },

    // Nexus to Watcher
    { from: "nexus", to: "watcher", type: "async", label: "ScanCompleted event" },
    { from: "sigdb", to: "watcher", type: "data", label: "latest signals vs baseline" },
    { from: "watcher", to: "bus", type: "async", label: "AnomalyDetected event" },

    // Scribe Data Access
    { from: "sigdb", to: "scribe", type: "data", label: "stored statistical signals" },
    { from: "snap", to: "scribe", type: "data", label: "inventory state & changes" },
    { from: "graph", to: "scribe", type: "data", label: "contextual graph knowledge" },

    // Plumb Rightsizing Pipeline
    { from: "sigdb", to: "plumb", type: "data", label: "synthesized signal tables" },
    { from: "policy", to: "plumb", type: "data", label: "exclusions & criticalities" },
    { from: "plumb", to: "safety", type: "sync", label: "evaluate candidate safety" },
    { from: "safety", to: "tools", type: "sync", label: "JIT log & metric queries" },
    { from: "plumb", to: "price", type: "sync", label: "calculate savings diff" },

    // Augur, Apex, Charta Pipelines
    { from: "sigdb", to: "augur", type: "data", label: "historical spend curves" },
    { from: "augur", to: "fc", type: "sync", label: "numerical forecast compute" },
    { from: "sigdb", to: "apex", type: "data", label: "usage baseline curves" },
    { from: "apex", to: "solver", type: "sync", label: "constraint optimization" },
    { from: "policy", to: "apex", type: "data", label: "commitment constraints" },
    { from: "charta", to: "tools", type: "sync", label: "retrieve tags & metadata" },
    { from: "policy", to: "charta", type: "data", label: "allocation & tag rules" },

    // Agents to Recommendation Contract
    { from: "plumb", to: "rec", type: "data", label: "rightsizing recommendation" },
    { from: "augur", to: "rec", type: "data", label: "forecast model report" },
    { from: "apex", to: "rec", type: "data", label: "commitment scenario proposal" },
    { from: "charta", to: "rec", type: "data", label: "allocation audit report" },
    { from: "watcher", to: "rec", type: "data", label: "anomaly detection findings" },
    { from: "scribe", to: "rec", type: "data", label: "synthesized query response" },

    // Results, Approvals, GitOps & Outcome Audit
    { from: "rec", to: "dash", type: "data", label: "publish scan results" },
    { from: "rec", to: "notify", type: "async", label: "dispatch report alerts" },
    { from: "rec", to: "appr", type: "approval", label: "requires human review" },
    { from: "appr", to: "iac", type: "approval", label: "approved action payload" },
    { from: "iac", to: "audit", type: "async", label: "post-change state & PR link" },
    { from: "appr", to: "audit", type: "data", label: "human decision & rationale" },
    { from: "rec", to: "audit", type: "data", label: "predicted savings & confidence" },

    // Notifications to External Channels
    { from: "notify", to: "slack", type: "async", label: "interactive cards & alerts" },
    { from: "notify", to: "gchat", type: "async", label: "card messages" },
    { from: "notify", to: "teams", type: "async", label: "adaptive cards & approvals" },
    { from: "notify", to: "mail", type: "async", label: "email digest reports" },
    { from: "notify", to: "newc", type: "future", label: "incident / ticket events" },

    // Tool Layer to Cloud Adapters
    { from: "nexus", to: "tools", type: "sync", label: "raw provider API calls" },
    { from: "tools", to: "preg", type: "sync", label: "route by cloud provider" },
    { from: "preg", to: "azure", type: "sync", label: "Azure API adapter" },
    { from: "preg", to: "aws", type: "sync", label: "AWS API adapter" },
    { from: "preg", to: "gcp", type: "sync", label: "GCP API adapter" },
    { from: "preg", to: "oci", type: "sync", label: "OCI API adapter" },
    { from: "preg", to: "newp", type: "future", label: "future provider adapter" },

    // Governance & Control Cross-Links
    { from: "auth", to: "tools", type: "sync", label: "permission & token check" },
    { from: "tenant", to: "tools", type: "sync", label: "tenant scope boundary" },
    { from: "cfg", to: "orch", type: "data", label: "customer settings & cadence" },
    { from: "dash", to: "sigdb", type: "data", label: "historical query reads" },

    // Pricing to Recommendation Contract Flow
    { from: "price", to: "rec", type: "data", label: "calculated savings & rate diff" },

    // Diagnostic Incident Triage (Optional Future Agent)
    { from: "plumb", to: "triage", type: "future", label: "diagnostic handoff on unhealthy workload" },
    { from: "watcher", to: "triage", type: "future", label: "anomalous drift escalation" },
    { from: "triage", to: "rec", type: "future", label: "diagnostic investigation report" },

    // Cross-Cutting Platform Operations: Observability & Tracing
    { from: "orch", to: "obs", type: "data", label: "execution traces & LLM run metrics" },
    { from: "tools", to: "obs", type: "data", label: "provider API latencies & errors" },

    // Cross-Cutting Platform Operations: Security & Compliance
    { from: "sec", to: "auth", type: "sync", label: "token validation & credential policies" },
    { from: "sec", to: "tenant", type: "sync", label: "tenant workspace isolation rules" },
    { from: "appr", to: "sec", type: "data", label: "approval compliance verification" },

    // Cross-Cutting Platform Operations: Reliability & Recovery
    { from: "rel", to: "orch", type: "sync", label: "checkpointing & retry policies" },
    { from: "rel", to: "tools", type: "sync", label: "rate limits & circuit breakers" },

    // Cross-Cutting Platform Operations: Evaluation & QA
    { from: "qa", to: "stat", type: "sync", label: "verify statistical formulas" },
    { from: "qa", to: "price", type: "sync", label: "validate pricing calculations" },
    { from: "qa", to: "rec", type: "data", label: "evaluates recommendation schemas" },

    // Cross-Cutting Platform Operations: Deployment & CI/CD
    { from: "cicd", to: "orch", type: "sync", label: "service version deployment" },
    { from: "cicd", to: "tools", type: "sync", label: "adapter release & packaging" }
  ],

  workflows: [
    {
      id: "wa",
      name: "Workflow A: Ask Scribe a Question",
      gate: null,
      steps: ["cmd", "plan", "orch", "scribe", "rec", "dash"],
      also: ["sigdb", "tools"],
      note: "User asks a conversational cost or inventory question. Scribe parses scope, retrieves pre-existing signals or makes minimal tool queries, formats structured evidence, and returns an auditable answer without running expensive rightsizing or forecasting pipelines."
    },
    {
      id: "wb",
      name: "Workflow B: Scheduled Nexus + Watcher Run",
      gate: null,
      steps: ["trig", "orch", "nexus", "watcher", "rec", "notify"],
      also: ["stat", "sigdb", "snap", "bus"],
      note: "Continuous background signal cycle. Trigger Manager runs Nexus every 4 hours to discover resources, resolve schemas, collect telemetry, compute statistics deterministically, update topology snapshots, and trigger Watcher to identify drift and anomalies against rolling baselines."
    },
    {
      id: "wc",
      name: "Workflow C: Plumb Rightsizing Analysis",
      gate: "appr",
      steps: ["cmd", "plan", "orch", "plumb", "price", "rec", "appr", "iac", "audit"],
      also: ["sigdb", "policy", "safety"],
      note: "Production-aware rightsizing. Plumb evaluates candidates against precomputed signals and business policy, invokes Production Safety Evaluation to inspect JIT application logs, prices savings deterministically, passes through Human Approval Gateway, opens an IaC PR, and audits post-change realized savings."
    }
  ],

  // 9-Stage Decision Lifecycle (Central Product Anchor)
  lifecycleStages: [
    {
      id: "signal",
      num: 1,
      title: "Signal",
      question: "What is happening in the environment?",
      desc: "Multi-dimensional infrastructure telemetry, resource inventory, billing line items, and operational health metrics collected continuously in the background and compressed into reusable statistical signals.",
      in: "Raw metrics from cloud APIs (CPU, memory, disk, network, connections, cost meters)",
      out: "Compact statistical parameter tables (P95, P99, averages, volatility, inventory state)",
      mode: "Deterministic Computation (Nexus + Statistical Engine)",
      status: "proto",
      statusLabel: "Demonstrated in Prototype"
    },
    {
      id: "context",
      num: 2,
      title: "Context",
      question: "What else must be considered before interpreting the signal?",
      desc: "Organizational business rules, environment criticality, maintenance freeze windows, ownership metadata, workload topology, and historical behavior that explain why the resource exists.",
      in: "Resource tags, Business Policy Registry, topology snapshot relationships, Graph RAG",
      out: "Contextual qualification: eligible for optimization, excluded by policy, or subject to freeze",
      mode: "Deterministic Rule Matching + Context Retrieval",
      status: "prop",
      statusLabel: "Designed Target State"
    },
    {
      id: "reasoning",
      num: 3,
      title: "Reasoning",
      question: "What should potentially happen?",
      desc: "Cognitive analysis by specialized domain agents (Plumb, Augur, Apex). Evaluates candidate sizing options, investigates operational patterns, or determines that leaving the resource unchanged is the safest choice.",
      in: "Statistical signals, candidate profiles, operational evidence, business constraints",
      out: "Candidate action hypothesis (downsize, upsize, hold, request evidence) with narrative rationale",
      mode: "AI Reasoning & Strategy Formulation",
      status: "proto",
      statusLabel: "Demonstrated in Prototype"
    },
    {
      id: "validation",
      num: 4,
      title: "Validation",
      question: "Does the proposed decision make technical and financial sense?",
      desc: "Deterministic verification of the candidate change. Pricing engines calculate exact cost differentials; schema validators check target configurations; production safety rules verify capacity envelopes.",
      in: "Candidate action, cloud rate cards, target SKU specifications, capacity thresholds",
      out: "Exact dollar savings calculation, technical viability pass/fail, parameter validation",
      mode: "Deterministic Engines (Pricing, Diff, Safety)",
      status: "proto",
      statusLabel: "Demonstrated in Prototype"
    },
    {
      id: "decision",
      num: 5,
      title: "Decision",
      question: "Should the organization actually act?",
      desc: "Formulation of a standardized Recommendation Contract that bundles the recommended action with empirical evidence, algorithmic confidence rating, operational risk score, and expected financial impact.",
      in: "Validated candidate, safety verdict, deterministic pricing, confidence calculations",
      out: "Structured Recommendation Contract (Action, Evidence, Risk, Confidence, Impact)",
      mode: "Standardized Decision Synthesis",
      status: "prop",
      statusLabel: "Designed Target State"
    },
    {
      id: "approval",
      num: 6,
      title: "Approval",
      question: "Does the decision satisfy organizational control boundaries?",
      desc: "Mandatory human review gateway. Authorized engineers or FinOps practitioners inspect the full evidence trail, confidence score, and operational risks before any consequential infrastructure change proceeds.",
      in: "Recommendation Contract, reviewer role credentials, organizational approval thresholds",
      out: "Cryptographically verifiable approval signature or rejection record with written rationale",
      mode: "Human-in-the-Loop Governance Gateway",
      status: "prop",
      statusLabel: "Designed Target State"
    },
    {
      id: "execution",
      num: 7,
      title: "Execution",
      question: "How can the approved change be safely applied?",
      desc: "Controlled translation of the approved recommendation into Infrastructure-as-Code (Terraform, Bicep) pull requests, enabling automated syntax checks, peer review, and controlled GitOps deployment pipelines.",
      in: "Signed approval payload, customer IaC repository configuration, branch permissions",
      out: "Pull Request with code diff, plan preview, rollback instructions, and CI verification",
      mode: "GitOps Automated Remediation",
      status: "future",
      statusLabel: "Future Extension"
    },
    {
      id: "outcome",
      num: 8,
      title: "Outcome",
      question: "What actually happened to spend and reliability?",
      desc: "Empirical observation of post-change infrastructure. Compares actual cloud billing invoices against predicted savings and monitors post-change application telemetry to ensure zero reliability degradation.",
      in: "Subsequent cloud provider billing invoices, post-change SRE telemetry, incident reports",
      out: "Realized savings calculation, reliability impact assessment, rollback status",
      mode: "Automated Telemetry & Invoice Auditing",
      status: "prop",
      statusLabel: "Designed Target State"
    },
    {
      id: "learning",
      num: 9,
      title: "Learning",
      question: "How accurate was the decision and how can the system improve?",
      desc: "Feedback loop calibrating recommendation confidence models, false-positive thresholds, and safety signals over time based on historical acceptance rates and empirical realized outcomes.",
      in: "Decision history, realized vs predicted savings ratios, rollback frequencies",
      out: "Calibrated confidence parameters, refined safety heuristics, precision benchmarks",
      mode: "Algorithmic Confidence Calibration",
      status: "prop",
      statusLabel: "Requires Validation"
    }
  ],

  // 4 Core Architectural Gaps (from Master Pitch Section 2.4)
  gaps: [
    {
      id: "operational",
      num: "01",
      title: "Operational Context Gap",
      problem: "Traditional FinOps tools look only at cost and coarse CPU utilization. Downsizing a database or compute instance without inspecting application error rates, memory saturation, or latency spikes frequently causes production incidents.",
      solution: "Production Safety Evaluation layer that inspects live operational signals and application exception logs (e.g. JIT KQL queries) before any recommendation becomes actionable.",
      impact: "Prevents high-risk downsize recommendations on unhealthy or intentionally oversized workloads; treats 'Do Nothing' as a valuable, reliable outcome."
    },
    {
      id: "token",
      num: "02",
      title: "Context & Token Efficiency Gap",
      problem: "Repeatedly dumping massive raw time-series metrics into LLM prompts burns excessive context window tokens, introduces severe latency, increases API inference costs, and degrades reasoning precision.",
      solution: "Continuous Signal Engine (Nexus) that precomputes statistical parameters (P95, peak, variance) in the background. Cognitive agents read compact summary tables rather than raw observations.",
      impact: "Reduces token consumption by up to 90%, enables sub-second agent reasoning, and keeps statistical calculations strictly deterministic."
    },
    {
      id: "determinism",
      num: "03",
      title: "AI Determinism Gap",
      problem: "Generative LLMs are non-deterministic and prone to calculation hallucinations. Relying on an LLM to compute amortized pricing, compound discounts, or statistical variance produces untrustworthy figures.",
      solution: "Strict architectural boundary: AI performs cognitive interpretation, strategy framing, and unstructured log analysis. Deterministic engines execute pricing arithmetic, percentiles, forecasts, and solvers.",
      impact: "100% verifiable financial calculations and auditable savings projections that satisfy corporate finance and CFO audit standards."
    },
    {
      id: "execution",
      num: "04",
      title: "Execution & Adoption Gap",
      problem: "Over 70% of recommendations in traditional FinOps dashboards are never implemented because engineering teams distrust recommendations and lack frictionless mechanisms to apply them safely.",
      solution: "Human Approval Gateway coupled with GitOps IaC pull request generation and post-change outcome auditing comparing predicted savings against actual billed invoices.",
      impact: "Bridges the chasm between financial visibility and engineering reality, turning theoretical savings into verified realized bottom-line results."
    }
  ],

  // 8 Architectural Differentiators (Section 7)
  differentiators: [
    {
      id: "diff-safety",
      title: "Production-Aware Rightsizing",
      subtitle: "Safety Before Optimization",
      summary: "Every candidate downsize is verified against live application health, error rates, latency curves, memory saturation, and recent deployment markers.",
      detail: "A low-utilization metric is an ambiguous signal—it could reflect excess capacity, or it could indicate an upstream network failure or crashing application. Plumb evaluates candidates against multi-dimensional capacity envelopes. Blocking an unsafe change is a successful, high-value result."
    },
    {
      id: "diff-signals",
      title: "Signals Prepared Once in the Background",
      subtitle: "Decoupling Collection from Reasoning",
      summary: "Nexus continuously digests raw metrics into reusable statistical summaries, freeing reasoning agents from repetitive data collection.",
      detail: "Instead of having each agent independently query cloud APIs and interpret noisy raw time series, Nexus computes P95, rolling variance, and deltas on a configurable background cadence (e.g. every 4 hours). Downstream agents read compact, high-signal parameter tables."
    },
    {
      id: "diff-schemas",
      title: "Governed Resource Schemas",
      subtitle: "Resource Type Registry (RTR)",
      summary: "Metric definitions are strictly catalogued and validated. AI can propose schemas for unfamiliar cloud services, but proposals require review before caching.",
      detail: "Cloud providers introduce new resource types and metrics constantly. The platform allows an LLM to propose metric mappings for unknown types, but subjects proposals to validation before promoting them into the governed registry, preventing schema hallucinations."
    },
    {
      id: "diff-math",
      title: "Deterministic Math Alongside AI Reasoning",
      subtitle: "Strict Computational Boundaries",
      summary: "Pricing, savings arithmetic, forecasts, and commitment solvers execute in deterministic engines; LLMs are never used as financial calculators.",
      detail: "Language models are exceptional at parsing unstructured logs, understanding human intent, and formulating strategies, but flawed at arithmetic. Our architecture enforces an unbreachable wall: financial formulas, percentiles, and optimization constraints run in pure deterministic code."
    },
    {
      id: "diff-contract",
      title: "Evidence, Confidence & Risk First-Class",
      subtitle: "Standardized Recommendation Contract",
      summary: "Every recommendation carries structured empirical evidence, quantitative risk ratings, and algorithmic confidence metrics.",
      detail: "A recommendation is not a bare SKU suggestion. It is an auditable contract containing P95 telemetry, peak demand, log findings, risk classification, and confidence score calculated from data completeness, freshness, and variance."
    },
    {
      id: "diff-gitops",
      title: "Human Approval & GitOps Remediation",
      subtitle: "Controlled Change Management",
      summary: "Consequential infrastructure modifications never apply blindly; they pass through an approval gateway and emerge as reviewable pull requests.",
      detail: "To earn engineer trust, changes follow established SRE workflows. An approved rightsizing action translates into a Terraform or Bicep diff in a Git pull request with complete evidence and rollback instructions embedded in the description."
    },
    {
      id: "diff-adapters",
      title: "Plug-and-Play Provider Abstractions",
      subtitle: "Multi-Cloud by Design",
      summary: "Azure, AWS, GCP, and OCI connect through standardized adapter contracts; missing provider capabilities are reported transparently, never faked.",
      detail: "Cloud providers are fundamentally heterogeneous. The architecture establishes clear provider interfaces with capability discovery. If a provider lacks fine-grained memory metrics or per-second billing, the system flags the limitation rather than synthesizing synthetic data."
    },
    {
      id: "diff-audit",
      title: "Outcomes, Not Just Projections",
      subtitle: "Verifying Reality After the Decision",
      summary: "The platform tracks decisions through their full lifecycle, comparing actual cloud invoices and post-change reliability against initial forecasts.",
      detail: "Theoretical savings on a dashboard do not fund businesses. The Outcome Auditor distinguishes Potential, Approved, Implemented, and Realized savings, auditing cloud invoices 30 days post-change to confirm actual bottom-line impact and calibrate future decision accuracy."
    }
  ],

  // Interactive Rightsizing Simulation Steps (Section 9 Walkthrough)
  walkthroughSteps: [
    {
      step: 1,
      title: "Discover & Filter Inventory",
      proto: true,
      component: "Nexus + Provider Adapter",
      desc: "Nexus queries Azure Resource Graph across subscriptions, identifying 1,240 total resources. Variable-cost workloads are isolated; static budgets and non-tradable resources are filtered out.",
      data: {
        totalResources: 1240,
        variableCandidates: 342,
        excludedByPolicy: 898,
        scope: "Sub-prod-ecommerce / rg-checkout",
        status: "Completed in 420ms"
      }
    },
    {
      step: 2,
      title: "Resolve Schemas & Collect Telemetry",
      proto: true,
      component: "Resource Type Registry + Azure Monitor",
      desc: "Metric schema for 'Microsoft.Compute/virtualMachines' is resolved from the RTR cache. Telemetry poller retrieves 14 days of CPU, Memory, Disk IOPS, and Network metrics.",
      data: {
        resourceType: "Microsoft.Compute/virtualMachines",
        metricsResolved: ["Percentage CPU", "Available Memory Bytes", "Disk Read Bytes/sec"],
        sampleWindow: "14 Days (1-hour granularity)",
        telemetryPointsRetrieved: 1008
      }
    },
    {
      step: 3,
      title: "Calculate Statistical Parameters",
      proto: true,
      component: "Statistical Engine",
      desc: "Deterministic statistical engine computes percentiles, peak values, and volatility scores. Raw 1,008 metric points are compressed into 6 compact parameters.",
      data: {
        avgCpu: "11.4%",
        p95Cpu: "18.2%",
        peakCpu: "41.8%",
        p95Memory: "31.4%",
        volatilityScore: "0.14 (Low)",
        trafficVariance: "Stable"
      }
    },
    {
      step: 4,
      title: "Detect Candidate Workload",
      proto: true,
      component: "Plumb — Candidate Filter",
      desc: "Plumb flags VM 'vm-checkout-worker-01' as a prime downsizing candidate: P95 CPU < 20% and P95 RAM < 40% across the 14-day observation window.",
      data: {
        candidateId: "vm-checkout-worker-01",
        currentSku: "Standard_D4s_v3 (4 vCPU, 16 GiB RAM)",
        targetSku: "Standard_D2s_v3 (2 vCPU, 8 GiB RAM)",
        sizingAction: "DOWNSIZE",
        preliminaryVerdict: "Oversized Capacity Detected"
      }
    },
    {
      step: 5,
      title: "Production Safety Evaluation (Log Analysis)",
      proto: true,
      component: "Production Safety Evaluation (JIT KQL)",
      desc: "Critical safety gate executes targeted KQL query over Azure Log Analytics for application exceptions, memory thrashing, and HTTP 5xx spikes on the candidate instance.",
      data: {
        kqlQueryExecuted: "AppExceptions | where TimeGenerated > ago(14d) | count",
        exceptionsDetected: 0,
        memoryPressureEvents: 0,
        httpErrorRate: "0.01% (Normal baseline)",
        safetyVerdict: "PASSED — No Operational Distress Detected"
      }
    },
    {
      step: 6,
      title: "Deterministic Pricing & Recommendation",
      proto: true,
      component: "Pricing Engine + Recommendation Contract",
      desc: "Pricing Engine calculates exact monthly rate differential between Standard_D4s_v3 ($146.00/mo) and Standard_D2s_v3 ($71.55/mo), generating a complete Recommendation Contract.",
      data: {
        currentMonthlyCost: "$146.00",
        proposedMonthlyCost: "$71.55",
        monthlySavings: "$74.45",
        annualSavings: "$893.40",
        confidence: "High (0.94)",
        riskClassification: "Low"
      }
    },
    {
      step: 7,
      title: "Human Approval Gateway",
      proto: false,
      component: "Human Approval Gateway (UI / Slack)",
      desc: "Standardized contract is dispatched to SRE on-call via interactive Slack message and Dashboard. Reviewer inspects P95 evidence, zero exceptions, and signs approval.",
      data: {
        dispatchedChannel: "#finops-approvals (Slack)",
        reviewer: "sarah.chen@company.com (SRE Lead)",
        decision: "APPROVED",
        reviewRationale: "Workload stable; 2 vCPU / 8 GiB is ample for 18% P95 load.",
        timestamp: "2026-10-19T14:32:00Z"
      }
    },
    {
      step: 8,
      title: "GitOps Remediation Pull Request",
      proto: false,
      component: "Remediation & IaC Engine",
      desc: "Platform generates Terraform configuration diff, creates branch 'finops/resize-vm-checkout-01', runs 'terraform plan', and opens Pull Request #412 on GitHub.",
      data: {
        repository: "infrastructure/terraform-checkout-prod",
        fileModified: "modules/compute/workers.tf",
        diffSummary: '- size = "Standard_D4s_v3"\\n+ size = "Standard_D2s_v3"',
        pullRequestUrl: "https://github.com/company/infra/pull/412",
        status: "Merged & Applied via GitHub Actions"
      }
    },
    {
      step: 9,
      title: "Outcome Audit & Confidence Calibration",
      proto: false,
      component: "Outcome Auditor & Decision History",
      desc: "30 days post-deployment, the Outcome Auditor retrieves actual Azure billing invoices and SRE telemetry, verifying $74.20 realized savings with zero latency degradation.",
      data: {
        predictedMonthlySavings: "$74.45",
        realizedMonthlySavings: "$74.20",
        savingsAccuracy: "99.7%",
        postChangeErrorRate: "0.01% (Zero degradation)",
        confidenceCalibrationResult: "Confidence Model Calibrated (+0.02 precision)"
      }
    }
  ],

  // Implementation Roadmap (Section 10)
  roadmapPhases: [
    {
      phase: 1,
      title: "Phase 1: Foundation",
      status: "In Progress (Prototype Validated)",
      desc: "Core signal engine foundation, variable-cost filtering, dynamic schema resolution, telemetry poller, and deterministic statistical parameter computation.",
      components: ["Nexus", "Statistical Engine", "Resource Type Registry", "Pricing Engine", "Azure Adapter"]
    },
    {
      phase: 2,
      title: "Phase 2: Decision & Safety",
      status: "Designed (Partly Validated)",
      desc: "Advanced candidate detection, Production Safety Evaluation with targeted log analysis, standardized recommendation contracts, and human approval gateway.",
      components: ["Plumb", "Production Safety Evaluation", "Recommendation Contract", "Human Approval Gateway"]
    },
    {
      phase: 3,
      title: "Phase 3: Strategic FinOps",
      status: "Designed Target State",
      desc: "Forecasting engine with numerical algorithms, constraint-based commitment optimization solver, and rule-based cost allocation and chargeback.",
      components: ["Augur", "Apex", "Charta", "Forecasting Engine", "Optimization Solver"]
    },
    {
      phase: 4,
      title: "Phase 4: Interfaces & Automation",
      status: "Designed Target State",
      desc: "Persistent dashboard, MCP tooling bridge for IDEs, event bus orchestration, and automated GitOps IaC pull request remediation pipelines.",
      components: ["Dashboard", "MCP Integration", "Event Bus", "Remediation & IaC Engine", "Notification Dispatcher"]
    },
    {
      phase: 5,
      title: "Phase 5: Production Hardening",
      status: "Future Extension",
      desc: "Comprehensive multi-cloud adapter coverage (AWS, GCP, OCI), distributed LangFuse execution tracing, tenant isolation hardening, and automated confidence calibration.",
      components: ["AWS / GCP / OCI Adapters", "Observability & Tracing", "Outcome Auditor", "Incident Triage"]
    }
  ],

  // 8 Open Architectural Questions (Section 47)
  questions: [
    "Customer Authentication: How customers authorize cloud access (federated OIDC vs customer-managed app credentials), credential rotation, and strict separation of read-only observation from write remediation.",
    "Historical Data Model: What constitutes a short-term raw observation versus a long-term statistical signal, precise retention cadences for each, and the criteria for promoting observations into long-term knowledge.",
    "Nexus vs Watcher Interaction: Whether Watcher runs synchronously after every Nexus scan, how it handles partial or failed scans, and how it reconciles with native provider-generated event streams.",
    "Agent Dependencies & Concurrency: Determining which domain agents run completely independently, which require precomputed Nexus signals, and which can execute in parallel versus waiting for human approval.",
    "Adapter Contracts & Capability Discovery: Designing capability discovery, error normalization, status reporting, and transparent handling of unsupported operations across heterogeneous cloud providers.",
    "Execution Boundaries: Defining strict security boundaries between informational queries, recommendation generation, preparing IaC pull requests, and applying infrastructure modifications.",
    "Architectural Responsibility Boundaries: Explicit separation between background signal ingestion (Nexus), change detection (Watcher), rightsizing (Plumb), forecasting (Augur), commitments (Apex), allocation (Charta), and conversational query (Scribe).",
    "Cadence Presets & Trade-offs: Reconciling collection cadences (2-hour, 4-hour, or 6-hour presets) against cloud provider API rate limits, metric latency, and storage volume costs."
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = root.ARCH;
}
