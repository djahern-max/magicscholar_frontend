// src/app/profile/setup/page.tsx - Simplified version
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Common majors list - you can expand this
const COMMON_MAJORS = [
    'Business Administration',
    'Computer Science',
    'Engineering',
    'Psychology',
    'Biology',
    'English',
    'Communications',
    'Political Science',
    'Economics',
    'Pre-Med',
    'Education',
    'Art/Design',
    'Mathematics',
    'History',
    'Nursing',
    'Criminal Justice',
    'Marketing',
    'Finance',
    'Sociology',
    'Environmental Science',
    'Undecided'
];

// State options using your existing state data
const STATE_OPTIONS = [
    { code: 'NH', name: 'New Hampshire', icon: '🏔️' },
    { code: 'MA', name: 'Massachusetts', icon: '🎓' },
    { code: 'CT', name: 'Connecticut', icon: '🌳' },
    { code: 'VT', name: 'Vermont', icon: '🍁' },
    { code: 'ME', name: 'Maine', icon: '🦞' },
    // Add more states as you expand
];

interface SimpleProfileData {
    gpa?: string;
    intended_majors: string[];
    preferred_states: string[];
    graduation_year: string;
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const [profileData, setProfileData] = useState<SimpleProfileData>({
        gpa: '',
        intended_majors: [],
        preferred_states: [],
        graduation_year: ''
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

    const handleMajorToggle = (major: string) => {
        setProfileData(prev => ({
            ...prev,
            intended_majors: prev.intended_majors.includes(major)
                ? prev.intended_majors.filter(m => m !== major)
                : [...prev.intended_majors, major]
        }));
    };

    const handleStateToggle = (stateCode: string) => {
        setProfileData(prev => ({
            ...prev,
            preferred_states: prev.preferred_states.includes(stateCode)
                ? prev.preferred_states.filter(s => s !== stateCode)
                : [...prev.preferred_states, stateCode]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Transform the simple data into your backend's ProfileCreate format
            const backendData = {
                // Required/main fields from our simple form
                graduation_year: parseInt(profileData.graduation_year),
                gpa: profileData.gpa ? parseFloat(profileData.gpa) : null,
                intended_major: profileData.intended_majors[0] || 'Undecided',
                state: profileData.preferred_states[0] || '',

                // Set reasonable defaults for other expected fields
                high_school_name: '', // Optional in schema
                gpa_scale: '4.0',
                academic_interests: profileData.intended_majors,

                // Optional fields with defaults
                sat_score: null,
                act_score: null,
                secondary_major: null,
                minor_interests: profileData.intended_majors.slice(1), // Additional majors as minors
                career_goals: [],

                // Additional data for future use - store as empty arrays/objects
                ap_courses: [],
                honors_courses: [],
                dual_enrollment: false,
                class_rank: null,
                extracurricular_activities: {},
                volunteer_experience: {},
                volunteer_hours: null,
                leadership_positions: {},
                work_experience: {},
                awards_honors: [],

                // Demographics - all optional
                ethnicity: null,
                first_generation_college: null,
                family_income_range: null,
                household_size: null,

                // College preferences - use correct data types based on schema
                preferred_states: profileData.preferred_states,
                preferred_college_size: null, // CollegeSize enum: very_small, small, medium, large, very_large
                max_tuition_budget: null,
                financial_aid_needed: null,
                work_study_interest: false,
                campus_setting: [], // Array of strings like ["urban", "suburban", "rural"]
                religious_affiliation: null,
                greek_life_interest: null,
                research_opportunities_important: false,
                study_abroad_interest: false,

                // Essays and other fields
                has_personal_statement: false,
                has_leadership_essay: false,
                has_challenges_essay: false,
                has_diversity_essay: false,
                has_community_service_essay: false,
                has_academic_interest_essay: false,

                // Scholarship preferences from schema
                scholarship_types_interested: [],
                application_deadline_preference: null,
                min_scholarship_amount: null,
                renewable_scholarships_only: false,
                local_scholarships_priority: true,

                // Additional information
                languages_spoken: [],
                special_talents: [],
                certifications: [],
                additional_notes: null,

                // Parent/guardian information (if in schema)
                parent_education_level: null,
                parent_occupation: null,
                parent_employer: null
            };

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Set Up Your Profile</h1>
                    <p className="mt-2 text-gray-600">
                        Help us recommend the best schools and scholarships for you
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* GPA Section */}
                        <div>
                            <div className="flex items-center mb-3">
                                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current GPA (optional)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4.0"
                                        value={profileData.gpa}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, gpa: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 3.75"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave blank if not applicable</p>
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
                                        {Array.from({ length: 8 }, (_, i) => {
                                            const year = new Date().getFullYear() + i;
                                            return (
                                                <option key={year} value={year.toString()}>{year}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Intended Majors Section */}
                        <div>
                            <div className="flex items-center mb-3">
                                <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Academic Interests</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Intended Majors (select all that interest you)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {COMMON_MAJORS.map((major) => (
                                        <label key={major} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profileData.intended_majors.includes(major)}
                                                onChange={() => handleMajorToggle(major)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{major}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Selected: {profileData.intended_majors.length} major{profileData.intended_majors.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Preferred States Section */}
                        <div>
                            <div className="flex items-center mb-3">
                                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Location Preferences</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Preferred States (select all that interest you)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {STATE_OPTIONS.map((state) => (
                                        <button
                                            key={state.code}
                                            type="button"
                                            onClick={() => handleStateToggle(state.code)}
                                            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${profileData.preferred_states.includes(state.code)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span className="mr-2">{state.icon}</span>
                                            {state.name}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Selected: {profileData.preferred_states.length} state{profileData.preferred_states.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading || !profileData.graduation_year}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading ? 'Saving Profile...' : 'Complete Setup'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            You can always update your profile later to get better recommendations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}