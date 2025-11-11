// src/components/institutions/CollegeApplicationCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
    Search,
    ClipboardList,
    Clock,
    Send,
    CheckCircle,
    XCircle,
    AlertCircle,
    GraduationCap,
    ThumbsDown,
    MoreVertical,
    Trash2,
    ExternalLink,
    MapPin,
    Calendar,
} from 'lucide-react';
import { CollegeApplication, ApplicationStatus } from '@/types/college-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Props {
    application: CollegeApplication;
    onUpdate: () => void;
}

export default function CollegeApplicationCard({ application, onUpdate }: Props) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const { institution, status } = application;

    // Status configuration with college-specific styling
    const statusConfig = {
        researching: {
            label: 'Researching',
            icon: Search,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            buttonBg: 'bg-blue-500',
            buttonHover: 'hover:bg-blue-600',
        },
        planning: {
            label: 'Planning',
            icon: ClipboardList,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            buttonBg: 'bg-indigo-500',
            buttonHover: 'hover:bg-indigo-600',
        },
        in_progress: {
            label: 'In Progress',
            icon: Clock,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            borderColor: 'border-cyan-200',
            buttonBg: 'bg-cyan-500',
            buttonHover: 'hover:bg-cyan-600',
        },
        submitted: {
            label: 'Submitted',
            icon: Send,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            buttonBg: 'bg-purple-500',
            buttonHover: 'hover:bg-purple-600',
        },
        accepted: {
            label: 'Accepted! 🎉',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            buttonBg: 'bg-green-500',
            buttonHover: 'hover:bg-green-600',
        },
        waitlisted: {
            label: 'Waitlisted',
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            buttonBg: 'bg-yellow-500',
            buttonHover: 'hover:bg-yellow-600',
        },
        rejected: {
            label: 'Not Accepted',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            buttonBg: 'bg-red-500',
            buttonHover: 'hover:bg-red-600',
        },
        declined: {
            label: 'Declined Offer',
            icon: ThumbsDown,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            buttonBg: 'bg-gray-400',
            buttonHover: 'hover:bg-gray-500',
        },
        enrolled: {
            label: 'Enrolled! 🎓',
            icon: GraduationCap,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            buttonBg: 'bg-emerald-500',
            buttonHover: 'hover:bg-emerald-600',
        },
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    // 🎉 CONFETTI CELEBRATIONS
    const celebrateStartPlanning = () => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
        });
    };

    const celebrateStartApplication = () => {
        confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#818cf8', '#a5b4fc'],
            startVelocity: 30,
        });
    };

    const celebrateSubmitted = () => {
        const count = 100;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#9333ea', '#a855f7', '#c084fc'],
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91 });
    };

    const celebrateAccepted = () => {
        // MASSIVE GOLD CELEBRATION - ACCEPTED!!!
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#ffd700', '#ffed4e', '#fbbf24', '#f59e0b'],
            zIndex: 9999,
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    const celebrateWaitlisted = () => {
        confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#eab308', '#facc15', '#fde047'],
        });
    };

    const celebrateEnrolled = () => {
        // GREEN VICTORY - ENROLLED!!!
        const count = 150;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#22c55e', '#4ade80', '#86efac'],
            zIndex: 9999,
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fire(0.25, { spread: 26, startVelocity: 50 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91 });
        fire(0.2, { spread: 80, startVelocity: 35 });
    };

    // Get progressive workflow actions
    const getMainActions = (): Array<{
        label: string;
        newStatus: ApplicationStatus;
        config: typeof statusConfig[ApplicationStatus];
    }> => {
        switch (status) {
            case 'researching':
                return [
                    { label: 'Start Planning', newStatus: 'planning', config: statusConfig.planning },
                ];
            case 'planning':
                return [
                    { label: 'Start Application', newStatus: 'in_progress', config: statusConfig.in_progress },
                ];
            case 'in_progress':
                return [
                    { label: 'Mark Submitted', newStatus: 'submitted', config: statusConfig.submitted },
                ];
            case 'submitted':
                return [
                    { label: 'Accepted!', newStatus: 'accepted', config: statusConfig.accepted },
                    { label: 'Waitlisted', newStatus: 'waitlisted', config: statusConfig.waitlisted },
                    { label: 'Not Accepted', newStatus: 'rejected', config: statusConfig.rejected },
                ];
            case 'waitlisted':
                return [
                    { label: 'Accepted!', newStatus: 'accepted', config: statusConfig.accepted },
                    { label: 'Not Accepted', newStatus: 'rejected', config: statusConfig.rejected },
                ];
            case 'accepted':
                return [
                    { label: 'Enroll Here! 🎓', newStatus: 'enrolled', config: statusConfig.enrolled },
                    { label: 'Decline Offer', newStatus: 'declined', config: statusConfig.declined },
                ];
            default:
                return [];
        }
    };

    const mainActions = getMainActions();

    const handleActionClick = (action: typeof mainActions[0]) => {
        // Celebrate before updating!
        switch (action.newStatus) {
            case 'planning':
                celebrateStartPlanning();
                break;
            case 'in_progress':
                celebrateStartApplication();
                break;
            case 'submitted':
                celebrateSubmitted();
                break;
            case 'accepted':
                celebrateAccepted();
                break;
            case 'waitlisted':
                celebrateWaitlisted();
                break;
            case 'enrolled':
                celebrateEnrolled();
                break;
        }

        updateStatus(action.newStatus);
    };

    const updateStatus = async (newStatus: ApplicationStatus) => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/college-tracking/applications/${application.id}`,
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
        if (!confirm('Are you sure you want to remove this college from tracking?')) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/college-tracking/applications/${application.id}`,
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

            onUpdate();
        } catch (err) {
            console.error('Error deleting application:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete');
        } finally {
            setIsUpdating(false);
            setShowMenu(false);
        }
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'No deadline';
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

    const handleViewCollege = () => {
        if (institution) {
            router.push(`/institution/${institution.id}`);
        }
    };

    const daysUntilDeadline = application.deadline
        ? Math.ceil(
            (new Date(application.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
        : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* LARGER College Image - increased from h-16 to h-48 */}
            <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={handleViewCollege}>
                {institution?.primary_image_url && !imageError ? (
                    <img
                        src={institution.primary_image_url}
                        alt={institution.name || 'College'}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <GraduationCap className="h-16 w-16 text-gray-500" />
                    </div>
                )}

                {/* Status Badge - Overlay on Image */}
                <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color} shadow-md border border-white border-opacity-50`}>
                        <StatusIcon className="h-4 w-4" />
                        {currentStatus.label}
                    </div>
                </div>

                {/* Three-Dot Menu - Overlay on Image */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCollege();
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 rounded-t-lg"
                            >
                                <ExternalLink className="h-4 w-4" />
                                View College Details
                            </button>
                            <div className="border-t border-gray-200"></div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteApplication();
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-b-lg"
                                disabled={isUpdating}
                            >
                                <Trash2 className="h-4 w-4" />
                                Remove from Tracking
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* College Details */}
            <div className="p-4">
                <h3
                    className="font-bold text-gray-900 text-lg mb-2 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                    onClick={handleViewCollege}
                >
                    {institution?.name || 'Unknown College'}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>
                            {institution?.city}, {institution?.state}
                        </span>
                    </div>

                    {application.deadline && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <div className="flex items-center gap-2">
                                <span>{formatDate(application.deadline)}</span>
                                {daysUntilDeadline !== null && daysUntilDeadline >= 0 && (
                                    <span
                                        className={
                                            daysUntilDeadline <= 7
                                                ? 'text-xs font-medium text-red-600'
                                                : daysUntilDeadline <= 30
                                                    ? 'text-xs font-medium text-orange-600'
                                                    : 'text-xs font-medium text-gray-500'
                                        }
                                    >
                                        ({daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''} left)
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Application Type Badge */}
                    {application.application_type && (
                        <div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {application.application_type === 'early_decision' && 'Early Decision'}
                                {application.application_type === 'early_action' && 'Early Action'}
                                {application.application_type === 'regular_decision' && 'Regular Decision'}
                                {application.application_type === 'rolling' && 'Rolling'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Notes */}
                {application.notes && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 bg-gray-50 rounded-lg p-2">
                        {application.notes}
                    </p>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-3 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* 🎉 CONFETTI ACTION BUTTONS */}
                {mainActions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {mainActions.map((action) => (
                            <button
                                key={action.newStatus}
                                onClick={() => handleActionClick(action)}
                                disabled={isUpdating}
                                className={`
                                    px-4 py-2 rounded-lg font-medium text-sm text-white
                                    ${action.config.buttonBg} ${action.config.buttonHover}
                                    transition-all duration-200 
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center gap-2 shadow-sm
                                `}
                            >
                                <action.config.icon className="h-4 w-4" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}