'use client';

import useSWR from 'swr';
import { Users, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { DashboardStats, ApiResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fallback stats untuk demo
const fallbackStats: DashboardStats = {
  pasienHariIni: 3,
  totalAntrian: 5,
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useSWR<ApiResponse<DashboardStats>>(
    '/api/admin/dashboard',
    fetcher,
    { refreshInterval: 30000 }
  );

  const stats = data?.success ? data.data : fallbackStats;

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pasien Hari Ini */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pasien Hari Ini</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.pasienHariIni || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Pasien terdaftar hari ini</p>
            </CardContent>
          </Card>

          {/* Total Antrian */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Antrian</CardTitle>
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalAntrian || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Reservasi hari ini</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-secondary/30">
        <CardContent className="py-6">
          <h3 className="font-semibold text-foreground mb-2">Selamat Datang di Panel Admin</h3>
          <p className="text-sm text-muted-foreground">
            Gunakan menu di samping untuk mengelola data reservasi pasien atau mengubah pengaturan akun Anda.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
