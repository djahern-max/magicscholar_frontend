// src/components/institutions/institution-card.tsx
import React from 'react';
import Link from 'next/link';
import { MapPin, Users, ExternalLink } from 'lucide-react';
import { Institution } from '@/types/institution';

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  const getControlTypeDisplay = (controlType: string) => {
    const types: Record<string, string> = {
      'PUBLIC': 'Public',
      'PRIVATE_NONPROFIT': 'Private Non-Profit',
      'PRIVATE_FOR_PROFIT': 'Private For-Profit',
      'public': 'Public',
      'private': 'Private',
      'private_nonprofit': 'Private Non-Profit',
      'private_for_profit': 'Private For-Profit'
    };
    return types[controlType] || controlType;
  };

  const getSizeCategoryDisplay = (sizeCategory: string | null) => {
    if (!sizeCategory) return 'Size not available';

    const sizes: Record<string, string> = {
      'very_small': 'Very Small (<1,000)',
      'small': 'Small (1,000-2,999)',
      'medium': 'Medium (3,000-9,999)',
      'large': 'Large (10,000-19,999)',
      'very_large': 'Very Large (20,000+)',
      'Very Small': 'Very Small (<1,000)',
      'Small': 'Small (1,000-2,999)',
      'Medium': 'Medium (3,000-9,999)',
      'Large': 'Large (10,000-19,999)',
      'Very Large': 'Very Large (20,000+)'
    };
    return sizes[sizeCategory] || sizeCategory;
  };

  return (
    <Link href={`/institution/${institution.ipeds_id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        {/* Institution Image */}
        <div className="relative h-48 bg-gray-200">
          {institution.primary_image_url ? (
            <img
              src={institution.primary_image_url}
              alt={institution.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          {/* Data Quality Badge */}
          {institution.data_completeness_score && institution.data_completeness_score >= 70 && (
            <div className="absolute top-2 right-2">
              <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                {institution.data_completeness_score}% Complete
              </span>
            </div>
          )}

          {/* Verification Badge */}
          {institution.admin_verified && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Institution Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {institution.name}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{institution.city}, {institution.state}</span>
            </div>

            {/* Control Type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                {getControlTypeDisplay(institution.control_type)}
              </span>
            </div>

            {/* Size Category */}
            {institution.size_category && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{getSizeCategoryDisplay(institution.size_category)}</span>
              </div>
            )}

            {/* Student-Faculty Ratio */}
            {institution.student_faculty_ratio && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium">Ratio:</span>
                <span>{institution.student_faculty_ratio}:1</span>
              </div>
            )}

            {/* Tuition */}
            {(institution.tuition_in_state || institution.tuition_out_of_state || institution.tuition_private) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1">Tuition:</div>
                {institution.control_type === 'PUBLIC' ? (
                  <div className="space-y-1 text-xs">
                    {institution.tuition_in_state && (
                      <div>In-State: ${institution.tuition_in_state.toLocaleString()}</div>
                    )}
                    {institution.tuition_out_of_state && (
                      <div>Out-of-State: ${institution.tuition_out_of_state.toLocaleString()}</div>
                    )}
                  </div>
                ) : (
                  institution.tuition_private && (
                    <div className="text-xs">${institution.tuition_private.toLocaleString()}/year</div>
                  )
                )}
              </div>
            )}

            {/* Acceptance Rate */}
            {institution.acceptance_rate && (
              <div className="mt-2 text-xs">
                <span className="font-medium text-gray-700">Acceptance Rate:</span>{' '}
                <span className="text-green-600 font-medium">{institution.acceptance_rate}%</span>
              </div>
            )}

            {/* Website Link */}
            {institution.website && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}