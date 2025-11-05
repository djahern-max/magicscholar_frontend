// src/components/profile/ProfileForm.tsx
'use client';

import React, { useState } from 'react';
import { UserProfile, ProfileUpdateData } from '@/types/profile';
import SchoolMatches from './SchoolMatches';

interface ProfileFormProps {
    profile: UserProfile;
    onSave: (data: ProfileUpdateData) => Promise<void>;
    onCancel?: () => void;
}

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState<ProfileUpdateData>({
        state: profile.state || '',
        city: profile.city || '',
        zip_code: profile.zip_code || '',
        high_school_name: profile.high_school_name || '',
        graduation_year: profile.graduation_year || undefined,
        gpa: profile.gpa || undefined,
        gpa_scale: profile.gpa_scale || '4.0',
        sat_score: profile.sat_score || undefined,
        act_score: profile.act_score || undefined,
        intended_major: profile.intended_major || '',
        career_goals: profile.career_goals || '',
        volunteer_hours: profile.volunteer_hours || undefined,
        location_preference: profile.location_preference || '',
    });

    const [previewState, setPreviewState] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convert numeric fields
        let processedValue: any = value;
        if (['graduation_year', 'sat_score', 'act_score', 'volunteer_hours'].includes(name)) {
            processedValue = value ? parseInt(value) : undefined;
        } else if (name === 'gpa') {
            processedValue = value ? parseFloat(value) : undefined;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select State</option>
                            {US_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Manchester"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleChange}
                            maxLength={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="03101"
                        />
                    </div>
                </div>
            </div>

            {/* Academic Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            High School Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="high_school_name"
                            value={formData.high_school_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Lincoln High School"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Graduation Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="graduation_year"
                                value={formData.graduation_year || ''}
                                onChange={handleChange}
                                min="2020"
                                max="2035"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="2026"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Intended Major
                            </label>
                            <input
                                type="text"
                                name="intended_major"
                                value={formData.intended_major}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Computer Science"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GPA <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="gpa"
                                value={formData.gpa || ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                max="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="3.75"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GPA Scale
                            </label>
                            <select
                                name="gpa_scale"
                                value={formData.gpa_scale}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="4.0">4.0 (Unweighted)</option>
                                <option value="5.0">5.0 (Weighted)</option>
                                <option value="weighted">Weighted</option>
                                <option value="unweighted">Unweighted</option>
                                <option value="100">100 Point Scale</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SAT Score
                            </label>
                            <input
                                type="number"
                                name="sat_score"
                                value={formData.sat_score || ''}
                                onChange={handleChange}
                                min="400"
                                max="1600"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1450"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ACT Score
                            </label>
                            <input
                                type="number"
                                name="act_score"
                                value={formData.act_score || ''}
                                onChange={handleChange}
                                min="1"
                                max="36"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="32"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Career & Activities Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career & Activities</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Career Goals
                        </label>
                        <textarea
                            name="career_goals"
                            value={formData.career_goals}
                            onChange={handleChange}
                            rows={3}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What are your career aspirations?"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.career_goals?.length || 0}/500 characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Volunteer Hours
                        </label>
                        <input
                            type="number"
                            name="volunteer_hours"
                            value={formData.volunteer_hours || ''}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="50"
                        />
                    </div>
                </div>
            </div>

            {/* College Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">College Preferences</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred State for College
                    </label>
                    <select
                        name="location_preference"
                        value={formData.location_preference}
                        onChange={(e) => {
                            handleChange(e);
                            setPreviewState(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Any State</option>
                        {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        This helps us match you with colleges in your preferred location
                    </p>
                </div>
            </div>

            {previewState && (
                <div className="mt-4">
                    <SchoolMatches locationPreference={previewState} />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}