// src/app/dashboard/page.tsx - Fixed with proper types
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Updated user interface to match your backend
interface UserData {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at?: string;
    profile?: {
        profile_completed: boolean;
        completion_percentage: number;
        profile_tier: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        // Fetch user data with profile information
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();

                    // Try to fetch profile data separately if not included
                    try {
                        const profileResponse = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (profileResponse.ok) {
                            const profileData = await profileResponse.json();
                            userData.profile = profileData;
                        }
                    } catch (profileError) {
                        console.log('No profile data available yet');
                        // Profile doesn't exist yet, which is fine for new users
                        userData.profile = {
                            profile_completed: false,
                            completion_percentage: 0,
                            profile_tier: 'BASIC'
                        };
                    }

                    setUser(userData);
                } else {
                    localStorage.removeItem('token');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    // Helper function to safely check profile completion
    const isProfileCompleted = user.profile?.profile_completed ?? false;
    const completionPercentage = user.profile?.completion_percentage ?? 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.first_name || user.username}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Here's your scholarship dashboard
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Completion Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Profile</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {isProfileCompleted ? 'Complete' : `${completionPercentage}% Complete`}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        {!isProfileCompleted && (
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <button
                                        onClick={() => router.push('/profile/setup')}
                                        className="font-medium text-blue-700 hover:text-blue-900"
                                    >
                                        Complete your profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scholarships Found Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Scholarships Found</dt>
                                        <dd className="text-lg font-medium text-gray-900">0</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <button
                                    onClick={() => router.push('/scholarships')}
                                    className="font-medium text-blue-700 hover:text-blue-900"
                                >
                                    Browse scholarships
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Applications Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                                        <dd className="text-lg font-medium text-gray-900">0</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="font-medium text-gray-500">No applications yet</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Progress Bar (if incomplete) */}
                {!isProfileCompleted && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Profile Completion</h3>
                            <span className="text-sm font-medium text-gray-500">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Complete your profile to get personalized scholarship recommendations.
                        </p>
                        <button
                            onClick={() => router.push('/profile/setup')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Profile Setup
                        </button>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => router.push('/profile/setup')}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                        >
                            <div className="text-sm font-medium text-gray-900">Complete Profile</div>
                            <div className="text-xs text-gray-500 mt-1">Get personalized matches</div>
                        </button>

                        <button
                            onClick={() => router.push('/scholarships')}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                        >
                            <div className="text-sm font-medium text-gray-900">Browse Scholarships</div>
                            <div className="text-xs text-gray-500 mt-1">Explore opportunities</div>
                        </button>

                        <button
                            onClick={() => router.push('/institution')}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                        >
                            <div className="text-sm font-medium text-gray-900">Find Institutions</div>
                            <div className="text-xs text-gray-500 mt-1">Research schools</div>
                        </button>

                        <button
                            onClick={() => router.push('/profile')}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                        >
                            <div className="text-sm font-medium text-gray-900">Edit Profile</div>
                            <div className="text-xs text-gray-500 mt-1">Update your information</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}