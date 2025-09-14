// src/components/scholarships/scholarship-card.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Calendar, Clock, ExternalLink, Award, Users, GraduationCap } from 'lucide-react';

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
    academic_level?: string[];
    deadline?: string;
    primary_image_url?: string;
    primary_image_quality_score?: number;
    logo_image_url?: string;
    created_at: string;
}

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
    // State to handle image loading errors
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to get the display image with proper fallback logic
    const getDisplayImageUrls = (scholarship: Scholarship): string[] => {
        const urls: string[] = [];

        // Priority 1: Primary image
        if (scholarship.primary_image_url) {
            urls.push(scholarship.primary_image_url);
        }

        // Priority 2: Logo image  
        if (scholarship.logo_image_url) {
            urls.push(scholarship.logo_image_url);
        }

        // Priority 3: Category-based fallbacks
        const baseUrl = "https://magicscholar-images.nyc3.digitaloceanspaces.com/fallbacks/";

        switch (scholarship.scholarship_type?.toLowerCase()) {
            case 'stem':
                urls.push(`${baseUrl}stem_scholarship.jpg`);
                break;
            case 'arts':
            case 'arts_humanities':
                urls.push(`${baseUrl}arts_scholarship.jpg`);
                break;
            case 'athletic':
                urls.push(`${baseUrl}athletic_scholarship.jpg`);
                break;
            case 'diversity':
            case 'diversity_inclusion':
                urls.push(`${baseUrl}diversity_scholarship.jpg`);
                break;
            case 'need_based':
                urls.push(`${baseUrl}need_based_scholarship.jpg`);
                break;
            default:
                urls.push(`${baseUrl}general_scholarship.jpg`);
        }

        return urls;
    };

    // Handle image loading errors by trying the next URL
    const handleImageError = () => {
        const imageUrls = getDisplayImageUrls(scholarship);
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setImageError(true);
        }
    };

    // Get the current image to display
    const getCurrentImageUrl = (): string | null => {
        const imageUrls = getDisplayImageUrls(scholarship);
        return imageUrls[currentImageIndex] || null;
    };

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

    const getDifficultyDisplay = (difficulty: string) => {
        const difficulties: { [key: string]: { label: string; color: string } } = {
            'easy': { label: 'Easy', color: 'text-green-600 bg-green-50' },
            'moderate': { label: 'Moderate', color: 'text-yellow-600 bg-yellow-50' },
            'hard': { label: 'Hard', color: 'text-orange-600 bg-orange-50' },
            'very_hard': { label: 'Very Hard', color: 'text-red-600 bg-red-50' }
        };
        return difficulties[difficulty] || { label: difficulty, color: 'text-gray-600 bg-gray-50' };
    };

    const formatAmount = () => {
        if (scholarship.amount_exact) {
            return `${scholarship.amount_exact.toLocaleString()}`;
        }
        if (scholarship.amount_min && scholarship.amount_max) {
            return `${scholarship.amount_min.toLocaleString()} - ${scholarship.amount_max.toLocaleString()}`;
        }
        if (scholarship.amount_min) {
            return `${scholarship.amount_min.toLocaleString()}+`;
        }
        if (scholarship.amount_max) {
            return `Up to ${scholarship.amount_max.toLocaleString()}`;
        }
        return 'Amount varies';
    };

    const formatDeadline = (deadline?: string) => {
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const difficulty = getDifficultyDisplay(scholarship.difficulty_level);
    const currentImageUrl = getCurrentImageUrl();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            {/* IMPROVED: Scholarship Image with better styling */}
            <div className="relative h-48 bg-white overflow-hidden flex items-center justify-center">
                {currentImageUrl && !imageError ? (
                    <img
                        src={currentImageUrl}
                        alt={`${scholarship.title} scholarship`}
                        className="max-w-full max-h-full object-contain"
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="text-center p-4">
                            <Award className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                            <span className="text-gray-500 text-sm font-medium">
                                {getScholarshipTypeDisplay(scholarship.scholarship_type)}
                            </span>
                            <div className="text-xs text-gray-400 mt-1">Scholarship</div>
                        </div>
                    </div>
                )}

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${difficulty.color} backdrop-blur-sm shadow-sm`}>
                        {difficulty.label}
                    </span>
                </div>

                {/* Image quality indicator for development */}
                {process.env.NODE_ENV === 'development' && scholarship.primary_image_quality_score && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-70 text-white backdrop-blur-sm">
                            Q: {scholarship.primary_image_quality_score}
                        </span>
                    </div>
                )}
            </div>

            {/* Scholarship Details */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {scholarship.title}
                </h3>

                <div className="text-sm text-gray-600 mb-3">
                    {scholarship.organization}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {/* Award Amount - FIXED: Only DollarSign icon, no extra $ in text */}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-600">{formatAmount()}</span>
                        {scholarship.is_renewable && scholarship.renewal_years && (
                            <span className="text-xs text-gray-500">
                                (renewable {scholarship.renewal_years} years)
                            </span>
                        )}
                    </div>

                    {/* Scholarship Type */}
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{getScholarshipTypeDisplay(scholarship.scholarship_type)}</span>
                    </div>

                    {/* Number of Awards */}
                    {scholarship.number_of_awards && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{scholarship.number_of_awards} awards available</span>
                        </div>
                    )}

                    {/* Deadline */}
                    {scholarship.deadline && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDeadline(scholarship.deadline)}</span>
                        </div>
                    )}

                    {/* GPA Requirement */}
                    {scholarship.min_gpa && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Min GPA: {scholarship.min_gpa}</span>
                        </div>
                    )}
                </div>

                {/* Categories Tags */}
                {scholarship.categories && scholarship.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {scholarship.categories.slice(0, 3).map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                            >
                                {category}
                            </span>
                        ))}
                        {scholarship.categories.length > 3 && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-500">
                                +{scholarship.categories.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Academic Level */}
                {scholarship.academic_level && scholarship.academic_level.length > 0 && (
                    <div className="text-xs text-gray-500 mb-4">
                        For: {scholarship.academic_level.join(', ')} students
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href={`/scholarship/${scholarship.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                        Learn More
                    </Link>
                    <div className="flex gap-2">
                        {scholarship.application_url && (
                            <a
                                href={scholarship.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                                title="Apply Now"
                            >
                                Apply
                            </a>
                        )}
                        {scholarship.website_url && (
                            <a
                                href={scholarship.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Visit Website"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Debug Info in Development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                        <div>ID: {scholarship.id}</div>
                        <div>Quality: {scholarship.primary_image_quality_score || 'N/A'}</div>
                        <div>Image Index: {currentImageIndex}</div>
                        <div>Current URL: {currentImageUrl ? 'Yes' : 'None'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}