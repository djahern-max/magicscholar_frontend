// src/app/page.tsx

'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ExternalLink, Users, GraduationCap, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Available states for filtering with state symbols
const AVAILABLE_STATES = [
  { code: 'NH', name: 'NH', fullName: 'New Hampshire', available: true, icon: '🏔️' },
  { code: 'MA', name: 'MA', fullName: 'Massachusetts', available: true, icon: '🎓' },
  { code: 'CT', name: 'CT', fullName: 'Connecticut', available: false, comingSoon: true, icon: '🌳' },
  { code: 'VT', name: 'VT', fullName: 'Vermont', available: false, comingSoon: true, icon: '🍁' },
  { code: 'ME', name: 'ME', fullName: 'Maine', available: false, comingSoon: true, icon: '🦞' }
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

function HomeWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalInstitutions, setTotalInstitutions] = useState(24);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<Institution[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [returnedInstitutionId, setReturnedInstitutionId] = useState<string | null>(null);

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

  const handleStateFilter = (stateCode: string) => {
    setSelectedState(stateCode);
    searchAndFilter(searchQuery, stateCode);

    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (stateCode !== 'all') params.append('state', stateCode);

    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newUrl);
  };

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
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  const displayInstitutions = showSearchResults ? searchResults : institutions;
  const totalDisplayed = displayInstitutions.length;

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Header */}
      <div className="bg-page-bg border-b-2 border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">
              <span >Discover</span>{' '}
              <span >Schools</span>
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
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Search for schools"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 shadow-sm transition-colors"
              />
              {(searchQuery || selectedState !== 'all') && (
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
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => handleStateFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-2 rounded-full whitespace-nowrap ${selectedState === 'all'
                  ? 'bg-gray-400 text-white border-gray-400'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <span className="mr-2">🌟</span>
                All
              </button>
              {AVAILABLE_STATES.map((state) => (
                <button
                  key={state.code}
                  onClick={() => state.available && handleStateFilter(state.code)}
                  disabled={!state.available}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-2 rounded-full whitespace-nowrap ${selectedState === state.code
                    ? 'bg-gray-400 text-white border-gray-400'
                    : state.available
                      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
        {displayInstitutions.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-6">
              {showSearchResults
                ? "Try adjusting your search terms or selecting a different state."
                : "We couldn't load the school data."}
            </p>
            <button
              onClick={clearSearch}
              className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              Show All Schools
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              {isSearching ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </span>
              ) : (
                <span>
                  {totalDisplayed} {totalDisplayed === 1 ? 'school' : 'schools'}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {selectedState !== 'all' && ` in ${AVAILABLE_STATES.find(s => s.code === selectedState)?.fullName}`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  id={`institution-${institution.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-200 cursor-pointer"
                  onClick={() => handleInstitutionClick(institution.id)}
                >
                  {/* Institution Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {institution.display_image_url || institution.primary_image_url ? (
                      <img
                        src={institution.display_image_url || institution.primary_image_url}
                        alt={institution.display_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Institution Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {institution.display_name || institution.name}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{institution.city}, {institution.state}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="text-xs">{getSizeCategoryDisplay(institution.size_category)}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="text-xs">{getControlTypeDisplay(institution.control_type)}</span>
                      </div>
                    </div>

                    {/* Footer with stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-900">
                        View details
                      </span>
                      {institution.website && (
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
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