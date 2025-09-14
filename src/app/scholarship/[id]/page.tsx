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
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Function to get the best image URL with fallback logic
    const getDisplayImageUrl = (scholarship: Scholarship): string | null => {
        // Priority 1: Primary image
        if (scholarship.primary_image_url) {
            return scholarship.primary_image_url;
        }
        // Priority 2: Logo image
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="bg-gray-200 h-8 w-1/3 rounded mb-4"></div>
                    <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-200 h-4 w-full rounded"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Scholarship not found</h1>
                </div>
            </div>
        );
    }

    const currentImageUrl = getDisplayImageUrl(scholarship);
    const fallbackImageUrl = getFallbackImageUrl(scholarship);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="md:flex">
                    {/* FIXED: Image Container with proper sizing */}
                    <div className="md:w-1/3 lg:w-1/4">
                        <div className="h-64 md:h-full bg-white p-6 flex items-center justify-center">
                            {currentImageUrl && !imageError ? (
                                <img
                                    src={currentImageUrl}
                                    alt={`${scholarship.title} logo`}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    onError={() => setImageError(true)}
                                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                                />
                            ) : (
                                <img
                                    src={fallbackImageUrl}
                                    alt={`${scholarship.title} fallback`}
                                    className="max-w-full max-h-full object-contain rounded-lg opacity-80"
                                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-2/3 lg:w-3/4 p-6">
                        <div className="mb-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(scholarship.difficulty_level)}`}>
                                {scholarship.difficulty_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {scholarship.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-4">
                            {scholarship.organization}
                        </p>

                        {/* Key Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Award Amount */}
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-800">Award Amount</p>
                                    <p className="text-lg font-semibold text-green-900">
                                        {formatAmount(scholarship)}
                                    </p>
                                    {scholarship.is_renewable && scholarship.renewal_years && (
                                        <p className="text-sm text-green-700">
                                            Renewable for {scholarship.renewal_years} years
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Application Deadline */}
                            {scholarship.deadline && (
                                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">Application Deadline</p>
                                        <p className="text-lg font-semibold text-blue-900">
                                            {formatDeadline(scholarship.deadline)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Number of Awards */}
                            {scholarship.number_of_awards && (
                                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-800">Awards Available</p>
                                        <p className="text-lg font-semibold text-purple-900">
                                            {scholarship.number_of_awards.toLocaleString()} annually
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Scholarship Type */}
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Award className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Scholarship Type</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {getScholarshipTypeDisplay(scholarship.scholarship_type)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {scholarship.application_url && (
                                <a
                                    href={scholarship.application_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Visit Website
                                    <Globe className="ml-2 w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* About This Scholarship */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                                    className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Academic Requirements */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GPA Requirements */}
                    {(scholarship.min_gpa || scholarship.max_gpa) && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Minimum GPA</p>
                                <p className="text-gray-600">
                                    {scholarship.min_gpa || 'Not specified'}
                                    {scholarship.max_gpa && ` (Max: ${scholarship.max_gpa})`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Academic Level */}
                    {scholarship.academic_level && scholarship.academic_level.length > 0 && (
                        <div className="flex items-start space-x-3">
                            <GraduationCap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">For</p>
                                <p className="text-gray-600">
                                    {scholarship.academic_level.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Test Scores */}
                    {(scholarship.min_sat_score || scholarship.min_act_score) && (
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
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

                    {/* Required Majors */}
                    {scholarship.required_majors && scholarship.required_majors.length > 0 && (
                        <div className="flex items-start space-x-3">
                            <Award className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
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

            {/* Application Requirements */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Essay Requirements */}
                    {scholarship.essay_required && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
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

                    {/* Transcript */}
                    {scholarship.transcript_required && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Official Transcript</p>
                            </div>
                        </div>
                    )}

                    {/* Recommendation Letters */}
                    {scholarship.recommendation_letters_required > 0 && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">
                                    {scholarship.recommendation_letters_required} Recommendation Letter{scholarship.recommendation_letters_required > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Interview */}
                    {scholarship.interview_required && (
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Interview Required</p>
                            </div>
                        </div>
                    )}

                    {/* Personal Statement */}
                    {scholarship.personal_statement_required && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Personal Statement</p>
                            </div>
                        </div>
                    )}

                    {/* Leadership Required */}
                    {scholarship.leadership_required && (
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Leadership Experience</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}