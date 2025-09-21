// src/app/auth/callback/page.tsx - Updated
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                router.push('/?error=oauth_failed');
                return;
            }

            if (token) {
                // Store the token and redirect
                localStorage.setItem('token', token);
                router.push('/'); // Redirect to home after successful auth
            } else {
                // No token, probably an error
                router.push('/?error=oauth_failed');
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthCallbackContent />
        </Suspense>
    );
}