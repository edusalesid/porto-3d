import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopNav from '@/components/navigation/TopNav';
import { CaseStudyFullView } from '@/components/portfolio/PortfolioSections';
import { PORTFOLIO_PROJECTS, getProjectBySlug } from '@/lib/portfolio-data';
import { Box, ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return PORTFOLIO_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CaseStudySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <TopNav activeRoom="cases" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link
              href="/cases"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-sky-400 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Case Archive</span>
            </Link>
            <span>/</span>
            <span className="text-slate-200">{project.title}</span>
          </div>

          <Link
            href={`/?case=${project.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open in 3D Virtual Office</span>
          </Link>
        </div>

        <CaseStudyFullView project={project} />
      </main>
    </div>
  );
}
