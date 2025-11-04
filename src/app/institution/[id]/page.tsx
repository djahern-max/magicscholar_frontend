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
    Star,
    Award,
    BookOpen
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
    student_faculty_ratio?: number | null;
    locale?: string | null;
}

interface CostData {
    ipeds_id: number;
    institution_name: string;
    has_cost_data: boolean;
    academic_year?: string;
    data_source?: string;
    tuition_in_state?: number | null;
    tuition_out_state?: number | null;
    required_fees_in_state?: number | null;
    required_fees_out_state?: number | null;
    tuition_fees_in_state?: number | null;
    tuition_fees_out_state?: number | null;
    room_board_on_campus?: number | null;
    room_board_off_campus?: number | null;
    books_supplies?: number | null;
    personal_expenses?: number | null;
    transportation?: number | null;
    has_tuition_data?: boolean;
    has_fees_data?: boolean;
    has_living_data?: boolean;
    data_completeness_score?: number;
}

interface AdmissionsData {
    id: number;
    ipeds_id: number;
    academic_year: string;
    applications_total?: number | null;
    admissions_total?: number | null;
    enrolled_total?: number | null;
    acceptance_rate?: number | null;
    yield_rate?: number | null;
    sat_reading_25th?: number | null;
    sat_reading_50th?: number | null;
    sat_reading_75th?: number | null;
    sat_math_25th?: number | null;
    sat_math_50th?: number | null;
    sat_math_75th?: number | null;
    percent_submitting_sat?: number | null;
}

