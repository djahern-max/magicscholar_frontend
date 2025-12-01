// src/app/institutions/page.tsx

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StateFilteredSearch from '@/components/search/StateFilteredSearch';

function SchoolsContent() {
    const searchParams = useSearchParams();
    const stateParam = searchParams.get('state') || undefined;

    return (
        <div className="min-h-screen bg-gray-50">
            <StateFilteredSearch initialState={stateParam} />
        </div>
    );
}

export default function SchoolsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading schools...</p>
                    </div>
                </div>
            </div>
        }>
            <SchoolsContent />
        </Suspense>
    );
}