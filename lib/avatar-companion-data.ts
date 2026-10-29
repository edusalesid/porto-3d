import type { RoomId, PortfolioProject } from '@/lib/portfolio-data';

export type AvatarPose = 'wave' | 'explaining' | 'thinking' | 'thumbsUp';

export interface CardPoseMeta {
  id: string;
  pose: AvatarPose;
  title: string;
  subtitle: string;
  quote: string;
  badge: string;
  accentHex: string;
  quickJumps?: {
    id: string;
    label: string;
  }[];
}

export const AVATAR_SPRITES: Record<AvatarPose, string> = {
  wave: '/avatar/rizal-wave.webp',
  explaining: '/avatar/rizal-explaining.webp',
  thinking: '/avatar/rizal-thinking.webp',
  thumbsUp: '/avatar/rizal-double-thumbs-up.webp',
};

// Preset catalog for each card across the application
export const EXPERIENCE_CARDS_META: Record<string, CardPoseMeta> = {
  'exp-ihsanul-fikri': {
    id: 'exp-ihsanul-fikri',
    pose: 'explaining',
    title: '01 · Agu 2026 — Sekarang',
    subtitle: 'Coding Teacher @ SMA IHSANUL FIKRI MUNGKID',
    quote:
      'Mengajar 200+ siswa di 11 kelas termasuk kelas bilingual internasional (ICIF), penjaminan mutu SPMI, operasional lab 50+ unit, serta program AI & Deep Learning!',
    badge: 'Pendidikan Koding & AI',
    accentHex: '#f5d400',
  },
  'exp-triagro': {
    id: 'exp-triagro',
    pose: 'thumbsUp',
    title: '02 · Nov 2025 — Sekarang',
    subtitle: 'Digital Marketing @ PT Triagro Hijrah Jaya',
    quote:
      'Menjalankan strategi pemasaran digital, akuisisi pengguna, dan pipeline operasional digital supply chain pertanian di Sukoharjo.',
    badge: 'Digital Marketing & Pertumbuhan',
    accentHex: '#46c98a',
  },
  'exp-movio-studio': {
    id: 'exp-movio-studio',
    pose: 'explaining',
    title: '03 · Nov 2025 — Sep 2026',
    subtitle: 'IT Team Lead & General PM @ Movio Studio',
    quote:
      'Memimpin tim rekayasa software IT dan tata kelola delivery proyek lintas fungsi di Tangerang Selatan untuk inisiatif kreatif dan teknologi.',
    badge: 'Kepemimpinan IT & PM',
    accentHex: '#38bdf8',
  },
  'exp-cont-solutions': {
    id: 'exp-cont-solutions',
    pose: 'thinking',
    title: '04 · Jun 2024 — Nov 2025',
    subtitle: 'IT Project Manager @ Cont Solutions Indonesia',
    quote:
      'Mengelola siklus lengkap delivery proyek IT klien, sprint planning agile, dan keselarasan arsitektur sistem perangkat lunak di Yogyakarta.',
    badge: 'Delivery Software Klien',
    accentHex: '#a78bfa',
  },
  'exp-gemala-kempa': {
    id: 'exp-gemala-kempa',
    pose: 'explaining',
    title: '05 · Jun 2024 — Agu 2024',
    subtitle: 'Product Development Intern @ PT Gemala Kempa Daya',
    quote:
      'Mendukung proses riset pengembangan produk, spesifikasi komponen teknis, dan standardisasi kualitas di Jakarta Utara.',
    badge: 'Pengembangan Produk',
    accentHex: '#f59e0b',
  },
  'exp-it-club-upn': {
    id: 'exp-it-club-upn',
    pose: 'thumbsUp',
    title: '06 · Feb 2022 — Agu 2024',
    subtitle: 'Head of PM Dept @ IT Club UPN Veteran Yogyakarta',
    quote:
      'Memimpin dan membina 5 Project Manager yang berhasil menuntaskan 10 proyek final software berskala kampus dan organisasi.',
    badge: 'Kepemimpinan Teknis',
    accentHex: '#34d399',
  },
  'exp-1000-startup': {
    id: 'exp-1000-startup',
    pose: 'thinking',
    title: '07 · Feb 2024 — Jul 2024',
    subtitle: 'Hustler & Hacker @ Gerakan Nasional 1000 Startup Digital',
    quote:
      'Validasi problem-solution fit, riset kebutuhan pasar pengguna, dan prototyping MVP produk digital rintisan.',
    badge: 'Inkubasi Startup',
    accentHex: '#ec4899',
  },
  'exp-sinaou-education': {
    id: 'exp-sinaou-education',
    pose: 'explaining',
    title: '08 · Jun 2023 — Mar 2024',
    subtitle: 'Co-Founder & Product Manager @ Sinaou Education',
    quote:
      'Mengembangkan visi produk EdTech, riset kurikulum belajar terstruktur, dan koordinasi rilis awal aplikasi bersama tim developer.',
    badge: 'Inisiatif EdTech',
    accentHex: '#818cf8',
  },
  // Legacy aliases
  'exp-tpm-product': {
    id: 'exp-tpm-product',
    pose: 'explaining',
    title: '01 · 2025 — Present',
    subtitle: 'Technical Project Manager — Product & Software Systems',
    quote:
      'Fokus ke end-to-end delivery: dari nulis PRD, arsitektur state machine, WBS vertical slices, sampai rilis production pilot.',
    badge: 'Digital Product & Systems Delivery',
    accentHex: '#f5d400',
  },
  'exp-ai-education': {
    id: 'exp-ai-education',
    pose: 'thinking',
    title: '02 · 2025 — 2026',
    subtitle: 'Project Lead & Workflow Architect — AI & Applied Learning',
    quote:
      'Merancang Prompt Battle & framework evaluasi output deterministic untuk validasi prompt engineer dan kurikulum tim teknis.',
    badge: 'AI Workflow Initiatives & Prompt Battle',
    accentHex: '#38bdf8',
  },
  'exp-systems-revops': {
    id: 'exp-systems-revops',
    pose: 'thumbsUp',
    title: '03 · 2024 — 2025',
    subtitle: 'Project Manager — Field Systems & Marketing Operations',
    quote:
      'Turun langsung ke operasional lapangan: rekonsiliasi selisih timbangan panen Triagro & otomasi webhook deduplication RevOps!',
    badge: 'Supply Chain & RevOps',
    accentHex: '#46c98a',
  },
};

