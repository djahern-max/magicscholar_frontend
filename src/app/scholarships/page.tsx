// src/app/scholarships/page.tsx - Matching schools page design
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, DollarSign, Award, Calendar } from 'lucide-react';
import ScholarshipCard from '@/components/scholarships/scholarship-card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Scholarship types with icons - matching state filter style
const SCHOLARSHIP_TYPES = [
    { code: 'ALL', name: 'All', icon: '🌟' },
    { code: 'academic_merit', name: 'Academic Merit', icon: '🎓' },
    { code: 'need_based', name: 'Need-Based', icon: '💰' },
    { code: 'stem', name: 'STEM', icon: '🔬' },
    { code: 'arts', name: 'Arts', icon: '🎨' },
    { code: 'diversity', name: 'Diversity', icon: '🌈' },
    { code: 'athletic', name: 'Athletic', icon: '⚽' },
    { code: 'leadership', name: 'Leadership', icon: '👔' },
    { code: 'military', name: 'Military', icon: '🎖️' },
    { code: 'career_specific', name: 'Career-Specific', icon: '💼' },
];

interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type: string;
    difficulty_level: string;
    amount_min: number;
    amount_max: number;
    is_renewable: boolean;
    number_of_awards?: number;
    deadline?: string;
    min_gpa?: number;
    primary_image_url?: string;
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
    const [selectedType, setSelectedType] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchScholarships = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '48',
                active_only: 'true'
            });

            if (searchTerm) {
                params.append('search_query', searchTerm);
            }

            if (selectedType !== 'ALL') {
                params.append('scholarship_type', selectedType);
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
    }, [page, searchTerm, selectedType]);

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

    const handleTypeClick = (typeCode: string) => {
        setSelectedType(typeCode);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Matching schools page style */}
            <div className="bg-gray-50 border-b-2 border-gray-300">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-3">
                            <span>Discover</span>{' '}
                            <span>Scholarships</span>
                        </h1>
                        <p className="text-gray-700">
                            or <a href="/" className="text-blue-600 hover:text-blue-700 font-medium underline">schools</a>
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
                                placeholder="Search for scholarships"
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

                    {/* Scholarship Type Filter Buttons - Matching state filter style */}
                    <div className="overflow-x-auto pb-4 -mx-4 px-4">
                        <div className="flex flex-wrap justify-center gap-2 min-w-max">
                            {SCHOLARSHIP_TYPES.map((type) => (
                                <button
                                    key={type.code}
                                    onClick={() => handleTypeClick(type.code)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors border-2 rounded-full whitespace-nowrap ${selectedType === type.code
                                        ? 'bg-gray-400 text-white border-gray-400'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-2">{type.icon}</span>
                                    {type.name}
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
                        <p className="mt-4 text-gray-600">Loading scholarships...</p>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms to find more scholarships."
                                : "We couldn't load any scholarships."}
                        </p>
                        <button
                            onClick={() => {
                                clearSearch();
                                setSelectedType('ALL');
                            }}
                            className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
                        >
                            Show All Scholarships
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-sm text-gray-600">
                            <span>
                                {scholarships.length} {scholarships.length === 1 ? 'scholarship' : 'scholarships'}
                                {selectedType !== 'ALL' && ` in ${SCHOLARSHIP_TYPES.find(t => t.code === selectedType)?.name}`}
                                {searchTerm && ` matching "${searchTerm}"`}
                            </span>
                        </div>

                        {/* Scholarships Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {scholarships.map((scholarship) => (
                                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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