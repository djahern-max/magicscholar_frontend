// src/app/scholarships/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, DollarSign, Award, Calendar } from 'lucide-react';
import ScholarshipCard from '@/components/scholarships/scholarship-card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Scholarship {
    id: number;
    title: string;
    description: string;
    organization: string;
    website_url?: string;
    application_url?: string;
    scholarship_type: string;
    categories?: string[];
    status: string;
    difficulty_level: string;
    amount_min?: number;
    amount_max?: number;
    amount_exact?: number;
    is_renewable: boolean;
    renewal_years?: number;
    number_of_awards?: number;
    min_gpa?: number;
    academic_level?: string[];
    deadline?: string;
    primary_image_url?: string;
    primary_image_quality_score?: number;
    logo_image_url?: string;
    created_at: string;
}

interface ScholarshipsResponse {
    scholarships: Scholarship[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export default function ScholarshipsPage() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchScholarships = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                active_only: 'true'
            });

            if (searchTerm) {
                params.append('search_query', searchTerm);
            }
            if (typeFilter) {
                params.append('scholarship_type', typeFilter);
            }
            // Note: Add difficulty filter once backend supports it

            const response = await fetch(`${API_BASE_URL}/api/v1/scholarships/?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ScholarshipsResponse = await response.json();

            setScholarships(data.scholarships || []);
            setTotalPages(data.total_pages || 1);
            setError(null);
        } catch (err) {
            console.error('Error fetching scholarships:', err);
            setError('Failed to load scholarships. Please try again later.');
            setScholarships([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, typeFilter]);

    useEffect(() => {
        fetchScholarships();
    }, [fetchScholarships]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchScholarships();
    };

    const clearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    const clearFilters = () => {
        setTypeFilter('');
        setDifficultyFilter('');
        setPage(1);
    };

    const scholarshipTypes = [
        { value: 'academic_merit', label: 'Academic Merit' },
        { value: 'need_based', label: 'Need-Based' },
        { value: 'stem', label: 'STEM' },
        { value: 'diversity', label: 'Diversity & Inclusion' },
        { value: 'leadership', label: 'Leadership' },
        { value: 'athletic', label: 'Athletic' },
        { value: 'arts', label: 'Arts & Humanities' },
        { value: 'community_service', label: 'Community Service' },
        { value: 'first_generation', label: 'First Generation' }
    ];

    const difficultyLevels = [
        { value: 'easy', label: 'Easy' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'hard', label: 'Hard' },
        { value: 'very_hard', label: 'Very Hard' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Find Your Perfect Scholarship
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Discover scholarship opportunities from leading organizations
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by scholarship name, organization, or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Filter Toggle */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                                {(typeFilter || difficultyFilter) && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Active
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Scholarship Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scholarship Type
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Types</option>
                                    {scholarshipTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Difficulty
                                </label>
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Levels</option>
                                    {difficultyLevels.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="text-red-800">{error}</div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading scholarships...</p>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="text-center py-12">
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms or filters to find more scholarships.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results Summary */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing {scholarships.length} scholarships
                                {searchTerm && ` for "${searchTerm}"`}
                            </p>

                            {/* Quick Stats */}
                            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    Various amounts
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Multiple deadlines
                                </div>
                            </div>
                        </div>

                        {/* Scholarships Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {scholarships.map((scholarship) => (
                                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    <span className="px-4 py-2 text-sm text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}