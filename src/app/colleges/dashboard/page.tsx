'use client';

import React, { useEffect, useState } from 'react';
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

// ——————————————————————————————————————————————————————
// Status pills (aligned to app theme; keeps your states)
// ——————————————————————————————————————————————————————
const STATUS_STYLES = {
    researching: 'bg-gray-50 text-gray-800 border border-gray-200',
    planning: 'bg-blue-50 text-blue-800 border border-blue-200',
    in_progress: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    submitted: 'bg-purple-50 text-purple-800 border border-purple-200',
    accepted: 'bg-green-50 text-green-800 border border-green-200',
    waitlisted: 'bg-orange-50 text-orange-800 border border-orange-200',
    rejected: 'bg-red-50 text-red-800 border border-red-200',
    declined: 'bg-gray-50 text-gray-600 border border-gray-200',
    enrolled: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
} as const;

const STATUS_LABELS: Record<keyof typeof STATUS_STYLES, string> = {
    researching: 'Researching',
    planning: 'Planning',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    accepted: 'Accepted',
    waitlisted: 'Waitlisted',
    rejected: 'Rejected',
    declined: 'Declined',
    enrolled: 'Enrolled',
};

const APP_TYPE_LABELS: Record<ApplicationType, string> = {
    early_decision: 'ED',
    early_action: 'EA',
    regular_decision: 'RD',
    rolling: 'Rolling',
};

