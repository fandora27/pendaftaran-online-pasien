import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { Admin, ApiResponse } from '@/lib/types';

// Demo credentials untuk preview mode
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';
const DEMO_ADMIN = {
  id: 1,
  username: 'admin',
  nama_lengkap: 'Administrator PMB',
};

// POST - Login admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validasi input
    if (!username || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode - simple credential check
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        const response = NextResponse.json<ApiResponse<typeof DEMO_ADMIN>>({
          success: true,
          data: DEMO_ADMIN,
          message: 'Login berhasil (Demo Mode)',
        });

        response.cookies.set('admin_session', JSON.stringify(DEMO_ADMIN), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
        });

        return response;
      } else {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Username atau password salah' },
          { status: 401 }
        );
      }
    }

    // Database mode
    const admins = await query<Admin[]>(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const admin = admins[0];

    // Verifikasi password
    const isValid = await bcrypt.compare(password, admin.password || '');
    
    if (!isValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Hapus password dari response
    const { password: _, ...adminData } = admin;

    const response = NextResponse.json<ApiResponse<Omit<Admin, 'password'>>>({
      success: true,
      data: adminData,
      message: 'Login berhasil',
    });

    response.cookies.set('admin_session', JSON.stringify({
      id: admin.id,
      username: admin.username,
      nama_lengkap: admin.nama_lengkap,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
