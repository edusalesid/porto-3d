export type RoomId =
  | 'lobby'
  | 'projects'
  | 'systems'
  | 'experience'
  | 'cases'
  | 'contact';

export type ProjectCategory =
  | 'Product/SaaS'
  | 'AI'
  | 'Software Systems'
  | 'Marketing Operations'
  | 'Educational Projects';

export interface ProjectEvidence {
  type: 'image' | 'diagram' | 'link' | 'document';
  title: string;
  url: string;
  alt?: string;
  caption: string;
  metricsOrSpec?: string[];
}

export interface PortfolioProject {
  slug: string;
  title: string;
  category: ProjectCategory[];
  summary: string;
  role: string;
  period: string;
  projectStatus: string;
  relevanceRank: number;
  // 14-point Case Archive structure
  overview: string;
  context: string;
  problem: string;
  objectives: string[];
  constraints: string[];
  responsibilities: string[];
  teamAndStakeholders: string[];
  approach: string[];
  keyDecisions: {
    decision: string;
    rationale: string;
    tradeOff: string;
  }[];
  execution: {
    phase: string;
    deliverable: string;
    outcome: string;
  }[];
  risksAndTradeOffs: {
    risk: string;
    mitigation: string;
  }[];
  outcomes: string[];
  lessonsLearned: string[];
  evidence: ProjectEvidence[];
  technologies: string[];
  publicUrl?: string;
}

export interface RoomMetadata {
  id: RoomId;
  name: string;
  shortLabel: string;
  code: string;
  purpose: string;
  summary: string;
  ctaLabel: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  roomCenter: [number, number, number];
  accentHex: string;
  highlights: string[];
}

