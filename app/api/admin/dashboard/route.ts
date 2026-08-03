import { NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { getMockDashboardStats } from '@/lib/mock-data';
import type { DashboardStats, ApiResponse } from '@/lib/types';

// GET - Ambil statistik dashboard
export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      const mockStats = getMockDashboardStats();
      const stats: DashboardStats = {
        pasienHariIni: mockStats.total_pasien_hari_ini,
        totalAntrian: mockStats.total_antrian,
      };
      return NextResponse.json<ApiResponse<DashboardStats>>({
        success: true,
        data: stats,
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const pasienHariIni = await query<{ count: number }[]>(
      `SELECT COUNT(DISTINCT pasien_id) as count 
       FROM reservasi 
       WHERE tanggal_kunjungan = ?`,
      [today]
    );

    const totalAntrian = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count 
       FROM reservasi 
       WHERE tanggal_kunjungan = ?`,
      [today]
    );

    const stats: DashboardStats = {
      pasienHariIni: pasienHariIni[0]?.count || 0,
      totalAntrian: totalAntrian[0]?.count || 0,
    };

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Fallback ke mock data jika error
    const mockStats = getMockDashboardStats();
    const stats: DashboardStats = {
      pasienHariIni: mockStats.total_pasien_hari_ini,
      totalAntrian: mockStats.total_antrian,
    };
    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    });
  }
}
