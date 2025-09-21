// Create this file: src/app/profile/setup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProfileData {
    academic_level: string;
    field_of_study: string;
    gpa: string;
    graduation_year: string;
    location: string;
    financial_need: string;
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        academic_level: '',
        field_of_study: '',
        gpa: '',
        graduation_year: '',
        location: '',
        financial_need: ''
    });

    useEffect(() => {
        // Verify user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        // Fetch current user data
        fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : null)
            .then(userData => {
                if (userData) {
                    setUser(userData);
                } else {
                    router.push('/');
                }
            })
            .catch(() => router.push('/'));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/v1/profile/setup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                console.log('Profile setup completed successfully');
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Profile setup failed');
            }
        } catch (err) {
            console.error('Profile setup error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        // Allow users to skip profile setup for now
        router.push('/dashboard');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
                    <p className="mt-2 text-gray-600">
                        Help us find the best scholarships for you by completing your profile.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Academic Level
                            </label>
                            <select
                                value={profileData.academic_level}
                                onChange={(e) => setProfileData(prev => ({ ...prev, academic_level: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select level</option>
                                <option value="high_school">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                                <option value="doctorate">Doctorate</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Field of Study
                            </label>
                            <input
                                type="text"
                                value={profileData.field_of_study}
                                onChange={(e) => setProfileData(prev => ({ ...prev, field_of_study: e.target.value }))}
                                placeholder="e.g., Computer Science, Business, Medicine"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GPA (Optional)
                            </label>
                            <input
                                type="text"
                                value={profileData.gpa}
                                onChange={(e) => setProfileData(prev => ({ ...prev, gpa: e.target.value }))}
                                placeholder="e.g., 3.8"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Graduation Year
                            </label>
                            <select
                                value={profileData.graduation_year}
                                onChange={(e) => setProfileData(prev => ({ ...prev, graduation_year: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select year</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="City, State"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Financial Need Level
                            </label>
                            <select
                                value={profileData.financial_need}
                                onChange={(e) => setProfileData(prev => ({ ...prev, financial_need: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select level</option>
                                <option value="high">High - Significant financial need</option>
                                <option value="medium">Medium - Some financial assistance needed</option>
                                <option value="low">Low - Limited financial need</option>
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading ? 'Saving...' : 'Complete Profile'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}