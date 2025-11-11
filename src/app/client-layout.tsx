// src/app/client-layout.tsx
'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/header';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  );
}