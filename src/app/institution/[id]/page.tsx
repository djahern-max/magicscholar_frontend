// src/app/institution/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, ExternalLink, Users, GraduationCap } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
    id: number;
    name: string;
    city: string;
    state: string;
    website?: string;
    control_type: string;
    size_category: string;
    ipeds_id?: string;
    display_name: string;
    full_address: string;
}

interface FacultyMetrics {
    unitid: string;
    total_faculty: number;
    female_faculty_percent: number;
    male_faculty_percent: number;
    diversity_category: string;
    faculty_size_category: string;
    faculty_description: string;
    diversity_index: number;
    faculty_highlights: string[];
    demographics: {
        asian_percent: number;
        black_percent: number;
        hispanic_percent: number;
        white_percent: number;
    };
}

export default function InstitutionDetail() {
    const params = useParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [facultyMetrics, setFacultyMetrics] = useState<FacultyMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [facultyLoading, setFacultyLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // First, fetch the institution details
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);

                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    setInstitution(institutionData);
                } else {
                    console.error('Failed to fetch institution:', institutionResponse.statusText);
                }

                // Then, fetch faculty data using the same ID
                try {
                    const facultyResponse = await fetch(`${API_BASE_URL}/api/v1/institution/${params.id}`);

                    if (facultyResponse.ok) {
                        const facultyData = await facultyResponse.json();
                        setFacultyMetrics(facultyData);
                    } else {
                        console.log('No faculty data available for this institution');
                    }
                } catch (error) {
                    console.error('Error fetching faculty data:', error);
                }
            } catch (error) {
                console.error('Error fetching institution data:', error);
            } finally {
                setLoading(false);
                setFacultyLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading institution details...</p>
                </div>
            </div>
        );
    }

    if (!institution && !facultyMetrics) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
                    <p className="text-gray-600">Sorry, we couldn't find the institution you're looking for.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {institution?.display_name || institution?.name || `Institution ${params.id}`}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>
                                    {institution?.full_address ||
                                        (institution ? `${institution.city}, ${institution.state}` : 'Location not available')}
                                </span>
                            </div>
                        </div>
                        {institution?.website && (
                            <a
                                href={institution.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Visit Website
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Basic Information */}
                    {institution && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Institution Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Type:</span>
                                    <p className="text-gray-900">{institution.control_type}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Size:</span>
                                    <p className="text-gray-900">{institution.size_category}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Faculty Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2" />
                            Faculty Information
                        </h2>

                        {facultyLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading faculty data...</p>
                            </div>
                        ) : facultyMetrics ? (
                            <div className="space-y-6">
                                {/* Faculty Description */}
                                {facultyMetrics.faculty_description && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-blue-900 font-medium">{facultyMetrics.faculty_description}</p>
                                    </div>
                                )}

                                {/* Faculty Highlights */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Faculty Highlights</h3>
                                    <ul className="space-y-2">
                                        {facultyMetrics.faculty_highlights?.map((highlight, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className="text-gray-700">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Faculty Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <Users className="w-8 h-8 text-blue-600 mr-3" />
                                            <div>
                                                <p className="text-2xl font-bold text-blue-900">
                                                    {facultyMetrics.total_faculty.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-blue-600">Total Faculty</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-sm font-bold">♀♂</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-purple-900">
                                                    {facultyMetrics.female_faculty_percent}% / {facultyMetrics.male_faculty_percent}%
                                                </p>
                                                <p className="text-sm text-purple-600">Female / Male</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-sm font-bold">🌍</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-green-900">
                                                    {facultyMetrics.diversity_category}
                                                </p>
                                                <p className="text-sm text-green-600">Diversity Level</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Demographic Breakdown */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Faculty Demographics</h3>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                label: 'White',
                                                percent: facultyMetrics.demographics.white_percent,
                                                color: 'bg-gray-400'
                                            },
                                            {
                                                label: 'Asian',
                                                percent: facultyMetrics.demographics.asian_percent,
                                                color: 'bg-blue-400'
                                            },
                                            {
                                                label: 'Black/African American',
                                                percent: facultyMetrics.demographics.black_percent,
                                                color: 'bg-green-400'
                                            },
                                            {
                                                label: 'Hispanic/Latino',
                                                percent: facultyMetrics.demographics.hispanic_percent,
                                                color: 'bg-yellow-400'
                                            }
                                        ].map((demo) => (
                                            <div key={demo.label} className="flex items-center">
                                                <div className="w-32 text-sm text-gray-600">{demo.label}:</div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-3">
                                                    <div
                                                        className={`h-4 rounded-full ${demo.color}`}
                                                        style={{ width: `${Math.max(demo.percent, 1)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="w-12 text-sm font-medium text-gray-900">
                                                    {demo.percent}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Metrics */}
                                {facultyMetrics.diversity_index && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Diversity Index</h3>
                                        <div className="flex items-center">
                                            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-3">
                                                <div
                                                    className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-green-500"
                                                    style={{ width: `${(facultyMetrics.diversity_index * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {(facultyMetrics.diversity_index * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Higher values indicate greater faculty diversity
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-4">
                                    <GraduationCap className="w-12 h-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Faculty Data Not Available</h3>
                                <p className="text-gray-600 mb-4">
                                    Detailed faculty information is not currently available for this institution.
                                </p>
                                <div className="text-sm text-gray-500 bg-gray-50 rounded p-3 max-w-md mx-auto">
                                    <p className="font-medium mb-2">Debug Info:</p>
                                    <p>Institution ID: {params.id}</p>
                                    <p>Tried endpoints:</p>
                                    <ul className="list-disc list-inside text-left mt-1">
                                        <li>/api/v1/institution/{params.id}</li>
                                        <li>/api/v1/institutions/{params.id}</li>
                                        <li>/api/v1/faculty/{params.id}</li>
                                        <li>/api/v1/institutions/{params.id}/faculty</li>
                                        {institution?.ipeds_id && (
                                            <li>/api/v1/s2023-is/institution/{institution.ipeds_id}</li>
                                        )}
                                    </ul>
                                    <p className="mt-2 text-xs">
                                        Check the console for detailed endpoint responses.
                                    </p>
                                    <p className="mt-2 text-xs">
                                        Known working ID: 193900 - try{' '}
                                        <code className="bg-gray-200 px-1 rounded">/institution/193900</code>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}