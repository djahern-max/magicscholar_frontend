'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, GraduationCap, Users, Star, ArrowRight } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
  id: number;
  name: string;
  city: string;
  state: string;
  display_image_url?: string;
  has_high_quality_image: boolean;
}

interface Scholarship {
  id: number;
  title: string;
  organization: string;
  amount_exact?: number;
  amount_min?: number;
  amount_max?: number;
  deadline?: string;
  description: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredInstitutions, setFeaturedInstitutions] = useState<Institution[]>([]);
  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured institutions
        const institutionsRes = await fetch(`${API_BASE_URL}/api/v1/institutions/featured?limit=6`);
        if (institutionsRes.ok) {
          const institutions = await institutionsRes.json();
          setFeaturedInstitutions(institutions);
        }

        // Fetch recent scholarships
        const scholarshipsRes = await fetch(`${API_BASE_URL}/api/v1/scholarships/?limit=6&active_only=true`);
        if (scholarshipsRes.ok) {
          const data = await scholarshipsRes.json();
          setFeaturedScholarships(data.scholarships || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAmount = (scholarship: Scholarship) => {
    if (scholarship.amount_exact) {
      return `$${scholarship.amount_exact.toLocaleString()}`;
    } else if (scholarship.amount_min && scholarship.amount_max) {
      return `$${scholarship.amount_min.toLocaleString()} - $${scholarship.amount_max.toLocaleString()}`;
    } else if (scholarship.amount_min) {
      return `$${scholarship.amount_min.toLocaleString()}+`;
    }
    return 'Amount varies';
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    return new Date(deadline).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Scholarship Match
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of scholarships and explore top universities. Your educational journey starts here.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search scholarships, universities, or majors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 shadow-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                />
                <button className="absolute right-2 top-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-blue-200">Scholarships Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">6,000+</div>
                <div className="text-blue-200">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$2.5B+</div>
                <div className="text-blue-200">In Funding</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Scholarships
            </h2>
            <p className="text-gray-600 text-lg">
              Don't miss these amazing opportunities with upcoming deadlines
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <DollarSign className="text-blue-600" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {formatAmount(scholarship)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {scholarship.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3">
                    {scholarship.organization}
                  </p>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {scholarship.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={16} className="mr-1" />
                      {formatDeadline(scholarship.deadline)}
                    </div>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                      Apply <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200">
              View All Scholarships
            </button>
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Universities
            </h2>
            <p className="text-gray-600 text-lg">
              Explore leading institutions and find your perfect match
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInstitutions.map((institution) => (
                <div key={institution.id} className="bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    {institution.display_image_url ? (
                      <img
                        src={institution.display_image_url}
                        alt={institution.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="text-white" size={48} />
                      </div>
                    )}
                    {institution.has_high_quality_image && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star size={12} className="mr-1" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {institution.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={16} className="mr-1" />
                      {institution.city}, {institution.state}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200">
              Explore All Universities
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have found their perfect scholarships and universities through MagicScholar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200">
              Sign Up Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}