export type RoomId =
  | 'lobby'
  | 'projects'
  | 'systems'
  | 'experience'
  | 'cases'
  | 'contact';

export type ProjectCategory =
  | 'Product/SaaS'
  | 'AI'
  | 'Software Systems'
  | 'Marketing Operations'
  | 'Educational Projects';

export interface ProjectDemoVideo {
  url: string;
  type?: string;
  poster?: string;
  title?: string;
  caption?: string;
}

export interface ProjectEvidence {
  type: 'image' | 'diagram' | 'link' | 'document' | 'video';
  title: string;
  url: string;
  alt?: string;
  caption: string;
  metricsOrSpec?: string[];
}

export interface PortfolioProject {
  slug: string;
  title: string;
  category: ProjectCategory[];
  summary: string;
  role: string;
  period: string;
  projectStatus: string;
  relevanceRank: number;
  bannerImage?: string;
  demoVideo?: ProjectDemoVideo;
  galleryImages?: { url: string; title: string; caption?: string }[];
  // 14-point Case Archive structure
  overview: string;
  context: string;
  problem: string;
  objectives: string[];
  constraints: string[];
  responsibilities: string[];
  teamAndStakeholders: string[];
  approach: string[];
  keyDecisions: {
    decision: string;
    rationale: string;
    tradeOff: string;
  }[];
  execution: {
    phase: string;
    deliverable: string;
    outcome: string;
  }[];
  risksAndTradeOffs: {
    risk: string;
    mitigation: string;
  }[];
  outcomes: string[];
  lessonsLearned: string[];
  evidence: ProjectEvidence[];
  technologies: string[];
  publicUrl?: string;
}

export interface RoomMetadata {
  id: RoomId;
  name: string;
  shortLabel: string;
  code: string;
  purpose: string;
  summary: string;
  ctaLabel: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  roomCenter: [number, number, number];
  accentHex: string;
  highlights: string[];
}

