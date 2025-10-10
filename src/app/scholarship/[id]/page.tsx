// src/app/scholarship/[id]/page.tsx - MATCHING SCHOOL DETAIL PAGE DESIGN
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin,
    ExternalLink,
    Award,
    ArrowLeft,
    DollarSign,
    Calendar,
    GraduationCap,
    Star,
    Users
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type: string;
    status: string;
    difficulty_level: string;
    amount_min: number;
    amount_max: number;
    is_renewable: boolean;
    number_of_awards?: number;
    deadline?: string;
    application_opens?: string;
    for_academic_year?: string;
    description?: string;
    website_url?: string;
    min_gpa?: number;
    primary_image_url?: string;
    verified: boolean;
    featured: boolean;
    views_count: number;
    applications_count: number;
    created_at: string;
    updated_at?: string;
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
            'arts': 'Arts',
            'diversity': 'Diversity & Inclusion',
            'leadership': 'Leadership',
            'military': 'Military',
            'career_specific': 'Career-Specific',
            'other': 'Other'
        };
        return types[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getDifficultyDisplay = (difficulty: string) => {
        return difficulty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getFallbackImageUrl = (scholarship: Scholarship): string => {
        const baseUrl = "https://magicscholar-images.nyc3.digitaloceanspaces.com/fallbacks/";
        switch (scholarship.scholarship_type?.toLowerCase()) {
            case 'stem':
                return `${baseUrl}stem_scholarship.jpg`;
            case 'arts':
                return `${baseUrl}arts_scholarship.jpg`;
            case 'athletic':
                return `${baseUrl}athletic_scholarship.jpg`;
            case 'diversity':
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
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !scholarship) {
        return (
            <div className="min-h-screen bg-page-bg">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <button
                        onClick={() => router.push('/scholarships')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to scholarships
                    </button>
                    <div className="bg-white rounded-xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {error ? 'Error Loading Scholarship' : 'Scholarship Not Found'}
                        </h1>
                        <p className="text-gray-600">
                            {error || "Sorry, we couldn't find this scholarship."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const fallbackImageUrl = getFallbackImageUrl(scholarship);

    return (
        <div className="min-h-screen bg-page-bg">
            {/* Back Button - Matching school detail page */}
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

            {/* Header - Matching school detail page */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start gap-6">
                            {/* Scholarship Image */}
                            <div className="flex-shrink-0 w-full lg:w-[500px]">
                                {scholarship.primary_image_url && !imageError ? (
                                    <img
                                        src={scholarship.primary_image_url}
                                        alt={`${scholarship.title} logo`}
                                        className="w-full h-64 object-contain lg:object-cover rounded-xl bg-white"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <img
                                        src={fallbackImageUrl}
                                        alt={`${scholarship.title} fallback`}
                                        className="w-full h-64 object-contain lg:object-cover rounded-xl opacity-80 bg-white"
                                    />
                                )}
                            </div>

                            {/* Scholarship Details */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {scholarship.title}
                                </h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{scholarship.organization}</span>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Award className="w-4 h-4 mr-2 text-gray-400" />
                                        {getScholarshipTypeDisplay(scholarship.scholarship_type)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                                        {getDifficultyDisplay(scholarship.difficulty_level)}
                                    </div>
                                </div>

                                {scholarship.website_url && (
                                    <a
                                        href={scholarship.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Award Information - Matching school cost section */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Award Information</h2>
                        {scholarship.for_academic_year && (
                            <span className="text-sm text-gray-500">{scholarship.for_academic_year}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Award Details */}
                        <div>
                            <div className="flex items-center mb-4">
                                <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Award Amount</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Award Range</span>
                                    <span className="font-medium">
                                        {scholarship.amount_min === scholarship.amount_max
                                            ? `$${scholarship.amount_min.toLocaleString()}`
                                            : `$${scholarship.amount_min.toLocaleString()} - $${scholarship.amount_max.toLocaleString()}`
                                        }
                                    </span>
                                </div>
                                {scholarship.is_renewable && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Renewable</span>
                                        <span className="font-medium text-green-600">Yes</span>
                                    </div>
                                )}
                                {scholarship.number_of_awards && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Number of Awards</span>
                                        <span className="font-medium">{scholarship.number_of_awards}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Requirements & Deadlines */}
                        <div>
                            <div className="flex items-center mb-4">
                                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Important Dates</h3>
                            </div>
                            <div className="space-y-3">
                                {scholarship.application_opens && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Application Opens</span>
                                        <span className="font-medium">
                                            {new Date(scholarship.application_opens).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                                {scholarship.deadline && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Deadline</span>
                                        <span className="font-medium text-red-600">
                                            {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                                {scholarship.min_gpa && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Minimum GPA</span>
                                        <span className="font-medium">{scholarship.min_gpa}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description Section - matching school cost disclaimer */}
                    {scholarship.description && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-2">About This Scholarship</h3>
                            <p className="text-sm text-gray-600">{scholarship.description}</p>
                        </div>
                    )}

                    {/* Note section - matching school disclaimer */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600">
                            <strong>Note:</strong> Information shown is subject to change. Please visit the scholarship website for the most current details and to verify all requirements before applying.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}