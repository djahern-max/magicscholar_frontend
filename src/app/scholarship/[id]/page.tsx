// src/app/scholarship/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    BookOpen,
    ArrowLeft
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
    const router = useRouter();
    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

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
            'easy': 'text-green-600 bg-green-100 border-green-300',
            'moderate': 'text-yellow-700 bg-yellow-100 border-yellow-300',
            'hard': 'text-orange-600 bg-orange-100 border-orange-300',
            'very_hard': 'text-red-600 bg-red-100 border-red-300'
        };
        return colors[difficulty] || 'text-gray-600 bg-gray-100 border-gray-300';
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
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDisplayImageUrl = (scholarship: Scholarship): string | null => {
        if (scholarship.primary_image_url) {
            return scholarship.primary_image_url;
        }
        if (scholarship.logo_image_url) {
            return scholarship.logo_image_url;
        }
        return null;
    };

    const getFallbackImageUrl = (scholarship: Scholarship): string => {
        const baseUrl = "https://magicscholar-images.nyc3.digitaloceanspaces.com/fallbacks/";

        switch (scholarship.scholarship_type?.toLowerCase()) {
            case 'stem':
                return `${baseUrl}stem_scholarship.jpg`;
            case 'arts':
            case 'arts_humanities':
                return `${baseUrl}arts_scholarship.jpg`;
            case 'athletic':
                return `${baseUrl}athletic_scholarship.jpg`;
            case 'diversity':
            case 'diversity_inclusion':
                return `${baseUrl}diversity_scholarship.jpg`;
            case 'need_based':
                return `${baseUrl}need_based_scholarship.jpg`;
            default:
                return `${baseUrl}general_scholarship.jpg`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading scholarship...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-page-bg border-b-2 border-gray-300">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Not Found</h1>
                    <p className="text-gray-600">Sorry, we couldn't find this scholarship.</p>
                </div>
            </div>
        );
    }

    const currentImageUrl = getDisplayImageUrl(scholarship);
    const fallbackImageUrl = getFallbackImageUrl(scholarship);

    return (
        <div className="min-h-screen bg-page-bg">
            {/* Back Button */}
            <div className="bg-page-bg border-b-2 border-gray-300">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.push('/scholarships')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to scholarships
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start gap-6">
                            {/* Scholarship Image */}
                            <div className="flex-shrink-0">
                                <div className="w-64 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center p-4">
                                    {currentImageUrl && !imageError ? (
                                        <img
                                            src={currentImageUrl}
                                            alt={`${scholarship.title} logo`}
                                            className="max-w-full max-h-full object-contain"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <img
                                            src={fallbackImageUrl}
                                            alt={`${scholarship.title} fallback`}
                                            className="max-w-full max-h-full object-contain opacity-80"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Scholarship Details */}
                            <div className="flex-1">
                                <div className="mb-3">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border-2 ${getDifficultyColor(scholarship.difficulty_level)}`}>
                                        {scholarship.difficulty_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {scholarship.title}
                                </h1>

                                <p className="text-xl text-gray-600 mb-6">
                                    {scholarship.organization}
                                </p>

                                {/* Key Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center text-sm">
                                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                                        <span className="font-semibold text-green-600">{formatAmount(scholarship)}</span>
                                    </div>
                                    {scholarship.deadline && (
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                            <span className="text-gray-700">{formatDeadline(scholarship.deadline)}</span>
                                        </div>
                                    )}
                                    {scholarship.number_of_awards && (
                                        <div className="flex items-center text-sm">
                                            <Users className="w-4 h-4 mr-2 text-purple-600" />
                                            <span className="text-gray-700">{scholarship.number_of_awards} awards</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-sm">
                                        <Award className="w-4 h-4 mr-2 text-gray-600" />
                                        <span className="text-gray-700">{getScholarshipTypeDisplay(scholarship.scholarship_type)}</span>
                                    </div>
                                </div>

                                {/* Renewable Badge */}
                                {scholarship.is_renewable && scholarship.renewal_years && (
                                    <div className="mb-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border-2 border-green-300">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Renewable for {scholarship.renewal_years} years
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {scholarship.application_url && (
                                        <a
                                            href={scholarship.application_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                        >
                                            Apply Now
                                            <ExternalLink className="ml-2 w-4 h-4" />
                                        </a>
                                    )}
                                    {scholarship.website_url && (
                                        <a
                                            href={scholarship.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                                        >
                                            Visit Website
                                            <Globe className="ml-2 w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About This Scholarship */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
                    {scholarship.description ? (
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {scholarship.description}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">
                            Description not available. Please visit the official website for more information.
                        </p>
                    )}

                    {/* Categories */}
                    {scholarship.categories && scholarship.categories.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {scholarship.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Academic Requirements */}
                {((scholarship.min_gpa || scholarship.max_gpa) ||
                    (scholarship.academic_level && scholarship.academic_level.length > 0) ||
                    (scholarship.min_sat_score || scholarship.min_act_score) ||
                    (scholarship.required_majors && scholarship.required_majors.length > 0)) && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Requirements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(scholarship.min_gpa || scholarship.max_gpa) && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Minimum GPA</p>
                                            <p className="text-gray-600">
                                                {scholarship.min_gpa || 'Not specified'}
                                                {scholarship.max_gpa && ` (Max: ${scholarship.max_gpa})`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.academic_level && scholarship.academic_level.length > 0 && (
                                    <div className="flex items-start space-x-3">
                                        <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">For</p>
                                            <p className="text-gray-600">
                                                {scholarship.academic_level.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {(scholarship.min_sat_score || scholarship.min_act_score) && (
                                    <div className="flex items-start space-x-3">
                                        <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Test Scores</p>
                                            <div className="text-gray-600">
                                                {scholarship.min_sat_score && (
                                                    <p>SAT: {scholarship.min_sat_score}+</p>
                                                )}
                                                {scholarship.min_act_score && (
                                                    <p>ACT: {scholarship.min_act_score}+</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {scholarship.required_majors && scholarship.required_majors.length > 0 && (
                                    <div className="flex items-start space-x-3">
                                        <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Required Majors</p>
                                            <p className="text-gray-600">
                                                {scholarship.required_majors.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                {/* Application Requirements */}
                {(scholarship.essay_required || scholarship.transcript_required ||
                    scholarship.recommendation_letters_required > 0 || scholarship.interview_required ||
                    scholarship.personal_statement_required || scholarship.leadership_required) && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Requirements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {scholarship.essay_required && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Essay Required
                                                {scholarship.essay_word_limit && ` (${scholarship.essay_word_limit} words)`}
                                            </p>
                                            {scholarship.essay_topics && scholarship.essay_topics.length > 0 && (
                                                <div className="mt-1">
                                                    <p className="text-sm text-gray-600">Essay Topics:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                                        {scholarship.essay_topics.map((topic, index) => (
                                                            <li key={index}>{topic}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {scholarship.transcript_required && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Official Transcript</p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.recommendation_letters_required > 0 && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {scholarship.recommendation_letters_required} Recommendation Letter{scholarship.recommendation_letters_required > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.interview_required && (
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Interview Required</p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.personal_statement_required && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Personal Statement</p>
                                        </div>
                                    </div>
                                )}

                                {scholarship.leadership_required && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">Leadership Experience</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}