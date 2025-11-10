// src/app/scholarships/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Filter,
    Plus,
    Target,
} from 'lucide-react';
import axios from 'axios';
import {
    ScholarshipDashboard,
    ScholarshipApplication,
    ApplicationStatus,
} from '@/types/scholarship-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ScholarshipDashboardPage() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<ScholarshipDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');

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
            const response = await axios.get<ScholarshipDashboard>(
                `${API_BASE_URL}/api/v1/scholarship-tracking/dashboard`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDashboard(response.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId: number, newStatus: ApplicationStatus) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.patch(
                `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadDashboard();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleMarkAccepted = async (applicationId: number, awardAmount?: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-accepted`,
                null,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: awardAmount ? { award_amount: awardAmount } : undefined,
                }
            );
            loadDashboard();
        } catch (error) {
            console.error('Error marking as accepted:', error);
        }
    };

    const handleDelete = async (applicationId: number) => {
        if (!confirm('Are you sure you want to remove this scholarship from your tracking?')) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadDashboard();
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your scholarships...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Failed to load dashboard</p>
                </div>
            </div>
        );
    }

    const filteredApplications = filterStatus === 'all'
        ? dashboard.applications
        : dashboard.applications.filter(app => app.status === filterStatus);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Scholarship Tracker
                            </h1>
                            <p className="text-lg text-gray-600">
                                Fund your education and track your progress
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/scholarships')}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                            Find Scholarships
                        </button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Total Won</h3>
                            <DollarSign className="h-8 w-8" />
                        </div>
                        <p className="text-4xl font-bold mb-1">
                            ${dashboard.summary.total_awarded_value.toLocaleString()}
                        </p>
                        <p className="text-green-100 text-sm">
                            From {dashboard.summary.accepted} scholarship{dashboard.summary.accepted !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Potential Value</h3>
                            <Target className="h-8 w-8" />
                        </div>
                        <p className="text-4xl font-bold mb-1">
                            ${dashboard.summary.total_potential_value.toLocaleString()}
                        </p>
                        <p className="text-blue-100 text-sm">
                            From {dashboard.summary.total_applications} tracked scholarship{dashboard.summary.total_applications !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        label="Interested"
                        value={dashboard.applications.filter(a => a.status === 'interested').length}
                        icon={<Award className="h-5 w-5" />}
                        color="bg-gray-100 text-gray-600"
                    />
                    <StatCard
                        label="In Progress"
                        value={dashboard.summary.in_progress}
                        icon={<Clock className="h-5 w-5" />}
                        color="bg-orange-100 text-orange-600"
                    />
                    <StatCard
                        label="Submitted"
                        value={dashboard.summary.submitted}
                        icon={<TrendingUp className="h-5 w-5" />}
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        label="Won"
                        value={dashboard.summary.accepted}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        color="bg-green-100 text-green-600"
                    />
                </div>

                {/* Deadlines Section */}
                {dashboard.upcoming_deadlines.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-blue-600" />
                            Upcoming Deadlines
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dashboard.upcoming_deadlines.map(app => (
                                <DeadlineCard
                                    key={app.id}
                                    application={app}
                                    onUpdate={handleStatusUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Overdue Section */}
                {dashboard.overdue.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                            Overdue Applications
                        </h2>
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-800 font-medium">
                                You have {dashboard.overdue.length} overdue application{dashboard.overdue.length !== 1 ? 's' : ''}.
                                Update the status to keep your tracker organized!
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dashboard.overdue.map(app => (
                                <ScholarshipCard
                                    key={app.id}
                                    application={app}
                                    onUpdate={handleStatusUpdate}
                                    onMarkAccepted={handleMarkAccepted}
                                    onDelete={handleDelete}
                                    isOverdue
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Scholarships */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Award className="h-6 w-6 text-blue-600" />
                            All Scholarships
                        </h2>
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="interested">Interested</option>
                                <option value="planning">Planning</option>
                                <option value="in_progress">In Progress</option>
                                <option value="submitted">Submitted</option>
                                <option value="accepted">Won</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Scholarships Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Start tracking scholarships to fund your education
                            </p>
                            <button
                                onClick={() => router.push('/scholarships')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Find Scholarships
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredApplications.map(app => (
                                <ScholarshipCard
                                    key={app.id}
                                    application={app}
                                    onUpdate={handleStatusUpdate}
                                    onMarkAccepted={handleMarkAccepted}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Add Button */}
                <button
                    onClick={() => router.push('/scholarships')}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}

// Component: StatCard
interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}

// Component: DeadlineCard
interface DeadlineCardProps {
    application: ScholarshipApplication;
    onUpdate: (id: number, status: ApplicationStatus) => void;
    onDelete: (id: number) => void;
}

function DeadlineCard({ application, onUpdate, onDelete }: DeadlineCardProps) {
    const daysUntilDeadline = application.scholarship.deadline
        ? Math.ceil((new Date(application.scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    // Handle null amounts
    const minAmount = application.scholarship.amount_min ?? 0;
    const maxAmount = application.scholarship.amount_max ?? 0;
    const amount = minAmount === maxAmount
        ? `$${minAmount.toLocaleString()}`
        : `$${minAmount.toLocaleString()}-$${maxAmount.toLocaleString()}`;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-200 hover:shadow-lg transition-shadow">
            <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {application.scholarship.title}
                </h3>
                <p className="text-sm text-gray-600">{application.scholarship.organization}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2 text-green-700">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-semibold">{amount}</span>
                </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2 text-orange-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        {daysUntilDeadline !== null && daysUntilDeadline >= 0
                            ? `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                            : 'Overdue'}
                    </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    {application.scholarship.deadline ? new Date(application.scholarship.deadline).toLocaleDateString() : 'No deadline'}
                </p>
            </div>

            <button
                onClick={() => onUpdate(application.id, 'submitted' as ApplicationStatus)}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Mark Submitted
            </button>
        </div>
    );
}

// Component: ScholarshipCard
interface ScholarshipCardProps {
    application: ScholarshipApplication;
    onUpdate: (id: number, status: ApplicationStatus) => void;
    onMarkAccepted: (id: number, awardAmount?: number) => void;
    onDelete: (id: number) => void;
    isOverdue?: boolean;
}

function ScholarshipCard({ application, onUpdate, onMarkAccepted, onDelete, isOverdue }: ScholarshipCardProps) {
    const [showActions, setShowActions] = useState(false);
    const [awardAmount, setAwardAmount] = useState('');

    const statusConfig = {
        interested: { label: 'Interested', color: 'bg-gray-100 text-gray-700 border-gray-300' },
        planning: { label: 'Planning', color: 'bg-blue-100 text-blue-700 border-blue-300' },
        in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700 border-orange-300' },
        submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-700 border-purple-300' },
        accepted: { label: 'Won', color: 'bg-green-100 text-green-700 border-green-300' },
        rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-300' },
        not_pursuing: { label: 'Not Pursuing', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    };

    const status = statusConfig[application.status];

    // Handle null amounts
    const minAmount = application.scholarship.amount_min ?? 0;
    const maxAmount = application.scholarship.amount_max ?? 0;
    const amount = minAmount === maxAmount
        ? `$${minAmount.toLocaleString()}`
        : `$${minAmount.toLocaleString()}-$${maxAmount.toLocaleString()}`;

    const handleMarkWon = () => {
        const amount = awardAmount ? parseInt(awardAmount.replace(/[^0-9]/g, '')) : undefined;
        onMarkAccepted(application.id, amount);
        setAwardAmount('');
        setShowActions(false);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
            {isOverdue && (
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold mb-3 inline-block">
                    OVERDUE
                </div>
            )}

            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {application.scholarship.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3">
                {application.scholarship.organization}
            </p>

            {/* Amount */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-green-700">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-semibold">{amount}</span>
                </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-3 ${status.color}`}>
                {status.label}
            </div>

            {/* Deadline */}
            {application.scholarship.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(application.scholarship.deadline).toLocaleDateString()}</span>
                </div>
            )}

            {/* Award Amount (if won) */}
            {application.status === 'accepted' && application.award_amount && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-3">
                    <div className="text-sm text-green-800 font-medium">
                        Won: ${application.award_amount.toLocaleString()}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    {showActions ? 'Hide Actions' : 'Update Status'}
                </button>

                {showActions && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                        <button
                            onClick={() => onUpdate(application.id, 'submitted' as ApplicationStatus)}
                            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Mark Submitted
                        </button>

                        {/* Mark as Won with Award Amount */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Award amount (optional)"
                                value={awardAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setAwardAmount(value ? `$${parseInt(value).toLocaleString()}` : '');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                onClick={handleMarkWon}
                                className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Mark Won
                            </button>
                        </div>

                        <button
                            onClick={() => onUpdate(application.id, 'rejected' as ApplicationStatus)}
                            className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Mark Rejected
                        </button>

                        <button
                            onClick={() => onDelete(application.id)}
                            className="w-full px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}