export const ROOMS: RoomMetadata[] = [
  {
    id: 'lobby',
    name: 'Lobi Virtual',
    shortLabel: 'Lobi',
    code: '01',
    purpose: 'Orientasi & Ringkasan Profil',
    summary:
      'Pusat orientasi utama yang memperkenalkan profil profesional Rizal Hanifa Pratama: Guru Koding @ SMA IHSANUL FIKRI MUNGKID dan Manajer Proyek IT lulusan S1 Informatika.',
    ctaLabel: 'Lihat Ringkasan Profil',
    cameraPosition: [0, 16.8, 23.0],
    cameraTarget: [0, 0.6, 1.8],
    roomCenter: [0, 0, 0],
    accentHex: '#38BDF8',
    highlights: [
      'Guru Koding & Kelas Internasional Bilingual (ICIF) @ SMA Ihsanul Fikri',
      'Tim SPMI Mutu Pembelajaran & Pengelola Lab 50+ Komputer',
      'Manajemen Proyek IT, Metodologi Agile & Digitalisasi Sistem',
    ],
  },
  {
    id: 'projects',
    name: 'Projects Studio',
    shortLabel: 'Projects',
    code: '02',
    purpose: 'Showcase Produk & Galeri Banner',
    summary:
      'Katalog 6 produk unggulan lengkap dengan banner visual, screenshot antarmuka, stack teknologi, metrik KPI nyata, dan ringkasan eksekusi.',
    ctaLabel: 'Buka Showcase Produk',
    cameraPosition: [-15.5, 9.2, -0.5],
    cameraTarget: [-11.5, 1.5, -8.5],
    roomCenter: [-11.5, 0, -8.5],
    accentHex: '#38BDF8',
    highlights: [
      'mFood POS · Multi-Outlet Cloud POS & Kitchen Sync',
      'DIAMOND KMS · Enterprise SOP & Knowledge Retrieval',
      'Employr, Triagro, Prompt Battle & RevOps Engine',
    ],
  },
  {
    id: 'systems',
    name: 'Laboratorium Sistem',
    shortLabel: 'Lab Sistem',
    code: '03',
    purpose: 'Arsitektur Sistem & Alur SOP',
    summary:
      'Dokumentasi teknis PRD, diagram state machine sinkronisasi offline, pipa RAG bebas halusinasi dengan sitasi terverifikasi, dan alur kerja operasional.',
    ctaLabel: 'Periksa Sistem & Alur Kerja',
    cameraPosition: [15.5, 9.2, -0.5],
    cameraTarget: [11.5, 1.5, -8.5],
    roomCenter: [11.5, 0, -8.5],
    accentHex: '#818CF8',
    highlights: [
      'Perencanaan & Pemetaan Dependensi WBS',
      'Manajemen Risiko & Matriks Keputusan Trade-off',
      'Ritual Rekayasa & Kolaborasi Lintas Fungsi',
    ],
  },
  {
    id: 'experience',
    name: 'Galeri Pengalaman',
    shortLabel: 'Pengalaman',
    code: '04',
    purpose: 'Rekam Jejak Karir & Kepemimpinan',
    summary:
      'Linimasa kronologis kepemimpinan proyek, lingkup tanggung jawab tim engineering & lintas divisi, serta portofolio delivery dari tahun ke tahun.',
    ctaLabel: 'Lihat Linimasa & Peran',
    cameraPosition: [-16, 8.8, 13.5],
    cameraTarget: [-11.5, 1.5, 6.5],
    roomCenter: [-11.5, 0, 6.5],
    accentHex: '#34D399',
    highlights: [
      'Coding Teacher — SMA IHSANUL FIKRI MUNGKID (Magelang)',
      'Digital Marketing — PT Triagro Hijrah Jaya (Sukoharjo)',
      'IT Team Lead & PM — Movio Studio & Cont Solutions Indonesia',
      'Head of PM Department — IT Club UPN Veteran Yogyakarta',
    ],
  },
  {
    id: 'cases',
    name: 'Case Archive',
    shortLabel: 'Cases',
    code: '05',
    purpose: 'Studi Kasus 14-Poin Mendalam',
    summary:
      'Arsip analisis mendalam mencakup problem statement, batasan teknis (constraints), trade-offs, mitigasi risiko, fase eksekusi, hingga evaluasi lessons learned.',
    ctaLabel: 'Baca Studi Kasus Lengkap',
    cameraPosition: [16, 8.8, 13.5],
    cameraTarget: [11.5, 1.5, 6.5],
    roomCenter: [11.5, 0, 6.5],
    accentHex: '#F59E0B',
    highlights: [
      'Structured 14-section PM decision documentation',
      'Explicit constraints, trade-offs, and risk mitigations',
      'Verifiable qualitative & operational outcomes',
    ],
  },
  {
    id: 'contact',
    name: 'Ruang Kontak',
    shortLabel: 'Kontak',
    code: '06',
    purpose: 'Saluran Kolaborasi & Unduh CV',
    summary:
      'Ruang terhubung langsung dengan Rizal melalui email, profil LinkedIn, formulir pesan, atau unduh berkas CV terverifikasi.',
    ctaLabel: 'Hubungi Rizal & Unduh CV',
    cameraPosition: [0, 8.5, 21.5],
    cameraTarget: [0, 1.4, 11.5],
    roomCenter: [0, 0, 11.5],
    accentHex: '#38BDF8',
    highlights: [
      'Email Langsung: rizalhp12345@gmail.com',
      'Unduh Berkas CV Terverifikasi (Teks Lengkap & Format Cetak)',
      'Terbuka untuk Peluang Guru Koding, IT PM & Technical PM',
    ],
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'unilever-gt2',
    title: 'Portal Belajar GT2 Unilever — E-Learning & SCORM 1.2 Simulation System',
    category: ['Software Systems', 'Educational Projects'],
    summary:
      'Portal pembelajaran mandiri modul General Trade 2 (GT2) Unilever Indonesia dengan arsitektur SCORM 1.2 browser shim mandiri, integrasi Adobe Captivate, dan video walkthrough simulasi.',
    role: 'E-Learning Systems Lead & Front-End Developer',
    period: '2025',
    projectStatus: 'Production Deployed',
    relevanceRank: 1,
    bannerImage: '/products/unilever-banner.svg',
    demoVideo: {
      url: '/videos/gt2-portal-demo.webm',
      type: 'video/webm',
      poster: '/products/unilever-banner.svg',
      title: 'Demo Walkthrough Simulasi Modul GT2 Unilever',
      caption: 'Video simulasi interaktif alur pelatihan Direct Sales Representative (DSR) Unilever tanpa server LMS eksternal.',
    },
    galleryImages: [
      {
        url: '/products/unilever-banner.svg',
        title: 'Antarmuka Portal Belajar GT2 Unilever',
        caption: 'Katalog modul interaktif DSR dan ringkasan materi pelatihan terstruktur.',
      },
    ],
    overview:
      'Portal Belajar GT2 Unilever adalah sistem pembelajaran mandiri responsif yang menyajikan materi Tugas dan Tanggung Jawab Direct Sales Representative (DSR) Unilever melalui modul interaktif Adobe Captivate dan video simulasi tanpa ketergantungan server LMS eksternal.',
    context:
      'Tenaga penjual (sales force) Unilever lini General Trade memerlukan standarisasi pelatihan rutin mengenai prosedur kunjungan toko, penataan display produk (merchandising), dan pencapaian target penjualan langsung di berbagai daerah.',
    problem:
      'Modul interaktif Adobe Captivate standar mensyaratkan infrastruktur LMS enterprise yang lambat diakses lewat jaringan seluler lapangan, dan sering memunculkan error fatal "unable to acquire LMS API" saat dibuka di luar server LMS berbayar.',
    objectives: [
      'Menghilangkan ketergantungan server LMS eksternal dengan mengimplementasikan SCORM 1.2 browser API shim mandiri langsung di browser client.',
      'Menyediakan antarmuka web modern yang ringan, cepat dimuat (< 1.5 detik), dan responsif penuh pada peramban smartphone salesman di lapangan.',
      'Mengintegrasikan 2 modul interaktif SCORM dan video walkthrough simulasi ke dalam satu portal terpadu berbasis hash routing.',
    ],
    constraints: [
      'Wajib kompatibel penuh dengan panggilan fungsi runtime Adobe Captivate HTML5 (LMSInitialize, LMSGetValue, LMSSetValue, LMSCommit, LMSFinish).',
      'Pengguna lapangan mengakses materi menggunakan beragam varian browser ponsel dengan kondisi sinyal seluler fluktuatif.',
    ],
    responsibilities: [
      'Merancang dan mengimplementasikan client-side SCORM 1.2 API shim (window.API) in-memory untuk memfasilitasi handshake modul Captivate.',
      'Membangun shell antarmuka portal responsif bergaya Shadcn UI dengan drawer navigasi mobile dan penjejak breadcrumb.',
      'Mengonfigurasi deployment edge Cloudflare untuk memastikan latensi akses aset modul interaktif di bawah 50ms di seluruh Indonesia.',
    ],
    teamAndStakeholders: [
      '1 E-Learning Systems Lead & Front-End Developer (Rizal)',
      '1 Instructional Designer & Content Specialist',
      'Unilever Field Training Managers & Direct Sales Representatives',
    ],
    approach: [
      'Menganalisis skema variabel SCORM yang diakses runtime Captivate (cmi.core.lesson_status, cmi.core.entry, cmi.suspend_data).',
      'Menyusun kerangka Single Page Application (SPA) modular berbasis lightweight hash navigation (#/ringkasan, #/modul-gt2, #/video).',
      'Mengoptimasi transcoding video simulasi dan caching file interaktif melalui Cloudflare CDN Edge.',
    ],
    keyDecisions: [
      {
        decision: 'Menerapkan in-memory SCORM 1.2 shim pada obyek window.API di parent window.',
        rationale:
          'Mengeliminasi pesan dialog kegagalan LMS dari Adobe Captivate sekaligus meniadakan biaya server LMS enterprise bulanan.',
        tradeOff:
          'Data interaksi dan nilai kuis tersimpan secara lokal selama sesi browser aktif dan tidak direkap ke database HR terpusat.',
      },
      {
        decision: 'Mendistribusikan seluruh aset statis dan media video melalui jaringan CDN Cloudflare.',
        rationale:
          'Memastikan kecepatan buka slide tetap responsif dan lancar bahkan saat diakses melalui koneksi seluler 3G/4G di pelosok.',
        tradeOff:
          'Pembaruan berkas materi memerlukan pembersihan (purge) cache CDN secara terprogram saat rilis konten baru.',
      },
    ],
    execution: [
      {
        phase: 'Fase 1: Rekayasa SCORM Shim & Pengujian Runtime',
        deliverable: 'Spesifikasi SCORM 1.2 Shim & Validasi Captivate API Handshake',
        outcome: 'Modul Captivate berhasil dibuka dan berinteraksi mulus tanpa dialog error LMS.',
      },
      {
        phase: 'Fase 2: UI Portal & Integrasi Media Interaktif',
        deliverable: 'Portal responsif mobile, drawer navigation, dan modul video player',
        outcome: 'Navigasi materi terstruktur dengan tampilan bersih dan ramah layar sentuh.',
      },
      {
        phase: 'Fase 3: Optimasi Edge CDN & Live Production',
        deliverable: 'Penyebaran domain unilever.riizalhp.web.id dengan konfigurasi Cloudflare',
        outcome: 'Portal beroperasi secara stabil dengan waktu respons super cepat di lingkungan live.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Pembatasan keamanan browser terhadap iframe cross-origin saat modul Captivate memanggil parent window.',
        mitigation:
          'Menyajikan seluruh berkas modul Captivate dan antarmuka shell di bawah origin dan sub-path domain yang sama.',
      },
      {
        risk: 'Ukuran aset multimedia yang besar berpotensi menghabiskan kuota data sales representative.',
        mitigation:
          'Melakukan kompresi gambar SVG/WebP dan transcoding video MP4 dengan profil bitrate hemat data.',
      },
    ],
    outcomes: [
      'Berhasil meniadakan ketergantungan pada server LMS enterprise berbiaya lisensi tinggi untuk pelatihan mandiri DSR.',
      'Mempercepat pemuatan materi ajar menjadi di bawah 1.5 detik dengan navigasi yang sangat praktis di smartphone.',
      'Menjadi blueprint arsitektur mandiri bagi penyajian modul SCORM interaktif korporasi modern.',
    ],
    lessonsLearned: [
      'Memahami spesifikasi teknis format standar industri (seperti SCORM) membuka peluang inovasi rekayasa browser shim yang menghemat biaya server secara signifikan.',
    ],
    evidence: [
      {
        type: 'video',
        title: 'Video Demo Walkthrough Portal GT2 Unilever',
        url: '/videos/gt2-portal-demo.webm',
        caption: 'Demonstrasi interaktif modul pembelajaran GT2 dan SCORM 1.2 client-side shim.',
        metricsOrSpec: [
          'Format: WebM Video (VP9)',
          'Runtime: Client-Side SCORM 1.2 Shim',
          'Akses: 100% Offline-Ready & Mobile Responsive',
        ],
      },
      {
        type: 'link',
        title: 'Portal Belajar GT2 Unilever Live',
        url: 'https://unilever.riilever.web.id',
        caption: 'Portal pembelajaran mandiri modul General Trade 2 aktif dan dapat diakses publik.',
        metricsOrSpec: [
          'Runtime: SCORM 1.2 Client-Side Shim',
          'Delivery: Cloudflare Edge CDN',
          'Integrasi: Adobe Captivate HTML5',
        ],
      },
      {
        type: 'diagram',
        title: 'Arsitektur SCORM 1.2 Browser Shim',
        url: 'https://unilever.riizalhp.web.id/#/ringkasan',
        caption: 'Diagram komunikasi dua arah antara iframe Adobe Captivate dan window.API shim lokal.',
        metricsOrSpec: [
          'Zero Backend Dependency',
          'Deterministic Session State Persistence',
        ],
      },
    ],
    technologies: [
      'Adobe Captivate',
      'SCORM 1.2 Shim',
      'JavaScript (ES6+)',
      'HTML5 / CSS3',
      'Cloudflare Pages',
      'Responsive Mobile UI',
    ],
    publicUrl: 'https://unilever.riizalhp.web.id',
  },
  {
    slug: 'dashboard-oee',
    title: 'OEE Monitoring System — Real-Time Overall Equipment Effectiveness Dashboard',
    category: ['Software Systems', 'Product/SaaS'],
    summary:
      'Sistem pemantauan efektivitas mesin industri manufaktur real-time berbasis Overall Equipment Effectiveness (OEE) yang melacak Availability, Performance, Quality, serta analisis pareto downtime.',
    role: 'Industrial IoT & Frontend System Developer',
    period: '2025',
    projectStatus: 'Production Pilot & Simulation Live',
    relevanceRank: 2,
    bannerImage: '/products/dashboard-oee-banner.svg',
    galleryImages: [
      {
        url: '/products/dashboard-oee-banner.svg',
        title: 'OEE Real-Time Gauges & Machine State Board',
        caption: 'Visualisasi metrik kualifikasi OEE dengan perhitungan real-time.',
      },
    ],
    overview:
      'OEE Monitoring System adalah dashboard pemantauan efektivitas operasional lini manufaktur industri yang mengukur tiga pilar utama: Availability (ketersediaan mesin), Performance (kecepatan siklus kerja), dan Quality (rasio produk baik) secara real-time.',
    context:
      'Pabrik manufaktur dan lini perakitan membutuhkan transparansi penuh terhadap efisiensi mesin untuk mendeteksi kerugian tersembunyi (Six Big Losses) seperti breakdown dadakan, speed loss, dan minor stoppage.',
    problem:
      'Metode pencatatan konvensional dengan kertas lembar kerja operator sering menghasilkan data yang terlambat direkap ke manajemen, sulit mendeteksi tren stop time secara spesifik, dan tidak memiliki simulasi skenario kegagalan operasional.',
    objectives: [
      'Mengotomasi perhitungan Overall Equipment Effectiveness (OEE = A x P x Q) secara akurat tanpa kalkulasi manual.',
      'Menampilkan klasifikasi downtime secara visual: Breakdown, Quality defect, Startup loss, Tool change, dan Other losses.',
      'Menyediakan mesin simulasi interaktif ("Mulai Simulasi") agar operator dan pengawas dapat menguji skenario fluktuasi performa mesin secara langsung.',
    ],
    constraints: [
      'Dashboard harus stabil beroperasi 24/7 di monitor lini perakitan (shop floor display) tanpa lonjakan memori (memory leak).',
      'Kalkulasi formula OEE harus presisi dan sesuai dengan kaidah standar TPM (Total Productive Maintenance).',
    ],
    responsibilities: [
      'Mengembangkan visualisasi gauge interaktif menggunakan JustGage dan Raphael.js untuk Availability, Performance, Quality, dan Total OEE.',
      'Mengintegrasikan grafik kategori stop time menggunakan Chart.js dengan plugin datalabels untuk analisis pareto downtime.',
      'Membangun simulation engine berbasis interval waktu untuk mereplikasi data sensor mesin (loading time, operation time, standard cycle, speed loss).',
    ],
    teamAndStakeholders: [
      '1 Industrial IoT & Frontend System Developer (Rizal)',
      'Manufacturing Process Engineers & Maintenance Supervisors',
      'Plant Operations Manager',
    ],
    approach: [
      'Merancang formula kalkulasi standar: Availability = Operation Time / Loading Time; Performance = (Standard Cycle x Total Qty) / Operation Time; Quality = Good Qty / Total Qty.',
      'Membuat panel simulator ringkas dan bersih yang memungkinkan peralihan instan antara data historis statis dan simulasi telemetri aktif.',
      'Mengelompokkan indikator visual status mesin (RUN, IDLE, STOP, TROUBLE) dengan kode warna industri standar.',
    ],
    keyDecisions: [
      {
        decision: 'Menggunakan Vanilla JavaScript dengan Chart.js dan JustGage tanpa framework berat.',
        rationale:
          'Menjamin konsumsi CPU dan RAM minimal pada display monitor mini-PC pabrik yang beroperasi tanpa henti.',
        tradeOff:
          'Manajemen state reaktif diatur secara manual melalui DOM event binding tanpa state store eksternal.',
      },
      {
        decision: 'Menyediakan tombol kendali simulasi satu-klik di bilah navigasi atas.',
        rationale:
          'Memungkinkan demonstrasi dan pelatihan operator baru tanpa harus menunggu trigger sensor fisik dari mesin sebenarnya.',
        tradeOff:
          'Memerlukan modul generator data sintetis terisolasi di dalam bundel frontend.',
      },
    ],
    execution: [
      {
        phase: 'Fase 1: Perumusan Matematika OEE & Skema Data',
        deliverable: 'Spesifikasi formula TPM dan struktur JSON telemetri mesin',
        outcome: 'Formula Availability, Performance, Quality terverifikasi 100% akurat.',
      },
      {
        phase: 'Fase 2: Pengembangan Gauge & Chart Komponen',
        deliverable: 'Komponen visual JustGage OEE, tabel output timing, dan chart downtime',
        outcome: 'Antarmuka responsif dengan kontras tinggi untuk visibilitas jarak jauh di lantai pabrik.',
      },
      {
        phase: 'Fase 3: Integrasi Simulator & Rilis Produksi',
        deliverable: 'Mesin simulasi real-time dan hosting di sub-domain Cloudflare',
        outcome: 'Sistem online di dashboard-oee.riizalhp.web.id siap pakai untuk demo industri.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Akumulasi interval animasi pada chart memicu degradasi memori peramban.',
        mitigation:
          'Menggunakan pembersihan update instance Chart.js dan membatasi riwayat data buffer secara berkala.',
      },
      {
        risk: 'Pembagian dengan angka nol pada Availability saat Loading Time bernilai 0.',
        mitigation:
          'Menyematkan fungsi safe-divide dengan fallback persentase 0.0% secara deterministik.',
      },
    ],
    outcomes: [
      'Meningkatkan kecepatan deteksi stop time lini produksi dari hitungan jam pasca-shift menjadi hitungan detik.',
      'Memudahkan tim maintenance memprioritaskan perbaikan berdasarkan kategori stop terbesar (Breakdown vs Tooling).',
      'Memberikan prototipe sistem industri siap integrasi dengan sensor PLC melalui REST API atau MQTT broker.',
    ],
    lessonsLearned: [
      'Antarmuka sistem industri harus mengedepankan legibilitas angka dan status instan daripada animasi dekoratif yang membebani komputasi.',
    ],
    evidence: [
      {
        type: 'link',
        title: 'Live OEE Monitoring System',
        url: 'https://dashboard-oee.riizalhp.web.id',
        caption: 'Dashboard pemantauan OEE manufaktur real-time dengan mode simulasi.',
        metricsOrSpec: [
          'Target OEE: > 80% World Class Benchmark',
          'Update Mode: Live Interactive Simulation Engine',
          'Engine: JustGage + Chart.js + Datalabels',
        ],
      },
      {
        type: 'diagram',
        title: 'Formula Dekomposisi 3 Pilar OEE',
        url: 'https://dashboard-oee.riizalhp.web.id',
        caption: 'Hubungan matematis Loading Time, Downtime Losses, Standard Cycle, dan OEE Score.',
        metricsOrSpec: [
          'Availability x Performance x Quality',
          'Six Big Losses Operational Mapping',
        ],
      },
    ],
    technologies: [
      'Chart.js & DataLabels',
      'JustGage & Raphael.js',
      'JavaScript (Vanilla ES6+)',
      'CSS3 Grid / Flexbox',
      'TPM / Industrial OEE Engine',
      'Cloudflare Pages',
    ],
    publicUrl: 'https://dashboard-oee.riizalhp.web.id',
  },
  {
    slug: 'employr',
    title: 'Employr — Career Workspace & ATS-Friendly CV Builder Platform',
    category: ['Product/SaaS', 'AI'],
    summary:
      'Career workspace dan platform penyusunan CV ramah ATS, job application tracker tanpa batas, dan portal informasi loker untuk pencari kerja entry-level Indonesia dengan model Lifetime Membership.',
    role: 'Product & Full-Stack System Architect',
    period: '2025 — 2026',
    projectStatus: 'Production Live & Monorepo',
    relevanceRank: 3,
    bannerImage: '/products/employr-banner.svg',
    demoVideo: {
      url: '/videos/employr-demo.mp4',
      type: 'video/mp4',
      poster: '/products/employr-banner.svg',
      title: 'Demo Alur Kerja Terpadu Platform Employr',
      caption: 'Rekaman demo showcase landing page ("Satu alur rapi, langsung terasa bedanya") — penyusunan CV ATS dan manajemen lamaran.',
    },
    galleryImages: [
      {
        url: '/products/employr-banner.svg',
        title: 'Employr ATS CV Studio & Application Tracker',
        caption: 'Penyusunan CV ramah ATS berbasis client-side print rendering tanpa Puppeteer.',
      },
    ],
    overview:
      'Employr adalah ekosistem karir terpadu yang dirancang bagi talenta muda Indonesia (lulusan SMA, SMK, dan Mahasiswa) untuk menyusun CV berstandar ATS, memantau puluhan proses lamaran kerja di satu papan Kanban, serta mengeksplorasi loker terverifikasi.',
    context:
      'Pencari kerja pemula di Indonesia kerap mengalami penolakan otomatis dari sistem ATS perusahaan akibat tata letak CV yang salah format, sekaligus kesulitan melacak status pengiriman lamaran yang tercecer di berbagai job portal.',
    problem:
      'Platform CV maker yang ada mengenakan biaya langganan bulanan mahal (subscription model), menggunakan server-side PDF generator (Puppeteer) yang memakan RAM server sangat tinggi, dan membatasi jumlah lamaran yang dapat dipantau pengguna gratis.',
    objectives: [
      'Menghadirkan model Lifetime Membership sekali bayar selamanya (bukan langganan bulanan) dengan harga terjangkau mulai Rp19.000.',
      'Mengembangkan arsitektur client-side rendering (JSON -> React -> HTML Preview -> Print PDF Ctrl+P) yang hemat memori server dan zero CPU server overhead.',
      'Menyediakan fitur Job Tracker tanpa batas (unlimited applications) untuk semua pengguna serta integrasi portal loker informasional.',
    ],
    constraints: [
      'Infrastruktur backend dibatasi anggaran RAM VPS 8GB (PostgreSQL, Redis, PgBouncer, SeaweedFS, pure Node worker). Server-side headless browser dilarang keras.',
      'Copywriting antarmuka ramah pengguna lokal (Bahasa Indonesia kasual santun, tanpa istilah AI/LLM/Prompt/Subscription yang membingungkan).',
    ],
    responsibilities: [
      'Merancang arsitektur monorepo Turborepo + pnpm workspaces yang memisahkan aplikasi web, dashboard, portal-loker, admin, dan package bersama.',
      'Mengimplementasikan tRPC v11 untuk type-safe API routing, Better Auth untuk session cookie lintas subdomain, dan Prisma ORM dengan PostgreSQL.',
      'Membangun komponen preview CV ramah cetak (print.css) dengan validasi margin, typography Geist/Inter, dan struktur ATS terverifikasi.',
    ],
    teamAndStakeholders: [
      '1 Product & Full-Stack System Architect (Rizal)',
      '2 Full-Stack Developers & 1 UI/UX Designer',
      'Career Mentors, Early-Career Job Seekers & Partner Recruiters',
    ],
    approach: [
      'Membagi arsitektur produk ke dalam subdomain modular: web (employr.id), dashboard (app.employr.id), portal loker (loker.employr.id), dan admin (masterdata.employr.id).',
      'Menggunakan antrian BullMQ dengan 3 queue esensial (AI, Unlock, Notification) tanpa queue render PDF berat.',
      'Mendesain antarmuka mobile-first dengan bottom navigation 5-tab (Beranda, CV, Tracker, Misi, Akun) dan token warna Navy/Orange.',
    ],
    keyDecisions: [
      {
        decision: 'Client-side PDF generation via native browser print engine (Ctrl+P / window.print) dengan CSS print stylesheet khusus.',
        rationale:
          'Mengeliminasi kebutuhan Headless Chrome / Puppeteer di server VPS yang biasanya memakan 1-2GB RAM per concurrent render.',
        tradeOff:
          'Tata letak cetak harus dikontrol ketat melalui CSS media print dan page-break rules.',
      },
      {
        decision: 'Model bisnis Lifetime Member sekali bayar, tanpa subscription bulanan atau tahunan.',
        rationale:
          'Sesuai dengan daya beli kelompok usia 16-24 tahun di Indonesia yang enggan terikat tagihan berulang.',
        tradeOff:
          'Monetisasi bertumpu pada volume akuisisi pengguna baru dan penawaran paket optimasi karir lanjutan.',
      },
    ],
    execution: [
      {
        phase: 'Fase 1: Fondasi Monorepo & Kontrak Data',
        deliverable: 'Setup Turborepo, schema Prisma PostgreSQL, dan tRPC routers',
        outcome: 'Fondasi type-safe siap pakai di seluruh aplikasi web, dashboard, dan admin.',
      },
      {
        phase: 'Fase 2: CV Builder & Job Tracker Kanban',
        deliverable: 'Editor CV real-time, print engine CSS, dan Kanban board lamaran',
        outcome: 'Pengguna dapat membuat CV ATS dalam 5 menit dan memantau status lamaran.',
      },
      {
        phase: 'Fase 3: Multi-Subdomain Auth & Midtrans Payment',
        deliverable: 'Better Auth cross-subdomain cookie dan integrasi webhook Midtrans',
        outcome: 'Pengalaman login mulus dari landing page ke dashboard dengan transaksi otomatis.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Perbedaan rendering cetak browser antar platform (Chrome, Safari, Firefox).',
        mitigation:
          'Menyusun print stylesheet dengan dimensi standar A4 (210mm x 297mm), ukuran font pt pasti, dan preview kontainer rasio 1:1.414.',
      },
      {
        risk: 'Penyalahgunaan penyimpanan draft CV oleh pengguna gratis.',
        mitigation:
          'Menerapkan data retention draft 7 hari untuk free user, sementara member berbayar mendapatkan retensi permanen.',
      },
    ],
    outcomes: [
      'Menghasilkan platform CV builder ramah ATS dengan efisiensi resource server tertinggi (berjalan mulus pada VPS RAM 8GB).',
      'Memproses ribuan lamaran yang dipantau melalui fitur Tracker tanpa batas secara rapi oleh para job seeker muda.',
      'Arsitektur monorepo modular memfasilitasi penambahan modul karir dan pembelajaran di masa depan secara independen.',
    ],
    lessonsLearned: [
      'Memanfaatkan kemampuan native browser seperti CSS Print Engine jauh lebih handal, murah, dan scalable dibanding menjalankan instance headless browser di server.',
    ],
    evidence: [
      {
        type: 'video',
        title: 'Video Demo Showcase Alur Kerja Employr',
        url: '/videos/employr-demo.mp4',
        caption: 'Demonstrasi alur pembuatan CV ramah ATS dan Kanban Tracker dari landing page resmi ("Satu alur rapi, langsung terasa bedanya").',
        metricsOrSpec: [
          'Format: MP4 Video (H.264)',
          'Alur: Buat CV ATS -> Preview -> Kanban Tracker',
          'Satu alur rapi, langsung terasa bedanya',
        ],
      },
      {
        type: 'link',
        title: 'Live Platform Employr',
        url: 'https://employr.id',
        caption: 'Landing page dan ekosistem karir Employr live di internet.',
        metricsOrSpec: [
          'Business Model: Lifetime Member (Sekali Bayar)',
          'Architecture: Next.js 15 App Router + Turborepo Monorepo',
          'Database: Self-Hosted PostgreSQL + PgBouncer + Prisma',
        ],
      },
      {
        type: 'diagram',
        title: 'Client-Side Print PDF Architecture',
        url: 'https://employr.id',
        caption: 'Alur JSON State -> React Component Preview -> Native Browser Print PDF Engine.',
        metricsOrSpec: [
          'Server CPU: 0% PDF Overhead',
          'Zero Puppeteer / Chrome Server Dependency',
        ],
      },
    ],
    technologies: [
      'Next.js 15 (App Router)',
      'TypeScript 5',
      'Tailwind CSS 4',
      'shadcn/ui',
      'tRPC v11',
      'Better Auth',
      'Prisma & PostgreSQL',
      'Turborepo',
    ],
    publicUrl: 'https://employr.id',
  },
  {
    slug: 'mfood',
    title: 'mfood.id — Integrated F&B Business Operating System & Mobile POS',
    category: ['Product/SaaS', 'Software Systems'],
    summary:
      'Solusi operasional terintegrasi untuk bisnis kuliner dan resto modern: Mobile POS offline-resilient, sinkronisasi kitchen display (KDS), manajemen titik mangkal / multi-outlet, pembayaran QRIS, dan otomasi WhatsApp report.',
    role: 'Technical Project Manager & Systems Architect',
    period: '2025 — 2026',
    projectStatus: 'Production Live & Multi-Outlet Deployed',
    relevanceRank: 4,
    bannerImage: '/products/mfood-banner.svg',
    demoVideo: {
      url: '/videos/demo-mfood.mp4',
      type: 'video/mp4',
      poster: '/products/mfood-banner.svg',
      title: 'Video Demonstrasi POS Kasir & KDS mfood.id',
      caption: 'Rekaman demo transaksi kasir offline-resilient, pemilihan modifier, dan alur sinkronisasi dapur.',
    },
    galleryImages: [
      {
        url: '/products/mfood-banner.svg',
        title: 'mfood.id Mobile POS & Order Ecosystem',
        caption: 'Sistem kasir multi-outlet dengan dukungan antrean transaksi offline IndexedDB.',
      },
      {
        url: '/products/mfood-pos-kds.svg',
        title: 'Kitchen Display System & WhatsApp Reporting',
        caption: 'Sinkronisasi tiket pesanan dapur real-time dan rekap penjualan otomatis ke WhatsApp owner.',
      },
    ],
    overview:
      'mfood.id adalah sistem operasi bisnis F&B komprehensif yang menyatukan Point of Sale (POS), sinkronisasi stasiun dapur (KDS), manajemen multi-cabang dan food truck (titik mangkal), pembayaran QRIS instan, toko online terhubung, dan pelaporan keuangan harian via WhatsApp.',
    context:
      'Pelaku usaha kuliner (dari gerai street food, kedai kopi, hingga resto multi-cabang) sering mengalami pesanan berantakan, perselisihan kasir dengan dapur, dan kesulitan memantau omzet saat sedang tidak di tempat.',
    problem:
      'Sistem kasir berbasis web murni rentan lumpuh saat jaringan Wi-Fi outlet drop di jam sibuk makan siang, menyebabkan pesanan terlewat, struk dobel, dan hilangnya rekonsiliasi pembayaran di akhir shift.',
    objectives: [
      'Menjamin 0% pesanan hilang saat koneksi internet terputus sementara hingga 30 menit melalui antrean transaksi lokal IndexedDB.',
      'Menghubungkan kasir dengan Kitchen Display System (KDS) dan printer dapur melalui protokol WebSocket lokal dengan latensi di bawah 200ms.',
      'Mengirimkan rekapitulasi penjualan harian otomatis langsung ke nomor WhatsApp pemilik usaha tanpa harus membuka spreadsheet manual.',
    ],
    constraints: [
      'Dapat dijalankan lancar pada tablet Android berkapasitas RAM 3GB di lingkungan outlet yang bising dan panas.',
      'Desain antarmuka satu layar yang memangkas waktu pelatihan kasir baru menjadi di bawah 4 jam.',
    ],
    responsibilities: [
      'Menyusun Product Requirement Document (PRD), spesifikasi sinkronisasi offline-first, dan kontrak API rekonsiliasi data order.',
      'Memimpin sprint tim engineering dan mengoordinasikan uji coba lapangan (shadow testing) bersama kasir dan kru dapur.',
      'Merancang protokol cetak struk ESC/POS yang kompatibel dengan berbagai merk printer termal Bluetooth/USB.',
    ],
    teamAndStakeholders: [
      '1 Technical Project Manager & Systems Architect (Rizal)',
      '3 Full-Stack & Frontend Engineers',
      '1 Product Designer',
      'F&B Outlet Managers, Cashiers, Kitchen Expediters & Restaurant Owners',
    ],
    approach: [
      'Memetakan alur pesanan dari pemilihan menu dan modifier, pengiriman tiket ke dapur, hingga split-bill dan pembayaran.',
      'Menerapkan skema antrean transaksi lokal berbasis IndexedDB dengan kunci UUID idempotensi unik sebelum data disinkronkan ke server.',
      'Menjalankan simulasi kegagalan jaringan berkala (deliberate WAN disconnection test) sebelum perilisan ke pilot outlet.',
    ],
    keyDecisions: [
      {
        decision: 'Memprioritaskan arsitektur offline-first dengan IndexedDB dan fallback LAN lokal dibanding laporan grafik analitik di fase awal.',
        rationale:
          'Bagi pemilik gerai, kecepatan dan keandalan input pesanan saat rush-hour jauh lebih krusial dibanding grafik dashboard.',
        tradeOff:
          'Pengembangan fitur reporting BI multi-cabang tingkat lanjut dijadwalkan pada iterasi berikutnya.',
      },
      {
        decision: 'Menghilangkan modal dialog bertingkat untuk pemilihan varian menu (topping, level pedas, es).',
        rationale:
          'Pengamatan langsung membuktikan kasir sering salah input saat harus membuka lebih dari 2 pop-up saat antrean pelanggan panjang.',
        tradeOff:
          'Memerlukan rancangan tata letak kisi menu yang lebih padat dan efisien.',
      },
    ],
    execution: [
      {
        phase: 'Fase 1: Riset Lapangan & Arsitektur Sinkronisasi',
        deliverable: 'Mesin status sinkronisasi offline, kontrak data order, dan prototipe kasir',
        outcome: 'Disetujui oleh tim operasional outlet tanpa ambiguitas ruang lingkup.',
      },
      {
        phase: 'Fase 2: Core POS Engine & Integrasi KDS',
        deliverable: 'Antrean pesanan idempoten, modul split-bill, dan live ticket KDS',
        outcome: 'Lolos uji stres 200 pesanan beruntun dalam kondisi simulasi packet loss.',
      },
      {
        phase: 'Fase 3: Pilot Multi-Outlet & Otomasi WhatsApp',
        deliverable: 'Peluncuran live pilot, gateway pembayaran QRIS, dan bot rekap WhatsApp',
        outcome: 'Diadopsi oleh lebih dari 1.200 bisnis kuliner aktif dengan nol kasus pesanan hilang.',
      },
    ],
    risksAndTradeOffs: [
      {
        risk: 'Konflik penyuntingan tagihan meja yang sama dari dua kasir saat kondisi offline.',
        mitigation:
          'Menerapkan event-log merging deterministik berdasarkan baris item UUID dan terminal lock primer per meja.',
      },
      {
        risk: 'Kompatibilitas driver printer struk termal yang beragam di lapangan.',
        mitigation:
          'Menyusun template perintah byte mentah ESC/POS standar dengan print-bridge berbasis Web Bluetooth/USB.',
      },
    ],
    outcomes: [
      'Menghilangkan pesanan hilang atau duplikat tiket dapur akibat gangguan koneksi Wi-Fi di outlet pilot.',
      'Mempersingkat waktu training kasir baru dari 3 hari menjadi 4 jam berkat antarmuka sentuh satu layar yang intuitif.',
      'Mempercepat penutupan buku shift harian melalui otomasi pelaporan penjualan ke WhatsApp pemilik bisnis.',
    ],
    lessonsLearned: [
      'Mendesain software POS di ruang kantor ber-AC tidak pernah mencerminkan tekanan mental kasir di jam sibuk makan malam; observasi langsung di gerai menyelamatkan berminggu-minggu pekerjaan ulang.',
    ],
    evidence: [
      {
        type: 'video',
        title: 'Video Demonstrasi Operasional mfood.id',
        url: '/videos/demo-mfood.mp4',
        caption: 'Rekaman demonstrasi sistem kasir offline-resilient dengan antrean transaksi IndexedDB.',
        metricsOrSpec: [
          'Format: MP4 Video (Remotion)',
          'Zero Latency Input Kasir',
          'Offline-First IndexedDB Sync',
        ],
      },
      {
        type: 'link',
        title: 'Live Ekosistem mfood.id',
        url: 'https://mfood.id',
        caption: 'Platform operasional bisnis kuliner terintegrasi live di internet.',
        metricsOrSpec: [
          'Adopsi: 1.248+ Bisnis Kuliner Aktif',
          'Fitur: POS, KDS, Titik Mangkal, QRIS, WA Report',
          'Sync: Offline-Resilient IndexedDB',
        ],
      },
      {
        type: 'diagram',
        title: 'Arsitektur Offline-First Sync & KDS',
        url: 'https://mfood.id',
        caption: 'Diagram alur transisi status dari antrean IndexedDB lokal hingga acknowledgement stasiun dapur.',
        metricsOrSpec: [
          'Idempotent UUID Keys',
          'WebSocket LAN Fallback Protocol',
        ],
      },
    ],
    technologies: [
      'Astro & React',
      'TypeScript',
      'IndexedDB',
      'WebSockets',
      'PostgreSQL & Redis',
      'Tailwind CSS',
      'QRIS Payment',
      'WhatsApp API',
    ],
    publicUrl: 'https://mfood.id',
  },
];

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  scope: string;
  summary: string;
  contributions: string[];
  relatedCaseSlugs: string[];
}

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    id: 'exp-ihsanul-fikri',
    role: 'Coding Teacher',
    organization: 'SMA IHSANUL FIKRI MUNGKID',
    period: 'August 2026 — Present (3 months)',
    location: 'Magelang, Central Java, Indonesia',
    scope: 'Bilingual Coding Instruction (ICIF) · SPMI Academic Quality · Computer Lab Operations · AI & Deep Learning Programs',
    summary:
      'Delivers 26 teaching hours weekly to over 200 students across 11 classes, including bilingual instruction for the International Class of Ihsanul Fikri (ICIF). Contributes to the Internal Quality Assurance System (SPMI) and oversees a 50+ device computer laboratory.',
    contributions: [
      'Taught 200+ students across 11 classes, delivering 26 teaching hours per week focused on coding, programming, and computational skills.',
      'Taught 2 classes in the International Class of Ihsanul Fikri (ICIF) using a bilingual Indonesian-English teaching approach, delivering coding concepts and technical instruction in both languages.',
      'Contributed to the school’s Internal Quality Assurance System (SPMI) to support continuous improvement of academic and learning processes.',
      'Managed and maintained the school’s computer laboratory with 50+ devices, ensuring hardware and software readiness for daily learning activities.',
      'Contributed to the development and implementation of Deep Learning and Coding & Artificial Intelligence (AI) learning programs at the senior high school level.',
    ],
    relatedCaseSlugs: ['unilever-gt2'],
  },
  {
    id: 'exp-triagro',
    role: 'Digital Marketing',
    organization: 'PT Triagro Hijrah Jaya',
    period: 'November 2025 — Present (1 year)',
    location: 'Sukoharjo, Central Java, Indonesia',
    scope: 'Digital Marketing Operations · Growth Acquisition · Marketing Channel Architecture',
    summary:
      'Directing digital marketing strategy, customer acquisition funnels, and digital promotion campaigns for agricultural supply chain services and product distribution.',
    contributions: [
      'Planned and executed digital marketing campaigns across online channels to expand agricultural product reach and buyer engagement.',
      'Coordinated operational marketing funnels, lead intake tracking, and sales conversion optimization.',
      'Analyzed digital marketing campaign metrics and attribution performance to drive growth and customer retention.',
    ],
    relatedCaseSlugs: ['dashboard-oee'],
  },
  {
    id: 'exp-movio-studio',
    role: 'Information Technology Team Lead & General Project Manager',
    organization: 'Movio Studio (PT Movio Kreasi Indonesia)',
    period: 'November 2025 — September 2026 (11 months)',
    location: 'Kota Tangerang Selatan, Banten, Indonesia',
    scope: 'IT Team Lead (May 2026 — Sep 2026) · General Project Manager (Nov 2025 — May 2026)',
    summary:
      'Led the IT engineering department and governed studio project delivery, coordinating software engineering sprints, technical architecture, and cross-functional creative operations.',
    contributions: [
      'Served as Information Technology Team Lead (May 2026 — Sep 2026), managing engineering sprints, system architecture, and tech implementation.',
      'Served as General Project Manager (Nov 2025 — May 2026), orchestrating end-to-end creative and technology project timelines, scope, and cross-team deliverables.',
      'Standardized project tracking rituals and technical documentation, ensuring on-time project delivery across departments.',
    ],
    relatedCaseSlugs: ['unilever-gt2'],
  },
  {
    id: 'exp-cont-solutions',
    role: 'IT Project Manager',
    organization: 'Cont Solutions Indonesia',
    period: 'June 2024 — November 2025 (1 year 6 months)',
    location: 'Yogyakarta, Indonesia',
    scope: 'Client Software Solutions · Agile Sprint Management · System Architecture Alignment',
    summary:
      'Managed end-to-end IT solution deliverables and client software projects, translating business requirements into clear technical specifications and agile sprint milestones.',
    contributions: [
      'Directed sprint planning, backlog grooming, and milestone delivery across software engineers, UI/UX designers, and QA teams.',
      'Bridged communication between enterprise clients and development teams to ensure technical specifications matched operational needs.',
      'Mitigated technical dependencies, managed delivery risks, and ensured high standards of software quality and system stability.',
    ],
    relatedCaseSlugs: ['mfood', 'dashboard-oee'],
  },
  {
    id: 'exp-gemala-kempa',
    role: 'Product Development Intern',
    organization: 'PT Gemala Kempa Daya',
    period: 'June 2024 — August 2024 (3 months)',
    location: 'North Jakarta, Jakarta, Indonesia',
    scope: 'Product Development · Technical Component Specifications · Quality Assurance',
    summary:
      'Supported industrial manufacturing product development lifecycles, technical component specifications, and quality validation processes.',
    contributions: [
      'Assisted product engineering teams in preparing technical drawings, component specifications, and product validation protocols.',
      'Collaborated with production and quality control departments to review manufacturing tolerances and assembly workflows.',
      'Conducted process evaluations and documented actionable insights to enhance product quality and development cycle time.',
    ],
    relatedCaseSlugs: [],
  },
  {
    id: 'exp-it-club-upn',
    role: 'Head of Project Manager Departement & Staff PM',
    organization: 'Information Technology Club UPN Veteran Yogyakarta',
    period: 'February 2022 — August 2024 (2 years 7 months)',
    location: 'Sleman Regency, Yogyakarta, Indonesia',
    scope: 'Head of Department (Feb 2023 — Aug 2024) · Staff Project Manager (Feb 2022 — 2023)',
    summary:
      'Spearheaded the Project Management Department for over 2.5 years, mentoring 5 Project Managers who successfully handled 10 final digital software projects.',
    contributions: [
      'Became the Project Manager Leader leading 5 Project Managers who successfully handled 10 Final Projects for the Information Technology Club.',
      'Established standardized agile project governance frameworks, sprint rituals, and milestone tracking templates for student development teams.',
      'Served as Staff Project Manager (2022 — 2023), coordinating early student software projects and cross-functional technology workshops.',
    ],
    relatedCaseSlugs: ['employr'],
  },
  {
    id: 'exp-1000-startup',
    role: 'Hustler and Hacker',
    organization: 'Gerakan Nasional 1000 Startup Digital',
    period: 'February 2024 — July 2024 (6 months)',
    location: 'Yogyakarta, Indonesia',
    scope: 'Startup Incubation · Business Model Validation · MVP Prototyping',
    summary:
      'Participated in the national startup incubation program, validating problem-solution fit, designing business models, and developing rapid technology prototypes.',
    contributions: [
      'Conducted customer problem interviews, market validation, and value proposition design under national startup incubation mentorship.',
      'Synthesized business requirements into workable technology MVP architectures and pitch deck demonstrations.',
    ],
    relatedCaseSlugs: [],
  },
  {
    id: 'exp-sinaou-education',
    role: 'Co-Founder and Product Manager',
    organization: 'Sinaou Education',
    period: 'June 2023 — March 2024 (10 months)',
    location: 'Sleman Regency, Yogyakarta, Indonesia',
    scope: 'EdTech Product Strategy · User Research · Curriculum Development',
    summary:
      'Co-founded and drove product management for an educational platform, leading user research, curriculum alignment, and early MVP releases.',
    contributions: [
      'Defined product vision, user journey maps, and feature backlogs based on feedback from students and educators.',
      'Coordinated agile product releases with student developers and designed engaging learning curriculum materials.',
    ],
    relatedCaseSlugs: [],
  },
];