export default function InstitutionDetail() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [costData, setCostData] = useState<CostData | null>(null);
    const [admissionsData, setAdmissionsData] = useState<AdmissionsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedResidency, setSelectedResidency] = useState<'in_state' | 'out_of_state'>('in_state');
    const [imageError, setImageError] = useState(false);

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
                // Fetch institution data
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);
                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    setInstitution(institutionData);

                    // Fetch cost data
                    if (institutionData.ipeds_id) {
                        try {
                            const costsResponse = await fetch(`${API_BASE_URL}/api/v1/costs/institution/${institutionData.ipeds_id}`);
                            if (costsResponse.ok) {
                                const costsResult = await costsResponse.json();
                                setCostData(costsResult);
                            }
                        } catch (costError) {
                            console.log('Could not fetch cost data:', costError);
                        }

                        // Fetch admissions data
                        try {
                            const admissionsResponse = await fetch(`${API_BASE_URL}/api/v1/admissions/institution/${institutionData.ipeds_id}`);
                            if (admissionsResponse.ok) {
                                const admissionsResult = await admissionsResponse.json();
                                setAdmissionsData(admissionsResult);
                            }
                        } catch (admissionsError) {
                            console.log('Could not fetch admissions data:', admissionsError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

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

    const getCurrentTuition = () => {
        if (!costData) return null;
        return selectedResidency === 'in_state'
            ? costData.tuition_in_state
            : costData.tuition_out_state;
    };

    const getCurrentFees = () => {
        if (!costData) return null;
        return selectedResidency === 'in_state'
            ? costData.required_fees_in_state
            : costData.required_fees_out_state;
    };

    const getAcademicTotal = () => {
        const tuition = getCurrentTuition() || 0;
        const fees = getCurrentFees() || 0;
        return tuition + fees;
    };

    const getRoomBoard = () => {
        return costData?.room_board_on_campus || null;
    };

    const getBooks = () => {
        return costData?.books_supplies || null;
    };

    const getTotalCost = () => {
        const academic = getAcademicTotal();
        const roomBoard = getRoomBoard() || 0;
        const books = getBooks() || 0;
        return academic + roomBoard + books;
    };

    const getAcademicYear = () => {
        return costData?.academic_year || '2024-25';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!institution) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
                    <p className="text-gray-600">Sorry, we couldn't find this institution.</p>
                </div>
            </div>
        );
    }

    const hasAnyTuitionData = costData?.has_cost_data && (getCurrentTuition() || getCurrentFees() || getRoomBoard());

    return (
        <div className="min-h-screen bg-page-bg">
            {/* Back Button */}
            <div className="bg-page-bg border-b-2 border-gray-300">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {returnQuery ? 'search results' : 'schools'}
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-4xl mx-auto px-4 py-8">
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
            </div>

            {/* Quick Facts Section */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
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
            </div>

            {/* Admissions Statistics */}
            {admissionsData && (
                <div className="max-w-4xl mx-auto px-4 pb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Admissions Statistics</h2>
                            {admissionsData.academic_year && (
                                <span className="text-sm text-gray-500">{admissionsData.academic_year}</span>
                            )}
                        </div>

                        {/* Acceptance Rate Highlight */}
                        {admissionsData.acceptance_rate !== null && admissionsData.acceptance_rate !== undefined && (
                            <div className={`rounded-xl p-6 border-2 mb-6 ${admissionsData.acceptance_rate < 10 ? 'bg-red-50 border-red-200 text-red-700' :
                                admissionsData.acceptance_rate < 25 ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                    admissionsData.acceptance_rate < 50 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                        admissionsData.acceptance_rate < 75 ? 'bg-green-50 border-green-200 text-green-700' :
                                            'bg-blue-50 border-blue-200 text-blue-700'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium mb-1">Acceptance Rate</p>
                                        <p className="text-4xl font-bold">
                                            {admissionsData.acceptance_rate != null
                                                ? Number(admissionsData.acceptance_rate).toFixed(1)
                                                : 'N/A'}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Award className="w-8 h-8 mb-2 ml-auto" />
                                        <p className="text-sm font-semibold">
                                            {admissionsData.acceptance_rate < 10 ? 'Most Selective' :
                                                admissionsData.acceptance_rate < 25 ? 'Highly Selective' :
                                                    admissionsData.acceptance_rate < 50 ? 'Selective' :
                                                        admissionsData.acceptance_rate < 75 ? 'Moderately Selective' :
                                                            'Less Selective'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Application Statistics */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Application Stats</h3>
                                </div>
                                <div className="space-y-3">
                                    {admissionsData.applications_total && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Total Applicants</span>
                                            <span className="font-medium">
                                                {admissionsData.applications_total.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    {admissionsData.admissions_total && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Total Admitted</span>
                                            <span className="font-medium">
                                                {admissionsData.admissions_total.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    {admissionsData.enrolled_total && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Total Enrolled</span>
                                            <span className="font-medium">
                                                {admissionsData.enrolled_total.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    {admissionsData.yield_rate !== null && admissionsData.yield_rate !== undefined && (
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-700">Yield Rate</span>
                                            <span className="font-semibold text-blue-600">
                                                {typeof admissionsData.yield_rate === 'number'
                                                    ? admissionsData.yield_rate.toFixed(1)
                                                    : Number(admissionsData.yield_rate).toFixed(1)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Test Scores */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Test Scores (SAT)</h3>
                                </div>

                                {(admissionsData.sat_math_25th || admissionsData.sat_reading_25th) ? (
                                    <div className="space-y-4">
                                        {admissionsData.sat_math_25th && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Math</p>
                                                <div className="space-y-1">
                                                    {admissionsData.sat_math_25th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">25th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_math_25th}</span>
                                                        </div>
                                                    )}
                                                    {admissionsData.sat_math_50th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">50th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_math_50th}</span>
                                                        </div>
                                                    )}
                                                    {admissionsData.sat_math_75th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">75th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_math_75th}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {admissionsData.sat_reading_25th && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Reading</p>
                                                <div className="space-y-1">
                                                    {admissionsData.sat_reading_25th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">25th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_reading_25th}</span>
                                                        </div>
                                                    )}
                                                    {admissionsData.sat_reading_50th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">50th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_reading_50th}</span>
                                                        </div>
                                                    )}
                                                    {admissionsData.sat_reading_75th && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">75th percentile</span>
                                                            <span className="font-medium">{admissionsData.sat_reading_75th}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {admissionsData.percent_submitting_sat !== null && admissionsData.percent_submitting_sat !== undefined && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-700">Students Submitting SAT</span>
                                                    <span className="text-sm font-semibold text-purple-600">
                                                        {Number(admissionsData.percent_submitting_sat).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                                        <p className="text-sm text-gray-600">
                                            SAT score data not available for this institution.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-900">
                                <strong>Note:</strong> Admissions statistics reflect data from the {admissionsData.academic_year || 'most recent'} academic year.
                                These numbers can vary year to year. For the most current information, visit the institution's admissions website.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cost Information */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                {hasAnyTuitionData ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Cost of Attendance</h2>
                            <span className="text-sm text-gray-500">{getAcademicYear()}</span>
                        </div>

                        {/* Residency Toggle */}
                        <div className="flex bg-gray-100 rounded-full p-1 mb-8 max-w-md border-2 border-gray-200">
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedResidency === 'in_state'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                onClick={() => setSelectedResidency('in_state')}
                            >
                                In-State Resident
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedResidency === 'out_of_state'
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
                                    {getCurrentFees() && getCurrentFees()! > 0 && (
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
                                    {getRoomBoard() && getRoomBoard()! > 0 ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Room & Board</span>
                                                <span className="font-medium">{formatCurrency(getRoomBoard())}</span>
                                            </div>
                                            {getBooks() && getBooks()! > 0 && (
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
                                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                            <p className="text-sm text-yellow-800">
                                                This institution doesn't provide on-campus housing data.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Total Cost Summary */}
                        {getTotalCost() > 0 && (
                            <div className="mt-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl">Estimated Total Cost</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedResidency === 'in_state' ? 'In-state resident' : 'Out-of-state resident'}
                                            {getRoomBoard() && getRoomBoard()! > 0 && ', living on campus'}
                                        </p>
                                    </div>
                                    <span className="font-bold text-3xl text-blue-600">{formatCurrency(getTotalCost())}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600">
                                <strong>Note:</strong> Costs shown are estimates for the {getAcademicYear()} academic year.
                                Contact the institution for current information and financial aid details.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Information Not Available</h3>
                            <p className="text-gray-600">We're working to add cost information for this institution.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}