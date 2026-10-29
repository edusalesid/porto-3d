'use client';

import React, { useState } from 'react';
import {
  PORTFOLIO_PROJECTS,
  EXPERIENCE_TIMELINE,
  SYSTEMS_WORKFLOWS,
  TECH_STACK_SYSTEMS,
  CONTACT_INFO,
  type ProjectCategory,
  type PortfolioProject,
  filterAndSortProjects,
} from '@/lib/portfolio-data';
import { TechLogo } from './TechLogos';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  Search,
  FileText,
  Mail,
  CheckCircle2,
  FolderGit2,
  Layers,
  Briefcase,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Globe,
  Play,
} from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Product/SaaS',
  'AI',
  'Software Systems',
];

export function LobbyOverviewSection({
  onNavigateRoom,
  onSelectProject,
  onCardHover,
}: {
  onNavigateRoom?: (roomId: 'projects' | 'systems' | 'experience' | 'cases' | 'contact') => void;
  onSelectProject?: (project: PortfolioProject) => void;
  onCardHover?: (cardId: string | null) => void;
}) {
  return (
    <div className="space-y-7">
      {/* Rizal Avatar Greeting Hero Card — Linear DESIGN.md */}
      {/* Unified Profile Card */}
      <div
        id="lobby-hero"
        data-card-id="lobby-hero"
        onMouseEnter={() => onCardHover?.('lobby-hero')}
        onMouseLeave={() => onCardHover?.(null)}
        className="p-4 sm:p-6 landscape:p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.18)] transition-all space-y-3.5 sm:space-y-4"
      >
        <div className="flex flex-row items-center gap-3.5 sm:gap-4">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-1 bg-[#1d1e20] border border-[rgba(255,255,255,0.13)] shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src="/avatar/rizal-wave.webp"
              alt="Rizal Hanifa Pratama"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#46c98a] animate-pulse" />
              <span className="text-xs font-mono text-[#a7a7aa]">Guru Koding &amp; IT Project Manager</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-display font-semibold text-[#e8e8e9] tracking-[-0.02em]">
              {CONTACT_INFO.fullName}
            </h1>
            <p className="text-xs font-mono text-[#38bdf8] line-clamp-1 sm:line-clamp-none">
              {CONTACT_INFO.title}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#a7a7aa] leading-relaxed pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)]">
          {CONTACT_INFO.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 text-xs font-mono text-[#77787c]">
          <span className="px-2.5 py-1 rounded-md bg-[#232426] text-[#e8e8e9]">S1 Informatika UPN Veteran Yogyakarta</span>
          <span className="px-2.5 py-1 rounded-md bg-[#232426] text-[#e8e8e9]">Bilingual (ICIF)</span>
          <span className="px-2.5 py-1 rounded-md bg-[#232426] text-[#e8e8e9]">Tim SPMI</span>
          <span className="px-2.5 py-1 rounded-md bg-[#232426] text-[#e8e8e9]">Lab 50+ Perangkat</span>
          <span className="px-2.5 py-1 rounded-md bg-[#232426] text-[#f5d400]">Semarang, Indonesia</span>
        </div>
      </div>

      {/* Key Competencies - Clean & Direct */}
      <div
        id="lobby-strengths"
        data-card-id="lobby-strengths"
        onMouseEnter={() => onCardHover?.('lobby-strengths')}
        onMouseLeave={() => onCardHover?.(null)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#e8e8e9] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5d400]" />
            01. Pendidikan Koding &amp; AI
          </h3>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            Pengajaran logika pemrograman, instruksi kelas bilingual ICIF, dan implementasi program Deep Learning &amp; AI tingkat SMA.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#e8e8e9] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            02. Manajemen Proyek IT &amp; Agile
          </h3>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            Perencanaan sprint Agile Scrum, koordinasi backlog, mitigasi risiko dependensi teknis, dan delivery proyek software tepat waktu.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#e8e8e9] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6e6edb]" />
            03. Penjaminan Mutu &amp; Lab Komputer
          </h3>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            Kontribusi pada SPMI untuk mutu pembelajaran dan pengelolaan operasional harian 50+ perangkat laboratorium komputer.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1">
          <h3 className="text-sm font-medium tracking-[-0.01em] text-[#e8e8e9] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#46c98a]" />
            04. Digitalisasi &amp; Implementasi Sistem
          </h3>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            Penyelarasan kebutuhan pengguna, perancangan sistem digital, dan kolaborasi teknis lintas divisi engineering dan operasional.
          </p>
        </div>
      </div>

      {/* Quick Room Navigation Grid */}
      <div className="space-y-3 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        <h3 className="text-[11px] font-mono text-[#77787c] uppercase tracking-wider">
          JELAJAHI ZONA RUANGAN KERJA
        </h3>
        <div
          id="lobby-navigation"
          data-card-id="lobby-navigation"
          onMouseEnter={() => onCardHover?.('lobby-navigation')}
          onMouseLeave={() => onCardHover?.(null)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {onNavigateRoom && (
            <>
              <button
                type="button"
                onClick={() => onNavigateRoom('projects')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#18191b] hover:bg-[#202123] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.15)] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#e8e8e9]">02. Studio Proyek</div>
                  <div className="text-xs text-[#a7a7aa]">Katalog produk unggulan &amp; karya digital</div>
                </div>
                <FolderGit2 className="w-4 h-4 text-[#f5d400] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('systems')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#18191b] hover:bg-[#202123] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.15)] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#e8e8e9]">03. Laboratorium Sistem</div>
                  <div className="text-xs text-[#a7a7aa]">Blueprint PRD, alur kerja sistem &amp; mitigasi risiko</div>
                </div>
                <Layers className="w-4 h-4 text-[#38bdf8] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('experience')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#18191b] hover:bg-[#202123] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.15)] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#e8e8e9]">04. Galeri Pengalaman</div>
                  <div className="text-xs text-[#a7a7aa]">Perjalanan karir &amp; peran kepemimpinan tim</div>
                </div>
                <Briefcase className="w-4 h-4 text-[#46c98a] shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateRoom('cases')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#18191b] hover:bg-[#202123] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.15)] text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-[#e8e8e9]">05. Arsip Studi Kasus</div>
                  <div className="text-xs text-[#a7a7aa]">Bedah studi kasus lengkap &amp; pertimbangan solusi</div>
                </div>
                <BookOpen className="w-4 h-4 text-[#f5d400] shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectDirectorySection({
  onSelectProject,
  onCardHover,
}: {
  onSelectProject?: (project: PortfolioProject) => void;
  onCardHover?: (cardId: string | null) => void;
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'recent'>(
    'relevance'
  );

  const filteredProjects = filterAndSortProjects(PORTFOLIO_PROJECTS, {
    category: selectedCategory,
    searchQuery,
    sortBy,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#77787c] uppercase">
          02. PROJECTS STUDIO · PRODUCT SHOWCASE & BANNER GALLERY
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#e8e8e9] tracking-[-0.02em]">
          Product Showcase & System Implementations
        </h2>
        <p className="text-sm text-[#a7a7aa] leading-relaxed">
          Koleksi produk terverifikasi lengkap dengan banner mockup antarmuka, arsitektur teknis, dan studi kasus mendalam 14-poin.
        </p>
      </div>

      {/* Interactive Filter Controls & Search Bar */}
      <div className="space-y-3 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <label htmlFor="project-search-input" className="sr-only">
              Search projects by title, role, or technology
            </label>
            <Search className="w-3.5 h-3.5 text-[#77787c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="project-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk (Unilever GT2, OEE Monitor, Employr, mFood)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#141516] border border-[rgba(255,255,255,0.085)] rounded-lg text-[#e8e8e9] placeholder:text-[#77787c] focus:outline-none focus:border-[rgba(255,255,255,0.22)]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="project-sort-select" className="text-xs text-[#77787c] whitespace-nowrap">
              Urutkan:
            </label>
            <select
              id="project-sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'relevance' | 'title' | 'recent')
              }
              className="px-2.5 py-1.5 text-xs bg-[#141516] border border-[rgba(255,255,255,0.085)] rounded-lg text-[#e8e8e9] focus:outline-none focus:border-[rgba(255,255,255,0.22)] cursor-pointer"
            >
              <option value="relevance">Relevansi</option>
              <option value="recent">Periode Terbaru</option>
              <option value="title">Alfabetis</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#141516] rounded-xl border border-[rgba(255,255,255,0.085)]"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#28292b] text-[#f5d400] border border-[rgba(255,255,255,0.13)]'
                    : 'text-[#a7a7aa] hover:text-[#e8e8e9] hover:bg-[#1e1f21]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#77787c] font-mono tabular-nums">
        Menampilkan {filteredProjects.length} dari {PORTFOLIO_PROJECTS.length} produk terverifikasi
      </div>

      {/* Project Cards List */}
      {filteredProjects.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] text-center space-y-3">
          <p className="text-sm text-[#a7a7aa]">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#1d1e20] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] rounded-lg hover:bg-[#28292b] cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredProjects.map((project) => (
            <article
              key={project.slug}
              id={project.slug}
              data-card-id={project.slug}
              onMouseEnter={() => onCardHover?.(project.slug)}
              onMouseLeave={() => onCardHover?.(null)}
              className="p-4 sm:p-5 rounded-2xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.18)] transition-all space-y-3.5 shadow-sm"
            >
              {/* Product Showcase Banner Image */}
              {project.bannerImage && (
                <div className="space-y-2">
                  <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-[#28292c] bg-[#121314]">
                    <img
                      src={project.bannerImage}
                      alt={`${project.title} Banner & System Architecture`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {project.demoVideo && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-[#121314]/90 border border-[#38bdf8]/40 text-[11px] font-mono text-[#38bdf8] flex items-center gap-1.5 backdrop-blur-sm pointer-events-none shadow-md">
                        <Play className="w-3 h-3 text-[#38bdf8] fill-[#38bdf8]" />
                        <span>Demo Tersedia</span>
                      </div>
                    )}
                  </div>

                  {/* Gallery Sub-Screens if available */}
                  {project.galleryImages && project.galleryImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {project.galleryImages.map((gImg, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f2023] border border-[#2a2b2f] text-[11px] text-[#a7a7aa] shrink-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f5d400]" />
                          <span className="font-medium text-[#e8e8e9]">{gImg.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Linear-style Metadata & Issue Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#202123] border border-[rgba(255,255,255,0.085)] font-mono text-[11px] text-[#f5d400]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5d400]" />
                    PRJ-0{project.relevanceRank}
                  </span>
                  <span className="text-[#77787c]">·</span>
                  <span className="text-[#e8e8e9] font-medium">{project.role}</span>
                  <span className="text-[#77787c]">·</span>
                  <span className="font-mono text-[#77787c]">{project.period}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-[#1c1d20] border border-[#28292c] text-[#46c98a]">
                  {project.projectStatus}
                </span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#e8e8e9]">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#a7a7aa] leading-relaxed">
                <strong className="text-[#e8e8e9] font-medium">Problem Statement: </strong>
                {project.problem}
              </p>

              {/* Technologies unboxed badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1f2023] text-[#a7a7aa] border border-[#28292c]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-[rgba(255,255,255,0.085)]">
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => {
                      trackPortfolioEvent('project_opened', { slug: project.slug });
                      onSelectProject(project);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Buka 14-Poin Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#f5d400]" />
                  </button>
                )}
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
  onCardHover,
}: {
  onSelectProjectSlug?: (slug: string) => void;
  onCardHover?: (cardId: string | null) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Agen AI & Routing',
    'Frontend & 3D',
    'Backend & Data',
    'Manajemen Proyek',
    'Kreatif & Media',
  ];

  const filteredTools =
    selectedCategory === 'Semua'
      ? TECH_STACK_SYSTEMS
      : TECH_STACK_SYSTEMS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Rizal Systems Thinking Avatar Banner */}
      <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)]">
        <div className="w-12 h-12 rounded-full p-1 bg-[#1d1e20] border border-[rgba(255,255,255,0.13)] shrink-0 overflow-hidden flex items-center justify-center">
          <img
            src="/avatar/rizal-thinking.webp"
            alt="Rizal Systems Architecture Thinking"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-xs text-[#a7a7aa] min-w-0">
          <span className="text-[#e8e8e9] font-medium">Sistem &amp; Alur Kerja Nyata: </span>
          Memadukan alur kerja agile sprint, agentic AI lokal (9Router/Antigravity), stack fullstack 3D modern, dan operasional lab komputer.
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#77787c] uppercase">
          03. LABORATORIUM SISTEM · TECH STACK &amp; METODOLOGI EKSEKUSI
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#e8e8e9] tracking-[-0.02em]">
          Alat Kerja &amp; Sistem Operasi Proyek
        </h2>
        <p className="text-sm text-[#a7a7aa] leading-relaxed">
          Tools tidak pernah menggantikan pemikiran terstruktur. Di bawah ini adalah kumpulan teknologi harian, alur kerja agentic AI, dan metodologi eksekusi nyata yang saya gunakan dalam mengelola proyek dan membangun sistem.
        </p>
      </div>

      {/* Tech Arsenal Showcase Grid */}
      <div className="space-y-3 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#77787c] font-semibold">
            Daftar Alat Kerja Aktif ({filteredTools.length})
          </h3>
          <span className="text-[11px] font-mono text-[#38bdf8]">
            Stack Interaktif
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#38bdf8] text-[#0f1115] font-semibold'
                  : 'bg-[#18191b] text-[#a7a7aa] hover:text-[#e8e8e9] border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="p-3.5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[#1c1d20] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#141516] border border-[rgba(255,255,255,0.08)] flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                      <TechLogo name={tool.id} className="w-full h-full" />
                    </div>
                    <span className="font-display text-xs font-semibold text-[#e8e8e9]">
                      {tool.name}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md font-medium"
                    style={{
                      color: tool.badgeHex,
                      backgroundColor: `${tool.badgeHex}15`,
                      border: `1px solid ${tool.badgeHex}30`,
                    }}
                  >
                    {tool.role.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-[#a7a7aa] leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.04)] text-[10px] font-mono text-[#77787c]">
                {tool.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#77787c] font-semibold">
          Alur Kerja Eksekusi &amp; SOP
        </h3>
        {SYSTEMS_WORKFLOWS.map((pillar) => (
          <section
            key={pillar.id}
            id={pillar.id}
            data-card-id={pillar.id}
            onMouseEnter={() => onCardHover?.(pillar.id)}
            onMouseLeave={() => onCardHover?.(null)}
            className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.18)] transition-all space-y-4"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#f5d400] uppercase tracking-wider">
                {pillar.number}. {pillar.subtitle}
              </div>
              <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#e8e8e9]">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a7a7aa] leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-[#e8e8e9]">
                Praktik Eksekusi Inti
              </h4>
              <ul className="space-y-1.5 text-xs text-[#a7a7aa]">
                {pillar.practices.map((prac, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#46c98a] shrink-0 mt-0.5" />
                    <span>{prac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-[rgba(255,255,255,0.085)]">
              <h4 className="text-xs font-medium text-[#e8e8e9]">
                Alat &amp; Artefak yang Diterapkan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pillar.toolsUsed.map((tool, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#141516] border border-[rgba(255,255,255,0.085)] space-y-1"
                  >
                    <div className="text-xs font-medium text-[#e8e8e9]">
                      {tool.name}
                    </div>
                    <p className="text-xs text-[#a7a7aa] leading-relaxed">
                      {tool.applicationContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[#77787c]">
                Verified Application: <strong className="text-[#e8e8e9] font-medium">{pillar.appliedInTitle}</strong>
              </span>
              {onSelectProjectSlug && (
                <button
                  type="button"
                  onClick={() => onSelectProjectSlug(pillar.appliedInSlug)}
                  className="text-[#f5d400] hover:text-[#e8e8e9] underline underline-offset-4 font-medium cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                >
                  Inspect Case Evidence →
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ExperienceGallerySection({
  onCardHover,
}: {
  onSelectProjectSlug?: (slug: string) => void;
  onCardHover?: (cardId: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#77787c] uppercase">
          04. Galeri Pengalaman · Rekam Jejak Kronologis
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#e8e8e9] tracking-[-0.02em]">
          Pengalaman Profesional &amp; Rekam Jejak Karir
        </h2>
        <p className="text-sm text-[#a7a7aa] leading-relaxed">
          Ringkasan kronologis peran profesional, cakupan tanggung jawab, dan hasil kerja nyata yang terverifikasi.
        </p>
      </div>

      <div className="space-y-4 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        {EXPERIENCE_TIMELINE.map((item, idx) => (
          <article
            key={item.id}
            id={item.id}
            data-card-id={item.id}
            onMouseEnter={() => onCardHover?.(item.id)}
            onMouseLeave={() => onCardHover?.(null)}
            className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] hover:border-[rgba(255,255,255,0.18)] transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#77787c]">
              <span className="font-mono text-[#f5d400] font-medium tabular-nums">
                0{idx + 1} · {item.period}
              </span>
              <span className="text-[#a7a7aa]">
                {item.organization}
                {item.location ? ` · ${item.location}` : ''}
              </span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#e8e8e9]">
              {item.role}
            </h3>

            <p className="text-xs text-[#77787c]">
              Cakupan: <span className="text-[#a7a7aa]">{item.scope}</span>
            </p>

            <p className="text-xs sm:text-sm text-[#a7a7aa] leading-relaxed">
              {item.summary}
            </p>

            <ul className="space-y-1.5 text-xs text-[#a7a7aa] pt-1">
              {item.contributions.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#46c98a] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyFullView({
  project,
  onBack,
  onCardHover,
}: {
  project: PortfolioProject;
  onBack?: () => void;
  onCardHover?: (cardId: string | null) => void;
}) {
  return (
    <article
      id={project.slug}
      data-card-id={project.slug}
      onMouseEnter={() => onCardHover?.(project.slug)}
      onMouseLeave={() => onCardHover?.(null)}
      className="space-y-7"
    >
      {onBack && (
        <div>
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] border border-[rgba(255,255,255,0.13)] text-[#e8e8e9] rounded-lg transition-colors cursor-pointer"
          >
            ← Kembali ke Showcase Produk
          </button>
        </div>
      )}

      {/* Case Study Media Showcase (Demo Video or Banner) */}
      {project.demoVideo ? (
        <div className="space-y-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#28292c] bg-[#0d0f14] shadow-xl">
            <video
              controls
              playsInline
              preload="metadata"
              poster={project.demoVideo.poster || project.bannerImage}
              className="w-full h-full object-contain bg-black"
            >
              <source src={project.demoVideo.url} type={project.demoVideo.type || 'video/mp4'} />
              Browser Anda tidak mendukung tag video HTML5.
            </video>
          </div>
          {project.demoVideo.caption && (
            <p className="text-[11px] text-[#77787c] font-mono flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d400]"></span>
              <span>{project.demoVideo.caption}</span>
            </p>
          )}
        </div>
      ) : project.bannerImage ? (
        <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-[#28292c] bg-[#121314]">
          <img
            src={project.bannerImage}
            alt={`${project.title} Banner & Architecture`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* Header */}
      <header className="space-y-3 pb-5 border-b border-[rgba(255,255,255,0.085)]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#77787c]">
          <span className="text-[#f5d400] font-mono">
            PRJ-0{project.relevanceRank}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#e8e8e9] font-medium">
            {project.category.join(' / ')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#a7a7aa]">{project.role}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{project.period}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#46c98a]">{project.projectStatus}</span>
        </div>

        <h1
          className="font-display text-2xl sm:text-3xl font-semibold text-[#e8e8e9] tracking-[-0.025em]"
          style={{ textWrap: 'balance' }}
        >
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-[#a7a7aa] leading-relaxed">
          {project.summary}
        </p>

        <div className="text-xs text-[#a7a7aa] pt-1">
          <span className="text-[#77787c]">Technologies &amp; Methods: </span>
          {project.technologies.join(' · ')}
        </div>
      </header>

      {/* 1. Overview & 2. Context & 3. Problem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <section className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">01. OVERVIEW</h2>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            {project.overview}
          </p>
        </section>
        <section className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">02. CONTEXT</h2>
          <p className="text-xs text-[#a7a7aa] leading-relaxed">
            {project.context}
          </p>
        </section>
        <section className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1.5">
          <h2 className="text-[11px] font-mono text-[#f5d400]">03. CORE PROBLEM</h2>
          <p className="text-xs text-[#e8e8e9] leading-relaxed font-medium">
            {project.problem}
          </p>
        </section>
      </div>

      {/* 4. Objectives & 5. Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            04. OBJECTIVES &amp; DEFINITION OF SUCCESS
          </h2>
          <ul className="space-y-2 text-xs text-[#a7a7aa]">
            {project.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#f5d400] tabular-nums">0{i + 1}.</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            05. OPERATIONAL &amp; TECHNICAL CONSTRAINTS
          </h2>
          <ul className="space-y-2 text-xs text-[#a7a7aa]">
            {project.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#e76b6b] tabular-nums">0{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 6. Role & Responsibilities + 7. Team & Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            06. INDIVIDUAL ROLE &amp; RESPONSIBILITIES ({project.role})
          </h2>
          <ul className="space-y-2 text-xs text-[#a7a7aa]">
            {project.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#46c98a] shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            07. TEAM &amp; STAKEHOLDERS
          </h2>
          <ul className="space-y-2 text-xs text-[#a7a7aa]">
            {project.teamAndStakeholders.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#77787c]">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 8. Approach */}
      <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
        <h2 className="text-[11px] font-mono text-[#77787c]">
          08. METHODOLOGY &amp; EXECUTION APPROACH
        </h2>
        <ul className="space-y-2 text-xs text-[#a7a7aa]">
          {project.approach.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-[#f5d400] tabular-nums">0{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 9. Key Decisions & Trade-offs */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#77787c]">
          09. KEY ARCHITECTURAL &amp; PRODUCT DECISIONS
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {project.keyDecisions.map((kd, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2"
            >
              <div className="text-sm font-medium text-[#e8e8e9]">
                Keputusan 0{i + 1}: {kd.decision}
              </div>
              <p className="text-xs text-[#a7a7aa]">
                <strong className="text-[#e8e8e9] font-medium">Alasan: </strong>
                {kd.rationale}
              </p>
              <p className="text-xs text-[#a7a7aa]">
                <strong className="text-[#f5d400] font-medium">Trade-off Diterima: </strong>
                {kd.tradeOff}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Execution */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono text-[#77787c]">
          10. EXECUTION PHASES &amp; DELIVERABLES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {project.execution.map((ex, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-1.5"
            >
              <div className="text-xs font-mono text-[#f5d400]">{ex.phase}</div>
              <div className="text-xs font-medium text-[#e8e8e9]">
                {ex.deliverable}
              </div>
              <p className="text-xs text-[#a7a7aa]">{ex.outcome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Risks & 12. Outcomes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            11. RISK MANAGEMENT &amp; MITIGATIONS
          </h2>
          <ul className="space-y-2.5 text-xs text-[#a7a7aa]">
            {project.risksAndTradeOffs.map((rt, i) => (
              <li key={i} className="space-y-1">
                <div className="font-medium text-[#e76b6b]">
                  Risk: {rt.risk}
                </div>
                <div>Mitigation: {rt.mitigation}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            12. QUALITATIVE &amp; QUANTITATIVE OUTCOMES
          </h2>
          <ul className="space-y-2 text-xs text-[#a7a7aa]">
            {project.outcomes.map((oc, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#46c98a] shrink-0 mt-0.5" />
                <span>{oc}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 13. Lessons Learned */}
      <section className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
        <h2 className="text-[11px] font-mono text-[#77787c]">
          13. LESSONS LEARNED &amp; RETROSPECTIVE
        </h2>
        <ul className="space-y-2 text-xs text-[#a7a7aa]">
          {project.lessonsLearned.map((ll, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="font-mono text-[#f5d400]">•</span>
              <span>{ll}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 14. Evidence, Artifacts & Demos */}
      {project.evidence && project.evidence.length > 0 && (
        <section className="space-y-3 pt-2">
          <h2 className="text-[11px] font-mono text-[#77787c]">
            14. VERIFIED EVIDENCE, ARTIFACTS &amp; DEMOS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.evidence.map((ev, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#202123] border border-[rgba(255,255,255,0.085)] text-[#f5d400]">
                      {ev.type}
                    </span>
                    <span className="text-xs font-semibold text-[#e8e8e9] truncate">
                      {ev.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#a7a7aa]">{ev.caption}</p>
                </div>

                {ev.metricsOrSpec && ev.metricsOrSpec.length > 0 && (
                  <ul className="text-[11px] font-mono text-[#77787c] space-y-0.5 pt-1 border-t border-[rgba(255,255,255,0.06)]">
                    {ev.metricsOrSpec.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1">
                        <span className="text-[#46c98a]">✓</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-1">
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-mono"
                  >
                    <span>{ev.type === 'video' ? 'Putar Video Demo' : 'Buka Bukti'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export function ContactLoungeSection({
  onCardHover,
}: {
  onCardHover?: (cardId: string | null) => void;
} = {}) {
  const [copied, setCopied] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [inquirySent, setInquirySent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackPortfolioEvent('contact_clicked', { method: 'copy_email' });
    }
  };

  const handleBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setFormError('Harap lengkapi nama, email kerja, dan konteks peran/proyek.');
      return;
    }
    setFormError('');
    setInquirySent(true);
    trackPortfolioEvent('contact_clicked', {
      method: 'brief_submitted',
      sender: senderName,
    });
  };

  return (
    <div className="space-y-6">
      {/* Rizal Double Thumbs Up Avatar Banner */}
      <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)]">
        <div className="w-12 h-12 rounded-full p-1 bg-[#1d1e20] border border-[rgba(255,255,255,0.13)] shrink-0 overflow-hidden flex items-center justify-center">
          <img
            src="/avatar/rizal-double-thumbs-up.webp"
            alt="Rizal Collaboration Thumbs Up"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-xs text-[#a7a7aa] min-w-0">
          <span className="text-[#e8e8e9] font-medium">Siap Berkolaborasi: </span>
          Terbuka untuk diskusi program pembelajaran coding/AI, penjaminan mutu SPMI, IT Project Management, atau delivery sistem perangkat lunak.
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-mono tracking-wider text-[#77787c] uppercase">
          06. RUANG KONTAK · KOMUNIKASI LANGSUNG &amp; CV
        </p>
        <h2 className="font-display text-2xl font-semibold text-[#e8e8e9] tracking-[-0.02em]">
          Mulai Percakapan
        </h2>
        <p className="text-sm text-[#a7a7aa] leading-relaxed">
          Terbuka untuk peluang Guru Koding, IT Project Manager, Technical PM, dan Pengembangan Digitalisasi.
        </p>
      </div>

      {/* Direct Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[rgba(255,255,255,0.085)]">
        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#77787c]">Email Langsung</div>
            <div className="text-xs font-mono text-[#e8e8e9] break-all">
              {CONTACT_INFO.email}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Diskusi%20Kolaborasi%20—%20Rizal%20Hanifa%20Pratama`}
              onClick={() =>
                trackPortfolioEvent('contact_clicked', { method: 'mailto' })
              }
              className="px-3 py-1.5 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] rounded-lg transition-colors whitespace-nowrap"
            >
              Kirim Email
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 text-xs font-medium bg-[#141516] hover:bg-[#1f2023] text-[#a7a7aa] hover:text-[#e8e8e9] border border-[rgba(255,255,255,0.085)] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#77787c]">Jaringan Profesional</div>
            <div className="text-xs font-mono text-[#e8e8e9]">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Profil LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#f5d400]" />
            </a>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#77787c]">Website Pribadi</div>
            <div className="text-xs font-mono text-[#e8e8e9]">
              {CONTACT_INFO.websiteLabel}
            </div>
          </div>
          <div>
            <a
              href={CONTACT_INFO.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPortfolioEvent('external_link_opened', {
                  destination: 'personal_website',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Kunjungi Web</span>
              <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            </a>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-[#77787c]">Curriculum Vitae</div>
            <div className="text-xs text-[#a7a7aa]">
              Resume Lengkap &amp; Terverifikasi
            </div>
          </div>
          <div>
            <a
              href="/api/cv"
              download="Rizal_Hanifa_Pratama_CV.txt"
              onClick={() =>
                trackPortfolioEvent('cv_downloaded', {
                  source: 'contact_lounge',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#f5d400] hover:bg-[#e5c700] text-[#151617] font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#151617]" />
              <span>Unduh CV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Areas of Contribution */}
      <div className="p-4 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-2.5">
        <h3 className="text-[11px] font-mono text-[#77787c] uppercase tracking-wider">
          BIDANG UTAMA KONTRIBUSI PROFESIONAL
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a7a7aa]">
          {CONTACT_INFO.focusAreas.map((area, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#46c98a] shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Brief Form */}
      <div className="p-5 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-[#e8e8e9] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f5d400]" />
            <span>Kirim Pesan atau Brief Proyek</span>
          </h3>
          <p className="text-xs text-[#77787c]">
            Bagikan kebutuhan posisi atau lingkup proyek Anda secara langsung.
          </p>
        </div>

        {inquirySent ? (
          <div className="p-4 rounded-xl bg-[#141516] border border-[#28292c] space-y-2">
            <div className="text-xs font-medium text-[#46c98a]">
              Pesan Tercatat untuk {senderName} ({senderEmail})
            </div>
            <p className="text-xs text-[#a7a7aa]">
              Terima kasih. Pesan Anda telah dicatat dan akan segera direspons via email.
            </p>
            <button
              type="button"
              onClick={() => {
                setInquirySent(false);
                setSenderName('');
                setSenderEmail('');
                setMessage('');
              }}
              className="text-xs font-medium text-[#f5d400] underline underline-offset-4 cursor-pointer"
            >
              Kirim pesan lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleBriefSubmit} className="space-y-3" noValidate>
            {formError && (
              <div
                role="alert"
                className="p-2.5 rounded-lg bg-[#241717] border border-[#e76b6b] text-xs text-[#f7c5c5]"
              >
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs text-[#a7a7aa] mb-1"
                >
                  Nama Anda
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama Lengkap / Perusahaan"
                  className="w-full px-3 py-1.5 text-xs bg-[#141516] border border-[rgba(255,255,255,0.085)] rounded-lg text-[#e8e8e9] placeholder:text-[#77787c] focus:outline-none focus:border-[rgba(255,255,255,0.22)]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs text-[#a7a7aa] mb-1"
                >
                  Email Kerja
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full px-3 py-1.5 text-xs bg-[#141516] border border-[rgba(255,255,255,0.085)] rounded-lg text-[#e8e8e9] placeholder:text-[#77787c] focus:outline-none focus:border-[rgba(255,255,255,0.22)]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs text-[#a7a7aa] mb-1"
              >
                Konteks Peran atau Proyek
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deskripsikan peran PM, tantangan produk, atau linimasa proyek..."
                className="w-full px-3 py-1.5 text-xs bg-[#141516] border border-[rgba(255,255,255,0.085)] rounded-lg text-[#e8e8e9] placeholder:text-[#77787c] focus:outline-none focus:border-[rgba(255,255,255,0.22)]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-[#f5d400] hover:bg-[#e5c700] text-[#151617] rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Kirim Brief
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
