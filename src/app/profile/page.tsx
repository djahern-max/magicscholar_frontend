// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSummary from '@/components/profile/ProfileSummary';
import SchoolMatches from '@/components/profile/SchoolMatches';
import HeadshotUpload from '@/components/profile/HeadshotUpload';
import { UserProfile } from '@/types/profile';
import { profileService } from '@/lib/profileService';
import { Award, Upload } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    amount_min: number;
    amount_max: number;
    deadline?: string;
    min_gpa?: number;
    primary_image_url?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingScholarships, setLoadingScholarships] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const data = await profileService.getProfile(token);
            setProfile(data);

            // Load scholarships if GPA exists
            if (data.gpa) {
                loadScholarships(token, data.gpa);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadScholarships = async (token: string, gpa: number) => {
        setLoadingScholarships(true);
        try {
            // Using the scholarship search endpoint with GPA filter
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/scholarships/?limit=10`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Filter scholarships by GPA on frontend if needed
            const filtered = response.data.scholarships?.filter((s: Scholarship) =>
                !s.min_gpa || gpa >= s.min_gpa
            ) || [];

            setScholarships(filtered.slice(0, 10));
        } catch (error) {
            console.error('Error loading scholarships:', error);
        } finally {
            setLoadingScholarships(false);
        }
    };

    const handleHeadshotUpdate = (imageUrl: string) => {
        if (profile) {
            setProfile({
                ...profile,
                profile_image_url: imageUrl
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No profile found</p>
                    <button
                        onClick={() => router.push('/profile/setup')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header with Upload Resume Button */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-600">View and manage your profile information</p>
                    </div>
                    <button
                        onClick={() => router.push('/profile/setup')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        {profile.resume_url ? 'Update Resume' : 'Upload Resume'}
                    </button>
                </div>

                {/* Headshot Upload */}
                <HeadshotUpload
                    currentImageUrl={profile.profile_image_url}
                    onUploadSuccess={handleHeadshotUpdate}
                />

                {/* Profile Summary */}
                <div className="mt-6">
                    <ProfileSummary
                        profile={profile}
                        onEdit={() => router.push('/profile/edit')}
                    />
                </div>

                {/* Scholarship Matches */}
                {profile.gpa && (
                    <div className="mt-6">
                        {loadingScholarships ? (
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="ml-3 text-gray-600">Finding scholarships...</p>
                                </div>
                            </div>
                        ) : scholarships.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <Award className="h-6 w-6 text-yellow-500 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Scholarship Matches ({scholarships.length})
                                    </h2>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    Based on your GPA of {profile.gpa}, here are scholarships you may qualify for:
                                </p>

                                <div className="space-y-3">
                                    {scholarships.map((scholarship) => (
                                        <div
                                            key={scholarship.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => router.push(`/scholarship/${scholarship.id}`)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                        {scholarship.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">{scholarship.organization}</p>
                                                    {scholarship.min_gpa && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Min GPA: {scholarship.min_gpa}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-bold text-green-600">
                                                        ${scholarship.amount_max.toLocaleString()}
                                                    </p>
                                                    {scholarship.deadline && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Due: {new Date(scholarship.deadline).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => router.push('/scholarships')}
                                        className="flex-1 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                    >
                                        Browse Scholarships
                                    </button>
                                    <button
                                        onClick={() => router.push('/scholarships/dashboard')}
                                        className="flex-1 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        My Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-center">
                                    <Award className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Looking for Scholarships
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            We're constantly adding new scholarships. Check back soon!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* School Matches */}
                <div className="mt-6">
                    <SchoolMatches
                        locationPreference={profile.location_preference}
                        showPrompt={true}
                    />
                </div>
            </div>
        </div>
    );
}