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
    Search,
    AlertTriangle,
    TrendingUp,
    Filter,
    Plus,
} from 'lucide-react';
import CollegeApplicationCard from '@/components/institutions/CollegeApplicationCard';
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
            setLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/v1/college-tracking/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load dashboard');
            }

            const data = await response.json();
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your college applications...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Failed to load dashboard</p>
                    <button
                        onClick={loadDashboard}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filteredApplications = filterStatus === 'all'
        ? dashboard.applications
        : dashboard.applications.filter(app => app.status === filterStatus);

    const statusFilters: Array<{ value: ApplicationStatus | 'all'; label: string; icon: any }> = [
        { value: 'all', label: 'All', icon: GraduationCap },
        { value: 'researching', label: 'Researching', icon: Search },
        { value: 'planning', label: 'Planning', icon: Calendar },
        { value: 'in_progress', label: 'In Progress', icon: Clock },
        { value: 'submitted', label: 'Submitted', icon: Send },
        { value: 'accepted', label: 'Accepted', icon: CheckCircle },
        { value: 'waitlisted', label: 'Waitlisted', icon: AlertTriangle },
        { value: 'enrolled', label: 'Enrolled', icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Tracker</h1>
                    <p className="text-gray-600">Track your pplications and celebrate your wins!</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Total Apps</span>
                            <GraduationCap className="h-5 w-5 text-indigo-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboard.summary.total_applications}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">In Progress</span>
                            <Clock className="h-5 w-5 text-cyan-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboard.summary.in_progress}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Submitted</span>
                            <Send className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboard.summary.submitted}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Accepted</span>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboard.summary.accepted}</p>
                    </div>
                </div>

                {/* Upcoming Deadlines Alert */}
                {dashboard.upcoming_deadlines.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">
                                    Upcoming Deadlines ({dashboard.upcoming_deadlines.length})
                                </h3>
                                <p className="text-sm text-blue-700">
                                    You have deadlines in the next 30 days. Stay on track!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overdue Alert */}
                {dashboard.overdue.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">
                                    Overdue Applications ({dashboard.overdue.length})
                                </h3>
                                <p className="text-sm text-red-700">
                                    Some deadlines have passed. Update their status or remove them.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filters - NOW CENTERED */}
                <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {statusFilters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = filterStatus === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        flex items-center gap-2
                                        ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Applications Grid */}
                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                        <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {filterStatus === 'all'
                                ? 'No Colleges Tracked Yet'
                                : `No ${statusFilters.find(f => f.value === filterStatus)?.label} Applications`
                            }
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterStatus === 'all'
                                ? 'Start exploring colleges and track your applications here!'
                                : 'Try selecting a different status filter.'}
                        </p>
                        <button
                            onClick={() => router.push('/institutions')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Browse Colleges
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredApplications.map((application) => (
                            <CollegeApplicationCard
                                key={application.id}
                                application={application}
                                onUpdate={loadDashboard}
                            />
                        ))}
                    </div>
                )}

                {/* Browse More Colleges Button */}
                {dashboard.applications.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/institutions')}
                            className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add More Colleges
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}