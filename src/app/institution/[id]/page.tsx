// src/app/institution/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    MapPin,
    ExternalLink,
    Users,
    GraduationCap,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import FinancialDataDisplay from '@/components/financial/financial-data';

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

interface FinancialData {
    ipeds_id: number;
    academic_year: string;
    data_source: string;
    tuition_in_state?: number;
    tuition_out_state?: number;
    required_fees?: number;
    tuition_fees_in_state?: number;
    tuition_fees_out_state?: number;
    room_board_on_campus?: number;
    room_board_off_campus?: number;
    books_supplies?: number;
    personal_expenses?: number;
    transportation?: number;
    has_tuition_data: boolean;
    has_fees_data: boolean;
    data_completeness_score: number;
    validation_issues?: string;
    validation_status: string;
}

export default function InstitutionDetail() {
    const params = useParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [facultyMetrics, setFacultyMetrics] = useState<FacultyMetrics | null>(null);
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);
    const [facultyLoading, setFacultyLoading] = useState(true);
    const [financialLoading, setFinancialLoading] = useState(true);
    const [facultyError, setFacultyError] = useState<string | null>(null);
    const [financialError, setFinancialError] = useState<string | null>(null);

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
                            } else {
                                console.warn(`Faculty data not found for unitid: ${institutionData.ipeds_id}`);
                                setFacultyError('Faculty data not available for this institution');
                            }
                        } catch (error) {
                            console.error('Error fetching faculty data:', error);
                            setFacultyError('Failed to load faculty data');
                        } finally {
                            setFacultyLoading(false);
                        }

                        // Fetch financial data using the ipeds_id
                        console.log(`Fetching financial data for IPEDS ID: ${institutionData.ipeds_id}`);
                        try {
                            const financialResponse = await fetch(`${API_BASE_URL}/api/v1/by-ipeds/${institutionData.ipeds_id}`);

                            if (financialResponse.ok) {
                                const financialDataResult = await financialResponse.json();
                                setFinancialData(financialDataResult);
                            } else {
                                console.warn(`Financial data not found for IPEDS ID: ${institutionData.ipeds_id}`);
                                setFinancialError('Financial data not available for this institution');
                            }
                        } catch (error) {
                            console.error('Error fetching financial data:', error);
                            setFinancialError('Failed to load financial data');
                        } finally {
                            setFinancialLoading(false);
                        }
                    } else {
                        setFacultyLoading(false);
                        setFinancialLoading(false);
                        setFacultyError('No IPEDS ID available');
                        setFinancialError('No IPEDS ID available for financial data lookup');
                    }
                } else {
                    console.error('Failed to fetch institution data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const getControlTypeDisplay = (controlType: string) => {
        const types = {
            'public': 'Public',
            'private': 'Private',
            'private_nonprofit': 'Private Non-Profit',
            'private_for_profit': 'Private For-Profit'
        };
        return types[controlType as keyof typeof types] || controlType;
    };

    const getSizeCategoryDisplay = (sizeCategory: string) => {
        const sizes = {
            'very_small': 'Very Small (<1,000)',
            'small': 'Small (1,000-2,999)',
            'medium': 'Medium (3,000-9,999)',
            'large': 'Large (10,000-19,999)',
            'very_large': 'Very Large (20,000+)'
        };
        return sizes[sizeCategory as keyof typeof sizes] || sizeCategory;
    };

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
                            <span className="ml-1 font-medium">{getSizeCategoryDisplay(institution.size_category)}</span>
                        </div>
                        <div className="flex items-center">
                            <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Type: </span>
                            <span className="ml-1 font-medium">{getControlTypeDisplay(institution.control_type)}</span>
                        </div>
                        {institution.ipeds_id && (
                            <div className="text-sm text-gray-600">
                                <span>IPEDS ID: </span>
                                <span className="font-medium">{institution.ipeds_id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Information using the reusable component */}
                {financialLoading ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading financial data...</p>
                        </div>
                    </div>
                ) : financialError ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">{financialError}</p>
                            <p className="text-sm text-gray-500">Financial data may not be available for all institutions.</p>
                        </div>
                    </div>
                ) : financialData ? (
                    <FinancialDataDisplay
                        data={financialData}

                        className="mb-6"
                    />
                ) : null}

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
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">{facultyError}</p>
                            <p className="text-sm text-gray-500">Faculty data may not be available for all institutions.</p>
                        </div>
                    ) : facultyMetrics ? (
                        <div className="space-y-6">
                            {/* Overview */}
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">{facultyMetrics.faculty_description}</p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">{facultyMetrics.total_faculty.toLocaleString()}</div>
                                    <div className="text-sm text-blue-700">Total Faculty</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-600">{facultyMetrics.female_faculty_percent.toFixed(1)}%</div>
                                    <div className="text-sm text-green-700">Female Faculty</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-600 capitalize">{facultyMetrics.diversity_category}</div>
                                    <div className="text-sm text-purple-700">Diversity Level</div>
                                </div>
                            </div>

                            {/* Demographics */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Faculty Demographics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">{facultyMetrics.demographics.white_percent}%</div>
                                        <div className="text-sm text-gray-600">White</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">{facultyMetrics.demographics.asian_percent}%</div>
                                        <div className="text-sm text-gray-600">Asian</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">{facultyMetrics.demographics.hispanic_percent}%</div>
                                        <div className="text-sm text-gray-600">Hispanic</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">{facultyMetrics.demographics.black_percent}%</div>
                                        <div className="text-sm text-gray-600">Black</div>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights */}
                            {facultyMetrics.faculty_highlights && facultyMetrics.faculty_highlights.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                                    <ul className="space-y-2">
                                        {facultyMetrics.faculty_highlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}