// src/app/scholarships/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    Filter,
    Plus,
    Trash2,
} from 'lucide-react';
import { scholarshipTrackingService } from '@/lib/scholarshipTrackingService';
import {
    ScholarshipDashboard as DashboardData,
    ApplicationStatus,
} from '@/types/scholarship-tracking';

const STATUS_COLORS = {
    interested: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    planning: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    submitted: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    accepted: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    not_pursuing: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
};

const STATUS_LABELS = {
    interested: '💡 Interested',
    planning: '📋 Planning',
    in_progress: '✍️ In Progress',
    submitted: '📤 Submitted',
    accepted: '🎉 Accepted',
    rejected: '❌ Rejected',
    not_pursuing: '⛔ Not Pursuing',
};

export default function ScholarshipDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'status'>('deadline');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const dashboardData = await scholarshipTrackingService.getDashboard(token);
            setData(dashboardData);
            setError('');
        } catch (err: any) {
            console.error('Error loading dashboard:', err);
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getDaysUntilDeadline = (deadline: string | null): number => {
        if (!deadline) return 999;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await scholarshipTrackingService.updateApplication(token, applicationId, {
                status: newStatus,
            });
            loadDashboard(); // Refresh
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        }
    };

    const deleteApplication = async (applicationId: number, scholarshipTitle: string) => {
        if (!confirm(`Remove "${scholarshipTitle}" from your tracking?`)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await scholarshipTrackingService.deleteApplication(token, applicationId);
            loadDashboard(); // Refresh
        } catch (err: any) {
            console.error('Error deleting application:', err);
            setError('Failed to remove scholarship');
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

    if (error && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={loadDashboard}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const filteredApplications = data.applications.filter(
        (app) => filterStatus === 'all' || app.status === filterStatus
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎓 Scholarship Dashboard
                    </h1>
                    <p className="text-gray-600">Track your scholarship applications and deadlines</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<FileText className="h-6 w-6 text-blue-600" />}
                        label="Total Applications"
                        value={data.summary.total_applications}
                        color="blue"
                    />
                    <StatCard
                        icon={<Clock className="h-6 w-6 text-yellow-600" />}
                        label="In Progress"
                        value={data.summary.in_progress}
                        color="yellow"
                    />
                    <StatCard
                        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                        label="Submitted"
                        value={data.summary.submitted}
                        color="green"
                    />
                    <StatCard
                        icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                        label="Potential Value"
                        value={formatCurrency(data.summary.total_potential_value)}
                        color="emerald"
                    />
                </div>

                {/* Urgent Alerts */}
                {data.overdue.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-red-800 font-semibold">Overdue Applications</h3>
                                <p className="text-red-700 text-sm mt-1">
                                    You have {data.overdue.length} scholarship(s) with past deadlines
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upcoming Deadlines */}
                {data.upcoming_deadlines.length > 0 && (
                    <div className="bg-white rounded-lg shadow mb-8 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                Upcoming Deadlines (Next 30 Days)
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {data.upcoming_deadlines.map((app) => {
                                const daysLeft = getDaysUntilDeadline(app.scholarship.deadline);
                                const isUrgent = daysLeft <= 7;

                                return (
                                    <div
                                        key={app.id}
                                        className={`p-4 border-l-4 ${isUrgent
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-blue-500 bg-blue-50'
                                            } rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
                                        onClick={() => router.push(`/scholarship/${app.scholarship.id}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {app.scholarship.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {app.scholarship.organization}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-semibold ${isUrgent ? 'text-red-700' : 'text-blue-700'
                                                        }`}
                                                >
                                                    {daysLeft} days left
                                                </p>
                                                {app.scholarship.deadline && (
                                                    <p className="text-sm text-gray-600">
                                                        Due{' '}
                                                        {new Date(app.scholarship.deadline).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {data.applications.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Scholarships Saved Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start tracking scholarships to manage deadlines and application progress
                        </p>
                        <button
                            onClick={() => router.push('/scholarships')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Plus className="h-5 w-5" />
                            Find Scholarships
                        </button>
                    </div>
                )}

                {/* Filters & Sort */}
                {data.applications.length > 0 && (
                    <>
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="deadline">Deadline</option>
                                        <option value="amount">Amount</option>
                                        <option value="status">Status</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="interested">Interested</option>
                                        <option value="planning">Planning</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="submitted">Submitted</option>
                                        <option value="accepted">Accepted</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => router.push('/scholarships')}
                                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Find More Scholarships
                                </button>
                            </div>
                        </div>

                        {/* All Applications */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    All Applications ({filteredApplications.length})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {filteredApplications.map((app) => {
                                    const daysLeft = getDaysUntilDeadline(app.scholarship.deadline);
                                    const colors =
                                        STATUS_COLORS[app.status as keyof typeof STATUS_COLORS];

                                    return (
                                        <div
                                            key={app.id}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {app.scholarship.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {app.scholarship.organization}
                                                    </p>

                                                    <div className="flex flex-wrap gap-3 text-sm">
                                                        {app.scholarship.amount_max && (
                                                            <span className="flex items-center text-gray-700">
                                                                <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                                                                {formatCurrency(app.scholarship.amount_max)}
                                                            </span>
                                                        )}
                                                        {app.scholarship.deadline && (
                                                            <span className="flex items-center text-gray-700">
                                                                <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                                                                Due:{' '}
                                                                {new Date(
                                                                    app.scholarship.deadline
                                                                ).toLocaleDateString()}
                                                                {daysLeft >= 0 && (
                                                                    <span
                                                                        className={`ml-2 ${daysLeft <= 7
                                                                                ? 'text-red-600 font-semibold'
                                                                                : 'text-gray-500'
                                                                            }`}
                                                                    >
                                                                        ({daysLeft} days)
                                                                    </span>
                                                                )}
                                                                {daysLeft < 0 && (
                                                                    <span className="ml-2 text-red-600 font-semibold">
                                                                        (OVERDUE)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {app.notes && (
                                                        <p className="mt-2 text-sm text-gray-600 italic">
                                                            Note: {app.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="ml-6 flex flex-col items-end gap-2">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                app.id,
                                                                e.target.value as ApplicationStatus
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border} cursor-pointer`}
                                                    >
                                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/scholarship/${app.scholarship.id}`)
                                                            }
                                                            className="text-sm text-blue-600 hover:text-blue-700"
                                                        >
                                                            View Details →
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                deleteApplication(
                                                                    app.id,
                                                                    app.scholarship.title
                                                                )
                                                            }
                                                            className="text-sm text-red-600 hover:text-red-700"
                                                            title="Remove from tracking"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Helper Component
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'blue' | 'yellow' | 'green' | 'emerald';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        yellow: 'bg-yellow-50 border-yellow-200',
        green: 'bg-green-50 border-green-200',
        emerald: 'bg-emerald-50 border-emerald-200',
    };

    return (
        <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-2">{icon}</div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}