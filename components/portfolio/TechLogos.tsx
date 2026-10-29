import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const AstroLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M8.5 17c0-1.9 1.4-3.5 3.5-3.5s3.5 1.6 3.5 3.5c0 2-1.6 3.5-3.5 3.5S8.5 19 8.5 17z"
      fill="#FF5D01"
    />
    <path
      d="M17.8 19.3c1.7-1.7 2.2-4.1 2.2-6.3 0-5-3.6-9.5-8-10.8C7.6 3.5 4 8 4 13c0 2.2.5 4.6 2.2 6.3l.5-.8C5.3 17 5 15 5 13c0-4.3 3.1-8.2 7-9.3 3.9 1.1 7 5 7 9.3 0 2-.3 4-1.7 5.5l.5.8z"
      fill="#E2E8F0"
    />
    <path
      d="M12 9.2l1.6 4.3h-3.2L12 9.2z"
      fill="#FF5D01"
    />
  </svg>
);

export const ThreejsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M2.42 4.417L12 0l9.58 4.417v15.166L12 24l-9.58-4.417V4.417zm1.198 1.135v13.064L11.4 22.1V9.037L3.618 5.552zm8.982 3.485V22.1l7.782-3.484V5.552l-7.782 3.485zM12 1.348L4.698 4.71 12 7.973l7.302-3.264L12 1.348z" />
  </svg>
);

export const NextjsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.82 17.518l-6.84-8.835v8.835H9.4V6.482h1.745l6.98 9.022V6.482h1.575v11.036h-1.88z" />
  </svg>
);

export const NestjsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12.7 1.2c-.4-.3-1-.3-1.4 0L2.5 7.8c-.4.3-.6.7-.6 1.2v6.6c0 .5.2.9.6 1.2l8.8 6.6c.4.3 1 .3 1.4 0l8.8-6.6c.4-.3.6-.7.6-1.2V9c0-.5-.2-.9-.6-1.2L12.7 1.2z"
      fill="#E0234E"
    />
    <path
      d="M11 6.5l-4 3v5l4 3 4-3v-5l-4-3z"
      fill="#FFFFFF"
    />
  </svg>
);

export const PostgresLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.2 15.6c-.6.2-1.3.2-1.9.1-.5-.1-.9-.3-1.2-.6-.3-.3-.5-.7-.5-1.2 0-.6.2-1.1.6-1.5.4-.4 1-.6 1.7-.7.4 0 .9 0 1.3.1v3.8zm0-4.9c-.4-.1-.8-.1-1.2-.1-1.2 0-2.2.3-2.9.9-.7.6-1.1 1.4-1.1 2.4 0 1 .4 1.8 1.1 2.4.7.6 1.7.9 2.9.9.9 0 1.8-.2 2.6-.6v.8H16v-6.7c0-1.2-.3-2.1-.9-2.7-.6-.6-1.5-.9-2.7-.9-1.3 0-2.3.4-3 1.1-.4.4-.7 1-.8 1.7l1.7.3c.1-.4.3-.8.6-1 .3-.3.8-.4 1.4-.4.7 0 1.2.2 1.6.5.4.3.5.8.5 1.4v.6z"
      fill="#336791"
    />
  </svg>
);

export const SupabaseLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M13.2 2.4c.4-.6 1.4-.3 1.4.5V11h6.6c.7 0 1.1.8.6 1.3l-10 10.3c-.4.5-1.4.2-1.4-.5V13H3.8c-.7 0-1.1-.8-.6-1.3l10-9.3z"
      fill="#3ECF8E"
    />
  </svg>
);

export const JiraLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M11.5 2.5a5.5 5.5 0 00-5.5 5.5v2.8a5.5 5.5 0 005.5 5.5h2.8a5.5 5.5 0 005.5-5.5V8a5.5 5.5 0 00-5.5-5.5h-2.8z"
      fill="#0052CC"
    />
    <path
      d="M6 10.8a5.5 5.5 0 00-5.5 5.5v.2a5.5 5.5 0 005.5 5.5h.2a5.5 5.5 0 005.5-5.5v-.2A5.5 5.5 0 006 10.8z"
      fill="#2684FF"
    />
  </svg>
);

export const TrelloLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="24" height="24" rx="4" fill="#0079BF" />
    <rect x="4" y="4" width="6.5" height="12" rx="1.5" fill="#FFFFFF" />
    <rect x="13.5" y="4" width="6.5" height="8" rx="1.5" fill="#FFFFFF" />
  </svg>
);

export const SpreadsheetLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="2" width="18" height="20" rx="3" fill="#0F9D58" />
    <path d="M15 2v6h6" fill="#0B8043" />
    <path d="M7 10h10v2H7v-2zm0 4h10v2H7v-4zm0 4h10v2H7v-2z" fill="#FFFFFF" />
    <path d="M11 10v10h2V10h-2z" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

