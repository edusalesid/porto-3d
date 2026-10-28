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
    <header className="w-full h-14 px-6 bg-[#0f1011] border-b border-[#23252a] flex items-center justify-between gap-8 z-30 relative">
      {/* Zone 1: Single text element wordmark */}
      <Link
        href="/"
        onClick={(e) => {
          if (onSelectRoom) {
            e.preventDefault();
            onSelectRoom('lobby');
          }
        }}
        className="font-display text-sm font-semibold tracking-[-0.02em] text-[#f7f8f8] hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-xs bg-[#5e6ad2]" />
        <span>RIZAL OS</span>
      </Link>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav
        aria-label="Primary Navigation"
        className="hidden md:flex items-center gap-6 text-xs font-medium text-[#8a8f98]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoom === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b ${
                isActive
                  ? 'text-[#f7f8f8] border-[#5e6ad2] font-medium'
                  : 'text-[#8a8f98] border-transparent hover:text-[#f7f8f8]'
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
          className="px-3 py-1.5 text-xs font-medium text-[#f7f8f8] bg-[#5e6ad2] hover:bg-[#6e7ae2] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
        >
          Download CV
        </a>
      </div>
    </header>
  );
}

