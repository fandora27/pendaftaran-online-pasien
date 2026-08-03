// Mock data untuk preview tanpa database
// Data ini digunakan saat MySQL tidak tersedia (preview mode)

import type { Poli, Pasien, Reservasi, Admin, Keunggulan } from './types';

// Password: admin123
// Hash generated dengan bcrypt
export const mockAdmin: Admin = {
  id: 1,
  username: 'admin',
  password: '$2a$10$rQnM1k5t5wZ5X5X5X5X5XeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  nama_lengkap: 'Administrator PMB',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockPoli: Poli[] = [
  {
    id: 1,
    nama_poli: 'Poli Umum',
    deskripsi: 'Layanan pemeriksaan kesehatan umum meliputi pengukuran tekanan darah, suhu tubuh, berat badan, dan konsultasi kesehatan dasar.',
    aktif: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nama_poli: 'Poli KIA',
    deskripsi: 'Layanan Kesehatan Ibu dan Anak meliputi pemeriksaan kehamilan, persalinan, pasca persalinan, imunisasi, dan tumbuh kembang anak.',
    aktif: true,
    created_at: new Date().toISOString(),
  },
];

const today = new Date().toISOString().split('T')[0];

export const mockPasien: Pasien[] = [
  {
    id: 1,
    nik: '3507012345678901',
    nama: 'Siti Aminah',
    jenis_kelamin: 'Perempuan',
    nama_suami: 'Budi Santoso',
    tanggal_lahir: '1990-05-15',
    alamat: 'Jl. Raya Gondanglegi No. 45, Malang',
    no_telepon: '081234567890',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    nik: '3507019876543210',
    nama: 'Dewi Lestari',
    jenis_kelamin: 'Perempuan',
    nama_suami: 'Ahmad Fauzi',
    tanggal_lahir: '1988-08-22',
    alamat: 'Desa Sukosari RT 02 RW 01, Gondanglegi',
    no_telepon: '082345678901',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    nik: '3507015555666677',
    nama: 'Ratna Sari',
    jenis_kelamin: 'Perempuan',
    nama_suami: 'Hendra Wijaya',
    tanggal_lahir: '1995-03-10',
    alamat: 'Jl. Pahlawan No. 12, Gondanglegi',
    no_telepon: '083456789012',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockReservasi: (Reservasi & { nama_pasien?: string; nik_pasien?: string })[] = [
  {
    id: 1,
    pasien_id: 1,
    poli_tujuan: 'Poli KIA',
    keluhan: 'Kontrol kehamilan bulan ke-7',
    tanggal_kunjungan: today,
    nomor_antrian: `A-${today.replace(/-/g, '')}-001`,
    nama_pasien: 'Siti Aminah',
    nik_pasien: '3507012345678901',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    pasien_id: 2,
    poli_tujuan: 'Poli Umum',
    keluhan: 'Pusing dan mual',
    tanggal_kunjungan: today,
    nomor_antrian: `A-${today.replace(/-/g, '')}-002`,
    nama_pasien: 'Dewi Lestari',
    nik_pasien: '3507019876543210',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    pasien_id: 3,
    poli_tujuan: 'Poli KIA',
    keluhan: 'Imunisasi bayi',
    tanggal_kunjungan: today,
    nomor_antrian: `A-${today.replace(/-/g, '')}-003`,
    nama_pasien: 'Ratna Sari',
    nik_pasien: '3507015555666677',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// In-memory storage untuk demo mode
let pasienData = [...mockPasien];
let reservasiData = [...mockReservasi];

export function getMockPasien() {
  return pasienData;
}

export function getMockReservasi() {
  return reservasiData;
}

export function addMockPasien(pasien: Omit<Pasien, 'id' | 'created_at' | 'updated_at'>) {
  const newPasien: Pasien = {
    ...pasien,
    id: pasienData.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  pasienData.push(newPasien);
  return newPasien;
}

export function findMockPasienByNik(nik: string) {
  return pasienData.find(p => p.nik === nik);
}

export function addMockReservasi(reservasi: Omit<Reservasi, 'id' | 'created_at' | 'updated_at'>, namaPasien: string, nikPasien: string) {
  const newReservasi = {
    ...reservasi,
    id: reservasiData.length + 1,
    nama_pasien: namaPasien,
    nik_pasien: nikPasien,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  reservasiData.push(newReservasi);
  return newReservasi;
}

export function updateMockReservasiStatus(id: number, status: 'Menunggu' | 'Diproses' | 'Selesai') {
  const index = reservasiData.findIndex(r => r.id === id);
  if (index !== -1) {
    reservasiData[index].status = status;
    reservasiData[index].updated_at = new Date().toISOString();
    return reservasiData[index];
  }
  return null;
}

export function deleteMockReservasi(id: number) {
  const index = reservasiData.findIndex(r => r.id === id);
  if (index !== -1) {
    reservasiData.splice(index, 1);
    return true;
  }
  return false;
}

export function getMockDashboardStats() {
  const todayReservasi = reservasiData.filter(r => r.tanggal_kunjungan === today);
  return {
    total_pasien_hari_ini: todayReservasi.length,
    total_antrian: todayReservasi.length,
    menunggu: todayReservasi.filter(r => r.status === 'Menunggu').length,
    diproses: todayReservasi.filter(r => r.status === 'Diproses').length,
    selesai: todayReservasi.filter(r => r.status === 'Selesai').length,
  };
}

export const mockKeunggulan: Keunggulan[] = [
  {
    id: 1,
    title: 'Fasilitas Lengkap',
    description: 'Kami menyediakan fasilitas yang lengkap dan memadai untuk kenyamanan Anda.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Tenaga Medis Profesional',
    description: 'Ditangani langsung oleh bidan profesional dan berpengalaman.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let keunggulanData = [...mockKeunggulan];

export function getMockKeunggulan() {
  return keunggulanData;
}

export function addMockKeunggulan(keunggulan: Omit<Keunggulan, 'id' | 'created_at' | 'updated_at'>) {
  const newKeunggulan: Keunggulan = {
    ...keunggulan,
    id: keunggulanData.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  keunggulanData.push(newKeunggulan);
  return newKeunggulan;
}

export function updateMockKeunggulan(id: number, data: Partial<Omit<Keunggulan, 'id' | 'created_at' | 'updated_at'>>) {
  const index = keunggulanData.findIndex(k => k.id === id);
  if (index !== -1) {
    keunggulanData[index] = {
      ...keunggulanData[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return keunggulanData[index];
  }
  return null;
}

export function deleteMockKeunggulan(id: number) {
  const index = keunggulanData.findIndex(k => k.id === id);
  if (index !== -1) {
    keunggulanData.splice(index, 1);
    return true;
  }
  return false;
}
