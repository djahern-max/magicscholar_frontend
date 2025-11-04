// src/components/institutions/institution-header.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, Users, GraduationCap } from 'lucide-react';

interface Institution {
    name: string;
    city: string;
    state: string;
    website?: string;
    control_type: string;
    size_category: string;
    primary_image_url?: string;
    display_image_url?: string;
}

interface InstitutionHeaderProps {
    institution: Institution;
}

export default function InstitutionHeader({ institution }: InstitutionHeaderProps) {
    const [imageError, setImageError] = useState(false);

    const getControlTypeDisplay = (controlType: string) => {
        const types = {
            'public': 'Public',
            'private_nonprofit': 'Private Non-Profit',
            'private_for_profit': 'Private For-Profit'
        };
        return types[controlType as keyof typeof types] || controlType;
    };

    const getSizeCategoryDisplay = (sizeCategory: string) => {
        const size = parseFloat(sizeCategory);
        if (!isNaN(size)) {
            if (size < 1000) return 'Very Small (<1,000)';
            if (size < 3000) return 'Small (1,000-2,999)';
            if (size < 10000) return 'Medium (3,000-9,999)';
            if (size < 20000) return 'Large (10,000-19,999)';
            return 'Very Large (20,000+)';
        }

        const sizes = {
            'very_small': 'Very Small (<1,000)',
            'small': 'Small (1,000-2,999)',
            'medium': 'Medium (3,000-9,999)',
            'large': 'Large (10,000-19,999)',
            'very_large': 'Very Large (20,000+)'
        };
        return sizes[sizeCategory as keyof typeof sizes] || sizeCategory;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    {/* Institution Image */}
                    <div className="flex-shrink-0">
                        {institution.primary_image_url || institution.display_image_url ? (
                            <div className="relative">
                                <img
                                    src={institution.display_image_url || institution.primary_image_url}
                                    alt={`${institution.name} campus`}
                                    className="w-64 h-48 object-cover rounded-xl"
                                    onError={() => setImageError(true)}
                                    style={{ display: imageError ? 'none' : 'block' }}
                                />
                                {imageError && (
                                    <div className="w-64 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                        <div className="text-center text-gray-400">
                                            <GraduationCap className="w-12 h-12 mx-auto mb-2" />
                                            <p className="text-sm">No image available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-64 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <GraduationCap className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm">No image available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Institution Details */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {institution.name}
                        </h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{institution.city}, {institution.state}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                {getSizeCategoryDisplay(institution.size_category)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                                {getControlTypeDisplay(institution.control_type)}
                            </div>
                        </div>

                        {institution.website && (
                            <a
                                href={institution.website}
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
    );
}