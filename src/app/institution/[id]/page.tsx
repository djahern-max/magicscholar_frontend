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
    ipeds_id?: string;  // This is the key field we need!
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
    const [facultyError, setFacultyError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // First, fetch the institution details
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);

                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    setInstitution(institutionData);

                    // Now fetch faculty data using the ipeds_id (unitid) if available
                    if (institutionData.ipeds_id) {
                        console.log(`Fetching faculty data for unitid: ${institutionData.ipeds_id}`);
                        try {
                            const facultyResponse = await fetch(`${API_BASE_URL}/api/v1/institution/${institutionData.ipeds_id}`);

                            if (facultyResponse.ok) {
                                const facultyData = await facultyResponse.json();
                                setFacultyMetrics(facultyData);
                                console.log('Faculty data loaded successfully:', facultyData);
                            } else {
                                const errorText = await facultyResponse.text();
                                console.log('Faculty API response error:', facultyResponse.status, errorText);
                                setFacultyError(`Faculty data not available (Status: ${facultyResponse.status})`);
                            }
                        } catch (error) {
                            console.error('Error fetching faculty data:', error);
                            setFacultyError('Error fetching faculty data');
                        }
                    } else {
                        console.log('No ipeds_id found for this institution');
                        setFacultyError('No faculty data available - missing ipeds_id');
                    }
                } else {
                    console.error('Failed to fetch institution:', institutionResponse.statusText);
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

    if (!institution) {
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
                                {institution.display_name || institution.name}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{institution.full_address || `${institution.city}, ${institution.state}`}</span>
                            </div>
                            {institution.website && (
                                <a
                                    href={institution.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Visit Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Institution Basic Info */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Institution Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Users className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Size: </span>
                            <span className="ml-1 font-medium">{institution.size_category}</span>
                        </div>
                        <div className="flex items-center">
                            <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Type: </span>
                            <span className="ml-1 font-medium">{institution.control_type}</span>
                        </div>
                        {institution.ipeds_id && (
                            <div className="text-sm text-gray-600">
                                <span>IPEDS ID: </span>
                                <span className="font-medium">{institution.ipeds_id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Faculty Metrics */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Faculty Information</h2>

                    {facultyLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading faculty data...</p>
                        </div>
                    ) : facultyError ? (
                        <div className="text-center py-8">
                            <div className="text-yellow-600 mb-4">
                                <p className="font-medium">Faculty Data Not Available</p>
                                <p className="text-sm">{facultyError}</p>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="text-sm text-gray-500 bg-gray-50 rounded p-3 max-w-md mx-auto">
                                    <p className="font-medium mb-2">Debug Info:</p>
                                    <p>Institution ID: {params.id}</p>
                                    <p>IPEDS ID: {institution.ipeds_id || 'Not available'}</p>
                                    <p>API Endpoint: /api/v1/institution/{institution.ipeds_id}</p>
                                </div>
                            )}
                        </div>
                    ) : facultyMetrics ? (
                        <div className="space-y-6">
                            {/* Faculty Overview */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Overview</h3>
                                <p className="text-gray-600">{facultyMetrics.faculty_description}</p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {facultyMetrics.total_faculty.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Faculty</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {facultyMetrics.female_faculty_percent}%
                                    </div>
                                    <div className="text-sm text-gray-600">Female Faculty</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {facultyMetrics.diversity_category}
                                    </div>
                                    <div className="text-sm text-gray-600">Diversity Level</div>
                                </div>
                            </div>

                            {/* Faculty Highlights */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Highlights</h3>
                                <ul className="space-y-1">
                                    {facultyMetrics.faculty_highlights.map((highlight, index) => (
                                        <li key={index} className="text-gray-600 flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Demographics Breakdown */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Faculty Demographics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div className="bg-gray-50 rounded p-2">
                                        <div className="font-medium">{facultyMetrics.demographics.white_percent}%</div>
                                        <div className="text-gray-600">White</div>
                                    </div>
                                    <div className="bg-gray-50 rounded p-2">
                                        <div className="font-medium">{facultyMetrics.demographics.asian_percent}%</div>
                                        <div className="text-gray-600">Asian</div>
                                    </div>
                                    <div className="bg-gray-50 rounded p-2">
                                        <div className="font-medium">{facultyMetrics.demographics.hispanic_percent}%</div>
                                        <div className="text-gray-600">Hispanic</div>
                                    </div>
                                    <div className="bg-gray-50 rounded p-2">
                                        <div className="font-medium">{facultyMetrics.demographics.black_percent}%</div>
                                        <div className="text-gray-600">Black</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}