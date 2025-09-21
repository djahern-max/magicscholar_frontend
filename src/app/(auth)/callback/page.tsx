// src/app/(auth)/callback/page.tsx - Enhanced with profile setup flow
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function OAuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');
            const isNewUser = searchParams.get('new_user') === 'true';

            if (error) {
                console.error('OAuth error:', error);
                router.push('/?error=oauth_failed');
                return;
            }

            if (token) {
                console.log('OAuth callback received token:', token.substring(0, 20) + '...');
                console.log('Is new user:', isNewUser);

                // Store the token
                localStorage.setItem('token', token);

                try {
                    // Verify the token and get user info
                    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        console.log('User data received:', userData);

                        // Check if user needs profile setup
                        const needsProfileSetup = isNewUser || !userData.profile_completed;

                        if (needsProfileSetup) {
                            console.log('Redirecting to profile setup...');
                            router.push('/profile/setup');
                        } else {
                            console.log('Redirecting to dashboard...');
                            router.push('/dashboard');
                        }
                    } else {
                        console.error('Failed to fetch user data:', response.status);
                        // Token might be invalid, redirect to home
                        router.push('/');
                    }
                } catch (err) {
                    console.error('Error verifying token:', err);
                    router.push('/');
                }
            } else {
                console.error('No token received in OAuth callback');
                router.push('/?error=oauth_failed');
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing sign in...</p>
                <p className="mt-2 text-sm text-gray-500">Please wait while we set up your account</p>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-pulse">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto"></div>
                        <div className="mt-4 h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                    </div>
                </div>
            </div>
        }>
            <OAuthCallbackContent />
        </Suspense>
    );
}