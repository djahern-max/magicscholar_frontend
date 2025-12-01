// src/components/institutions/institution-card.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Globe, DollarSign, Users } from 'lucide-react';

interface Institution {
  id: number;
  ipeds_id: number;
  name: string;
  city: string;
  state: string;
  control_type: string;
  website?: string;
  primary_image_url?: string;
  is_featured: boolean;
  tuition_in_state?: number;
  tuition_out_of_state?: number;
  room_and_board?: number;
  acceptance_rate?: number;
  data_completeness_score: number;
}

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  // State to track image load error
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (rate?: number) => {
    if (!rate) return null;
    return `${Math.round(rate)}%`;
  };

  // Get control type label
  const getControlTypeLabel = (controlType: string) => {
    switch (controlType) {
      case 'PUBLIC':
        return 'Public';
      case 'PRIVATE_NONPROFIT':
        return 'Private';
      case 'PRIVATE_FOR_PROFIT':
        return 'For-Profit';
      default:
        return controlType;
    }
  };

  // Handle image error - ONLY set state, don't try to load another image
  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if we should show the image
  // Ignore the old default path that doesn't exist
  const hasValidImage = institution.primary_image_url &&
    !imageError &&
    institution.primary_image_url !== '/images/default-institution.jpg';

  return (
    <Link href={`/schools/${institution.ipeds_id}`}>
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-gray-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
          {hasValidImage ? (
            <img
              src={institution.primary_image_url}
              alt={institution.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center px-4">
                <div className="text-4xl mb-2">🏫</div>
                <p className="text-sm text-gray-500 font-medium line-clamp-2">{institution.name}</p>
              </div>
            </div>
          )}
          {institution.is_featured && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
              {institution.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{institution.city}, {institution.state}</span>
            </div>
          </div>

          {/* Control Type Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {getControlTypeLabel(institution.control_type)}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4 flex-1">
            {institution.tuition_in_state && (
              <div className="flex items-start text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-600">Tuition: </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(institution.tuition_in_state)}
                    {institution.control_type === 'PUBLIC' && (
                      <span className="text-gray-500 text-xs ml-1">(in-state)</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {institution.acceptance_rate && (
              <div className="flex items-start text-sm">
                <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-600">Acceptance Rate: </span>
                  <span className="font-medium text-gray-900">
                    {formatPercentage(institution.acceptance_rate)}
                  </span>
                </div>
              </div>
            )}

            {institution.website && (
              <div className="flex items-start text-sm">
                <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-700 underline truncate"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Footer - Data Quality Score */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Profile Completeness</span>
              <span className="font-medium text-gray-700">
                {institution.data_completeness_score}/100
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${institution.data_completeness_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}