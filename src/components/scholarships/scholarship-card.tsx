// src/components/scholarships/scholarship-card.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Calendar, ExternalLink, Users, GraduationCap } from 'lucide-react';

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type?: string;
    status?: string;
    difficulty_level?: string;

    // Amounts
    amount_exact?: number;
    amount_min?: number;
    amount_max?: number;
    is_renewable?: boolean;
    renewal_years?: number;

    // Images
    primary_image_url?: string;
    logo_image_url?: string;
    primary_image_quality_score?: number;

    // Meta
    verified?: boolean;
    featured?: boolean;
    views_count?: number;
    applications_count?: number;
    created_at?: string;
    updated_at?: string;

    // Extra fields referenced below
    number_of_awards?: number;
    deadline?: string;
    min_gpa?: number;
    academic_level?: string[]; // e.g., ['High School Senior', 'Undergraduate']
    application_url?: string;
    website_url?: string;
}

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
    // image handling
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getDisplayImageUrls = (s: Scholarship): string[] => {
        const urls: string[] = [];

        // Priority 1: Primary image
        if (s.primary_image_url) urls.push(s.primary_image_url);

        // Priority 2: Logo image
        if (s.logo_image_url) urls.push(s.logo_image_url);

        // Priority 3: Category-based fallbacks
        const baseUrl = 'https://magicscholar-images.nyc3.digitaloceanspaces.com/fallbacks/';
        switch (s.scholarship_type?.toLowerCase()) {
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

    const handleImageError = () => {
        const imageUrls = getDisplayImageUrls(scholarship);
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex((i) => i + 1);
        } else {
            setImageError(true);
        }
    };

    const getCurrentImageUrl = (): string | null => {
        const imageUrls = getDisplayImageUrls(scholarship);
        return imageUrls[currentImageIndex] || null;
    };

    const getScholarshipTypeDisplay = (type?: string) => {
        if (!type) return 'General';
        const types: Record<string, string> = {
            academic_merit: 'Academic Merit',
            need_based: 'Need-Based',
            athletic: 'Athletic',
            stem: 'STEM',
            arts: 'Arts & Humanities',
            diversity: 'Diversity & Inclusion',
            first_generation: 'First Generation',
            community_service: 'Community Service',
            leadership: 'Leadership',
            local_community: 'Local Community',
            employer_sponsored: 'Employer Sponsored',
            military: 'Military',
            religious: 'Religious',
            career_specific: 'Career-Specific',
            essay_based: 'Essay Competition',
            renewable: 'Renewable',
        };
        return types[type] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const getDifficultyDisplay = (difficulty?: string) => {
        const difficulties: Record<string, { label: string; color: string }> = {
            easy: { label: 'Easy', color: 'text-green-600 bg-green-50' },
            moderate: { label: 'Moderate', color: 'text-yellow-600 bg-yellow-50' },
            hard: { label: 'Hard', color: 'text-orange-600 bg-orange-50' },
            very_hard: { label: 'Very Hard', color: 'text-red-600 bg-red-50' },
        };
        return (
            difficulties[difficulty ?? ''] ?? {
                label: difficulty ?? 'Varies',
                color: 'text-gray-600 bg-gray-50',
            }
        );
    };

    const formatAmount = () => {
        const { amount_exact, amount_min, amount_max } = scholarship;
        if (typeof amount_exact === 'number') {
            return `$${amount_exact.toLocaleString()}`;
        }
        if (typeof amount_min === 'number' && typeof amount_max === 'number') {
            return `$${amount_min.toLocaleString()} - $${amount_max.toLocaleString()}`;
        }
        if (typeof amount_min === 'number') return `$${amount_min.toLocaleString()}+`;
        if (typeof amount_max === 'number') return `Up to $${amount_max.toLocaleString()}`;
        return 'Amount varies';
    };

    const formatDeadline = (deadline?: string) => {
        if (!deadline) return null;
        const date = new Date(deadline);
        if (isNaN(date.getTime())) return null;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const difficulty = getDifficultyDisplay(scholarship.difficulty_level);
    const currentImageUrl = getCurrentImageUrl();

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group border border-gray-100">
            {/* Scholarship Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                {currentImageUrl && !imageError ? (
                    <img
                        src={currentImageUrl}
                        alt={`${scholarship.title} scholarship`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                )}

                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${difficulty.color}`}>
                        {difficulty.label}
                    </span>
                </div>
            </div>

            {/* Scholarship Details */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {scholarship.title}
                </h3>

                {scholarship.organization && (
                    <div className="text-sm text-gray-600 mb-3">{scholarship.organization}</div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                    {/* Award Amount */}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-green-600">{formatAmount()}</span>
                        {scholarship.is_renewable && typeof scholarship.renewal_years === 'number' && (
                            <span className="text-xs text-gray-500">(renewable {scholarship.renewal_years} years)</span>
                        )}
                    </div>

                    {/* Scholarship Type */}
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{getScholarshipTypeDisplay(scholarship.scholarship_type)}</span>
                    </div>

                    {/* Number of Awards */}
                    {typeof scholarship.number_of_awards === 'number' && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{scholarship.number_of_awards} awards</span>
                        </div>
                    )}

                    {/* Deadline */}
                    {formatDeadline(scholarship.deadline) && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDeadline(scholarship.deadline)}</span>
                        </div>
                    )}

                    {/* GPA Requirement */}
                    {typeof scholarship.min_gpa === 'number' && (
                        <div className="text-xs text-gray-500">Min GPA: {scholarship.min_gpa}</div>
                    )}
                </div>

                {/* Academic Level */}
                {Array.isArray(scholarship.academic_level) && scholarship.academic_level.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                        For: {scholarship.academic_level.join(', ')} students
                    </div>
                )}

                {/* Debug Info in Development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-500">
                        ID: {scholarship.id} | Quality: {scholarship.primary_image_quality_score ?? 'N/A'}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                    <Link
                        href={`/scholarship/${scholarship.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                        View details
                    </Link>
                    <div className="flex gap-2">
                        {scholarship.application_url && (
                            <a
                                href={scholarship.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
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
                                aria-label="Open scholarship website"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
