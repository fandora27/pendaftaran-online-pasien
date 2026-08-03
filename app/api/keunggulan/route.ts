import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { getMockKeunggulan, addMockKeunggulan } from '@/lib/mock-data';
import type { Keunggulan, ApiResponse } from '@/lib/types';

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      return NextResponse.json<ApiResponse<Keunggulan[]>>({
        success: true,
        data: getMockKeunggulan(),
      });
    }

    // Database mode
    const keunggulan = await query<Keunggulan[]>('SELECT * FROM keunggulan ORDER BY id ASC');

    return NextResponse.json<ApiResponse<Keunggulan[]>>({
      success: true,
      data: keunggulan,
    });
  } catch (error) {
    console.error('Error fetching keunggulan:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal mengambil data keunggulan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url } = body;

    if (!title || !description) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Judul dan deskripsi wajib diisi' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      const newKeunggulan = addMockKeunggulan({ title, description, image_url });

      return NextResponse.json<ApiResponse<Keunggulan>>({
        success: true,
        data: newKeunggulan as Keunggulan,
        message: 'Keunggulan berhasil ditambahkan',
      });
    }

    // Database mode
    const result = await query<{ insertId: number }>(
      'INSERT INTO keunggulan (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url || null]
    );

    const newKeunggulan = await query<Keunggulan[]>(
      'SELECT * FROM keunggulan WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json<ApiResponse<Keunggulan>>({
      success: true,
      data: newKeunggulan[0],
      message: 'Keunggulan berhasil ditambahkan',
    });
  } catch (error) {
    console.error('Error creating keunggulan:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal menambahkan keunggulan' },
      { status: 500 }
    );
  }
}
