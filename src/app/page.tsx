'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, ExternalLink, Users, GraduationCap, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
  id: number;
  name: string;
  city: string;
  state: string;
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
  website?: string;
}

export default function Home() {
  // Core state
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalInstitutions, setTotalInstitutions] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Institution[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentEndpoint, setCurrentEndpoint] = useState<'featured' | 'list'>('featured'); // Track which endpoint we're using

  // Debug function to test API endpoints
  const debugAPI = async () => {
    console.log('=== DEBUG API ENDPOINTS ===');

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      console.log('Health check:', healthResponse.ok ? 'OK' : 'Failed');

      // Test featured endpoint
      const featuredResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=5`);
      const featuredData = await featuredResponse.json();
      console.log('Featured institutions:', featuredData);

      // Test list endpoint
      const listResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=5`);
      const listData = await listResponse.json();
      console.log('List institutions:', listData);

    } catch (error) {
      console.error('API Debug Error:', error);
    }
  };

  // Fetch initial data with better error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching initial data...');

        let institutionsData = [];
        let endpointUsed: 'featured' | 'list' = 'list';

        // Try featured endpoint first, but fall back to list endpoint
        try {
          const featuredResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=99`);
          if (featuredResponse.ok) {
            institutionsData = await featuredResponse.json();
            console.log('Featured data loaded:', institutionsData.length);

            // Only use featured if it actually returns data and supports pagination
            if (institutionsData.length > 0) {
              // Check if featured endpoint supports offset for pagination
              const testPaginationResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=1&offset=1`);
              if (testPaginationResponse.ok) {
                endpointUsed = 'featured';
                console.log('Using featured endpoint with pagination support');
              } else {
                console.log('Featured endpoint does not support pagination, switching to list endpoint');
                throw new Error('Featured endpoint does not support pagination');
              }
            }
          }
        } catch (e) {
          console.log('Featured endpoint failed or does not support pagination, using list endpoint...');
        }

        // Use list endpoint if featured failed or doesn't support pagination
        if (institutionsData.length === 0 || endpointUsed === 'list') {
          try {
            const listResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=99`);
            if (listResponse.ok) {
              const listData = await listResponse.json();
              institutionsData = listData.institutions || listData;
              endpointUsed = 'list';
              console.log('List data loaded:', institutionsData.length);
            }
          } catch (e) {
            console.log('List endpoint also failed');
          }
        }

        if (institutionsData.length > 0) {
          setInstitutions(institutionsData);
          setCurrentEndpoint(endpointUsed);
          setHasMoreData(institutionsData.length === 99); // Assume more data if we got exactly 99
          setError(null);
        } else {
          setError('No institutions found. Check if the database has data.');
        }

        // Try to get total count
        try {
          const statsResponse = await fetch(`${API_BASE_URL}/api/v1/admin/images/stats`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setTotalInstitutions(statsData.total_institutions || 0);
          }
        } catch (e) {
          console.log('Stats endpoint failed');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load institutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    debugAPI(); // Run debug on load
  }, []);

  // Search functionality with better error handling
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', query);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(query)}&per_page=20`
      );

      if (response.ok) {
        const results = await response.json();
        console.log('Search results:', results);

        const institutionsArray = results.institutions || results;
        setSearchResults(Array.isArray(institutionsArray) ? institutionsArray : []);
        setShowSearchResults(true);
      } else {
        console.error('Search failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Show "all institutions" button handler
  const showAllInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=99`);
      if (response.ok) {
        const data = await response.json();
        const institutionsArray = data.institutions || data;
        setInstitutions(Array.isArray(institutionsArray) ? institutionsArray : []);
        setCurrentEndpoint('list'); // Make sure we track the endpoint
        setHasMoreData(institutionsArray.length === 99);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('Error loading all institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed load more institutions function
  const loadMoreInstitutions = async () => {
    setLoadingMore(true);
    try {
      const offset = institutions.length;
      console.log(`Loading more institutions. Current count: ${offset}, Using endpoint: ${currentEndpoint}`);

      // Use the same endpoint that was used initially
      let response;
      if (currentEndpoint === 'featured') {
        response = await fetch(
          `${API_BASE_URL}/api/v1/institutions/featured?limit=48&offset=${offset}`
        );
      } else {
        response = await fetch(
          `${API_BASE_URL}/api/v1/institutions/?per_page=48&offset=${offset}`
        );
      }

      if (response.ok) {
        const data = await response.json();
        const newInstitutions = data.institutions || data;

        if (Array.isArray(newInstitutions) && newInstitutions.length > 0) {
          console.log(`Loaded ${newInstitutions.length} more institutions`);
          setInstitutions(prev => [...prev, ...newInstitutions]);
          setHasMoreData(newInstitutions.length === 48);
        } else {
          console.log('No more institutions found');
          setHasMoreData(false);
        }
      } else {
        console.error('Failed to load more institutions:', response.status, response.statusText);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error loading more institutions:', error);
      setHasMoreData(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const getControlTypeDisplay = (controlType: string) => {
    const types = {
      'public': 'Public',
      'private': 'Private',
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

  if (loading && institutions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading institutions...</p>
        </div>
      </div>
    );
  }

  const displayInstitutions = showSearchResults ? searchResults : institutions;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🪄 <span className="text-blue-600">magic</span>Scholar
            </h1>
            <p className="text-xl text-gray-600">Find Your Perfect School</p>
            <p className="text-gray-500 mt-2">
              Discover and compare {totalInstitutions.toLocaleString() || '6,000+'} colleges and universities
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Search by school name, city, or state..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Search Status */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {isSearching ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </span>
            ) : showSearchResults ? (
              `Showing ${searchResults.length} results for "${searchQuery}"`
            ) : (
              `Showing ${institutions.length} ${currentEndpoint === 'featured' ? 'featured' : ''} institutions`
            )}
          </p>

          {showSearchResults && (
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {displayInstitutions.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No institutions found</h3>
            <p className="text-gray-600 mb-6">
              {showSearchResults
                ? "Try adjusting your search terms or filters to find more results."
                : "We couldn't load any institutions. This might be a database issue."
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={showAllInstitutions}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Show All Institutions
              </button>
              <button
                onClick={debugAPI}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Debug API
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Institution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInstitutions.map((institution) => (
                <div key={institution.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Institution Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {institution.display_image_url || institution.primary_image_url ? (
                      <img
                        src={institution.display_image_url || institution.primary_image_url}
                        alt={institution.display_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Institution Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {institution.display_name || institution.name}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{institution.city}, {institution.state}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{getSizeCategoryDisplay(institution.size_category)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>{getControlTypeDisplay(institution.control_type)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <a
                        href={`/institution/${institution.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </a>
                      {institution.website && (
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button - Only show for non-search results */}
            {!showSearchResults && hasMoreData && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreInstitutions}
                  disabled={loadingMore}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading More...
                    </span>
                  ) : (
                    'Load More Institutions'
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Currently showing {institutions.length} institutions
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}