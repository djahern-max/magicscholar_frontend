// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, MapPin, Users } from 'lucide-react';
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

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

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
  const handleSearch = async (query?: string, page: number = 1, useFilters: boolean = false) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() && !useFilters) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Build search URL with parameters
      const searchParams = new URLSearchParams();

      if (searchTerm.trim()) {
        searchParams.append('query', searchTerm);
      }

      searchParams.append('page', page.toString());
      searchParams.append('per_page', '12');

      // Add filters if they exist
      if (filters.state) searchParams.append('state', filters.state);
      if (filters.control_type) searchParams.append('control_type', filters.control_type);
      if (filters.size_category) searchParams.append('size_category', filters.size_category);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/institutions/search?${searchParams.toString()}`
      );

      if (response.ok) {
        const results = await response.json();

        if (page === 1) {
          setSearchResults(results.institutions || results);
          setSearchTotal(results.total || results.length);
          setSearchPage(1);
        } else {
          setSearchResults(prev => [...prev, ...(results.institutions || results)]);
        }

        setShowSearchResults(true);
        setHasMoreData((results.institutions || results).length === 12);
      } else {
        console.error('Search failed:', response.statusText);
        setSearchResults([]);
        setSearchTotal(0);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
      setSearchTotal(0);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Load more search results
  const loadMoreSearchResults = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    const nextPage = searchPage + 1;
    await handleSearch(searchQuery, nextPage, true);
    setSearchPage(nextPage);
    setLoadingMore(false);
  };

  // Load more institutions (for non-search view)
  const loadMoreUniversities = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=${currentOffset}`);

      if (response.ok) {
        const newData = await response.json();

        if (newData.length > 0) {
          setInstitutions(prev => [...prev, ...newData]);
          setCurrentOffset(prev => prev + newData.length);
          setHasMoreData(newData.length === 12);
        } else {
          setHasMoreData(false);
        }
      } else {
        console.error('Failed to fetch more institutions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching more institutions:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setSearchPage(1);
    handleSearch(searchQuery, 1, true);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      state: '',
      control_type: '',
      size_category: '',
      min_tuition: '',
      max_tuition: ''
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchTotal(0);
    setSearchPage(1);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  // Quick search suggestions
  const quickSearches = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'UC Berkeley',
    'Yale University',
    'Princeton University'
  ];

  // Get current institutions to display
  const currentInstitutions = showSearchResults ? searchResults : institutions;
  const currentTotal = showSearchResults ? searchTotal : totalInstitutions;
  const loadMoreFunction = showSearchResults ? loadMoreSearchResults : loadMoreUniversities;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect School
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Discover and compare {totalInstitutions.toLocaleString()}+ colleges and universities
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  placeholder="Search by school name, city, or state..."
                  className="block w-full pl-10 pr-12 py-4 border border-transparent rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                  {Object.values(filters).some(f => f) && (
                    <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Search Suggestions */}
              {!showSearchResults && searchQuery.length < 3 && (
                <div className="mt-4">
                  <p className="text-blue-100 text-sm mb-2">Quick searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickSearches.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearchInputChange(suggestion)}
                        className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white shadow-lg border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="PA">Pennsylvania</option>
                  {/* Add more states as needed */}
                </select>
              </div>

              {/* Institution Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.control_type}
                  onChange={(e) => setFilters({ ...filters, control_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="public">Public</option>
                  <option value="private_nonprofit">Private Non-Profit</option>
                  <option value="private_for_profit">Private For-Profit</option>
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={filters.size_category}
                  onChange={(e) => setFilters({ ...filters, size_category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  <option value="very_small">Very Small (&lt;1,000)</option>
                  <option value="small">Small (1,000-2,999)</option>
                  <option value="medium">Medium (3,000-9,999)</option>
                  <option value="large">Large (10,000-19,999)</option>
                  <option value="very_large">Very Large (20,000+)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Status */}
      {showSearchResults && (
        <div className="bg-blue-50 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-blue-800">
                  {isSearching ? (
                    'Searching...'
                  ) : (
                    `Found ${searchTotal.toLocaleString()} results${searchQuery ? ` for "${searchQuery}"` : ''}`
                  )}
                </p>
                {Object.values(filters).some(f => f) && (
                  <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Filters Applied
                  </span>
                )}
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentInstitutions.length === 0 && !isSearching ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No institutions found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find more results.
            </p>
            <button
              onClick={clearSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Show All Institutions
            </button>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentInstitutions.map((institution) => (
                <InstitutionCard key={institution.id} institution={institution} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreData && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreFunction}
                  disabled={loadingMore}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingMore ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    `Load More Institutions`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}