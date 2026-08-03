// Type definitions untuk sistem PMB

export interface Pasien {
  id: number;
  nik: string;
  nama: string;
  nama_suami?: string;
  jenis_kelamin?: string;
  tanggal_lahir: string;
  alamat: string;
  no_telepon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Reservasi {
  id: number;
  pasien_id: number;
  poli_tujuan: string;
  keluhan: string;
  tanggal_kunjungan: string;
  nomor_antrian: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  created_at?: string;
  updated_at?: string;
  // Joined fields
  pasien_nama?: string;
  pasien_nik?: string;
}

export interface Admin {
  id: number;
  username: string;
  password?: string;
  nama_lengkap: string;
  created_at?: string;
}

export interface Poli {
  id: number;
  nama_poli: string;
  deskripsi: string;
  aktif: boolean;
}

export interface DashboardStats {
  pasienHariIni: number;
  totalAntrian: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BerandaSettings {
  id: number;
  logo_url?: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  updated_at?: string;
}

export interface Keunggulan {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
