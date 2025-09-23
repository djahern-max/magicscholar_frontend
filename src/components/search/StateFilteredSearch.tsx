// src/components/search/StateFilterSearch.tsx
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Your available states - matches your backend curated schools
const AVAILABLE_STATES = [
    { code: 'ALL', name: 'All States', color: 'bg-blue-100 text-blue-800' },
    { code: 'NH', name: 'New Hampshire', color: 'bg-green-100 text-green-800' },
    { code: 'MA', name: 'Massachusetts', color: 'bg-purple-100 text-purple-800' },
    // Coming soon states
    { code: 'CT', name: 'Connecticut', color: 'bg-indigo-100 text-indigo-800', disabled: true },
    { code: 'VT', name: 'Vermont', color: 'bg-emerald-100 text-emerald-800', disabled: true },
    { code: 'ME', name: 'Maine', color: 'bg-teal-100 text-teal-800', disabled: true },
    { code: 'RI', name: 'Rhode Island', color: 'bg-cyan-100 text-cyan-800', disabled: true },
];

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
}

interface StateFilterSearchProps {
    onInstitutionClick?: (institutionId: number) => void;
}

const StateFilterSearch: React.FC<StateFilterSearchProps> = ({ onInstitutionClick }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('ALL');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    // Search institutions
    const searchInstitutions = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/v1/institutions/?per_page=50`;

            // Add search query if provided
            if (searchQuery.trim()) {
                url = `${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(searchQuery)}&per_page=50`;
            }

            // Add state filter if not 'ALL'
            if (selectedState !== 'ALL') {
                const separator = url.includes('?') ? '&' : '?';
                url += `${separator}state=${selectedState}`;
            }

            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data);

                const institutionsArray = data.institutions || data;
                const total = data.total || institutionsArray.length;

                setInstitutions(Array.isArray(institutionsArray) ? institutionsArray : []);
                setTotalResults(total);
            } else {
                console.error('Search failed:', response.status);
                setInstitutions([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error('Search error:', error);
            setInstitutions([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    // Trigger search when filters change
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            searchInstitutions();
        }, 300); // Debounce search

        return () => clearTimeout(delayedSearch);
    }, [searchQuery, selectedState]);

    const handleStateClick = (stateCode: string) => {
        const state = AVAILABLE_STATES.find(s => s.code === stateCode);
        if (state?.disabled) return;
        setSelectedState(stateCode);
    };

    const handleInstitutionClick = (institutionId: number) => {
        if (onInstitutionClick) {
            onInstitutionClick(institutionId);
        } else {
            // Build return parameters for navigation
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

    return (
        <div className="w-full">
            {/* Search Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Find Your Perfect University
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Discover top universities with detailed cost information
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search universities, cities, or programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* State Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {AVAILABLE_STATES.map((state) => (
                        <button
                            key={state.code}
                            onClick={() => handleStateClick(state.code)}
                            disabled={state.disabled}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${state.disabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                    : selectedState === state.code
                                        ? `${state.color} ring-2 ring-offset-2 ring-blue-400 shadow-md scale-105`
                                        : `${state.color} hover:shadow-md hover:scale-105 cursor-pointer`
                                }
              `}
                        >
                            {state.name}
                            {state.disabled && ' (Coming Soon)'}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    {loading ? (
                        <span>Searching...</span>
                    ) : (
                        <span>
                            Found {totalResults} {totalResults === 1 ? 'university' : 'universities'}
                            {selectedState !== 'ALL' && ` in ${AVAILABLE_STATES.find(s => s.code === selectedState)?.name}`}
                        </span>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="w-full">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Searching universities...</p>
                    </div>
                ) : institutions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {institutions.map((institution) => (
                            <div
                                key={institution.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                onClick={() => handleInstitutionClick(institution.id)}
                            >
                                {/* Image */}
                                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                                    {institution.display_image_url || institution.primary_image_url ? (
                                        <img
                                            src={institution.display_image_url || institution.primary_image_url}
                                            alt={`${institution.name} campus`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <MapPin className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm">No image available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                        {institution.name}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                        <span className="text-sm">{institution.city}, {institution.state}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {getControlTypeDisplay(institution.control_type)}
                                        </span>
                                        {institution.size_category && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                {getSizeCategoryDisplay(institution.size_category)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-center">
                                        View Details & Costs
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No universities found</h3>
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