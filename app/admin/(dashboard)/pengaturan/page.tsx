'use client';

import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PengaturanPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    usernameSekarang: '',
    usernameBaru: '',
    passwordSekarang: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validasi
    if (!formData.usernameSekarang || !formData.passwordSekarang) {
      setMessage({ type: 'error', text: 'Username dan password saat ini wajib diisi untuk verifikasi.' });
      return;
    }

    if (!formData.usernameBaru && !formData.passwordBaru) {
      setMessage({ type: 'error', text: 'Masukkan username baru atau password baru yang ingin diubah.' });
      return;
    }

    if (formData.passwordBaru && formData.passwordBaru !== formData.konfirmasiPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi password tidak cocok.' });
      return;
    }

    if (formData.passwordBaru && formData.passwordBaru.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameSekarang: formData.usernameSekarang,
          passwordSekarang: formData.passwordSekarang,
          usernameBaru: formData.usernameBaru || undefined,
          passwordBaru: formData.passwordBaru || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Pengaturan akun berhasil diperbarui!' });
        setFormData({
          usernameSekarang: '',
          usernameBaru: '',
          passwordSekarang: '',
          passwordBaru: '',
          konfirmasiPassword: '',
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal memperbarui pengaturan.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan Akun</h1>
        <p className="text-muted-foreground">Ubah username dan password akun admin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ubah Kredensial
          </CardTitle>
          <CardDescription>
            Masukkan username dan password saat ini untuk verifikasi, lalu masukkan data baru yang ingin diubah.
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

            {/* Kredensial Saat Ini */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-medium text-foreground">Kredensial Saat Ini (Wajib)</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="usernameSekarang">Username Saat Ini</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="usernameSekarang"
                      name="usernameSekarang"
                      type="text"
                      placeholder="Masukkan username saat ini"
                      value={formData.usernameSekarang}
                      onChange={handleChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordSekarang">Password Saat Ini</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passwordSekarang"
                      name="passwordSekarang"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password saat ini"
                      value={formData.passwordSekarang}
                      onChange={handleChange}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Baru */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Data Baru (Opsional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="usernameBaru">Username Baru</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="usernameBaru"
                    name="usernameBaru"
                    type="text"
                    placeholder="Kosongkan jika tidak ingin mengubah username"
                    value={formData.usernameBaru}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordBaru">Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passwordBaru"
                      name="passwordBaru"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Kosongkan jika tidak ingin mengubah"
                      value={formData.passwordBaru}
                      onChange={handleChange}
                      className="pl-9 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="konfirmasiPassword">Konfirmasi Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="konfirmasiPassword"
                      name="konfirmasiPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi password baru"
                      value={formData.konfirmasiPassword}
                      onChange={handleChange}
                      className="pl-9 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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

      {/* Info Card */}
      <Card className="bg-secondary/30">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Setelah mengubah username atau password, Anda perlu login ulang dengan kredensial baru.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
