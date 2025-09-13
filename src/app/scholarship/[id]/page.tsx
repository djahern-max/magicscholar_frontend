// src/app/scholarship/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    DollarSign,
    ExternalLink,
    Calendar,
    Clock,
    Award,
    Users,
    GraduationCap,
    FileText,
    CheckCircle,
    AlertCircle,
    Globe,
    BookOpen
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Scholarship {
    id: number;
    title: string;
    description: string;
    organization: string;
    website_url?: string;
    application_url?: string;
    scholarship_type: string;
    categories?: string[];
    status: string;
    difficulty_level: string;
    amount_min?: number;
    amount_max?: number;
    amount_exact?: number;
    is_renewable: boolean;
    renewal_years?: number;
    number_of_awards?: number;
    min_gpa?: number;
    max_gpa?: number;
    min_sat_score?: number;
    min_act_score?: number;
    required_majors?: string[];
    academic_level?: string[];
    eligible_ethnicities?: string[];
    income_max?: number;
    need_based_required: boolean;
    eligible_states?: string[];
    international_students_eligible: boolean;
    first_generation_college_required?: boolean;
    required_activities?: string[];
    volunteer_hours_min?: number;
    leadership_required: boolean;
    essay_required: boolean;
    essay_topics?: string[];
    essay_word_limit?: number;
    transcript_required: boolean;
    recommendation_letters_required: number;
    interview_required: boolean;
    personal_statement_required: boolean;
    deadline?: string;
    primary_image_url?: string;
    logo_image_url?: string;
    created_at: string;
}

