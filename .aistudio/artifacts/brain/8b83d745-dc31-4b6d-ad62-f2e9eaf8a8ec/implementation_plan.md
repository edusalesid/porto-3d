# RIZAL OS — Sistem Collision Fisik 3D (Anti-Tembus Benda) & Layar Penuh 1 Halaman Tanpa Bar Daftar Ruangan

Pembaruan ini menambahkan sistem *collision detection* fisik dengan respons *smooth wall/furniture sliding* agar karakter maupun kamera FPS tidak dapat menembus meja, sofa, rak buku, maupun dinding kaca, sekaligus menghapus seluruh daftar menu ruangan (`01. Lobby` s/d `06. Contact`) di bagian atas dan bawah layar sehingga kanvas 3D tampil **100% Real Full 1 Halaman (`100vw × 100vh`)**.

## User Review & Critical Decisions

> [!IMPORTANT]
> Rencana ini mengimplementasikan secara presisi kedua keputusan yang telah Anda konfirmasi:

- **Confirmed Decision 1 (Hapus Bar Daftar Ruangan Atas & Bawah + Real Full 1 Halaman)**: Menghilangkan deretan tombol ruangan (`01. Lobby`, `02. Projects`, `03. Systems`, `04. Experience`, `05. Cases`, `06. Contact`) baik dari bar navigasi atas, dock bawah, maupun header panel, serta menjadikan kanvas 3D berdimensi penuh `fixed inset-0 w-screen h-screen overflow-hidden` tanpa *header bar* yang memotong tinggi layar.
- **Confirmed Decision 2 (Collision Fisik dengan Smooth Edge Sliding)**: Membangun *collider* 2D/3D (kotak AABB dan lingkaran) untuk seluruh furnitur dan dinding partisi kaca di ke-6 ruangan. Saat karakter menyentuh meja, sofa, atau dinding kaca, sistem memisahkan resolusi sumbu X dan sumbu Z sehingga karakter **bergeser mulus menyusuri tepi objek** tanpa menembus benda dan tanpa tersangkut.

---

## 1. Overview & Core Concept

- **What It Does**: Menghadirkan simulasi fisik ruang kantor 3D yang solid di mana setiap objek memiliki batas fisik nyata, dipadukan dengan tampilan *full-viewport* satu layar penuh yang bersih dari deretan menu ruangan.
- **Target Audience / Persona**: Pengunjung yang menjelajahi kantor digital secara langsung melalui eksplorasi ruang 3D (berjalan di koridor, melewati pintu kaca antar-ruangan, atau mengklik objek furnitur di dalam ruangan).
- **Key Value**:
  - **Realisme Fisik (Zero Clipping)**: Karakter Rizal tidak lagi bisa berjalan menembus meja resepsionis, meja kopi, sofa, meja rapat, rak buku, atau dinding kaca.
  - **100% Full-Screen 1 Halaman Pas**: Seluruh jendela browser (`100vw × 100vh`) menjadi kanvas 3D utuh tanpa *navbar* blok hitam di atas ataupun *dock* daftar ruangan di bawah.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Tampilan Penuh 1 Halaman (`100vw × 100vh`)**: Saat halaman dibuka, kanvas 3D memenuhi 100% layar dari ujung ke ujung tanpa *scrollbar* dan tanpa bar daftar ruangan `01–06`.
  2. **Navigasi Spasial Murni**: Pengunjung berpindah ruangan dengan cara berjalan langsung melewati pintu partisi kaca (di mode FPS/TPS), mengklik furnitur ruangan di kanvas 3D, atau membuka tombol ikon kecil **Denah** jika ingin melompat cepat.
  3. **Benturan & Geseran Mulus (Smooth Sliding Collision)**: Saat karakter berjalan menabrak meja bundar di Lobby, sofa, meja kerja di Project Room, atau partisi kaca, karakter tertahan di batas objek dan otomatis bergeser mulus mengikuti sisi meja/dinding menuju celah pintu yang terbuka.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: *Pure Full-Screen Spatial Experience* — meniadakan seluruh bar navigasi horisontal yang membingkai layar, menyisakan kapsul kontrol mengambang yang sangat ringkas.
  - *Color Palette & Mood*: Kapsul kontrol menggunakan `--background` (`#0B0F17/90`), *border* `--border` (`#1E293B`), dan aksen aktif `--primary` (`#38BDF8`).
  - *Typography & Hierarchy*: Judul kapsul menggunakan *Outfit* (`12px` bold) dan petunjuk pendek menggunakan *JetBrains Mono* (`10px`).
  - *Component Styling & Layout*: Kanvas utama dipasang pada `fixed inset-0 w-screen h-screen overflow-hidden`. Kapsul identitas `RIZAL OS` + tombol `Denah` & `CV` mengambang ringan di kiri atas, sedangkan pemilih mode kamera (`Orbit 3D` | `FPS` | `TPS` | `Zen`) mengambang di tengah atas.

