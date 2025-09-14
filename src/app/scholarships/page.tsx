// src/app/scholarships/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, DollarSign, Award, Calendar } from 'lucide-react';
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
    }, [page, searchTerm]);

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
                    </div>
                </div>
            </div>

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
                            Try adjusting your search terms to find more scholarships.
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

                            {/* Quick Stats - FIXED: No double dollar signs */}
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