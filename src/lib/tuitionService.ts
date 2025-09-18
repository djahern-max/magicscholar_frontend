// src/lib/tuitionService.ts
import {
    TuitionData,
    TuitionProjectionsResponse,
    AffordabilityRequest,
    AffordabilityAnalysis,
    TuitionSearchFilters
} from '@/types/tuition';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class TuitionService {
    private baseUrl = `${API_BASE_URL}/api/v1/tuition`;

    async getTuitionByInstitution(ipedsId: number): Promise<TuitionData | null> {
        try {
            const response = await fetch(`${this.baseUrl}/institution/${ipedsId}`);
            if (response.status === 404) {
                return null; // Institution has no tuition data
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch tuition data: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tuition data:', error);
            return null;
        }
    }

    async getTuitionProjections(
        ipedsId: number,
        years: number = 5,
        inflationRate?: number
    ): Promise<TuitionProjectionsResponse | null> {
        try {
            const params = new URLSearchParams({
                years: years.toString(),
                ...(inflationRate && { inflation_rate: inflationRate.toString() })
            });

            const response = await fetch(
                `${this.baseUrl}/institution/${ipedsId}/projections?${params}`
            );

            if (response.status === 404) {
                return null;
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch projections: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tuition projections:', error);
            return null;
        }
    }

    async searchInstitutions(
        filters: TuitionSearchFilters,
        limit: number = 50,
        offset: number = 0
    ): Promise<{
        filters: TuitionSearchFilters;
        total_count: number;
        results: TuitionData[];
    } | null> {
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                ...Object.entries(filters).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = value.toString();
                    }
                    return acc;
                }, {} as Record<string, string>)
            });

            const response = await fetch(`${this.baseUrl}/search?${params}`);
            if (!response.ok) {
                throw new Error(`Failed to search institutions: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching institutions:', error);
            return null;
        }
    }

    async analyzeAffordability(request: AffordabilityRequest): Promise<AffordabilityAnalysis | null> {
        try {
            const response = await fetch(`${this.baseUrl}/affordability-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Failed to analyze affordability: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error analyzing affordability:', error);
            return null;
        }
    }

    async getTuitionAnalytics(): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/analytics`);
            if (!response.ok) {
                throw new Error(`Failed to fetch analytics: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tuition analytics:', error);
            return null;
        }
    }

    async getInstitutionWithTuition(ipedsId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/institution/${ipedsId}/full`);
            if (response.status === 404) {
                return null;
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch institution with tuition: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching institution with tuition:', error);
            return null;
        }
    }
}

export const tuitionService = new TuitionService();