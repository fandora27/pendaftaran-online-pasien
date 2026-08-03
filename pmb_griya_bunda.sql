-- ============================================
-- DATABASE UNTUK SISTEM INFORMASI PENDAFTARAN PASIEN
-- PMB GRIYA BUNDA GONDANGLEGI
-- ============================================

-- Buat database baru (opsional, jika ingin import langsung bisa uncomment ini, 
-- namun di XAMPP biasanya user buat DB kosong lalu import file ini)
CREATE DATABASE IF NOT EXISTS pmb_griya_bunda_v2;
USE pmb_griya_bunda_v2;

-- ============================================
-- TABEL ADMIN
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABEL PASIEN
-- ============================================
CREATE TABLE IF NOT EXISTS pasien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(16) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin VARCHAR(20) NOT NULL,
    nama_suami VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABEL POLI / LAYANAN
-- ============================================
CREATE TABLE IF NOT EXISTS poli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_poli VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABEL RESERVASI (Tanpa Status)
-- ============================================
CREATE TABLE IF NOT EXISTS reservasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pasien_id INT NOT NULL,
    poli_tujuan VARCHAR(100) NOT NULL,
    keluhan TEXT NOT NULL,
    tanggal_kunjungan DATE NOT NULL,
    nomor_antrian VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABEL PENGATURAN BERANDA
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logo_url VARCHAR(255) DEFAULT NULL,
    hero_title VARCHAR(255) NOT NULL,
    hero_subtitle TEXT NOT NULL,
    about_title VARCHAR(255) NOT NULL,
    about_description TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATA AWAL ADMIN (password: admin123)
-- Password di-hash dengan bcrypt
-- Untuk login: username = admin, password = admin123
-- ============================================
INSERT INTO admin (username, password, nama_lengkap) VALUES
('admin', '$2b$10$QR4tRmUk.nVq0gTaA6VkaOJ5zBQH3gac2gJqSzwKtDgy5wnGA6bZe', 'Administrator PMB');

-- Tambahan Admin (usn: admin@admin.com, pw: admin123 - harap ganti ke Admin123 jika ada fitur ganti password atau run hash lokal)
INSERT INTO admin (username, password, nama_lengkap) VALUES
('admin@admin.com', '$2b$10$QR4tRmUk.nVq0gTaA6VkaOJ5zBQH3gac2gJqSzwKtDgy5wnGA6bZe', 'Admin Dua');

-- ============================================
-- DATA AWAL POLI / LAYANAN (HANYA UMUM & KIA)
-- ============================================
INSERT INTO poli (nama_poli, deskripsi) VALUES
('Poli Umum', 'Layanan pemeriksaan kesehatan umum meliputi pengukuran tekanan darah, suhu tubuh, berat badan, dan konsultasi kesehatan dasar.'),
('Poli KIA', 'Kesehatan Ibu dan Anak: Layanan konsultasi dan pemeriksaan kehamilan, persalinan, pasca persalinan, imunisasi, dan Keluarga Berencana (KB).');

-- ============================================
-- CONTOH DATA PASIEN
-- ============================================
INSERT INTO pasien (nik, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon) VALUES
('3507012345678901', 'Siti Aminah', 'Perempuan', '1990-05-15', 'Jl. Raya Gondanglegi No. 45, Malang', '081234567890'),
('3507019876543210', 'Dewi Lestari', 'Perempuan', '1988-08-22', 'Desa Sukosari RT 02 RW 01, Gondanglegi', '082345678901');

-- ============================================
-- DATA AWAL PENGATURAN BERANDA
-- ============================================
INSERT INTO settings (id, logo_url, hero_title, hero_subtitle, about_title, about_description) VALUES
(1, NULL, 'Selamat Datang di PMB Griya Bunda Gondanglegi', 'Praktik Mandiri Bidan dengan layanan profesional dan terpercaya untuk kesehatan ibu dan anak. Kami siap melayani dengan sepenuh hati.', 'Mengapa Memilih Kami?', 'Kami memberikan pelayanan kesehatan profesional yang didedikasikan untuk kenyamanan dan kesehatan Anda beserta buah hati.');

-- ============================================
-- INDEX UNTUK OPTIMASI QUERY
-- ============================================
CREATE INDEX idx_pasien_nik ON pasien(nik);
CREATE INDEX idx_reservasi_tanggal ON reservasi(tanggal_kunjungan);
CREATE INDEX idx_reservasi_pasien ON reservasi(pasien_id);
