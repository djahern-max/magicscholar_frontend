// src/components/scholarships/scholarship-card.tsx - MATCHING SCHOOL CARD DESIGN
import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Award } from 'lucide-react';

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type: string;
    difficulty_level: string;
    amount_min: number;
    amount_max: number;
    is_renewable: boolean;
    number_of_awards?: number;
    deadline?: string;
    min_gpa?: number;
    primary_image_url?: string;
}

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
    const [imageError, setImageError] = useState(false);

    const getScholarshipTypeDisplay = (type: string) => {
        const types: { [key: string]: string } = {
            'academic_merit': 'Academic Merit',
            'need_based': 'Need-Based',
            'stem': 'STEM',
            'arts': 'Arts',
            'diversity': 'Diversity',
            'athletic': 'Athletic',
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

    const formatAmount = () => {
        if (scholarship.amount_min === scholarship.amount_max) {
            return `$${scholarship.amount_min.toLocaleString()}`;
        }
        return `$${scholarship.amount_min.toLocaleString()}-$${scholarship.amount_max.toLocaleString()}`;
    };

    const getFallbackImageUrl = (): string => {
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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Scholarship Image - Matching school card style */}
            <div className="relative h-48 bg-gray-200">
                {scholarship.primary_image_url && !imageError ? (
                    <img
                        src={scholarship.primary_image_url}
                        alt={scholarship.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <img
                        src={getFallbackImageUrl()}
                        alt={scholarship.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                )}
            </div>

            {/* Scholarship Details - Matching school card layout */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {scholarship.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                    {/* Organization (like Location in school cards) */}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{scholarship.organization}</span>
                    </div>

                    {/* Award Amount (like Size in school cards) */}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-green-600">{formatAmount()}</span>
                    </div>

                    {/* Scholarship Type (like Control Type in school cards) */}
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>{getScholarshipTypeDisplay(scholarship.scholarship_type)}</span>
                    </div>

                    {/* Deadline if available */}
                    {scholarship.deadline && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(scholarship.deadline).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}</span>
                        </div>
                    )}
                </div>

                {/* Bottom section - Matching school card style */}
                <div className="mt-4 flex items-center justify-between">
                    <Link
                        href={`/scholarship/${scholarship.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
}