-- ============================================
-- Database: PMB Griya Bunda Gondanglegi
-- Sistem Informasi Pendaftaran Pasien
-- ============================================

-- Membuat database
CREATE DATABASE IF NOT EXISTS pmb_griya_bunda;
USE pmb_griya_bunda;

-- ============================================
-- Tabel Admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Tabel Pasien
-- ============================================
CREATE TABLE IF NOT EXISTS pasien (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nik VARCHAR(16) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nik (nik),
    INDEX idx_nama (nama)
);

-- ============================================
-- Tabel Poli/Layanan
-- ============================================
CREATE TABLE IF NOT EXISTS poli (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_poli VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabel Reservasi
-- ============================================
CREATE TABLE IF NOT EXISTS reservasi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pasien_id INT NOT NULL,
    poli_tujuan VARCHAR(100) NOT NULL,
    keluhan TEXT NOT NULL,
    tanggal_kunjungan DATE NOT NULL,
    nomor_antrian VARCHAR(20) NOT NULL,
    status ENUM('Menunggu', 'Diproses', 'Selesai') DEFAULT 'Menunggu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id) ON DELETE CASCADE,
    INDEX idx_tanggal (tanggal_kunjungan),
    INDEX idx_status (status),
    INDEX idx_nomor_antrian (nomor_antrian)
);

-- ============================================
-- Data Awal Admin (password: admin123)
-- Password di-hash dengan bcrypt
-- Untuk login: username = admin, password = admin123
-- ============================================
INSERT INTO admin (username, password, nama_lengkap) VALUES
('admin', '$2b$10$QR4tRmUk.nVq0gTaA6VkaOJ5zBQH3gac2gJqSzwKtDgy5wnGA6bZe', 'Administrator PMB');

-- ============================================
-- Data Awal Poli
-- ============================================
INSERT INTO poli (nama_poli, deskripsi) VALUES
('Pemeriksaan Umum', 'Layanan pemeriksaan kesehatan umum meliputi pengukuran tekanan darah, suhu tubuh, berat badan, dan konsultasi kesehatan dasar.'),
('Konsultasi Kehamilan', 'Layanan konsultasi dan pemeriksaan kehamilan meliputi USG, pemeriksaan janin, konsultasi nutrisi ibu hamil, dan persiapan persalinan.'),
('Pemeriksaan Pasca Persalinan', 'Layanan pemeriksaan kesehatan ibu setelah melahirkan dan konsultasi perawatan bayi baru lahir.'),
('Keluarga Berencana (KB)', 'Layanan konsultasi dan pemasangan alat kontrasepsi seperti IUD, implant, suntik KB, dan pil KB.');

-- ============================================
-- Data Contoh Pasien
-- ============================================
INSERT INTO pasien (nik, nama, tanggal_lahir, alamat, no_telepon) VALUES
('3507012345678901', 'Siti Aminah', '1990-05-15', 'Jl. Raya Gondanglegi No. 45, Malang', '081234567890'),
('3507019876543210', 'Dewi Lestari', '1988-08-22', 'Desa Sukosari RT 02 RW 01, Gondanglegi', '082345678901'),
('3507015555666677', 'Ratna Sari', '1995-03-10', 'Jl. Pahlawan No. 12, Gondanglegi', '083456789012');

-- ============================================
-- Data Contoh Reservasi
-- ============================================
INSERT INTO reservasi (pasien_id, poli_tujuan, keluhan, tanggal_kunjungan, nomor_antrian, status) VALUES
(1, 'Konsultasi Kehamilan', 'Kontrol kehamilan bulan ke-7', CURDATE(), CONCAT('A-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-001'), 'Menunggu'),
(2, 'Pemeriksaan Umum', 'Pusing dan mual', CURDATE(), CONCAT('A-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-002'), 'Diproses'),
(3, 'Keluarga Berencana (KB)', 'Konsultasi pemasangan IUD', CURDATE(), CONCAT('A-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-003'), 'Menunggu');