export interface SystemWorkflowPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  practices: string[];
  toolsUsed: {
    name: string;
    applicationContext: string;
  }[];
  appliedInSlug: string;
  appliedInTitle: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: string;
  role: string;
  description: string;
  badgeHex: string;
}

export const TECH_STACK_SYSTEMS: TechStackItem[] = [
  // Agen AI & Routing
  {
    id: 'antigravity',
    name: 'Antigravity',
    category: 'Agen AI & Routing',
    role: 'Asisten Coding Agentic',
    description: 'Refactoring multi-berkas mandiri, eksekusi terminal, dan agen pair-programming oleh Google DeepMind.',
    badgeHex: '#8B5CF6',
  },
  {
    id: '9router',
    name: '9Router',
    category: 'Agen AI & Routing',
    role: 'Smart AI Proxy & Gateway',
    description: 'Proxy lokal kompatibel OpenAI dengan router fallback ke 60+ provider dan kompresi token (RTK).',
    badgeHex: '#6366F1',
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'Agen AI & Routing',
    role: 'Penalaran Mendalam & Arsitektur',
    description: 'Desain sistem, penyusunan PRD, dan verifikasi logika kompleks oleh Anthropic.',
    badgeHex: '#D97706',
  },
  {
    id: 'codex',
    name: 'Codex / OpenAI',
    category: 'Agen AI & Routing',
    role: 'Sintesis Kode & Otomasi',
    description: 'Prototyping cepat, pembuatan harness pengujian otomatis, dan otomasi skrip teknis.',
    badgeHex: '#10A37F',
  },
  {
    id: 'hermes',
    name: 'Hermes',
    category: 'Agen AI & Routing',
    role: 'Harness Agen Otonom',
    description: 'Alur kerja agen berbasis pemanggilan tool dan evaluasi mandiri pada model open-weight oleh Nous Research.',
    badgeHex: '#F59E0B',
  },
  {
    id: 'museai',
    name: 'Muse AI',
    category: 'Agen AI & Routing',
    role: 'Otomasi Alur Kerja & Media',
    description: 'Eksekusi tugas personal berbasis agen cerdas dan pengindeksan media otomatis.',
    badgeHex: '#EC4899',
  },
  // Frontend & 3D
  {
    id: 'astro',
    name: 'Astro',
    category: 'Frontend & 3D',
    role: 'Static Site Generation (SSG)',
    description: 'Arsitektur islands Zero-JS by default yang menghasilkan Core Web Vitals optimal dan SEO maksimal.',
    badgeHex: '#FF5D01',
  },
  {
    id: 'threejs',
    name: 'Three.js',
    category: 'Frontend & 3D',
    role: 'Dunia Virtual Spasial 3D',
    description: 'Rendering WebGL, kamera isometrik, pencahayaan realistis, dan ruangan spasial interaktif.',
    badgeHex: '#38BDF8',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend & 3D',
    role: 'Framework React Fullstack',
    description: 'Server-side rendering, API routes modular, dan portal interaktif modern berbasis client-side.',
    badgeHex: '#E2E8F0',
  },
  // Backend & Data
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend & Data',
    role: 'Backend TypeScript Enterprise',
    description: 'Arsitektur modular, dependency injection, dan REST API microservices yang terstruktur.',
    badgeHex: '#E0234E',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Backend & Data',
    role: 'Engine Database Relasional',
    description: 'Penyimpanan data terstruktur, transaksi ACID, relasi kompleks, dan indexing performa tinggi.',
    badgeHex: '#336791',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Backend & Data',
    role: 'Backend-as-a-Service (BaaS)',
    description: 'PostgreSQL terkelola, row-level security (RLS), autentikasi instan, dan realtime pub/sub.',
    badgeHex: '#3ECF8E',
  },
  // Manajemen Proyek
  {
    id: 'jira',
    name: 'Jira',
    category: 'Manajemen Proyek',
    role: 'Tata Kelola Sprint Agile & Epic',
    description: 'Pelacakan sprint, backlog grooming, siklus rilis, dan peta jalan milestone lintas tim.',
    badgeHex: '#0052CC',
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Manajemen Proyek',
    role: 'Papan Visual Kanban',
    description: 'Pelacakan WIP cepat, delegasi tugas vertical slice, dan papan koordinasi standup harian.',
    badgeHex: '#0079BF',
  },
  {
    id: 'spreadsheet',
    name: 'Google Spreadsheet',
    category: 'Manajemen Proyek',
    role: 'Matriks Data & Rubrik Nilai',
    description: 'Estimasi WBS proyek, rubrik penilaian 200+ siswa, serta inventarisasi hardware lab.',
    badgeHex: '#0F9D58',
  },
  // Kreatif & Media
  {
    id: 'canva',
    name: 'Canva',
    category: 'Kreatif & Media',
    role: 'Komunikasi Visual & Presentasi',
    description: 'Wireframing UI cepat, pitch deck proyek, infografis, dan materi slide edukatif.',
    badgeHex: '#00C4CC',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    category: 'Kreatif & Media',
    role: 'Video Demo & Walkthrough',
    description: 'Produksi video reel demo software, cuplikan tutorial coding, dan video kampanye digital.',
    badgeHex: '#FFFFFF',
  },
];

