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
          setDrawerOpen(true);
        }
      }
      if (caseParam) {
        const found = getProjectBySlug(caseParam);
        if (found) {
          setActiveRoom('cases');
          setActiveCaseProject(found);
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
          setActiveCaseProject(null);
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
  }, [drawerOpen, zenMode, showInfoCard, showFloorPlan, viewMode]);

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

  const handleOpenRoomDetail = (roomId: RoomId) => {
    setActiveRoom(roomId);
    setDrawerOpen(true);
    trackPortfolioEvent('room_selected', { room: roomId, action: 'open_panel' });
  };

  const handleOpenProjectCase = (project: PortfolioProject) => {
    setActiveCaseProject(project);
    setActiveRoom('cases');
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
          ? `fixed inset-0 w-screen h-dvh overflow-hidden touch-none bg-[#0B0F17] text-slate-100 ${
              cameraMode === 'fps' && !drawerOpen ? 'md:!cursor-none md:[&_*]:!cursor-none' : ''
            }`
          : 'min-h-screen flex flex-col bg-[#0B0F17] text-slate-100'
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
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F17]/90 p-6"
            >
              <div className="max-w-md w-full p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 text-center shadow-2xl">
                <div className="text-xs font-mono text-sky-400">
                  INITIALIZING RIZAL OS SPATIAL WORKSPACE
                </div>
                <h2 className="font-display text-xl font-bold text-slate-100">
                  Loading 3D Virtual Office...
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Preparing stylized rooms, project boards, and case archives. You can wait a moment or switch immediately to the standard portfolio view.
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
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors cursor-pointer"
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
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F17] p-6"
            >
              <div className="max-w-md w-full p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-2xl">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase">
                    WebGL / 3D Workspace Notice
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-100">
                  3D workspace could not be loaded.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Portfolio tetap bisa dijelajahi dalam mode sederhana. All projects, 14-point case studies, systems documentation, and CV downloads remain 100% accessible.
                </p>
                {sceneErrorReason && (
                  <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    Reason: {sceneErrorReason}
                  </p>
                )}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className="px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry 3D</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COMPACT FLOATING TOP-LEFT PILL (Responsive on Mobile & Desktop, zero room-list bar!) */}
          {!zenMode && (
            <div className="fixed top-2.5 left-2.5 right-2.5 md:top-4 md:left-4 md:right-auto z-20 flex flex-col items-stretch md:items-start gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center justify-between md:justify-start gap-1 p-1 rounded-xl bg-[#0B0F17]/95 border border-slate-700/90 shadow-2xl">
                <div className="flex items-center gap-1.5 px-2 py-1 border-r border-slate-800 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="font-display text-[11px] sm:text-xs font-bold tracking-tight text-slate-100 whitespace-nowrap">
                    RIZAL OS
                  </span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
                    className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      showInfoCard
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-200 hover:bg-slate-800/80'
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
                    className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      showFloorPlan
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Denah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                  >
                    <ListFilter className="w-3.5 h-3.5 text-sky-400 shrink-0" />
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
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors shrink-0"
                  >
                    <FileDown className="w-3.5 h-3.5 shrink-0" />
                    <span>CV</span>
                  </a>
                </div>
              </div>

              {/* Expandable Room Info Card (Hidden by default so 3D view is clean) */}
              {showInfoCard && (
                <section
                  aria-label="Active Room Summary"
                  className="pointer-events-auto w-full max-w-sm p-3.5 sm:p-4 rounded-xl bg-[#0F172A]/96 border border-slate-700/90 shadow-2xl space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-mono text-sky-400">
                      {currentRoomMeta.name.toUpperCase()}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInfoCard(false)}
                      className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>

                  <h1 className="font-display text-sm sm:text-base font-bold text-slate-100 leading-snug">
                    {activeRoom === 'lobby'
                      ? 'Project Execution, Product Systems & AI Workflows'
                      : currentRoomMeta.purpose}
                  </h1>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentRoomMeta.summary}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInfoCard(false);
                        setDrawerOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
                    >
                      {currentRoomMeta.ctaLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('2d')}
                      className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
                    >
                      2D List Mode
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* =================================================================
              1. MOBILE PERSISTENT SWIPE-UP / SWIPE-DOWN BOTTOM SHEET (< md)
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
                  setActiveCaseProject(null);
                }}
                className={`md:hidden fixed inset-0 z-30 bg-black/65 transition-opacity duration-300 ${
                  drawerOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
              />

              {/* Mobile Swipe-Up / Swipe-Down Sheet Container */}
              <div
                role="dialog"
                aria-modal={drawerOpen}
                aria-label={`${currentRoomMeta.name} Mobile Bottom Sheet`}
                style={{
                  transform: drawerOpen
                    ? `translateY(${Math.max(0, sheetDragY)}px)`
                    : `translateY(calc(100% - 62px + ${Math.min(0, sheetDragY)}px))`,
                }}
                className={`md:hidden fixed inset-x-0 bottom-0 z-40 h-[86dvh] bg-[#0B0F17] rounded-t-3xl border-t border-slate-700/90 flex flex-col shadow-2xl overflow-hidden ${
                  isSheetDragging
                    ? ''
                    : 'transition-transform duration-300 ease-out'
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
                    if (!drawerOpen && deltaY < 0) {
                      setSheetDragY(Math.max(-620, deltaY));
                    } else if (drawerOpen && deltaY > 0) {
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
                      // Swipe Up (or quick tap on handle bar) opens the sheet
                      if (finalDeltaY < -24 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(true);
                      }
                    } else {
                      // Swipe Down (or quick tap on handle bar) closes the sheet
                      if (finalDeltaY > 32 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(false);
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
                    if (!drawerOpen && deltaY < 0) {
                      setSheetDragY(Math.max(-620, deltaY));
                    } else if (drawerOpen && deltaY > 0) {
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
                      }
                    } else {
                      if (finalDeltaY > 32 || Math.abs(finalDeltaY) < 6) {
                        setDrawerOpen(false);
                        setActiveCaseProject(null);
                      }
                    }
                  }}
                  aria-label={
                    drawerOpen
                      ? 'Swipe down untuk menutup detail ruangan'
                      : 'Swipe up untuk membuka detail ruangan'
                  }
                  className="h-[62px] px-4 bg-[#0F172A] border-b border-slate-800 flex flex-col justify-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
                >
                  {/* Pill bar + Swipe Gesture Indicator */}
                  <div className="flex flex-col items-center justify-center mb-1">
                    <div className="w-11 h-1.5 rounded-full bg-sky-400/80" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: currentRoomMeta.accentHex }}
                      />
                      <span className="font-display text-xs font-bold text-slate-100 truncate">
                        {activeCaseProject
                          ? activeCaseProject.title
                          : currentRoomMeta.name}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-semibold tracking-wider text-sky-400 shrink-0">
                      {drawerOpen
                        ? '▼ SWIPE DOWN TUTUP'
                        : '▲ SWIPE UP DETAIL'}
                    </span>
                  </div>
                </div>

                {/* Mobile Scrollable Content (Also supports Swipe-Down-to-Close when at scrollTop === 0) */}
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
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <p className="text-xs font-mono tracking-wider text-amber-400">
                          CASE ARCHIVE · 14-POINT DEEP-DIVE STUDIES
                        </p>
                        <h2 className="font-display text-2xl font-bold text-slate-100">
                          Select a Case Study to Inspect
                        </h2>
                        <p className="text-sm text-slate-300">
                          Every case study follows a rigorous 14-point structure: Overview, Context, Problem, Objectives, Constraints, Individual Role, Team, Approach, Key Decisions, Execution, Risks, Outcomes, Lessons Learned, and Evidence.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {PORTFOLIO_PROJECTS.map((proj) => (
                          <div
                            key={proj.slug}
                            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-1.5">
                              <div className="text-xs text-slate-400">
                                <span className="text-amber-400 font-medium">
                                  {proj.category.join(' / ')}
                                </span>
                                <span> · {proj.role} · </span>
                                <span className="font-mono">{proj.period}</span>
                              </div>
                              <h3 className="font-display text-base font-bold text-slate-100">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-slate-300">
                                {proj.summary}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenProjectCase(proj)}
                                className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Read 14-Point Case
                              </button>
                              <Link
                                href={`/cases/${proj.slug}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 rounded-lg whitespace-nowrap"
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
              2. DESKTOP RIGHT SLIDE-OVER DRAWER (md+ only)
             ================================================================= */}
          {drawerOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${currentRoomMeta.name} Content Panel`}
              className="hidden md:flex fixed inset-0 z-40 justify-end bg-black/65 touch-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setDrawerOpen(false);
                  setActiveCaseProject(null);
                }
              }}
            >
              <div className="relative w-full max-w-3xl h-full bg-[#0B0F17] border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
                <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: currentRoomMeta.accentHex }}
                    />
                    <span className="font-display text-sm font-bold text-slate-100 truncate">
                      {activeCaseProject
                        ? activeCaseProject.title
                        : currentRoomMeta.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setActiveCaseProject(null);
                    }}
                    aria-label="Close Room Panel"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
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
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <p className="text-xs font-mono tracking-wider text-amber-400">
                          CASE ARCHIVE · 14-POINT DEEP-DIVE STUDIES
                        </p>
                        <h2 className="font-display text-2xl font-bold text-slate-100">
                          Select a Case Study to Inspect
                        </h2>
                        <p className="text-sm text-slate-300">
                          Every case study follows a rigorous 14-point structure: Overview, Context, Problem, Objectives, Constraints, Individual Role, Team, Approach, Key Decisions, Execution, Risks, Outcomes, Lessons Learned, and Evidence.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {PORTFOLIO_PROJECTS.map((proj) => (
                          <div
                            key={proj.slug}
                            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5">
                              <div className="text-xs text-slate-400">
                                <span className="text-amber-400 font-medium">
                                  {proj.category.join(' / ')}
                                </span>
                                <span> · {proj.role} · </span>
                                <span className="font-mono">{proj.period}</span>
                              </div>
                              <h3 className="font-display text-base font-bold text-slate-100">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-slate-300">
                                {proj.summary}
                              </p>
                            </div>
                            <div className="flex sm:flex-col gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenProjectCase(proj)}
                                className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Read 14-Point Case
                              </button>
                              <Link
                                href={`/cases/${proj.slug}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 rounded-lg whitespace-nowrap"
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
        /* ACCESSIBLE 2D LIST-BASED PORTFOLIO MODE */
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-16">
          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-sky-400">
                STANDARD ACCESSIBLE PORTFOLIO VIEW (2D LIST MODE)
              </div>
              <p className="text-xs text-slate-300">
                All rooms, projects, 14-point case studies, systems workflows, and contact links are presented in a clean editorial layout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSceneStatus('loading');
                setSceneMountKey((k) => k + 1);
                setViewMode('3d');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4" />
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

              <hr className="border-slate-800/80" />

              <section id="projects">
                <ProjectDirectorySection
                  onSelectProject={(proj) => setActiveCaseProject(proj)}
                />
              </section>

              <hr className="border-slate-800/80" />

              <section id="systems">
                <SystemsLabSection
                  onSelectProjectSlug={handleSelectProjectSlug}
                />
              </section>

              <hr className="border-slate-800/80" />

              <section id="experience">
                <ExperienceGallerySection
                  onSelectProjectSlug={handleSelectProjectSlug}
                />
              </section>

              <hr className="border-slate-800/80" />

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
