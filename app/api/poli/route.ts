import { NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { mockPoli } from '@/lib/mock-data';
import type { Poli, ApiResponse } from '@/lib/types';

// GET - Ambil semua poli/layanan
export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
      const poli = await query<Poli[]>(
        'SELECT * FROM poli WHERE aktif = TRUE ORDER BY id ASC'
      );
      return NextResponse.json<ApiResponse<Poli[]>>({
        success: true,
        data: poli,
      });
    } else {
      return NextResponse.json<ApiResponse<Poli[]>>({
        success: true,
        data: mockPoli,
      });
    }
  } catch (error) {
    console.error('Error fetching poli:', error);
    return NextResponse.json<ApiResponse<Poli[]>>({
      success: true,
      data: mockPoli,
    });
  }
}
