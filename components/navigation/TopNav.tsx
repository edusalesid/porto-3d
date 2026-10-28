'use client';

import React from 'react';
import Link from 'next/link';
import { RoomId } from '@/lib/portfolio-data';
import { trackPortfolioEvent } from '@/lib/analytics';

interface TopNavProps {
  activeRoom?: RoomId;
  onSelectRoom?: (roomId: RoomId) => void;
  onOpenDrawer?: (roomId: RoomId) => void;
}

const NAV_ITEMS: { id: RoomId; label: string; href: string }[] = [
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'systems', label: 'Systems', href: '/systems' },
  { id: 'experience', label: 'Experience', href: '/experience' },
  { id: 'cases', label: 'Cases', href: '/cases' },
  { id: 'contact', label: 'Contact', href: '/?room=contact' },
];

export default function TopNav({
  activeRoom,
  onSelectRoom,
  onOpenDrawer,
}: TopNavProps) {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { id: RoomId; label: string; href: string }
  ) => {
    if (onSelectRoom) {
      e.preventDefault();
      onSelectRoom(item.id);
      if (onOpenDrawer && item.id !== 'lobby') {
        onOpenDrawer(item.id);
      }
    }
  };

  return (
    <header className="w-full h-16 px-6 bg-[#0B0F17]/95 border-b border-slate-800/80 flex items-center justify-between gap-8 z-30 relative">
      {/* Zone 1: Single text element wordmark */}
      <Link
        href="/"
        onClick={(e) => {
          if (onSelectRoom) {
            e.preventDefault();
            onSelectRoom('lobby');
          }
        }}
        className="font-display text-lg font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
      >
        RIZAL OS
      </Link>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav
        aria-label="Primary Navigation"
        className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoom === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                isActive
                  ? 'text-sky-400 border-sky-400 font-semibold'
                  : 'text-slate-300 border-transparent hover:text-white hover:border-slate-600'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/api/cv"
          download="Rizal_Technical_Project_Manager_CV.txt"
          onClick={() =>
            trackPortfolioEvent('cv_downloaded', { source: 'top_bar' })
          }
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          Download CV
        </a>
      </div>
    </header>
  );
}