export const SYSTEMS_WORKFLOWS: SystemWorkflowPillar[] = [
  {
    id: 'sys-planning',
    number: '01',
    title: 'Dekomposisi Lingkup & Perencanaan Jalur Kritis',
    subtitle: 'Mengubah tujuan bisnis abstrak menjadi deliverable sprint yang terverifikasi',
    description:
      'Setiap proyek dimulai dengan memisahkan fungsi operasional inti dari fitur pelengkap sekunder. Lingkup didekomposisi menjadi vertical slice teruji dengan kriteria Definition of Done (DoD) yang eksplisit.',
    practices: [
      'Work Breakdown Structure (WBS) dipetakan ke transisi status yang terlihat oleh pengguna, bukan sekadar tugas frontend/backend terisolasi.',
      'Non-Goals dicatat secara eksplisit dalam setiap PRD untuk mencegah pembengkakan lingkup (scope creep) di tengah sprint.',
      'Pengiriman vertical slice tiga tahap: Kontrak Data Inti → Happy-Path Vertical Slice → Penguatan Penanganan Mode Kegagalan & Fallback.',
    ],
    toolsUsed: [
      {
        name: 'Linear / Jira & PRD Terstruktur',
        applicationContext: 'Digunakan di mFood POS untuk memprioritaskan antrean offline IndexedDB sebelum dashboard pelaporan sekunder.',
      },
      {
        name: 'State Machine & Diagram Sekuen',
        applicationContext: 'Digunakan untuk menyelaraskan tim frontend, backend, dan QA pada sinkronisasi pesanan idempoten serta konfirmasi tiket KDS.',
      },
    ],
    appliedInSlug: 'mfood-pos',
    appliedInTitle: 'mFood POS — Arsitektur Antrean Offline',
  },
  {
    id: 'sys-risk',
    number: '02',
    title: 'Tata Kelola Dependensi & Matriks Trade-off Risiko',
    subtitle: 'Mengidentifikasi batasan teknis lebih awal dan mendokumentasikan keputusan trade-off eksplisit',
    description:
      'Risiko teknis dan operasional dilacak sebagai hipotesis hidup dengan mitigasi pre-mortem konkret, memastikan pemangku kepentingan memahami alasan di balik pemilihan trade-off arsitektur tertentu.',
    practices: [
      'Simulasi kegagalan pre-mortem (misalnya pengujian perilaku POS saat koneksi terputus atau pengujian fallback dead-letter webhook).',
      'Log keputusan yang mencatat Keputusan, Alasan (Rationale), dan Trade-off agar anggota tim baru memahami konteks historis.',
      'Audit perangkat keras, kapasitas bandwidth, dan ergonomi pengguna langsung di lapangan sebelum fase code freeze.',
    ],
    toolsUsed: [
      {
        name: 'Risk Register & Matriks Keputusan',
        applicationContext: 'Digunakan di Triagro untuk memilih PWA ringan dengan intake lapangan 3-ketukan dibandingkan aplikasi mobile native yang berat.',
      },
      {
        name: 'Daftar Periksa Gerbang QA Pra-Rilis',
        applicationContext: 'Digunakan di RevOps Campaign Engine untuk memblokir link UTM yang belum terverifikasi sebelum kampanye media berbayar diluncurkan.',
      },
    ],
    appliedInSlug: 'triagro',
    appliedInTitle: 'Triagro — Keterlacakan Rantai Pasok Lapangan',
  },
  {
    id: 'sys-ai',
    number: '03',
    title: 'Alur Kerja Berbasis AI & Evaluasi Deterministik',
    subtitle: 'Melandaskan model AI dengan sitasi terverifikasi, skema ketat, dan rubrik evaluasi manusia',
    description:
      'Fitur AI diperlakukan sebagai disiplin rekayasa sistem—bukan keajaiban tanpa verifikasi. Setiap alur kerja AI dibatasi oleh sanitasi input yang ketat, filter metadata RBAC, tautan sitasi, dan evaluasi berbasis golden dataset.',
    practices: [
      'Pengambilan berbasis sitasi: setiap pernyataan kebijakan yang disintesis harus terhubung ke paragraf sumber resmi dan tanggal efektif.',
      'Pengujian regresi dengan golden dataset mencakup skenario kasus batas (edge case) nyata sebelum rilis internal.',
      'Status penolakan (refusal) eksplisit jika dokumen sumber tidak ditemukan atau tingkat keyakinan sistem di bawah ambang batas.',
    ],
    toolsUsed: [
      {
        name: 'Rubrik Evaluasi RAG & Golden Dataset',
        applicationContext: 'Digunakan di DIAMOND KMS untuk memvalidasi 50 kueri eskalasi operasional nyata dengan tingkat fabrikasi kebijakan nol persen.',
      },
      {
        name: 'Validator Output Deterministik',
        applicationContext: 'Digunakan di Prompt Battle untuk menilai prompt peserta terhadap skema JSON, batasan token, dan jebakan skenario batas.',
      },
    ],
    appliedInSlug: 'diamond-kms',
    appliedInTitle: 'DIAMOND KMS — Penelusuran SOP Perusahaan',
  },
  {
    id: 'sys-collab',
    number: '04',
    title: 'Ritual Rekayasa Lintas Fungsi, Desain & Operasional',
    subtitle: 'Menjembatani arsitektur teknis, ergonomi UX, dan operasional garis depan',
    description:
      'Manajemen proyek yang efektif menghilangkan distorsi komunikasi antara engineer, desainer produk, dan pemangku kepentingan bisnis melalui artefak bersama, kontrak API, serta observasi langsung pengguna garis depan.',
    practices: [
      'Tinjauan bersama kontrak API & UI pada Sprint 0 sehingga tim frontend dan backend dapat membangun sistem secara paralel tanpa saling memblokir.',
      'Observasi langsung pengguna garis depan (kasir, recruiter, petugas lapangan) untuk melandaskan keputusan UX pada kendala operasional nyata.',
      'Daftar periksa persetujuan UAT terstruktur yang dieksekusi langsung bersama para penanggung jawab departemen.',
    ],
    toolsUsed: [
      {
        name: 'Wireframe Figma & Rubrik Perilaku',
        applicationContext: 'Digunakan di Employr untuk menyelaraskan recruiter dan hiring manager pada scorecard rubrik perilaku 4-poin.',
      },
      {
        name: 'Skema API & Kontrak Webhook',
        applicationContext: 'Digunakan di POS, KMS, dan pipeline RevOps untuk memisahkan state frontend dari layanan backend secara modular.',
      },
    ],
    appliedInSlug: 'employr',
    appliedInTitle: 'Employr — Pipeline Asesmen Kompetensi',
  },
];

