// src/components/institutions/AddToTrackingButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Plus, Check, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AddToTrackingButtonProps {
    institutionId: number;
    institutionName: string;
    variant?: 'button' | 'compact';
    onSuccess?: () => void;
}

export default function AddToTrackingButton({
    institutionId,
    institutionName,
    variant = 'button',
    onSuccess,
}: AddToTrackingButtonProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleQuickTrack = async () => {
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/college-tracking/applications`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        institution_id: institutionId,
                        status: 'researching',
                        // Optional fields can be added later from dashboard
                    }),
                }
            );

            if (response.status === 201) {
                // Success! 🎉 Celebrate with confetti
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
                });

                setSuccess(true);

                // Brief success message, then offer to view dashboard
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        // Default: redirect to college dashboard
                        router.push('/colleges/dashboard');
                    }
                }, 1500);
            } else if (response.status === 400) {
                // Already tracked
                const data = await response.json();
                if (data.detail?.includes('already')) {
                    setError('Already tracking this college!');
                    // Redirect to dashboard after brief delay
                    setTimeout(() => {
                        router.push('/colleges/dashboard');
                    }, 2000);
                } else {
                    setError(data.detail || 'Failed to track college');
                }
            } else {
                throw new Error('Failed to track college');
            }
        } catch (err: any) {
            console.error('Error tracking college:', err);
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
                    bg-green-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-md
                `}
            >
                <Check className="h-5 w-5" />
                Tracking! Redirecting...
            </button>
        );
    }

    return (
        <div className="space-y-2">
            {variant === 'button' ? (
                <button
                    onClick={handleQuickTrack}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Track College
                        </>
                    )}
                </button>
            )}

            {error && (
                <div className="px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}