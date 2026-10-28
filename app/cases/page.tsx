import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/navigation/TopNav';
import { PORTFOLIO_PROJECTS } from '@/lib/portfolio-data';
import { Box, ArrowUpRight } from 'lucide-react';

export default function CasesArchiveIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090a] text-[#f7f8f8]">
      <TopNav activeRoom="cases" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
          <div className="text-xs text-[#62666d]">
            <Link href="/" className="hover:text-[#f7f8f8]">
              RIZAL OS
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#8a8f98]">Case Archive (14-Point Deep Dives)</span>
          </div>
          <Link
            href="/?room=cases"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141516] hover:bg-[#18191a] border border-[#23252a] text-[#f7f8f8] transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>View in 3D Case Archive</span>
          </Link>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
            05. CASE ARCHIVE · VERIFIED PM DECISION DOCUMENTATION
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#f7f8f8] tracking-[-0.025em]">
            14-Point Project Management Case Studies
          </h1>
          <p className="text-sm text-[#8a8f98] max-w-3xl leading-relaxed">
            Each study documents problem context, operational constraints, individual responsibilities, architectural decisions, trade-offs, risk mitigations, and verifiable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {PORTFOLIO_PROJECTS.map((project, idx) => (
            <article
              key={project.slug}
              className="p-5 rounded-lg bg-[#141516] border border-[#23252a] hover:border-[#34373f] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="text-xs text-[#62666d]">
                  <span className="font-mono text-[#f7f8f8] tabular-nums">
                    CASE 0{idx + 1}
                  </span>
                  <span> · {project.category.join(' / ')} · </span>
                  <span className="text-[#8a8f98]">{project.role}</span>
                  <span> · </span>
                  <span className="text-[#8a8f98]">{project.projectStatus}</span>
                </div>
                <h2 className="font-display text-lg font-semibold tracking-[-0.015em] text-[#f7f8f8]">
                  {project.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed max-w-2xl">
                  {project.problem}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/cases/${project.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

