import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fandora — Digital Health Technology & Health IT',
  description: 'Fandora membantu rumah sakit, klinik, puskesmas, dan organisasi kesehatan membangun solusi digital yang lebih terhubung, efisien, dan manusiawi.',
  generator: 'Fandora',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#07151d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
