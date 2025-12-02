// src/app/institution/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import InstitutionHeader from '@/components/institutions/institution-header';
import InstitutionGallery from '@/components/institutions/institution-gallery';
import QuickFactsSection from '@/components/institutions/quick-facts-section';
import AdmissionsSection from '@/components/institutions/admissions-section';
import CostSection from '@/components/institutions/cost-section';
import { EntityImage } from '@/types/gallery';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Institution {
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;
    website?: string;
    control_type: string;
    size_category: string;
    display_name: string;
    full_address: string;
    primary_image_url?: string;
    display_image_url?: string;
    student_faculty_ratio?: number | null;
    locale?: string | null;
}

interface CostData {
    ipeds_id: number;
    institution_name: string;
    has_cost_data: boolean;
    academic_year?: string;
    tuition_in_state?: number | null;
    tuition_out_state?: number | null;
    required_fees_in_state?: number | null;
    required_fees_out_state?: number | null;
    room_board_on_campus?: number | null;
    books_supplies?: number | null;
}

interface AdmissionsData {
    id: number;
    ipeds_id: number;
    academic_year: string;
    applications_total?: number | null;
    admissions_total?: number | null;
    enrolled_total?: number | null;
    acceptance_rate?: number | null;
    yield_rate?: number | null;
    sat_reading_25th?: number | null;
    sat_reading_50th?: number | null;
    sat_reading_75th?: number | null;
    sat_math_25th?: number | null;
    sat_math_50th?: number | null;
    sat_math_75th?: number | null;
    percent_submitting_sat?: number | null;
}

export default function InstitutionDetail() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [costData, setCostData] = useState<CostData | null>(null);
    const [admissionsData, setAdmissionsData] = useState<AdmissionsData | null>(null);
    const [galleryImages, setGalleryImages] = useState<EntityImage[]>([]);
    const [featuredImage, setFeaturedImage] = useState<EntityImage | null>(null);
    const [loading, setLoading] = useState(true);

    const returnPage = searchParams.get('page') || '1';
    const returnQuery = searchParams.get('query') || '';

    const handleBackClick = () => {
        let backUrl = '/';
        const urlParams = new URLSearchParams();

        if (returnPage && returnPage !== '1') {
            urlParams.append('page', returnPage);
        }
        if (returnQuery) {
            urlParams.append('query', returnQuery);
        }

        if (urlParams.toString()) {
            backUrl += `?${urlParams.toString()}`;
        }

        router.push(backUrl);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // Fetch institution data
                const institutionResponse = await fetch(`${API_BASE_URL}/api/v1/institutions/${params.id}`);
                if (institutionResponse.ok) {
                    const institutionData = await institutionResponse.json();
                    setInstitution(institutionData);

                    if (institutionData.ipeds_id) {
                        // Fetch gallery images
                        try {
                            const galleryResponse = await fetch(
                                `${API_BASE_URL}/api/v1/public-gallery/institutions/ipeds/${institutionData.ipeds_id}/images`
                            );
                            if (galleryResponse.ok) {
                                const galleryData = await galleryResponse.json();
                                setGalleryImages(galleryData);
                            }
                        } catch (galleryError) {
                            console.log('Could not fetch gallery data:', galleryError);
                        }

                        // Fetch featured image
                        try {
                            const featuredResponse = await fetch(
                                `${API_BASE_URL}/api/v1/public-gallery/institutions/ipeds/${institutionData.ipeds_id}/featured`
                            );
                            if (featuredResponse.ok) {
                                const featuredData = await featuredResponse.json();
                                setFeaturedImage(featuredData);
                            }
                        } catch (featuredError) {
                            console.log('Could not fetch featured image:', featuredError);
                        }

                        // Fetch cost data
                        try {
                            const costsResponse = await fetch(`${API_BASE_URL}/api/v1/costs/institution/${institutionData.ipeds_id}`);
                            if (costsResponse.ok) {
                                const costsResult = await costsResponse.json();
                                setCostData(costsResult);
                            }
                        } catch (costError) {
                            console.log('Could not fetch cost data:', costError);
                        }

                        // Fetch admissions data
                        try {
                            const admissionsResponse = await fetch(`${API_BASE_URL}/api/v1/admissions/institution/${institutionData.ipeds_id}`);
                            if (admissionsResponse.ok) {
                                const admissionsResult = await admissionsResponse.json();
                                setAdmissionsData(admissionsResult);
                            }
                        } catch (admissionsError) {
                            console.log('Could not fetch admissions data:', admissionsError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!institution) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
                    <p className="text-gray-600">Sorry, we couldn't find this institution.</p>
                </div>
            </div>
        );
    }

    // Use featured image if available, fallback to primary_image_url
    const institutionWithImage = {
        ...institution,
        display_image_url: featuredImage?.cdn_url || institution.primary_image_url || institution.display_image_url
    };

    return (
        <div className="min-h-screen bg-page-bg">
            {/* Back Button */}
            <div className="bg-page-bg border-b-2 border-gray-300">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to {returnQuery ? 'search results' : 'schools'}
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <InstitutionHeader institution={institutionWithImage} />
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 pb-8">
                    <InstitutionGallery
                        images={galleryImages}
                        institutionName={institution.name}
                    />
                </div>
            )}

            {/* Quick Facts */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <QuickFactsSection institution={institution} />
            </div>

            {/* Admissions Statistics */}
            {admissionsData && (
                <div className="max-w-4xl mx-auto px-4 pb-8">
                    <AdmissionsSection data={admissionsData} />
                </div>
            )}

            {/* Cost Information */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <CostSection data={costData} />
            </div>
        </div>
    );
}
