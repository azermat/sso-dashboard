'use client';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import type React from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen'>
        <Loader2 className='animate-spin duration-300 w-10 h-10' />
        <p className='animate-pulse pt-3 text-primary/70 duration-1000'>
          Noch etwas Geduld mein Sohn...
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background transition-all duration-500'>
      <Navbar />
      <main className='container mx-auto py-6 px-4'>{children}</main>
    </div>
  );
}