export const CanvaLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="11" fill="url(#canvaGrad)" />
    <path
      d="M13.2 8.5c-.8 0-1.5.3-2.1.8-.7.6-1.1 1.4-1.3 2.3-.2.9-.1 1.8.3 2.6.4.8 1.1 1.3 1.9 1.5.8.2 1.6 0 2.3-.4.5-.3.9-.7 1.2-1.2l-1.5-.9c-.2.3-.5.6-.8.8-.4.2-.8.3-1.2.2-.4-.1-.8-.4-1-.8-.2-.4-.3-.9-.2-1.4.1-.5.3-.9.7-1.2.4-.3.8-.5 1.3-.5.4 0 .7.1 1 .3.3.2.5.4.7.7l1.4-1.1c-.4-.5-.9-.9-1.4-1.2-.5-.4-1.1-.6-1.6-.6z"
      fill="#FFFFFF"
    />
    <defs>
      <linearGradient id="canvaGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00C4CC" />
        <stop offset="1" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
  </svg>
);

export const CapCutLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="24" height="24" rx="4" fill="#0F1115" stroke="rgba(255,255,255,0.15)" />
    <path
      d="M5 8.5L12 12.5L19 8.5L12 4.5L5 8.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M5 15.5L12 19.5L19 15.5L12 11.5L5 15.5Z"
      fill="#38BDF8"
    />
  </svg>
);

export const ClaudeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 2.5L13.8 8.8L19.5 7L15.7 12L19.5 17L13.8 15.2L12 21.5L10.2 15.2L4.5 17L8.3 12L4.5 7L10.2 8.8L12 2.5Z"
      fill="#D97706"
    />
  </svg>
);

export const CodexLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M20.5 10.2a5.5 5.5 0 00-4.7-4.7 5.7 5.7 0 00-6.1-2.7 5.7 5.7 0 00-4.6 3.4 5.5 5.5 0 00-1.6 5.8 5.7 5.7 0 00.7 6.6 5.7 5.7 0 006.1 2.7 5.7 5.7 0 004.6-3.4 5.5 5.5 0 001.6-5.8 5.7 5.7 0 00-.7-1.9z"
      stroke="#10A37F"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" fill="#10A37F" />
  </svg>
);

export const AntigravityLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="4" fill="url(#agyCore)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#8B5CF6" strokeWidth="1.6" transform="rotate(-30 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="2 2" transform="rotate(30 12 12)" />
    <defs>
      <radialGradient id="agyCore" cx="0.5" cy="0.5" r="0.5">
        <stop stopColor="#A78BFA" />
        <stop offset="1" stopColor="#6D28D9" />
      </radialGradient>
    </defs>
  </svg>
);

export const NineRouterLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#181B26" stroke="#6366F1" strokeWidth="1.5" />
    <path
      d="M8 8H14C15.1 8 16 8.9 16 10V12C16 13.1 15.1 14 14 14H8V8Z"
      stroke="#6366F1"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M16 10V16" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="8" r="1.5" fill="#38BDF8" />
    <circle cx="16" cy="16" r="1.5" fill="#34D399" />
    <path d="M12 17L14 19L18 15" stroke="#34D399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HermesLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 3C8 3 5 6 5 10C5 13.5 7.5 16 10 17.5V20H14V17.5C16.5 16 19 13.5 19 10C19 6 16 3 12 3Z"
      stroke="#F59E0B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 8C2.5 7 1.5 5 1.5 5C2.5 5 4.5 5.5 6 7" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M20 8C21.5 7 22.5 5 22.5 5C21.5 5 19.5 5.5 18 7" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="10" r="1.5" fill="#F59E0B" />
  </svg>
);

export const MuseAiLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#1A1020" stroke="#EC4899" strokeWidth="1.5" />
    <path
      d="M7 16V9L10 13L12 10.5L14 13L17 9V16"
      stroke="#F472B6"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="6" r="1" fill="#F472B6" />
  </svg>
);

export const TechLogo: React.FC<{ name: string; className?: string; size?: number }> = ({
  name,
  className,
  size,
}) => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  switch (normalized) {
    case 'astro':
      return <AstroLogo className={className} size={size} />;
    case 'threejs':
    case 'three':
      return <ThreejsLogo className={className} size={size} />;
    case 'nextjs':
    case 'next':
      return <NextjsLogo className={className} size={size} />;
    case 'nestjs':
    case 'nest':
      return <NestjsLogo className={className} size={size} />;
    case 'postgres':
    case 'postgresql':
      return <PostgresLogo className={className} size={size} />;
    case 'supabase':
      return <SupabaseLogo className={className} size={size} />;
    case 'jira':
      return <JiraLogo className={className} size={size} />;
    case 'trello':
      return <TrelloLogo className={className} size={size} />;
    case 'spreadsheet':
    case 'googlespreadsheet':
    case 'sheets':
      return <SpreadsheetLogo className={className} size={size} />;
    case 'canva':
      return <CanvaLogo className={className} size={size} />;
    case 'capcut':
      return <CapCutLogo className={className} size={size} />;
    case 'claude':
    case 'anthropic':
      return <ClaudeLogo className={className} size={size} />;
    case 'codex':
    case 'openai':
      return <CodexLogo className={className} size={size} />;
    case 'antigravity':
      return <AntigravityLogo className={className} size={size} />;
    case '9router':
    case 'ninerouter':
      return <NineRouterLogo className={className} size={size} />;
    case 'hermes':
    case 'nous':
      return <HermesLogo className={className} size={size} />;
    case 'museai':
    case 'muse':
      return <MuseAiLogo className={className} size={size} />;
    default:
      return null;
  }
};
