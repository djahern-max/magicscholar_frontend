// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
    Clock,
    Send,
    Sparkles,
    ArrowRight,
    AlertCircle,
    Target,
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
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
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
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const s = stats?.scholarships;
    const c = stats?.colleges;
    const totalApplications = (c?.total ?? 0) + (s?.total ?? 0);
    const totalInProgress = (c?.in_progress ?? 0) + (s?.in_progress ?? 0);
    const totalSubmitted = (c?.submitted ?? 0) + (s?.submitted ?? 0);
    const totalAccepted = (c?.accepted ?? 0) + (s?.accepted ?? 0);
    const progressPercentage = totalApplications > 0
        ? Math.round(((totalSubmitted + totalAccepted) / totalApplications) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Add Profile Card at top */}
                <div className="mb-6">
                    <UserProfileCard variant="compact" />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Your Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Track your journey to college and scholarships
                    </p>
                </div>

                {/* Overall Progress Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
                        </div>
                        <span className="text-3xl font-bold text-blue-600">{progressPercentage}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem
                            icon={<Target className="h-5 w-5 text-gray-600" />}
                            label="Total Tracked"
                            value={totalApplications}
                        />
                        <StatItem
                            icon={<Clock className="h-5 w-5 text-orange-600" />}
                            label="In Progress"
                            value={totalInProgress}
                        />
                        <StatItem
                            icon={<Send className="h-5 w-5 text-blue-600" />}
                            label="Submitted"
                            value={totalSubmitted}
                        />
                        <StatItem
                            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                            label="Accepted"
                            value={totalAccepted}
                        />
                    </div>
                </div>

                {/* Main Dashboard Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Scholarships Panel */}
                    <DashboardPanel
                        icon={<Award className="h-8 w-8" />}
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
                        icon={<GraduationCap className="h-8 w-8" />}
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

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <QuickActionCard
                            title="Update Profile"
                            description="Keep your info current"
                            onClick={() => router.push('/profile/edit')}
                            iconBg="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <QuickActionCard
                            title="Find Scholarships"
                            description="Discover new opportunities"
                            onClick={() => router.push('/scholarships')}
                            iconBg="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <QuickActionCard
                            title="Browse Colleges"
                            description="Explore your options"
                            onClick={() => router.push('/institutions')}
                            iconBg="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                    </div>
                </div>

                {/* Empty State */}
                {totalApplications === 0 && (
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center border border-blue-200">
                        <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Start Your Journey
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            You haven't started tracking any applications yet. Browse colleges and scholarships to get started!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push('/scholarships')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Find Scholarships
                            </button>
                            <button
                                onClick={() => router.push('/institutions')}
                                className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                            >
                                Browse Colleges
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Component: StatItem
interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
    return (
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            <span className="text-sm text-gray-600 text-center">{label}</span>
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
            bg: 'from-blue-500 to-blue-600',
            light: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            hover: 'hover:bg-blue-700',
        },
        indigo: {
            bg: 'from-indigo-500 to-indigo-600',
            light: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-indigo-200',
            hover: 'hover:bg-indigo-700',
        },
    };

    const color = colors[accentColor];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${color.bg} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                    {icon}
                    <div>
                        <h3 className="text-2xl font-bold">{title}</h3>
                        <p className="text-blue-100 text-sm">{subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${color.light} rounded-lg p-4 border ${color.border}`}>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {summary?.total ?? 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Tracked</div>
                    </div>
                    <div className={`${color.light} rounded-lg p-4 border ${color.border}`}>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {summary?.accepted ?? 0}
                        </div>
                        <div className="text-sm text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {summary?.in_progress ?? 0}
                        </div>
                        <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {summary?.submitted ?? 0}
                        </div>
                        <div className="text-sm text-gray-600">Submitted</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={primaryAction}
                        className={`w-full py-3 px-4 bg-gradient-to-r ${color.bg} text-white rounded-lg ${color.hover} transition-colors font-medium flex items-center justify-center gap-2`}
                    >
                        {primaryLabel}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={secondaryAction}
                        className={`w-full py-3 px-4 ${color.text} border-2 ${color.border} rounded-lg hover:${color.light} transition-colors font-medium`}
                    >
                        {secondaryLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Component: QuickActionCard
interface QuickActionCardProps {
    title: string;
    description: string;
    onClick: () => void;
    iconBg: string;
    iconColor: string;
}

function QuickActionCard({ title, description, onClick, iconBg, iconColor }: QuickActionCardProps) {
    return (
        <button
            onClick={onClick}
            className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
        >
            <div className={`${iconBg} ${iconColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <ArrowRight className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
}