'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { User, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import type { Poli, Reservasi, ApiResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fallback data poli - hanya Poli Umum dan KIA
const fallbackPoli: Poli[] = [
  { id: 1, nama_poli: 'Poli Umum', deskripsi: '', aktif: true },
  { id: 2, nama_poli: 'Poli KIA', deskripsi: '', aktif: true },
];

interface FormData {
  nik: string;
  nama: string;
  jenis_kelamin: string;
  nama_suami: string;
  tanggal_lahir: string;
  alamat: string;
  no_telepon: string;
  poli_tujuan: string;
  keluhan: string;
}

function DaftarForm() {
  const searchParams = useSearchParams();
  const preselectedPoli = searchParams.get('poli') || '';

  const { data: poliData } = useSWR<ApiResponse<Poli[]>>('/api/poli', fetcher);
  const poliList = poliData?.success ? poliData.data : fallbackPoli;

  const [formData, setFormData] = useState<FormData>({
    nik: '',
    nama: '',
    jenis_kelamin: '',
    nama_suami: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    poli_tujuan: preselectedPoli,
    keluhan: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reservasiResult, setReservasiResult] = useState<Reservasi | null>(null);

  useEffect(() => {
    if (preselectedPoli && !formData.poli_tujuan) {
      setFormData((prev) => ({ ...prev, poli_tujuan: preselectedPoli }));
    }
  }, [preselectedPoli, formData.poli_tujuan]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // NIK validation
    if (!formData.nik) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama lengkap wajib diisi';
    }

    // Nama Suami / Keluarga validation
    if (!formData.nama_suami.trim()) {
      newErrors.nama_suami = 'Nama Suami / Keluarga wajib diisi';
    }

    // Jenis Kelamin validation
    if (!formData.jenis_kelamin) {
      newErrors.jenis_kelamin = 'Pilih jenis kelamin';
    }

    // Tanggal lahir validation
    if (!formData.tanggal_lahir) {
      newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    }

    // Alamat validation
    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    // No. Telepon validation
    if (!formData.no_telepon.trim()) {
      newErrors.no_telepon = 'No. Telepon wajib diisi';
    }

    // Poli validation
    if (!formData.poli_tujuan) {
      newErrors.poli_tujuan = 'Pilih poli tujuan';
    }

    // Keluhan validation
    if (!formData.keluhan.trim()) {
      newErrors.keluhan = 'Keluhan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Daftarkan pasien atau ambil data pasien yang sudah ada
      const pasienResponse = await fetch('/api/pasien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nik: formData.nik,
          nama: formData.nama,
          jenis_kelamin: formData.jenis_kelamin,
          nama_suami: formData.nama_suami,
          tanggal_lahir: formData.tanggal_lahir,
          alamat: formData.alamat,
          no_telepon: formData.no_telepon || null,
        }),
      });

      const pasienResult = await pasienResponse.json();

      if (!pasienResult.success) {
        throw new Error(pasienResult.error || 'Gagal mendaftarkan pasien');
      }

      // Step 2: Buat reservasi
      const reservasiResponse = await fetch('/api/reservasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasien_id: pasienResult.data.id,
          poli_tujuan: formData.poli_tujuan,
          keluhan: formData.keluhan,
          tanggal_kunjungan: new Date().toISOString().split('T')[0],
        }),
      });

      const reservasiResultData = await reservasiResponse.json();

      if (!reservasiResultData.success) {
        throw new Error(reservasiResultData.error || 'Gagal membuat reservasi');
      }

      setReservasiResult(reservasiResultData.data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Success state
  if (reservasiResult) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Pendaftaran Berhasil!</CardTitle>
              <CardDescription>
                Terima kasih telah mendaftar di PMB Griya Bunda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Nomor Antrian Anda</p>
                <p className="text-4xl font-bold text-primary">{reservasiResult.nomor_antrian}</p>
              </div>

              <div className="text-left space-y-3 bg-secondary/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama:</span>
                  <span className="font-medium">{reservasiResult.pasien_nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poli Tujuan:</span>
                  <span className="font-medium">{reservasiResult.poli_tujuan}</span>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Simpan nomor antrian Anda dan tunjukkan saat kunjungan. Jangan lupa membawa kartu identitas (KTP/KK).
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => {
                  setReservasiResult(null);
                  setFormData({
                    nik: '',
                    nama: '',
                    jenis_kelamin: '',
                    nama_suami: '',
                    tanggal_lahir: '',
                    alamat: '',
                    no_telepon: '',
                    poli_tujuan: '',
                    keluhan: '',
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Daftar Pasien Lain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Pendaftaran Online</CardTitle>
            <CardDescription>
              Isi formulir berikut untuk mendapatkan nomor antrian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {/* Data Pasien Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Data Pasien
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (16 digit) *</Label>
                  <Input
                    id="nik"
                    placeholder="Masukkan 16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
                    maxLength={16}
                    className={errors.nik ? 'border-destructive' : ''}
                  />
                  {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                    className={errors.nama ? 'border-destructive' : ''}
                  />
                  {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_suami">Nama Suami / Keluarga *</Label>
                  <Input
                    id="nama_suami"
                    placeholder="Masukkan nama suami atau keluarga terdekat"
                    value={formData.nama_suami}
                    onChange={(e) => handleInputChange('nama_suami', e.target.value)}
                    className={errors.nama_suami ? 'border-destructive' : ''}
                  />
                  {errors.nama_suami && <p className="text-sm text-destructive">{errors.nama_suami}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select
                    value={formData.jenis_kelamin}
                    onValueChange={(value) => handleInputChange('jenis_kelamin', value)}
                  >
                    <SelectTrigger className={errors.jenis_kelamin ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jenis_kelamin && <p className="text-sm text-destructive">{errors.jenis_kelamin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                    className={errors.tanggal_lahir ? 'border-destructive' : ''}
                  />
                  {errors.tanggal_lahir && <p className="text-sm text-destructive">{errors.tanggal_lahir}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Alamat *
                  </Label>
                  <Textarea
                    id="alamat"
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    className={errors.alamat ? 'border-destructive' : ''}
                    rows={2}
                  />
                  {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_telepon" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    No. Telepon *
                  </Label>
                  <Input
                    id="no_telepon"
                    placeholder="Masukkan nomor telepon"
                    value={formData.no_telepon}
                    onChange={(e) => handleInputChange('no_telepon', e.target.value.replace(/\D/g, '').slice(0, 15))}
                    className={errors.no_telepon ? 'border-destructive' : ''}
                  />
                  {errors.no_telepon && <p className="text-sm text-destructive">{errors.no_telepon}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poli_tujuan">Poli Tujuan *</Label>
                <Select
                  value={formData.poli_tujuan}
                  onValueChange={(value) => handleInputChange('poli_tujuan', value)}
                >
                  <SelectTrigger className={errors.poli_tujuan ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih poli tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {poliList?.map((poli) => (
                      <SelectItem key={poli.id} value={poli.nama_poli}>
                        {poli.nama_poli}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.poli_tujuan && <p className="text-sm text-destructive">{errors.poli_tujuan}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keluhan">Keluhan *</Label>
                <Textarea
                  id="keluhan"
                  placeholder="Jelaskan keluhan atau tujuan kunjungan Anda"
                  value={formData.keluhan}
                  onChange={(e) => handleInputChange('keluhan', e.target.value)}
                  className={errors.keluhan ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.keluhan && <p className="text-sm text-destructive">{errors.keluhan}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Memproses...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DaftarPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Memuat form pendaftaran...</div>}>
      <DaftarForm />
    </Suspense>
  );
}
