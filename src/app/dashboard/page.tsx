// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    GraduationCap,
    ArrowRight,
    AlertCircle,
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="max-w-4xl w-full mx-auto px-4">
                {/* Profile Card */}
                <div className="mb-8">
                    <UserProfileCard variant="compact" />
                </div>

                {/* Main Dashboard Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scholarships Panel */}
                    <DashboardPanel
                        icon={<Award className="h-6 w-6" />}
                        title="Scholarships"
                        subtitle="Fund your education"
                        summary={s}
                        primaryLabel="Manage Scholarships"
                        primaryAction={() => router.push('/scholarships/dashboard')}
                        secondaryLabel="Browse More"
                        secondaryAction={() => router.push('/scholarships')}
                        accentColor="blue"
                    />

                    {/* Colleges Panel */}
                    <DashboardPanel
                        icon={<GraduationCap className="h-6 w-6" />}
                        title="College Applications"
                        subtitle="Your future awaits"
                        summary={c}
                        primaryLabel="Manage Applications"
                        primaryAction={() => router.push('/colleges/dashboard')}
                        secondaryLabel="Explore Colleges"
                        secondaryAction={() => router.push('/institutions')}
                        accentColor="indigo"
                    />
                </div>
            </div>
        </div>
    );
}

// Component: DashboardPanel
interface DashboardPanelProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    summary: Summary | undefined;
    primaryLabel: string;
    primaryAction: () => void;
    secondaryLabel: string;
    secondaryAction: () => void;
    accentColor: 'blue' | 'indigo';
}

function DashboardPanel({
    icon,
    title,
    subtitle,
    summary,
    primaryLabel,
    primaryAction,
    secondaryLabel,
    secondaryAction,
    accentColor,
}: DashboardPanelProps) {
    const colors = {
        blue: {
            border: 'border-blue-200',
            iconBg: 'bg-blue-50',
            iconText: 'text-blue-600',
            accentText: 'text-blue-600',
            primaryBg: 'bg-blue-600',
            primaryHover: 'hover:bg-blue-700',
            secondaryBorder: 'border-blue-600',
            secondaryText: 'text-blue-600',
            secondaryHover: 'hover:bg-blue-50',
        },
        indigo: {
            border: 'border-indigo-200',
            iconBg: 'bg-indigo-50',
            iconText: 'text-indigo-600',
            accentText: 'text-indigo-600',
            primaryBg: 'bg-indigo-600',
            primaryHover: 'hover:bg-indigo-700',
            secondaryBorder: 'border-indigo-600',
            secondaryText: 'text-indigo-600',
            secondaryHover: 'hover:bg-indigo-50',
        },
    };

    const color = colors[accentColor];

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`${color.iconBg} p-2 rounded-lg`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {summary?.total ?? 0}
                        </div>
                        <div className="text-xs text-gray-600">Total Tracked</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {summary?.accepted ?? 0}
                        </div>
                        <div className="text-xs text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xl font-bold text-gray-900 mb-1">
                            {summary?.in_progress ?? 0}
                        </div>
                        <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xl font-bold text-gray-900 mb-1">
                            {summary?.submitted ?? 0}
                        </div>
                        <div className="text-xs text-gray-600">Submitted</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={primaryAction}
                        className={`w-full py-2.5 px-4 ${color.primaryBg} text-white rounded-lg ${color.primaryHover} transition-colors font-medium text-sm flex items-center justify-center gap-2`}
                    >
                        {primaryLabel}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={secondaryAction}
                        className={`w-full py-2.5 px-4 ${color.secondaryText} border-2 ${color.secondaryBorder} rounded-lg ${color.secondaryHover} transition-colors font-medium text-sm`}
                    >
                        {secondaryLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}