export const PROJECTS_CARDS_META: Record<string, CardPoseMeta> = {
  'unilever-gt2': {
    id: 'unilever-gt2',
    pose: 'explaining',
    title: 'PRJ-01 · Unilever GT2',
    subtitle: 'E-Learning & SCORM 1.2 Simulation',
    quote:
      'Portal mandiri pelatihan General Trade 2 DSR Unilever Indonesia dengan SCORM 1.2 browser shim tanpa ketergantungan server LMS eksternal.',
    badge: 'EdTech / LMS System',
    accentHex: '#38bdf8',
  },
  'dashboard-oee': {
    id: 'dashboard-oee',
    pose: 'thinking',
    title: 'PRJ-02 · OEE Monitoring',
    subtitle: 'Industrial Real-Time Dashboard & Simulation',
    quote:
      'Dashboard monitoring manufaktur Overall Equipment Effectiveness (OEE = A x P x Q), deteksi downtime pareto, dan mesin simulasi interaktif.',
    badge: 'Industrial IoT & Systems',
    accentHex: '#60a5fa',
  },
  employr: {
    id: 'employr',
    pose: 'thumbsUp',
    title: 'PRJ-03 · Employr',
    subtitle: 'Career Workspace & ATS CV Builder',
    quote:
      'Career workspace talenta muda Indonesia: CV builder ramah ATS (client-side print PDF), Kanban tracker lamaran tanpa batas, dan model Lifetime Member.',
    badge: 'Product / SaaS',
    accentHex: '#f97316',
  },
  mfood: {
    id: 'mfood',
    pose: 'explaining',
    title: 'PRJ-04 · mfood.id',
    subtitle: 'Integrated F&B Operating System & Mobile POS',
    quote:
      'Sistem kasir kuliner multi-outlet offline-resilient dengan IndexedDB, sinkronisasi pesanan dapur KDS, QRIS payment, dan WhatsApp sales report.',
    badge: 'Product / POS System',
    accentHex: '#10b981',
  },
  'mfood-pos': {
    id: 'mfood',
    pose: 'explaining',
    title: 'PRJ-04 · mfood.id',
    subtitle: 'Integrated F&B Operating System & Mobile POS',
    quote:
      'Sistem kasir kuliner multi-outlet offline-resilient dengan IndexedDB, sinkronisasi pesanan dapur KDS, QRIS payment, dan WhatsApp sales report.',
    badge: 'Product / POS System',
    accentHex: '#10b981',
  },
};

