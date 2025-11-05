// src/components/search/StateFilteredSearch.tsx
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Users, GraduationCap, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Your available states with icons (using abbreviations)
const AVAILABLE_STATES = [
    { code: 'ALL', name: 'All', icon: '🌟' },
    { code: 'AL', name: 'AL', icon: '🏈' },
    { code: 'AR', name: 'AR', icon: '💎' },
    { code: 'AK', name: 'AK', icon: '🏔️' },
    { code: 'AZ', name: 'AZ', icon: '🌵' },
    { code: 'CA', name: 'CA', icon: '🌴' },
    { code: 'CO', name: 'CO', icon: '⛰️' },
    { code: 'CT', name: 'CT', icon: '🌳' },
    { code: 'DC', name: 'DC', icon: '🏛️' },
    { code: 'DE', name: 'DE', icon: '🦅' },
    { code: 'FL', name: 'FL', icon: '🌊' },
    { code: 'GA', name: 'GA', icon: '🍑' },
    { code: 'HI', name: 'HI', icon: '🌺' },
    { code: 'IA', name: 'IA', icon: '🌽' },
    { code: 'ID', name: 'ID', icon: '🥔' },
    { code: 'IL', name: 'IL', icon: '🌆' },
    { code: 'IN', name: 'IN', icon: '🏎️' },
    { code: 'KS', name: 'KS', icon: '🌾' },
    { code: 'KY', name: 'KY', icon: '🐴' },
    { code: 'LA', name: 'LA', icon: '🎷' },
    { code: 'MA', name: 'MA', icon: '🎓' },
    { code: 'MD', name: 'MD', icon: '🦀' },
    { code: 'ME', name: 'ME', icon: '🦞' },
    { code: 'MI', name: 'MI', icon: '🚗' },
    { code: 'MN', name: 'MN', icon: '❄️' },
    { code: 'MO', name: 'MO', icon: '🎸' },
    { code: 'MS', name: 'MS', icon: '🎵' },
    { code: 'MT', name: 'MT', icon: '🦌' },
    { code: 'NC', name: 'NC', icon: '🏀' },
    { code: 'ND', name: 'ND', icon: '🌾' },
    { code: 'NE', name: 'NE', icon: '🌽' },
    { code: 'NH', name: 'NH', icon: '🏔️' },
    { code: 'NJ', name: 'NJ', icon: '🏖️' },
    { code: 'NM', name: 'NM', icon: '🌶️' },
    { code: 'NV', name: 'NV', icon: '🎰' },
    { code: 'NY', name: 'NY', icon: '🗽' },
    { code: 'OH', name: 'OH', icon: '🌰' },
    { code: 'OK', name: 'OK', icon: '🤠' },
    { code: 'OR', name: 'OR', icon: '🌲' },
    { code: 'PA', name: 'PA', icon: '🔔' },
    { code: 'RI', name: 'RI', icon: '⚓' },
    { code: 'SC', name: 'SC', icon: '🌴' },
    { code: 'SD', name: 'SD', icon: '🗻' },
    { code: 'TN', name: 'TN', icon: '🎸' },
    { code: 'TX', name: 'TX', icon: '⭐' },
    { code: 'UT', name: 'UT', icon: '🏔️' },
    { code: 'VA', name: 'VA', icon: '🏛️' },
    { code: 'VT', name: 'VT', icon: '🍁' },
    { code: 'WA', name: 'WA', icon: '🌲' },
    { code: 'WI', name: 'WI', icon: '🧀' },
    { code: 'WV', name: 'WV', icon: '⛰️' },
    { code: 'WY', name: 'WY', icon: '🦬' },
];

// Dynamic items per page based on selection
const ITEMS_PER_PAGE_ALL = 48; // Show many schools when viewing all (divisible by 2, 3, 4, 6)
const ITEMS_PER_PAGE_STATE = 12; // Show all schools in a state at once

interface Institution {
    id: number;
    name: string;
    city: string;
    state: string;
    display_name: string;
    control_type: string;
    size_category: string;
    display_image_url?: string;
    primary_image_url?: string;
    website?: string;
}

interface StateFilterSearchProps {
    onInstitutionClick?: (institutionId: number) => void;
    initialState?: string;
}

