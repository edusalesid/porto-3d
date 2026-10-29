# Rizal OS — 3D Virtual Office Portfolio

Interactive 3D Virtual Office Portfolio built with **Next.js 15 (App Router)**, **React 19**, **Three.js**, **Tailwind CSS v4**, and **Motion**.

## Fitur Utama
- **Interactive 3D Spatial Office**: Eksplorasi 7 zona ruangan kerja (Lobby, Executive Desk, Project Command Center, Product Studio, Tech & Systems Lab, Achievement Gallery, Meeting Lounge).
- **3 Mode Kamera**:
  - `1` — **Orbit Mode** (Isometric / Free Pan & Zoom)
  - `2` — **First-Person (FPS)** (Pointer Lock di desktop, atap ruangan dinamis)
  - `3` — **Third-Person (TPS)** (Karakter 3D dengan atap ruangan dinamis)
- **Kontrol Mobile Responsif (Mobile Legends-style Dual Analog)**:
  - Analog kiri 360° untuk pergerakan karakter/kamera (`MOVE`)
  - Analog kanan 360° untuk rotasi pandangan (`LOOK`)
  - Bottom sheet drawer interaktif dengan dukungan *swipe up* & *swipe down*
- **Zen Mode (`Z`)**: Menyembunyikan HUD overlay untuk tampilan sinematik penuh (analog mobile tetap aktif untuk navigasi).
- **2D Quick Portfolio Mode**: Mode tampilan portofolio standar bagi pengunjung atau *recruiter* yang ingin membaca cepat.

---

## Panduan Deployment ke Vercel

Proyek ini sudah dikonfigurasi penuh untuk **Vercel** (`vercel.json`, `next.config.ts`, dan `metadataBase` otomatis).

### Opsi 1: Deploy via GitHub / GitLab / Bitbucket (Direkomendasikan)
1. Push seluruh kode proyek ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new) dan pilih repository GitHub tersebut.
3. **Framework Preset** akan otomatis terdeteksi sebagai **Next.js**.
4. *(Opsional)* Pada bagian **Environment Variables**, Anda dapat menambahkan:
   - `NEXT_PUBLIC_SITE_URL`: URL domain kustom Anda (misal `https://rizal.dev`). Jika dikosongkan, Vercel otomatis menggunakan URL produksi proyek Anda.
5. Klik **Deploy** dan tunggu sekitar 1–2 menit hingga proses build selesai.

### Opsi 2: Deploy Langsung via Vercel CLI
1. Install Vercel CLI secara global:
   ```bash
   npm i -g vercel
   ```
2. Login ke akun Vercel Anda:
   ```bash
   vercel login
   ```
3. Jalankan perintah deploy ke production dari root folder proyek:
   ```bash
   vercel --prod
   ```

---

## Menjalankan Secara Lokal

```bash
# Install dependencies
npm install

# Jalankan server development (http://localhost:9000)
npm run dev

# Build untuk production
npm run build

# Jalankan hasil build production
npm run start
```
