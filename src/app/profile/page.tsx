'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface School {
    id: number;
    name: string;
    city: string;
    state: string;
    control_type: string;
}

interface ProfileData {
    state: string | null;
    city: string | null;
    zip_code: string | null;
    high_school_name: string | null;
    graduation_year: number | null;
    gpa: number | null;
    gpa_scale: string | null;
    sat_score: number | null;
    act_score: number | null;
    intended_major: string | null;
    location_preference: string | null;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [schoolMatches, setSchoolMatches] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllSchools, setShowAllSchools] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const profileRes = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData(data);
            }

            const schoolsRes = await fetch(`${API_BASE_URL}/api/v1/profiles/me/matching-institutions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (schoolsRes.ok) {
                const schools = await schoolsRes.json();
                setSchoolMatches(schools || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const countFilledFields = (profile: ProfileData | null): number => {
        if (!profile) return 0;
        let count = 0;
        if (profile.state) count++;
        if (profile.city) count++;
        if (profile.zip_code) count++;
        if (profile.high_school_name) count++;
        if (profile.graduation_year) count++;
        if (profile.gpa) count++;
        if (profile.gpa_scale) count++;
        if (profile.sat_score) count++;
        if (profile.act_score) count++;
        if (profile.intended_major) count++;
        if (profile.location_preference) count++;
        return count;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const totalFields = 11;
    const filledFields = countFilledFields(profileData);
    const completion = Math.round((filledFields / totalFields) * 100);
    const hasPreference = profileData?.location_preference;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Profile</h1>
                    <p className="text-slate-600">Manage your information and discover matching schools</p>
                </div>

                {/* Profile Completion Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold text-slate-900">Profile Completion</h2>
                        <span className="text-2xl font-bold text-blue-600">{completion}%</span>
                    </div>
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completion}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                        {filledFields} of {totalFields} fields completed
                    </p>
                </div>

                {/* Get Started CTA */}
                {!hasPreference && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Get Started</h3>
                                <p className="text-slate-700 mb-4">
                                    Tell us where you want to go to school and we'll show you matching institutions instantly!
                                </p>
                                <button
                                    onClick={() => router.push('/profile/edit')}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    Set Your Preferences →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* School Matches */}
                {hasPreference && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your School Matches</h3>
                            <p className="text-slate-700">
                                <span className="font-semibold text-emerald-700">{schoolMatches.length} schools</span> found in {' '}
                                <span className="font-semibold text-emerald-700">{profileData?.location_preference}</span>
                            </p>
                        </div>

                        {schoolMatches.length > 0 ? (
                            <div>
                                <div className="divide-y divide-slate-100">
                                    {schoolMatches.slice(0, showAllSchools ? schoolMatches.length : 5).map((school) => (
                                        <div
                                            key={school.id}
                                            onClick={() => router.push(`/institution/${school.id}`)}
                                            className="p-5 hover:bg-slate-50 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {school.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                                                        <span className="flex items-center gap-1">
                                                            📍 {school.city}, {school.state}
                                                        </span>
                                                        <span className="text-slate-400">•</span>
                                                        <span className="capitalize">
                                                            {school.control_type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {schoolMatches.length > 5 && (
                                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                                        <button
                                            onClick={() => setShowAllSchools(!showAllSchools)}
                                            className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            {showAllSchools
                                                ? '↑ Show less'
                                                : `↓ Show ${schoolMatches.length - 5} more schools`
                                            }
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-600">
                                <p className="mb-2">No schools found in your selected state.</p>
                                <button
                                    onClick={() => router.push('/profile/edit')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Try a different state →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Information */}
                {profileData && filledFields > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileData.location_preference && (
                                <InfoItem label="Preferred State" value={profileData.location_preference} />
                            )}
                            {profileData.state && (
                                <InfoItem label="Home State" value={profileData.state} />
                            )}
                            {profileData.city && (
                                <InfoItem label="City" value={profileData.city} />
                            )}
                            {profileData.high_school_name && (
                                <InfoItem label="High School" value={profileData.high_school_name} />
                            )}
                            {profileData.graduation_year && (
                                <InfoItem label="Graduation Year" value={profileData.graduation_year.toString()} />
                            )}
                            {profileData.gpa && (
                                <InfoItem
                                    label="GPA"
                                    value={`${profileData.gpa}${profileData.gpa_scale ? ` (${profileData.gpa_scale})` : ''}`}
                                />
                            )}
                            {profileData.sat_score && (
                                <InfoItem label="SAT Score" value={profileData.sat_score.toString()} />
                            )}
                            {profileData.act_score && (
                                <InfoItem label="ACT Score" value={profileData.act_score.toString()} />
                            )}
                            {profileData.intended_major && (
                                <InfoItem label="Intended Major" value={profileData.intended_major} />
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => router.push('/profile/edit')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                        {hasPreference ? 'Edit Preferences' : 'Get Started'}
                    </button>
                    <button
                        onClick={() => router.push('/scholarships')}
                        className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                    >
                        Browse Scholarships
                    </button>
                    <button
                        onClick={loadData}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Coming Soon */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span>🚀</span> Coming Soon
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▸</span>
                            <span>Match by school size (small, medium, large)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▸</span>
                            <span>Match by tuition budget</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▸</span>
                            <span>Match by public vs private schools</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▸</span>
                            <span>Match by intended major programs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▸</span>
                            <span>Scholarship recommendations based on your profile</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                {label}
            </div>
            <div className="text-slate-900 font-medium">
                {value}
            </div>
        </div>
    );
}