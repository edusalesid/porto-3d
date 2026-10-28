'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PORTFOLIO_PROJECTS,
  EXPERIENCE_TIMELINE,
  SYSTEMS_WORKFLOWS,
  CONTACT_INFO,
  ProjectCategory,
  PortfolioProject,
  filterAndSortProjects,
} from '@/lib/portfolio-data';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  ArrowUpRight,
  Search,
  FileText,
  Mail,
  CheckCircle2,
  FolderGit2,
  Layers,
  Briefcase,
  BookOpen,
} from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Product/SaaS',
  'AI',
  'Software Systems',
  'Marketing Operations',
  'Educational Projects',
];

export function LobbyOverviewSection({
  onNavigateRoom,
  onSelectProject,
}: {
  onNavigateRoom?: (roomId: 'projects' | 'systems' | 'experience' | 'cases' | 'contact') => void;
  onSelectProject?: (project: PortfolioProject) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
          01. EXECUTIVE SUMMARY · VIRTUAL LOBBY
        </p>
        <h2
          className="font-display text-2xl sm:text-3xl font-semibold text-[#f7f8f8] tracking-[-0.025em]"
          style={{ textWrap: 'balance' }}
        >
          {CONTACT_INFO.name} — {CONTACT_INFO.title}
        </h2>
        <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed max-w-2xl">
          {CONTACT_INFO.positioning}
        </p>
        <p className="text-xs font-mono text-[#62666d]">
          “{CONTACT_INFO.tagline}”
        </p>
      </div>

      {/* Key Strengths — Linear DESIGN.md 1px bordered surface grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#23252a]">
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a]">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#f7f8f8] mb-1.5">
            01. Project Execution & Governance
          </h3>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            Translating business objectives into WBS vertical slices, dependency matrices, risk registers, and on-time pilot deployments.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a]">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#f7f8f8] mb-1.5">
            02. Product & Systems Thinking
          </h3>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            Authoring comprehensive PRDs, offline-resilient state machines, RBAC workflows, and cross-departmental data contracts.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a]">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#f7f8f8] mb-1.5">
            03. AI-Enabled Operational Workflows
          </h3>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            Designing citation-grounded RAG knowledge bases, deterministic evaluation rubrics, and human-in-the-loop automation.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a]">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#f7f8f8] mb-1.5">
            04. Cross-Functional Collaboration
          </h3>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            Aligning software engineers, product designers, and frontline operators (cashiers, recruiters, field coordinators).
          </p>
        </div>
      </div>

      {/* Quick Room Navigation Grid */}
      <div className="space-y-3 pt-4 border-t border-[#23252a]">
        <h3 className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
          EXPLORE VIRTUAL OFFICE ROOMS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {onNavigateRoom ? (
            <>
              <button
                type="button"
                onClick={() => onNavigateRoom('projects')}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#141516] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34373f] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#f7f8f8]">02. Project Room</div>
                  <div className="text-xs text-[#8a8f98]">6 verified project deliveries & filters</div>
                </div>
                <FolderGit2 className="w-4 h-4 text-[#8a8f98] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('systems')}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#141516] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34373f] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#f7f8f8]">03. Systems Lab</div>
                  <div className="text-xs text-[#8a8f98]">Workflows, risk tracking & AI rubrics</div>
                </div>
                <Layers className="w-4 h-4 text-[#8a8f98] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('experience')}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#141516] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34373f] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#f7f8f8]">04. Experience Gallery</div>
                  <div className="text-xs text-[#8a8f98]">Chronological timeline & role scope</div>
                </div>
                <Briefcase className="w-4 h-4 text-[#8a8f98] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('cases')}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#141516] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34373f] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#f7f8f8]">05. Case Archive</div>
                  <div className="text-xs text-[#8a8f98]">14-point deep-dive PM case studies</div>
                </div>
                <BookOpen className="w-4 h-4 text-[#8a8f98] shrink-0" />
              </button>
            </>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/projects"
                className="px-3.5 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] text-xs font-medium transition-colors"
              >
                Browse Project Directory
              </Link>
              <Link
                href="/cases"
                className="px-3.5 py-1.5 rounded-md bg-[#141516] hover:bg-[#18191a] text-[#f7f8f8] border border-[#23252a] text-xs font-medium transition-colors"
              >
                Read Case Studies
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Featured Case Study Preview */}
      {onSelectProject && (
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-2">
          <div className="text-xs text-[#62666d]">
            <span className="text-[#8a8f98] font-medium">Featured Case Study</span>
            <span aria-hidden="true"> · </span>
            <span>{PORTFOLIO_PROJECTS[0].role}</span>
            <span aria-hidden="true"> · </span>
            <span>{PORTFOLIO_PROJECTS[0].projectStatus}</span>
          </div>
          <h4 className="text-sm font-semibold tracking-[-0.01em] text-[#f7f8f8]">
            {PORTFOLIO_PROJECTS[0].title}
          </h4>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            {PORTFOLIO_PROJECTS[0].summary}
          </p>
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => {
                trackPortfolioEvent('project_opened', {
                  slug: PORTFOLIO_PROJECTS[0].slug,
                });
                onSelectProject(PORTFOLIO_PROJECTS[0]);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8] hover:text-white underline underline-offset-4 decoration-[#5e6ad2] cursor-pointer"
            >
              <span>Inspect Full 14-Point Case Study</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#5e6ad2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectDirectorySection({
  onSelectProject,
}: {
  onSelectProject?: (project: PortfolioProject) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'recent'>('relevance');

  const filteredProjects = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    category: selectedCategory,
    searchQuery,
    sortBy,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
          02. PROJECT ROOM · VERIFIED DELIVERY DIRECTORY
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#f7f8f8] tracking-[-0.02em]">
          Selected Projects & Case Studies
        </h2>
        <p className="text-sm text-[#8a8f98] leading-relaxed">
          Every project card documents verified role scope, publication status, core problem statement, and a complete 14-section case study.
        </p>
      </div>

      {/* Interactive Filter Controls & Search Bar */}
      <div className="space-y-3 pt-3 border-t border-[#23252a]">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <label htmlFor="project-search-input" className="sr-only">
              Search projects by title, role, or technology
            </label>
            <Search className="w-3.5 h-3.5 text-[#62666d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="project-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects (e.g. POS, RAG, IndexedDB, RevOps)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#141516] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="project-sort-select" className="text-xs text-[#62666d] whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="project-sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'relevance' | 'title' | 'recent')
              }
              className="px-2.5 py-1.5 text-xs bg-[#141516] border border-[#23252a] rounded-md text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2]"
            >
              <option value="relevance">Relevance</option>
              <option value="recent">Period (Newest)</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons (Interactive segmented controls) */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#0f1011] rounded-lg border border-[#23252a]"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                    : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#62666d] font-mono tabular-nums">
        Showing {filteredProjects.length} of {PORTFOLIO_PROJECTS.length} verified projects
      </div>

      {/* Project Cards List */}
      {filteredProjects.length === 0 ? (
        <div className="p-8 rounded-lg bg-[#141516] border border-[#23252a] text-center space-y-3">
          <p className="text-sm text-[#8a8f98]">
            No projects match your current filter or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#18191a] text-[#f7f8f8] border border-[#23252a] rounded-md hover:bg-[#23252a] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredProjects.map((project) => (
            <article
              key={project.slug}
              className="p-5 rounded-lg bg-[#141516] border border-[#23252a] hover:border-[#34373f] transition-colors space-y-3"
            >
              {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#62666d]">
                <span className="text-[#f7f8f8] font-medium">
                  {project.category.join(' / ')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8a8f98]">{project.role}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{project.period}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8a8f98]">{project.projectStatus}</span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#f7f8f8]">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                <strong className="text-[#f7f8f8] font-medium">Problem: </strong>
                {project.problem}
              </p>

              {/* Technologies unboxed metadata */}
              <div className="text-xs text-[#8a8f98] pt-0.5">
                <span className="text-[#62666d]">Stack & Methods: </span>
                {project.technologies.join(' · ')}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-[#23252a]">
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => {
                      trackPortfolioEvent('project_opened', { slug: project.slug });
                      onSelectProject(project);
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    View Case Study
                  </button>
                )}
                <Link
                  href={`/cases/${project.slug}`}
                  onClick={() =>
                    trackPortfolioEvent('case_study_viewed', {
                      slug: project.slug,
                      source: 'direct_link',
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Open Standalone Case URL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function SystemsLabSection({
  onSelectProjectSlug,
}: {
  onSelectProjectSlug?: (slug: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
          03. SYSTEMS LAB · WORKFLOWS, RISK & TECHNICAL COLLABORATION
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#f7f8f8] tracking-[-0.02em]">
          Operating System & Execution Methodology
        </h2>
        <p className="text-sm text-[#8a8f98] leading-relaxed">
          Tools are never a substitute for structured thinking. Every methodology and tool listed below is linked directly to how it was applied in a real project.
        </p>
      </div>

      <div className="space-y-4 pt-3 border-t border-[#23252a]">
        {SYSTEMS_WORKFLOWS.map((pillar) => (
          <section
            key={pillar.id}
            className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-4"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
                {pillar.number}. {pillar.subtitle}
              </div>
              <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#f7f8f8]">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-[#f7f8f8]">
                Core Execution Practices
              </h4>
              <ul className="space-y-1.5 text-xs text-[#8a8f98]">
                {pillar.practices.map((prac, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                    <span>{prac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#23252a]">
              <h4 className="text-xs font-medium text-[#f7f8f8]">
                Applied Tools & Artifacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pillar.toolsUsed.map((tool, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-[#0f1011] border border-[#23252a] space-y-1"
                  >
                    <div className="text-xs font-medium text-[#f7f8f8]">
                      {tool.name}
                    </div>
                    <p className="text-xs text-[#8a8f98] leading-relaxed">
                      {tool.applicationContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[#62666d]">
                Verified Application: <strong className="text-[#f7f8f8] font-medium">{pillar.appliedInTitle}</strong>
              </span>
              {onSelectProjectSlug ? (
                <button
                  type="button"
                  onClick={() => onSelectProjectSlug(pillar.appliedInSlug)}
                  className="text-[#f7f8f8] hover:text-white underline underline-offset-4 decoration-[#5e6ad2] font-medium cursor-pointer whitespace-nowrap shrink-0"
                >
                  Inspect Case Evidence →
                </button>
              ) : (
                <Link
                  href={`/cases/${pillar.appliedInSlug}`}
                  className="text-[#f7f8f8] hover:text-white underline underline-offset-4 decoration-[#5e6ad2] font-medium whitespace-nowrap shrink-0"
                >
                  Inspect Case Evidence →
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ExperienceGallerySection({
  onSelectProjectSlug,
}: {
  onSelectProjectSlug?: (slug: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
          04. EXPERIENCE GALLERY · CHRONOLOGICAL TRACK RECORD
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#f7f8f8] tracking-[-0.02em]">
          Professional Roles & Project Engagements
        </h2>
        <p className="text-sm text-[#8a8f98] leading-relaxed">
          Chronological overview of project management roles, operational scope, and verifiable deliverables linked to their respective case studies.
        </p>
      </div>

      <div className="space-y-4 pt-3 border-t border-[#23252a]">
        {EXPERIENCE_TIMELINE.map((item, idx) => (
          <article
            key={item.id}
            className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#62666d]">
              <span className="font-mono text-[#f7f8f8] font-medium tabular-nums">
                0{idx + 1} · {item.period}
              </span>
              <span className="text-[#8a8f98]">{item.organization}</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#f7f8f8]">
              {item.role}
            </h3>

            <p className="text-xs text-[#62666d]">
              Scope: <span className="text-[#8a8f98]">{item.scope}</span>
            </p>

            <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
              {item.summary}
            </p>

            <ul className="space-y-1.5 text-xs text-[#8a8f98] pt-1">
              {item.contributions.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#23252a] flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#62666d]">Related Case Studies:</span>
              {item.relatedCaseSlugs.map((slug) => {
                const proj = PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
                if (!proj) return null;
                return onSelectProjectSlug ? (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => onSelectProjectSlug(slug)}
                    className="text-xs font-medium text-[#f7f8f8] hover:text-white underline underline-offset-4 decoration-[#5e6ad2] cursor-pointer"
                  >
                    {proj.title.split(' — ')[0]}
                  </button>
                ) : (
                  <Link
                    key={slug}
                    href={`/cases/${slug}`}
                    className="text-xs font-medium text-[#f7f8f8] hover:text-white underline underline-offset-4 decoration-[#5e6ad2]"
                  >
                    {proj.title.split(' — ')[0]}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyFullView({
  project,
  onBack,
}: {
  project: PortfolioProject;
  onBack?: () => void;
}) {
  return (
    <article className="space-y-7">
      {onBack && (
        <div>
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 text-xs font-medium bg-[#141516] hover:bg-[#18191a] border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] rounded-md transition-colors cursor-pointer"
          >
            ← Back to Project Directory
          </button>
        </div>
      )}

      {/* Header */}
      <header className="space-y-3 pb-5 border-b border-[#23252a]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#62666d]">
          <span className="text-[#f7f8f8] font-medium">
            {project.category.join(' / ')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#8a8f98]">{project.role}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{project.period}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#8a8f98]">{project.projectStatus}</span>
        </div>

        <h1
          className="font-display text-2xl sm:text-3xl font-semibold text-[#f7f8f8] tracking-[-0.025em]"
          style={{ textWrap: 'balance' }}
        >
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed">
          {project.summary}
        </p>

        <div className="text-xs text-[#8a8f98] pt-1">
          <span className="text-[#62666d]">Technologies & Methods: </span>
          {project.technologies.join(' · ')}
        </div>
      </header>

      {/* 1. Overview & 2. Context & 3. Problem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <section className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">01. OVERVIEW</h2>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            {project.overview}
          </p>
        </section>
        <section className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">02. CONTEXT</h2>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            {project.context}
          </p>
        </section>
        <section className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#f7f8f8]">03. CORE PROBLEM</h2>
          <p className="text-xs text-[#f7f8f8] leading-relaxed font-medium">
            {project.problem}
          </p>
        </section>
      </div>

      {/* 4. Objectives & 5. Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            04. OBJECTIVES & DEFINITION OF SUCCESS
          </h2>
          <ul className="space-y-2 text-xs text-[#8a8f98]">
            {project.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#f7f8f8] tabular-nums">0{i + 1}.</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            05. OPERATIONAL & TECHNICAL CONSTRAINTS
          </h2>
          <ul className="space-y-2 text-xs text-[#8a8f98]">
            {project.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#f7f8f8] tabular-nums">0{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 6. Role & Responsibilities + 7. Team & Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            06. INDIVIDUAL ROLE & RESPONSIBILITIES ({project.role})
          </h2>
          <ul className="space-y-2 text-xs text-[#8a8f98]">
            {project.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            07. TEAM & STAKEHOLDERS
          </h2>
          <ul className="space-y-2 text-xs text-[#8a8f98]">
            {project.teamAndStakeholders.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#62666d]">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 8. Approach */}
      <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
        <h2 className="text-[11px] font-mono text-[#62666d]">
          08. METHODOLOGY & EXECUTION APPROACH
        </h2>
        <ul className="space-y-2 text-xs text-[#8a8f98]">
          {project.approach.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-[#f7f8f8] tabular-nums">0{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 9. Key Decisions & Trade-offs */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#62666d]">
          09. KEY ARCHITECTURAL & PRODUCT DECISIONS
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {project.keyDecisions.map((kd, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-2"
            >
              <div className="text-sm font-medium text-[#f7f8f8]">
                Decision 0{i + 1}: {kd.decision}
              </div>
              <p className="text-xs text-[#8a8f98]">
                <strong className="text-[#f7f8f8] font-medium">Rationale: </strong>
                {kd.rationale}
              </p>
              <p className="text-xs text-[#8a8f98]">
                <strong className="text-[#f7f8f8] font-medium">Trade-off Accepted: </strong>
                {kd.tradeOff}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Execution Milestones */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#62666d]">
          10. EXECUTION PHASES & DELIVERABLES
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {project.execution.map((ex, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#141516] border border-[#23252a] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="text-[11px] font-mono text-[#62666d]">{ex.phase}</div>
                <div className="text-sm font-medium text-[#f7f8f8]">
                  {ex.deliverable}
                </div>
              </div>
              <div className="text-xs text-[#8a8f98] sm:text-right max-w-xs">
                {ex.outcome}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Risks & Mitigations */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#62666d]">
          11. RISK REGISTER & MITIGATION RESPONSES
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {project.risksAndTradeOffs.map((rt, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-1.5"
            >
              <div className="text-xs font-medium text-[#f7f8f8]">
                Risk: {rt.risk}
              </div>
              <div className="text-xs text-[#8a8f98]">
                <strong className="text-[#f7f8f8] font-medium">Mitigation: </strong>
                {rt.mitigation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Verified Outcomes & 13. Lessons Learned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            12. VERIFIED OUTCOMES
          </h2>
          <ul className="space-y-2 text-xs text-[#f7f8f8]">
            {project.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#62666d]">
            13. LESSONS LEARNED & RETROSPECTIVE
          </h2>
          <ul className="space-y-2 text-xs text-[#8a8f98]">
            {project.lessonsLearned.map((l, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#f7f8f8] tabular-nums">0{i + 1}.</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 14. Evidence & Artifacts */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#62666d]">
          14. VERIFIABLE ARTIFACTS & SYSTEM EVIDENCE
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {project.evidence.map((ev, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-2"
            >
              <div className="text-[11px] font-mono text-[#62666d] uppercase">
                Artifact Type: {ev.type}
              </div>
              <h3 className="text-sm font-medium text-[#f7f8f8]">
                {ev.title}
              </h3>
              <p className="text-xs text-[#8a8f98]">{ev.caption}</p>
              {ev.metricsOrSpec && (
                <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-[#8a8f98] border-t border-[#23252a]">
                  {ev.metricsOrSpec.map((spec, idx) => (
                    <span key={idx}>
                      {idx > 0 && <span className="mr-3 text-[#62666d]">·</span>}
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export function ContactLoungeSection() {
  const [copied, setCopied] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  const handleCopyEmail = () => {
    trackPortfolioEvent('contact_clicked', { method: 'copy_email' });
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_INFO.email).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setFormError('Please fill in your name, email, and project/role message.');
      return;
    }
    if (!senderEmail.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    setFormError('');
    trackPortfolioEvent('contact_clicked', { method: 'direct_brief_form' });
    setInquirySent(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
          06. CONTACT LOUNGE · DIRECT COMMUNICATION & CV
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#f7f8f8] tracking-[-0.02em]">
          Initiate a Conversation
        </h2>
        <p className="text-sm text-[#8a8f98] leading-relaxed">
          Available for Project Manager, Technical Project Manager, Product Operations, and Systems Delivery opportunities.
        </p>
      </div>

      {/* Direct Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#23252a]">
        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#62666d]">Direct Email</div>
            <div className="text-xs font-mono text-[#f7f8f8] break-all">
              {CONTACT_INFO.email}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Project%20Management%20Inquiry%20—%20Rizal%20OS`}
              onClick={() =>
                trackPortfolioEvent('contact_clicked', { method: 'mailto' })
              }
              className="px-3 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 text-xs font-medium bg-[#18191a] hover:bg-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#62666d]">Professional Network</div>
            <div className="text-xs font-mono text-[#f7f8f8]">
              {CONTACT_INFO.linkedinLabel}
            </div>
          </div>
          <div>
            <a
              href={CONTACT_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPortfolioEvent('external_link_opened', {
                  destination: 'linkedin',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#18191a] hover:bg-[#23252a] text-[#f7f8f8] border border-[#23252a] rounded-md transition-colors whitespace-nowrap"
            >
              <span>Open LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#62666d]">Curriculum Vitae</div>
            <div className="text-xs text-[#8a8f98]">
              Verified PM Summary & Case Index
            </div>
          </div>
          <div>
            <a
              href={CONTACT_INFO.cvDownloadUrl}
              download="Rizal_Technical_Project_Manager_CV.txt"
              onClick={() =>
                trackPortfolioEvent('cv_downloaded', {
                  source: 'contact_lounge',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Areas of Contribution */}
      <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] space-y-2.5">
        <h3 className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
          CORE AREAS OF PROFESSIONAL CONTRIBUTION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8a8f98]">
          {CONTACT_INFO.focusAreas.map((area, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Role / Project Brief Form */}
      <div className="p-5 rounded-lg bg-[#141516] border border-[#23252a] space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#5e6ad2]" />
            <span>Send a Direct Role or Project Brief</span>
          </h3>
          <p className="text-xs text-[#62666d]">
            Share role requirements or project scope directly from the lounge.
          </p>
        </div>

        {inquirySent ? (
          <div className="p-4 rounded-md bg-[#0f1011] border border-[#23252a] space-y-2">
            <div className="text-xs font-medium text-[#f7f8f8]">
              Brief Recorded for {senderName} ({senderEmail})
            </div>
            <p className="text-xs text-[#8a8f98]">
              Thank you. Your inquiry has been logged and prepared for direct response via {CONTACT_INFO.email}.
            </p>
            <button
              type="button"
              onClick={() => {
                setInquirySent(false);
                setSenderName('');
                setSenderEmail('');
                setMessage('');
              }}
              className="text-xs font-medium text-[#f7f8f8] underline underline-offset-4 decoration-[#5e6ad2] cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleBriefSubmit} className="space-y-3" noValidate>
            {formError && (
              <div
                role="alert"
                className="p-2.5 rounded-md bg-[#0f1011] border border-[#5e6ad2] text-xs text-[#f7f8f8]"
              >
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs text-[#8a8f98] mb-1"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-3 py-1.5 text-xs bg-[#0f1011] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs text-[#8a8f98] mb-1"
                >
                  Work Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-1.5 text-xs bg-[#0f1011] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs text-[#8a8f98] mb-1"
              >
                Role or Project Context
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe the PM role, product challenge, or timeline..."
                className="w-full px-3 py-1.5 text-xs bg-[#0f1011] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors cursor-pointer"
            >
              Submit Brief
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

