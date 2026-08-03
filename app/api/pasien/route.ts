import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { getMockPasien, findMockPasienByNik, addMockPasien } from '@/lib/mock-data';
import type { Pasien, ApiResponse } from '@/lib/types';

// GET - Ambil semua pasien atau cari berdasarkan NIK
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nik = searchParams.get('nik');
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      if (nik) {
        const pasien = findMockPasienByNik(nik);
        return NextResponse.json<ApiResponse<Pasien | null>>({
          success: true,
          data: pasien || null,
        });
      }
      return NextResponse.json<ApiResponse<Pasien[]>>({
        success: true,
        data: getMockPasien(),
      });
    }

    if (nik) {
      const pasien = await query<Pasien[]>(
        'SELECT * FROM pasien WHERE nik = ?',
        [nik]
      );
      return NextResponse.json<ApiResponse<Pasien | null>>({
        success: true,
        data: pasien[0] || null,
      });
    }

    const pasien = await query<Pasien[]>(
      'SELECT * FROM pasien ORDER BY created_at DESC'
    );
    return NextResponse.json<ApiResponse<Pasien[]>>({
      success: true,
      data: pasien,
    });
  } catch (error) {
    console.error('Error fetching pasien:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal mengambil data pasien' },
      { status: 500 }
    );
  }
}

// POST - Tambah pasien baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nik, nama, jenis_kelamin, nama_suami, tanggal_lahir, alamat, no_telepon } = body;

    // Validasi NIK
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'NIK harus 16 digit angka' },
        { status: 400 }
      );
    }

    // Validasi field wajib
    if (!nama || !jenis_kelamin || !nama_suami || !tanggal_lahir || !alamat || !no_telepon) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Semua Kolom wajib di isi' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      const existing = findMockPasienByNik(nik);
      if (existing) {
        return NextResponse.json<ApiResponse<Pasien>>({
          success: true,
          data: existing,
          message: 'Pasien sudah terdaftar',
        });
      }
      const newPasien = addMockPasien({ nik, nama, jenis_kelamin, nama_suami, tanggal_lahir, alamat, no_telepon });
      return NextResponse.json<ApiResponse<Pasien>>({
        success: true,
        data: newPasien,
        message: 'Pasien berhasil didaftarkan',
      });
    }

    // Database mode
    const existing = await query<Pasien[]>(
      'SELECT * FROM pasien WHERE nik = ?',
      [nik]
    );

    if (existing.length > 0) {
      return NextResponse.json<ApiResponse<Pasien>>({
        success: true,
        data: existing[0],
        message: 'Pasien sudah terdaftar',
      });
    }

    const result = await query<{ insertId: number }>(
      'INSERT INTO pasien (nik, nama, jenis_kelamin, nama_suami, tanggal_lahir, alamat, no_telepon) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nik, nama, jenis_kelamin, nama_suami, tanggal_lahir, alamat, no_telepon || null]
    );

    const newPasien = await query<Pasien[]>(
      'SELECT * FROM pasien WHERE id = ?',
      [(result as unknown as { insertId: number }).insertId]
    );

    return NextResponse.json<ApiResponse<Pasien>>({
      success: true,
      data: newPasien[0],
      message: 'Pasien berhasil didaftarkan',
    });
  } catch (error) {
    console.error('Error creating pasien:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal mendaftarkan pasien' },
      { status: 500 }
    );
  }
}
