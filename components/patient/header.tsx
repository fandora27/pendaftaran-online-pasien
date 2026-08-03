'use client';

import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PatientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">PMB Griya Bunda</h1>
              <p className="text-xs opacity-80">Gondanglegi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:underline underline-offset-4">
              Beranda
            </Link>
            <Link href="/layanan" className="hover:underline underline-offset-4">
              Jenis Pemeriksaan
            </Link>
            <Link href="/daftar" className="hover:underline underline-offset-4">
              Pendaftaran Online
            </Link>
            <Link href="/admin/login">
              <Button variant="secondary" size="sm">
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link
              href="/"
              className="block py-2 px-4 rounded hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/layanan"
              className="block py-2 px-4 rounded hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Jenis Pemeriksaan
            </Link>
            <Link
              href="/daftar"
              className="block py-2 px-4 rounded hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Pendaftaran Online
            </Link>
            <Link
              href="/admin/login"
              className="block py-2 px-4 rounded hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
