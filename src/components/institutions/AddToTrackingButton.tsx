// src/components/institutions/AddToTrackingButton.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ApplicationType } from '@/types/college-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AddToTrackingButtonProps {
    institutionId: number;
    institutionName: string;
    variant?: 'button' | 'card';
    onSuccess?: () => void;
}

export default function AddToTrackingButton({
    institutionId,
    institutionName,
    variant = 'button',
    onSuccess,
}: AddToTrackingButtonProps) {
    const [isTracking, setIsTracking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [applicationType, setApplicationType] = useState<ApplicationType | ''>('');
    const [deadline, setDeadline] = useState('');
    const [notes, setNotes] = useState('');

    const handleQuickTrack = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to track colleges');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/college-tracking/applications`,
                {
                    institution_id: institutionId,
                    status: 'researching',
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to track college';
            if (errorMessage.includes('already in your tracking')) {
                setError('Already tracking this college');
            } else {
                setError(errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDetailedTrack = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to track colleges');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/college-tracking/applications`,
                {
                    institution_id: institutionId,
                    status: 'researching',
                    application_type: applicationType || undefined,
                    deadline: deadline || undefined,
                    notes: notes || undefined,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
            setShowModal(false);
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to track college';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <button
                disabled
                className={`
                    ${variant === 'button'
                        ? 'px-6 py-3 text-base'
                        : 'px-4 py-2 text-sm'
                    }
                    bg-green-600 text-white rounded-lg font-medium flex items-center gap-2
                `}
            >
                <Check className="h-5 w-5" />
                Tracking!
            </button>
        );
    }

    return (
        <>
            {variant === 'button' ? (
                <button
                    onClick={() => setShowModal(true)}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="h-5 w-5" />
                            Track This College
                        </>
                    )}
                </button>
            ) : (
                <button
                    onClick={handleQuickTrack}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Track
                        </>
                    )}
                </button>
            )}

            {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            {/* Modal for Detailed Tracking */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Track {institutionName}
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            {/* Application Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Type
                                </label>
                                <select
                                    value={applicationType}
                                    onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select type...</option>
                                    <option value="early_decision">Early Decision (ED)</option>
                                    <option value="early_action">Early Action (EA)</option>
                                    <option value="regular_decision">Regular Decision (RD)</option>
                                    <option value="rolling">Rolling Admissions</option>
                                </select>
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Deadline
                                </label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Add any notes about this application..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setError('');
                                }}
                                disabled={saving}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDetailedTrack}
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Start Tracking'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}