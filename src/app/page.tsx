// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both featured institutions and stats for total count
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
          // Fallback to default if stats endpoint fails
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

  // Load more institutions
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

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/institutions/search?q=${encodeURIComponent(searchQuery)}&limit=50`
      );

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        console.error('Search failed:', response.statusText);
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

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Get current institutions to display
  const currentInstitutions = showSearchResults ? searchResults : institutions;
  const isDisplayingSearchResults = showSearchResults;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">MagicScholar</h1>
            <div className="text-sm text-gray-600">
              {totalInstitutions > 0 ? `${totalInstitutions.toLocaleString()}+ Opportunities` : '...'}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isDisplayingSearchResults ? 'Search Results' : 'Find Your Perfect School'}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {isDisplayingSearchResults
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : 'Explore leading institutions and find your perfect match'
              }
            </p>

            {/* Search Bar - Narrow and Centered */}
            <div className="max-w-lg mx-auto">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for universities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border-none focus:ring-0 focus:outline-none"
                  />
                  {/* Clear button when searching */}
                  {showSearchResults && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Search results info */}
            {isDisplayingSearchResults && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Back to Browse
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        ) : (
          <>
            {/* Search Results or No Results */}
            {isDisplayingSearchResults && currentInstitutions.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  No universities found matching "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse All Universities
                </button>
              </div>
            )}

            {/* Universities Grid */}
            {currentInstitutions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentInstitutions.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} />
                ))}
              </div>
            )}

            {/* Load More Button - Only show for browse mode */}
            {!isDisplayingSearchResults && hasMoreData && (
              <div className="text-center">
                <button
                  onClick={loadMoreUniversities}
                  disabled={loadingMore}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Universities'
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Showing {institutions.length} universities
                </p>
              </div>
            )}

            {/* No More Data Message */}
            {!isDisplayingSearchResults && !hasMoreData && institutions.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  You've seen all {institutions.length} featured universities!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total universities in database: {totalInstitutions.toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}