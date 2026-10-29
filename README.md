# Rizal OS — 3D Virtual Office & High-Performance Astro Portfolio

Interactive 3D Virtual Office Portfolio & Verified Technical Case Studies built with **Astro (Islands Architecture)**, **Three.js**, **React 19**, and **Tailwind CSS v4**.

## Mengapa Astro? (Performa & SEO Maksimal)
- **Zero-JS by Default**: Semua halaman artikel studi kasus (`/cases/[slug]`), direktori proyek (`/projects/[slug]`), sistem lab (`/systems`), dan rekam jejak pengalaman (`/experience`) di-render sebagai **100% Pure Static HTML** dengan OpenGraph, Semantic Heading, dan Schema.org JSON-LD lengkap. Googlebot dan web crawler dapat langsung membaca dan mengindeks seluruh isi portofolio tanpa hambatan JavaScript hydration.
- **Astro Islands (`client:only="react"`)**: Canvas interaktif 3D Three.js diisolasi secara khusus sebagai satu "pulau" interaktif tanpa memperberat halaman konten teks atau merusak waktu muat (Time-To-Interactive).
- **Kecepatan Build & Hemat RAM**: Ditenagai oleh **Vite**, proses build production selesai dalam ~5 detik dengan konsumsi memori minimal.

---

## Fitur Utama

### 1. Interactive 3D Spatial Virtual Office (`/`)
- Eksplorasi 7 zona ruangan kerja (Lobby, Executive Desk, Project Command Center, Product Studio, Tech & Systems Lab, Achievement Gallery, Meeting Lounge).
- **3 Mode Kamera**:
  - `1` — **Orbit Mode** (Isometric / Free Pan & Zoom)
  - `2` — **First-Person (FPS)** (Pointer Lock di desktop, atap ruangan dinamis)
  - `3` — **Third-Person (TPS)** (Karakter 3D dengan atap ruangan dinamis)
- **Kontrol Mobile Responsif (Dual Analog)**:
  - Analog kiri 360° untuk pergerakan karakter/kamera (`MOVE`)
  - Analog kanan 360° untuk rotasi pandangan (`LOOK`)
  - Bottom sheet drawer interaktif dengan gesture swipe
- **Zen Mode (`Z`)**: Sembunyikan HUD untuk tampilan sinematik penuh.

### 2. Verified Case Archives & Detail Proyek (SEO SSG)
- `/cases` — Indeks seluruh studi kasus dengan metrik dampak dan keputusan teknis.
- `/cases/[slug]` — Halaman studi kasus 14-poin lengkap:
  1. Ringkasan Eksekutif & Konteks
  2. Masalah Operasional & Kendala
  3. Target & Sasaran Eksekusi
  4. Peran, Tanggung Jawab & Kolaborasi Tim
  5. Keputusan Arsitektur & Trade-Offs Teknis
  6. Roadmap Eksekusi & Deliverables per Fase
  7. Hasil Terverifikasi & Metrik Dampak
  8. Pembelajaran & Retrospektif
  9. Bukti Visual & Tangkapan Layar
- `/projects` & `/projects/[slug]` — Galeri produk digital & sistem perangkat lunak.
- `/systems` — Laboratorium metodologi eksekusi, PRD authoring, state machines, dan evaluasi alur kerja AI.
- `/experience` — Rekam jejak kronologis kepemimpinan dan delivery proyek.
- `/api/cv` — Endpoint instan untuk download ringkasan CV teks.

---

## Menjalankan Secara Lokal

```bash
# Install dependencies
npm install

# Jalankan server development (http://localhost:9000)
npm run dev

# Build untuk production (SSG murni ke folder dist/)
npm run build

# Preview hasil build production
npm run preview
```

---

## Panduan Deployment

### Vercel
Framework preset akan otomatis terdeteksi sebagai **Astro**. Konfigurasi `vercel.json` sudah disesuaikan untuk static output.

### Cloudflare Pages / Netlify / GitHub Pages
Karena output berupa static site murni di direktori `dist/`, Anda dapat mendeploy ke provider hosting statis mana pun secara gratis dengan build command `npm run build` dan publish directory `dist`.
