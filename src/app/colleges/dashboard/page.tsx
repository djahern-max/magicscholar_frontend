// src/app/colleges/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    School,
    Filter,
    Trash2,
    ExternalLink,
    Award,
} from 'lucide-react';
import { collegeTrackingService } from '@/lib/collegeTrackingService';
import {
    CollegeDashboard as DashboardData,
    ApplicationStatus,
    ApplicationType,
} from '@/types/college-tracking';

const STATUS_COLORS = {
    researching: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    planning: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    submitted: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    accepted: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    waitlisted: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    declined: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
    enrolled: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
} as const;

const STATUS_LABELS = {
    researching: '🔍 Researching',
    planning: '📋 Planning',
    in_progress: '✍️ In Progress',
    submitted: '📤 Submitted',
    accepted: '🎉 Accepted',
    waitlisted: '⏳ Waitlisted',
    rejected: '❌ Rejected',
    declined: '⛔ Declined',
    enrolled: '🎓 Enrolled',
} as const;

const APP_TYPE_LABELS = {
    early_decision: 'ED',
    early_action: 'EA',
    regular_decision: 'RD',
    rolling: 'Rolling',
} as const;

export default function CollegeDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
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
            const dashboardData = await collegeTrackingService.getDashboard(token);
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

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await collegeTrackingService.updateApplication(token, applicationId, {
                status: newStatus,
            });
            loadDashboard();
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        }
    };

    const deleteApplication = async (applicationId: number, collegeName: string) => {
        if (!confirm(`Remove "${collegeName}" from your tracking?`)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await collegeTrackingService.deleteApplication(token, applicationId);
            loadDashboard();
        } catch (err: any) {
            console.error('Error deleting application:', err);
            setError('Failed to remove college');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your college dashboard...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">College Application Dashboard</h1>
                    <p className="text-gray-600">Track your college applications in one place</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<School className="h-6 w-6 text-blue-600" />}
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
                        label="Accepted"
                        value={data.summary.accepted}
                        color="green"
                    />
                    <StatCard
                        icon={<Award className="h-6 w-6 text-purple-600" />}
                        label="Awaiting Decision"
                        value={data.summary.awaiting_decision}
                        color="emerald"
                    />
                </div>

                {/* Upcoming Deadlines */}
                {data.upcoming_deadlines.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                Upcoming Deadlines (Next 30 Days)
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {data.upcoming_deadlines.map((app) => {
                                const daysUntil = getDaysUntilDeadline(app.deadline);
                                return (
                                    <div
                                        key={app.id}
                                        className="bg-white border-2 border-blue-200 rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {app.institution.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {app.institution.city}, {app.institution.state}
                                                </p>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="text-sm">
                                                        <strong>Deadline:</strong> {formatDate(app.deadline)}
                                                    </span>
                                                    {app.application_type && (
                                                        <span className="text-sm">
                                                            <strong>Type:</strong>{' '}
                                                            {APP_TYPE_LABELS[app.application_type]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {daysUntil}
                                                </p>
                                                <p className="text-xs text-gray-600">days left</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Overdue Applications */}
                {data.overdue.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Overdue Applications</h2>
                        </div>
                        <div className="space-y-3">
                            {data.overdue.map((app) => (
                                <div
                                    key={app.id}
                                    className="bg-red-50 border-2 border-red-300 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {app.institution.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Deadline was: {formatDate(app.deadline)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => updateStatus(app.id, ApplicationStatus.SUBMITTED)}
                                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                        >
                                            Mark Submitted
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Applications */}
                {data.applications.length === 0 ? (
                    <div className="text-center py-12">
                        <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Colleges Saved Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start by searching for colleges and saving them to your dashboard
                        </p>
                        <button
                            onClick={() => router.push('/institutions')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Search Colleges
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Filter Bar */}
                        <div className="mb-6 flex items-center gap-4">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Applications</option>
                                <option value={ApplicationStatus.RESEARCHING}>Researching</option>
                                <option value={ApplicationStatus.PLANNING}>Planning</option>
                                <option value={ApplicationStatus.IN_PROGRESS}>In Progress</option>
                                <option value={ApplicationStatus.SUBMITTED}>Submitted</option>
                                <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                                <option value={ApplicationStatus.WAITLISTED}>Waitlisted</option>
                                <option value={ApplicationStatus.REJECTED}>Rejected</option>
                            </select>
                        </div>

                        {/* Applications Grid */}
                        <div className="space-y-4">
                            {filteredApplications.map((app) => {
                                const daysUntil = getDaysUntilDeadline(app.deadline);
                                const colors = STATUS_COLORS[app.status];

                                return (
                                    <div
                                        key={app.id}
                                        className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {app.institution.name}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                                                    >
                                                        {STATUS_LABELS[app.status]}
                                                    </span>
                                                    {app.application_type && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                            {APP_TYPE_LABELS[app.application_type]}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-3">
                                                    {app.institution.city}, {app.institution.state} •{' '}
                                                    {app.institution.control_type}
                                                </p>

                                                {/* Application Details */}
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Deadline:</span>
                                                        <span className="ml-2 font-medium">
                                                            {formatDate(app.deadline)}
                                                            {app.deadline && daysUntil > 0 && daysUntil < 999 && (
                                                                <span className="text-blue-600 ml-1">
                                                                    ({daysUntil} days)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    {app.application_fee && (
                                                        <div>
                                                            <span className="text-gray-600">App Fee:</span>
                                                            <span className="ml-2 font-medium">
                                                                ${app.application_fee}
                                                                {app.fee_waiver_obtained && (
                                                                    <span className="text-green-600 ml-1">
                                                                        (Waived)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {app.notes && (
                                                    <p className="mt-3 text-sm text-gray-600 italic">
                                                        {app.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/institution/${app.institution.id}`)
                                                    }
                                                    className="text-sm text-blue-600 hover:text-blue-700"
                                                    title="View college details"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteApplication(app.id, app.institution.name)
                                                    }
                                                    className="text-sm text-red-600 hover:text-red-700"
                                                    title="Remove from tracking"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status Actions */}
                                        {app.status !== ApplicationStatus.ENROLLED && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                                {app.status !== ApplicationStatus.SUBMITTED && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(app.id, ApplicationStatus.SUBMITTED)
                                                        }
                                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                                                    >
                                                        Mark Submitted
                                                    </button>
                                                )}
                                                {app.status === ApplicationStatus.SUBMITTED && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(app.id, ApplicationStatus.ACCEPTED)
                                                            }
                                                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                                                        >
                                                            Accepted
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(app.id, ApplicationStatus.WAITLISTED)
                                                            }
                                                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200"
                                                        >
                                                            Waitlisted
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(app.id, ApplicationStatus.REJECTED)
                                                            }
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                                                        >
                                                            Rejected
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === ApplicationStatus.ACCEPTED && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(app.id, ApplicationStatus.ENROLLED)
                                                        }
                                                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm hover:bg-emerald-200"
                                                    >
                                                        🎓 Enroll Here!
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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