'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, ExternalLink, Users, GraduationCap, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Available states for your curated schools
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

// Separate component that uses useSearchParams
function HomeWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // NEW: State filter
  const [selectedState, setSelectedState] = useState('ALL');

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentEndpoint, setCurrentEndpoint] = useState<'featured' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  // Return-to-card state
  const [returnedInstitutionId, setReturnedInstitutionId] = useState<string | null>(null);

  // Handle URL parameters on load (for returning from detail page)
  useEffect(() => {
    const page = searchParams.get('page');
    const query = searchParams.get('query');
    const state = searchParams.get('state');
    const institutionId = searchParams.get('returnTo');

    if (page) setCurrentPage(parseInt(page));
    if (query) {
      setSearchQuery(query);
    }
    if (state) {
      setSelectedState(state);
    }
    if (institutionId) {
      setReturnedInstitutionId(institutionId);
    }
  }, [searchParams]);

  // Scroll to specific institution card after data loads
  useEffect(() => {
    if (returnedInstitutionId && institutions.length > 0) {
      console.log(`Looking for institution-${returnedInstitutionId}`);

      const attemptScroll = () => {
        const element = document.getElementById(`institution-${returnedInstitutionId}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
          setReturnedInstitutionId(null);
          return true;
        }
        return false;
      };

      // Try multiple times with increasing delays
      const timer1 = setTimeout(() => {
        if (!attemptScroll()) {
          const timer2 = setTimeout(() => {
            if (!attemptScroll()) {
              const timer3 = setTimeout(attemptScroll, 1000);
            }
          }, 500);
        }
      }, 100);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [institutions, returnedInstitutionId]);

  // NEW: Combined search and filter function
  const searchAndFilter = async (query: string = searchQuery, stateFilter: string = selectedState) => {
    setIsSearching(true);

    try {
      let url = `${API_BASE_URL}/api/v1/institutions/?per_page=99`;

      // Add search query if provided
      if (query.trim()) {
        url = `${API_BASE_URL}/api/v1/institutions/search?query=${encodeURIComponent(query)}&per_page=99`;
      }

      // Add state filter if not 'ALL'
      if (stateFilter !== 'ALL') {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}state=${stateFilter}`;
      }

      console.log('Fetching from URL:', url);

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const institutionsArray = data.institutions || [];
        const totalCount = data.total || institutionsArray.length;

        if (query.trim() || stateFilter !== 'ALL') {
          // This is a search/filter result
          setSearchResults(institutionsArray);
          setShowSearchResults(true);
        } else {
          // This is the main list
          setInstitutions(institutionsArray);
          setTotalInstitutions(totalCount);
          setShowSearchResults(false);
        }
      } else {
        console.error('Search/filter failed:', response.status);
        if (query.trim() || stateFilter !== 'ALL') {
          setSearchResults([]);
          setShowSearchResults(true);
        }
      }
    } catch (error) {
      console.error('Search/filter error:', error);
      if (query.trim() || stateFilter !== 'ALL') {
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debug function to test API endpoints
  const debugAPI = async () => {
    console.log('=== DEBUG API ENDPOINTS ===');
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      console.log('Health check:', healthResponse.ok ? 'OK' : 'Failed');

      const featuredResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=5`);
      const featuredData = await featuredResponse.json();
      console.log('Featured institutions:', featuredData);

      const listResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=5`);
      const listData = await listResponse.json();
      console.log('List institutions:', listData);
    } catch (error) {
      console.error('API Debug Error:', error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we have URL params, use them for initial search/filter
        const query = searchParams.get('query') || '';
        const state = searchParams.get('state') || 'ALL';

        if (query || state !== 'ALL') {
          await searchAndFilter(query, state);
        } else {
          // Default: load all institutions
          const listResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=99`);

          if (!listResponse.ok) {
            throw new Error(`HTTP error! status: ${listResponse.status}`);
          }

          const listData = await listResponse.json();
          const institutionsArray = listData.institutions || [];
          const totalCount = listData.total || 0;

          setInstitutions(institutionsArray);
          setTotalInstitutions(totalCount);
          setHasMoreData(institutionsArray.length < totalCount);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load institutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    debugAPI();
  }, []);

  // Handle search input changes
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      searchAndFilter(query, selectedState);
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, selectedState]);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else if (selectedState === 'ALL') {
      setShowSearchResults(false);
      // Reload all institutions
      searchAndFilter('', 'ALL');
    } else {
      // Keep state filter active
      searchAndFilter('', selectedState);
    }
  };

  // NEW: Handle state filter clicks
  const handleStateClick = (stateCode: string) => {
    const state = AVAILABLE_STATES.find(s => s.code === stateCode);
    if (state?.disabled) return;

    setSelectedState(stateCode);
    searchAndFilter(searchQuery, stateCode);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setShowSearchResults(false);
    searchAndFilter('', 'ALL');
  };

  // Handle institution card click with return parameters
  const handleInstitutionClick = (institutionId: number) => {
    const params = new URLSearchParams();

    if (currentPage > 1) {
      params.append('page', currentPage.toString());
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    if (selectedState !== 'ALL') {
      params.append('state', selectedState);
    }
    params.append('returnTo', institutionId.toString());

    const url = `/institution/${institutionId}?${params.toString()}`;
    router.push(url);
  };

  // Show all institutions handler
  const showAllInstitutions = async () => {
    setLoading(true);
    setSelectedState('ALL');
    setSearchQuery('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=99`);
      if (response.ok) {
        const data = await response.json();
        const institutionsArray = data.institutions || [];
        const totalCount = data.total || 0;

        setInstitutions(institutionsArray);
        setTotalInstitutions(totalCount);
        setHasMoreData(institutionsArray.length < totalCount);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('Error loading all institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more institutions function
  const loadMoreInstitutions = async () => {
    setLoadingMore(true);
    try {
      const remainingInstitutions = totalInstitutions - institutions.length;
      console.log(`Missing ${remainingInstitutions} institutions of ${totalInstitutions} total`);

      const nextPage = Math.ceil((institutions.length + 1) / 48);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/institutions/?per_page=48&page=${nextPage}`
      );

      if (response.ok) {
        const data = await response.json();
        const newInstitutions = data.institutions || [];

        if (Array.isArray(newInstitutions) && newInstitutions.length > 0) {
          const existingIds = new Set(institutions.map(inst => inst.id));
          const uniqueNewInstitutions = newInstitutions.filter(inst => !existingIds.has(inst.id));

          const updatedInstitutions = [...institutions, ...uniqueNewInstitutions];
          setInstitutions(updatedInstitutions);
          setHasMoreData(updatedInstitutions.length < totalInstitutions);
          setCurrentPage(prev => prev + 1);
        } else {
          setHasMoreData(false);
        }
      } else {
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
              <span className="text-blue-600">magic</span>Scholar
            </h1>
            <p className="text-xl text-gray-600">Find Your Perfect School</p>
            <p className="text-gray-500 mt-2">
              Discover and compare {totalInstitutions.toLocaleString() || '24+'} top universities with detailed cost information
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
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
              {(searchQuery || selectedState !== 'ALL') && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
                </button>
              )}
            </div>
          </div>

          {/* NEW: State Filter Buttons */}
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
              `Showing ${searchResults.length} results${searchQuery ? ` for "${searchQuery}"` : ''}${selectedState !== 'ALL' ? ` in ${AVAILABLE_STATES.find(s => s.code === selectedState)?.name}` : ''}`
            ) : (
              `Showing ${institutions.length} of ${totalInstitutions.toLocaleString()} premium universities`
            )}
          </p>

          {(showSearchResults || selectedState !== 'ALL') && (
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Show All Schools
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
                ? "Try adjusting your search terms or selecting a different state."
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
            </div>
          </div>
        ) : (
          <>
            {/* Institution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  id={`institution-${institution.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleInstitutionClick(institution.id)}
                >
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

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                        View Costs & Details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button - Only for non-filtered results */}
            {!showSearchResults && hasMoreData && selectedState === 'ALL' && (
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <HomeWithSearchParams />
    </Suspense>
  );
}