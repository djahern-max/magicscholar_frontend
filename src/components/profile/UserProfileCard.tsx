// src/components/profile/UserProfileCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UserProfile {
    profile_image_url?: string;
    first_name?: string;
    last_name?: string;
    high_school_name?: string;
    graduation_year?: number;
    city?: string;
    state?: string;
    intended_major?: string;
}

interface UserProfileCardProps {
    variant?: 'compact' | 'full';
}

export default function UserProfileCard({ variant = 'compact' }: UserProfileCardProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const fullName = profile.first_name && profile.last_name
        ? `${profile.first_name} ${profile.last_name}`
        : 'Student';

    if (variant === 'compact') {
        return (
            <button
                onClick={() => router.push('/profile')}
                className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow text-left group"
            >
                <div className="flex items-center gap-3">
                    {/* Profile Photo */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 flex-shrink-0">
                        {profile.profile_image_url ? (
                            <img
                                src={profile.profile_image_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-gray-500" />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {fullName}
                        </h3>
                        {profile.high_school_name && (
                            <p className="text-sm text-gray-600 truncate">
                                {profile.high_school_name}
                            </p>
                        )}
                    </div>
                </div>
            </button>
        );
    }

    // Full variant
    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
                {/* Profile Photo - Larger */}
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden border-4 border-white border-opacity-30 flex-shrink-0">
                    {profile.profile_image_url ? (
                        <img
                            src={profile.profile_image_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="h-8 w-8 text-white" />
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
                    {profile.high_school_name && (
                        <div className="flex items-center gap-2 text-blue-100">
                            <GraduationCap className="h-4 w-4" />
                            <span className="text-sm">
                                {profile.high_school_name}
                                {profile.graduation_year && ` • Class of ${profile.graduation_year}`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white border-opacity-20">
                {profile.city && profile.state && (
                    <div className="flex items-center gap-2 text-blue-100">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{profile.city}, {profile.state}</span>
                    </div>
                )}
                {profile.intended_major && (
                    <div className="flex items-center gap-2 text-blue-100">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">{profile.intended_major}</span>
                    </div>
                )}
            </div>

            {/* View Profile Button */}
            <button
                onClick={() => router.push('/profile')}
                className="w-full mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
                View Full Profile
            </button>
        </div>
    );
}