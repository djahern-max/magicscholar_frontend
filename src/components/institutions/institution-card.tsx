// src/components/institutions/institution-card.tsx
import React from 'react';
import Link from 'next/link';
import { MapPin, Users, ExternalLink } from 'lucide-react';

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

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Institution Image */}
      <div className="relative h-48 bg-gray-200">
        {institution.display_image_url || institution.primary_image_url ? (
          <img
            src={institution.display_image_url || institution.primary_image_url}
            alt={institution.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-sm">No Image</span>
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
            <span>
              {isNaN(Number(institution.size_category))
                ? getSizeCategoryDisplay(institution.size_category)
                : Math.round(Number(institution.size_category)).toLocaleString()}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            {getControlTypeDisplay(institution.control_type)}
          </div>
        </div>

        {/* Customer Rank Debug Info (only show in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-gray-500">
            Customer Rank: {institution.customer_rank || 'N/A'} | Quality: {institution.primary_image_quality_score || 'N/A'}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/institution/${institution.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Learn More
          </Link>
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
}