export const ROOMS: RoomMetadata[] = [
  {
    id: 'lobby',
    name: 'Virtual Lobby',
    shortLabel: 'Lobby',
    code: '01',
    purpose: 'Orientation & Executive Summary',
    summary:
      'Central orientation hub introducing Rizal as a Technical Project Manager working at the intersection of project execution, product development, software systems, and AI-enabled workflows.',
    ctaLabel: 'Explore Executive Summary',
    cameraPosition: [0, 16.8, 23.0],
    cameraTarget: [0, 0.6, 1.8],
    roomCenter: [0, 0, 0],
    accentHex: '#38BDF8',
    highlights: [
      'End-to-end scope, dependency, and sprint governance',
      'Cross-functional alignment across Engineering, Design & Ops',
      'AI-enabled workflow design & verifiable case evidence',
    ],
  },
  {
    id: 'projects',
    name: 'Project Room',
    shortLabel: 'Projects',
    code: '02',
    purpose: 'Curated Project Directory & Delivery Proof',
    summary:
      'Interactive project workstation showcasing 6 verified projects across Product/SaaS, AI workflows, Software Systems, Marketing Operations, and Education.',
    ctaLabel: 'Open Project Directory',
    cameraPosition: [-15.5, 9.2, -0.5],
    cameraTarget: [-11.5, 1.5, -8.5],
    roomCenter: [-11.5, 0, -8.5],
    accentHex: '#38BDF8',
    highlights: [
      'mFood POS · Multi-Outlet Cloud POS & Kitchen Sync',
      'DIAMOND KMS · Enterprise SOP & Knowledge Retrieval',
      'Employr, Triagro, Prompt Battle & RevOps Engine',
    ],
  },
  {
    id: 'systems',
    name: 'Systems Lab',
    shortLabel: 'Systems',
    code: '03',
    purpose: 'Workflow Architecture, Risk & Technical Collaboration',
    summary:
      'Inside the operational engine: how problems are decomposed into WBS milestones, API contracts, risk registers, and human-in-the-loop AI workflows.',
    ctaLabel: 'Inspect Systems & Workflows',
    cameraPosition: [15.5, 9.2, -0.5],
    cameraTarget: [11.5, 1.5, -8.5],
    roomCenter: [11.5, 0, -8.5],
    accentHex: '#818CF8',
    highlights: [
      'Planning & WBS Dependency Mapping',
      'Risk Register & Trade-off Decision Matrices',
      'Cross-Functional Engineering & Design Rituals',
    ],
  },
  {
    id: 'experience',
    name: 'Experience Gallery',
    shortLabel: 'Experience',
    code: '04',
    purpose: 'Chronological Track Record & Role Scope',
    summary:
      'Chronological timeline of project management engagements, product leadership roles, operational scope, and direct links to verified case studies.',
    ctaLabel: 'View Timeline & Roles',
    cameraPosition: [-16, 8.8, 13.5],
    cameraTarget: [-11.5, 1.5, 6.5],
    roomCenter: [-11.5, 0, 6.5],
    accentHex: '#34D399',
    highlights: [
      'Technical Project Manager — Product & Software Systems',
      'Project Lead — AI Workflows & Educational Arenas',
      'Marketing Operations & RevOps Pipeline Architecture',
    ],
  },
  {
    id: 'cases',
    name: 'Case Archive',
    shortLabel: 'Cases',
    code: '05',
    purpose: '14-Point Deep-Dive Case Studies',
    summary:
      'Comprehensive architectural archive examining problem statements, constraints, key decisions, trade-offs, execution milestones, and lessons learned.',
    ctaLabel: 'Read Deep-Dive Cases',
    cameraPosition: [16, 8.8, 13.5],
    cameraTarget: [11.5, 1.5, 6.5],
    roomCenter: [11.5, 0, 6.5],
    accentHex: '#F59E0B',
    highlights: [
      'Structured 14-section PM decision documentation',
      'Explicit constraints, trade-offs, and risk mitigations',
      'Verifiable qualitative & operational outcomes',
    ],
  },
  {
    id: 'contact',
    name: 'Contact Lounge',
    shortLabel: 'Contact',
    code: '06',
    purpose: 'Direct Communication, LinkedIn & CV Download',
    summary:
      'Ready to collaborate on product delivery, technical project management, or operational systems? Connect directly via email, LinkedIn, or download the full CV.',
    ctaLabel: 'Connect & Download CV',
    cameraPosition: [0, 8.5, 21.5],
    cameraTarget: [0, 1.4, 11.5],
    roomCenter: [0, 0, 11.5],
    accentHex: '#38BDF8',
    highlights: [
      'Direct Email: edusales.id@gmail.com',
      'Downloadable Verified CV (Plain-Text & Print Ready)',
      'Available for PM, Technical PM & Product Systems roles',
    ],
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'mfood-pos',
    title: 'mFood POS — Multi-Outlet Cloud Point of Sale & Kitchen Sync',
    category: ['Product/SaaS', 'Software Systems'],
    summary:
      'End-to-end project delivery of an offline-resilient cloud POS and real-time kitchen display system (KDS) built for multi-branch F&B operators.',
    role: 'Technical Project Manager',
    period: '2025 — 2026',
    projectStatus: 'Production Pilot Deployed',
    relevanceRank: 1,
    overview:
      'mFood POS is an integrated point-of-sale, table management, and kitchen ticket synchronization platform designed for high-throughput F&B outlets operating on unstable store Wi-Fi connections.',
    context:
      'Multi-branch F&B operators struggled with order discrepancies between front-of-house cashiers and back-of-house kitchen stations whenever internet connectivity fluctuated during peak lunch and dinner rushes.',
    problem:
      'Cloud-only web POS terminals froze during intermittent network drops, causing duplicate kitchen tickets, lost modifier notes, and manual reconciliation delays at shift close.',
    objectives: [
      'Guarantee zero lost orders during temporary local network or ISP outages up to 30 minutes.',
      'Synchronize cashier order entry with Kitchen Display Systems (KDS) over local WebSocket/LAN fallback.',
      'Reduce new cashier training and onboarding time to under half a shift.',
    ],
    constraints: [
      'Legacy Android tablet hardware at existing outlets with limited RAM (3GB).',
      'Strict 10-week delivery window before peak seasonal store openings.',
      'Zero tolerance for database schema breaking changes during live store hours.',
    ],
    responsibilities: [
      'Authored the complete PRD, offline state synchronization specification, and edge-case reconciliation rules.',
      'Led sprint planning, daily unblocking, and dependency tracking across 3 frontend/backend engineers and 1 UI/UX designer.',
      'Conducted on-site shadow testing with cashiers and kitchen staff to refine touch target ergonomics.',
      'Managed staged rollout and shift-end reconciliation audits across pilot locations.',
    ],
    teamAndStakeholders: [
      '1 Technical Project Manager (Rizal)',
      '2 Full-Stack Engineers & 1 Mobile/Web Frontend Engineer',
      '1 Product Designer',
      'F&B Outlet Managers, Head Cashiers & Kitchen Expediters',
    ],
    approach: [
      'Mapped the complete order lifecycle from table seating and modifier selection to kitchen firing and split-bill settlement.',
      'Decomposed the build into 3 vertical slices: Core Cashier Register, Local Queue & KDS Sync, and Shift Settlement Audit.',
      'Ran weekly failure-mode simulations (deliberately disconnecting router WAN during test rushes) prior to pilot launch.',
    ],
    keyDecisions: [
      {
        decision: 'Prioritize IndexedDB local transaction queuing with idempotent UUID order keys before building advanced analytics dashboards.',
        rationale:
          'Store operators valued uninterrupted peak-hour cashier speed far above historical chart visualizations in MVP.',
        tradeOff:
          'Deferred multi-branch executive BI reporting to Phase 2 in exchange for rock-solid offline order capture on Day 1.',
      },
      {
        decision: 'Enforce single-screen modifier selection without nested modal popups.',
        rationale:
          'Shadowing revealed cashiers made errors when navigating 3+ modal layers while speaking to customers in line.',
        tradeOff:
          'Required custom compact grid layout engineering and stricter menu taxonomy categorization.',
      },
    ],
    execution: [
      {
        phase: 'Weeks 1–2: Discovery & Architecture Alignment',
        deliverable: 'Offline Sync State Machine, Data Contract & Clickable Cashier Prototype',
        outcome: 'Signed off by engineering and store operations with zero scope ambiguity.',
      },
      {
        phase: 'Weeks 3–6: Core POS & Local Queue Engine',
        deliverable: 'Idempotent Order Queue, Split-Bill Logic & KDS Ticket Board',
        outcome: 'Passed simulated 200-order stress test under intermittent packet loss.',
      },
      {
        phase: 'Weeks 7–10: Field UAT & Pilot Deployment',
        deliverable: 'Live Store Rollout, Cashier Quick-Reference Guide & Shift Audit Log',
        outcome: 'Smooth transition across pilot outlets with zero lost tickets.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Concurrent edits to the same open table bill from two cashier terminals during offline mode.',
        mitigation:
          'Implemented deterministic event-log merging by item line UUID and designated a primary terminal lock per table.',
      },
      {
        risk: 'Thermal printer driver incompatibility across mixed hardware models.',
        mitigation:
          'Standardized ESC/POS raw byte command templates with a browser print-bridge fallback.',
      },
    ],
    outcomes: [
      'Eliminated lost or duplicate kitchen tickets caused by brief Wi-Fi drops across pilot outlets.',
      'Reduced new cashier onboarding and training duration from 3 days to 4 hours through simplified single-screen order entry.',
      'Shortened end-of-shift cash and digital payment reconciliation through automated discrepancy flagging.',
    ],
    lessonsLearned: [
      'Testing software in a quiet office never replicates the cognitive load of a loud kitchen during a Friday dinner rush; early on-site shadowing saved at least two sprints of rework.',
      'Idempotency keys must be designed at the very beginning of the data schema, not bolted on during QA.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'Offline-First Order Queue & KDS State Architecture',
        url: '/cases/mfood-pos#architecture',
        caption: 'State transition diagram showing IndexedDB queuing, idempotent UUID sync, and KDS ticket acknowledgement.',
        metricsOrSpec: [
          'Client Storage: IndexedDB Transaction Log',
          'Sync Protocol: Idempotent REST + WebSocket Broadcast',
          'Conflict Resolution: Append-Only Line-Item Event Merge',
        ],
      },
      {
        type: 'document',
        title: 'Shift-End Reconciliation & UAT Acceptance Checklist',
        url: '/cases/mfood-pos#uat',
        caption: '24-point operational QA checklist verified with outlet head cashiers prior to go-live.',
        metricsOrSpec: [
          '24/24 Critical Path Scenarios Passed',
          'Zero Unreconciled Split-Bill Variances',
        ],
      },
    ],
    technologies: [
      'Next.js',
      'TypeScript',
      'IndexedDB',
      'WebSockets',
      'PostgreSQL',
      'Tailwind CSS',
    ],
    publicUrl: '/cases/mfood-pos',
  },
  {
    slug: 'diamond-kms',
    title: 'DIAMOND KMS — Enterprise Knowledge Management & SOP Retrieval System',
    category: ['Software Systems', 'AI'],
    summary:
      'Centralized enterprise knowledge base and AI-assisted SOP retrieval workflow replacing fragmented spreadsheets and tribal operational knowledge.',
    role: 'Project Manager & Systems Analyst',
    period: '2025',
    projectStatus: 'Internal Enterprise Release',
    relevanceRank: 2,
    overview:
      'DIAMOND KMS is a structured knowledge management and standard operating procedure (SOP) governance system with citation-grounded semantic search for internal operational teams.',
    context:
      'Operational procedures, escalation policies, and product troubleshooting guides were scattered across Google Drive folders, WhatsApp chat histories, and outdated PDF manuals.',
    problem:
      'Support and operations staff spent excessive time hunting for the latest approved SOP version, frequently applying superseded rules when handling customer or vendor escalations.',
    objectives: [
      'Consolidate cross-departmental SOPs into a single version-controlled repository with clear ownership.',
      'Provide citation-backed AI semantic search that strictly quotes verified internal articles without hallucinating policy.',
      'Establish a lightweight review and expiration workflow so documentation stays current.',
    ],
    constraints: [
      'Strict internal data privacy requirements—no unapproved external training on proprietary company documents.',
      'Department heads had limited bandwidth to rewrite hundreds of legacy documents from scratch.',
      'Must support role-based access control (RBAC) across 4 distinct organizational tiers.',
    ],
    responsibilities: [
      'Conducted stakeholder interviews across 4 departments to audit document chaos and define unified metadata taxonomy.',
      'Designed the document lifecycle state machine (Draft → Peer Review → Approved → Expired/Archived).',
      'Managed engineering sprints for the ingestion pipeline, chunking strategy, and citation-first search UI.',
      'Defined the evaluation rubric for RAG answer accuracy and zero-hallucination guardrails.',
    ],
    teamAndStakeholders: [
      '1 Project Manager & Systems Analyst (Rizal)',
      '2 Backend / AI Engineers & 1 Frontend Engineer',
      'Department Champions from Operations, Customer Support, HR & Finance',
    ],
    approach: [
      'Started with content governance before writing code: established mandatory document headers (Owner, Effective Date, Review Cycle, Scope).',
      'Built an automated markdown converter and section-aware chunking pipeline to preserve tables and numbered checklists.',
      'Evaluated AI retrieval responses against a 50-question golden dataset compiled from real support escalations.',
    ],
    keyDecisions: [
      {
        decision: 'Enforce strict citation-first UI where every AI summary sentence links directly to the exact SOP paragraph and version date.',
        rationale:
          'Operations leads refused to trust AI answers unless staff could visually verify the underlying official policy in one click.',
        tradeOff:
          'Required granular paragraph-level indexing and stricter refusal thresholds when confidence was low.',
      },
      {
        decision: 'Implement automated 90-day staleness flags assigned to document owners.',
        rationale:
          'A knowledge base dies within 6 months if outdated procedures remain mixed with active ones.',
        tradeOff:
          'Added email/Slack notification plumbing to the MVP scope.',
      },
    ],
    execution: [
      {
        phase: 'Phase 1: Taxonomy & Content Audit',
        deliverable: 'Unified Metadata Schema & Top-100 Critical SOP Migration',
        outcome: 'Deprecated 140+ duplicate or obsolete spreadsheet files.',
      },
      {
        phase: 'Phase 2: RBAC Repository & Semantic Retrieval',
        deliverable: 'Versioned KMS Web Portal + Citation-Grounded Search Engine',
        outcome: 'Passed 50-query golden dataset evaluation with zero fabricated policy claims.',
      },
      {
        phase: 'Phase 3: Department Onboarding & Governance Handover',
        deliverable: 'Editor Playbooks & Automated Staleness Review Alerts',
        outcome: 'Adopted across 4 core operational divisions.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'LLM synthesizing answers from outdated or draft SOP documents.',
        mitigation:
          'Hard-filtered vector retrieval at the database query layer so only documents with status="APPROVED" and matching user RBAC role are indexed.',
      },
      {
        risk: 'Low contributor adoption due to complex editor formatting.',
        mitigation:
          'Provided pre-structured SOP templates with 4 mandatory fields instead of a blank page.',
      },
    ],
    outcomes: [
      'Centralized approved SOPs across 4 departments into a single governed source of truth.',
      'Eliminated policy version confusion during support escalations through mandatory version badges and paragraph citations.',
      'Established repeatable RAG evaluation criteria verified against 50 real operational edge cases.',
    ],
    lessonsLearned: [
      'AI search is only as reliable as the underlying document hygiene; 60% of the project value came from taxonomy governance and deduplication.',
      'Showing a "No verified SOP found—escalate to Team Lead" state is far safer and more trusted than a speculative answer.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'RBAC Document Governance & RAG Citation Pipeline',
        url: '/cases/diamond-kms#pipeline',
        caption: 'End-to-end flow from Markdown SOP approval to RBAC-filtered vector retrieval and paragraph citation rendering.',
        metricsOrSpec: [
          'Governance States: Draft · Review · Approved · Archived',
          'Retrieval Guardrail: Strict Approved-Only Metadata Filter',
          'Golden Evaluation Set: 50 Real Escalation Queries',
        ],
      },
    ],
    technologies: [
      'TypeScript',
      'Next.js',
      'Vector Search / RAG',
      'Role-Based Access Control',
      'PostgreSQL',
      'Markdown AST',
    ],
    publicUrl: '/cases/diamond-kms',
  },
  {
    slug: 'employr',
    title: 'Employr — Competency-Based Talent Matching & Assessment Pipeline',
    category: ['Product/SaaS', 'AI'],
    summary:
      'Structured recruitment and candidate evaluation platform replacing gut-feel resume screening with verifiable competency rubrics.',
    role: 'Product & Project Manager',
    period: '2025',
    projectStatus: 'MVP Shipped',
    relevanceRank: 3,
    overview:
      'Employr is a talent evaluation and hiring workflow platform that aligns job requisitions, structured case assessments, and multi-reviewer scorecards into a transparent pipeline.',
    context:
      'Recruiters and hiring managers evaluated candidates inconsistently, relying on unstructured resume keywords and subjective interview impressions that led to misaligned hires.',
    problem:
      'High volume of unfiltered applications created screening bottlenecks while hiring managers lacked comparable evidence of candidate problem-solving skills prior to final interviews.',
    objectives: [
      'Standardize role requisitions around 4–6 observable competencies rather than vague keyword lists.',
      'Provide asynchronous work-sample prompts and structured scoring rubrics for reviewers.',
      'Give recruiters a side-by-side candidate evidence matrix to accelerate shortlist decisions.',
    ],
    constraints: [
      'Candidate assessment completion time had to stay under 25 minutes to prevent applicant drop-off.',
      'Small core engineering team requiring ruthless feature prioritization for the 8-week MVP.',
    ],
    responsibilities: [
      'Defined product vision, user stories, and competency rubric data model.',
      'Facilitated discovery workshops with recruiters and hiring managers to map screening bottlenecks.',
      'Managed sprint backlog, acceptance testing, and pilot onboarding with recruitment partners.',
    ],
    teamAndStakeholders: [
      '1 Product & Project Manager (Rizal)',
      '2 Full-Stack Developers',
      '1 UI/UX Designer',
      'Recruitment Leads & Hiring Managers',
    ],
    approach: [
      'Analyzed 30+ real hiring loops to identify where recruiter and hiring manager expectations diverged.',
      'Designed a modular scorecard builder that pairs each role competency with behavioral anchor examples (1 to 4 scale).',
      'Implemented blind initial work-sample grading to reduce reviewer halo bias.',
    ],
    keyDecisions: [
      {
        decision: 'Use structured 1–4 behavioral anchor rubrics instead of automated AI resume pass/fail scoring.',
        rationale:
          'Automated black-box resume scores penalize non-traditional backgrounds and fail compliance audits; structured human-verified rubrics assisted by AI summarization keep hiring managers in control.',
        tradeOff:
          'Required upfront rubric setup per role (~10 minutes) from the hiring manager.',
      },
    ],
    execution: [
      {
        phase: 'Sprint 1–2: Requisition & Rubric Builder',
        deliverable: 'Role Competency Templates & Behavioral Anchor Matrix',
        outcome: 'Reduced role kickoff alignment meetings between recruiters and hiring leads.',
      },
      {
        phase: 'Sprint 3–4: Candidate Work-Sample Portal & Reviewer Matrix',
        deliverable: 'Timed Scenario Submission & Side-by-Side Comparison View',
        outcome: 'Shipped functional MVP validated across pilot hiring cohorts.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Candidate drop-off if pre-interview scenario prompts feel like unpaid free work.',
        mitigation:
          'Capped prompts to 20-minute hypothetical decision scenarios with transparent evaluation criteria shown upfront.',
      },
    ],
    outcomes: [
      'Replaced unstructured interview notes with standardized 4-level competency evidence matrices.',
      'Improved alignment between recruiters and hiring managers during shortlist calibration reviews.',
      'Delivered complete MVP on schedule within an 8-week agile release cycle.',
    ],
    lessonsLearned: [
      'Hiring managers gladly invest 10 minutes configuring a rubric when pre-populated domain templates are provided.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'Competency Rubric & Calibration Workflow',
        url: '/cases/employr#workflow',
        caption: 'Pipeline mapping Requisition Definition → Work-Sample Scenario → Independent Reviewer Scoring → Calibration Shortlist.',
        metricsOrSpec: [
          'Assessment Cap: <= 25 Minutes Candidate Effort',
          'Scoring Scale: 4-Point Behavioral Anchors',
        ],
      },
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Structured Rubrics'],
    publicUrl: '/cases/employr',
  },
  {
    slug: 'triagro',
    title: 'Triagro — Field Agronomy Supply Chain & Harvest Tracking System',
    category: ['Software Systems', 'Product/SaaS'],
    summary:
      'Mobile-first agricultural collection and batch traceability workflow connecting rural field collectors with central warehouse inventory.',
    role: 'Technical Project Manager',
    period: '2024 — 2025',
    projectStatus: 'Field Validated',
    relevanceRank: 4,
    overview:
      'Triagro digitizes first-mile harvest intake, moisture/grade logging, and transport batch tracking for agricultural commodities moving from rural collection points to central processing.',
    context:
      'Field collectors recorded farmer harvest weights and quality grades on paper notebooks, transcribing them into spreadsheets hours or days later.',
    problem:
      'Delayed paper transcription caused inventory blind spots, weight shrinkage disputes during transit, and delayed payment verification for partner farmers.',
    objectives: [
      'Capture harvest batch weight, quality grade, and collector sign-off digitally at the point of collection.',
      'Track transit handoffs from field truck dispatch to central warehouse weighbridge receipt.',
      'Ensure full usability on budget Android phones under harsh sunlight and 2G/edge connectivity.',
    ],
    constraints: [
      'Field users had varying digital literacy and operated outdoors with one hand while weighing sacks.',
      'Intermittent rural cellular coverage required resilient local caching and lightweight payloads.',
    ],
    responsibilities: [
      'Mapped physical supply chain checkpoints from farm gate to warehouse intake.',
      'Translated field constraints into high-contrast, large-button mobile web specifications.',
      'Coordinated backend API design for batch QR/lot ID generation and variance reconciliation.',
    ],
    teamAndStakeholders: [
      '1 Technical Project Manager (Rizal)',
      '2 Software Engineers',
      'Field Agronomy Coordinators, Collection Agents & Warehouse Supervisors',
    ],
    approach: [
      'Reduced field intake forms from 18 spreadsheet columns to 4 essential inputs per lot.',
      'Introduced automatic variance alerts when warehouse receipt weight differed from field dispatch weight beyond tolerance thresholds.',
    ],
    keyDecisions: [
      {
        decision: 'Build a Progressive Mobile Web App (PWA) instead of a native Play Store app.',
        rationale:
          'Field agents frequently swapped devices and avoided downloading large app updates over metered mobile data.',
        tradeOff:
          'Relying on browser storage limits required compact payload serialization without high-res photo uploads in the primary sync queue.',
      },
    ],
    execution: [
      {
        phase: 'Discovery & Field Mapping',
        deliverable: 'Supply Chain Lot Traceability Spec & High-Contrast Mobile Wireframes',
        outcome: 'Validated with field coordinators for outdoor legibility.',
      },
      {
        phase: 'Core Intake & Warehouse Reconciliation Build',
        deliverable: 'Lot ID Generator, Dispatch Log & Weighbridge Variance Dashboard',
        outcome: 'Successfully piloted across field collection routes.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Accidental duplicate lot submissions when agents tap Submit repeatedly on slow connections.',
        mitigation:
          'Added immediate client-side button locking, optimistic receipt screens, and deterministic lot hash deduplication.',
      },
    ],
    outcomes: [
      'Eliminated multi-day paper-to-spreadsheet transcription lag between field collection and warehouse visibility.',
      'Provided clear lot-level weight and grade audit trails across transit handoffs.',
    ],
    lessonsLearned: [
      'In field operations software, button size, contrast under sunlight, and tap count matter far more than decorative UI polish.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'First-Mile Harvest Lot Traceability Flow',
        url: '/cases/triagro#traceability',
        caption: 'Checkpoint verification from Field Intake Lot ID → Truck Manifest → Warehouse Weighbridge Reconciliation.',
        metricsOrSpec: [
          'Field Input Steps: 3-Tap Intake Flow',
          'Payload Size: < 4KB per Batch Record',
        ],
      },
    ],
    technologies: ['Progressive Web App', 'TypeScript', 'REST API', 'Offline Queue', 'QR Lot Tracking'],
    publicUrl: '/cases/triagro',
  },
  {
    slug: 'prompt-battle',
    title: 'Prompt Battle — Interactive AI Prompt Engineering & Evaluation Arena',
    category: ['Educational Projects', 'AI'],
    summary:
      'Competitive learning platform and structured workshop system where professionals solve practical operational challenges using evaluated LLM workflows.',
    role: 'Project Lead & Learning Experience Designer',
    period: '2025 — 2026',
    projectStatus: 'Live Community Event & Platform',
    relevanceRank: 5,
    overview:
      'Prompt Battle transforms passive AI webinars into an active, measurable arena where participants craft structured prompts against real business constraints and receive rubric-based evaluation.',
    context:
      'Teams across product, marketing, and operations wanted to adopt generative AI but relied on ad-hoc, unrepeatable chatting rather than systematic prompt architecture.',
    problem:
      'Conventional AI training lacked hands-on verification—participants watched slides but could not test how their prompts handled edge cases, formatting constraints, or hallucination traps.',
    objectives: [
      'Create a structured challenge environment with realistic business problem briefs and strict output schemas.',
      'Evaluate participant submissions transparently across Accuracy, Constraint Adherence, and Edge-Case Resilience.',
      'Deliver an engaging live leaderboard and peer-review breakdown for workshops.',
    ],
    constraints: [
      'Live event rounds required simultaneous submission evaluation within 60 seconds without API rate-limit failures.',
      'Challenges needed to be accessible to non-coders while still rewarding rigorous systems thinking.',
    ],
    responsibilities: [
      'Designed the challenge curriculum, scoring rubric mechanics, and live event facilitation flow.',
      'Managed development of the submission portal, automated rubric evaluator, and live stage scoreboard.',
      'Facilitated live sessions and synthesized best-practice prompt patterns for participants.',
    ],
    teamAndStakeholders: [
      '1 Project Lead & Curriculum Architect (Rizal)',
      '1 Full-Stack Developer',
      'Event Moderators & Workshop Participants',
    ],
    approach: [
      'Structured each round around a concrete artifact (e.g., extracting structured risk tables from messy meeting transcripts or generating compliant customer responses).',
      'Paired automated constraint checks (JSON validity, forbidden words, length caps) with rubric scoring.',
    ],
    keyDecisions: [
      {
        decision: 'Use deterministic constraint validators alongside qualitative rubric criteria.',
        rationale:
          'Participants immediately understand why a prompt succeeded or failed when objective checks (e.g. "Must include 3 mitigation rows") are displayed next to the output.',
        tradeOff:
          'Required crafting custom validation test cases for every workshop scenario.',
      },
    ],
    execution: [
      {
        phase: 'Curriculum & Rubric Engine Design',
        deliverable: 'Multi-Round Scenario Bank & Deterministic Scoring Spec',
        outcome: 'Created repeatable challenge modules across PM, Marketing, and Ops tracks.',
      },
      {
        phase: 'Live Arena Web App & Event Execution',
        deliverable: 'Real-Time Submission Portal & Stage Comparison View',
        outcome: 'Executed live competitive sessions with high participant completion and engagement.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'API latency spikes when all participants submit at the round buzzer.',
        mitigation:
          'Implemented queued request throttling with live progress status indicators and staggered round timers.',
      },
    ],
    outcomes: [
      'Trained cross-functional professionals to move from casual prompting to structured, testable AI workflows.',
      'Delivered a reusable educational platform supporting live competitive rounds and post-event case reviews.',
    ],
    lessonsLearned: [
      'Side-by-side comparison of two prompts on the same edge-case input teaches more in 3 minutes than an hour of lecture.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'Prompt Evaluation Rubric & Round Mechanics',
        url: '/cases/prompt-battle#mechanics',
        caption: 'Scoring breakdown combining deterministic schema checks, edge-case traps, and structured output quality.',
        metricsOrSpec: [
          'Evaluation Pillars: Constraint Adherence · Accuracy · Edge-Case Resilience',
          'Format: Timed Multi-Round Scenario Arena',
        ],
      },
    ],
    technologies: ['Next.js', 'TypeScript', 'LLM Evaluation Rubrics', 'Real-Time Scoreboard'],
    publicUrl: '/cases/prompt-battle',
  },
  {
    slug: 'revops-campaign-engine',
    title: 'RevOps Campaign Engine — Automated Multi-Channel Marketing Operations',
    category: ['Marketing Operations', 'Software Systems'],
    summary:
      'End-to-end marketing operations workflow unifying UTM attribution, automated lead qualification routing, and CRM SLA tracking.',
    role: 'Marketing Operations Project Manager',
    period: '2024 — 2025',
    projectStatus: 'Operational Workflow',
    relevanceRank: 6,
    overview:
      'RevOps Campaign Engine standardizes how multi-channel marketing campaigns capture, enrich, score, and route inbound leads to sales representatives without manual spreadsheet exports.',
    context:
      'Marketing campaigns ran across multiple paid and organic channels, but lead capture forms dumped raw rows into disconnected spreadsheets, causing slow sales follow-up and broken attribution.',
    problem:
      'Sales reps received unvalidated leads hours late without campaign context, while marketing could not trace which channel or creative generated qualified pipeline.',
    objectives: [
      'Enforce a standardized UTM and campaign taxonomy before any campaign goes live.',
      'Automate instant lead validation, deduplication, and round-robin CRM assignment.',
      'Track first-response SLA compliance and stage conversion across channels.',
    ],
    constraints: [
      'Had to integrate with existing CRM and landing page tools without purchasing expensive enterprise middleware.',
      'Required zero disruption to active ongoing paid campaigns during migration.',
    ],
    responsibilities: [
      'Audited end-to-end lead flow from ad click to sales qualification.',
      'Designed the standardized campaign naming generator, webhook payload schema, and lead routing rules.',
      'Managed implementation, webhook testing, and sales rep handoff training.',
    ],
    teamAndStakeholders: [
      '1 Marketing Operations PM (Rizal)',
      'Performance Marketers, Content Leads & Outbound/Inbound Sales Reps',
    ],
    approach: [
      'Created a single governed UTM taxonomy builder with validation rules so non-compliant URLs could not be published.',
      'Implemented automated webhook normalization that strips malformed phone/email inputs, checks existing CRM records, and assigns territory owners.',
    ],
    keyDecisions: [
      {
        decision: 'Gate campaign launch approval on mandatory UTM & webhook test verification.',
        rationale:
          'Fixing broken attribution after ad spend is deployed is impossible; pre-launch verification catches 100% of tracking gaps.',
        tradeOff:
          'Added a 15-minute pre-flight QA step to the campaign launch checklist.',
      },
    ],
    execution: [
      {
        phase: 'Taxonomy & Pipeline Audit',
        deliverable: 'Unified Attribution Schema & Lead Lifecycle State Definitions',
        outcome: 'Aligned marketing and sales on a single definition of Marketing Qualified Lead (MQL).',
      },
      {
        phase: 'Automation & SLA Alerting Rollout',
        deliverable: 'Webhook Routing Pipeline & Sales Response Alerting',
        outcome: 'Replaced manual daily CSV imports with automated real-time handoff.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Webhook failures silently dropping inbound leads if downstream CRM API times out.',
        mitigation:
          'Configured dead-letter fallback logging to a monitored backup sheet with automatic retry alerts.',
      },
    ],
    outcomes: [
      'Eliminated manual CSV lead exports between marketing landing pages and sales CRM.',
      'Established 100% campaign UTM attribution consistency across active acquisition channels.',
      'Enabled transparent SLA tracking for inbound lead follow-up.',
    ],
    lessonsLearned: [
      'Marketing operations succeeds when compliance is built into the tool (dropdown generators) rather than policed via manual reminders.',
    ],
    evidence: [
      {
        type: 'diagram',
        title: 'Lead Attribution & Automated CRM Routing Pipeline',
        url: '/cases/revops-campaign-engine#routing',
        caption: 'Flow from Governed UTM Capture → Webhook Validation & Deduplication → Round-Robin Assignment → SLA Escalation.',
        metricsOrSpec: [
          'Handoff Mode: Automated Webhook + Dead-Letter Fallback',
          'Taxonomy: Standardized Source / Medium / Campaign / Creative Schema',
        ],
      },
    ],
    technologies: ['Marketing Operations', 'Webhook Automation', 'CRM Workflows', 'Attribution Modeling'],
    publicUrl: '/cases/revops-campaign-engine',
  },
];

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  scope: string;
  summary: string;
  contributions: string[];
  relatedCaseSlugs: string[];
}

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    id: 'exp-tpm-product',
    role: 'Technical Project Manager — Product & Software Systems',
    organization: 'Digital Product & Systems Delivery',
    period: '2025 — Present',
    scope: 'End-to-End Product Delivery · Cross-Functional Engineering & Design · AI Workflows',
    summary:
      'Leading project execution and systems analysis across multi-outlet SaaS POS, enterprise knowledge management, and talent assessment platforms.',
    contributions: [
      'Directed full project lifecycle from PRD authoring, state machine modeling, and WBS milestone planning to production pilot rollout for mFood POS.',
      'Spearheaded taxonomy governance, RBAC workflow design, and 50-query RAG evaluation rubrics for the DIAMOND KMS enterprise release.',
      'Delivered the Employr competency-based assessment MVP within an 8-week agile release window.',
    ],
    relatedCaseSlugs: ['mfood-pos', 'diamond-kms', 'employr'],
  },
  {
    id: 'exp-ai-education',
    role: 'Project Lead & Workflow Architect — AI & Applied Learning',
    organization: 'AI Workflow Initiatives & Prompt Battle',
    period: '2025 — 2026',
    scope: 'AI Evaluation Systems · Curriculum Architecture · Live Platform Delivery',
    summary:
      'Designing practical AI-enabled operational workflows and interactive evaluation arenas for cross-functional technology teams.',
    contributions: [
      'Architected and launched Prompt Battle, a live competitive prompt engineering and LLM evaluation platform.',
      'Developed deterministic output validation and rubric scoring methodologies for non-technical and technical practitioners.',
    ],
    relatedCaseSlugs: ['prompt-battle', 'diamond-kms'],
  },
  {
    id: 'exp-systems-revops',
    role: 'Project Manager — Field Systems & Marketing Operations',
    organization: 'AgriTech & Growth Operations Projects',
    period: '2024 — 2025',
    scope: 'Supply Chain Digitization · RevOps Automation · Stakeholder Coordination',
    summary:
      'Coordinating field-ready operational software and automated marketing-to-sales data pipelines.',
    contributions: [
      'Managed mobile-first field intake and weighbridge variance reconciliation workflows for Triagro agricultural supply chain tracking.',
      'Built automated UTM governance, webhook lead deduplication, and CRM handoff pipelines for the RevOps Campaign Engine.',
    ],
    relatedCaseSlugs: ['triagro', 'revops-campaign-engine'],
  },
];