export type TechStackSystem = TechStackItem;

export const CONTACT_INFO = {
  name: 'Rizal',
  fullName: 'Rizal Hanifa Pratama',
  title: 'Guru Koding @ SMA IHSANUL FIKRI MUNGKID | Komunikasi Bilingual, Pengembangan Digitalisasi',
  shortTitle: 'Guru Koding & Manajer Proyek IT',
  positioning:
    'Guru Koding @ SMA IHSANUL FIKRI MUNGKID & Manajer Proyek IT (S1 Informatika). Berpengalaman dalam pengajaran bilingual ICIF, penjaminan mutu SPMI, operasional lab 50+ unit, dan implementasi sistem perangkat lunak.',
  summary:
    'Sebagai Guru Koding di SMA IHSANUL FIKRI MUNGKID, saya mengampu 26 jam mengajar per minggu untuk lebih dari 200 siswa di 11 kelas, termasuk instruksi bilingual untuk International Class of Ihsanul Fikri (ICIF). Saya juga berkontribusi dalam Sistem Penjaminan Mutu Internal (SPMI) guna meningkatkan standar akademik dan pembelajaran, serta mengelola operasional laboratorium komputer berisi 50+ perangkat untuk kesiapan aktivitas pendidikan harian. Lulusan S1 Informatika dari UPN Veteran Yogyakarta dengan keahlian pengembangan digitalisasi, komunikasi bilingual, dan pelatihan pendidik. Berkomitmen menumbuhkan keterampilan komputasi dan pemrograman sekaligus mendorong keunggulan akademik dan inovasi teknis di lingkungan pendidikan.',
  tagline: 'Mendorong pemikiran komputasional, standar mutu akademik, dan implementasi solusi IT praktis.',
  email: 'rizalhp12345@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/riizalhp',
  linkedinLabel: 'linkedin.com/in/riizalhp',
  websiteUrl: 'https://riizalhp.web.id',
  websiteLabel: 'riizalhp.web.id',
  cvDownloadUrl: '/api/cv',
  location: 'Semarang, Jawa Tengah, Indonesia',
  focusAreas: [
    'Komunikasi Bilingual & Pengajaran Kelas Internasional (ICIF)',
    'Pengembangan Kurikulum & Pendidikan Koding/AI',
    'Pelatihan Pendidik & Sistem Penjaminan Mutu Internal (SPMI)',
    'Manajemen Proyek IT, Agile Scrum & Kepemimpinan Tim',
    'Pengembangan Digitalisasi & Operasional Lab Komputer',
  ],
  education: [
    {
      institution: 'Universitas Pembangunan Nasional Veteran Yogyakarta',
      degree: 'S1 Informatika (Sarjana Komputer)',
      period: 'Agustus 2021 — Juli 2025',
    },
    {
      institution: 'SMA Ihsanul Fikri Mungkid',
      degree: 'MIPA (Matematika & Ilmu Pengetahuan Alam)',
      period: '2018 — 2021',
    },
  ],
  certifications: [
    'Project Execution: Running the Project (Google Career Certificates)',
    'Project Planning: Putting It All Together (Google Career Certificates)',
    'Project Management — Fresh Graduate Academy (Digitalent Kominfo)',
    'Agile Scrum Certifications Training (CertiProf)',
    'Sertifikasi Auditor Internal SPMI',
  ],
  topSkills: [
    'Manajemen Proyek IT (Agile / Scrum)',
    'Arsitektur Fullstack & Implementasi Sistem',
    'Pendidikan Koding Bilingual & Pengembangan Kurikulum',
  ],
};

