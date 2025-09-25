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
                router.push(`/?error=oauth_failed&detail=${encodeURIComponent(error)}`);
                return;
            }

            if (token) {
                console.log('OAuth callback received token:', token.substring(0, 20) + '...');
                console.log('Is new user:', isNewUser);

                // Store the token
                localStorage.setItem('token', token);

                try {
                    // Create AbortController for timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    // Verify the token and get user info
                    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const userData = await response.json();
                        console.log('User data received:', userData);

                        // Check if user needs profile setup
                        const needsProfileSetup = isNewUser || !userData.profile_completed;

                        if (needsProfileSetup) {
                            console.log('Redirecting to profile setup...');
                            router.push('/profile/setup');
                        } else {
                            console.log('Redirecting to home page...');
                            router.push('/');
                        }
                    } else {
                        console.error('Failed to fetch user data:', response.status, response.statusText);

                        // Clean up invalid token
                        localStorage.removeItem('token');

                        // Redirect with more specific error
                        if (response.status === 401) {
                            router.push('/?error=invalid_token');
                        } else {
                            router.push(`/?error=auth_failed&status=${response.status}`);
                        }
                    }
                } catch (err) {
                    console.error('Error verifying token:', err);

                    // Clean up token on error
                    localStorage.removeItem('token');

                    // Handle different error types
                    if (err instanceof Error) {
                        if (err.name === 'AbortError') {
                            console.error('Token verification timed out');
                            router.push('/?error=timeout');
                        } else if (err.message.includes('NetworkError') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
                            console.error('Network error during token verification');
                            router.push('/?error=network_error');
                        } else {
                            router.push(`/?error=verification_failed&detail=${encodeURIComponent(err.message)}`);
                        }
                    } else {
                        // Handle non-Error objects
                        console.error('Unknown error type:', typeof err, err);
                        router.push('/?error=unknown_error');
                    }
                } // <- This closing brace was missing
            } else {
                console.error('No token received in OAuth callback');
                router.push('/?error=missing_token');
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