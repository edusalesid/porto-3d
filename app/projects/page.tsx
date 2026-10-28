'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/navigation/TopNav';
import {
  ProjectDirectorySection,
  CaseStudyFullView,
} from '@/components/portfolio/PortfolioSections';
import { PortfolioProject } from '@/lib/portfolio-data';
import { Box } from 'lucide-react';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <TopNav activeRoom="projects" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="text-xs text-slate-400">
            <Link href="/" className="hover:text-sky-400">
              RIZAL OS
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">Project Room Directory</span>
          </div>
          <Link
            href="/?room=projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>View in 3D Project Room</span>
          </Link>
        </div>

        {selectedProject ? (
          <CaseStudyFullView
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <ProjectDirectorySection
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        )}
      </main>
    </div>
  );
}
