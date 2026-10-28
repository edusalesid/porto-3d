import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/navigation/TopNav';
import { SystemsLabSection } from '@/components/portfolio/PortfolioSections';
import { Box } from 'lucide-react';

export default function SystemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090a] text-[#f7f8f8]">
      <TopNav activeRoom="systems" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
          <div className="text-xs text-[#62666d]">
            <Link href="/" className="hover:text-[#f7f8f8]">
              RIZAL OS
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#8a8f98]">Systems Lab</span>
          </div>
          <Link
            href="/?room=systems"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141516] hover:bg-[#18191a] border border-[#23252a] text-[#f7f8f8] transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>View in 3D Systems Lab</span>
          </Link>
        </div>

        <SystemsLabSection />
      </main>
    </div>
  );
}

