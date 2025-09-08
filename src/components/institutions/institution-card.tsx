'use client';

import React, { useState } from 'react';
import { MapPin, Users, Globe, Heart, Share2, ExternalLink, Eye } from 'lucide-react';

interface Institution {
  id: number;
  ipeds_id: number;
  name: string;
  city: string;
  state: string;
  website?: string;
  control_type: string;
  size_category?: string;
  primary_image_url?: string;
  primary_image_quality_score?: number;
}

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getSizeLabel = (size?: string) => {
    const sizeMap = {
      'VERY_SMALL': 'Under 1,000',
      'SMALL': '1,000-2,999',
      'MEDIUM': '3,000-9,999',
      'LARGE': '10,000-19,999',
      'VERY_LARGE': '20,000+'
    };
    return size ? sizeMap[size as keyof typeof sizeMap] || size : '';
  };

  const getControlTypeLabel = (type: string) => {
    const typeMap = {
      'PUBLIC': 'Public',
      'PRIVATE_NONPROFIT': 'Private',
      'PRIVATE_FOR_PROFIT': 'For-Profit'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {institution.primary_image_url ? (
          <>
            <img
              src={institution.primary_image_url}
              alt={institution.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🏫</div>
              <div className="text-gray-600 text-sm">{institution.name}</div>
            </div>
          </div>
        )}

        {/* Quality Score Badge */}
        {institution.primary_image_quality_score && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {institution.primary_image_quality_score}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
          <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Institution Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {getControlTypeLabel(institution.control_type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {institution.name}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span className="text-sm">{institution.city}, {institution.state}</span>
        </div>

        {institution.size_category && (
          <div className="flex items-center text-gray-600 mb-4">
            <Users size={16} className="mr-2 text-gray-400" />
            <span className="text-sm">{getSizeLabel(institution.size_category)} students</span>
          </div>
        )}

        {institution.website && (
          
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors group/link"
          >
            <Globe size={16} className="mr-2" />
            <span className="group-hover/link:underline">Visit Website</span>
            <ExternalLink size={14} className="ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>IPEDS ID: {institution.ipeds_id}</span>
          {institution.primary_image_quality_score && (
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              <span>High Quality</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
