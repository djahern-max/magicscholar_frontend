'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, ExternalLink, Star } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
  id: number;
  name: string;
  city: string;
  state: string;
  website?: string;
  control_type: string;
  size_category: string;
  display_image_url?: string;
  primary_image_url?: string;
  primary_image_quality_score?: number;
  has_high_quality_image: boolean;
  display_name: string;
  full_address: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // ADD THIS
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(12); // ADD THIS
  const [hasMoreData, setHasMoreData] = useState(true); // ADD THIS


  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        // Fetch both featured institutions and total count
        const [institutionsResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=12&offset=0`),
          fetch(`${API_BASE_URL}/api/v1/admin/enhanced_images/processing-stats`)
        ]);

        if (institutionsResponse.ok) {
          const institutionsData = await institutionsResponse.json();
          setInstitutions(institutionsData);
          setHasMoreData(institutionsData.length === 12);
        } else {
          console.error('Failed to fetch institutions:', institutionsResponse.statusText);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setTotalInstitutions(statsData.total_institutions); // This should be 6,132
        } else {
          console.error('Failed to fetch stats:', statsResponse.statusText);
          // Fallback to a default number if stats endpoint fails
          setTotalInstitutions(6132);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to a default number if there's an error
        setTotalInstitutions(6132);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  // ADD THIS FUNCTION
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">MagicScholar</h1>
            <div className="text-sm text-gray-600">
              {totalInstitutions.toLocaleString()}+ Opportunities
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect School
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Explore leading institutions and find your perfect match
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Universities Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : institutions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No universities found. Check your API connection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution) => (
              <div
                key={institution.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              >
                {/* University Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {institution.display_image_url || institution.primary_image_url ? (
                    <img
                      src={institution.display_image_url || institution.primary_image_url}
                      alt={institution.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  {/* Fallback when no image */}
                  <div className={`w-full h-full flex items-center justify-center text-white ${(institution.display_image_url || institution.primary_image_url) ? 'hidden' : ''
                    }`}>
                    <div className="text-center">
                      <Users size={48} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">{institution.name}</p>
                    </div>
                  </div>

                  {/* Quality Badge */}
                  {institution.has_high_quality_image && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Star size={12} className="mr-1" />
                      Featured
                    </div>
                  )}

                  {/* Control Type Badge */}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                    {getControlTypeDisplay(institution.control_type)}
                  </div>
                </div>

                {/* University Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {institution.name}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin size={14} className="mr-1" />
                    {institution.city}, {institution.state}
                  </div>

                  <div className="text-gray-600 text-xs mb-3">
                    {getSizeCategoryDisplay(institution.size_category)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                      Learn More
                    </button>
                    {institution.website && (
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - UPDATED WITH CLICK HANDLER */}
        {!loading && institutions.length > 0 && hasMoreData && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreUniversities}
              disabled={loadingMore}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

        {/* Show when no more data */}
        {!loading && institutions.length > 0 && !hasMoreData && (
          <div className="text-center mt-12">
            <p className="text-gray-600">You've seen all available universities!</p>
          </div>
        )}
      </main>
    </div>
  );
}