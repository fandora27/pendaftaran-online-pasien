import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseAvailable } from '@/lib/db';
import { updateMockKeunggulan, deleteMockKeunggulan } from '@/lib/mock-data';
import type { Keunggulan, ApiResponse } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID tidak valid' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, image_url } = body;

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      const updated = updateMockKeunggulan(id, { title, description, image_url });
      
      if (!updated) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Keunggulan tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<Keunggulan>>({
        success: true,
        data: updated as Keunggulan,
        message: 'Keunggulan berhasil diperbarui',
      });
    }

    // Database mode
    // First check if it exists
    const existing = await query<Keunggulan[]>('SELECT * FROM keunggulan WHERE id = ?', [id]);
    if (existing.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Keunggulan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update query
    let sql = 'UPDATE keunggulan SET ';
    const updateParams: unknown[] = [];
    
    if (title !== undefined) {
      sql += 'title = ?, ';
      updateParams.push(title);
    }
    
    if (description !== undefined) {
      sql += 'description = ?, ';
      updateParams.push(description);
    }
    
    if (image_url !== undefined) {
      sql += 'image_url = ?, ';
      updateParams.push(image_url);
    }

    // Remove trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';
    updateParams.push(id);

    await query(sql, updateParams);

    const updated = await query<Keunggulan[]>('SELECT * FROM keunggulan WHERE id = ?', [id]);

    return NextResponse.json<ApiResponse<Keunggulan>>({
      success: true,
      data: updated[0],
      message: 'Keunggulan berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating keunggulan:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal memperbarui keunggulan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID tidak valid' },
        { status: 400 }
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock mode
      const deleted = deleteMockKeunggulan(id);
      
      if (!deleted) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Keunggulan tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Keunggulan berhasil dihapus',
      });
    }

    // Database mode
    const existing = await query<Keunggulan[]>('SELECT * FROM keunggulan WHERE id = ?', [id]);
    if (existing.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Keunggulan tidak ditemukan' },
        { status: 404 }
      );
    }

    await query('DELETE FROM keunggulan WHERE id = ?', [id]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Keunggulan berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting keunggulan:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Gagal menghapus keunggulan' },
      { status: 500 }
    );
  }
}
