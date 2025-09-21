// src/app/client-layout.tsx - Fixed version
'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/header';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Remove the login/register handlers since Header now handles auth internally

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}