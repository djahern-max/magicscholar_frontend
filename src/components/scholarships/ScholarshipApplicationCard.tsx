// src/components/scholarships/ScholarshipApplicationCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
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
import { ScholarshipApplication, ApplicationStatus } from '@/types/scholarship-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Props {
    application: ScholarshipApplication;
    onUpdate: () => void;
}

export default function ScholarshipApplicationCard({ application, onUpdate }: Props) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showAwardPrompt, setShowAwardPrompt] = useState(false);
    const [awardAmount, setAwardAmount] = useState('');
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
            label: 'Won',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            buttonBg: 'bg-green-500',
            buttonHover: 'hover:bg-green-600',
        },
        rejected: {
            label: 'Rejected',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            buttonBg: 'bg-red-500',
            buttonHover: 'hover:bg-red-600',
        },
        not_pursuing: {
            label: 'Not Pursuing',
            icon: EyeOff,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            buttonBg: 'bg-gray-400',
            buttonHover: 'hover:bg-gray-500',
        },
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    // 🎉 CONFETTI CELEBRATIONS - Different style for each milestone!
    const celebrateStartPlanning = () => {
        // Indigo sparkles - organized and ready!
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#818cf8', '#a5b4fc'], // Indigo shades
        });
    };

    const celebrateStartApplication = () => {
        // Cyan burst - you're doing it!
        confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#22d3ee', '#67e8f9'], // Cyan shades
            startVelocity: 30,
        });
    };

    const celebrateSubmitted = () => {
        // Purple fireworks - major milestone!
        const count = 100;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#9333ea', '#a855f7', '#c084fc'], // Purple shades
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

    const celebrateWon = () => {
        // MASSIVE GOLD CELEBRATION - YOU WON!!!
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#ffd700', '#ffed4e', '#fbbf24', '#f59e0b'], // Gold shades
            zIndex: 9999,
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        // Multiple bursts for maximum celebration!
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    // Get progression-based quick actions (main workflow)
    const getMainActions = (): Array<{ label: string; newStatus: ApplicationStatus; config: typeof statusConfig[ApplicationStatus]; requiresAmount?: boolean }> => {
        switch (status) {
            case 'interested':
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
                    { label: 'Won!', newStatus: 'accepted', config: statusConfig.accepted, requiresAmount: true },
                    { label: 'Rejected', newStatus: 'rejected', config: statusConfig.rejected },
                ];
            default:
                return [];
        }
    };

    const mainActions = getMainActions();

    const handleActionClick = (action: typeof mainActions[0]) => {
        if (action.requiresAmount) {
            setShowAwardPrompt(true);
        } else {
            // Celebrate before updating!
            if (action.newStatus === 'planning') {
                celebrateStartPlanning();
            } else if (action.newStatus === 'in_progress') {
                celebrateStartApplication();
            } else if (action.newStatus === 'submitted') {
                celebrateSubmitted();
            }

            updateStatus(action.newStatus);
        }
    };

    const handleWonWithAmount = async () => {
        const amount = awardAmount ? parseInt(awardAmount.replace(/[^0-9]/g, '')) : null;

        if (!amount || amount <= 0) {
            setError('Please enter a valid award amount');
            return;
        }

        // 🎉 BIGGEST CELEBRATION - YOU WON!!!
        celebrateWon();

        setShowAwardPrompt(false);
        await markAsAccepted(amount);
        setAwardAmount('');
    };

    const markAsAccepted = async (amount: number) => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const url = `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${application.id}/mark-accepted?award_amount=${amount}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark as accepted');
            }

            onUpdate();
        } catch (err) {
            console.error('Error marking as accepted:', err);
            setError(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setIsUpdating(false);
        }
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
            const token = localStorage.getItem('token');
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

            onUpdate();
        } catch (err) {
            console.error('Error deleting application:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete');
        } finally {
            setIsUpdating(false);
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

    const formatAmount = (min: number | null, max: number | null): string => {
        const minVal = min ?? 0;
        const maxVal = max ?? 0;

        if (minVal === maxVal) {
            return `$${minVal.toLocaleString()}`;
        }
        return `$${minVal.toLocaleString()} - $${maxVal.toLocaleString()}`;
    };

    const formatCurrency = (value: string): string => {
        const numbers = value.replace(/[^0-9]/g, '');
        if (!numbers) return '';
        return `$${parseInt(numbers).toLocaleString()}`;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all relative">
            {/* Award Amount Prompt Modal */}
            {showAwardPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            🎉 Congratulations!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            How much did you win for <strong>{scholarship.title}</strong>?
                        </p>
                        <input
                            type="text"
                            value={awardAmount}
                            onChange={(e) => setAwardAmount(formatCurrency(e.target.value))}
                            placeholder="$5,000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && awardAmount && !isUpdating) {
                                    handleWonWithAmount();
                                }
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowAwardPrompt(false);
                                    setAwardAmount('');
                                    setError(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWonWithAmount}
                                disabled={!awardAmount || isUpdating}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                </div>
            )}

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
                    Due: <span className="font-medium">
                        {formatDate(scholarship.deadline)}
                    </span>
                </span>
            </div>

            {/* Current Status Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.color} text-sm font-medium mb-3`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {currentStatus.label}
            </div>

            {/* Award Amount (if won) */}
            {status === 'accepted' && application.award_amount && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                        <strong>Awarded:</strong> ${application.award_amount.toLocaleString()}
                    </p>
                </div>
            )}

            {/* Main Action Buttons */}
            {mainActions.length > 0 && (
                <div className="flex gap-2 mb-2">
                    {mainActions.map((action) => (
                        <button
                            key={action.newStatus}
                            onClick={() => handleActionClick(action)}
                            disabled={isUpdating}
                            className={`
                                flex-1 px-3 py-2 rounded-lg font-medium text-sm text-white transition-colors
                                ${action.config.buttonBg} ${action.config.buttonHover}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isUpdating ? 'Updating...' : action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Not Pursuing Button */}
            {status !== 'not_pursuing' && status !== 'accepted' && status !== 'rejected' && (
                <button
                    onClick={() => updateStatus('not_pursuing')}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 rounded-lg font-medium text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdating ? 'Updating...' : 'Not Pursuing'}
                </button>
            )}

            {/* Error Message */}
            {error && !showAwardPrompt && (
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