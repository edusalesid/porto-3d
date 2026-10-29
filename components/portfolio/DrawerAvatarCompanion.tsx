'use client';

import React, { useState, useEffect } from 'react';
import type { RoomId, PortfolioProject } from '@/lib/portfolio-data';
import {
  AVATAR_SPRITES,
  getAvatarMetaForCard,
  type AvatarPose,
  type CardPoseMeta,
} from '@/lib/avatar-companion-data';
import { MessageSquareQuote } from 'lucide-react';

interface DrawerAvatarCompanionProps {
  activeRoom: RoomId;
  activeCaseProject: PortfolioProject | null;
  activeCardId: string | null;
  onSelectCardId?: (cardId: string) => void;
}

export default function DrawerAvatarCompanion({
  activeRoom,
  activeCaseProject,
  activeCardId,
  onSelectCardId,
}: DrawerAvatarCompanionProps) {
  const meta: CardPoseMeta = getAvatarMetaForCard(
    activeRoom,
    activeCardId,
    activeCaseProject
  );

  const [activePose, setActivePose] = useState<AvatarPose>(meta.pose);
  const [displayedQuote, setDisplayedQuote] = useState<string>(meta.quote);
  const [easterEggActive, setEasterEggActive] = useState<boolean>(false);

  // Preload all sprites once on mount so pose swaps are instant
  useEffect(() => {
    Object.values(AVATAR_SPRITES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Sync pose and quote immediately when active card changes
  useEffect(() => {
    if (easterEggActive) return;
    setActivePose(meta.pose);
    setDisplayedQuote(meta.quote);
  }, [meta.id, meta.pose, meta.quote, easterEggActive]);

  // Click Easter Egg reaction
  const handleAvatarClick = () => {
    setEasterEggActive(true);
    setActivePose('thumbsUp');
    setDisplayedQuote('“Semua deliverable, arsitektur sistem, dan metrik bisnis terverifikasi transparan!”');

    setTimeout(() => {
      setEasterEggActive(false);
      setActivePose(meta.pose);
      setDisplayedQuote(meta.quote);
    }, 2800);
  };

  const spriteSrc = AVATAR_SPRITES[activePose] || AVATAR_SPRITES.wave;

  return (
    <div
      aria-label="Interactive Avatar Companion"
      className="drawer-avatar-companion hidden xl:flex flex-1 h-full relative items-center justify-center p-4 lg:p-6 pointer-events-none select-none overflow-hidden"
    >
      {/* Subtle Ambient Glow */}
      <div
        className="absolute w-[240px] h-[240px] rounded-full blur-[80px] pointer-events-none transition-colors duration-500 opacity-20"
        style={{ backgroundColor: meta.accentHex }}
      />

      {/* Main Avatar Stage & Dialogue Anchor */}
      <div className="relative flex flex-col items-center justify-center max-w-[320px] w-full">
        {/* Floating Comic / VN Speech Bubble */}
        <div className="pointer-events-auto relative z-20 w-full mb-3">
          <div className="relative p-3 rounded-xl bg-[#18191b]/95 border border-[rgba(255,255,255,0.1)] shadow-[0_12px_24px_rgba(0,0,0,0.6)] backdrop-blur-md space-y-2">
            {/* Header: Status Badge & Category */}
            <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: meta.accentHex }}
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#e8e8e9] font-medium truncate">
                  {meta.badge}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-[#77787c] shrink-0">
                <MessageSquareQuote className="w-3 h-3 text-[#f5d400]" />
                <span className="text-[#a7a7aa]">{meta.title}</span>
              </div>
            </div>

            {/* Spoken Quote / Commentary */}
            <div className="min-h-[32px] flex items-center">
              <p className="text-xs text-[#e8e8e9] leading-snug font-sans">
                {displayedQuote}
              </p>
            </div>

            {/* Quick Jumps to Cards in this Room */}
            {meta.quickJumps && meta.quickJumps.length > 0 && (
              <div className="pt-1.5 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-mono text-[#77787c]">Lompat:</span>
                {meta.quickJumps.map((jump) => {
                  const isActive = activeCardId === jump.id;
                  return (
                    <button
                      key={jump.id}
                      type="button"
                      onClick={() => onSelectCardId?.(jump.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#f5d400]/20 text-[#f5d400] border border-[#f5d400]/40 font-semibold'
                          : 'bg-[#202123] text-[#a7a7aa] hover:text-[#e8e8e9] hover:bg-[#28292b] border border-[rgba(255,255,255,0.08)]'
                      }`}
                    >
                      {jump.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Speech Bubble Tail pointing down towards Avatar head */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#18191b] border-r border-b border-[rgba(255,255,255,0.1)] rotate-45" />
          </div>
        </div>

        {/* Character Sprite Stage (Static, Compact, Zero continuous animation) */}
        <div
          onClick={handleAvatarClick}
          title="Klik Rizal untuk reaksi interaktif!"
          className="pointer-events-auto relative z-10 cursor-pointer group select-none flex flex-col items-center"
        >
          {/* Static Compact Sprite Frame */}
          <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-end justify-center">
            <img
              src={spriteSrc}
              alt="Rizal Character Avatar"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.7)] transition-opacity duration-150 group-hover:scale-102"
            />
          </div>

          {/* Static Soft Shadow under feet */}
          <div className="w-28 sm:w-32 h-2.5 rounded-full bg-black/45 blur-xs mt-0.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
