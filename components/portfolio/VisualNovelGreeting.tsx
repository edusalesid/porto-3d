'use client';

import React, { useState, useEffect, useRef } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  MessageSquare,
  Rocket,
  Compass,
  ChevronRight,
  FastForward,
  Sparkles,
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
    text: "Hey, I'm Rizal.",
    avatar: '/avatar/rizal-wave.webp',
    name: 'Rizal',
    role: 'Tukang Manage Produk',
  },
  {
    text: 'Welcome to my workspace! Kantor virtual ini saya rancang interaktif untuk merangkum portofolio rekayasa sistem, showcase produk, dan perjalanan karier saya.',
    avatar: '/avatar/rizal-explaining.webp',
    name: 'Rizal',
    role: 'Tukang Manage Produk',
  },
  {
    text: 'Mau kenalan dulu, atau langsung lihat project saya?',
    avatar: '/avatar/rizal-thinking.webp',
    name: 'Rizal',
    role: 'Tukang Manage Produk',
  },
];

export default function VisualNovelGreeting({
  onDismiss,
  onSelectOption,
}: VisualNovelGreetingProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [hoveredChoice, setHoveredChoice] = useState<'experience' | 'projects' | 'explore' | null>(null);

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
      if (e.code === 'Escape') {
        e.preventDefault();
        onDismiss();
        return;
      }

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
      className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto select-none bg-black/65 backdrop-blur-xs animate-in fade-in duration-300"
    >
      {/* Top Action Bar: Skip Button */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={() => {
            trackPortfolioEvent('external_link_opened', { action: 'skip_welcome_vn' });
            onDismiss();
          }}
          title="Lewati prolog percakapan langsung ke 3D (Esc)"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#18191b]/90 hover:bg-[#28292b] border border-[rgba(255,255,255,0.13)] text-[#e8e8e9] hover:border-[#f5d400]/50 text-xs font-mono font-medium backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          <span>Lewati</span>
          <FastForward className="w-3.5 h-3.5 text-[#f5d400]" />
          <span className="text-[10px] text-[#77787c] hidden sm:inline">(Esc)</span>
        </button>
      </div>

      {/* Main VN Stage Container: Character Sprite + Dialogue Bar */}
      <div className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 pb-3 sm:pb-8 flex flex-col md:flex-row items-end gap-0 md:gap-6">
        {/* Character Sprite Container (Clean & Stable, zero jitter) */}
        <div className="relative z-10 shrink-0 self-center md:self-end -mb-3 sm:-mb-6 md:-mb-8 pointer-events-none select-none">
          {/* Subtle Backglow behind Sprite */}
          <div className="absolute inset-0 bg-[#f5d400]/10 blur-3xl rounded-full transform scale-90" />

          {/* Sprite Frame */}
          <div className="relative w-44 sm:w-60 md:w-80 lg:w-92 h-52 sm:h-72 md:h-96">
            <img
              src={activeAvatarSrc}
              alt="Rizal — Tukang Manage Produk"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] transition-opacity duration-150"
            />
          </div>
        </div>

        {/* VN Dialogue Box & Choice Window */}
        <div className="relative z-20 w-full flex-1">
          {/* Choice Prompt Cards (Appears on Question Step 2) */}
          {currentStep === 2 && (
            <div className="mb-3 space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-250">
              <div className="flex items-center gap-2 mb-1 px-1">
                <Sparkles className="w-3.5 h-3.5 text-[#f5d400]" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#a7a7aa]">
                  Pilih Tindakan Interaktif:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Option 1: Kenalan dengan Rizal */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('experience')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('experience')}
                  className="group text-left p-3 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[rgba(255,255,255,0.1)] hover:border-[#38bdf8] transition-all shadow-lg cursor-pointer backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#38bdf8]/15 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8]">
                        <MessageSquare className="w-3 h-3" />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#e8e8e9] group-hover:text-[#38bdf8] transition-colors">
                        Kenalan dengan Rizal
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#77787c] group-hover:text-[#38bdf8]">[1]</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#a7a7aa] line-clamp-1">
                    Profil, rekam jejak karier, dan latar belakang
                  </p>
                </button>

                {/* Option 2: Lihat Project Saya */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('projects')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('projects')}
                  className="group text-left p-3 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[#f5d400]/40 hover:border-[#f5d400] transition-all shadow-lg cursor-pointer backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#f5d400]/15 border border-[#f5d400]/40 flex items-center justify-center text-[#f5d400]">
                        <Rocket className="w-3 h-3" />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#f5d400]">
                        Lihat Project Saya
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#f5d400]">[2]</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#a7a7aa] line-clamp-1">
                    Showcase 6 produk & 14-poin case study
                  </p>
                </button>

                {/* Option 3: Eksplor Ruangan 3D */}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredChoice('explore')}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onClick={() => onSelectOption('explore')}
                  className="group text-left p-3 rounded-xl bg-[#18191b]/95 hover:bg-[#232426] border border-[rgba(255,255,255,0.1)] hover:border-[#46c98a] transition-all shadow-lg cursor-pointer backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#46c98a]/15 border border-[#46c98a]/40 flex items-center justify-center text-[#46c98a]">
                        <Compass className="w-3 h-3" />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#e8e8e9] group-hover:text-[#46c98a] transition-colors">
                        Eksplor Ruangan 3D
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#77787c] group-hover:text-[#46c98a]">[3]</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#a7a7aa] line-clamp-1">
                    Keliling kantor virtual 3D bebas (WASD / Pan)
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Dialogue Glassmorphism Bar */}
          <div
            onClick={handleAdvance}
            className="group relative p-4 sm:p-6 rounded-2xl bg-[#121314]/94 hover:bg-[#141516] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.18)] shadow-2xl backdrop-blur-xl transition-all cursor-pointer"
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
                  {isTyping ? 'Sedang mengetik...' : 'Klik atau tekan Spasi untuk lanjut'}
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
                    <span>Pilih salah satu di atas</span>
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
