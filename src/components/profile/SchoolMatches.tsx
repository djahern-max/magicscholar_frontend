// src/components/profile/SchoolMatches.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { School, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;
    control_type: string;
    primary_image_url?: string;
}

interface MatchingInstitutionsResponse {
    institutions: Institution[];
    total: number;
    location_preference: string;
}

interface SchoolMatchesProps {
    locationPreference?: string;
    showPrompt?: boolean;
}

export default function SchoolMatches({ locationPreference, showPrompt = true }: SchoolMatchesProps) {
    const router = useRouter();
    const [schools, setSchools] = useState<Institution[]>([]);
    const [totalSchools, setTotalSchools] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [showingAll, setShowingAll] = useState(false);

    useEffect(() => {
        if (locationPreference) {
            loadSchools(6); // Start with 6 schools
        } else {
            setSchools([]);
            setTotalSchools(0);
            setError('');
            setShowingAll(false);
        }
    }, [locationPreference]);

    const loadSchools = async (limit: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get<MatchingInstitutionsResponse>(
                `${API_BASE_URL}/api/v1/profiles/me/matching-institutions?limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSchools(response.data.institutions);
            setTotalSchools(response.data.total);
        } catch (err: any) {
            console.error('Error loading schools:', err);

            if (err.response?.status === 400) {
                setError('Please save your location preference first to see matching schools');
            } else {
                setError('Unable to load schools. Please try again.');
            }
            setSchools([]);
            setTotalSchools(0);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        setShowingAll(true);
        loadSchools(totalSchools); // Load all schools
    };

    if (!locationPreference && !showPrompt) {
        return null;
    }

    if (!locationPreference && showPrompt) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                            Set Your College Location Preference
                        </h3>
                        <p className="text-sm text-gray-600">
                            Choose a preferred state to see matching colleges
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                            Can't Load Schools Yet
                        </h3>
                        <p className="text-sm text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-gray-600">Loading schools in {locationPreference}...</p>
                </div>
            </div>
        );
    }

    if (schools.length === 0 && totalSchools === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
                <School className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                    Colleges in {locationPreference}
                </h2>
            </div>

            <p className="text-gray-600 mb-4">
                {totalSchools > 0 && (
                    <>
                        Showing {schools.length} of {totalSchools} college{totalSchools !== 1 ? 's' : ''}
                        {' '}in {locationPreference}
                    </>
                )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((school) => (
                    <div
                        key={school.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/institution/${school.id}`)}
                    >
                        <div className="flex items-start gap-3">
                            {school.primary_image_url ? (
                                <img
                                    src={school.primary_image_url}
                                    alt={school.name}
                                    className="w-12 h-12 rounded object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                    <School className="h-6 w-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                    {school.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {school.city}, {school.state}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {school.control_type === 'PUBLIC' ? 'Public' : 'Private'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalSchools > 6 && !showingAll && (
                <button
                    onClick={handleViewAll}
                    className="w-full mt-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                    View All {totalSchools} School{totalSchools !== 1 ? 's' : ''} in {locationPreference}
                </button>
            )}
        </div>
    );
}