export const SYSTEMS_CARDS_META: Record<string, CardPoseMeta> = {
  'sys-planning': {
    id: 'sys-planning',
    pose: 'explaining',
    title: 'Pilar 01 · Perencanaan Lingkup & WBS',
    subtitle: 'Dekomposisi Lingkup & Tata Kelola Sprint',
    quote:
      'Memecah tujuan bisnis menjadi vertical slices teruji dengan Definition of Done yang ketat dan Non-Goals eksplisit.',
    badge: 'Tata Kelola Rekayasa',
    accentHex: '#f5d400',
  },
  'sys-risk': {
    id: 'sys-risk',
    pose: 'thinking',
    title: 'Pilar 02 · Manajemen Risiko & Dependensi',
    subtitle: 'Matriks Trade-off & Keputusan Arsitektur',
    quote:
      'Melacak risiko teknis secara transparan dengan simulasi pre-mortem dan log keputusan yang jelas.',
    badge: 'Arsitektur Sistem',
    accentHex: '#38bdf8',
  },
  'sys-contracts': {
    id: 'sys-contracts',
    pose: 'thinking',
    title: 'Pilar 02 · Kontrak Data & Arsitektur',
    subtitle: 'Pemodelan State Machine & Kontrak Data',
    quote:
      'Mencegah race condition dan invalid state lewat transisi state deterministik sebelum kode ditulis.',
    badge: 'Arsitektur Sistem',
    accentHex: '#38bdf8',
  },
  'sys-ai': {
    id: 'sys-ai',
    pose: 'thinking',
    title: 'Pilar 03 · Alur Kerja AI & Evaluasi Deterministik',
    subtitle: 'Grounding AI dengan Sitasi & Pengujian Golden Dataset',
    quote:
      'Menjaga keandalan AI melalui sitasi paragraf terverifikasi, validasi skema output, dan evaluasi bebas halusinasi.',
    badge: 'Keandalan AI',
    accentHex: '#a78bfa',
  },
  'sys-collab': {
    id: 'sys-collab',
    pose: 'thumbsUp',
    title: 'Pilar 04 · Kolaborasi Lintas Fungsi',
    subtitle: 'Ritual Rekayasa, Desain UX & Operasional Lapangan',
    quote:
      'Menghilangkan kesenjangan komunikasi antara tim teknis, desainer, dan pengguna akhir melalui kontrak data bersama.',
    badge: 'Kolaborasi Tim',
    accentHex: '#46c98a',
  },
  'sys-telemetry': {
    id: 'sys-telemetry',
    pose: 'thumbsUp',
    title: 'Pilar 04 · Telemetri Pasca-Rilis',
    subtitle: 'Telemetri & Dashboard Operasional',
    quote:
      'Monitoring real-time metrik adopsi pengguna, error budget, dan feedback loop pasca-peluncuran sistem ke live production.',
    badge: 'Operasional & Metrik',
    accentHex: '#46c98a',
  },
};

export const LOBBY_CARDS_META: Record<string, CardPoseMeta> = {
  'lobby-hero': {
    id: 'lobby-hero',
    pose: 'wave',
    title: 'Lobi Virtual · Profil',
    subtitle: 'Rizal Hanifa Pratama — Guru Koding & Manajer Proyek IT',
    quote:
      'Selamat datang di kantor virtual saya! Di sini kamu dapat melihat pengalaman mengajar koding, manajemen proyek IT, dan portofolio sistem saya.',
    badge: 'Profil & Ringkasan',
    accentHex: '#f5d400',
  },
  'lobby-strengths': {
    id: 'lobby-strengths',
    pose: 'explaining',
    title: 'Kompetensi Utama',
    subtitle: 'Pendidikan Koding, Manajemen Proyek & Sistem',
    quote:
      'Kombinasi instruksi koding bilingual, tata kelola proyek Agile Scrum, penjaminan mutu SPMI, dan implementasi perangkat lunak.',
    badge: 'Kompetensi Inti',
    accentHex: '#38bdf8',
  },
  'lobby-navigation': {
    id: 'lobby-navigation',
    pose: 'thumbsUp',
    title: 'Navigasi Ruangan',
    subtitle: 'Direktori Ruang Kerja 3D',
    quote:
      'Pilih zona ruangan: galeri pengalaman kerja, katalog produk, lab sistem, atau ruang kontak.',
    badge: 'Direktori Ruang',
    accentHex: '#46c98a',
  },
};

/**
 * Returns dynamic companion metadata based on active room, selected card, or active case project.
 */
