'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    GraduationCap,
    Target,
    Trophy,
    CheckCircle2,
    Clock,
    Send,
    Zap,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import axios from 'axios';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const s = stats?.scholarships;
    const c = stats?.colleges;
    const totalApplications = (c?.total ?? 0) + (s?.total ?? 0);
    const totalInProgress = (c?.in_progress ?? 0) + (s?.in_progress ?? 0);
    const totalSubmitted = (c?.submitted ?? 0) + (s?.submitted ?? 0);
    const totalAccepted = (c?.accepted ?? 0) + (s?.accepted ?? 0);
    const progressPercentage = totalApplications > 0 ? Math.round(((totalSubmitted + totalAccepted) / totalApplications) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (authMissing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">You’re signed out</h1>
                    <p className="mt-1 text-sm text-gray-600">Please log in to view your progress and manage applications.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Go to Login <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header with Actions (mirror profile style) */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Dashboard</h1>
                        <p className="text-gray-600">Overview of your applications and progress</p>
                    </div>
                    {totalAccepted > 0 && (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-green-800 border border-green-200">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-medium">{totalAccepted} accepted</span>
                        </div>
                    )}
                </div>

                {/* Overall progress card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-900">Overall Progress</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{progressPercentage}%</span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                        <div
                            className="h-2 rounded-full bg-blue-600 transition-[width] duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        {totalSubmitted + totalAccepted} of {totalApplications} applications completed
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
                    <KpiCard icon={<Zap className="h-5 w-5" />} label="Total Applications" value={totalApplications} />
                    <KpiCard icon={<Clock className="h-5 w-5" />} label="In Progress" value={totalInProgress} />
                    <KpiCard icon={<Send className="h-5 w-5" />} label="Submitted" value={totalSubmitted} />
                    <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="Accepted" value={totalAccepted} />
                </div>

                {/* Panels (mirror profile card look) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Panel
                        icon={<Award className="h-6 w-6" />}
                        title="Scholarships"
                        subtitle="Fund your education"
                        summary={s}
                        primaryLabel="Manage Scholarships"
                        primaryAction={() => router.push('/scholarships/dashboard')}
                        secondaryLabel="Browse Scholarships"
                        secondaryAction={() => router.push('/scholarships')}
                        accent="blue"
                    />
                    <Panel
                        icon={<GraduationCap className="h-6 w-6" />}
                        title="Colleges"
                        subtitle="Your future awaits"
                        summary={c}
                        primaryLabel="Manage Applications"
                        primaryAction={() => router.push('/colleges/dashboard')}
                        secondaryLabel="Explore Colleges"
                        secondaryAction={() => router.push('/institutions')}
                        accent="indigo"
                    />
                </div>

                {/* Quick actions matches profile tone */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <QuickAction
                            icon={<Zap className="h-5 w-5" />}
                            title="Update Profile"
                            description="Keep your info current"
                            onClick={() => router.push('/profile')}
                        />
                        <QuickAction
                            icon={<Award className="h-5 w-5" />}
                            title="New Scholarships"
                            description="Find opportunities"
                            onClick={() => router.push('/scholarships')}
                        />
                        <QuickAction
                            icon={<GraduationCap className="h-5 w-5" />}
                            title="Discover Schools"
                            description="Explore colleges"
                            onClick={() => router.push('/institutions')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ———————————————————————————————— */
/* Components                                                          */
/* ———————————————————————————————— */

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-blue-700">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function Metric({ value, label }: { value: number; label: string }) {
    return (
        <div className="rounded-md border border-gray-200 p-3 text-center bg-white">
            <div className="text-lg font-semibold text-gray-900">{value}</div>
            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</div>
        </div>
    );
}

function Panel({
    icon,
    title,
    subtitle,
    summary,
    primaryLabel,
    primaryAction,
    secondaryLabel,
    secondaryAction,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    summary?: Summary | null;
    primaryLabel: string;
    primaryAction: () => void;
    secondaryLabel: string;
    secondaryAction: () => void;
    accent: 'blue' | 'indigo';
}) {
    const accepted = summary?.accepted ?? 0;
    const total = summary?.total ?? 0;
    const inProgress = summary?.in_progress ?? 0;
    const submitted = summary?.submitted ?? 0;

    const iconBg = accent === 'blue' ? 'bg-blue-600' : 'bg-indigo-600';

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${iconBg} text-white inline-flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                        <p className="text-xs text-gray-600">{subtitle}</p>
                    </div>
                </div>
                {accepted > 0 && (
                    <div className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700 border border-green-200">
                        <Trophy className="h-3.5 w-3.5" /> {accepted}
                    </div>
                )}
            </div>

            <div className="mb-5 grid grid-cols-4 gap-2">
                <Metric value={total} label="Saved" />
                <Metric value={inProgress} label="Working" />
                <Metric value={submitted} label="Submitted" />
                <Metric value={accepted} label="Accepted" />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    onClick={primaryAction}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                </button>
                <button
                    onClick={secondaryAction}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                    {secondaryLabel}
                </button>
            </div>
        </div>
    );
}

function QuickAction({
    icon,
    title,
    description,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group flex w-full items-start gap-3 rounded-lg border border-gray-200 p-4 text-left bg-white hover:bg-blue-50/40"
        >
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                {icon}
            </div>
            <div>
                <div className="text-sm font-semibold text-gray-900">{title}</div>
                <div className="mt-0.5 text-xs text-gray-600">{description}</div>
            </div>
        </button>
    );
}
