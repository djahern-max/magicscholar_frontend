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

export default function InstitutionDetail() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [costData, setCostData] = useState<CostData | null>(null);
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

                    // Fetch cost data using new costs endpoint
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
        const sizes = {
            'very_small': 'Very Small (<1,000)',
            'small': 'Small (1,000-2,999)',
            'medium': 'Medium (3,000-9,999)',
            'large': 'Large (10,000-19,999)',
            'very_large': 'Very Large (20,000+)'
        };
        return sizes[sizeCategory as keyof typeof sizes] || sizeCategory;
    };

    const formatLocale = (locale?: string | null): string => {
        if (!locale) return '';

        // If already formatted text
        if (locale.includes(':')) return locale.split(':')[1].trim();

        // If numeric code, map it
        const localeMap: Record<string, string> = {
            '11': 'Large City', '12': 'Midsize City', '13': 'Small City',
            '21': 'Large Suburb', '22': 'Midsize Suburb', '23': 'Small Suburb',
            '31': 'Fringe Town', '32': 'Distant Town', '33': 'Remote Town',
            '41': 'Fringe Rural', '42': 'Distant Rural', '43': 'Remote Rural',
        };

        return localeMap[locale] || locale;
    };

    const getLocaleHoverText = (locale?: string | null): string => {
        if (!locale) return '';

        const localeDescriptions: Record<string, string> = {
            'Ill Big City Yo': 'Traffic jams, noise complaints, and a coffee shop every 10 feet. Living the dream! 🏙️',
            'Mid Sized City Dawg': 'Big enough to have options, small enough to not get lost. The Goldilocks zone 👌',
            'Enough City to Tickle the Itch': 'Just enough urban vibes without the full chaos. Perfect for city-curious folks 🌆',
            'The Biggest of the Burbs': 'Mall culture meets soccer practice. Your parents would be proud 🏡',
            'Mid Sized Burb Yo': 'Strip malls and chain restaurants as far as the eye can see. Welcome home! 🛒',
            'Itty Bitty Burb': 'Everyone knows everyone. Privacy sold separately 👀',
            'Fringe Town Dawg': 'College bars, late-night diners, and questionable life choices. Peak college experience 🎓🍻',
            'We Getting Rustic Now': 'Population: 47 people and a gas station. But hey, the stars are pretty! ⭐',
            'Straight Up Rustic': 'Where GPS gives up and you start using landmarks like "the old barn" 🌾',
            'Woodsy kid': 'Trees everywhere. Like, EVERYWHERE. Hope you like nature 🌲',
            'I see FORESTTTT': 'Seriously, it\'s just trees. Trees on trees on trees. Bring bug spray 🌳🦟',
            'Straight Up Country Bro': 'Nearest Starbucks: 45 minutes. Nearest tractor: your neighbor\'s yard 🚜',
            'Not Available': 'Location data said "nah fam, I\'m good" 🤷'
        };

        return localeDescriptions[locale] || locale;
    };

    const getLocaleEmoji = (locale?: string | null): string => {
        if (!locale) return '📍';

        const emojiMap: Record<string, string> = {
            'Ill Big City Yo': '🏙️',
            'Mid Sized City Dawg': '🌆',
            'Enough City to Tickle the Itch': '🌃',
            'The Biggest of the Burbs': '🏡',
            'Mid Sized Burb Yo': '🏘️',
            'Itty Bitty Burb': '🏠',
            'Fringe Town Dawg': '🎓',
            'We Getting Rustic Now': '⭐',
            'Straight Up Rustic': '🌾',
            'Woodsy kid': '🌲',
            'I see FORESTTTT': '🌳',
            'Straight Up Country Bro': '🚜',
            'Not Available': '❓'
        };

        return emojiMap[locale] || '📍';
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

                                {/* Data Source Link */}
                                {costData?.data_source && (
                                    <div className="mt-4">
                                        {costData.data_source.startsWith('http') ? (
                                            <a
                                                href={costData.data_source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 text-blue-600 mr-1" />
                                                <span className="text-sm text-blue-700 font-medium">
                                                    View Official Source
                                                </span>
                                            </a>
                                        ) : (
                                            <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                                                <AlertCircle className="w-4 h-4 text-gray-600 mr-1" />
                                                <span className="text-sm text-gray-700 font-medium">
                                                    Source: {costData.data_source}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



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
                                                This institution doesn't provide on-campus housing data. Students typically commute or live off-campus.
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

                        {/* Disclaimer */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600">
                                <strong>Note:</strong> Costs shown are estimates for the {getAcademicYear()} academic year.
                                Actual costs may vary. Contact the institution directly for the most current information and details about financial aid opportunities.
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


            <div className="max-w-4xl mx-auto px-4 pb-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Admissions</h2>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Acceptance Rate */}
                        <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <div className="text-4xl font-bold text-blue-600 mb-2">3.5%</div>
                            <div className="text-sm font-semibold text-gray-700">Acceptance Rate</div>
                            <div className="text-xs text-gray-500 mt-1">Highly selective</div>
                        </div>

                        {/* Applications */}
                        <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                            <div className="text-4xl font-bold text-purple-600 mb-2">56,937</div>
                            <div className="text-sm font-semibold text-gray-700">Applications</div>
                            <div className="text-xs text-gray-500 mt-1">2023-2024</div>
                        </div>

                        {/* Yield Rate */}
                        <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                            <div className="text-4xl font-bold text-green-600 mb-2">83.7%</div>
                            <div className="text-sm font-semibold text-gray-700">Yield Rate</div>
                            <div className="text-xs text-gray-500 mt-1">Students who enroll</div>
                        </div>
                    </div>







                    {/* SAT Scores */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            📊 SAT Scores
                            <span className="ml-2 text-xs text-gray-500 font-normal">(52% of students submit SAT)</span>
                        </h3>

                        {/* SAT Reading */}
                        <div className="mb-4 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Evidence-Based Reading</span>
                                <span className="text-xs text-gray-500">Middle 50% Range</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">740</div>
                                    <div className="text-xs text-gray-600 mt-1">Low</div>
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="h-2 bg-blue-200 rounded-full relative">
                                        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">780</div>
                                    <div className="text-xs text-gray-600 mt-1">High</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                                Half of admitted students scored between 740-780
                            </p>
                        </div>

                        {/* SAT Math */}
                        <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Math</span>
                                <span className="text-xs text-gray-500">Middle 50% Range</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">760</div>
                                    <div className="text-xs text-gray-600 mt-1">Low</div>
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="h-2 bg-purple-200 rounded-full relative">
                                        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">800</div>
                                    <div className="text-xs text-gray-600 mt-1">High</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                                Half of admitted students scored between 760-800
                            </p>
                        </div>
                    </div>








                    {/* Info Note */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600">
                            <strong>Note:</strong> Score ranges represent the 25th-75th percentile of admitted students.
                            50% of admitted students scored within these ranges. Test scores are just one factor in admissions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Facts Section - WITH COOL EMOJIS */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg overflow-visible">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                        <Star className="w-5 h-5 text-blue-600 mr-2" />
                        Quick Facts
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
                        {/* Student-Faculty Ratio */}
                        {institution.student_faculty_ratio && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-2">
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

                        {/* Location Type with EMOJI and Hover Tooltip */}
                        {institution.locale && (
                            <div
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-help relative group overflow-visible"
                            >
                                <div className="flex items-center mb-2">
                                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-sm font-semibold text-gray-700">Location Type</span>
                                </div>
                                <div className="text-5xl mb-1">
                                    {getLocaleEmoji(institution.locale)}
                                </div>
                                <p className="text-xs text-gray-600">
                                    {institution.locale}
                                </p>

                                {/* Custom Tooltip - appears on hover */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-2xl w-72 text-center">
                                    {getLocaleHoverText(institution.locale)}
                                    {/* Tooltip arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                        <div className="border-8 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Student Population */}
                        {institution.size_category && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-2">
                                    <GraduationCap className="w-5 h-5 text-purple-600 mr-2" />
                                    <span className="text-sm font-semibold text-gray-700">Student Population</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {Math.round(parseFloat(institution.size_category)).toLocaleString()}
                                </div>
                                <p className="text-xs text-gray-600">
                                    {Math.round(parseFloat(institution.size_category)) < 2000 ? 'Small campus' :
                                        Math.round(parseFloat(institution.size_category)) < 10000 ? 'Medium campus' :
                                            Math.round(parseFloat(institution.size_category)) < 20000 ? 'Large campus' :
                                                'Very large campus'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}