export default function CollegeDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDashboard = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        try {
            await collegeTrackingService.updateApplication(token, applicationId, { status: newStatus });
            loadDashboard();
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        }
    };

    const deleteApplication = async (applicationId: number, collegeName: string) => {
        if (!confirm(`Remove "${collegeName}" from your tracking?`)) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                    <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-700">{error}</p>
                    <button onClick={loadDashboard} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const filteredApplications = data.applications.filter(
        (app) => filterStatus === 'all' || app.status === filterStatus
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">College Application Dashboard</h1>
                        <p className="text-gray-600">Track your college applications in one place</p>
                    </div>
                    <button
                        onClick={() => router.push('/institutions')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Explore Colleges
                    </button>
                </div>

                {/* Inline error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                {/* Summary Stats */}
                <section className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-4">
                    <StatCard icon={<School className="h-5 w-5 text-blue-700" />} label="Total Applications" value={data.summary.total_applications} />
                    <StatCard icon={<Clock className="h-5 w-5 text-yellow-700" />} label="In Progress" value={data.summary.in_progress} />
                    <StatCard icon={<CheckCircle className="h-5 w-5 text-green-700" />} label="Accepted" value={data.summary.accepted} />
                    <StatCard icon={<Award className="h-5 w-5 text-purple-700" />} label="Awaiting Decision" value={data.summary.awaiting_decision} />
                </section>

                {/* Upcoming Deadlines */}
                {data.upcoming_deadlines.length > 0 && (
                    <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Calendar className="h-5 w-5 text-blue-600" /> Upcoming Deadlines (Next 30 Days)
                        </h2>
                        <div className="space-y-3">
                            {data.upcoming_deadlines.map((app) => {
                                const days = getDaysUntilDeadline(app.deadline);
                                const urgent = days <= 7;
                                return (
                                    <div
                                        key={app.id}
                                        className={`rounded-lg border p-4 ${urgent ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-gray-900">{app.institution.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {app.institution.city}, {app.institution.state}
                                                </div>
                                                <div className="mt-1 text-xs text-gray-600">
                                                    <strong>Deadline:</strong> {formatDate(app.deadline)}{' '}
                                                    {app.application_type && (
                                                        <>
                                                            • <strong>Type:</strong> {APP_TYPE_LABELS[app.application_type]}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-semibold ${urgent ? 'text-red-700' : 'text-blue-700'}`}>{days} days left</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Overdue Applications */}
                {data.overdue.length > 0 && (
                    <section className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
                        <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-red-800">
                            <AlertCircle className="h-5 w-5" /> Overdue Applications
                        </h2>
                        <div className="space-y-3">
                            {data.overdue.map((app) => (
                                <div key={app.id} className="rounded-md border border-red-200 bg-white/60 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{app.institution.name}</div>
                                            <div className="text-sm text-gray-600">Deadline was: {formatDate(app.deadline)}</div>
                                        </div>
                                        <button
                                            onClick={() => updateStatus(app.id, ApplicationStatus.SUBMITTED)}
                                            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                        >
                                            Mark Submitted
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty state */}
                {data.applications.length === 0 ? (
                    <section className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <School className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">No Colleges Saved Yet</h3>
                        <p className="mb-6 text-sm text-gray-600">Start by searching for colleges and saving them to your dashboard.</p>
                        <button
                            onClick={() => router.push('/institutions')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Explore Colleges
                        </button>
                    </section>
                ) : (
                    <>
                        {/* Filters */}
                        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-4">
                                <Filter className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Filter</span>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Applications</option>
                                    {Object.entries(ApplicationStatus).map(([key, value]) => (
                                        <option key={key} value={value as string}>
                                            {STATUS_LABELS[value as keyof typeof STATUS_LABELS]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        {/* Applications List */}
                        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900">All Applications ({filteredApplications.length})</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {filteredApplications.map((app) => {
                                    const days = getDaysUntilDeadline(app.deadline);
                                    const pill = STATUS_STYLES[app.status as keyof typeof STATUS_STYLES];

                                    return (
                                        <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <h3 className="text-base font-semibold text-gray-900">{app.institution.name}</h3>
                                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill}`}>
                                                            {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS]}
                                                        </span>
                                                        {app.application_type && (
                                                            <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
                                                                {APP_TYPE_LABELS[app.application_type]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {app.institution.city}, {app.institution.state} • {app.institution.control_type}
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                                        <span className="inline-flex items-center text-gray-700">
                                                            <Calendar className="mr-1 h-4 w-4 text-blue-700" />
                                                            Deadline: {formatDate(app.deadline)}{' '}
                                                            {app.deadline && days > 0 && days < 999 && (
                                                                <span className="ml-1 text-blue-700">({days} days)</span>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {app.notes && (
                                                        <p className="mt-2 text-sm italic text-gray-600">{app.notes}</p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex shrink-0 flex-col items-end gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => router.push(`/institution/${app.institution.id}`)}
                                                            className="text-sm text-blue-600 hover:text-blue-700"
                                                            title="View college details"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteApplication(app.id, app.institution.name)}
                                                            className="text-sm text-red-600 hover:text-red-700"
                                                            title="Remove from tracking"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Status quick actions */}
                                                    {app.status !== ApplicationStatus.ENROLLED && (
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            {app.status !== ApplicationStatus.SUBMITTED && (
                                                                <button
                                                                    onClick={() => updateStatus(app.id, ApplicationStatus.SUBMITTED)}
                                                                    className="rounded-md bg-purple-100 px-3 py-1 text-sm text-purple-700 hover:bg-purple-200"
                                                                >
                                                                    Mark Submitted
                                                                </button>
                                                            )}
                                                            {app.status === ApplicationStatus.SUBMITTED && (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateStatus(app.id, ApplicationStatus.ACCEPTED)}
                                                                        className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200"
                                                                    >
                                                                        Accepted
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateStatus(app.id, ApplicationStatus.WAITLISTED)}
                                                                        className="rounded-md bg-orange-100 px-3 py-1 text-sm text-orange-700 hover:bg-orange-200"
                                                                    >
                                                                        Waitlisted
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateStatus(app.id, ApplicationStatus.REJECTED)}
                                                                        className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                                                                    >
                                                                        Rejected
                                                                    </button>
                                                                </>
                                                            )}
                                                            {app.status === ApplicationStatus.ACCEPTED && (
                                                                <button
                                                                    onClick={() => updateStatus(app.id, ApplicationStatus.ENROLLED)}
                                                                    className="rounded-md bg-emerald-100 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-200"
                                                                >
                                                                    Enroll Here
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

// ——————————————————————————————————————————————————————
// Components
// ——————————————————————————————————————————————————————
function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-blue-700">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
    );
}