export interface SystemWorkflowPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  practices: string[];
  toolsUsed: {
    name: string;
    applicationContext: string;
  }[];
  appliedInSlug: string;
  appliedInTitle: string;
}

export const SYSTEMS_WORKFLOWS: SystemWorkflowPillar[] = [
  {
    id: 'sys-planning',
    number: '01',
    title: 'Scope Decomposition & Critical Path Planning',
    subtitle: 'Turning ambiguous business goals into verifiable vertical slices',
    description:
      'Every project begins by separating core operational invariants from nice-to-have surface polish. Scope is decomposed into testable vertical slices with explicit Definition of Done criteria.',
    practices: [
      'Work Breakdown Structure (WBS) mapped to user-visible state transitions rather than isolated frontend/backend tasks.',
      'Explicit Non-Goals documented in every PRD to prevent mid-sprint scope creep.',
      'Three-phase vertical slice delivery: Core Data Contract → Happy-Path Vertical Slice → Failure-Mode & Fallback Hardening.',
    ],
    toolsUsed: [
      {
        name: 'Linear / Jira & Structured PRDs',
        applicationContext: 'Used in mFood POS to sequence offline IndexedDB queuing ahead of secondary reporting dashboards.',
      },
      {
        name: 'State Machine & Sequence Diagrams',
        applicationContext: 'Used to align frontend, backend, and QA on idempotent order sync and KDS ticket acknowledgement.',
      },
    ],
    appliedInSlug: 'mfood-pos',
    appliedInTitle: 'mFood POS — Offline Queue Architecture',
  },
  {
    id: 'sys-risk',
    number: '02',
    title: 'Dependency Governance & Risk Trade-off Matrices',
    subtitle: 'Surfacing constraints early and documenting explicit trade-offs',
    description:
      'Technical and operational risks are tracked as living hypotheses with concrete pre-mortem mitigations, ensuring stakeholders understand why specific architectural trade-offs were chosen.',
    practices: [
      'Pre-mortem failure simulation (e.g. testing POS behavior under deliberate router disconnection or webhook dead-letter fallback).',
      'Decision logs recording Decision, Rationale, and Trade-off so future team members understand historical context.',
      'Hardware, bandwidth, and user ergonomics audited in real field conditions before code freeze.',
    ],
    toolsUsed: [
      {
        name: 'Risk Register & Decision Matrix',
        applicationContext: 'Used in Triagro to select a lightweight PWA with 3-tap field intake over a heavy native mobile build.',
      },
      {
        name: 'Pre-Flight QA Gate Checklists',
        applicationContext: 'Used in RevOps Campaign Engine to block unverified UTM links before paid media launch.',
      },
    ],
    appliedInSlug: 'triagro',
    appliedInTitle: 'Triagro — Field Supply Chain Traceability',
  },
  {
    id: 'sys-ai',
    number: '03',
    title: 'AI-Enabled Workflows & Deterministic Evaluation',
    subtitle: 'Grounding LLMs with verified citations, schemas, and human-in-the-loop rubrics',
    description:
      'AI features are treated as systems engineering problems—never unverified magic. Every LLM workflow is bounded by strict input hygiene, RBAC metadata filtering, citation links, and golden-dataset evaluation.',
    practices: [
      'Citation-first retrieval: every synthesized policy claim must link to an approved source paragraph and effective date.',
      'Golden-dataset regression testing across real edge-case queries before internal deployment.',
      'Explicit refusal states when source documentation is missing or confidence is below threshold.',
    ],
    toolsUsed: [
      {
        name: 'RAG Evaluation Rubrics & Golden Datasets',
        applicationContext: 'Used in DIAMOND KMS to verify 50 real operational escalation queries with zero policy fabrication.',
      },
      {
        name: 'Deterministic Output Validators',
        applicationContext: 'Used in Prompt Battle to score participant prompts against schema, constraint, and edge-case traps.',
      },
    ],
    appliedInSlug: 'diamond-kms',
    appliedInTitle: 'DIAMOND KMS — Enterprise SOP Retrieval',
  },
  {
    id: 'sys-collab',
    number: '04',
    title: 'Cross-Functional Engineering, Design & Ops Rituals',
    subtitle: 'Bridging technical architecture, UX ergonomics, and frontline operations',
    description:
      'Effective project management eliminates translation loss between engineers, product designers, and business stakeholders through shared artifacts, API contracts, and frontline user shadowing.',
    practices: [
      'Joint API & UI contract reviews during Sprint 0 so frontend and backend engineers build in parallel without blocking.',
      'Frontline user shadowing (cashiers, recruiters, field collectors) to ground UX decisions in real operational constraints.',
      'Structured UAT sign-off checklists executed alongside department champions.',
    ],
    toolsUsed: [
      {
        name: 'Figma Wireframes & Behavioral Rubrics',
        applicationContext: 'Used in Employr to align recruiters and hiring managers on 4-point behavioral anchor scorecards.',
      },
      {
        name: 'API Schema & Webhook Contracts',
        applicationContext: 'Used across POS, KMS, and RevOps pipelines to decouple frontend state from backend services.',
      },
    ],
    appliedInSlug: 'employr',
    appliedInTitle: 'Employr — Competency Assessment Pipeline',
  },
];

