// src/app/profile/setup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUpload from '@/components/profile/ResumeUpload';
import { ResumeUploadResponse } from '@/types/profile';
import { Sparkles, Award } from 'lucide-react';
import HeadshotUpload from '@/components/profile/HeadshotUpload';
import SchoolMatches from '@/components/profile/SchoolMatches';

export default function ProfileSetupPage() {
    const router = useRouter();
    const [uploadResult, setUploadResult] = useState<ResumeUploadResponse | null>(null);
    const [error, setError] = useState<string>('');

    const handleUploadSuccess = (data: ResumeUploadResponse) => {
        setUploadResult(data);
        setError('');
    };

    const handleUploadError = (errorMsg: string) => {
        setError(errorMsg);
        setUploadResult(null);
    };

    const handleContinue = () => {
        router.push('/profile');
    };

    if (uploadResult) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Sparkles className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Profile Created Successfully!
                        </h1>
                        <p className="text-gray-600">
                            We analyzed your resume with {uploadResult.metadata.confidence_score * 100}% confidence
                        </p>
                    </div>

                    {/* Profile Summary */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {uploadResult.profile.high_school_name && (
                                <div>
                                    <p className="text-sm text-gray-500">High School</p>
                                    <p className="font-medium">{uploadResult.profile.high_school_name}</p>
                                </div>
                            )}
                            {uploadResult.profile.graduation_year && (
                                <div>
                                    <p className="text-sm text-gray-500">Graduation Year</p>
                                    <p className="font-medium">{uploadResult.profile.graduation_year}</p>
                                </div>
                            )}
                            {uploadResult.profile.gpa && (
                                <div>
                                    <p className="text-sm text-gray-500">GPA</p>
                                    <p className="font-medium">
                                        {uploadResult.profile.gpa}
                                        {uploadResult.profile.gpa_scale && ` (${uploadResult.profile.gpa_scale})`}
                                    </p>
                                </div>
                            )}
                            {uploadResult.profile.sat_score && (
                                <div>
                                    <p className="text-sm text-gray-500">SAT Score</p>
                                    <p className="font-medium">{uploadResult.profile.sat_score}</p>
                                </div>
                            )}
                            {uploadResult.profile.intended_major && (
                                <div>
                                    <p className="text-sm text-gray-500">Intended Major</p>
                                    <p className="font-medium">{uploadResult.profile.intended_major}</p>
                                </div>
                            )}
                            {uploadResult.profile.city && uploadResult.profile.state && (
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{uploadResult.profile.city}, {uploadResult.profile.state}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Profile Summary */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        {/* ... existing profile summary code ... */}
                    </div>

                    {/* ADD THIS NEW SECTION - Headshot Upload */}
                    <HeadshotUpload
                        currentImageUrl={uploadResult.profile.profile_image_url}
                        onUploadSuccess={(imageUrl) => {
                            setUploadResult({
                                ...uploadResult,
                                profile: {
                                    ...uploadResult.profile,
                                    profile_image_url: imageUrl
                                }
                            });
                        }}
                    />

                    {/* Scholarship Matches */}
                    {uploadResult.scholarship_matches && uploadResult.scholarship_matches.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    {uploadResult.scholarship_matches.length} Scholarship Matches Found!
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {uploadResult.scholarship_matches.slice(0, 5).map((scholarship) => (
                                    <div
                                        key={scholarship.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{scholarship.title}</h3>
                                                <p className="text-sm text-gray-600">{scholarship.organization}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    ${scholarship.amount_max.toLocaleString()}
                                                </p>
                                                {scholarship.deadline && (
                                                    <p className="text-xs text-gray-500">
                                                        Due: {new Date(scholarship.deadline).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {uploadResult.scholarship_matches.length > 5 && (
                                <p className="text-sm text-gray-600 text-center mt-4">
                                    + {uploadResult.scholarship_matches.length - 5} more scholarships
                                </p>
                            )}
                        </div>
                    )}

                    {/* School Matches - NEW SECTION */}
                    <SchoolMatches locationPreference={uploadResult.profile.location_preference} />

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/profile/edit')}
                            className="flex-1 py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={handleContinue}
                            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            View Full Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Set Up Your Profile
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload your resume and we'll automatically create your profile
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Upload Component */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <ResumeUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                    />
                </div>

                {/* Skip Option */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/profile/edit')}
                        className="text-gray-600 hover:text-gray-800 underline"
                    >
                        Skip and fill out manually
                    </button>
                </div>
            </div>
        </div>
    );
}