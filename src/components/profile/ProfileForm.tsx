// src/components/profile/ProfileForm.tsx
'use client';

import React, { useState } from 'react';
import { UserProfile, ProfileUpdateData, ExtracurricularActivity } from '@/types/profile';
import SchoolMatches from './SchoolMatches';
import { Plus, X, AlertCircle } from 'lucide-react';

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

export default function ProfileFormEnhanced({ profile, onSave, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState<any>({
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
        extracurriculars: profile.extracurriculars || [],
    });

    const [previewState, setPreviewState] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convert numeric fields
        let processedValue: any = value;
        if (['graduation_year', 'sat_score', 'act_score', 'volunteer_hours'].includes(name)) {
            processedValue = value ? parseInt(value) : undefined;
        } else if (name === 'gpa') {
            processedValue = value ? parseFloat(value) : undefined;
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: processedValue
        }));

        // Clear validation errors when user starts fixing them
        if (validationErrors.length > 0) {
            setValidationErrors([]);
        }
    };

    // Extracurricular management
    const addExtracurricular = () => {
        setFormData((prev: any) => ({
            ...prev,
            extracurriculars: [
                ...(prev.extracurriculars || []),
                { name: '', role: '', description: '', years_active: '' }
            ]
        }));
    };

    const updateExtracurricular = (index: number, field: string, value: string) => {
        const updated = [...(formData.extracurriculars || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData((prev: any) => ({
            ...prev,
            extracurriculars: updated
        }));
    };

    const removeExtracurricular = (index: number) => {
        const updated = (formData.extracurriculars || []).filter((_: any, i: number) => i !== index);
        setFormData((prev: any) => ({
            ...prev,
            extracurriculars: updated
        }));
    };

    // Validate form before submission
    const validateForm = (): boolean => {
        const errors: string[] = [];

        // High school is required
        if (!formData.high_school_name || formData.high_school_name.trim() === '') {
            errors.push('High School Name is required');
        }

        // Location preference must be either empty or a valid 2-char state code
        // If empty string, convert to null for backend
        if (formData.location_preference === '') {
            // This is OK - will be sent as null
        } else if (formData.location_preference && formData.location_preference.length !== 2) {
            errors.push('College Preference must be a valid state or left blank');
        }

        // Extracurriculars with empty names should be filtered out
        // (but don't show error - just filter them)

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError('');
        setValidationErrors([]);

        // Validate form
        if (!validateForm()) {
            setError('Please fix the validation errors below');
            return;
        }

        setSaving(true);

        try {
            // Prepare data for submission
            const submitData = { ...formData };

            // Convert empty location_preference to null (backend expects null, not empty string)
            if (submitData.location_preference === '') {
                submitData.location_preference = null;
            }

            // Filter out extracurriculars with empty names
            if (submitData.extracurriculars) {
                submitData.extracurriculars = submitData.extracurriculars.filter(
                    (activity: any) => activity.name && activity.name.trim() !== ''
                );
            }

            // Convert empty strings to null for optional numeric fields
            if (submitData.graduation_year === undefined) {
                submitData.graduation_year = null;
            }
            if (submitData.gpa === undefined) {
                submitData.gpa = null;
            }
            if (submitData.sat_score === undefined) {
                submitData.sat_score = null;
            }
            if (submitData.act_score === undefined) {
                submitData.act_score = null;
            }
            if (submitData.volunteer_hours === undefined) {
                submitData.volunteer_hours = null;
            }

            await onSave(submitData);
        } catch (err: any) {
            console.error('Save error:', err);

            // Parse backend validation errors
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;

                if (Array.isArray(detail)) {
                    // Pydantic validation errors
                    const backendErrors = detail.map((e: any) => {
                        const field = e.loc?.join(' > ') || 'Unknown field';
                        return `${field}: ${e.msg}`;
                    });
                    setValidationErrors(backendErrors);
                    setError('Validation failed. Please check the errors below.');
                } else if (typeof detail === 'string') {
                    setError(detail);
                } else {
                    setError('Failed to save profile');
                }
            } else {
                setError(err.message || 'Failed to save profile');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {(error || validationErrors.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    {error && (
                        <div className="flex items-start mb-2">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    )}
                    {validationErrors.length > 0 && (
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1 mt-2">
                            {validationErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <p className="text-xs text-gray-500 mt-1">Required to save your profile</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Graduation Year
                            </label>
                            <input
                                type="number"
                                name="graduation_year"
                                value={formData.graduation_year || ''}
                                onChange={handleChange}
                                min="2020"
                                max="2035"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="2025"
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GPA
                            </label>
                            <input
                                type="number"
                                name="gpa"
                                value={formData.gpa || ''}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="3.8"
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
                                <option value="4.0">4.0</option>
                                <option value="5.0">5.0</option>
                                <option value="100">100</option>
                                <option value="weighted">Weighted</option>
                                <option value="unweighted">Unweighted</option>
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

                    {/* Extracurriculars Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Extracurricular Activities
                            </label>
                            <button
                                type="button"
                                onClick={addExtracurricular}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                Add Activity
                            </button>
                        </div>

                        {(!formData.extracurriculars || formData.extracurriculars.length === 0) && (
                            <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-200">
                                No extracurricular activities added yet. Click "Add Activity" to get started.
                            </p>
                        )}

                        <div className="space-y-4">
                            {formData.extracurriculars?.map((activity: any, index: number) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-sm font-medium text-gray-900">Activity {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeExtracurricular(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Activity Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={activity.name || ''}
                                                onChange={(e) => updateExtracurricular(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="e.g., Varsity Soccer, Debate Club"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Role/Position
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activity.role || ''}
                                                    onChange={(e) => updateExtracurricular(index, 'role', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    placeholder="e.g., Captain, Member"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Years Active
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activity.years_active || ''}
                                                    onChange={(e) => updateExtracurricular(index, 'years_active', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    placeholder="e.g., 2022-2025"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={activity.description || ''}
                                                onChange={(e) => updateExtracurricular(index, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Brief description of your involvement and achievements"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* College Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">College Preferences</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred State for College <span className="text-gray-400">(Optional)</span>
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
                        <option value="">Any State (No Preference)</option>
                        {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        {formData.location_preference
                            ? "We'll show you colleges in your preferred state"
                            : "Leave blank to see colleges from all states"
                        }
                    </p>
                </div>

                {/* Preview matching schools */}
                {(formData.location_preference || previewState) && (
                    <div className="mt-6">
                        <SchoolMatches locationPreference={formData.location_preference || previewState} />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
