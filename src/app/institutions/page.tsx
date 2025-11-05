// src/app/institutions/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import StateFilteredSearch from '@/components/search/StateFilteredSearch';

export default function InstitutionsPage() {
    const searchParams = useSearchParams();
    const stateParam = searchParams.get('state') || undefined;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <StateFilteredSearch initialState={stateParam} />
            </div>
        </div>
    );
}