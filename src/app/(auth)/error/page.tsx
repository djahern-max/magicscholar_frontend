'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get('message') || searchParams.get('error');

    useEffect(() => {
        const timer = setTimeout(() => router.push('/'), 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    Authentication Error
                </h1>
                <p className="text-gray-600 mb-4">
                    {error === 'oauth_failed' && 'OAuth authentication failed. Please try again.'}
                    {error === 'invalid_state' && 'Invalid authentication state. Please try again.'}
                    {!error && 'An authentication error occurred.'}
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default function AuthError() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-pulse">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto"></div>
                        <div className="mt-4 h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                        <div className="mt-2 h-3 bg-gray-300 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}