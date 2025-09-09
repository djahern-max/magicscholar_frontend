'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, ExternalLink, Star, Crown } from 'lucide-react';

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
  // Computed fields from backend
  display_name: string;
  display_image_url?: string;
  full_address: string;
  has_high_quality_image: boolean;
  is_premium_customer: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Fetch total institutions count
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/institutions/total`);
        if (response.ok) {
          const data = await response.json();
          setTotalInstitutions(data.total);
        }
      } catch (error) {
        console.error('Error fetching total institutions:', error);
      }
    };

    fetchTotal();
  }, []);

  // Fetch initial institutions (also uses customer ranking strategy)
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        // This endpoint automatically orders by customer_rank FIRST, then primary_image_quality_score
        // Premium advertising customers will always appear at the top
        const response = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=0`);
        if (response.ok) {
          const data = await response.json();
          setInstitutions(data);
          setCurrentOffset(12);
          setHasMoreData(data.length === 12);

          // Log the initial customer ranking for debugging (development only)
          if (process.env.NODE_ENV === 'development') {
            console.log('Initial institutions loaded with customer ranking:',
              data.map((inst: Institution) => ({
                name: inst.name,
                customer_rank: inst.customer_rank,
                image_quality: inst.primary_image_quality_score
              }))
            );
          }
        } else {
          console.error('Failed to fetch institutions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const loadMoreUniversities = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    try {
      // This endpoint now automatically orders by customer_rank FIRST, then primary_image_quality_score
      // This ensures premium advertising customers always appear before non-paying customers
      const response = await fetch(
        `${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=${currentOffset}`
      );

      if (response.ok) {
        const newData = await response.json();

        if (newData.length > 0) {
          // The new data is already sorted by customer priority from the backend
          setInstitutions(prev => [...prev, ...newData]);
          setCurrentOffset(prev => prev + newData.length);
          setHasMoreData(newData.length === 12);

          // Log the customer ranking for debugging (development only)
          if (process.env.NODE_ENV === 'development') {
            console.log('Loaded institutions with customer ranking:',
              newData.map((inst: Institution) => ({
                name: inst.name,
                customer_rank: inst.customer_rank,
                image_quality: inst.primary_image_quality_score
              }))
            );
          }
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

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
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

  const getCustomerTier = (customerRank?: number) => {
    if (!customerRank || customerRank === 0) return null;
    if (customerRank >= 90) return { label: 'Premium Partner', color: 'bg-purple-100 text-purple-800', icon: Crown };
    if (customerRank >= 80) return { label: 'Featured Partner', color: 'bg-blue-100 text-blue-800', icon: Star };
    if (customerRank >= 60) return { label: 'Partner', color: 'bg-green-100 text-green-800', icon: null };
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">MagicScholar</h1>
            <div className="text-sm text-gray-600">
              {totalInstitutions > 0 ? totalInstitutions.toLocaleString() : '...'} Universities
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Universities
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Explore leading institutions and find your perfect match
            </p>

            {/* Search Bar */}
            <div className="flex max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
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
            {/* Universities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {institutions.map((institution) => {
                const customerTier = getCustomerTier(institution.customer_rank);
                const TierIcon = customerTier?.icon;

                return (
                  <div
                    key={institution.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group ${institution.is_premium_customer ? 'ring-2 ring-purple-200' : ''
                      }`}
                  >
                    {/* Institution Image */}
                    <div className="relative h-48 bg-gray-200">
                      {institution.display_image_url || institution.primary_image_url ? (
                        <>
                          <img
                            src={institution.display_image_url || institution.primary_image_url}
                            alt={institution.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Customer Tier Badge */}
                          {customerTier && (
                            <div className="absolute top-3 left-3">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${customerTier.color}`}>
                                {TierIcon && <TierIcon className="w-3 h-3" />}
                                {customerTier.label}
                              </span>
                            </div>
                          )}

                          {/* Control Type Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${institution.control_type === 'public'
                              ? 'bg-blue-100 text-blue-800'
                              : institution.control_type === 'private_nonprofit'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {getControlTypeDisplay(institution.control_type)}
                            </span>
                          </div>

                          {/* Featured Badge (for high quality images without customer tier) */}
                          {institution.has_high_quality_image && !customerTier && (
                            <div className="absolute bottom-3 right-3">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1">
                                ⭐ Featured
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <span className="text-2xl text-gray-500">🏫</span>
                            </div>
                            <p className="text-sm text-gray-500">No image available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Institution Details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {institution.display_name || institution.name}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{institution.city}, {institution.state}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{getSizeCategoryDisplay(institution.size_category)}</span>
                        </div>
                      </div>

                      {/* Customer Rank Debug Info (only show in development) */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-2 text-xs text-gray-500">
                          Customer Rank: {institution.customer_rank || 'N/A'} | Quality: {institution.primary_image_quality_score || 'N/A'}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                          Learn More
                        </button>
                        {institution.website && (
                          <a
                            href={institution.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMoreData && (
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
                  Showing {institutions.length} of {totalInstitutions.toLocaleString()} universities
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Results ordered by customer priority, then image quality
                </p>
              </div>
            )}

            {/* No More Data Message */}
            {!hasMoreData && institutions.length > 0 && (
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