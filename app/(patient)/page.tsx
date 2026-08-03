'use client';

import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { Heart, Calendar, Stethoscope, Users, Baby, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { BerandaSettings, ApiResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data, error, isLoading } = useSWR<ApiResponse<BerandaSettings>>('/api/settings', fetcher);

  const settings = data?.data || {
    logo_url: '',
    hero_title: 'Selamat Datang di PMB Griya Bunda Gondanglegi',
    hero_subtitle: 'Praktik Mandiri Bidan dengan layanan profesional dan terpercaya untuk kesehatan ibu dan anak. Kami siap melayani dengan sepenuh hati.',
    about_title: 'Mengapa Memilih Kami?',
    about_description: 'Kami memberikan pelayanan kesehatan profesional yang didedikasikan untuk kenyamanan dan kesehatan Anda beserta buah hati.'
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Premium Gradient & Glassmorphism */}
      <section className="relative flex items-center justify-center min-h-[85vh] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        {/* Background decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] mix-blend-multiply opacity-70 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply opacity-50" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
            
            {/* Logo Display */}
            <div className="mb-8 relative transition-transform duration-500 hover:scale-105">
              {settings.logo_url ? (
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/80 backdrop-blur-md shadow-2xl p-4 border border-white/50 flex items-center justify-center">
                  <Image 
                    src={settings.logo_url} 
                    alt="Logo PMB" 
                    fill 
                    className="object-contain p-4 rounded-full drop-shadow-md"
                    priority
                  />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 shadow-xl border border-white/60 backdrop-blur-md">
                  <Heart className="h-12 w-12 md:h-16 md:w-16 text-primary drop-shadow-sm" />
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 text-balance tracking-tight drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-accent">
                {settings.hero_title.split(' ').slice(0, 2).join(' ')}
              </span>{' '}
              {settings.hero_title.split(' ').slice(2).join(' ')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl font-medium leading-relaxed">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <Link href="/daftar" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-md h-14 px-8 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
                  <Calendar className="h-5 w-5" />
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/layanan" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-md h-14 px-8 rounded-full border-primary/20 hover:bg-primary/5 transition-all hover:-translate-y-1">
                  <Stethoscope className="h-5 w-5" />
                  Lihat Layanan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section (Glassmorphism Cards) */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {settings.about_title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {settings.about_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-primary/10 bg-card/40 backdrop-blur-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Bidan Berpengalaman</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Dilayani oleh bidan profesional dengan pengalaman lebih dari 9 tahun dalam bidang kebidanan dengan pendekatan yang ramah.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-primary/10 bg-card/40 backdrop-blur-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Baby className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Layanan Fokus</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Menyediakan layanan komprehensif yang secara khusus berfokus pada <strong className="text-primary/80">Poli Umum</strong> dan <strong className="text-primary/80">Poli KIA</strong> (Kesehatan Ibu dan Anak).
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-primary/10 bg-card/40 backdrop-blur-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Fasilitas Nyaman</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Ruangan bersih, nyaman, privasi terjamin, dan dilengkapi peralatan medis modern untuk kenyamanan Anda dan keluarga.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
            
            <CardContent className="py-12 md:py-16 text-center relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Mulai Konsultasi Anda Hari Ini</h2>
              <p className="mb-8 text-lg opacity-90 max-w-xl mx-auto">
                Daftarkan diri Anda sekarang melalui sistem online kami untuk mendapatkan nomor antrian tanpa perlu menunggu lama di lokasi.
              </p>
              <Link href="/daftar">
                <Button size="lg" variant="secondary" className="gap-2 rounded-full h-14 px-8 text-md font-semibold hover:scale-105 transition-transform shadow-lg">
                  <span>Pendaftaran Online</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