export const CONTACT_INFO = {
  name: 'Rizal',
  title: 'Technical Project Manager',
  positioning:
    'Working at the intersection of project execution, product development, software systems, and AI-enabled workflows.',
  tagline: 'Explore the work. Understand the thinking. See the impact.',
  email: 'edusales.id@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/rizal-pm/',
  linkedinLabel: 'linkedin.com/in/rizal-pm',
  cvDownloadUrl: '/api/cv',
  location: 'Indonesia · Open to Remote & Hybrid Roles',
  focusAreas: [
    'Technical Project Management & Agile Delivery',
    'Product Scoping, PRD Authoring & Systems Analysis',
    'Software Architecture Alignment & Risk Governance',
    'AI-Enabled Workflows & RAG Evaluation Systems',
  ],
};

// Pure helper functions for filtering, sorting, and lookup (unit-tested)
export function filterAndSortProjects(
  projects: PortfolioProject[],
  options: {
    category?: ProjectCategory | 'All';
    searchQuery?: string;
    sortBy?: 'relevance' | 'title' | 'recent';
  }
): PortfolioProject[] {
  const { category = 'All', searchQuery = '', sortBy = 'relevance' } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const matchesCategory =
      category === 'All' || project.category.includes(category);
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystacks = [
      project.title,
      project.summary,
      project.role,
      project.problem,
      ...project.category,
      ...project.technologies,
    ]
      .join(' ')
      .toLowerCase();

    return haystacks.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'recent') {
      return (b.period || '').localeCompare(a.period || '') || a.relevanceRank - b.relevanceRank;
    }
    return a.relevanceRank - b.relevanceRank;
  });
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
}

export function getRoomById(id: string): RoomMetadata {
  return ROOMS.find((r) => r.id === id) || ROOMS[0];
}

export function validateCaseStudyCompleteness(project: PortfolioProject): {
  valid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  if (!project.overview) missingFields.push('overview');
  if (!project.context) missingFields.push('context');
  if (!project.problem) missingFields.push('problem');
  if (!project.objectives?.length) missingFields.push('objectives');
  if (!project.constraints?.length) missingFields.push('constraints');
  if (!project.role) missingFields.push('role');
  if (!project.teamAndStakeholders?.length) missingFields.push('teamAndStakeholders');
  if (!project.approach?.length) missingFields.push('approach');
  if (!project.keyDecisions?.length) missingFields.push('keyDecisions');
  if (!project.execution?.length) missingFields.push('execution');
  if (!project.risksAndTradeOffs?.length) missingFields.push('risksAndTradeOffs');
  if (!project.outcomes?.length) missingFields.push('outcomes');
  if (!project.lessonsLearned?.length) missingFields.push('lessonsLearned');
  if (!project.evidence?.length) missingFields.push('evidence');

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
