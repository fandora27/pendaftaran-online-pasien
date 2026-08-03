'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, LayoutDashboard, CalendarCheck, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Data Reservasi', href: '/admin/reservasi', icon: CalendarCheck },
  { name: 'Pengaturan Beranda', href: '/admin/pengaturan-beranda', icon: Settings },
  { name: 'Pengaturan Akun', href: '/admin/pengaturan', icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="font-bold">PMB Admin</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border">
              <Heart className="h-8 w-8" />
              <div>
                <h1 className="font-bold text-lg">PMB Griya Bunda</h1>
                <p className="text-xs opacity-80">Admin Panel</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground">
              <div className="flex items-center gap-2 h-14 px-4 border-b border-sidebar-border">
                <Heart className="h-6 w-6" />
                <span className="font-bold">PMB Admin</span>
              </div>

              <nav className="px-3 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'hover:bg-sidebar-accent/50'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