- **Interactive Feedback & Motion**:
  - Ketika pengguna menggunakan fitur *Click-to-Walk* (mengklik lantai di balik meja atau dinding), karakter akan berjalan dan otomatis menyusuri tepi penghalang atau berhenti dengan rapi tepat di depan sisi meja tanpa menembusnya.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Resolusi Collision Terpisah per Sumbu (Separated Axis AABB + Circle Sliding)**
  - *Chosen Approach*: Merepresentasikan karakter sebagai lingkaran berjari-jari `r = 0.38m` dan seluruh furnitur/dinding sebagai kumpulan *Axis-Aligned Bounding Boxes* (`AABB`) serta silinder/lingkaran. Pada setiap *frame*, pergerakan diuji terlebih dahulu pada sumbu X (`tryMove(newX, oldZ)`), kemudian pada sumbu Z (`tryMove(resolvedX, newZ)`), dilengkapi dorongan keluar (*minimum translation vector*) jika terjadi tumpang-tindih.
  - *Why*: Memisahkan pengujian sumbu X dan Z memastikan bahwa ketika karakter berjalan menyerong menabrak meja atau dinding kaca, komponen kecepatan yang sejajar dengan permukaan dinding tetap berjalan sehingga karakter **bergeser mulus menyusuri tepi objek**.
  - *Alternatives Considered*: Menghentikan seluruh vektor gerak `(moveX = 0, moveZ = 0)` saat terjadi benturan (ditolak karena membuat karakter terasa lengket/macet saat menyentuh sudut meja).

- **Decision 2: Menghapus Bar Daftar Ruangan `01–06` & Mengubah Layout Menjadi `100vw × 100vh` Murni**
  - *Chosen Approach*: Menghapus bar daftar ruangan di bagian atas (`TopNav`), menghapus *dock* daftar ruangan `01. Lobby` s/d `06. Contact` di bagian bawah layar, serta menghapus deretan tab `01–06` pada *header* panel detail.
  - *Why*: Sesuai permintaan pengguna agar layar benar-benar bersih dari daftar `01. Lobby ... 06. Contact` dan tampil pas 1 halaman penuh (`100vh`).

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│             Full-Viewport 3D Container (fixed inset-0 100vw×100vh)        │
│  • Zero Top Header Bar            • Zero Bottom Room List Dock (01–06)    │
└──────────────────┬───────────────────────────────────────┬────────────────┘
                   │                                       │
                   ▼                                       ▼
┌──────────────────────────────────────┐ ┌──────────────────────────────────┐
│     Minimal Floating Corner Pills    │ │   VirtualOfficeCanvas (WebGL)    │
│  • Top-Left: RIZAL OS · Denah · CV   │ │  • Spatial Collider Registry     │
│  • Top-Center: Orbit | FPS | TPS     │ │  • Separated-Axis Sliding Solver │
│  • Slide-Over Room Detail Drawer     │ │  • RPG Character Body Rotation   │
└──────────────────────────────────────┘ └──────────────────────────────────┘
```

- **Data Model & State**:
  - `BoxCollider`: `{ minX: number; maxX: number; minZ: number; maxZ: number }` — mendefinisikan batas fisik dinding partisi kaca (dengan celah pintu terbuka untuk jalan lewat), meja resepsionis, sofa, meja kerja, meja konferensi, podium galeri, rak buku, dan *coffee bar*.
  - `CircleCollider`: `{ x: number; z: number; radius: number }` — mendefinisikan batas fisik meja kopi bundar dan pot tanaman di seluruh ruangan.
  - `PLAYER_RADIUS = 0.38`: Jari-jari silinder fisik karakter Rizal / kamera FPS.

- **Interactive Component & State Mapping**:
  - **Pendaftaran Collider Otomatis (`colliders`)**:
    - **Dinding Partisi Kaca**: Didaftarkan sebagai `BoxCollider` sesuai posisi dan panjangnya, menyisakan koridor tengah (`x ∈ [-5.6, 5.6]`, `z ∈ [-6.0, 14.0]`) dan celah pintu masuk ke setiap ruangan agar pemain leluasa keluar-masuk ruangan.
    - **Lobby (`[0, 0]`)**: Meja resepsionis (`4.2m × 1.0m`), papan sambutan, 2 sofa tunggu kiri/kanan, meja kopi bundar tengah (`r = 0.98m`), dan 2 tanaman pot.
    - **Project Studio (`[-11.5, -8.5]`)**: 4 meja kerja + kursi, papan Kanban belakang, dan tanaman pot.
    - **Systems War Room (`[11.5, -8.5]`)**: Meja konferensi besar (`4.4m × 2.5m` mencakup kursi rapat), papan tulis belakang, dan tanaman pot.
    - **Experience Gallery (`[-11.5, 6.5]`)**: 3 podium pameran karir, bangku galeri, dan tanaman pot.
    - **Case Archive (`[11.5, 6.5]`)**: 3 rak buku kayu di bagian belakang, meja baca tengah, dan tanaman pot.
    - **Contact Lounge (`[0, 11.5]`)**: Sofa kulit bentuk L, meja kopi bundar, meja *espresso bar*, dan tanaman pot.
  - **Algoritma `resolveCollisions(oldX, oldZ, targetX, targetZ)`**:
    - Menguji `candidateX = targetX, candidateZ = oldZ` terhadap seluruh `BoxCollider` dan `CircleCollider`; jika berbenturan, menggeser `candidateX` tepat ke sisi luar batas objek.
    - Menguji `candidateZ = targetZ` dengan `candidateX` yang sudah tervalidasi terhadap seluruh *collider*; jika berbenturan, menggeser `candidateZ` tepat ke sisi luar batas objek.
    - Jika sedang dalam mode *Click-to-Walk* dan karakter menyentuh penghalang yang tidak bisa dilewati secara lurus, apabila pergeseran per *frame* mendekati nol selama `> 0.25` detik, target jalan otomatis dihentikan dengan mulus di tepi objek agar karakter tidak berjalan di tempat.
