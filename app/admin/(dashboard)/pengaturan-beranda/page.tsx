'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, Save, CheckCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BerandaSettings, ApiResponse } from '@/lib/types';

export default function PengaturanBerandaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<BerandaSettings>>({
    logo_url: '',
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_description: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const result: ApiResponse<BerandaSettings> = await response.json();
        if (result.success && result.data) {
          setFormData({
            logo_url: result.data.logo_url || '',
            hero_title: result.data.hero_title,
            hero_subtitle: result.data.hero_subtitle,
            about_title: result.data.about_title,
            about_description: result.data.about_description,
          });
          if (result.data.logo_url) {
            setPreviewUrl(result.data.logo_url);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Hanya file gambar yang diperbolehkan.' });
        return;
      }
      
      // Validasi ukuran (maks 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB.' });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(formData.logo_url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeLogo = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, logo_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      let finalLogoUrl = formData.logo_url;

      // Upload file jika ada yang dipilih
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          finalLogoUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || 'Gagal mengunggah logo');
        }
      }

      // Simpan pengaturan
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo_url: finalLogoUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Pengaturan beranda berhasil diperbarui!' });
        setFormData(prev => ({ ...prev, logo_url: finalLogoUrl }));
        setSelectedFile(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal memperbarui pengaturan beranda.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan Beranda</h1>
        <p className="text-muted-foreground">Ubah informasi teks yang tampil pada halaman utama pasien</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informasi Beranda
          </CardTitle>
          <CardDescription>
            Sesuaikan teks judul, deskripsi, dan informasi lainnya di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-green-500 bg-green-50 text-green-800' : ''}>
                {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-medium text-foreground">Bagian Utama (Hero Section)</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo PMB (Opsional)</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted/50 overflow-hidden shrink-0 group">
                      {previewUrl ? (
                        <>
                          <Image src={previewUrl} alt="Logo PMB" fill className="object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button type="button" variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={removeLogo} title="Hapus Logo">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                          <span className="text-xs">Tidak ada logo</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <p className="text-xs text-muted-foreground">
                        Format yang didukung: JPG, PNG, WEBP. Ukuran maksimal: 2MB.<br/>
                        Rekomendasi rasio 1:1 atau proporsional.
                      </p>
                      {selectedFile && (
                        <Button type="button" variant="outline" size="sm" onClick={clearFile} className="mt-2">
                          Batal Ganti Gambar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_title">Judul Utama</Label>
                  <Input
                    id="hero_title"
                    name="hero_title"
                    type="text"
                    placeholder="Masukkan judul utama"
                    value={formData.hero_title || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Sub Judul / Deskripsi Pendek</Label>
                  <Textarea
                    id="hero_subtitle"
                    name="hero_subtitle"
                    placeholder="Masukkan sub judul"
                    value={formData.hero_subtitle || ''}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Bagian Tentang Kami / Keunggulan</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about_title">Judul Bagian</Label>
                  <Input
                    id="about_title"
                    name="about_title"
                    type="text"
                    placeholder="Masukkan judul bagian keunggulan"
                    value={formData.about_title || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_description">Deskripsi Singkat</Label>
                  <Textarea
                    id="about_description"
                    name="about_description"
                    placeholder="Masukkan deskripsi bagian keunggulan"
                    value={formData.about_description || ''}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
