// src/app/institution/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    MapPin,
    ExternalLink,
    Users,
    GraduationCap,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import FinancialDataDisplay from '@/components/financial/financial-data';
import TuitionDisplay from '@/components/tuition/TuitionDisplay';
import { tuitionService } from '@/lib/tuitionService';
import { TuitionData } from '@/types/tuition';

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
    primary_image_url?: string;
    primary_image_quality_score?: number;
    display_image_url?: string;
}

// Keep your existing FinancialData interface for legacy support
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [tuitionData, setTuitionData] = useState<TuitionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [financialLoading, setFinancialLoading] = useState(true);
    const [tuitionLoading, setTuitionLoading] = useState(true);
    const [financialError, setFinancialError] = useState<string | null>(null);
    const [tuitionError, setTuitionError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    // Get return parameters from URL
    const returnPage = searchParams.get('page') || '1';
    const returnQuery = searchParams.get('query') || '';

    const handleBackClick = () => {
        // Go back to root (/) instead of /institutions
        let backUrl = '/';
        const urlParams = new URLSearchParams();

        if (returnPage && returnPage !== '1') {
            urlParams.append('page', returnPage);
        }
        if (returnQuery) {
            urlParams.append('query', returnQuery);
        }

        if (urlParams.toString()) {
            backUrl += `?${urlParams.toString()}`;
        }

        router.push(backUrl);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // First, fetch the institution details
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);

                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    setInstitution(institutionData);

                    // Fetch tuition data using our comprehensive tuition API
                    if (institutionData.ipeds_id) {
                        console.log(`Fetching tuition data for IPEDS ID: ${institutionData.ipeds_id}`);
                        try {
                            const tuitionResult = await tuitionService.getTuitionByInstitution(parseInt(institutionData.ipeds_id));
                            if (tuitionResult) {
                                setTuitionData(tuitionResult);
                            } else {
                                setTuitionError('Tuition data not available for this institution');
                            }
                        } catch (error) {
                            console.error('Error fetching tuition data:', error);
                            setTuitionError('Failed to load tuition data');
                        } finally {
                            setTuitionLoading(false);
                        }
                    } else {
                        setTuitionLoading(false);
                        setTuitionError('No IPEDS ID available for tuition data lookup');
                    }
                } else {
                    console.error('Failed to fetch institution data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                setFinancialLoading(false);
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
            {/* Back Button */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {returnQuery ? 'search results' : 'institutions'}
                    </button>
                </div>
            </div>

            {/* Header with Image */}
            <div className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Institution Image */}
                        <div className="flex-shrink-0">
                            {institution.primary_image_url || institution.display_image_url ? (
                                <div className="relative">
                                    <img
                                        src={institution.display_image_url || institution.primary_image_url}
                                        alt={`${institution.name} campus`}
                                        className="w-64 h-48 object-cover rounded-lg shadow-md"
                                        onError={() => setImageError(true)}
                                        style={{ display: imageError ? 'none' : 'block' }}
                                    />
                                    {imageError && (
                                        <div className="w-64 h-48 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                                            <div className="text-center text-gray-500">
                                                <GraduationCap className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm">No image available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-64 h-48 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <GraduationCap className="w-12 h-12 mx-auto mb-2" />
                                        <p className="text-sm">No image available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Institution Details */}
                        <div className="flex-1">
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

                {/* Tuition Information */}
                {tuitionLoading ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading tuition data...</p>
                        </div>
                    </div>
                ) : tuitionData ? (
                    <TuitionDisplay tuitionData={tuitionData} />
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tuition Data Available</h3>
                            <p className="text-gray-600 mb-2">
                                {tuitionError || 'Tuition information is not currently available for this institution.'}
                            </p>
                            <p className="text-sm text-gray-500">We're continuously expanding our database coverage.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}