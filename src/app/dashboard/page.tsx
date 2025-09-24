// src/app/dashboard/page.tsx - Simplified Skool-style dashboard
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();

                    // Try to fetch profile data
                    try {
                        const profileResponse = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (profileResponse.ok) {
                            const profileData = await profileResponse.json();
                            userData.profile = profileData;
                        }
                    } catch (profileError) {
                        // No profile yet
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const hasProfile = user.profile?.profile_completed ?? false;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <User size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user.first_name ? `Hi, ${user.first_name}` : `Hi, ${user.username}`}
                                </h1>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => router.push('/profile/setup')}
                                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <Settings size={20} className="mr-1" />
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={20} className="mr-1" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Setup Prompt (if not completed) */}
                {!hasProfile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-blue-900 mb-2">
                                    Complete Your Profile
                                </h3>
                                <p className="text-blue-800 mb-4">
                                    Set up your profile to get personalized school and scholarship recommendations.
                                </p>
                                <button
                                    onClick={() => router.push('/profile/setup')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Set Up Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Actions */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            What would you like to explore?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Schools Card */}
                            <div
                                onClick={() => router.push('/')}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-2xl">🏔️</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Discover Schools
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Browse and compare universities in New Hampshire and Massachusetts.
                                </p>
                                <div className="text-blue-600 font-medium text-sm">
                                    Explore schools →
                                </div>
                            </div>

                            {/* Scholarships Card */}
                            <div
                                onClick={() => router.push('/scholarships')}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-2xl">🎓</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Find Scholarships
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Search for scholarship opportunities from leading organizations.
                                </p>
                                <div className="text-blue-600 font-medium text-sm">
                                    Browse scholarships →
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Account
                        </h2>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Profile</h4>
                                        <p className="text-sm text-gray-600">
                                            {hasProfile ? 'Profile completed' : 'Complete your profile for better recommendations'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/profile/setup')}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        {hasProfile ? 'Edit' : 'Complete'}
                                    </button>
                                </div>

                                <hr className="border-gray-200" />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Email</h4>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Account</h4>
                                        <p className="text-sm text-gray-600">
                                            Member since {new Date(user.created_at || '').getFullYear() || 'recently'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}