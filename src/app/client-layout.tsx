// src/app/client-layout.tsx
'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import { SettingsProvider } from '@/contexts/SettingsContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SettingsProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
    </SettingsProvider>
  );
}