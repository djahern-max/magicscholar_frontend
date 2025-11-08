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

// Status styling (kept functional but tuned to app theme)
const STATUS_STYLES = {
    interested: 'bg-gray-50 text-gray-800 border border-gray-300',
    planning: 'bg-blue-50 text-blue-800 border border-blue-200',
    in_progress: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    submitted: 'bg-purple-50 text-purple-800 border border-purple-200',
    accepted: 'bg-green-50 text-green-800 border border-green-200',
    rejected: 'bg-red-50 text-red-800 border border-red-200',
    not_pursuing: 'bg-gray-50 text-gray-600 border border-gray-300',
} as const;

const STATUS_LABELS: Record<ApplicationStatus | 'not_pursuing', string> = {
    interested: 'Interested',
    planning: 'Planning',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    accepted: 'Accepted',
    rejected: 'Rejected',
    not_pursuing: 'Not Pursuing',
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDashboard = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

    const formatCurrency = (amount: number): string =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        try {
            await scholarshipTrackingService.updateApplication(token, applicationId, { status: newStatus });
            loadDashboard();
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        }
    };

    const deleteApplication = async (applicationId: number, scholarshipTitle: string) => {
        if (!confirm(`Remove "${scholarshipTitle}" from your tracking?`)) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        try {
            await scholarshipTrackingService.deleteApplication(token, applicationId);
            loadDashboard();
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Scholarship Dashboard</h1>
                        <p className="text-gray-600">Track your scholarship applications and deadlines</p>
                    </div>
                    <button
                        onClick={() => router.push('/scholarships')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Find Scholarships
                    </button>
                </div>

                {/* Inline error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                {/* Summary Stats */}
                <section className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={<FileText className="h-5 w-5 text-blue-700" />} label="Total Applications" value={data.summary.total_applications} />
                    <StatCard icon={<Clock className="h-5 w-5 text-yellow-700" />} label="In Progress" value={data.summary.in_progress} />
                    <StatCard icon={<CheckCircle className="h-5 w-5 text-green-700" />} label="Submitted" value={data.summary.submitted} />
                    <StatCard icon={<DollarSign className="h-5 w-5 text-emerald-700" />} label="Potential Value" value={formatCurrency(data.summary.total_potential_value)} />
                </section>

                {/* Upcoming Deadlines */}
                {data.upcoming_deadlines.length > 0 && (
                    <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 inline-flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" /> Upcoming Deadlines (Next 30 Days)
                        </h2>
                        <div className="space-y-3">
                            {data.upcoming_deadlines.map((app) => {
                                const daysLeft = getDaysUntilDeadline(app.scholarship.deadline);
                                const urgent = daysLeft <= 7;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => router.push(`/scholarship/${app.scholarship.id}`)}
                                        className={`w-full rounded-lg border p-4 text-left transition-colors ${urgent ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-gray-900">{app.scholarship.title}</div>
                                                <div className="text-sm text-gray-600">{app.scholarship.organization}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-semibold ${urgent ? 'text-red-700' : 'text-blue-700'}`}>
                                                    {daysLeft} days left
                                                </div>
                                                {app.scholarship.deadline && (
                                                    <div className="text-xs text-gray-600">
                                                        Due {new Date(app.scholarship.deadline).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {data.applications.length === 0 && (
                    <section className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <FileText className="h-14 w-14 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Scholarships Saved Yet</h3>
                        <p className="text-sm text-gray-600 mb-6">Start tracking scholarships to manage deadlines and application progress.</p>
                        <button
                            onClick={() => router.push('/scholarships')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Find Scholarships
                        </button>
                    </section>
                )}

                {data.applications.length > 0 && (
                    <>
                        {/* Filters & Sort */}
                        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Sort by</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="deadline">Deadline</option>
                                        <option value="amount">Amount</option>
                                        <option value="status">Status</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Filter</span>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="interested">Interested</option>
                                        <option value="planning">Planning</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="submitted">Submitted</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="not_pursuing">Not Pursuing</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => router.push('/scholarships')}
                                    className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm"
                                >
                                    <Plus className="h-4 w-4" /> Browse Scholarships
                                </button>
                            </div>
                        </section>

                        {/* Applications List */}
                        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900">All Applications ({filteredApplications.length})</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {filteredApplications
                                    .slice()
                                    .sort((a, b) => {
                                        if (sortBy === 'deadline') {
                                            const ad = a.scholarship.deadline ? new Date(a.scholarship.deadline).getTime() : Infinity;
                                            const bd = b.scholarship.deadline ? new Date(b.scholarship.deadline).getTime() : Infinity;
                                            return ad - bd;
                                        }
                                        if (sortBy === 'amount') {
                                            return (b.scholarship.amount_max || 0) - (a.scholarship.amount_max || 0);
                                        }
                                        // status
                                        return a.status.localeCompare(b.status);
                                    })
                                    .map((app) => {
                                        const daysLeft = getDaysUntilDeadline(app.scholarship.deadline);
                                        const style = STATUS_STYLES[app.status as keyof typeof STATUS_STYLES];

                                        return (
                                            <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between gap-6">
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-semibold text-gray-900">{app.scholarship.title}</h3>
                                                        <p className="text-sm text-gray-600">{app.scholarship.organization}</p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                                            {app.scholarship.amount_max && (
                                                                <span className="inline-flex items-center text-gray-700">
                                                                    <DollarSign className="mr-1 h-4 w-4 text-emerald-700" />
                                                                    {formatCurrency(app.scholarship.amount_max)}
                                                                </span>
                                                            )}
                                                            {app.scholarship.deadline && (
                                                                <span className="inline-flex items-center text-gray-700">
                                                                    <Calendar className="mr-1 h-4 w-4 text-blue-700" />
                                                                    Due {new Date(app.scholarship.deadline).toLocaleDateString()}
                                                                    {daysLeft >= 0 ? (
                                                                        <span className={`ml-2 ${daysLeft <= 7 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                                                            ({daysLeft} days)
                                                                        </span>
                                                                    ) : (
                                                                        <span className="ml-2 text-red-600 font-semibold">(OVERDUE)</span>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {app.notes && (
                                                            <p className="mt-2 text-sm text-gray-600 italic">Note: {app.notes}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex w-64 shrink-0 flex-col items-end gap-2">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                                                            className={`w-full rounded-full px-3 py-1 text-sm font-medium ${style}`}
                                                        >
                                                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                                                <option key={value} value={value}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => router.push(`/scholarship/${app.scholarship.id}`)}
                                                                className="text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                View Details →
                                                            </button>
                                                            <button
                                                                onClick={() => deleteApplication(app.id, app.scholarship.title)}
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
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

/* ———————————————————————————————— */
/* Components */
/* ———————————————————————————————— */

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
