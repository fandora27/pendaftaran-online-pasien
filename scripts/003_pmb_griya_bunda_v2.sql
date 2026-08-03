-- ============================================
-- DATABASE UNTUK SISTEM INFORMASI PENDAFTARAN PASIEN
-- PMB GRIYA BUNDA GONDANGLEGI
-- Versi: 2.0 (Tanpa Kolom Status)
-- ============================================

-- Buat database baru
-- CREATE DATABASE IF NOT EXISTS pmb_griya_bunda;
-- USE pmb_griya_bunda;

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
-- DATA AWAL ADMIN (password: admin123)
-- Password di-hash dengan bcrypt
-- Untuk login: username = admin, password = admin123
-- ============================================
INSERT INTO admin (username, password, nama_lengkap) VALUES
('admin', '$2b$10$QR4tRmUk.nVq0gTaA6VkaOJ5zBQH3gac2gJqSzwKtDgy5wnGA6bZe', 'Administrator PMB');

-- ============================================
-- DATA AWAL POLI / LAYANAN
-- ============================================
INSERT INTO poli (nama_poli, deskripsi) VALUES
('Pemeriksaan Umum', 'Layanan pemeriksaan kesehatan umum meliputi pengukuran tekanan darah, suhu tubuh, berat badan, dan konsultasi kesehatan dasar.'),
('Konsultasi Kehamilan', 'Layanan konsultasi dan pemeriksaan kehamilan meliputi USG, pemeriksaan janin, konsultasi nutrisi ibu hamil, dan persiapan persalinan.'),
('Pemeriksaan Pasca Persalinan', 'Layanan pemeriksaan kesehatan ibu setelah melahirkan dan konsultasi perawatan bayi baru lahir.'),
('Keluarga Berencana (KB)', 'Layanan konsultasi dan pemasangan alat kontrasepsi seperti IUD, implant, suntik KB, dan pil KB.');

-- ============================================
-- CONTOH DATA PASIEN
-- ============================================
INSERT INTO pasien (nik, nama, tanggal_lahir, alamat, no_telepon) VALUES
('3507012345678901', 'Siti Aminah', '1990-05-15', 'Jl. Raya Gondanglegi No. 45, Malang', '081234567890'),
('3507019876543210', 'Dewi Lestari', '1988-08-22', 'Desa Sukosari RT 02 RW 01, Gondanglegi', '082345678901'),
('3507015555666677', 'Ratna Sari', '1995-03-10', 'Jl. Pahlawan No. 12, Gondanglegi', '083456789012');

-- ============================================
-- INDEX UNTUK OPTIMASI QUERY
-- ============================================
CREATE INDEX idx_pasien_nik ON pasien(nik);
CREATE INDEX idx_reservasi_tanggal ON reservasi(tanggal_kunjungan);
CREATE INDEX idx_reservasi_pasien ON reservasi(pasien_id);
