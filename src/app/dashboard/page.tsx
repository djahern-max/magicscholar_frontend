// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    GraduationCap,
    AlertCircle,
    TrendingUp,
    CheckCircle,
    Clock,
    Send,
} from 'lucide-react';
import axios from 'axios';
import UserProfileCard from '@/components/profile/UserProfileCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Summary {
    total: number;
    in_progress: number;
    submitted: number;
    accepted: number;
}

interface DashboardStats {
    scholarships: Summary;
    colleges: Summary;
}

export default function DashboardHub() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [authMissing, setAuthMissing] = useState(false);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            setAuthMissing(true);
            setLoading(false);
            return;
        }

        try {
            const [scholarshipRes, collegeRes] = await Promise.all([
                axios
                    .get(`${API_BASE_URL}/api/v1/scholarship-tracking/dashboard`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .catch(() => ({ data: { summary: { total: 0, in_progress: 0, submitted: 0, accepted: 0 } } })),
                axios
                    .get(`${API_BASE_URL}/api/v1/college-tracking/dashboard`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .catch(() => ({ data: { summary: { total: 0, in_progress: 0, submitted: 0, accepted: 0 } } })),
            ]);

            setStats({
                scholarships: scholarshipRes.data.summary,
                colleges: collegeRes.data.summary,
            });
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authMissing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to continue</h2>
                    <p className="text-gray-600 mb-6">
                        You need to be signed in to view your dashboard
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

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

    const s = stats?.scholarships;
    const c = stats?.colleges;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Track your college applications and scholarship progress</p>
                </div>

                {/* Profile Card */}
                <div className="mb-6">
                    <UserProfileCard variant="compact" />
                </div>

                {/* Scholarships Section */}
                <div className="mt-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <Award className="h-6 w-6 text-yellow-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Scholarships
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Track your scholarship applications and funding opportunities
                        </p>

                        <div className="space-y-3">
                            {/* Total Tracked */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Total Tracked
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Scholarships you're monitoring
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {s?.total ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Accepted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Accepted
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Scholarships you've won
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            {s?.accepted ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-cyan-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                In Progress
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Applications you're working on
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-cyan-600">
                                            {s?.in_progress ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Send className="h-5 w-5 text-purple-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Submitted
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Waiting for responses
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {s?.submitted ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => router.push('/scholarships')}
                                className="flex-1 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            >
                                Browse More Scholarships
                            </button>
                            <button
                                onClick={() => router.push('/scholarships/dashboard')}
                                className="flex-1 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Manage Scholarships
                            </button>
                        </div>
                    </div>
                </div>

                {/* College Applications Section */}
                <div className="mt-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <GraduationCap className="h-6 w-6 text-indigo-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">
                                College Applications
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Monitor your college application journey and decisions
                        </p>

                        <div className="space-y-3">
                            {/* Total Tracked */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Total Tracked
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Colleges you're considering
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-orange-500">
                                            {c?.total ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Accepted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Accepted
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Admission offers received
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            {c?.accepted ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-red-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                In Progress
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Applications being completed
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-red-600">
                                            {c?.in_progress ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Send className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">
                                                Submitted
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Awaiting admission decisions
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {c?.submitted ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => router.push('/institutions')}
                                className="flex-1 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                            >
                                Explore Colleges
                            </button>
                            <button
                                onClick={() => router.push('/colleges/dashboard')}
                                className="flex-1 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg transition-colors"
                            >
                                Manage Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}