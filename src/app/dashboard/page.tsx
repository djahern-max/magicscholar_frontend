// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    GraduationCap,
    MapPin,
    BookOpen,
    Award,
    Search,
    Settings,
    TrendingUp,
    Clock,
    Star,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UserProfile {
    id: number;
    user_id: number;
    gpa: number;
    graduation_year: number;
    intended_major: string;
    academic_interests: string[];
    preferred_states: string[];
    profile_completed: boolean;
    completion_percentage: number;
    // Add other fields as needed
}

interface UserData {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const initializeDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                // Fetch user data
                const userResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await userResponse.json();
                setUser(userData);

                // Fetch profile data
                const profileResponse = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setProfile(profileData);
                } else if (profileResponse.status === 404) {
                    // No profile found - redirect to setup
                    router.push('/profile/setup');
                    return;
                } else {
                    console.error('Error fetching profile:', profileResponse.status);
                }

            } catch (err) {
                console.error('Dashboard initialization error:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, [router]);

    const handleFindSchools = () => {
        // For now, navigate to main schools page with user context
        // Later this will be enhanced with matching algorithm
        router.push('/?from=dashboard');
    };

    const handleFindScholarships = () => {
        // Navigate to scholarships page
        router.push('/scholarships?from=dashboard');
    };

    const handleEditProfile = () => {
        router.push('/profile/setup');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const displayName = user.first_name || user.username || 'Student';
    const currentYear = new Date().getFullYear();
    const yearsUntilGraduation = profile?.graduation_year ? profile.graduation_year - currentYear : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {displayName}!
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Your personalized college and scholarship dashboard
                            </p>
                        </div>
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                            <Settings className="w-4 h-4 mr-1" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Summary Card */}
                {profile && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {profile.completion_percentage}% complete
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">GPA</p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.gpa ? profile.gpa.toFixed(2) : 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Major</p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.intended_major || 'Undecided'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Graduation</p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.graduation_year} {yearsUntilGraduation > 0 ? `(${yearsUntilGraduation} years)` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Find Schools Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <Search className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Find Schools</h3>
                                <p className="text-sm text-gray-500">Discover colleges that match your profile</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                GPA-based matching (coming soon)
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                Programs matching your interests
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                Location preferences
                            </div>
                        </div>

                        <button
                            onClick={handleFindSchools}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            Explore Schools
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* Find Scholarships Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <Award className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Find Scholarships</h3>
                                <p className="text-sm text-gray-500">Search for scholarships you qualify for</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Academic merit scholarships
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Major-specific opportunities
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Local and national awards
                            </div>
                        </div>

                        <button
                            onClick={handleFindScholarships}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            Browse Scholarships
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Quick Stats/Coming Soon Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">Smart Matching</h4>
                            <p className="text-sm text-gray-500">AI-powered school and scholarship recommendations</p>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">Application Tracking</h4>
                            <p className="text-sm text-gray-500">Keep track of your applications and deadlines</p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">Scholarship Calendar</h4>
                            <p className="text-sm text-gray-500">Never miss a scholarship deadline again</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}