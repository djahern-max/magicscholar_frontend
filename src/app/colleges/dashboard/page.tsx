// src/app/colleges/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    GraduationCap,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    AlertTriangle,
    MapPin,
    TrendingUp,
    FileText,
    ArrowRight,
    Filter,
    Plus,
} from 'lucide-react';
import axios from 'axios';
import {
    CollegeDashboard,
    CollegeApplication,
    ApplicationStatus,
} from '@/types/college-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CollegeDashboardPage() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<CollegeDashboard | null>(null);
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
            const response = await axios.get<CollegeDashboard>(
                `${API_BASE_URL}/api/v1/college-tracking/dashboard`,
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
                `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadDashboard();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (applicationId: number) => {
        if (!confirm('Are you sure you want to remove this college from your tracking?')) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadDashboard();
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
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
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                College Applications
                            </h1>
                            <p className="text-lg text-gray-600">
                                Track your journey to your dream schools
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/institutions')}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                            Add College
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    <StatCard
                        label="Total"
                        value={dashboard.summary.total_applications}
                        icon={<GraduationCap className="h-5 w-5" />}
                        color="bg-indigo-100 text-indigo-600"
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
                        icon={<FileText className="h-5 w-5" />}
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        label="Won"
                        value={dashboard.summary.accepted}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        color="bg-green-100 text-green-600"
                    />
                    <StatCard
                        label="Waitlisted"
                        value={dashboard.summary.waitlisted}
                        icon={<AlertTriangle className="h-5 w-5" />}
                        color="bg-yellow-100 text-yellow-600"
                    />
                    <StatCard
                        label="Rejected"
                        value={dashboard.summary.rejected}
                        icon={<XCircle className="h-5 w-5" />}
                        color="bg-red-100 text-red-600"
                    />
                    <StatCard
                        label="Awaiting"
                        value={dashboard.summary.awaiting_decision}
                        icon={<TrendingUp className="h-5 w-5" />}
                        color="bg-purple-100 text-purple-600"
                    />
                </div>

                {/* Deadlines Section */}
                {dashboard.upcoming_deadlines.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-indigo-600" />
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
                                Update the status or extend the deadline!
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dashboard.overdue.map(app => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onUpdate={handleStatusUpdate}
                                    onDelete={handleDelete}
                                    isOverdue
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Applications */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                            All Applications
                        </h2>
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="researching">Researching</option>
                                <option value="planning">Planning</option>
                                <option value="in_progress">In Progress</option>
                                <option value="submitted">Submitted</option>
                                <option value="accepted">Won</option>
                                <option value="waitlisted">Waitlisted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Applications Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Start tracking your college applications to stay organized
                            </p>
                            <button
                                onClick={() => router.push('/institutions')}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Browse Colleges
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredApplications.map(app => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onUpdate={handleStatusUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Add Button */}
                <button
                    onClick={() => router.push('/institutions')}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
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

// Component: DeadlineCard (Compact version for upcoming deadlines)
interface DeadlineCardProps {
    application: CollegeApplication;
    onUpdate: (id: number, status: ApplicationStatus) => void;
    onDelete: (id: number) => void;
}

function DeadlineCard({ application, onUpdate, onDelete }: DeadlineCardProps) {
    const daysUntilDeadline = application.deadline
        ? Math.ceil((new Date(application.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {application.institution?.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{application.institution?.city}, {application.institution?.state}</span>
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-orange-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        {daysUntilDeadline !== null && daysUntilDeadline >= 0
                            ? `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                            : 'Overdue'}
                    </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    Due: {application.deadline ? new Date(application.deadline).toLocaleDateString() : 'No deadline'}
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onUpdate(application.id, 'submitted' as ApplicationStatus)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    Mark Submitted
                </button>
            </div>
        </div>
    );
}

// Component: ApplicationCard
interface ApplicationCardProps {
    application: CollegeApplication;
    onUpdate: (id: number, status: ApplicationStatus) => void;
    onDelete: (id: number) => void;
    isOverdue?: boolean;
}

function ApplicationCard({ application, onUpdate, onDelete, isOverdue }: ApplicationCardProps) {
    const [showActions, setShowActions] = useState(false);

    const statusConfig = {
        researching: { label: 'Researching', color: 'bg-gray-100 text-gray-700 border-gray-300' },
        planning: { label: 'Planning', color: 'bg-blue-100 text-blue-700 border-blue-300' },
        in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700 border-orange-300' },
        submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-700 border-purple-300' },
        accepted: { label: 'Won', color: 'bg-green-100 text-green-700 border-green-300' },
        waitlisted: { label: 'Waitlisted', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
        rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-300' },
        declined: { label: 'Declined', color: 'bg-gray-100 text-gray-700 border-gray-300' },
        enrolled: { label: 'Enrolled', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    };

    const status = statusConfig[application.status];
    const imageUrl = application.institution?.primary_image_url;

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 hover:shadow-lg transition-all ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
            {/* College Image */}
            <div className="relative h-32 bg-gray-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={application.institution?.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="h-12 w-12 text-gray-400" />
                    </div>
                )}
                {isOverdue && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        OVERDUE
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {application.institution?.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{application.institution?.city}, {application.institution?.state}</span>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-3 ${status.color}`}>
                    {status.label}
                </div>

                {/* Deadline */}
                {application.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(application.deadline).toLocaleDateString()}</span>
                    </div>
                )}

                {/* Application Type */}
                {application.application_type && (
                    <div className="text-xs text-gray-500 mb-3">
                        {application.application_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                            <button
                                onClick={() => onUpdate(application.id, 'accepted' as ApplicationStatus)}
                                className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Mark Won
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
        </div>
    );
}