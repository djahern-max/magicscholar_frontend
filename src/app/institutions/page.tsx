// src/app/institutions/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StateFilteredSearch from '@/components/search/StateFilteredSearch';

function InstitutionsContent() {
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

export default function InstitutionsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-3 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <InstitutionsContent />
        </Suspense>
    );
}