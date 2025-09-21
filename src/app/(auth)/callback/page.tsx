// src/app/auth/callback/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                router.push('/?error=oauth_failed');
                return;
            }

            if (code && state) {
                try {
                    // Exchange code for token with your backend
                    const response = await fetch(`${API_BASE_URL}/api/v1/oauth/google/callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code, state }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('token', data.access_token);
                        router.push('/'); // Redirect to home after successful auth
                    } else {
                        console.error('OAuth callback failed');
                        router.push('/?error=oauth_failed');
                    }
                } catch (err) {
                    console.error('OAuth callback error:', err);
                    router.push('/?error=oauth_failed');
                }
            } else {
                // No code/state, redirect to home
                router.push('/');
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
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <OAuthCallbackContent />
        </Suspense>
    );
}