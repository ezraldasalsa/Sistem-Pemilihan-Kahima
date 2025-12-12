# 🗳️ Sistem Pemilihan Kahima (E-Voting)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Sistem Pemilihan Kahima** adalah aplikasi *Single Page Application* (SPA) berbasis web yang modern dan responsif. Aplikasi ini dibangun untuk mendigitalkan proses pemilihan Ketua Himpunan Mahasiswa agar berjalan secara **transparan, real-time, dan aman**.

Menggunakan teknologi modern **React TypeScript** dengan build tool **Vite**, aplikasi ini menawarkan performa yang sangat cepat dan pengalaman pengguna yang mulus.

---

## 📑 Daftar Isi

- [Overview Project](#-overview-project)
- [Fitur Utama (MVP)](#-fitur-utama-mvp)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Project](#-struktur-project)
- [Model Data / Skema](#-skema-database)
- [Cara Setup Local](#-cara-setup-local)
- [Cara Deploy ke Vercel](#-cara-deploy-ke-vercel)
- [Cara Kontribusi](#-cara-kontribusi)

---

## 📖 Overview Project

Proyek ini bertujuan untuk mengatasi inefisiensi dalam pemilihan manual. Dengan beralih ke sistem digital, Himpunan Mahasiswa dapat:
1.  **Mencegah Kecurangan:** Validasi satu suara per satu NIM.
2.  **Hasil Real-time:** Menghilangkan waktu tunggu rekapitulasi manual.
3.  **Aksesibilitas:** Mahasiswa dapat memilih dari mana saja (selama terhubung ke jaringan kampus/internet).

---

## ✨ Fitur Utama (MVP)

Aplikasi ini mencakup fitur *Minimum Viable Product* (MVP):

### 👤 User (Mahasiswa)
* **Auth System:** Login menggunakan kredensial (NIM/Token).
* **Candidate Showcase:** Melihat profil, visi, dan misi kandidat secara interaktif.
* **Voting Mechanism:** Memberikan suara dengan UX yang intuitif.
* **Status Tracking:** Feedback visual setelah berhasil melakukan voting.

### 🛡️ Admin Dashboard
* **Real-time Chart:** Visualisasi hasil suara langsung (Live Count).
* **CRUD Kandidat:** Manajemen data paslon (Nama, Visi, Misi, Foto).
* **Data Pemilih:** Manajemen status pemilih (DPT).
* **Session Control:** Pengaturan buka/tutup sesi pemilihan.

---

## 🛠 Teknologi yang Digunakan

-   **Core:** [React](https://reactjs.org/) (v18+)
-   **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing)
-   **Build Tool:** [Vite](https://vitejs.dev/) (Super fast build time)
-   **Routing:** React Router DOM
-   **Styling:** CSS Modules / Tailwind CSS *(Sesuaikan dengan project)*
-   **HTTP Client:** Axios / Fetch API
-   **State Management:** React Hooks (useState, useEffect, useContext)

---

## 📂 Struktur Project

Struktur folder standar Vite + React:

```text
/
├── public/             # Aset statis (Favicon, robots.txt)
├── src/
│   ├── assets/         # Gambar, Fonts, Global CSS
│   ├── components/     # Reusable UI Components (Button, Card, Navbar)
│   ├── pages/          # Halaman Utama (Login, Dashboard, VotePage)
│   ├── hooks/          # Custom React Hooks
│   ├── types/          # Definisi Interface TypeScript
│   ├── utils/          # Fungsi bantuan (Format tanggal, Validasi)
│   ├── App.tsx         # Root Component & Routing
│   └── main.tsx        # Entry point React
├── .env                # Environment Variables
├── package.json        # Dependencies
├── tsconfig.json       # Konfigurasi TypeScript
├── vite.config.ts      # Konfigurasi Vite
└── README.md           # Dokumentasi

  ```
## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/J9y1PaAyD02](https://v0.app/chat/projects/J9y1PaAyD02)**

## Skema Database

Sistem ini menggunakan relasi database sebagai berikut:
- users: Menyimpan data pemilih (NIM, Nama, Password, Status_Vote).
- candidates: Menyimpan data paslon (Nama, Visi, Misi, Foto, Jumlah_Suara).
- votes: Menyimpan rekam jejak suara masuk (User_ID, Candidate_ID, Timestamp).
- settings: Pengaturan sesi pemilihan (Waktu Buka/Tutup).

## Contributing
<a href="https://github.com/ezraldasalsa/Sistem-Pemilihan-Kahima/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ezraldasalsa/Sistem-Pemilihan-Kahima" />
</a>

Lihat [CONTRIBUTING](CONTRIBUTING.md) untuk lebih detailnya.

## 🤝 Cara Kontribusi

Kami sangat terbuka untuk kontribusi! Langkah-langkahnya:
- Fork repositori ini atau Git Clone.
- Buat Branch baru (git checkout -b fitur-baru).
- Commit perubahan Anda (git commit -m 'Menambahkan fitur log aktivitas').
- Push ke branch (git push origin fitur-baru).
- Buat Pull Request di GitHub.
   Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
