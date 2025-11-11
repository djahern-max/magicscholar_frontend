// src/components/scholarships/ScholarshipApplicationCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Lightbulb,
    ClipboardList,
    Clock,
    Send,
    CheckCircle,
    XCircle,
    EyeOff,
    MoreVertical,
    Trash2,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ScholarshipApplication {
    id: number;
    user_id: number;
    scholarship_id: number;
    status: 'interested' | 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'not_pursuing';
    saved_at: string;
    notes?: string;
    award_amount?: number;
    scholarship: {
        id: number;
        title: string;
        organization: string;
        amount_min: number;
        amount_max: number;
        deadline: string;
    };
}

interface Props {
    application: ScholarshipApplication;
    onUpdate: () => void; // Callback to refresh the list
}

export default function ScholarshipApplicationCard({ application, onUpdate }: Props) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { scholarship, status } = application;

    // Status configuration
    const statusConfig = {
        interested: {
            label: 'Interested',
            icon: Lightbulb,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        planning: {
            label: 'Planning',
            icon: ClipboardList,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
        },
        in_progress: {
            label: 'In Progress',
            icon: Clock,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            borderColor: 'border-cyan-200',
        },
        submitted: {
            label: 'Submitted',
            icon: Send,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
        },
        accepted: {
            label: 'Accepted',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
        },
        rejected: {
            label: 'Rejected',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
        },
        not_pursuing: {
            label: 'Not Pursuing',
            icon: EyeOff,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
        },
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    // Quick action buttons based on current status
    const getQuickActions = () => {
        switch (status) {
            case 'interested':
                return [
                    { label: 'Start Planning', newStatus: 'planning', color: 'yellow' },
                    { label: 'Not Pursuing', newStatus: 'not_pursuing', color: 'gray' },
                ];
            case 'planning':
                return [
                    { label: 'Start Application', newStatus: 'in_progress', color: 'cyan' },
                    { label: 'Not Pursuing', newStatus: 'not_pursuing', color: 'gray' },
                ];
            case 'in_progress':
                return [
                    { label: 'Mark Submitted', newStatus: 'submitted', color: 'purple' },
                    { label: 'Not Pursuing', newStatus: 'not_pursuing', color: 'gray' },
                ];
            case 'submitted':
                return [
                    { label: 'Accepted!', newStatus: 'accepted', color: 'green' },
                    { label: 'Rejected', newStatus: 'rejected', color: 'red' },
                ];
            case 'accepted':
            case 'rejected':
            case 'not_pursuing':
                return [];
            default:
                return [];
        }
    };

    const quickActions = getQuickActions();

    const updateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${application.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Refresh the list
            onUpdate();
            setShowMenu(false);
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteApplication = async () => {
        if (!confirm('Are you sure you want to remove this scholarship from tracking?')) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${application.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete');
            }

            // Refresh the list
            onUpdate();
        } catch (err) {
            console.error('Error deleting application:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete');
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const formatAmount = (min: number, max: number) => {
        if (min === max) {
            return `$${min.toLocaleString()}`;
        }
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    return (
        <div className={`bg-white border-2 ${currentStatus.borderColor} rounded-lg p-4 hover:shadow-md transition-all relative`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <button
                        onClick={() => router.push(`/scholarship/${scholarship.id}`)}
                        className="text-left"
                    >
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {scholarship.title}
                        </h3>
                        <p className="text-sm text-gray-600">{scholarship.organization}</p>
                    </button>
                </div>

                {/* Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={deleteApplication}
                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Amount and Deadline */}
            <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-semibold text-green-600">
                    {formatAmount(scholarship.amount_min, scholarship.amount_max)}
                </span>
                <span className="text-gray-600">
                    Due: <span className="font-medium">{formatDate(scholarship.deadline)}</span>
                </span>
            </div>

            {/* Current Status Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.color} text-sm font-medium mb-3`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {currentStatus.label}
            </div>

            {/* Award Amount (if accepted) */}
            {status === 'accepted' && application.award_amount && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                        <strong>Awarded:</strong> ${application.award_amount.toLocaleString()}
                    </p>
                </div>
            )}

            {/* Quick Action Buttons */}
            {quickActions.length > 0 && (
                <div className="flex gap-2">
                    {quickActions.map((action) => (
                        <button
                            key={action.newStatus}
                            onClick={() => updateStatus(action.newStatus)}
                            disabled={isUpdating}
                            className={`
                                flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors
                                ${action.color === 'yellow' && 'bg-yellow-500 text-white hover:bg-yellow-600'}
                                ${action.color === 'cyan' && 'bg-cyan-500 text-white hover:bg-cyan-600'}
                                ${action.color === 'purple' && 'bg-purple-500 text-white hover:bg-purple-600'}
                                ${action.color === 'green' && 'bg-green-500 text-white hover:bg-green-600'}
                                ${action.color === 'red' && 'bg-red-500 text-white hover:bg-red-600'}
                                ${action.color === 'gray' && 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isUpdating ? 'Updating...' : action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}