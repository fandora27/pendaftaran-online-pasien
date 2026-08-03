import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, isDatabaseAvailable } from '@/lib/db';
import type { Admin, ApiResponse } from '@/lib/types';

// Demo credentials
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

// In-memory demo credentials (for preview mode)
let demoCredentials = {
  username: DEMO_USERNAME,
  password: DEMO_PASSWORD,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usernameSekarang, passwordSekarang, usernameBaru, passwordBaru } = body;

    // Validasi input
    if (!usernameSekarang || !passwordSekarang) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Username dan password saat ini wajib diisi.' },
        { status: 400 }
      );
    }

    if (!usernameBaru && !passwordBaru) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Masukkan username baru atau password baru yang ingin diubah.' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Mode database - gunakan MySQL
      const admins = await query<Admin[]>(
        'SELECT * FROM admin WHERE username = ?',
        [usernameSekarang]
      );

      if (admins.length === 0) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Username tidak ditemukan.' },
          { status: 401 }
        );
      }

      const admin = admins[0];
      const isValidPassword = await bcrypt.compare(passwordSekarang, admin.password);

      if (!isValidPassword) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Password saat ini salah.' },
          { status: 401 }
        );
      }

      // Check if new username already exists
      if (usernameBaru && usernameBaru !== usernameSekarang) {
        const existingAdmin = await query<Admin[]>(
          'SELECT * FROM admin WHERE username = ? AND id != ?',
          [usernameBaru, admin.id]
        );
        if (existingAdmin.length > 0) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: 'Username sudah digunakan.' },
            { status: 400 }
          );
        }
      }

      // Update credentials
      const updates: string[] = [];
      const values: unknown[] = [];

      if (usernameBaru) {
        updates.push('username = ?');
        values.push(usernameBaru);
      }

      if (passwordBaru) {
        const hashedPassword = await bcrypt.hash(passwordBaru, 10);
        updates.push('password = ?');
        values.push(hashedPassword);
      }

      values.push(admin.id);

      await query(
        `UPDATE admin SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Pengaturan akun berhasil diperbarui.',
      });
    } else {
      // Demo mode - verifikasi dengan kredensial demo
      if (usernameSekarang !== demoCredentials.username || passwordSekarang !== demoCredentials.password) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Username atau password saat ini salah.' },
          { status: 401 }
        );
      }

      // Update demo credentials
      if (usernameBaru) {
        demoCredentials.username = usernameBaru;
      }
      if (passwordBaru) {
        demoCredentials.password = passwordBaru;
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Pengaturan akun berhasil diperbarui (mode demo).',
      });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Terjadi kesalahan saat memperbarui pengaturan.' },
      { status: 500 }
    );
  }
}