export function getAvatarMetaForCard(
  roomId: RoomId,
  cardId: string | null,
  activeCaseProject?: PortfolioProject | null
): CardPoseMeta {
  // 1. If currently inside a specific Case Study view
  if (activeCaseProject) {
    const projectSlug = activeCaseProject.slug;
    const projectMeta = PROJECTS_CARDS_META[projectSlug];
    if (projectMeta) {
      return {
        ...projectMeta,
        title: `Studi Kasus: ${activeCaseProject.title.split('—')[0].trim()}`,
        badge: '14-Point Verified Case Study',
      };
    }
    return {
      id: activeCaseProject.slug,
      pose: 'explaining',
      title: `Studi Kasus: ${activeCaseProject.title.split('—')[0].trim()}`,
      subtitle: `${activeCaseProject.role} · ${activeCaseProject.period}`,
      quote: activeCaseProject.summary,
      badge: 'Verified Case Study',
      accentHex: '#f5d400',
    };
  }

  // 2. Specific card matches
  if (cardId) {
    if (EXPERIENCE_CARDS_META[cardId]) {
      return EXPERIENCE_CARDS_META[cardId];
    }
    if (PROJECTS_CARDS_META[cardId]) {
      return PROJECTS_CARDS_META[cardId];
    }
    if (SYSTEMS_CARDS_META[cardId]) {
      return SYSTEMS_CARDS_META[cardId];
    }
    if (LOBBY_CARDS_META[cardId]) {
      return LOBBY_CARDS_META[cardId];
    }
  }

  // 3. Defaults based on Room
  switch (roomId) {
    case 'experience':
      return {
        id: 'experience-default',
        pose: 'wave',
        title: '04 · Galeri Pengalaman',
        subtitle: 'Rekam Jejak Kronologis & Peran Profesional',
        quote:
          'Berikut ikhtisar kronologis peran kepemimpinan proyek, ruang lingkup operasional, dan hasil kerja nyata yang telah saya rilis.',
        badge: 'Linimasa Pengalaman',
        accentHex: '#46c98a',
        quickJumps: [
          { id: 'exp-ihsanul-fikri', label: '01 · Coding Teacher' },
          { id: 'exp-triagro', label: '02 · Digital Marketing' },
          { id: 'exp-movio-studio', label: '03 · IT Team Lead' },
          { id: 'exp-cont-solutions', label: '04 · IT Project Manager' },
        ],
      };

    case 'projects':
    case 'cases':
      return {
        id: 'projects-default',
        pose: 'wave',
        title: '02 · Projects Studio',
        subtitle: 'Product Showcase & Systems Gallery',
        quote:
          'Jelajahi 4 produk terverifikasi lengkap dengan antarmuka live, arsitektur teknis, dan studi kasus mendalam 14-poin.',
        badge: 'Product Showcase',
        accentHex: '#f5d400',
        quickJumps: [
          { id: 'unilever-gt2', label: 'Unilever GT2' },
          { id: 'dashboard-oee', label: 'OEE Monitor' },
          { id: 'employr', label: 'Employr' },
          { id: 'mfood', label: 'mfood.id' },
        ],
      };

    case 'systems':
      return {
        id: 'systems-default',
        pose: 'thinking',
        title: '03 · Laboratorium Sistem',
        subtitle: 'Tata Kelola Rekayasa & Metodologi Eksekusi',
        quote:
          'Empat pilar metodologi teknis: dari dekomposisi lingkup, matriks risiko trade-off, tata kelola AI, hingga kolaborasi tim lintas fungsi.',
        badge: 'Lab Sistem',
        accentHex: '#38bdf8',
        quickJumps: [
          { id: 'sys-planning', label: '01 · Perencanaan' },
          { id: 'sys-risk', label: '02 · Manajemen Risiko' },
          { id: 'sys-ai', label: '03 · Alur Kerja AI' },
          { id: 'sys-collab', label: '04 · Kolaborasi Tim' },
        ],
      };

    case 'contact':
      return {
        id: 'contact-default',
        pose: 'thumbsUp',
        title: '06 · Ruang Kontak',
        subtitle: 'Mari Terhubung & Berkolaborasi',
        quote:
          'Tertarik mendiskusikan program pembelajaran koding/AI, penjaminan mutu SPMI, atau delivery sistem perangkat lunak? Mari terhubung langsung via Email atau LinkedIn!',
        badge: 'Ruang Kontak',
        accentHex: '#6e6edb',
      };

    case 'lobby':
    default:
      return {
        id: 'lobby-default',
        pose: 'wave',
        title: '01 · Lobi Virtual',
        subtitle: 'Ringkasan Profil & Pengenalan',
        quote:
          'Halo, saya Rizal! Senang kamu berkunjung. Silakan jelajahi ruangan kerja virtual atau buka menu drawer untuk membaca ringkasan portofolio.',
        badge: 'Kantor Virtual',
        accentHex: '#f5d400',
        quickJumps: [
          { id: 'lobby-hero', label: 'Profil' },
          { id: 'lobby-strengths', label: 'Kompetensi' },
          { id: 'lobby-navigation', label: 'Navigasi' },
        ],
      };
  }
}
