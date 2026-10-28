import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/navigation/TopNav';
import { PORTFOLIO_PROJECTS } from '@/lib/portfolio-data';
import { Box, ArrowUpRight } from 'lucide-react';

export default function CasesArchiveIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <TopNav activeRoom="cases" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="text-xs text-slate-400">
            <Link href="/" className="hover:text-sky-400">
              RIZAL OS
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">Case Archive (14-Point Deep Dives)</span>
          </div>
          <Link
            href="/?room=cases"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>View in 3D Case Archive</span>
          </Link>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono tracking-wider text-amber-400">
            05. CASE ARCHIVE · VERIFIED PM DECISION DOCUMENTATION
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-100 tracking-tight">
            14-Point Project Management Case Studies
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Each study documents problem context, operational constraints, individual responsibilities, architectural decisions, trade-offs, risk mitigations, and verifiable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PORTFOLIO_PROJECTS.map((project, idx) => (
            <article
              key={project.slug}
              className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-400">
                  <span className="font-mono text-amber-400 tabular-nums">
                    CASE 0{idx + 1}
                  </span>
                  <span> · {project.category.join(' / ')} · </span>
                  <span>{project.role}</span>
                  <span> · </span>
                  <span className="text-emerald-400">{project.projectStatus}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-100">
                  {project.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {project.problem}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/cases/${project.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
