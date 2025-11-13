// src/components/profile/SettingsToggle.tsx
'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export default function SettingsToggle() {
    const { settings, updateSettings } = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await updateSettings({ confetti_enabled: !settings.confetti_enabled });
        } catch (err) {
            console.error('Failed to update setting:', err);
            setError('Failed to update setting. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Confetti Effects 🎉</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Show celebratory confetti when you complete actions
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={isSaving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.confetti_enabled ? 'bg-blue-600' : 'bg-gray-200'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    aria-label={`Toggle confetti effects ${settings.confetti_enabled ? 'off' : 'on'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${settings.confetti_enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                    {error}
                </div>
            )}

            {isSaving && (
                <div className="text-sm text-gray-600">
                    Saving...
                </div>
            )}
        </div>
    );
}