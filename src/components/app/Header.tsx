
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, LogIn, LogOut, UserPlus, ShieldCheck, Ticket, Settings, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Ticket className="h-6 w-6 text-accent" />
            <span>Support Tickets</span>
          </Link>
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-accent transition-colors">
          <Ticket className="h-6 w-6 text-accent" />
          <span className="hidden sm:inline">Customer Support</span>
          <span className="sm:hidden">Support</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
              {user.role === 'customer' && (
                <Button variant="default" size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/tickets/new" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" /> New Ticket
                  </Link>
                </Button>
              )}
              {user.role === 'admin' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Admin Panel
                  </Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground hidden md:inline">Welcome, {user.name}!</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/auth/reset-password"className="flex items-center gap-1"> {/* Typically register, but using reset for demo */}
                   Reset Password
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