const StateFilterSearch: React.FC<StateFilterSearchProps> = ({ onInstitutionClick }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('ALL');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Search institutions
    const searchInstitutions = async (page: number = 1, append: boolean = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            // Use different page sizes based on selection
            const itemsPerPage = selectedState === 'ALL' ? ITEMS_PER_PAGE_ALL : ITEMS_PER_PAGE_STATE;
            let url = `${API_BASE_URL}/api/v1/institutions/?page=${page}&limit=${itemsPerPage}`;

            // Add search query if provided
            if (searchQuery.trim()) {
                url = `${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=${itemsPerPage}`;
            }

            // Add state filter if not 'ALL'
            if (selectedState !== 'ALL') {
                url = `${API_BASE_URL}/api/v1/institutions/by-state/${selectedState}`;
            } else {
                url = `${API_BASE_URL}/api/v1/institutions/?page=${page}&limit=${itemsPerPage}`;
            }

            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data);

                const institutionsArray = data.institutions || data;
                const total = data.total || institutionsArray.length;

                if (append) {
                    setInstitutions(prev => [...prev, ...institutionsArray]);
                } else {
                    setInstitutions(Array.isArray(institutionsArray) ? institutionsArray : []);
                }

                setTotalResults(total);
                setCurrentPage(page);

                // Check if there are more results
                const loadedCount = append ? institutions.length + institutionsArray.length : institutionsArray.length;
                setHasMore(loadedCount < total);
            } else {
                console.error('Search failed:', response.status);
                if (!append) {
                    setInstitutions([]);
                    setTotalResults(0);
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            if (!append) {
                setInstitutions([]);
                setTotalResults(0);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Trigger search when filters change (reset to page 1)
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            searchInstitutions(1, false);
        }, 300); // Debounce search

        return () => clearTimeout(delayedSearch);
    }, [searchQuery, selectedState]);

    const handleLoadMore = () => {
        searchInstitutions(currentPage + 1, true);
    };

    const handleStateClick = (stateCode: string) => {
        setSelectedState(stateCode);
    };

    const handleInstitutionClick = (institutionId: number) => {
        if (onInstitutionClick) {
            onInstitutionClick(institutionId);
        } else {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (selectedState !== 'ALL') params.append('state', selectedState);

            const url = `/institution/${institutionId}${params.toString() ? `?${params.toString()}` : ''}`;
            router.push(url);
        }
    };

    const getControlTypeDisplay = (controlType: string) => {
        const types = {
            'public': 'Public',
            'private': 'Private',
            'private_nonprofit': 'Private Non-Profit',
            'private_for_profit': 'Private For-Profit'
        };
        return types[controlType.toLowerCase() as keyof typeof types] || controlType;
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

    return (
        <div className="w-full">
            {/* Search Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3">
                    <span>Discover Schools</span>
                </h1>
                <p className="text-gray-700 mb-8">
                    or <a href="/scholarships" className="text-blue-600 hover:text-blue-700 font-medium underline">scholarships</a>
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search universities, cities, or programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 shadow-sm transition-colors"
                        />
                    </div>
                </div>

                {/* State Filter Buttons with icons */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4">
                    <div className="flex flex-wrap justify-center gap-2 min-w-max">
                        {AVAILABLE_STATES.map((state) => (
                            <button
                                key={state.code}
                                onClick={() => handleStateClick(state.code)}
                                className={`px-4 py-2 text-sm font-medium transition-colors border-2 rounded-full whitespace-nowrap ${selectedState === state.code
                                    ? 'bg-gray-400 text-white border-gray-400'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-2">{state.icon}</span>
                                {state.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-6 text-sm text-gray-600">
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Searching...
                        </span>
                    ) : (
                        <span>
                            Showing {institutions.length} of {totalResults} {totalResults === 1 ? 'university' : 'universities'}
                            {selectedState !== 'ALL' && ` in ${AVAILABLE_STATES.find(s => s.code === selectedState)?.name}`}
                        </span>
                    )}
                </div>
            </div>

            {/* Results - matching your page.tsx card design */}
            <div className="w-full">
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Loading universities...</p>
                    </div>
                ) : institutions.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {institutions.map((institution) => (
                                <div
                                    key={institution.id}
                                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200 cursor-pointer"
                                    onClick={() => handleInstitutionClick(institution.id)}
                                >
                                    {/* Institution Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        {institution.display_image_url || institution.primary_image_url ? (
                                            <img
                                                src={institution.display_image_url || institution.primary_image_url}
                                                alt={institution.display_name || institution.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <GraduationCap className="w-16 h-16 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Institution Info */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {institution.display_name || institution.name}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                                                <span>{institution.city}, {institution.state}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                                                <span className="text-xs">{getSizeCategoryDisplay(institution.size_category)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                                                <span className="text-xs">{getControlTypeDisplay(institution.control_type)}</span>
                                            </div>
                                        </div>

                                        {/* Footer with stats */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-sm font-medium text-gray-900">
                                                View details
                                            </span>
                                            {institution.website && (
                                                <a
                                                    href={institution.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Loading more...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Load More Schools</span>
                                            <span className="text-sm opacity-90">
                                                ({institutions.length} of {totalResults})
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : !loading && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No universities found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms or selecting a different state
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StateFilterSearch;