'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, ExternalLink, Users, GraduationCap, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Available states for filtering - removed Rhode Island to fit on one line
const AVAILABLE_STATES = [
  { code: 'NH', name: 'New Hampshire', available: true },
  { code: 'MA', name: 'Massachusetts', available: true },
  { code: 'CT', name: 'Connecticut', available: false, comingSoon: true },
  { code: 'VT', name: 'Vermont', available: false, comingSoon: true },
  { code: 'ME', name: 'Maine', available: false, comingSoon: true }
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
  const [totalInstitutions, setTotalInstitutions] = useState(24); // Start with expected curated count

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<Institution[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Return-to-card state
  const [returnedInstitutionId, setReturnedInstitutionId] = useState<string | null>(null);

  // Handle URL parameters on load
  useEffect(() => {
    const page = searchParams.get('page');
    const query = searchParams.get('query');
    const state = searchParams.get('state');
    const institutionId = searchParams.get('returnTo');

    if (page) setCurrentPage(parseInt(page));
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
    if (state && state !== 'all') {
      setSelectedState(state);
    }
    if (institutionId) {
      setReturnedInstitutionId(institutionId);
    }
  }, [searchParams]);

  // Scroll to specific institution card after data loads
  useEffect(() => {
    if (returnedInstitutionId && institutions.length > 0) {
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

      const timer = setTimeout(attemptScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [institutions, returnedInstitutionId]);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      params.append('query', query.trim());
      if (selectedState !== 'all') params.append('state', selectedState);
      params.append('per_page', '50');

      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/search?${params.toString()}`);

      if (response.ok) {
        const results = await response.json();
        const institutionsArray = results.institutions || results;
        setSearchResults(Array.isArray(institutionsArray) ? institutionsArray : []);
        setShowSearchResults(true);
      } else {
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

  // Combined search and filter function
  const searchAndFilter = async (query: string = searchQuery, state: string = selectedState) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('query', query.trim());
      if (state !== 'all') params.append('state', state);
      params.append('per_page', '50');

      const endpoint = query.trim() ? 'search' : '';
      const response = await fetch(`${API_BASE_URL}/api/v1/institutions/${endpoint}?${params.toString()}`);

      if (response.ok) {
        const results = await response.json();
        const institutionsArray = results.institutions || results;
        setSearchResults(Array.isArray(institutionsArray) ? institutionsArray : []);
        setShowSearchResults(query.trim() !== '' || state !== 'all');
      } else {
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching/filtering:', error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle state filter selection
  const handleStateFilter = (stateCode: string) => {
    setSelectedState(stateCode);
    searchAndFilter(searchQuery, stateCode);

    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (stateCode !== 'all') params.append('state', stateCode);

    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newUrl);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/institutions/?per_page=50`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const institutionsArray = data.institutions || [];
        const totalCount = data.total || institutionsArray.length;

        setInstitutions(institutionsArray);
        setTotalInstitutions(totalCount);
        setHasMoreData(institutionsArray.length < totalCount);
        setError(null);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load institutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => searchAndFilter(query, selectedState), 300);
    setSearchTimeout(timeout);
  }, [searchTimeout, selectedState]);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      searchAndFilter('', selectedState);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedState('all');
    setShowSearchResults(false);
    setSearchResults([]);
    router.replace('/');
  };

  // Handle institution card click
  const handleInstitutionClick = (institutionId: number) => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.append('page', currentPage.toString());
    if (searchQuery) params.append('query', searchQuery);
    if (selectedState !== 'all') params.append('state', selectedState);
    params.append('returnTo', institutionId.toString());

    router.push(`/institution/${institutionId}?${params.toString()}`);
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
  const totalDisplayed = displayInstitutions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Removed MagicScholar logo to conserve space */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <p className="text-xl text-gray-600 mb-1">Find Your Perfect School</p>
            <p className="text-gray-500">
              Discover and compare {totalInstitutions} top universities with detailed cost information
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
              {(searchQuery || selectedState !== 'all') && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
                </button>
              )}
            </div>
          </div>

          {/* State Filter Buttons - Single row, removed Rhode Island */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleStateFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedState === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              All States
            </button>
            {AVAILABLE_STATES.map((state) => (
              <button
                key={state.code}
                onClick={() => state.available && handleStateFilter(state.code)}
                disabled={!state.available}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedState === state.code
                    ? 'bg-blue-600 text-white'
                    : state.available
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
              >
                {state.name}
                {state.comingSoon && (
                  <span className="ml-1 text-xs">(Coming Soon)</span>
                )}
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

      {/* Results Summary */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {isSearching ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </span>
            ) : showSearchResults ? (
              `Found ${totalDisplayed} ${totalDisplayed === 1 ? 'school' : 'schools'}${searchQuery ? ` for "${searchQuery}"` : ''
              }${selectedState !== 'all' ? ` in ${AVAILABLE_STATES.find(s => s.code === selectedState)?.name}` : ''}`
            ) : (
              `Showing ${totalDisplayed} premium universities`
            )}
          </p>

          {(showSearchResults && (searchQuery || selectedState !== 'all')) && (
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-6">
              {showSearchResults
                ? "Try adjusting your search terms or select a different state."
                : "We couldn't load the school data."
              }
            </p>
            <button
              onClick={clearSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Show All Schools
            </button>
          </div>
        ) : (
          <>
            {/* Institution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  id={`institution-${institution.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleInstitutionClick(institution.id)}
                >
                  {/* Institution Image */}
                  <div className="h-48 bg-gray-200 relative rounded-t-lg overflow-hidden">
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
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {institution.display_name || institution.name}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">{institution.city}, {institution.state}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{getSizeCategoryDisplay(institution.size_category)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{getControlTypeDisplay(institution.control_type)}</span>
                      </div>
                    </div>

                    {/* Subtle call-to-action text instead of overpowering button */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View costs & details →
                      </span>
                      {institution.website && (
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeWithSearchParams />
    </Suspense>
  );
}