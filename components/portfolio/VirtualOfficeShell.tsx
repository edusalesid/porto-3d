'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/navigation/TopNav';
import VirtualOfficeCanvas, {
  CameraMode,
} from '@/components/three/VirtualOfficeCanvas';
import {
  LobbyOverviewSection,
  ProjectDirectorySection,
  SystemsLabSection,
  ExperienceGallerySection,
  CaseStudyFullView,
  ContactLoungeSection,
} from '@/components/portfolio/PortfolioSections';
import {
  ROOMS,
  PORTFOLIO_PROJECTS,
  RoomId,
  PortfolioProject,
  getRoomById,
  getProjectBySlug,
} from '@/lib/portfolio-data';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  X,
  Box,
  ListFilter,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
  Info,
  Map as MapIcon,
  FileDown,
} from 'lucide-react';

export default function VirtualOfficeShell({
  initialRoom = 'lobby',
}: {
  initialRoom?: RoomId;
}) {
  const [activeRoom, setActiveRoom] = useState<RoomId>(initialRoom);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [zenMode, setZenMode] = useState<boolean>(false);

  // Hidden by default so the 100vw x 100vh 3D view is completely unobstructed
  const [showInfoCard, setShowInfoCard] = useState<boolean>(false);
  const [showFloorPlan, setShowFloorPlan] = useState<boolean>(false);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isPlaceSelected, setIsPlaceSelected] = useState<boolean>(false);
  const [sheetDragY, setSheetDragY] = useState<number>(0);
  const [isSheetDragging, setIsSheetDragging] = useState<boolean>(false);
  const sheetTouchStartYRef = useRef<number | null>(null);
  const sheetContentTouchStartYRef = useRef<number | null>(null);
  const mobileSheetScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCaseProject, setActiveCaseProject] =
    useState<PortfolioProject | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Scene loading & error states
  const [sceneStatus, setSceneStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );
  const [sceneErrorReason, setSceneErrorReason] = useState<string>('');
  const [sceneMountKey, setSceneMountKey] = useState<number>(1);

  useEffect(() => {
    trackPortfolioEvent('portfolio_view', { entry: 'home' });

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) {
        setReducedMotion(true);
      }

      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') as RoomId | null;
      const modeParam = params.get('mode');
      const caseParam = params.get('case');

      if (modeParam === '2d' || modeParam === 'list') {
        setViewMode('2d');
      }
      if (roomParam && ROOMS.some((r) => r.id === roomParam)) {
        setActiveRoom(roomParam);
        if (roomParam !== 'lobby') {
          setIsPlaceSelected(true);
          setDrawerOpen(true);
        }
      }
      if (caseParam) {
        const found = getProjectBySlug(caseParam);
        if (found) {
          setActiveRoom('cases');
          setActiveCaseProject(found);
          setIsPlaceSelected(true);
          setDrawerOpen(true);
        }
      }
    }
  }, []);

  // Loading timeout guard
  useEffect(() => {
    if (viewMode !== '3d' || sceneStatus === 'ready' || sceneStatus === 'error') {
      return;
    }
    const timer = window.setTimeout(() => {
      setSceneStatus((current) => {
        if (current === 'loading') {
          setSceneErrorReason(
            '3D workspace initialization exceeded the loading time limit.'
          );
          trackPortfolioEvent('fallback_activated', { reason: 'timeout' });
          return 'error';
        }
        return current;
      });
    }, 9000);

    return () => window.clearTimeout(timer);
  }, [viewMode, sceneStatus, sceneMountKey]);

  // Keyboard shortcuts (Escape closes drawer/zenMode, Z toggles Zen Mode, I toggles Info, M toggles Map)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        if (drawerOpen) {
          setDrawerOpen(false);
          setIsPlaceSelected(false);
          setActiveCaseProject(null);
        } else if (isPlaceSelected) {
          setIsPlaceSelected(false);
        } else if (zenMode) {
          setZenMode(false);
        } else if (showInfoCard) {
          setShowInfoCard(false);
        } else if (showFloorPlan) {
          setShowFloorPlan(false);
        }
      } else if (!drawerOpen && viewMode === '3d') {
        if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') {
          handleChangeCameraMode('orbit');
        } else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') {
          handleChangeCameraMode('fps');
        } else if (e.key === '3' || e.code === 'Digit3' || e.code === 'Numpad3') {
          handleChangeCameraMode('tps');
        } else if (e.key === 'z' || e.key === 'Z') {
          setZenMode((prev) => !prev);
        } else if (e.key === 'i' || e.key === 'I') {
          setShowInfoCard((prev) => !prev);
        } else if (e.key === 'm' || e.key === 'M') {
          setShowFloorPlan((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, isPlaceSelected, zenMode, showInfoCard, showFloorPlan, viewMode]);

  const handleChangeCameraMode = (newMode: CameraMode) => {
    setCameraMode(newMode);
    if (newMode !== 'orbit') {
      setShowInfoCard(false);
      setShowFloorPlan(false);
    }
  };

  const handleSelectRoom = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setActiveCaseProject(null);
    trackPortfolioEvent('room_selected', { room: roomId });
  };

  const handleClickRoom = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setActiveCaseProject(null);
    setIsPlaceSelected(true);
    trackPortfolioEvent('room_selected', { room: roomId, action: 'click_place' });
  };

  const handleOpenRoomDetail = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setIsPlaceSelected(true);
    setDrawerOpen(true);
    trackPortfolioEvent('room_selected', { room: roomId, action: 'open_panel' });
  };

  const handleOpenProjectCase = (project: PortfolioProject) => {
    setActiveCaseProject(project);
    setActiveRoom('cases');
    setIsPlaceSelected(true);
    setDrawerOpen(true);
    trackPortfolioEvent('case_study_viewed', { slug: project.slug });
  };

  const handleSelectProjectSlug = (slug: string) => {
    const found = getProjectBySlug(slug);
    if (found) {
      handleOpenProjectCase(found);
    }
  };

  const currentRoomMeta = getRoomById(activeRoom);

  return (
    <div
      data-state={viewMode === '3d' ? `room-${activeRoom}` : 'list-mode'}
      className={
        viewMode === '3d'
          ? `fixed inset-0 w-screen h-dvh overflow-hidden touch-none bg-[#08090a] text-[#f7f8f8] ${
              cameraMode === 'fps' && !drawerOpen ? 'md:!cursor-none md:[&_*]:!cursor-none' : ''
            }`
          : 'min-h-screen flex flex-col bg-[#08090a] text-[#f7f8f8]'
      }
    >
      {/* Top Bar is ONLY shown in 2D List Mode so 3D mode is 100% Full 1-Page without 01-06 navbar */}
      {viewMode === '2d' && (
        <TopNav
          activeRoom={activeRoom}
          onSelectRoom={(id) => {
            handleSelectRoom(id);
          }}
          onOpenDrawer={(id) => {
            handleOpenRoomDetail(id);
          }}
        />
      )}

      {/* MAIN CONTENT AREA: True 100vw x 100dvh 3D Spatial Mode vs Accessible 2D List Mode */}
      {viewMode === '3d' ? (
        <main className="relative w-full h-full overflow-hidden">
          {/* 3D WebGL Scene Viewport */}
          {sceneStatus !== 'error' && (
            <VirtualOfficeCanvas
              key={sceneMountKey}
              activeRoom={activeRoom}
              reducedMotion={reducedMotion}
              cameraMode={cameraMode}
              zenMode={zenMode}
              showFloorPlan={showFloorPlan}
              isDrawerOpen={drawerOpen}
              isPlaceSelected={isPlaceSelected}
              onChangeCameraMode={handleChangeCameraMode}
              onToggleZenMode={() => setZenMode((z) => !z)}
              onToggleFloorPlan={() => {
                setShowFloorPlan((f) => {
                  const next = !f;
                  if (next) setShowInfoCard(false);
                  return next;
                });
              }}
              onSelectRoom={handleSelectRoom}
              onClickRoom={handleClickRoom}
              onDismissPlace={() => setIsPlaceSelected(false)}
              onOpenRoomDetail={handleOpenRoomDetail}
              onSceneReady={() => {
                setSceneStatus('ready');
                trackPortfolioEvent('scene_ready');
              }}
              onSceneError={(reason) => {
                setSceneErrorReason(reason);
                setSceneStatus('error');
                trackPortfolioEvent('fallback_activated', { reason });
              }}
            />
          )}

          {/* Non-blocking Loading Indicator with Immediate Fallback Action */}
          {sceneStatus === 'loading' && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#08090a]/92 p-6"
            >
              <div className="max-w-md w-full p-6 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-3.5 text-center">
                <div className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
                  RIZAL OS · SPATIAL WORKSPACE
                </div>
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-[#f7f8f8]">
                  Loading 3D Virtual Office...
                </h2>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  Preparing studio rooms, project boards, and case archives. You can wait a moment or switch immediately to the standard portfolio view.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('2d');
                      trackPortfolioEvent('fallback_activated', {
                        reason: 'user_skipped_loading',
                      });
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#18191a] hover:bg-[#23252a] text-[#f7f8f8] border border-[#23252a] rounded-md transition-colors cursor-pointer"
                  >
                    Open Standard Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Specific Error UI with "Open Portfolio" & "Retry 3D" */}
          {sceneStatus === 'error' && (
            <div
              role="alert"
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#08090a] p-6"
            >
              <div className="max-w-md w-full p-6 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-4">
                <div className="flex items-center gap-2 text-[#8a8f98]">
                  <AlertTriangle className="w-4 h-4 text-[#5e6ad2] shrink-0" />
                  <span className="text-[11px] font-mono uppercase tracking-wider">
                    WebGL / 3D Workspace Notice
                  </span>
                </div>
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-[#f7f8f8]">
                  3D workspace could not be loaded.
                </h2>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  Portfolio tetap bisa dijelajahi dalam mode sederhana. All projects, 14-point case studies, systems documentation, and CV downloads remain 100% accessible.
                </p>
                {sceneErrorReason && (
                  <p className="text-xs font-mono text-[#8a8f98] bg-[#141516] p-2.5 rounded-md border border-[#23252a]">
                    Reason: {sceneErrorReason}
                  </p>
                )}
                <div className="pt-1 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors cursor-pointer"
                  >
                    Open Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSceneStatus('loading');
                      setSceneErrorReason('');
                      setSceneMountKey((k) => k + 1);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a] rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry 3D</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COMPACT FLOATING TOP-LEFT BAR — Linear DESIGN.md (#0f1011 surface, #23252a 1px border, #5e6ad2 accent) */}
          {!zenMode && (
            <div className="fixed top-2.5 left-2.5 right-2.5 md:top-3.5 md:left-3.5 md:right-auto z-20 flex flex-col items-stretch md:items-start gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center justify-between md:justify-start gap-1 p-1 rounded-lg bg-[#0f1011] border border-[#23252a]">
                <div className="flex items-center gap-2 px-2 py-1 border-r border-[#23252a] shrink-0">
                  <span className="w-2 h-2 rounded-xs bg-[#5e6ad2]" />
                  <span className="font-display text-xs font-semibold tracking-[-0.02em] text-[#f7f8f8] whitespace-nowrap">
                    RIZAL OS
                  </span>
                </div>

                <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoCard((prev) => {
                        const next = !prev;
                        if (next) setShowFloorPlan(false);
                        return next;
                      });
                    }}
                    aria-expanded={showInfoCard}
                    className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] ${
                      showInfoCard
                        ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowFloorPlan((prev) => {
                        const next = !prev;
                        if (next) setShowInfoCard(false);
                        return next;
                      });
                    }}
                    aria-expanded={showFloorPlan}
                    className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] ${
                      showFloorPlan
                        ? 'bg-[#5e6ad2] text-[#f7f8f8]'
                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a]'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Denah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
                  >
                    <ListFilter className="w-3.5 h-3.5 shrink-0" />
                    <span>2D</span>
                  </button>

                  <a
                    href="/api/cv"
                    download="Rizal_Technical_PM_CV.pdf"
                    onClick={() =>
                      trackPortfolioEvent('cv_downloaded', {
                        source: 'floating_pill',
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium bg-[#141516] hover:bg-[#18191a] text-[#f7f8f8] border border-[#23252a] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2]"
                  >
                    <FileDown className="w-3.5 h-3.5 shrink-0" />
                    <span>CV</span>
                  </a>
                </div>
              </div>

              {/* Expandable Room Info Card — Linear DESIGN.md card */}
              {showInfoCard && (
                <section
                  aria-label="Active Room Summary"
                  className="pointer-events-auto w-full max-w-sm p-3.5 sm:p-4 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#23252a]">
                    <div className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
                      {currentRoomMeta.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInfoCard(false)}
                      className="text-[11px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>

                  <h1 className="font-display text-sm font-semibold tracking-[-0.015em] text-[#f7f8f8] leading-snug">
                    {activeRoom === 'lobby'
                      ? 'Project Execution, Product Systems & AI Workflows'
                      : currentRoomMeta.purpose}
                  </h1>

                  <p className="text-xs text-[#8a8f98] leading-relaxed">
                    {currentRoomMeta.summary}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInfoCard(false);
                        setIsPlaceSelected(true);
                        setDrawerOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors cursor-pointer"
                    >
                      {currentRoomMeta.ctaLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('2d')}
                      className="px-2.5 py-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] underline underline-offset-4 cursor-pointer"
                    >
                      2D List Mode
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* =================================================================
              1. MOBILE SWIPE-UP / SWIPE-DOWN BOTTOM SHEET (< md)
              Hidden by default; only appears when a room/place is clicked!
             ================================================================= */}
          {!zenMode && (
            <>
              {/* Mobile Backdrop when Drawer is Open */}
              <div
                aria-hidden="true"
                onClick={() => {
                  setSheetDragY(0);
                  setIsSheetDragging(false);
                  setDrawerOpen(false);
                  setIsPlaceSelected(false);
                  setActiveCaseProject(null);
                }}
                className={`md:hidden fixed inset-0 z-30 bg-black/70 transition-opacity duration-300 ${
                  drawerOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
              />

              {/* Mobile Swipe-Up / Swipe-Down Sheet Container — Linear DESIGN.md */}
              <div
                role="dialog"
                aria-modal={drawerOpen}
                aria-hidden={!isPlaceSelected && !drawerOpen}
                aria-label={`${currentRoomMeta.name} Mobile Bottom Sheet`}
                style={{
                  transform: drawerOpen
                    ? `translateY(${Math.max(0, sheetDragY)}px)`
                    : isPlaceSelected
                      ? `translateY(calc(100% - 60px + ${Math.max(-620, Math.min(80, sheetDragY))}px))`
                      : 'translateY(100%)',
                }}
                className={`md:hidden fixed inset-x-0 bottom-0 z-40 h-[86dvh] bg-[#08090a] rounded-t-2xl border-t border-[#23252a] flex flex-col overflow-hidden ${
                  !isPlaceSelected && !drawerOpen
                    ? 'pointer-events-none opacity-0 invisible'
                    : 'pointer-events-auto opacity-100 visible'
                } ${
                  isSheetDragging
                    ? ''
                    : 'transition-[transform,opacity,visibility] duration-300 ease-out'
                }`}
              >
                {/* Interactive Swipe-Up / Swipe-Down Handle & Header Bar */}
                <div
                  onTouchStart={(e) => {
                    sheetTouchStartYRef.current = e.touches[0].clientY;
                    setIsSheetDragging(true);
                  }}
                  onTouchMove={(e) => {
                    if (sheetTouchStartYRef.current === null) return;
                    const deltaY =
                      e.touches[0].clientY - sheetTouchStartYRef.current;
                    if (!drawerOpen) {
                      setSheetDragY(Math.max(-620, Math.min(80, deltaY)));
                    } else if (deltaY > 0) {
                      setSheetDragY(deltaY);
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (sheetTouchStartYRef.current === null) return;
                    const endY =
                      e.changedTouches[0]?.clientY ??
                      sheetTouchStartYRef.current;
                    const finalDeltaY = endY - sheetTouchStartYRef.current;
                    sheetTouchStartYRef.current = null;
                    setIsSheetDragging(false);
                    setSheetDragY(0);

                    if (!drawerOpen) {
                      if (finalDeltaY < -24 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(true);
                      } else if (finalDeltaY > 18) {
                        setIsPlaceSelected(false);
                      }
                    } else {
                      if (finalDeltaY > 32 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(false);
                        setIsPlaceSelected(false);
                        setActiveCaseProject(null);
                      }
                    }
                  }}
                  onPointerDown={(e) => {
                    if (e.pointerType === 'touch') return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    sheetTouchStartYRef.current = e.clientY;
                    setIsSheetDragging(true);
                  }}
                  onPointerMove={(e) => {
                    if (
                      e.pointerType === 'touch' ||
                      sheetTouchStartYRef.current === null
                    )
                      return;
                    const deltaY = e.clientY - sheetTouchStartYRef.current;
                    if (!drawerOpen) {
                      setSheetDragY(Math.max(-620, Math.min(80, deltaY)));
                    } else if (deltaY > 0) {
                      setSheetDragY(deltaY);
                    }
                  }}
                  onPointerUp={(e) => {
                    if (
                      e.pointerType === 'touch' ||
                      sheetTouchStartYRef.current === null
                    )
                      return;
                    const finalDeltaY = e.clientY - sheetTouchStartYRef.current;
                    sheetTouchStartYRef.current = null;
                    setIsSheetDragging(false);
                    setSheetDragY(0);

                    if (!drawerOpen) {
                      if (finalDeltaY < -24 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(true);
                      } else if (finalDeltaY > 18) {
                        setIsPlaceSelected(false);
                      }
                    } else {
                      if (finalDeltaY > 32 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(false);
                        setIsPlaceSelected(false);
                        setActiveCaseProject(null);
                      }
                    }
                  }}
                  aria-label={
                    drawerOpen
                      ? 'Swipe down untuk menutup detail ruangan'
                      : 'Swipe up untuk membuka detail ruangan'
                  }
                  className="h-[60px] px-4 bg-[#0f1011] border-b border-[#23252a] flex flex-col justify-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                >
                  {/* Handle Bar Indicator */}
                  <div className="flex flex-col items-center justify-center mb-1.5">
                    <div className="w-9 h-1 rounded-full bg-[#34373f]" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-xs shrink-0"
                        style={{ backgroundColor: currentRoomMeta.accentHex }}
                      />
                      <span className="font-display text-xs font-medium tracking-[-0.01em] text-[#f7f8f8] truncate">
                        {activeCaseProject
                          ? activeCaseProject.title
                          : currentRoomMeta.name}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-medium tracking-wider text-[#8a8f98] shrink-0">
                      {drawerOpen
                        ? '▼ SWIPE DOWN TUTUP'
                        : '▲ SWIPE UP DETAIL'}
                    </span>
                  </div>
                </div>

                {/* Mobile Scrollable Content */}
                <div
                  ref={mobileSheetScrollRef}
                  onTouchStart={(e) => {
                    if (
                      drawerOpen &&
                      (mobileSheetScrollRef.current?.scrollTop ?? 0) <= 2
                    ) {
                      sheetContentTouchStartYRef.current =
                        e.touches[0].clientY;
                    } else {
                      sheetContentTouchStartYRef.current = null;
                    }
                  }}
                  onTouchMove={(e) => {
                    if (sheetContentTouchStartYRef.current === null) return;
                    const deltaY =
                      e.touches[0].clientY -
                      sheetContentTouchStartYRef.current;
                    if (
                      deltaY > 6 &&
                      (mobileSheetScrollRef.current?.scrollTop ?? 0) <= 0
                    ) {
                      setIsSheetDragging(true);
                      setSheetDragY(deltaY);
                    } else if (deltaY < -4) {
                      sheetContentTouchStartYRef.current = null;
                      setIsSheetDragging(false);
                      setSheetDragY(0);
                    }
                  }}
                  onTouchEnd={() => {
                    if (sheetContentTouchStartYRef.current === null) return;
                    if (sheetDragY > 50) {
                      setDrawerOpen(false);
                      setIsPlaceSelected(false);
                      setActiveCaseProject(null);
                    }
                    sheetContentTouchStartYRef.current = null;
                    setIsSheetDragging(false);
                    setSheetDragY(0);
                  }}
                  className="flex-1 overflow-y-auto p-4 pb-10"
                >
                  {activeCaseProject ? (
                    <CaseStudyFullView
                      project={activeCaseProject}
                      onBack={() => {
                        setActiveCaseProject(null);
                        setActiveRoom('projects');
                      }}
                    />
                  ) : activeRoom === 'lobby' ? (
                    <LobbyOverviewSection
                      onNavigateRoom={(rId) => setActiveRoom(rId)}
                      onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    />
                  ) : activeRoom === 'projects' ? (
                    <ProjectDirectorySection
                      onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    />
                  ) : activeRoom === 'systems' ? (
                    <SystemsLabSection
                      onSelectProjectSlug={handleSelectProjectSlug}
                    />
                  ) : activeRoom === 'experience' ? (
                    <ExperienceGallerySection
                      onSelectProjectSlug={handleSelectProjectSlug}
                    />
                  ) : activeRoom === 'cases' ? (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
                          CASE ARCHIVE · 14-POINT DEEP-DIVE STUDIES
                        </p>
                        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#f7f8f8]">
                          Select a Case Study to Inspect
                        </h2>
                        <p className="text-xs text-[#8a8f98] leading-relaxed">
                          Every case study follows a rigorous 14-point structure: Overview, Context, Problem, Objectives, Constraints, Individual Role, Team, Approach, Key Decisions, Execution, Risks, Outcomes, Lessons Learned, and Evidence.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {PORTFOLIO_PROJECTS.map((proj) => (
                          <div
                            key={proj.slug}
                            className="p-4 rounded-lg bg-[#141516] border border-[#23252a] flex flex-col justify-between gap-3.5"
                          >
                            <div className="space-y-1.5">
                              <div className="text-xs text-[#62666d]">
                                <span className="text-[#8a8f98] font-medium">
                                  {proj.category.join(' / ')}
                                </span>
                                <span> · {proj.role} · </span>
                                <span className="font-mono tabular-nums">{proj.period}</span>
                              </div>
                              <h3 className="font-display text-sm font-semibold tracking-[-0.015em] text-[#f7f8f8]">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-[#8a8f98] leading-relaxed">
                                {proj.summary}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenProjectCase(proj)}
                                className="px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Read 14-Point Case
                              </button>
                              <Link
                                href={`/cases/${proj.slug}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] bg-[#18191a] border border-[#23252a] rounded-md whitespace-nowrap"
                              >
                                <span>Direct URL</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ContactLoungeSection />
                  )}
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              2. DESKTOP RIGHT SLIDE-OVER DRAWER (md+ only) — Linear DESIGN.md
             ================================================================= */}
          {drawerOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${currentRoomMeta.name} Content Panel`}
              className="hidden md:flex fixed inset-0 z-40 justify-end bg-black/70 touch-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setDrawerOpen(false);
                  setIsPlaceSelected(false);
                  setActiveCaseProject(null);
                }
              }}
            >
              <div className="relative w-full max-w-3xl h-full bg-[#08090a] border-l border-[#23252a] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                <div className="px-6 py-3.5 bg-[#0f1011] border-b border-[#23252a] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-xs shrink-0"
                      style={{ backgroundColor: currentRoomMeta.accentHex }}
                    />
                    <span className="font-display text-sm font-medium tracking-[-0.015em] text-[#f7f8f8] truncate">
                      {activeCaseProject
                        ? activeCaseProject.title
                        : currentRoomMeta.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setIsPlaceSelected(false);
                      setActiveCaseProject(null);
                    }}
                    aria-label="Close Room Panel"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141516] hover:bg-[#18191a] border border-[#23252a] text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tutup</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  {activeCaseProject ? (
                    <CaseStudyFullView
                      project={activeCaseProject}
                      onBack={() => {
                        setActiveCaseProject(null);
                        setActiveRoom('projects');
                      }}
                    />
                  ) : activeRoom === 'lobby' ? (
                    <LobbyOverviewSection
                      onNavigateRoom={(rId) => setActiveRoom(rId)}
                      onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    />
                  ) : activeRoom === 'projects' ? (
                    <ProjectDirectorySection
                      onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    />
                  ) : activeRoom === 'systems' ? (
                    <SystemsLabSection
                      onSelectProjectSlug={handleSelectProjectSlug}
                    />
                  ) : activeRoom === 'experience' ? (
                    <ExperienceGallerySection
                      onSelectProjectSlug={handleSelectProjectSlug}
                    />
                  ) : activeRoom === 'cases' ? (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-mono tracking-wider text-[#62666d] uppercase">
                          CASE ARCHIVE · 14-POINT DEEP-DIVE STUDIES
                        </p>
                        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#f7f8f8]">
                          Select a Case Study to Inspect
                        </h2>
                        <p className="text-sm text-[#8a8f98] leading-relaxed">
                          Every case study follows a rigorous 14-point structure: Overview, Context, Problem, Objectives, Constraints, Individual Role, Team, Approach, Key Decisions, Execution, Risks, Outcomes, Lessons Learned, and Evidence.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {PORTFOLIO_PROJECTS.map((proj) => (
                          <div
                            key={proj.slug}
                            className="p-5 rounded-lg bg-[#141516] border border-[#23252a] hover:border-[#34373f] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5">
                              <div className="text-xs text-[#62666d]">
                                <span className="text-[#8a8f98] font-medium">
                                  {proj.category.join(' / ')}
                                </span>
                                <span> · {proj.role} · </span>
                                <span className="font-mono tabular-nums">{proj.period}</span>
                              </div>
                              <h3 className="font-display text-base font-semibold tracking-[-0.015em] text-[#f7f8f8]">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-[#8a8f98] leading-relaxed">
                                {proj.summary}
                              </p>
                            </div>
                            <div className="flex sm:flex-col gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenProjectCase(proj)}
                                className="px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Read 14-Point Case
                              </button>
                              <Link
                                href={`/cases/${proj.slug}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] bg-[#18191a] border border-[#23252a] rounded-md whitespace-nowrap"
                              >
                                <span>Direct URL</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ContactLoungeSection />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* ACCESSIBLE 2D LIST-BASED PORTFOLIO MODE — Linear DESIGN.md */
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-14">
          <div className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono text-[#62666d] uppercase tracking-wider">
                STANDARD ACCESSIBLE PORTFOLIO VIEW (2D LIST MODE)
              </div>
              <p className="text-xs text-[#8a8f98]">
                All rooms, projects, 14-point case studies, systems workflows, and contact links are presented in a structured Linear editorial layout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSceneStatus('loading');
                setSceneMountKey((k) => k + 1);
                setViewMode('3d');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] hover:bg-[#6e7ae2] text-[#f7f8f8] rounded-md transition-colors cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Enter 3D Virtual Office</span>
            </button>
          </div>

          {activeCaseProject ? (
            <CaseStudyFullView
              project={activeCaseProject}
              onBack={() => setActiveCaseProject(null)}
            />
          ) : (
            <>
              <section id="lobby">
                <LobbyOverviewSection
                  onSelectProject={(proj) => setActiveCaseProject(proj)}
                />
              </section>

              <hr className="border-[#23252a]" />

              <section id="projects">
                <ProjectDirectorySection
                  onSelectProject={(proj) => setActiveCaseProject(proj)}
                />
              </section>

              <hr className="border-[#23252a]" />

              <section id="systems">
                <SystemsLabSection
                  onSelectProjectSlug={handleSelectProjectSlug}
                />
              </section>

              <hr className="border-[#23252a]" />

              <section id="experience">
                <ExperienceGallerySection
                  onSelectProjectSlug={handleSelectProjectSlug}
                />
              </section>

              <hr className="border-[#23252a]" />

              <section id="contact">
                <ContactLoungeSection />
              </section>
            </>
          )}
        </main>
      )}
    </div>
  );
}

