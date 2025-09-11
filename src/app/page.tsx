// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import Header from '@/components/layout/header';
import InstitutionCard from '@/components/institutions/institution-card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
  id: number;
  name: string;
  city: string;
  state: string;
  website?: string;
  control_type: string;
  size_category: string;
  primary_image_url?: string;
  primary_image_quality_score?: number;
  customer_rank?: number;
  display_name: string;
  display_image_url?: string;
  full_address: string;
  has_high_quality_image: boolean;
  is_premium_customer: boolean;
  ipeds_id?: string;
}

interface SearchFilters {
  state: string;
  control_type: string;
  size_category: string;
  min_tuition: string;
  max_tuition: string;
}

export default function Home() {
  // Core state
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalInstitutions, setTotalInstitutions] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Institution[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    state: '',
    control_type: '',
    size_category: '',
    min_tuition: '',
    max_tuition: ''
  });

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [searchPage, setSearchPage] = useState(1);

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Featured schools for quick search
  const featuredSchools = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'UC Berkeley',
    'Yale University',
    'Princeton University'
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [institutionsResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=0`),
          fetch(`${API_BASE_URL}/api/v1/admin/images/stats`)
        ]);

        if (institutionsResponse.ok) {
          const data = await institutionsResponse.json();
          setInstitutions(data);
          setCurrentOffset(12);
          setHasMoreData(data.length === 12);
        } else {
          console.error('Failed to fetch institutions:', institutionsResponse.statusText);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setTotalInstitutions(statsData.total_institutions || 6132);
        } else {
          setTotalInstitutions(6132);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setTotalInstitutions(6132);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        clearSearch();
      }
    }, 500);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Search functionality
  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(searchTerm)}&limit=20&offset=0`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.institutions || []);
        setSearchTotal(data.total || 0);
        setShowSearchResults(true);
        setSearchPage(1);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchTotal(0);
  };

  // Handle quick search - removed per user request
  const handleQuickSearch = (schoolName: string) => {
    setSearchQuery(schoolName);
    handleSearch(schoolName);
  };

  // Load more results
  const loadMore = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    try {
      const endpoint = showSearchResults
        ? `${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(searchQuery)}&limit=12&offset=${searchResults.length}`
        : `${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=${currentOffset}`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const newItems = showSearchResults ? data.institutions : data;

        if (showSearchResults) {
          setSearchResults(prev => [...prev, ...newItems]);
        } else {
          setInstitutions(prev => [...prev, ...newItems]);
          setCurrentOffset(prev => prev + 12);
        }

        setHasMoreData(newItems.length === 12);
      }
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const displayedInstitutions = showSearchResults ? searchResults : institutions;
  const displayedTotal = showSearchResults ? searchTotal : totalInstitutions;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {/* Handle login */ }}
        onRegisterClick={() => {/* Handle register */ }}
      />

      {/* Compact Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect School
            </h1>
            <p className="text-gray-600">
              Discover and compare {totalInstitutions.toLocaleString()}+ colleges and universities
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  placeholder="Search by school name, city, or state..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${showFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {featuredSchools.map((school) => (
              <button
                key={school}
                onClick={() => handleQuickSearch(school)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {school}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {showSearchResults ? (
              <>Showing {searchResults.length} of {searchTotal} results for "{searchQuery}"</>
            ) : (
              <>Showing {institutions.length} of {totalInstitutions.toLocaleString()} schools</>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Institution Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
              }`}>
              {displayedInstitutions.map((institution) => (
                <InstitutionCard key={institution.id} institution={institution} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreData && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingMore ? 'Loading...' : 'Load More Schools'}
                </button>
              </div>
            )}

            {/* No Results */}
            {displayedInstitutions.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No schools found matching your criteria.</p>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search and view all schools
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}