// Pure helper functions for filtering, sorting, and lookup (unit-tested)
export function filterAndSortProjects(
  projects: PortfolioProject[],
  options: {
    category?: ProjectCategory | 'All';
    searchQuery?: string;
    sortBy?: 'relevance' | 'title' | 'recent';
  }
): PortfolioProject[] {
  const { category = 'All', searchQuery = '', sortBy = 'relevance' } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const matchesCategory =
      category === 'All' || project.category.includes(category);
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystacks = [
      project.title,
      project.summary,
      project.role,
      project.problem,
      ...project.category,
      ...project.technologies,
    ]
      .join(' ')
      .toLowerCase();

    return haystacks.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'recent') {
      return (b.period || '').localeCompare(a.period || '') || a.relevanceRank - b.relevanceRank;
    }
    return a.relevanceRank - b.relevanceRank;
  });
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  if (slug === 'mfood-pos') return PORTFOLIO_PROJECTS.find((p) => p.slug === 'mfood');
  if (slug === 'triagro') return PORTFOLIO_PROJECTS.find((p) => p.slug === 'dashboard-oee');
  if (slug === 'diamond-kms') return PORTFOLIO_PROJECTS.find((p) => p.slug === 'unilever-gt2');
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
}

export function getRoomById(id: string): RoomMetadata {
  return ROOMS.find((r) => r.id === id) || ROOMS[0];
}

export function validateCaseStudyCompleteness(project: PortfolioProject): {
  valid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  if (!project.overview) missingFields.push('overview');
  if (!project.context) missingFields.push('context');
  if (!project.problem) missingFields.push('problem');
  if (!project.objectives?.length) missingFields.push('objectives');
  if (!project.constraints?.length) missingFields.push('constraints');
  if (!project.role) missingFields.push('role');
  if (!project.teamAndStakeholders?.length) missingFields.push('teamAndStakeholders');
  if (!project.approach?.length) missingFields.push('approach');
  if (!project.keyDecisions?.length) missingFields.push('keyDecisions');
  if (!project.execution?.length) missingFields.push('execution');
  if (!project.risksAndTradeOffs?.length) missingFields.push('risksAndTradeOffs');
  if (!project.outcomes?.length) missingFields.push('outcomes');
  if (!project.lessonsLearned?.length) missingFields.push('lessonsLearned');
  if (!project.evidence?.length) missingFields.push('evidence');

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
