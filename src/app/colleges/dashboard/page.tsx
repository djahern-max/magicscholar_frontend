// src/app/colleges/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    GraduationCap,
    Calendar,
    CheckCircle,
    Clock,
    Send,
    XCircle,
    AlertTriangle,
    MapPin,
    TrendingUp,
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">College Applications</h1>
                    <p className="text-gray-600">Track your journey to your dream schools</p>
                </div>

                {/* Application Progress Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">Application Progress</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Monitor your college application journey
                        </p>

                        <div className="space-y-3">
                            {/* Total Tracked */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <GraduationCap className="h-5 w-5 text-indigo-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Total Tracked</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Colleges you're considering
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {dashboard.summary.total_applications}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-cyan-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">In Progress</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Applications being completed
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-cyan-600">
                                            {dashboard.summary.in_progress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Send className="h-5 w-5 text-purple-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Submitted</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Awaiting admission decisions
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {dashboard.summary.submitted}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Accepted */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Accepted</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Admission offers received
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            {dashboard.summary.accepted}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Waitlisted */}
                            {dashboard.summary.waitlisted > 0 && (
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                                <h3 className="font-medium text-gray-900">Waitlisted</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                On the waiting list
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {dashboard.summary.waitlisted}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rejected */}
                            {dashboard.summary.rejected > 0 && (
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                                <h3 className="font-medium text-gray-900">Rejected</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Decisions not in your favor
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-red-600">
                                                {dashboard.summary.rejected}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => router.push('/institutions')}
                                className="flex-1 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                            >
                                Explore Colleges
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines Section */}
                {dashboard.upcoming_deadlines.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Calendar className="h-6 w-6 text-indigo-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    Upcoming Deadlines ({dashboard.upcoming_deadlines.length})
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Applications with approaching deadlines
                            </p>

                            <div className="space-y-3">
                                {dashboard.upcoming_deadlines.map(app => {
                                    const daysUntilDeadline = app.deadline
                                        ? Math.ceil((new Date(app.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;

                                    return (
                                        <div
                                            key={app.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                                        {app.institution?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{app.institution?.city}, {app.institution?.state}</span>
                                                    </div>
                                                    {daysUntilDeadline !== null && (
                                                        <p className="text-xs text-indigo-600 font-medium mt-2">
                                                            {daysUntilDeadline >= 0
                                                                ? `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                                                                : 'Overdue'}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    {app.deadline && (
                                                        <p className="text-xs text-gray-500">
                                                            Due: {new Date(app.deadline).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Overdue Section */}
                {dashboard.overdue.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    Overdue Applications ({dashboard.overdue.length})
                                </h2>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-800 font-medium">
                                    You have {dashboard.overdue.length} overdue application{dashboard.overdue.length !== 1 ? 's' : ''}.
                                    Update the status or extend the deadline!
                                </p>
                            </div>

                            <div className="space-y-3">
                                {dashboard.overdue.map(app => (
                                    <div
                                        key={app.id}
                                        className="border border-red-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all bg-red-50"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {app.institution?.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{app.institution?.city}, {app.institution?.state}</span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
                                                    OVERDUE
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* All Applications Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <GraduationCap className="h-6 w-6 text-indigo-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    All Applications ({filteredApplications.length})
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All</option>
                                    <option value="researching">Researching</option>
                                    <option value="planning">Planning</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="waitlisted">Waitlisted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {filteredApplications.length === 0 ? (
                            <div className="text-center py-8">
                                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-4">No applications found</p>
                                <button
                                    onClick={() => router.push('/institutions')}
                                    className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg transition-colors"
                                >
                                    Browse Colleges
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredApplications.map(app => {
                                    const statusConfig = {
                                        researching: { label: 'Researching', color: 'text-gray-600' },
                                        planning: { label: 'Planning', color: 'text-blue-600' },
                                        in_progress: { label: 'In Progress', color: 'text-red-600' },
                                        submitted: { label: 'Submitted', color: 'text-blue-600' },
                                        accepted: { label: 'Accepted', color: 'text-green-600' },
                                        waitlisted: { label: 'Waitlisted', color: 'text-yellow-600' },
                                        rejected: { label: 'Rejected', color: 'text-red-600' },
                                        declined: { label: 'Declined', color: 'text-gray-600' },
                                        enrolled: { label: 'Enrolled', color: 'text-indigo-600' },
                                    };

                                    const status = statusConfig[app.status];

                                    return (
                                        <div
                                            key={app.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                                        {app.institution?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{app.institution?.city}, {app.institution?.state}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <p className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </p>
                                                        {app.application_type && (
                                                            <p className="text-xs text-gray-500">
                                                                {app.application_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    {app.deadline && (
                                                        <p className="text-xs text-gray-500">
                                                            Due: {new Date(app.deadline).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}