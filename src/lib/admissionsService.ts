// src/lib/admissionsService.ts

import { AdmissionsData, AdmissionsStats } from '@/types/admissions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class AdmissionsService {
    /**
     * Fetch admissions data for a specific institution
     */
    static async getAdmissionsData(ipeds_id: number): Promise<AdmissionsStats> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/admissions/institution/${ipeds_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return { has_data: false };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: AdmissionsData = await response.json();

            // Transform the data into AdmissionsStats format
            return this.transformToStats(data);
        } catch (error) {
            console.error('Error fetching admissions data:', error);
            return { has_data: false };
        }
    }

    /**
     * Transform raw admissions data to stats format
     */
    private static transformToStats(data: AdmissionsData): AdmissionsStats {
        const hasSATMath = data.sat_math_25th || data.sat_math_50th || data.sat_math_75th;
        const hasSATReading = data.sat_reading_25th || data.sat_reading_50th || data.sat_reading_75th;

        return {
            has_data: true,
            academic_year: data.academic_year,
            acceptance_rate: data.acceptance_rate,
            yield_rate: data.yield_rate,
            total_applicants: data.applications_total,
            total_admitted: data.admissions_total,
            total_enrolled: data.enrolled_total,
            sat_math_range: hasSATMath ? {
                percentile_25: data.sat_math_25th || 0,
                percentile_50: data.sat_math_50th || 0,
                percentile_75: data.sat_math_75th || 0,
            } : null,
            sat_reading_range: hasSATReading ? {
                percentile_25: data.sat_reading_25th || 0,
                percentile_50: data.sat_reading_50th || 0,
                percentile_75: data.sat_reading_75th || 0,
            } : null,
            percent_submitting_sat: data.percent_submitting_sat,
        };
    }

    /**
     * Calculate acceptance rate from raw numbers if not provided
     */
    static calculateAcceptanceRate(admitted?: number | null, applied?: number | null): number | null {
        if (!admitted || !applied || applied === 0) return null;
        return Math.round((admitted / applied) * 100 * 100) / 100; // Round to 2 decimals
    }

    /**
     * Calculate yield rate from raw numbers if not provided
     */
    static calculateYieldRate(enrolled?: number | null, admitted?: number | null): number | null {
        if (!enrolled || !admitted || admitted === 0) return null;
        return Math.round((enrolled / admitted) * 100 * 100) / 100; // Round to 2 decimals
    }

    /**
     * Format percentage for display
     */
    static formatPercentage(value?: number | null): string {
        if (value === null || value === undefined) return 'N/A';
        return `${value.toFixed(1)}%`;
    }

    /**
     * Get selectivity category based on acceptance rate
     */
    static getSelectivityCategory(acceptanceRate?: number | null): string {
        if (!acceptanceRate) return 'Not Available';
        if (acceptanceRate < 10) return 'Most Selective';
        if (acceptanceRate < 25) return 'Highly Selective';
        if (acceptanceRate < 50) return 'Selective';
        if (acceptanceRate < 75) return 'Moderately Selective';
        return 'Less Selective';
    }

    /**
     * Get selectivity color for UI
     */
    static getSelectivityColor(acceptanceRate?: number | null): string {
        if (!acceptanceRate) return 'gray';
        if (acceptanceRate < 10) return 'red';
        if (acceptanceRate < 25) return 'orange';
        if (acceptanceRate < 50) return 'yellow';
        if (acceptanceRate < 75) return 'green';
        return 'blue';
    }
}