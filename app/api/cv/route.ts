import { NextResponse } from 'next/server';

const CV_TEXT = `================================================================================
RIZAL — TECHNICAL PROJECT MANAGER & SYSTEMS ARCHITECT
================================================================================
Location: Jakarta, Indonesia (Remote & Hybrid Ready)
Email: edusales.id@gmail.com
LinkedIn: https://linkedin.com/in/rizal-pm
Portfolio: RIZAL OS — Virtual Office Portfolio

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
Technical Project Manager working at the intersection of project execution,
product development, software systems, and AI-enabled workflows. Experienced in
translating complex operational constraints into structured roadmaps, managing
cross-functional engineering and design teams, mitigating technical dependencies,
and shipping verifiable product outcomes across SaaS, F&B POS, EdTech, AgriTech,
and Knowledge Management domains.

Core Principle: Explore the work. Understand the thinking. See the impact.

--------------------------------------------------------------------------------
SELECTED PROJECTS & VERIFIED CASE STUDIES
--------------------------------------------------------------------------------

1. mFood POS — Multi-Outlet Cloud Point of Sale & Kitchen Sync
   Role: Technical Project Manager | Category: Product/SaaS, Software Systems
   Status: Production Pilot Deployed
   - Coordinated end-to-end delivery of an offline-tolerant cloud POS and kitchen
     display system (KDS) for multi-branch F&B operators.
   - Defined local-first IndexedDB queuing architecture with engineering to
     prevent order loss during peak-hour Wi-Fi drops.
   - Reduced order-to-kitchen ticket routing discrepancies to zero across pilot
     branches and cut cashier onboarding training time from 3 days to 4 hours.

2. DIAMOND KMS — Enterprise Knowledge Management & SOP Retrieval System
   Role: Project Manager & Systems Analyst | Category: Software Systems, AI
   Status: Internal Enterprise Release
   - Led discovery, taxonomy structuring, and delivery of a centralized SOP and
     operational knowledge platform with semantic search grounding.
   - Established role-based document governance and version-controlled approval
     workflows across 4 operational departments.
   - Replaced fragmented spreadsheet and chat-based SOP lookups with verified
     citation-backed document retrieval.

3. Employr — Competency-Based Talent Matching & Assessment Pipeline
   Role: Product & Project Manager | Category: Product/SaaS, AI
   Status: MVP Shipped
   - Managed scope, sprint execution, and rubric standardization for a structured
     candidate evaluation and recruitment workflow platform.
   - Collaborated with hiring leads and engineers to replace unstructured CV
     screening with evidence-backed rubric scorecards.
   - Streamlined recruiter shortlist review cycles with transparent candidate
     comparison matrices.

4. Triagro — Field Agronomy Supply Chain & Harvest Tracking System
   Role: Technical Project Manager | Category: Software Systems, Product/SaaS
   Status: Field Validated
   - Directed product scoping and mobile-first low-bandwidth web workflow for
     agricultural field collectors and warehouse coordinators.
   - Designed asynchronous batch sync protocols and simplified 3-step field
     harvest logging for rural cellular conditions.
   - Eliminated manual paper-to-spreadsheet transcription delays between field
     collection points and central inventory.

5. Prompt Battle — Interactive AI Prompt Engineering & Evaluation Arena
   Role: Project Lead & Learning Experience Designer | Category: Educational Projects, AI
   Status: Live Community Event & Platform
   - Conceptualized and delivered a live competitive workshop platform where
     participants solve structured real-world scenarios using LLM workflows.
   - Built deterministic evaluation rubrics testing output accuracy, constraint
     adherence, and edge-case resilience.
   - Trained cross-functional professionals in practical, verifiable AI workflow
     integration.

6. RevOps Campaign Engine — Automated Multi-Channel Marketing Operations
   Role: Marketing Operations Project Manager | Category: Marketing Operations
   Status: Operational Workflow
   - Architected unified lead routing, UTM attribution taxonomy, and automated
     CRM handoff pipelines between marketing and sales teams.
   - Eliminated manual CSV lead exports and established SLA tracking for inbound
     qualification.

--------------------------------------------------------------------------------
SYSTEMS & WORKFLOW COMPETENCIES
--------------------------------------------------------------------------------
- Project Execution: Scope Definition, WBS, Critical Path & Dependency Mapping,
  Sprint Rituals, Risk Register & Trade-off Governance, Release Readiness QA.
- Product & Systems Thinking: PRD Authoring, State Machine Modeling, API & Data
  Contract Alignment, Edge-Case & Fallback Specification.
- AI-Enabled Workflows: Structured Prompt Engineering, RAG Knowledge Base Curation,
  LLM Output Evaluation Rubrics, Human-in-the-Loop Automation.
- Cross-Functional Collaboration: Engineering (Frontend/Backend/QA), Product
  Design (Figma/Design Systems), Business Stakeholders & Operations Leads.
================================================================================
`;

export async function GET() {
  return new NextResponse(CV_TEXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Rizal_Technical_Project_Manager_CV.txt"',
    },
  });
}
