'use client';

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import TopNav from '@/components/navigation/TopNav';
import VisualNovelGreeting from '@/components/portfolio/VisualNovelGreeting';
import DrawerAvatarCompanion from '@/components/portfolio/DrawerAvatarCompanion';
import {
  AVATAR_SPRITES,
  getAvatarMetaForCard,
} from '@/lib/avatar-companion-data';
import type { CameraMode } from '@/components/three/VirtualOfficeCanvas';

const VirtualOfficeCanvas = lazy(
  () => import('@/components/three/VirtualOfficeCanvas')
);
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
  type RoomId,
  type PortfolioProject,
  getRoomById,
  getProjectBySlug,
} from '@/lib/portfolio-data';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  X,
  Box,
  AlertTriangle,
  RotateCcw,
  Map as MapIcon,
  Compass,
} from 'lucide-react';

export default function VirtualOfficeShell({
  initialRoom = 'lobby',
}: {
  initialRoom?: RoomId;
}) {
  const [activeRoom, setActiveRoom] = useState<RoomId>(initialRoom);
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [zenMode, setZenMode] = useState<boolean>(false);

  // Modals & Drawers
  const [showFloorPlan, setShowFloorPlan] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isPlaceSelected, setIsPlaceSelected] = useState<boolean>(false);
  const [activeCaseProject, setActiveCaseProject] =
    useState<PortfolioProject | null>(null);

  // Welcome modal & Controls guide
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);

  // Mobile Bottom Sheet Drag State
  const [sheetDragY, setSheetDragY] = useState<number>(0);
  const [isSheetDragging, setIsSheetDragging] = useState<boolean>(false);
  const sheetTouchStartYRef = useRef<number | null>(null);
  const sheetContentTouchStartYRef = useRef<number | null>(null);
  const mobileSheetScrollRef = useRef<HTMLDivElement | null>(null);

  // Performance & Scene states
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [sceneStatus, setSceneStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );
  const [sceneErrorReason, setSceneErrorReason] = useState<string>('');
  const [sceneMountKey, setSceneMountKey] = useState<number>(1);

  // Active Card & Drawer Companion State
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const desktopDrawerScrollRef = useRef<HTMLDivElement | null>(null);

  // Active card detection inside drawer via IntersectionObserver
  useEffect(() => {
    if (!drawerOpen) {
      setActiveCardId(null);
      setHoveredCardId(null);
      return;
    }

    const scrollEl = desktopDrawerScrollRef.current;
    if (!scrollEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const sorted = [...intersecting].sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          const topEntry = sorted[0];
          const cardId =
            topEntry.target.getAttribute('data-card-id') || topEntry.target.id;
          if (cardId) {
            setActiveCardId(cardId);
          }
        }
      },
      {
        root: scrollEl,
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6, 0.9],
      }
    );

    const cards = scrollEl.querySelectorAll('[data-card-id], article[id]');
    cards.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, [drawerOpen, activeRoom, activeCaseProject]);

  useEffect(() => {
    trackPortfolioEvent('portfolio_view', { entry: 'home' });

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) {
        setReducedMotion(true);
      }

      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room') as RoomId | null;
      const caseParam = params.get('case');

      if (roomParam && ROOMS.some((r) => r.id === roomParam)) {
        setActiveRoom(roomParam);
        if (roomParam !== 'lobby') {
          setIsPlaceSelected(true);
          setDrawerOpen(true);
          setShowWelcomeModal(false);
        }
      }
      if (caseParam) {
        const found = getProjectBySlug(caseParam);
        if (found) {
          setActiveRoom('cases');
          setActiveCaseProject(found);
          setIsPlaceSelected(true);
          setDrawerOpen(true);
          setShowWelcomeModal(false);
        }
      }
    }
  }, []);

  // Loading timeout guard (9s fallback to drawer view if WebGL stalls)
  useEffect(() => {
    if (sceneStatus === 'ready' || sceneStatus === 'error') {
      return;
    }
    const timer = window.setTimeout(() => {
      setSceneStatus((current) => {
        if (current === 'loading') {
          setSceneErrorReason('Inisialisasi 3D melebihi batas waktu.');
          trackPortfolioEvent('fallback_activated', { reason: 'timeout' });
          setDrawerOpen(true);
          return 'error';
        }
        return current;
      });
    }, 9000);

    return () => window.clearTimeout(timer);
  }, [sceneStatus, sceneMountKey]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        if (showWelcomeModal) {
          return;
        } else if (drawerOpen) {
          setDrawerOpen(false);
          setIsPlaceSelected(false);
          setActiveCaseProject(null);
        } else if (showFloorPlan) {
          setShowFloorPlan(false);
        } else if (zenMode) {
          setZenMode(false);
        }
      } else if (!drawerOpen && !showWelcomeModal) {
        if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') {
          handleChangeCameraMode('orbit');
        } else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') {
          handleChangeCameraMode('fps');
        } else if (e.key === '3' || e.code === 'Digit3' || e.code === 'Numpad3') {
          handleChangeCameraMode('tps');
        } else if (e.key === 'z' || e.key === 'Z') {
          setZenMode((prev) => !prev);
        } else if (e.key === 'm' || e.key === 'M') {
          setShowFloorPlan((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, showWelcomeModal, showFloorPlan, zenMode]);

  const handleChangeCameraMode = (newMode: CameraMode) => {
    setCameraMode(newMode);
    if (newMode !== 'orbit') {
      setShowFloorPlan(false);
    }
    trackPortfolioEvent('camera_mode_changed', { mode: newMode });
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

  const handleDismissWelcome = () => {
    setShowWelcomeModal(false);
    setShowControlsGuide(true);
  };

  const currentRoomMeta = getRoomById(activeRoom);

  return (
    <div
      data-state={`room-${activeRoom}`}
      className={`fixed inset-0 w-screen h-dvh overflow-hidden select-none bg-[#121314] text-[#e8e8e9] ${
        cameraMode === 'fps' && !drawerOpen ? 'md:!cursor-none md:[&_*]:!cursor-none' : ''
      }`}
    >
      {/* 1. UNIFIED TOP NAVIGATION (Brand + Denah + Orbit/FPS/TPS + Hide + CV) */}
      {!zenMode && !showWelcomeModal && (
        <TopNav
          activeRoom={activeRoom}
          cameraMode={cameraMode}
          onChangeCameraMode={handleChangeCameraMode}
          showFloorPlan={showFloorPlan}
          onToggleFloorPlan={() => setShowFloorPlan((f) => !f)}
          onToggleHide={() => setZenMode(true)}
          onSelectRoom={handleSelectRoom}
          onOpenRoomDetail={handleOpenRoomDetail}
        />
      )}

      {/* 2. MAIN 3D WORKSPACE STAGE CANVAS */}
      <main className="relative w-full h-full overflow-hidden">
        {sceneStatus !== 'error' && (
          <div
            className={`w-full h-full transition-opacity duration-700 ease-out ${
              sceneStatus === 'ready' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Suspense fallback={null}>
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
                onToggleFloorPlan={() => setShowFloorPlan((f) => !f)}
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
                  setDrawerOpen(true);
                  trackPortfolioEvent('fallback_activated', { reason });
                }}
              />
            </Suspense>
          </div>
        )}

        {/* Loading Indicator — Hanya muncul jika user lewati intro dan 3D masih proses persiapan */}
        {!showWelcomeModal && sceneStatus === 'loading' && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#121314] p-6 animate-in fade-in duration-200"
          >
            <div className="max-w-md w-full p-6 sm:p-7 rounded-2xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-4 text-center shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-[#1d1e20] border border-[rgba(255,255,255,0.13)] overflow-hidden flex items-center justify-center shadow-md">
                <img
                  src="/avatar/rizal-explaining.webp"
                  alt="Rizal Menyiapkan Ruangan"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5d400]/10 border border-[#f5d400]/25 text-[10px] font-mono text-[#f5d400]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5d400] animate-ping" />
                  <span>Sebentar ya, lagi nyiapin ruangan...</span>
                </div>
                <h2 className="font-display text-base sm:text-lg font-semibold tracking-[-0.02em] text-[#e8e8e9]">
                  Menyiapkan Kantor Virtual Buat Kamu
                </h2>
                <p className="text-xs text-[#a7a7aa] leading-relaxed">
                  Lagi beres-beres meja kerja, nyalain lampu warm loft, dan nata galeri produk biar nyaman pas kamu jelajahi.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSceneStatus('ready');
                    setDrawerOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#f5d400] hover:bg-[#e5c700] text-[#151617] rounded-xl transition-colors cursor-pointer"
                >
                  Langsung Buka Portofolio (Drawer)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WebGL Error Notice */}
        {sceneStatus === 'error' && (
          <div
            role="alert"
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#121314] p-6"
          >
            <div className="max-w-md w-full p-6 rounded-2xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-[#a7a7aa]">
                <AlertTriangle className="w-4 h-4 text-[#f5d400] shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider">
                  Mode 3D WebGL Terbatas
                </span>
              </div>
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-[#e8e8e9]">
                Menampilkan Portofolio di Drawer
              </h2>
              <p className="text-xs text-[#a7a7aa] leading-relaxed">
                Seluruh proyek, studi kasus 14-poin, dokumentasi sistem, dan berkas CV tetap dapat diakses 100% melalui panel drawer.
              </p>
              {sceneErrorReason && (
                <p className="text-xs font-mono text-[#a7a7aa] bg-[#141516] p-2.5 rounded-lg border border-[rgba(255,255,255,0.085)]">
                  Catatan: {sceneErrorReason}
                </p>
              )}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="px-4 py-2 text-xs font-semibold bg-[#f5d400] hover:bg-[#e5c700] text-[#151617] rounded-xl transition-colors cursor-pointer"
                >
                  Buka Drawer Portofolio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSceneStatus('loading');
                    setSceneErrorReason('');
                    setSceneMountKey((k) => k + 1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#1d1e20] hover:bg-[#28292b] text-[#a7a7aa] hover:text-[#e8e8e9] border border-[rgba(255,255,255,0.085)] rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi 3D</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. VISUAL NOVEL INTERACTIVE GREETING */}
        {showWelcomeModal && (
          <VisualNovelGreeting
            onDismiss={handleDismissWelcome}
            onSelectOption={(option) => {
              handleDismissWelcome();
              if (option === 'experience') {
                handleSelectRoom('experience');
              } else if (option === 'projects') {
                handleSelectRoom('projects');
              }
            }}
          />
        )}

        {/* 4. CONTROLS GUIDANCE PILL (Featuring rizal-explaining.webp) - Desktop Keyboard Only */}
        {showControlsGuide && !zenMode && !drawerOpen && (
          <div className="control-desktop-guide fixed bottom-4 left-4 z-30 max-w-xs p-3.5 rounded-2xl bg-[#18191b] border border-[rgba(255,255,255,0.085)] shadow-2xl items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150">
            <div className="w-12 h-12 rounded-full p-0.5 bg-[#1d1e20] border border-[rgba(255,255,255,0.13)] shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/avatar/rizal-explaining.webp"
                alt="Rizal Navigation Guidance"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1 text-xs min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#e8e8e9]">Petunjuk Navigasi</span>
                <button
                  type="button"
                  onClick={() => setShowControlsGuide(false)}
                  className="text-[#77787c] hover:text-[#e8e8e9] text-xs p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-[#a7a7aa] leading-relaxed">
                Gunakan <kbd className="px-1 py-0.5 rounded bg-[#202123] text-[#e8e8e9] font-mono text-[10px]">W A S D</kbd> untuk jalan, geser mouse untuk rotasi, dan ketuk ruangan untuk membuka showcase.
              </p>
            </div>
          </div>
        )}

        {/* 5. MOBILE SWIPE-UP / SWIPE-DOWN BOTTOM SHEET (< md) */}
        {!zenMode && (
          <>
            {/* Backdrop */}
            <div
              aria-hidden="true"
              onClick={() => {
                setSheetDragY(0);
                setIsSheetDragging(false);
                setDrawerOpen(false);
                setIsPlaceSelected(false);
                setActiveCaseProject(null);
              }}
              className={`md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-xs transition-opacity duration-200 ${
                drawerOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* Mobile Sheet Container */}
            <div
              role="dialog"
              aria-modal={drawerOpen}
              aria-hidden={!isPlaceSelected && !drawerOpen}
              aria-label={`${currentRoomMeta.name} Mobile Sheet`}
              style={{
                transform: drawerOpen
                  ? `translateY(${Math.max(0, sheetDragY)}px)`
                  : isPlaceSelected
                    ? `translateY(calc(100% - 60px + ${Math.max(-620, Math.min(80, sheetDragY))}px))`
                    : 'translateY(100%)',
              }}
              className={`md:hidden fixed inset-x-0 bottom-0 z-40 h-[86dvh] bg-[#171819] rounded-t-2xl border-t border-[rgba(255,255,255,0.085)] flex flex-col overflow-hidden shadow-2xl ${
                !isPlaceSelected && !drawerOpen
                  ? 'pointer-events-none opacity-0 invisible'
                  : 'pointer-events-auto opacity-100 visible'
              } ${
                isSheetDragging
                  ? ''
                  : 'transition-[transform,opacity,visibility] duration-200 ease-out'
              }`}
            >
              {/* Drag Handle Bar */}
              <div
                onTouchStart={(e) => {
                  sheetTouchStartYRef.current = e.touches[0].clientY;
                  setIsSheetDragging(true);
                }}
                onTouchMove={(e) => {
                  if (sheetTouchStartYRef.current === null) return;
                  const deltaY = e.touches[0].clientY - sheetTouchStartYRef.current;
                  if (!drawerOpen) {
                    setSheetDragY(Math.max(-620, Math.min(80, deltaY)));
                  } else if (deltaY > 0) {
                    setSheetDragY(deltaY);
                  }
                }}
                onTouchEnd={(e) => {
                  if (sheetTouchStartYRef.current === null) return;
                  const endY =
                    e.changedTouches[0]?.clientY ?? sheetTouchStartYRef.current;
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
                className="h-[60px] px-4 bg-[#18191b] border-b border-[rgba(255,255,255,0.085)] flex flex-col justify-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
              >
                <div className="flex flex-col items-center justify-center mb-1.5">
                  <div className="w-9 h-1 rounded-full bg-[#34373f]" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Mini Reactive Avatar */}
                    <div className="w-7 h-7 rounded-full bg-[#1d1e20] border border-[rgba(255,255,255,0.12)] shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        key={hoveredCardId || activeCardId || activeRoom}
                        src={
                          AVATAR_SPRITES[
                            getAvatarMetaForCard(
                              activeRoom,
                              hoveredCardId || activeCardId,
                              activeCaseProject
                            ).pose
                          ]
                        }
                        alt="Rizal Mini Avatar"
                        className="w-full h-full object-contain transition-opacity duration-150"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: currentRoomMeta.accentHex }}
                      />
                      <span className="font-display text-xs font-semibold tracking-[-0.01em] text-[#e8e8e9] truncate">
                        {activeCaseProject
                          ? activeCaseProject.title
                          : currentRoomMeta.name}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] font-medium tracking-wider text-[#a7a7aa] shrink-0">
                    {drawerOpen ? '▼ SWIPE DOWN TUTUP' : '▲ SWIPE UP DETAIL'}
                  </span>
                </div>
              </div>

              {/* Scrollable Mobile Content */}
              <div
                ref={mobileSheetScrollRef}
                className="flex-1 overflow-y-auto p-4 pb-12 select-text"
              >
                {activeCaseProject ? (
                  <CaseStudyFullView
                    project={activeCaseProject}
                    onBack={() => {
                      setActiveCaseProject(null);
                      setActiveRoom('projects');
                    }}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'lobby' ? (
                  <LobbyOverviewSection
                    onNavigateRoom={(rId) => setActiveRoom(rId)}
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'projects' ? (
                  <ProjectDirectorySection
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'systems' ? (
                  <SystemsLabSection
                    onSelectProjectSlug={handleSelectProjectSlug}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'experience' ? (
                  <ExperienceGallerySection
                    onSelectProjectSlug={handleSelectProjectSlug}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'cases' ? (
                  <ProjectDirectorySection
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : (
                  <ContactLoungeSection onCardHover={setHoveredCardId} />
                )}
              </div>
            </div>
          </>
        )}

        {/* 6. DESKTOP RIGHT SLIDE-OVER DRAWER (md+ only) — Linear DESIGN.md */}
        {drawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${currentRoomMeta.name} Content Panel`}
            className="hidden md:flex fixed inset-0 z-40 justify-end bg-black/60 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDrawerOpen(false);
                setIsPlaceSelected(false);
                setActiveCaseProject(null);
              }
            }}
          >
            {/* 6.1 INTERACTIVE COMPANION ON THE LEFT ("sisi kiri yang bukan drawer") */}
            <DrawerAvatarCompanion
              activeRoom={activeRoom}
              activeCaseProject={activeCaseProject}
              activeCardId={hoveredCardId || activeCardId}
              onSelectCardId={(cardId) => {
                const scrollEl = desktopDrawerScrollRef.current;
                const el = scrollEl?.querySelector(`#${cardId}`) as HTMLElement | null;
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            />

            {/* 6.2 RIGHT SLIDE-OVER DRAWER PANEL */}
            <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl ml-auto h-full bg-[#171819] border-l border-[rgba(255,255,255,0.085)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-150 shadow-2xl">
              {/* Header */}
              <div className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-[#18191b] border-b border-[rgba(255,255,255,0.085)] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mini Reactive Avatar (visible when companion is hidden) */}
                  <div className="w-7 h-7 rounded-full bg-[#1d1e20] border border-[rgba(255,255,255,0.12)] shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      key={hoveredCardId || activeCardId || activeRoom}
                      src={
                        AVATAR_SPRITES[
                          getAvatarMetaForCard(
                            activeRoom,
                            hoveredCardId || activeCardId,
                            activeCaseProject
                          ).pose
                        ]
                      }
                      alt="Rizal Mini Avatar"
                      className="w-full h-full object-contain transition-opacity duration-150"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: currentRoomMeta.accentHex }}
                    />
                    <span className="font-display text-xs sm:text-sm font-semibold tracking-[-0.015em] text-[#e8e8e9] truncate">
                      {activeCaseProject
                        ? activeCaseProject.title
                        : currentRoomMeta.name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setIsPlaceSelected(false);
                    setActiveCaseProject(null);
                  }}
                  aria-label="Tutup Panel Ruangan"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#1f2023] hover:bg-[#28292b] border border-[rgba(255,255,255,0.085)] text-xs font-medium text-[#a7a7aa] hover:text-[#e8e8e9] shrink-0 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tutup</span>
                </button>
              </div>

              {/* Scrollable Drawer Content */}
              <div
                ref={desktopDrawerScrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 select-text"
              >
                {activeCaseProject ? (
                  <CaseStudyFullView
                    project={activeCaseProject}
                    onBack={() => {
                      setActiveCaseProject(null);
                      setActiveRoom('projects');
                    }}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'lobby' ? (
                  <LobbyOverviewSection
                    onNavigateRoom={(rId) => setActiveRoom(rId)}
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'projects' ? (
                  <ProjectDirectorySection
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'systems' ? (
                  <SystemsLabSection
                    onSelectProjectSlug={handleSelectProjectSlug}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'experience' ? (
                  <ExperienceGallerySection
                    onSelectProjectSlug={handleSelectProjectSlug}
                    onCardHover={setHoveredCardId}
                  />
                ) : activeRoom === 'cases' ? (
                  <ProjectDirectorySection
                    onSelectProject={(proj) => handleOpenProjectCase(proj)}
                    onCardHover={setHoveredCardId}
                  />
                ) : (
                  <ContactLoungeSection onCardHover={setHoveredCardId} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
