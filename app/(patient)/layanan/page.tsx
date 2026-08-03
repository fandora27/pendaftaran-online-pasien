'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Stethoscope, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { Poli, ApiResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const iconMap: Record<string, React.ReactNode> = {
  'Poli Umum': <Stethoscope className="h-8 w-8" />,
  'KIA': <Baby className="h-8 w-8" />,
};

// Data fallback jika API belum tersedia
const fallbackPoli: Poli[] = [
  {
    id: 1,
    nama_poli: 'Poli Umum',
    deskripsi: 'Layanan pemeriksaan kesehatan umum meliputi pengukuran tekanan darah, suhu tubuh, berat badan, dan konsultasi kesehatan dasar.',
    aktif: true,
  },
  {
    id: 2,
    nama_poli: 'KIA',
    deskripsi: 'Layanan Kesehatan Ibu dan Anak meliputi pemeriksaan kehamilan, persalinan, pasca persalinan, imunisasi, dan tumbuh kembang anak.',
    aktif: true,
  },
];

export default function LayananPage() {
  const { data, isLoading } = useSWR<ApiResponse<Poli[]>>('/api/poli', fetcher);

  const poliList = data?.success ? data.data : fallbackPoli;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Jenis Pemeriksaan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            PMB Griya Bunda menyediakan berbagai layanan kesehatan ibu dan anak dengan 
            pelayanan profesional dan terpercaya.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && poliList && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {poliList.map((poli) => (
              <Card key={poli.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    {iconMap[poli.nama_poli] || <Stethoscope className="h-8 w-8" />}
                  </div>
                  <CardTitle className="text-xl">{poli.nama_poli}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base">
                    {poli.deskripsi}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={`/daftar?poli=${encodeURIComponent(poli.nama_poli)}`} className="w-full">
                    <Button className="w-full">Daftar Sekarang</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Info Tambahan */}
        <div className="mt-12 bg-secondary/50 rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Informasi Penting</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              Silahkan daftar online untuk mendapatkan nomor antrian
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              Bawa kartu identitas (KTP/KK) saat berkunjung
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              Untuk kehamilan, bawa buku KIA jika sudah memiliki
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}
