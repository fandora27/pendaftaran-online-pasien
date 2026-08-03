'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Search, Filter, Trash2, RefreshCw, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Reservasi, ApiResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fallback data untuk demo
const fallbackReservasi: Reservasi[] = [];

export default function AdminReservasiPage() {
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
  
  // State untuk Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReservasi, setEditingReservasi] = useState<Partial<Reservasi>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Build query string
  const queryParams = new URLSearchParams();
  if (filterTanggal) queryParams.append('tanggal', filterTanggal);
  if (search) queryParams.append('search', search);

  const { data, isLoading, mutate } = useSWR<ApiResponse<Reservasi[]>>(
    `/api/reservasi?${queryParams.toString()}`,
    fetcher
  );

  const reservasiList = data?.success ? data.data : fallbackReservasi;

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/reservasi/${id}`, { method: 'DELETE' });
      mutate();
    } catch (error) {
      console.error('Error deleting reservasi:', error);
    }
  };

  const handleEditClick = (reservasi: Reservasi) => {
    setEditingReservasi({ ...reservasi });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (field: keyof Reservasi, value: string) => {
    setEditingReservasi(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingReservasi.id) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/reservasi/${editingReservasi.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasien_nama: editingReservasi.pasien_nama,
          pasien_nik: editingReservasi.pasien_nik,
          poli_tujuan: editingReservasi.poli_tujuan,
          keluhan: editingReservasi.keluhan,
          status: editingReservasi.status,
        }),
      });
      
      if (response.ok) {
        setIsEditDialogOpen(false);
        mutate();
      } else {
        alert('Gagal menyimpan perubahan.');
      }
    } catch (error) {
      console.error('Error updating reservasi:', error);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Reservasi</h1>
          <p className="text-muted-foreground">Kelola data reservasi pasien</p>
        </div>
        <Button onClick={() => mutate()} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIK, atau no. antrian..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter Tanggal */}
            <Input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : reservasiList && reservasiList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">No. Antrian</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead className="hidden md:table-cell">NIK</TableHead>
                    <TableHead>Poli Tujuan</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservasiList.map((reservasi) => (
                    <TableRow key={reservasi.id}>
                      <TableCell className="font-mono font-medium">
                        {reservasi.nomor_antrian}
                      </TableCell>
                      <TableCell className="font-medium">{reservasi.pasien_nama}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {reservasi.pasien_nik}
                      </TableCell>
                      <TableCell>{reservasi.poli_tujuan}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatDate(reservasi.tanggal_kunjungan)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* Edit Button */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleEditClick(reservasi)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Reservasi?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus reservasi {reservasi.pasien_nama}? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(reservasi.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Tidak ada data reservasi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Data Reservasi</DialogTitle>
            <DialogDescription>
              Ubah data pasien atau informasi reservasi di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nama">Nama Pasien</Label>
              <Input 
                id="edit-nama" 
                value={editingReservasi.pasien_nama || ''} 
                onChange={(e) => handleEditChange('pasien_nama', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-nik">NIK</Label>
              <Input 
                id="edit-nik" 
                value={editingReservasi.pasien_nik || ''} 
                onChange={(e) => handleEditChange('pasien_nik', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Poli Tujuan</Label>
              <Select 
                value={editingReservasi.poli_tujuan || ''} 
                onValueChange={(val) => handleEditChange('poli_tujuan', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Poli" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                  <SelectItem value="Poli KIA">Poli KIA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-keluhan">Keluhan</Label>
              <Textarea 
                id="edit-keluhan" 
                value={editingReservasi.keluhan || ''} 
                onChange={(e) => handleEditChange('keluhan', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="bg-secondary/30">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Gunakan tombol edit (ikon pensil) untuk mengubah data NIK, Nama, dan Poli Reservasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
