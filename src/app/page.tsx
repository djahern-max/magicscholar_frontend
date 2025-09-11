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
      {/* Enhanced Header with Magical Emoji Elements */}
      <header className="bg-white shadow-sm border-b relative overflow-hidden">
        {/* Magical background elements - floating emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating magical emojis */}
          <div className="absolute top-4 left-8 text-2xl animate-pulse opacity-20">
            ✨
          </div>
          <div className="absolute top-8 right-12 text-xl animate-bounce opacity-15">
            ⭐
          </div>
          <div className="absolute bottom-4 left-1/4 text-xl animate-pulse delay-300 opacity-20">
            🌟
          </div>
          <div className="absolute top-6 left-1/3 text-lg animate-bounce delay-500 opacity-15">
            ✨
          </div>
          <div className="absolute bottom-6 right-1/4 text-xl animate-pulse delay-700 opacity-20">
            ⭐
          </div>
          <div className="absolute top-10 right-1/3 text-lg animate-bounce delay-1000 opacity-15">
            💫
          </div>
          <div className="absolute bottom-8 left-1/6 text-xl animate-pulse delay-1200 opacity-20">
            🔮
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            {/* Enhanced Logo with Magic Emojis */}
            <div className="flex items-center space-x-3">
              <div
                className="text-3xl"
                style={{
                  textShadow: '0 0 3px #60a5fa, 0 0 6px #60a5fa',
                  filter: 'drop-shadow(0 0 2px #60a5fa)'
                }}
              >
                🪄 🎓
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                MagicScholar
              </h1>
            </div>

            {/* Enhanced Opportunities Counter */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-gray-700">
                {totalInstitutions > 0 ? `${totalInstitutions.toLocaleString()}+ Opportunities` : '...'}
              </span>
            </div>
          </div>

          <div className="text-center">
            {/* Enhanced Main Heading */}
            <div className="relative inline-block">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {isDisplayingSearchResults ? 'Search Results' : 'Find Your Perfect School'}
              </h2>
              {!isDisplayingSearchResults && (
                <div className="absolute -top-2 -right-8 text-2xl animate-spin opacity-80" style={{ animationDuration: '3s' }}>
                  🌟
                </div>
              )}
            </div>

            <p className="text-lg text-gray-600 mb-6">
              {isDisplayingSearchResults
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : 'Explore leading institutions and find your perfect match'
              }
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 bg-white shadow-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                      className="w-full pl-12 pr-4 py-4 border-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-500"
                    />
                    {/* Clear button when searching */}
                    {showSearchResults && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 font-medium"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🔍</span>
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Magical glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl blur-lg opacity-20 scale-105"></div>
              </div>
            </div>

            {/* Search results info */}
            {isDisplayingSearchResults && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={clearSearch}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <span className="text-lg">✨</span>
                  <span>← Back to Browse</span>
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
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse">
                ✨
              </div>
            </div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        ) : (
          <>
            {/* Search Results or No Results */}
            {isDisplayingSearchResults && currentInstitutions.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4 text-6xl opacity-50">
                  🪄
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  No universities found matching "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mx-auto"
                >
                  <span className="text-lg">✨</span>
                  <span>Browse All Universities</span>
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto font-medium shadow-lg"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">⚡</span>
                      Load More Universities
                    </>
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
                <div className="mb-4 text-4xl">
                  🎉
                </div>
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