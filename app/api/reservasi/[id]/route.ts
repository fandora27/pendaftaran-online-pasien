import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { getMockReservasi, deleteMockReservasi } from '@/lib/mock-data';
import type { Reservasi, ApiResponse } from '@/lib/types';

// GET - Ambil reservasi berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      const reservasi = getMockReservasi().find(r => r.id === parseInt(id));
      if (!reservasi) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Reservasi tidak ditemukan' },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse<Reservasi>>({
        success: true,
        data: {
          ...reservasi,
          pasien_nama: reservasi.nama_pasien,
          pasien_nik: reservasi.nik_pasien,
        } as Reservasi,
      });
    }

    const reservasi = await query<Reservasi[]>(
      `SELECT r.*, p.nama as pasien_nama, p.nik as pasien_nik 
       FROM reservasi r 
       JOIN pasien p ON r.pasien_id = p.id 
       WHERE r.id = ?`,
      [id]
    );

    if (reservasi.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Reservasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Reservasi>>({
      success: true,
      data: reservasi[0],
    });
  } catch (error) {
    console.error('Error fetching reservasi:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal mengambil data reservasi' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus reservasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      const deleted = deleteMockReservasi(parseInt(id));
      if (!deleted) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Reservasi tidak ditemukan' },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Reservasi berhasil dihapus',
      });
    }

    await query('DELETE FROM reservasi WHERE id = ?', [id]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Reservasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting reservasi:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal menghapus reservasi' },
      { status: 500 }
    );
  }
}

// PUT - Update reservasi dan data pasien terkait
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { poli_tujuan, keluhan, status, pasien_nama, pasien_nik } = body;

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode: not fully implemented for PUT in mock
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Edit tidak didukung dalam mode mock' },
        { status: 400 }
      );
    }

    // 1. Dapatkan pasien_id dari reservasi
    const reservasi = await query<Reservasi[]>('SELECT pasien_id FROM reservasi WHERE id = ?', [id]);
    
    if (reservasi.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Reservasi tidak ditemukan' },
        { status: 404 }
      );
    }

    const pasienId = reservasi[0].pasien_id;

    // 2. Update data reservasi
    await query(
      'UPDATE reservasi SET poli_tujuan = ?, keluhan = ? WHERE id = ?',
      [poli_tujuan, keluhan, id]
    );

    // 3. Update data pasien
    if (pasien_nama && pasien_nik) {
      await query(
        'UPDATE pasien SET nama = ?, nik = ? WHERE id = ?',
        [pasien_nama, pasien_nik, pasienId]
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Data reservasi berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating reservasi:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal memperbarui reservasi' },
      { status: 500 }
    );
  }
}
