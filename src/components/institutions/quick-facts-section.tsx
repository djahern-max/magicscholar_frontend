// src/components/institutions/quick-facts-section.tsx
'use client';

import React from 'react';
import { Users, MapPin, GraduationCap, Star } from 'lucide-react';

interface Institution {
    student_faculty_ratio?: number | null;
    locale?: string | null;
    size_category: string;
}

interface QuickFactsSectionProps {
    institution: Institution;
}

export default function QuickFactsSection({ institution }: QuickFactsSectionProps) {
    const getLocaleHoverText = (locale?: string | null): string => {
        if (!locale) return '';

        const descriptions: Record<string, string> = {
            'Urban Center': 'Major city with extensive amenities, culture, dining, and entertainment.',
            'City': 'Urban area with restaurants, shops, and city conveniences.',
            'Town': 'Smaller community with local character and essential services.',
            'Metropolitan Suburb': 'Suburban area near major city.',
            'Suburban': 'Residential community with local shops.',
            'Campus Town': 'Vibrant college town with student-friendly businesses.',
            'Village': 'Small community with tight-knit feel.',
            'Countryside': 'Rural setting with open spaces.',
            'Forest Area': 'Surrounded by forests.',
            'Remote': 'Peaceful, isolated setting.',
            'Wilderness': 'Pristine natural environment.'
        };

        return descriptions[locale] || locale;
    };

    const getLocaleEmoji = (locale?: string | null): string => {
        if (!locale) return '🏫';

        const emojis: Record<string, string> = {
            'Urban Center': '🏙️',
            'City': '🌆',
            'Town': '🏘️',
            'Metropolitan Suburb': '🏡',
            'Suburban': '🏘️',
            'Residential Area': '🏠',
            'Campus Town': '🎓',
            'Village': '⭐',
            'Countryside': '🌾',
            'Forest Area': '🌲',
            'Remote': '🏔️',
            'Wilderness': '🌲'
        };

        return emojis[locale] || '🏫';
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                <Star className="w-5 h-5 text-blue-600 mr-2" />
                Quick Facts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {institution.student_faculty_ratio && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Users className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-700">Student:Faculty</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {Math.round(institution.student_faculty_ratio)}:1
                        </div>
                        <p className="text-xs text-gray-600">
                            {institution.student_faculty_ratio < 15 ? '✓ Small class sizes' :
                                institution.student_faculty_ratio < 20 ? 'Moderate class sizes' :
                                    'Larger class sizes'}
                        </p>
                    </div>
                )}

                {institution.locale && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-help relative group text-center">
                        <div className="flex items-center justify-center mb-2">
                            <MapPin className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-700">Location Type</span>
                        </div>
                        <div className="text-5xl mb-1">
                            {getLocaleEmoji(institution.locale)}
                        </div>
                        <p className="text-xs text-gray-600">
                            {institution.locale}
                        </p>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-2xl w-72 text-center">
                            {getLocaleHoverText(institution.locale)}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                <div className="border-8 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                )}

                {institution.size_category && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="flex items-center justify-center mb-2">
                            <GraduationCap className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-700">Student Population</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {Math.round(parseFloat(institution.size_category)).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">
                            {(() => {
                                const size = Math.round(parseFloat(institution.size_category));
                                if (size < 1000) return 'Very small campus';
                                if (size < 3000) return 'Small campus';
                                if (size < 10000) return 'Medium campus';
                                if (size < 20000) return 'Large campus';
                                return 'Very large campus';
                            })()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}