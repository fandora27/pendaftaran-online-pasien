import { NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import type { BerandaSettings, ApiResponse } from '@/lib/types';

// Default fallback jika DB tidak jalan
const defaultSettings: BerandaSettings = {
  id: 1,
  hero_title: 'Selamat Datang di PMB Griya Bunda Gondanglegi',
  hero_subtitle: 'Praktik Mandiri Bidan dengan layanan profesional dan terpercaya untuk kesehatan ibu dan anak. Kami siap melayani dengan sepenuh hati.',
  about_title: 'Mengapa Memilih Kami?',
  about_description: 'Kami memberikan pelayanan kesehatan profesional yang didedikasikan untuk kenyamanan dan kesehatan Anda beserta buah hati.'
};

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();
    if (dbAvailable) {
      const results = await query<BerandaSettings[]>('SELECT * FROM settings WHERE id = 1');
      if (results.length > 0) {
        return NextResponse.json<ApiResponse<BerandaSettings>>({
          success: true,
          data: results[0]
        });
      }
      
      // Jika kosong, insert default
      await query(
        'INSERT INTO settings (id, logo_url, hero_title, hero_subtitle, about_title, about_description) VALUES (?, ?, ?, ?, ?, ?)',
        [
          defaultSettings.id,
          defaultSettings.logo_url || null,
          defaultSettings.hero_title,
          defaultSettings.hero_subtitle,
          defaultSettings.about_title,
          defaultSettings.about_description
        ]
      );
      
      return NextResponse.json<ApiResponse<BerandaSettings>>({
        success: true,
        data: defaultSettings
      });
    }
    
    return NextResponse.json<ApiResponse<BerandaSettings>>({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json<ApiResponse<BerandaSettings>>({
      success: true,
      data: defaultSettings
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as Partial<BerandaSettings>;
    const dbAvailable = await isDatabaseAvailable();
    
    if (!dbAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Database tidak tersedia. Periksa koneksi MySQL Anda.'
      }, { status: 500 });
    }
    
    const results = await query<BerandaSettings[]>('SELECT * FROM settings WHERE id = 1');
    if (results.length === 0) {
      await query(
        'INSERT INTO settings (id, logo_url, hero_title, hero_subtitle, about_title, about_description) VALUES (?, ?, ?, ?, ?, ?)',
        [
          1,
          data.logo_url !== undefined ? data.logo_url : null,
          data.hero_title || defaultSettings.hero_title,
          data.hero_subtitle || defaultSettings.hero_subtitle,
          data.about_title || defaultSettings.about_title,
          data.about_description || defaultSettings.about_description
        ]
      );
    } else {
      await query(
        'UPDATE settings SET logo_url = ?, hero_title = ?, hero_subtitle = ?, about_title = ?, about_description = ? WHERE id = 1',
        [
          data.logo_url !== undefined ? data.logo_url : results[0].logo_url,
          data.hero_title || results[0].hero_title,
          data.hero_subtitle || results[0].hero_subtitle,
          data.about_title || results[0].about_title,
          data.about_description || results[0].about_description
        ]
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal memperbarui pengaturan beranda.'
    }, { status: 500 });
  }
}
