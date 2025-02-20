import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import './globals.css';
import type React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SSO Dashboard',
  description: 'Single Sign-On für Jedermann!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
