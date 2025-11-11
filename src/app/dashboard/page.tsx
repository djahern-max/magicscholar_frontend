// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Award, GraduationCap } from 'lucide-react';
import UserProfileCard from '@/components/profile/UserProfileCard';

export default function DashboardHub() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Track your college applications and scholarship progress</p>
                </div>

                {/* Profile Card */}
                <div className="mb-8">
                    <UserProfileCard variant="compact" />
                </div>

                {/* Dashboard Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scholarships Dashboard */}
                    <button
                        onClick={() => router.push('/scholarships/dashboard')}
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 text-left group border-2 border-transparent hover:border-blue-200"
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Award className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Scholarship Tracker
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Track your scholarship applications and funding opportunities
                        </p>
                        <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                            <span>Manage Scholarships</span>
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>

                    {/* College Applications Dashboard */}
                    <button
                        onClick={() => router.push('/colleges/dashboard')}
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 text-left group border-2 border-transparent hover:border-indigo-200"
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <GraduationCap className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            College Applications
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Monitor your college application journey and admissions decisions
                        </p>
                        <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                            <span>Manage Applications</span>
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/scholarships')}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors font-medium"
                    >
                        Browse Scholarships
                    </button>
                    <button
                        onClick={() => router.push('/institutions')}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors font-medium"
                    >
                        Explore Colleges
                    </button>
                </div>
            </div>
        </div>
    );
}