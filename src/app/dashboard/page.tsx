// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, GraduationCap, TrendingUp, Calendar, DollarSign, BookOpen } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface DashboardStats {
    scholarships: {
        total: number;
        in_progress: number;
        submitted: number;
        accepted: number;
    };
    colleges: {
        total: number;
        in_progress: number;
        submitted: number;
        accepted: number;
    };
}

export default function DashboardHub() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            // Load both dashboard stats in parallel
            const [scholarshipRes, collegeRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/v1/scholarship-tracking/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { summary: { total: 0, in_progress: 0, submitted: 0, accepted: 0 } } })),
                axios.get(`${API_BASE_URL}/api/v1/college-tracking/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { summary: { total: 0, in_progress: 0, submitted: 0, accepted: 0 } } }))
            ]);

            setStats({
                scholarships: scholarshipRes.data.summary,
                colleges: collegeRes.data.summary
            });
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Track your college applications and scholarship opportunities</p>
                </div>

                {/* Quick Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(stats?.colleges.total || 0) + (stats?.scholarships.total || 0)}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(stats?.colleges.in_progress || 0) + (stats?.scholarships.in_progress || 0)}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(stats?.colleges.submitted || 0) + (stats?.scholarships.submitted || 0)}
                                </p>
                            </div>
                            <BookOpen className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Accepted</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(stats?.colleges.accepted || 0) + (stats?.scholarships.accepted || 0)}
                                </p>
                            </div>
                            <GraduationCap className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scholarships Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Scholarships</h2>
                                    <p className="text-yellow-50">Track and manage scholarship applications</p>
                                </div>
                                <Award className="h-12 w-12 text-white opacity-80" />
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Scholarship Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{stats?.scholarships.total || 0}</p>
                                    <p className="text-sm text-gray-600">Total Saved</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">{stats?.scholarships.in_progress || 0}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{stats?.scholarships.submitted || 0}</p>
                                    <p className="text-sm text-gray-600">Submitted</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{stats?.scholarships.accepted || 0}</p>
                                    <p className="text-sm text-gray-600">Accepted</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/scholarships/dashboard')}
                                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                                >
                                    View Scholarship Dashboard
                                </button>
                                <button
                                    onClick={() => router.push('/scholarships')}
                                    className="w-full py-3 border-2 border-yellow-500 text-yellow-600 font-semibold rounded-lg hover:bg-yellow-50 transition-all"
                                >
                                    Browse Scholarships
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Colleges Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">College Applications</h2>
                                    <p className="text-blue-50">Manage your college application process</p>
                                </div>
                                <GraduationCap className="h-12 w-12 text-white opacity-80" />
                            </div>
                        </div>

                        <div className="p-6">
                            {/* College Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{stats?.colleges.total || 0}</p>
                                    <p className="text-sm text-gray-600">Total Saved</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">{stats?.colleges.in_progress || 0}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{stats?.colleges.submitted || 0}</p>
                                    <p className="text-sm text-gray-600">Submitted</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{stats?.colleges.accepted || 0}</p>
                                    <p className="text-sm text-gray-600">Accepted</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/colleges/dashboard')}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                                >
                                    View College Dashboard
                                </button>
                                <button
                                    onClick={() => router.push('/institutions')}
                                    className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
                                >
                                    Search Colleges
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">My Profile</p>
                                <p className="text-sm text-gray-600">Update your information</p>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push('/scholarships')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all"
                        >
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Find Scholarships</p>
                                <p className="text-sm text-gray-600">Discover new opportunities</p>
                            </div>
                        </button>

                        <button
                            onClick={() => router.push('/institutions')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        >
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Search Colleges</p>
                                <p className="text-sm text-gray-600">Explore institutions</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}