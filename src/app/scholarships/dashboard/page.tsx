// src/app/scholarships/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award,
    Calendar,
    CheckCircle,
    Clock,
    Send,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Filter,
    Lightbulb,
    ClipboardList,
    XCircle,
    EyeOff,
} from 'lucide-react';
import ScholarshipApplicationCard from '@/components/scholarships/ScholarshipApplicationCard';
import { getScholarshipDashboard } from '@/lib/scholarshipTrackingService';
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
        try {
            setLoading(true);
            const data = await getScholarshipDashboard();
            setDashboard(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your scholarships...</p>
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
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Scholarship Tracker</h1>
                    <p className="text-gray-600">Fund your education and track your progress</p>
                </div>

                {/* Financial Summary Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <DollarSign className="h-6 w-6 text-green-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">Financial Summary</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Your scholarship earnings and potential funding
                        </p>

                        <div className="space-y-3">
                            {/* Total Won */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Total Won</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            From {dashboard.summary.accepted} scholarship{dashboard.summary.accepted !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            ${dashboard.summary.total_awarded_value.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Potential Value */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Potential Value</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            From active scholarships
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${dashboard.summary.total_potential_value.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => router.push('/scholarships')}
                                className="flex-1 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            >
                                Find More Scholarships
                            </button>
                        </div>
                    </div>
                </div>

                {/* Application Progress Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-900">Application Progress</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Track your scholarship application status
                        </p>

                        <div className="space-y-3">
                            {/* Interested */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <Lightbulb className="h-5 w-5 text-blue-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Interested</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Scholarships you're considering
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {dashboard.summary.interested}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Planning */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <ClipboardList className="h-5 w-5 text-indigo-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Planning</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Gathering requirements and materials
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {dashboard.summary.planning}
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
                                            Applications you're working on
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
                                            Waiting for responses
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {dashboard.summary.submitted}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Accepted (Won) */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Won</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Scholarships you've won
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            {dashboard.summary.accepted}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rejected */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Rejected</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Applications not awarded
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-red-600">
                                            {dashboard.summary.rejected}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Not Pursuing */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <EyeOff className="h-5 w-5 text-gray-500 mr-2" />
                                            <h3 className="font-medium text-gray-900">Not Pursuing</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Scholarships you've decided not to pursue
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-gray-600">
                                            {dashboard.summary.not_pursuing}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines Section */}
                {dashboard.upcoming_deadlines.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Calendar className="h-6 w-6 text-orange-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    Upcoming Deadlines ({dashboard.upcoming_deadlines.length})
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Scholarships with approaching deadlines
                            </p>

                            <div className="space-y-3">
                                {dashboard.upcoming_deadlines.map(app => {
                                    const daysUntilDeadline = app.scholarship.deadline
                                        ? Math.ceil((new Date(app.scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;

                                    const minAmount = app.scholarship.amount_min ?? 0;
                                    const maxAmount = app.scholarship.amount_max ?? 0;
                                    const amount = minAmount === maxAmount
                                        ? `$${minAmount.toLocaleString()}`
                                        : `$${minAmount.toLocaleString()}-$${maxAmount.toLocaleString()}`;

                                    return (
                                        <div
                                            key={app.id}
                                            onClick={() => router.push(`/scholarship/${app.scholarship.id}`)}
                                            className="border border-orange-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer bg-orange-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                        {app.scholarship.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">{app.scholarship.organization}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <p className="text-sm font-bold text-green-600">
                                                            {amount}
                                                        </p>
                                                        {daysUntilDeadline !== null && (
                                                            <p className="text-xs text-orange-600 font-medium">
                                                                {daysUntilDeadline >= 0
                                                                    ? `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                                                                    : 'Overdue'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    {app.scholarship.deadline && (
                                                        <p className="text-xs text-gray-500">
                                                            Due: {new Date(app.scholarship.deadline).toLocaleDateString()}
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
                                    Update the status to keep your tracker organized!
                                </p>
                            </div>

                            <div className="space-y-3">
                                {dashboard.overdue.map(app => {
                                    const minAmount = app.scholarship.amount_min ?? 0;
                                    const maxAmount = app.scholarship.amount_max ?? 0;
                                    const amount = minAmount === maxAmount
                                        ? `$${minAmount.toLocaleString()}`
                                        : `$${minAmount.toLocaleString()}-$${maxAmount.toLocaleString()}`;

                                    return (
                                        <div
                                            key={app.id}
                                            onClick={() => router.push(`/scholarship/${app.scholarship.id}`)}
                                            className="border border-red-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all bg-red-50 cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {app.scholarship.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">{app.scholarship.organization}</p>
                                                    <p className="text-sm font-bold text-green-600 mt-2">
                                                        {amount}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
                                                        OVERDUE
                                                    </span>
                                                    {app.scholarship.deadline && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Was: {new Date(app.scholarship.deadline).toLocaleDateString()}
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

                {/* All Scholarships Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    All Scholarships ({filteredApplications.length})
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All</option>
                                    <option value="interested">Interested</option>
                                    <option value="planning">Planning</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="accepted">Won</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="not_pursuing">Not Pursuing</option>
                                </select>
                            </div>
                        </div>

                        {filteredApplications.length === 0 ? (
                            <div className="text-center py-8">
                                <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-4">No scholarships found</p>
                                <button
                                    onClick={() => router.push('/scholarships')}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Find Scholarships
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredApplications.map(app => (
                                    <ScholarshipApplicationCard
                                        key={app.id}
                                        application={app}
                                        onUpdate={loadDashboard}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}