export default function ScholarshipDetailPage() {
    const params = useParams();
    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/scholarships/${params.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setScholarship(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching scholarship:', err);
                setError('Failed to load scholarship details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchScholarship();
        }
    }, [params.id]);

    const getScholarshipTypeDisplay = (type: string) => {
        const types: { [key: string]: string } = {
            'academic_merit': 'Academic Merit',
            'need_based': 'Need-Based',
            'athletic': 'Athletic',
            'stem': 'STEM',
            'arts': 'Arts & Humanities',
            'diversity': 'Diversity & Inclusion',
            'first_generation': 'First Generation',
            'community_service': 'Community Service',
            'leadership': 'Leadership',
            'local_community': 'Local Community',
            'employer_sponsored': 'Employer Sponsored',
            'military': 'Military',
            'religious': 'Religious',
            'career_specific': 'Career-Specific',
            'essay_based': 'Essay Competition',
            'renewable': 'Renewable'
        };
        return types[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getDifficultyColor = (difficulty: string) => {
        const colors: { [key: string]: string } = {
            'easy': 'text-green-600 bg-green-50',
            'moderate': 'text-yellow-600 bg-yellow-50',
            'hard': 'text-orange-600 bg-orange-50',
            'very_hard': 'text-red-600 bg-red-50'
        };
        return colors[difficulty] || 'text-gray-600 bg-gray-50';
    };

    const formatAmount = (scholarship: Scholarship) => {
        if (scholarship.amount_exact) {
            return `$${scholarship.amount_exact.toLocaleString()}`;
        }
        if (scholarship.amount_min && scholarship.amount_max) {
            return `$${scholarship.amount_min.toLocaleString()} - $${scholarship.amount_max.toLocaleString()}`;
        }
        if (scholarship.amount_min) {
            return `$${scholarship.amount_min.toLocaleString()}+`;
        }
        if (scholarship.amount_max) {
            return `Up to $${scholarship.amount_max.toLocaleString()}`;
        }
        return 'Amount varies';
    };

    const formatDeadline = (deadline?: string) => {
        if (!deadline) return 'No deadline specified';
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading scholarship details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !scholarship) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="text-red-800">
                            <AlertCircle className="w-5 h-5 inline mr-2" />
                            {error || 'Scholarship not found'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Scholarship Image */}
                        <div className="lg:col-span-1">
                            <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                                {scholarship.primary_image_url || scholarship.logo_image_url ? (
                                    <img
                                        src={scholarship.primary_image_url || scholarship.logo_image_url}
                                        alt={scholarship.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                        <Award className="w-16 h-16 text-blue-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {scholarship.title}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-4">
                                        {scholarship.organization}
                                    </p>
                                </div>

                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(scholarship.difficulty_level)}`}>
                                    {scholarship.difficulty_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>

                            {/* Key Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                                    <div>
                                        <div className="font-semibold text-green-600">{formatAmount(scholarship)}</div>
                                        {scholarship.is_renewable && scholarship.renewal_years && (
                                            <div className="text-sm text-gray-500">Renewable for {scholarship.renewal_years} years</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                                    <div>
                                        <div className="font-medium">Application Deadline</div>
                                        <div className="text-sm text-gray-600">{formatDeadline(scholarship.deadline)}</div>
                                    </div>
                                </div>

                                {scholarship.number_of_awards && (
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-purple-500 mr-2" />
                                        <div>
                                            <div className="font-medium">{scholarship.number_of_awards} Awards</div>
                                            <div className="text-sm text-gray-600">Available annually</div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <GraduationCap className="w-5 h-5 text-indigo-500 mr-2" />
                                    <div>
                                        <div className="font-medium">{getScholarshipTypeDisplay(scholarship.scholarship_type)}</div>
                                        <div className="text-sm text-gray-600">Scholarship type</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                {scholarship.application_url && (
                                    <a
                                        href={scholarship.application_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Apply Now
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                )}
                                {scholarship.website_url && (
                                    <a
                                        href={scholarship.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Description */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Scholarship</h2>
                    <p className="text-gray-700 leading-relaxed">{scholarship.description}</p>

                    {/* Categories */}
                    {scholarship.categories && scholarship.categories.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {scholarship.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Academic Requirements */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Requirements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scholarship.min_gpa && (
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <span>Minimum GPA: {scholarship.min_gpa}</span>
                            </div>
                        )}
                        {scholarship.min_sat_score && (
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <span>Minimum SAT: {scholarship.min_sat_score}</span>
                            </div>
                        )}
                        {scholarship.min_act_score && (
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <span>Minimum ACT: {scholarship.min_act_score}</span>
                            </div>
                        )}
                        {scholarship.academic_level && scholarship.academic_level.length > 0 && (
                            <div className="flex items-center">
                                <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                                <span>For: {scholarship.academic_level.join(', ')} students</span>
                            </div>
                        )}
                    </div>

                    {scholarship.required_majors && scholarship.required_majors.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-900 mb-2">Required Majors</h3>
                            <div className="flex flex-wrap gap-2">
                                {scholarship.required_majors.map((major, index) => (
                                    <span key={index} className="inline-flex px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">
                                        {major}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Application Requirements */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Requirements</h2>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            {scholarship.essay_required ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
                            )}
                            <span className={scholarship.essay_required ? "text-gray-900" : "text-gray-500"}>
                                Essay Required
                                {scholarship.essay_word_limit && ` (${scholarship.essay_word_limit} words)`}
                            </span>
                        </div>

                        <div className="flex items-center">
                            {scholarship.transcript_required ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
                            )}
                            <span className={scholarship.transcript_required ? "text-gray-900" : "text-gray-500"}>
                                Official Transcript
                            </span>
                        </div>

                        <div className="flex items-center">
                            {scholarship.recommendation_letters_required > 0 ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
                            )}
                            <span className={scholarship.recommendation_letters_required > 0 ? "text-gray-900" : "text-gray-500"}>
                                {scholarship.recommendation_letters_required > 0
                                    ? `${scholarship.recommendation_letters_required} Recommendation Letter${scholarship.recommendation_letters_required > 1 ? 's' : ''}`
                                    : 'No Recommendation Letters Required'
                                }
                            </span>
                        </div>

                        <div className="flex items-center">
                            {scholarship.interview_required ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
                            )}
                            <span className={scholarship.interview_required ? "text-gray-900" : "text-gray-500"}>
                                Interview Required
                            </span>
                        </div>
                    </div>

                    {scholarship.essay_topics && scholarship.essay_topics.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-900 mb-2">Essay Topics</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {scholarship.essay_topics.map((topic, index) => (
                                    <li key={index}>{topic}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Eligibility Requirements */}
                {(scholarship.eligible_ethnicities?.length ||
                    scholarship.eligible_states?.length ||
                    scholarship.income_max ||
                    scholarship.first_generation_college_required !== undefined) && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility Requirements</h2>
                            <div className="space-y-4">
                                {scholarship.eligible_ethnicities && scholarship.eligible_ethnicities.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Eligible Ethnicities</h3>
                                        <p className="text-gray-700">{scholarship.eligible_ethnicities.join(', ')}</p>
                                    </div>
                                )}

                                {scholarship.income_max && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Income Requirement</h3>
                                        <p className="text-gray-700">Family income must be below ${scholarship.income_max.toLocaleString()}</p>
                                    </div>
                                )}

                                {scholarship.first_generation_college_required && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">First Generation</h3>
                                        <p className="text-gray-700">Must be a first-generation college student</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Geographic Eligibility</h3>
                                    <p className="text-gray-700">
                                        {scholarship.eligible_states && scholarship.eligible_states.length > 0
                                            ? `Available to residents of: ${scholarship.eligible_states.join(', ')}`
                                            : 'Available to students from all states'
                                        }
                                    </p>
                                    {scholarship.international_students_eligible && (
                                        <p className="text-green-600 text-sm mt-1">International students are eligible</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Additional Requirements */}
                {(scholarship.required_activities?.length ||
                    scholarship.volunteer_hours_min ||
                    scholarship.leadership_required) && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Requirements</h2>
                            <div className="space-y-3">
                                {scholarship.leadership_required && (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Leadership experience required</span>
                                    </div>
                                )}

                                {scholarship.volunteer_hours_min && (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Minimum {scholarship.volunteer_hours_min} volunteer hours</span>
                                    </div>
                                )}

                                {scholarship.need_based_required && (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Demonstrate financial need</span>
                                    </div>
                                )}
                            </div>

                            {scholarship.required_activities && scholarship.required_activities.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Required Activities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {scholarship.required_activities.map((activity, index) => (
                                            <span key={index} className="inline-flex px-2 py-1 rounded text-sm bg-purple-50 text-purple-700">
                                                {activity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}