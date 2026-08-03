# Panduan Setup - PMB Griya Bunda Gondanglegi

Sistem Informasi Pendaftaran Pasien berbasis web untuk praktik bidan.

## Persyaratan

- Node.js 18+
- MySQL Server (XAMPP / Laragon / MySQL standalone)
- pnpm, npm, atau yarn

## Langkah Setup

### 1. Setup Database MySQL

1. Buka phpMyAdmin atau MySQL client
2. Jalankan script SQL berikut:

```sql
-- Jalankan file: scripts/001_create_database.sql
```

Atau import langsung file `001_create_database.sql` melalui phpMyAdmin.

### 2. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# Konfigurasi MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pmb_griya_bunda
```

Sesuaikan nilai dengan konfigurasi MySQL Anda:
- **XAMPP**: biasanya `root` tanpa password
- **Laragon**: biasanya `root` tanpa password
- **MySQL standalone**: sesuaikan dengan user/password Anda

### 3. Install Dependencies

```bash
pnpm install
# atau
npm install
```

### 4. Jalankan Aplikasi

```bash
pnpm dev
# atau
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Akses Aplikasi

### Halaman Pasien
- **Beranda**: http://localhost:3000
- **Jenis Pemeriksaan**: http://localhost:3000/layanan
- **Pendaftaran Online**: http://localhost:3000/daftar

### Halaman Admin
- **Login Admin**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Data Reservasi**: http://localhost:3000/admin/reservasi

### Default Admin Login
- **Username**: admin
- **Password**: admin123

## Struktur Database

### Tabel `admin`
- id, username, password, nama_lengkap, created_at, updated_at

### Tabel `pasien`
- id, nik, nama, tanggal_lahir, alamat, no_telepon, created_at, updated_at

### Tabel `poli`
- id, nama_poli, deskripsi, aktif, created_at

### Tabel `reservasi`
- id, pasien_id (FK), poli_tujuan, keluhan, tanggal_kunjungan, nomor_antrian, status, created_at, updated_at

## Troubleshooting

### Error koneksi database
1. Pastikan MySQL server berjalan
2. Periksa kredensial di `.env.local`
3. Pastikan database `pmb_griya_bunda` sudah dibuat

### Port 3000 sudah digunakan
Jalankan dengan port berbeda:
```bash
pnpm dev -- -p 3001
```

## Catatan Penting

- Sistem ini dirancang untuk berjalan **offline** di local server
- Tidak memerlukan koneksi internet setelah setup awal
- Data disimpan di MySQL lokal
- Password admin di-hash dengan bcrypt untuk keamanan
