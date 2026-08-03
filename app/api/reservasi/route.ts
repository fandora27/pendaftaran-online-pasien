import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { getMockReservasi, getMockPasien, addMockReservasi } from '@/lib/mock-data';
import type { Reservasi, ApiResponse } from '@/lib/types';

// Helper untuk generate nomor antrian (mock mode)
function generateMockNomorAntrian(tanggal: string): string {
  const dateFormatted = tanggal.replace(/-/g, '');
  const reservasi = getMockReservasi();
  const todayReservasi = reservasi.filter(r => r.tanggal_kunjungan === tanggal);
  const nomorUrut = String(todayReservasi.length + 1).padStart(3, '0');
  return `A-${dateFormatted}-${nomorUrut}`;
}

// Helper untuk generate nomor antrian (database mode)
async function generateNomorAntrian(tanggal: string): Promise<string> {
  const dateFormatted = tanggal.replace(/-/g, '');
  const result = await query<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM reservasi WHERE tanggal_kunjungan = ?',
    [tanggal]
  );
  const count = result[0]?.count || 0;
  const nomorUrut = String(count + 1).padStart(3, '0');
  return `A-${dateFormatted}-${nomorUrut}`;
}

// GET - Ambil semua reservasi dengan filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tanggal = searchParams.get('tanggal');
    const search = searchParams.get('search');

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      let data = getMockReservasi().map(r => ({
        ...r,
        pasien_nama: r.nama_pasien,
        pasien_nik: r.nik_pasien,
      }));

      if (tanggal) {
        data = data.filter(r => r.tanggal_kunjungan === tanggal);
      }
      if (search) {
        const term = search.toLowerCase();
        data = data.filter(r =>
          r.nama_pasien?.toLowerCase().includes(term) ||
          r.nik_pasien?.includes(term) ||
          r.nomor_antrian.toLowerCase().includes(term)
        );
      }

      return NextResponse.json<ApiResponse<Reservasi[]>>({
        success: true,
        data: data as Reservasi[],
      });
    }

    // Database mode
    let sql = `
      SELECT 
        r.*,
        p.nama as pasien_nama,
        p.nik as pasien_nik
      FROM reservasi r
      JOIN pasien p ON r.pasien_id = p.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (tanggal) {
      sql += ' AND r.tanggal_kunjungan = ?';
      params.push(tanggal);
    }

    if (search) {
      sql += ' AND (p.nama LIKE ? OR p.nik LIKE ? OR r.nomor_antrian LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY r.tanggal_kunjungan DESC, r.nomor_antrian ASC';

    const reservasi = await query<Reservasi[]>(sql, params);

    return NextResponse.json<ApiResponse<Reservasi[]>>({
      success: true,
      data: reservasi,
    });
  } catch (error) {
    console.error('Error fetching reservasi:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal mengambil data reservasi' },
      { status: 500 }
    );
  }
}

// POST - Buat reservasi baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pasien_id, poli_tujuan, keluhan, tanggal_kunjungan } = body;

    if (!pasien_id || !poli_tujuan || !keluhan || !tanggal_kunjungan) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Semua Kolom wajib di isi' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      const pasien = getMockPasien().find(p => p.id === pasien_id);
      const nomor_antrian = generateMockNomorAntrian(tanggal_kunjungan);

      const newReservasi = addMockReservasi(
        {
          pasien_id,
          poli_tujuan,
          keluhan,
          tanggal_kunjungan,
          nomor_antrian,
          status: 'Menunggu',
        },
        pasien?.nama || 'Unknown',
        pasien?.nik || ''
      );

      return NextResponse.json<ApiResponse<Reservasi>>({
        success: true,
        data: {
          ...newReservasi,
          pasien_nama: pasien?.nama,
          pasien_nik: pasien?.nik,
        } as Reservasi,
        message: 'Reservasi berhasil dibuat',
      });
    }

    // Database mode
    const nomor_antrian = await generateNomorAntrian(tanggal_kunjungan);

    const result = await query<{ insertId: number }>(
      `INSERT INTO reservasi (pasien_id, poli_tujuan, keluhan, tanggal_kunjungan, nomor_antrian) 
       VALUES (?, ?, ?, ?, ?)`,
      [pasien_id, poli_tujuan, keluhan, tanggal_kunjungan, nomor_antrian]
    );

    const newReservasi = await query<Reservasi[]>(
      `SELECT r.*, p.nama as pasien_nama, p.nik as pasien_nik 
       FROM reservasi r 
       JOIN pasien p ON r.pasien_id = p.id 
       WHERE r.id = ?`,
      [(result as unknown as { insertId: number }).insertId]
    );

    return NextResponse.json<ApiResponse<Reservasi>>({
      success: true,
      data: newReservasi[0],
      message: 'Reservasi berhasil dibuat',
    });
  } catch (error) {
    console.error('Error creating reservasi:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal membuat reservasi' },
      { status: 500 }
    );
  }
}
