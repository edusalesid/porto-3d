'use client';

import React, { useState, useEffect, useRef } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  ChevronRight,
} from 'lucide-react';

export interface VisualNovelGreetingProps {
  onDismiss: () => void;
  onSelectOption: (option: 'experience' | 'projects' | 'explore') => void;
}

interface DialogueLine {
  text: string;
  avatar: string;
  name: string;
  role: string;
}

const DIALOGUE_SCRIPT: DialogueLine[] = [
  {
    text: 'Halo, saya Rizal Hanifa Pratama.',
    avatar: '/avatar/rizal-wave.webp',
    name: 'Rizal',
    role: 'Coding Teacher & IT Project Manager',
  },
  {
    text: 'Selamat datang di kantor virtual saya. Di sini Anda dapat melihat pengalaman mengajar coding, manajemen proyek IT, dan portofolio sistem saya.',
    avatar: '/avatar/rizal-explaining.webp',
    name: 'Rizal',
    role: 'Coding Teacher & IT Project Manager',
  },
  {
    text: 'Silakan pilih bagian yang ingin Anda eksplorasi:',
    avatar: '/avatar/rizal-thinking.webp',
    name: 'Rizal',
    role: 'Coding Teacher & IT Project Manager',
  },
];

export default function VisualNovelGreeting({
  onDismiss,
  onSelectOption,
}: VisualNovelGreetingProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>(
    DIALOGUE_SCRIPT[0].text
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hoveredChoice, setHoveredChoice] = useState<'experience' | 'projects' | 'explore' | null>(null);
  const isFirstMountRef = useRef<boolean>(true);

  const activeLine = DIALOGUE_SCRIPT[currentStep] || DIALOGUE_SCRIPT[0];

  // Determine current active avatar sprite based on hover or speech step
  const getActiveAvatar = (): string => {
    if (currentStep === 2 && hoveredChoice) {
      switch (hoveredChoice) {
        case 'experience':
          return '/avatar/rizal-explaining.webp';
        case 'projects':
          return '/avatar/rizal-double-thumbs-up.webp';
        case 'explore':
          return '/avatar/rizal-wave.webp';
      }
    }
    return activeLine.avatar;
  };

  // Rock-solid typewriter effect with zero external dependencies
  useEffect(() => {
    // Lewati pengetikan ulang kalimat pertama di mount awal agar tidak flicker dari SSR fallback
    if (isFirstMountRef.current && currentStep === 0) {
      isFirstMountRef.current = false;
      return;
    }
    isFirstMountRef.current = false;

    const fullText = activeLine.text;
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const timer = setInterval(() => {
      charIndex++;
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 22);

    return () => {
      clearInterval(timer);
    };
  }, [currentStep, activeLine.text]);

  // Advance or complete typing on click / space
  const handleAdvance = () => {
    if (isTyping) {
      // Instantly finish typing current line
      setDisplayedText(activeLine.text);
      setIsTyping(false);
      return;
    }

    if (currentStep < DIALOGUE_SCRIPT.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Keyboard navigation (Space, Enter, Esc, 1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
        return;
      }

      // Choice hotkeys when on final question step
      if (currentStep === 2 && !isTyping) {
        if (e.key === '1') {
          e.preventDefault();
          onSelectOption('experience');
        } else if (e.key === '2') {
          e.preventDefault();
          onSelectOption('projects');
        } else if (e.key === '3') {
          e.preventDefault();
          onSelectOption('explore');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isTyping, onDismiss, onSelectOption]);

  const activeAvatarSrc = getActiveAvatar();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visual Novel Greeting by Rizal"
      className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto select-none bg-black/65 backdrop-blur-xs"
    >
      {/* Main VN Stage Container: Character Sprite + Dialogue Bar */}
      <div className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 pb-2 sm:pb-8 [@media(max-height:550px)]:pb-2 flex flex-col md:flex-row items-end gap-0 md:gap-6">
        {/* Character Sprite Container (Clean & Stable, zero jitter) */}
        <div className="relative z-10 shrink-0 self-center md:self-end -mb-3 sm:-mb-6 md:-mb-8 pointer-events-none select-none">
          {/* Subtle Backglow behind Sprite */}
          <div className="absolute inset-0 bg-[#f5d400]/10 blur-3xl rounded-full transform scale-90" />

          {/* Sprite Frame */}
          <div className="relative w-36 sm:w-52 md:w-80 lg:w-92 h-44 sm:h-64 md:h-96 [@media(max-height:550px)]:w-36 [@media(max-height:550px)]:h-44">
            <img
              src={activeAvatarSrc}
              alt="Rizal — Tukang Manage Produk"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] transition-opacity duration-150"
            />
          </div>
        </div>

        {/* VN Dialogue Box & Choice Window */}
        <div className="relative z-20 w-full flex-1">
          {/* Choice Prompt Cards (Compact Headline-only, Right-aligned, Vertical Stack) */}
          {currentStep === 2 && (
            <div className="mb-2.5 flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-full max-w-[260px] sm:max-w-[280px] flex flex-col gap-1.5">
                {/* Option 1: Riwayat Pengalaman */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('experience')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('experience')}
                  className="group w-full text-left px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[rgba(255,255,255,0.12)] hover:border-[#38bdf8] transition-all shadow-lg cursor-pointer backdrop-blur-md hover:translate-x-1 duration-150 flex items-center justify-between"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#e8e8e9] group-hover:text-[#38bdf8] transition-colors">
                    1. Riwayat Pengalaman
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#77787c] group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </button>

                {/* Option 2: Jelajahi Proyek */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('projects')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('projects')}
                  className="group w-full text-left px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[#f5d400]/40 hover:border-[#f5d400] transition-all shadow-lg cursor-pointer backdrop-blur-md hover:translate-x-1 duration-150 flex items-center justify-between"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#f5d400] group-hover:text-[#fadb24] transition-colors">
                    2. Jelajahi Proyek
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#f5d400] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </button>

                {/* Option 3: Jelajahi Kantor 3D */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('explore')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('explore')}
                  className="group w-full text-left px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[rgba(255,255,255,0.12)] hover:border-[#46c98a] transition-all shadow-lg cursor-pointer backdrop-blur-md hover:translate-x-1 duration-150 flex items-center justify-between"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#e8e8e9] group-hover:text-[#46c98a] transition-colors">
                    3. Jelajahi Kantor 3D
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#77787c] group-hover:text-[#46c98a] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            </div>
          )}

          {/* Dialogue Glassmorphism Bar */}
          <div
            onClick={handleAdvance}
            className="group relative p-3.5 sm:p-5 md:p-6 [@media(max-height:550px)]:p-3 rounded-2xl bg-[#121314]/94 hover:bg-[#141516] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.18)] shadow-2xl backdrop-blur-xl transition-all cursor-pointer"
          >
            {/* Visual Novel Character Nameplate Badge */}
            <div className="absolute -top-3.5 left-5 flex items-center gap-2 px-3.5 py-1 rounded-lg bg-[#18191b] border border-[rgba(255,255,255,0.15)] shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#f5d400] animate-pulse" />
              <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-[#f5d400]">
                {activeLine.name}
              </span>
              <span className="text-[10px] font-mono text-[#77787c] hidden sm:inline">
                • {activeLine.role}
              </span>
            </div>

            {/* Dialogue Text Content with Typewriter cursor */}
            <div className="min-h-[64px] sm:min-h-[72px] flex items-center pt-1">
              <p className="font-sans text-sm sm:text-base md:text-lg text-[#e8e8e9] leading-relaxed tracking-[-0.01em]">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-2 h-4 ml-1 bg-[#f5d400] vn-cursor-blink align-middle" />
                )}
              </p>
            </div>

            {/* Bottom Status & Next Prompt Indicator */}
            <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#77787c]">
              <div className="flex items-center gap-2">
                <span>
                  {currentStep + 1} / {DIALOGUE_SCRIPT.length}
                </span>
                <span className="hidden sm:inline text-[#505156]">·</span>
                <span className="hidden sm:inline text-[11px] text-[#a7a7aa]">
                  {isTyping ? 'Sedang mengetik...' : 'Klik atau tekan Spasi buat lanjut'}
                </span>
              </div>

              {/* Blinking Continue Indicator */}
              <div className="flex items-center gap-1.5 text-[#f5d400] font-medium">
                {currentStep < DIALOGUE_SCRIPT.length - 1 ? (
                  <>
                    <span className="text-[11px] hidden sm:inline">Lanjut</span>
                    <ChevronRight className="w-4 h-4 animate-bounce-x" />
                  </>
                ) : (
                  <span className="text-[11px] text-[#38bdf8] flex items-center gap-1">
                    <span>Pilih opsi di atas ya</span>
                    <span className="animate-pulse">▲</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
