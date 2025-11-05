// src/components/search/AdvancedInstitutionSearch.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, School } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SearchFilters {
    query: string;
    state: string;
    controlType: string;
    minAcceptanceRate?: number;
    maxAcceptanceRate?: number;
    sizeCategory?: string;
}

interface Institution {
    id: number;
    name: string;
    city: string;
    state: string;
    control_type: string;
    primary_image_url?: string;
}

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function AdvancedInstitutionSearch() {
    const router = useRouter();
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        state: '',
        controlType: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        searchInstitutions();
    }, [filters, page]);

    const searchInstitutions = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/v1/institutions/?page=${page}&limit=20`;

            if (filters.state) url += `&state=${filters.state}`;
            if (filters.controlType) url += `&control_type=${filters.controlType}`;
            if (filters.query) url += `&search_query=${encodeURIComponent(filters.query)}`;

            const response = await axios.get(url);
            setInstitutions(response.data.institutions || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to page 1 on filter change
    };

    const clearFilters = () => {
        setFilters({
            query: '',
            state: '',
            controlType: '',
        });
    };

    const activeFilterCount = [
        filters.state,
        filters.controlType,
        filters.query,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search colleges by name or city..."
                            value={filters.query}
                            onChange={(e) => handleFilterChange('query', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Filter className="h-5 w-5" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* State Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    value={filters.state}
                                    onChange={(e) => handleFilterChange('state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All States</option>
                                    {US_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Control Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    value={filters.controlType}
                                    onChange={(e) => handleFilterChange('controlType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Types</option>
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE_NONPROFIT">Private Non-Profit</option>
                                    <option value="PRIVATE_FOR_PROFIT">Private For-Profit</option>
                                </select>
                            </div>

                            {/* Size Category - Coming Soon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size <span className="text-xs text-gray-500">(Coming Soon)</span>
                                </label>
                                <select
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                                >
                                    <option value="">All Sizes</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                <X className="h-4 w-4" />
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {total} College{total !== 1 ? 's' : ''} Found
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : institutions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {institutions.map((school) => (
                            <div
                                key={school.id}
                                onClick={() => router.push(`/institution/${school.id}`)}
                                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    {school.primary_image_url ? (
                                        <img
                                            src={school.primary_image_url}
                                            alt={school.name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                            <School className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {school.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {school.city}, {school.state}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {school.control_type === 'PUBLIC' ? 'Public' : 'Private'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No colleges found matching your criteria</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {total > 20 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            Page {page} of {Math.ceil(total / 20)}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= Math.ceil(total / 20)}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}