'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthError() {
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