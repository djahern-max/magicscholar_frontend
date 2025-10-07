// src/app/page.tsx
'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import StateFilterSearch from '@/components/search/StateFilteredSearch';

function HomeContent() {
  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <StateFilterSearch />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}