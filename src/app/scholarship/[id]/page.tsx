// src/app/scholarship/[id]/page.tsx - UPDATED FOR SIMPLIFIED SCHEMA
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    DollarSign,
    Award,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type: string;
    status: string;
    difficulty_level: string;
    amount_exact: number;
    is_renewable: boolean;
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

    const getDifficultyColor = (difficulty: string) => {
        const colors: { [key: string]: string } = {
            'easy': 'text-green-600 bg-green-100 border-green-300',
            'moderate': 'text-yellow-700 bg-yellow-100 border-yellow-300',
            'hard': 'text-orange-600 bg-orange-100 border-orange-300',
            'very_hard': 'text-red-600 bg-red-100 border-red-300'
        };
        return colors[difficulty] || 'text-gray-600 bg-gray-100 border-gray-300';
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
                    <p className="mt-4 text-gray-600">Loading scholarship...</p>
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
            {/* Back Button */}
            <div className="bg-white border-b border-gray-200">
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
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-start gap-6">
                            {/* Scholarship Image */}
                            <div className="flex-shrink-0">
                                <div className="w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center p-4">
                                    {scholarship.primary_image_url && !imageError ? (
                                        <img
                                            src={scholarship.primary_image_url}
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
                                    <span className={`inline-flex px-3 py-1 rounded-md text-sm font-medium border ${getDifficultyColor(scholarship.difficulty_level)}`}>
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
                                        <span className="font-semibold text-green-600">
                                            ${scholarship.amount_exact.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Award className="w-4 h-4 mr-2 text-gray-600" />
                                        <span className="text-gray-700">
                                            {getScholarshipTypeDisplay(scholarship.scholarship_type)}
                                        </span>
                                    </div>
                                </div>

                                {/* Renewable Badge */}
                                {scholarship.is_renewable && (
                                    <div className="mb-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Renewable
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About This Scholarship */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
                    <p className="text-gray-500 italic">
                        Description not available. Please visit the official website for more information.
                    </p>
                </div>
            </div>
        </div>
    );
}