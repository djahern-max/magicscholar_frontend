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
    ArrowLeft,
    DollarSign,
    Home,
    BookOpen,
    Info,
    Star
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;
    website?: string;
    control_type: string;
    size_category: string;
    display_name: string;
    full_address: string;
    primary_image_url?: string;
    display_image_url?: string;
}

// Updated interface to match your API schema
interface TuitionData {
    ipeds_id: number;
    academic_year?: string;
    tuition_in_state?: number | null;
    tuition_out_state?: number | null;
    required_fees_in_state?: number | null;
    required_fees_out_state?: number | null;
    room_board_on_campus?: number | null;
    room_board_breakdown?: {
        housing?: number;
        meals?: number;
        total?: number;
        source?: string;
        notes?: string;
    } | null;
    books_supplies?: number | null;
    // Handle the nested structure from your API
    tuition_data?: {
        tuition_in_state?: number | null;
        tuition_out_state?: number | null;
        required_fees_in_state?: number | null;
        required_fees_out_state?: number | null;
        room_board_on_campus?: number | null;
        room_board_breakdown?: {
            housing?: number;
            meals?: number;
            total?: number;
            source?: string;
            notes?: string;
        } | null;
        books_supplies?: number | null;
        academic_year?: string;
    };
}

export default function InstitutionDetail() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [tuitionData, setTuitionData] = useState<TuitionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedResidency, setSelectedResidency] = useState<'in_state' | 'out_of_state'>('in_state');
    const [imageError, setImageError] = useState(false);

    // Get return parameters from URL
    const returnPage = searchParams.get('page') || '1';
    const returnQuery = searchParams.get('query') || '';

    const handleBackClick = () => {
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
                console.log('Fetching institution data for ID:', params.id);

                // Fetch institution details
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);

                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    console.log('Institution data:', institutionData);
                    setInstitution(institutionData);

                    // Fetch tuition data using the correct endpoint
                    if (institutionData.ipeds_id) {
                        console.log('Fetching tuition data for IPEDS ID:', institutionData.ipeds_id);

                        const tuitionResponse = await fetch(`${API_BASE_URL}/api/v1/tuition/institution/${institutionData.ipeds_id}/full`);

                        console.log('Tuition response status:', tuitionResponse.status);

                        if (tuitionResponse.ok) {
                            const tuitionResult = await tuitionResponse.json();
                            console.log('Tuition data received:', tuitionResult);
                            setTuitionData(tuitionResult);
                        } else {
                            console.log('Tuition data not available - response not ok');
                            // Try alternative endpoint if the full endpoint doesn't work
                            try {
                                const alternativeResponse = await fetch(`${API_BASE_URL}/api/v1/tuition/institution/${institutionData.ipeds_id}`);
                                if (alternativeResponse.ok) {
                                    const alternativeResult = await alternativeResponse.json();
                                    console.log('Alternative tuition data:', alternativeResult);
                                    setTuitionData(alternativeResult);
                                }
                            } catch (altError) {
                                console.log('Alternative tuition endpoint also failed:', altError);
                            }
                        }
                    }
                } else {
                    console.error('Institution response not ok:', institutionResponse.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    // Helper function to get tuition data from potentially nested structure
    const getTuitionValue = (field: keyof TuitionData): number | null => {
        if (!tuitionData) return null;

        // Try direct access first
        const directValue = tuitionData[field] as number | null;
        if (directValue !== null && directValue !== undefined) {
            return directValue;
        }

        // Try nested tuition_data structure
        if (tuitionData.tuition_data) {
            const nestedValue = tuitionData.tuition_data[field as keyof typeof tuitionData.tuition_data] as number | null;
            if (nestedValue !== null && nestedValue !== undefined) {
                return nestedValue;
            }
        }

        return null;
    };

    const formatCurrency = (amount: number | null | undefined): string => {
        if (!amount || amount === 0) return 'Not available';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getControlTypeDisplay = (controlType: string) => {
        const types = {
            'public': 'Public',
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

    const getCurrentTuition = () => {
        return selectedResidency === 'in_state'
            ? getTuitionValue('tuition_in_state')
            : getTuitionValue('tuition_out_state');
    };

    const getCurrentFees = () => {
        return selectedResidency === 'in_state'
            ? getTuitionValue('required_fees_in_state')
            : getTuitionValue('required_fees_out_state');
    };

    const getAcademicTotal = () => {
        const tuition = getCurrentTuition() || 0;
        const fees = getCurrentFees() || 0;
        return tuition + fees;
    };

    const getRoomBoard = () => {
        return getTuitionValue('room_board_on_campus');
    };

    const getBooks = () => {
        return getTuitionValue('books_supplies');
    };

    const getTotalCost = () => {
        const academic = getAcademicTotal();
        const roomBoard = getRoomBoard() || 0;
        const books = getBooks() || 0;
        return academic + roomBoard + books;
    };

    // Get room/board breakdown
    const getRoomBoardBreakdown = () => {
        if (!tuitionData) return null;

        // Try direct access first
        if (tuitionData.room_board_breakdown) {
            return tuitionData.room_board_breakdown;
        }

        // Try nested structure
        if (tuitionData.tuition_data?.room_board_breakdown) {
            return tuitionData.tuition_data.room_board_breakdown;
        }

        return null;
    };

    // Get policy notes from breakdown - check both current and future years
    const getPolicyNotes = () => {
        if (!tuitionData) return null;

        // Get notes from the room_board_breakdown field
        let notes = null;

        // Try direct access first
        if (tuitionData.room_board_breakdown?.notes) {
            notes = tuitionData.room_board_breakdown.notes;
        }
        // Try nested structure
        else if (tuitionData.tuition_data?.room_board_breakdown?.notes) {
            notes = tuitionData.tuition_data.room_board_breakdown.notes;
        }

        // If we found notes, return them as-is from the database
        // Split on semicolons or periods followed by capital letters to create bullet points
        if (notes) {
            // Check if it contains multiple sentences/points that should be split
            if (notes.includes(';') || (notes.match(/\.\s+[A-Z]/g) && notes.length > 100)) {
                // Split on semicolons first, then on '. ' followed by capital letter
                let splitNotes = notes.split(';');
                if (splitNotes.length === 1) {
                    splitNotes = notes.split(/\.\s+(?=[A-Z])/);
                }
                return splitNotes
                    .map(note => note.trim())
                    .filter(note => note.length > 0)
                    .map(note => note.endsWith('.') ? note : note + '.');
            }
            return notes;
        }

        return null;
    };

    const getAcademicYear = () => {
        if (tuitionData?.academic_year) return tuitionData.academic_year;
        if (tuitionData?.tuition_data?.academic_year) return tuitionData.tuition_data.academic_year;
        return '2024-25';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!institution) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
                    <p className="text-gray-600">Sorry, we couldn't find this institution.</p>
                </div>
            </div>
        );
    }

    const roomBoardBreakdown = getRoomBoardBreakdown();
    const hasAnyTuitionData = getCurrentTuition() || getCurrentFees() || getRoomBoard();
    const policyNotes = getPolicyNotes();

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

            {/* Header */}
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
                                {institution.name}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{institution.city}, {institution.state}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="w-4 h-4 mr-1" />
                                    {getSizeCategoryDisplay(institution.size_category)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <GraduationCap className="w-4 h-4 mr-1" />
                                    {getControlTypeDisplay(institution.control_type)}
                                </div>
                                {/* Debug info - remove in production */}
                                <div className="flex items-center text-xs text-gray-400">
                                    IPEDS ID: {institution.ipeds_id}
                                </div>
                            </div>

                            {institution.website && (
                                <a
                                    href={institution.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Visit Website
                                </a>
                            )}

                            {/* Policy Notes Section - NEW */}
                            {policyNotes && (
                                <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Star className="w-5 h-5 text-green-600 mt-0.5" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-semibold text-green-800 mb-2">
                                                Important Financial Aid Information
                                            </h3>
                                            {Array.isArray(policyNotes) ? (
                                                <ul className="space-y-1">
                                                    {policyNotes.map((note, index) => (
                                                        <li key={index} className="text-sm text-green-700 leading-relaxed flex items-start">
                                                            <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                            {note}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-green-700 leading-relaxed">
                                                    {policyNotes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost Information */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {hasAnyTuitionData ? (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Cost of Attendance</h2>
                            <span className="text-sm text-gray-500">{getAcademicYear()}</span>
                        </div>

                        {/* Residency Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
                            <button
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedResidency === 'in_state'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                onClick={() => setSelectedResidency('in_state')}
                            >
                                In-State Resident
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedResidency === 'out_of_state'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                onClick={() => setSelectedResidency('out_of_state')}
                            >
                                Out-of-State Resident
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Academic Costs */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Academic Costs</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Tuition</span>
                                        <span className="font-medium">{formatCurrency(getCurrentTuition())}</span>
                                    </div>
                                    {getCurrentFees() && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Required Fees</span>
                                            <span className="font-medium">{formatCurrency(getCurrentFees())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="font-semibold text-gray-900">Academic Total</span>
                                        <span className="font-bold text-blue-600">{formatCurrency(getAcademicTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Living Costs */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Home className="w-5 h-5 text-green-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Living Costs</h3>
                                </div>
                                <div className="space-y-3">
                                    {getRoomBoard() ? (
                                        <>
                                            {roomBoardBreakdown?.housing && roomBoardBreakdown?.meals ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-700">Housing (Double Room)</span>
                                                        <span className="font-medium">{formatCurrency(roomBoardBreakdown.housing)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-700">Meal Plan</span>
                                                        <span className="font-medium">{formatCurrency(roomBoardBreakdown.meals)}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-700">Room & Board</span>
                                                    <span className="font-medium">{formatCurrency(getRoomBoard())}</span>
                                                </div>
                                            )}
                                            {getBooks() && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-700">Books & Supplies</span>
                                                    <span className="font-medium">{formatCurrency(getBooks())}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <span className="font-semibold text-gray-900">Living Total</span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency((getRoomBoard() || 0) + (getBooks() || 0))}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-sm text-yellow-800">
                                                This institution doesn't provide on-campus housing. Students typically live at home or rent nearby apartments.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Total Cost Summary */}
                        {getTotalCost() > 0 && (
                            <div className="mt-8 bg-blue-50 rounded-lg p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl">Estimated Total Cost</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedResidency === 'in_state' ? 'In-state resident' : 'Out-of-state resident'}
                                            {getRoomBoard() && ', living on campus'}
                                        </p>
                                    </div>
                                    <span className="font-bold text-3xl text-blue-600">{formatCurrency(getTotalCost())}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Information Not Available</h3>
                            <p className="text-gray-600">We're working to add cost information for this institution.</p>
                            <p className="text-xs text-gray-400 mt-2">IPEDS ID: {institution.ipeds_id}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}