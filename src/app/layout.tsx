
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/app/Footer';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400', // Specify a common weight
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: '400', // Specify a common weight
});

export const metadata: Metadata = {
  title: 'Customer Support Ticket Manager',
  description: 'Manage your customer support tickets efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable,
          robotoMono.variable
        )}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto max-w-7xl px-4 py-8 md:px-6">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
