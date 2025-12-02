// src/components/search/StateFilteredSearch.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import InstitutionCard from '@/components/institutions/institution-card';
import { Institution, InstitutionListResponse } from '@/types/institution';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// US States with icons - matching scholarships page style
const US_STATES = [
    { code: 'ALL', name: 'All States', icon: '🌎' },
    { code: 'NH', name: 'New Hampshire', icon: '🏔️' },
    { code: 'MA', name: 'Massachusetts', icon: '📚' },
    { code: 'VT', name: 'Vermont', icon: '🍁' },
    { code: 'NY', name: 'New York', icon: '🗽' },
    { code: 'FL', name: 'Florida', icon: '🌴' },
    { code: 'CA', name: 'California', icon: '☀️' },
    { code: 'TX', name: 'Texas', icon: '🤠' },
    { code: 'PA', name: 'Pennsylvania', icon: '🔔' },
    { code: 'IL', name: 'Illinois', icon: '🌆' },
    { code: 'OH', name: 'Ohio', icon: '🌰' },
    { code: 'NC', name: 'North Carolina', icon: '🏖️' },
    { code: 'GA', name: 'Georgia', icon: '🍑' },
    { code: 'MI', name: 'Michigan', icon: '🚗' },
    { code: 'NJ', name: 'New Jersey', icon: '🏖️' },
    { code: 'VA', name: 'Virginia', icon: '⛰️' },
    { code: 'WA', name: 'Washington', icon: '🌲' },
    { code: 'AZ', name: 'Arizona', icon: '🌵' },
    { code: 'MD', name: 'Maryland', icon: '🦀' },
    { code: 'CO', name: 'Colorado', icon: '⛷️' },
    { code: 'MN', name: 'Minnesota', icon: '🏒' },
];

interface StateFilteredSearchProps {
    initialState?: string;
}

export default function StateFilteredSearch({ initialState }: StateFilteredSearchProps) {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState(initialState || 'ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchInstitutions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '48',
            });

            if (selectedState !== 'ALL') {
                params.append('state', selectedState);
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/institutions/?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // ✅ FIXED: Use InstitutionListResponse type from types file
            const data: InstitutionListResponse = await response.json();

            // ✅ FIXED: Backend returns "institutions", not "items"
            setInstitutions(data.institutions || []);
            setTotal(data.total || 0);
            setTotalPages(data.total_pages || 1);
            setError(null);
        } catch (err) {
            console.error('Error fetching institutions:', err);
            setError('Failed to load institutions. Please try again later.');
            setInstitutions([]);
        } finally {
            setLoading(false);
        }
    }, [page, selectedState]);

    useEffect(() => {
        fetchInstitutions();
    }, [fetchInstitutions]);

    const clearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    const handleStateClick = (stateCode: string) => {
        setSelectedState(stateCode);
        setPage(1);
    };

    // Filter institutions by search term on the client side
    const filteredInstitutions = searchTerm
        ? institutions.filter(inst =>
            inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.city.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : institutions;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Matching scholarships page style */}
            <div className="bg-gray-50 border-b-2 border-gray-300">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-3">
                            <span>Discover</span>{' '}
                            <span>Schools</span>
                        </h1>
                        <p className="text-gray-700">
                            or <a href="/scholarships" className="text-blue-600 hover:text-blue-700 font-medium underline">scholarships</a>
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for schools"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 shadow-sm transition-colors"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* State Filter Buttons */}
                    <div className="overflow-x-auto pb-4 -mx-4 px-4">
                        <div className="flex flex-wrap justify-center gap-2 min-w-max">
                            {US_STATES.map((state) => (
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
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading schools...</p>
                    </div>
                ) : filteredInstitutions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms to find more schools."
                                : "We couldn't load any schools."}
                        </p>
                        <button
                            onClick={() => {
                                clearSearch();
                                setSelectedState('ALL');
                            }}
                            className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
                        >
                            Show All Schools
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-sm text-gray-600">
                            <span>
                                {filteredInstitutions.length} of {total} {total === 1 ? 'school' : 'schools'}
                                {selectedState !== 'ALL' && ` in ${US_STATES.find(s => s.code === selectedState)?.name}`}
                                {searchTerm && ` matching "${searchTerm}"`}
                            </span>
                        </div>

                        {/* Institutions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredInstitutions.map((institution) => (
                                <InstitutionCard key={institution.id} institution={institution} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && !searchTerm && (
                            <div className="flex items-center justify-center space-x-2 mt-8">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                <span className="px-4 py-2 text-sm text-gray-700">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}