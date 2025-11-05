// src/components/profile/ProfileSummary.tsx
'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import {
    GraduationCap,
    MapPin,
    BookOpen,
    TrendingUp,
    Award,
    Heart,
    Briefcase,
    Star
} from 'lucide-react';

interface ProfileSummaryProps {
    profile: UserProfile;
    onEdit?: () => void;
}

export default function ProfileSummary({ profile, onEdit }: ProfileSummaryProps) {
    const completionPercentage = calculateCompletion(profile);

    return (
        <div className="space-y-6">
            {/* Completion Bar */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                    <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
                {completionPercentage < 100 && (
                    <p className="text-sm text-gray-600 mt-2">
                        Complete your profile to get better scholarship matches
                    </p>
                )}
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </div>
                <div className="space-y-2">
                    {profile.city && profile.state ? (
                        <p className="text-gray-700">{profile.city}, {profile.state} {profile.zip_code}</p>
                    ) : (
                        <p className="text-gray-500 italic">No location set</p>
                    )}
                </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="High School" value={profile.high_school_name} />
                    <InfoItem label="Graduation Year" value={profile.graduation_year} />
                    <InfoItem
                        label="GPA"
                        value={profile.gpa ? `${profile.gpa}${profile.gpa_scale ? ` (${profile.gpa_scale})` : ''}` : undefined}
                    />
                    <InfoItem label="SAT Score" value={profile.sat_score} />
                    <InfoItem label="ACT Score" value={profile.act_score} />
                    <InfoItem label="Intended Major" value={profile.intended_major} />
                </div>
            </div>

            {/* Career Goals */}
            {profile.career_goals && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Career Goals</h3>
                    </div>
                    <p className="text-gray-700">{profile.career_goals}</p>
                </div>
            )}

            {/* Activities & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracurriculars */}
                {profile.extracurriculars && profile.extracurriculars.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <Star className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Extracurriculars</h3>
                        </div>
                        <div className="space-y-3">
                            {profile.extracurriculars.map((activity, index) => (
                                <div key={index} className="border-l-4 border-blue-200 pl-3">
                                    <p className="font-medium text-gray-900">{activity.name}</p>
                                    {activity.role && (
                                        <p className="text-sm text-gray-600">{activity.role}</p>
                                    )}
                                    {activity.years_active && (
                                        <p className="text-xs text-gray-500">{activity.years_active}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Work Experience */}
                {profile.work_experience && profile.work_experience.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                        </div>
                        <div className="space-y-3">
                            {profile.work_experience.map((job, index) => (
                                <div key={index} className="border-l-4 border-green-200 pl-3">
                                    <p className="font-medium text-gray-900">{job.title}</p>
                                    <p className="text-sm text-gray-600">{job.organization}</p>
                                    {job.dates && (
                                        <p className="text-xs text-gray-500">{job.dates}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Volunteer Hours */}
            {profile.volunteer_hours !== undefined && profile.volunteer_hours > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <Heart className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Community Service</h3>
                    </div>
                    <p className="text-gray-700">
                        <span className="text-2xl font-bold text-blue-600">{profile.volunteer_hours}</span> volunteer hours
                    </p>
                </div>
            )}

            {/* Honors & Awards */}
            {profile.honors_awards && profile.honors_awards.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <Award className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Honors & Awards</h3>
                    </div>
                    <ul className="space-y-2">
                        {profile.honors_awards.map((award, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span className="text-gray-700">{award}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* College Preferences */}
            {profile.location_preference && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">College Preferences</h3>
                    </div>
                    <p className="text-gray-700">
                        Interested in colleges in: <span className="font-semibold">{profile.location_preference}</span>
                    </p>
                </div>
            )}

            {/* Edit Button */}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Edit Profile
                </button>
            )}
        </div>
    );
}

// Helper Components
function InfoItem({ label, value }: { label: string; value: any }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900">
                {value || <span className="text-gray-400 italic">Not set</span>}
            </p>
        </div>
    );
}

// Helper Function
function calculateCompletion(profile: UserProfile): number {
    const fields = [
        profile.state,
        profile.city,
        profile.high_school_name,
        profile.graduation_year,
        profile.gpa,
        profile.gpa_scale,
        profile.sat_score || profile.act_score,
        profile.intended_major,
        profile.career_goals,
        profile.volunteer_hours,
        profile.location_preference,
    ];

    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
}