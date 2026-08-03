import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

// POST - Logout admin
export async function POST() {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: 'Logout berhasil',
  });

  // Hapus cookie session
  response.cookies.delete('admin_session');

  return response;
}
