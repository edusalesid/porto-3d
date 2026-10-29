'use client';

import React from 'react';
import type { RoomId } from '@/lib/portfolio-data';
import { trackPortfolioEvent } from '@/lib/analytics';
import type { CameraMode } from '@/components/three/VirtualOfficeCanvas';
import { Map as MapIcon, EyeOff, FileDown, Box } from 'lucide-react';

interface TopNavProps {
  activeRoom?: RoomId;
  cameraMode: CameraMode;
  onChangeCameraMode: (mode: CameraMode) => void;
  showFloorPlan: boolean;
  onToggleFloorPlan: () => void;
  onToggleHide: () => void;
  onSelectRoom?: (roomId: RoomId) => void;
  onOpenRoomDetail?: (roomId: RoomId) => void;
}

export default function TopNav({
  activeRoom,
  cameraMode,
  onChangeCameraMode,
  showFloorPlan,
  onToggleFloorPlan,
  onToggleHide,
  onSelectRoom,
  onOpenRoomDetail,
}: TopNavProps) {
  return (
    <header className="fixed top-2.5 inset-x-2.5 sm:inset-x-4 md:top-3.5 z-30 pointer-events-none flex items-center justify-between gap-2.5">
      {/* Zone 1: Brand & Denah Ruangan */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            if (onSelectRoom) onSelectRoom('lobby');
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#232426] transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#f5d400] animate-pulse" />
          <span className="font-display text-xs sm:text-sm font-semibold tracking-[-0.02em] text-[#e8e8e9]">
            Riizalhp
          </span>
        </button>

        <div className="h-4 w-px bg-[rgba(255,255,255,0.085)]" />

        {/* Denah Ruangan (Deskriptif) */}
        <button
          type="button"
          onClick={onToggleFloorPlan}
          aria-expanded={showFloorPlan}
          title="Denah Ruangan: Peta & deskripsi isi setiap ruangan kerja (Shortcut: M)"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            showFloorPlan
              ? 'bg-[#28292b] text-[#f5d400] border border-[rgba(255,255,255,0.13)]'
              : 'text-[#a7a7aa] hover:text-[#e8e8e9] hover:bg-[#232426]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-[#f5d400]" />
          <span className="whitespace-nowrap">Denah Ruangan</span>
        </button>

        {/* Direct Showcase quick link */}
        <button
          type="button"
          onClick={() => {
            if (onSelectRoom) onSelectRoom('projects');
          }}
          title="Buka Showcase Produk Langsung"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#a7a7aa] hover:text-[#e8e8e9] hover:bg-[#232426] transition-colors cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Showcase</span>
        </button>
      </div>

      {/* Zone 2: Camera Controls (Orbit / FPS / TPS) + Hide + CV */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] shadow-lg backdrop-blur-md overflow-x-auto no-scrollbar">
        {/* Camera mode segmented pills */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#141516] border border-[rgba(255,255,255,0.055)]">
          <button
            type="button"
            onClick={() => onChangeCameraMode('orbit')}
            title="Kamera Orbit 3D (Shortcut: 1)"
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              cameraMode === 'orbit'
                ? 'bg-[#28292b] text-[#e8e8e9] shadow-xs'
                : 'text-[#77787c] hover:text-[#e8e8e9]'
            }`}
          >
            <span className="font-mono text-[10px] text-[#77787c] hidden sm:inline">1</span>
            <span>Orbit</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeCameraMode('fps')}
            title="Kamera First-Person Walkthrough (Shortcut: 2)"
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              cameraMode === 'fps'
                ? 'bg-[#28292b] text-[#e8e8e9] shadow-xs'
                : 'text-[#77787c] hover:text-[#e8e8e9]'
            }`}
          >
            <span className="font-mono text-[10px] text-[#77787c] hidden sm:inline">2</span>
            <span>FPS</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeCameraMode('tps')}
            title="Kamera Third-Person Perspective (Shortcut: 3)"
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              cameraMode === 'tps'
                ? 'bg-[#28292b] text-[#e8e8e9] shadow-xs'
                : 'text-[#77787c] hover:text-[#e8e8e9]'
            }`}
          >
            <span className="font-mono text-[10px] text-[#77787c] hidden sm:inline">3</span>
            <span>TPS</span>
          </button>
        </div>

        <div className="h-4 w-px bg-[rgba(255,255,255,0.085)]" />

        {/* Hide UI (replaces Zen) */}
        <button
          type="button"
          onClick={onToggleHide}
          title="Sembunyikan semua UI (Shortcut: Z)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#a7a7aa] hover:text-[#e8e8e9] hover:bg-[#232426] transition-colors cursor-pointer"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hide</span>
          <span className="font-mono text-[10px] text-[#77787c]">(Z)</span>
        </button>

        {/* CV Download */}
        <a
          href="/api/cv"
          download="Rizal_Technical_PM_CV.pdf"
          onClick={() => trackPortfolioEvent('cv_downloaded', { source: 'top_nav' })}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#e8e8e9] border border-[rgba(255,255,255,0.13)] transition-colors shrink-0"
        >
          <FileDown className="w-3.5 h-3.5 text-[#46c98a]" />
          <span>CV</span>
        </a>
      </div>
    </header>
  );
}
