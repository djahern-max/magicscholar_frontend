// src/components/institutions/admissions-stats.tsx
'use client';

import React from 'react';
import { AdmissionsStats } from '@/types/admissions';
import { AdmissionsService } from '@/lib/admissionsService';
import { Users, TrendingUp, Award, BookOpen, AlertCircle } from 'lucide-react';

interface AdmissionsStatsProps {
    stats: AdmissionsStats;
}

export default function AdmissionsStatsComponent({ stats }: AdmissionsStatsProps) {
    if (!stats.has_data) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Admissions Data Not Available
                    </h3>
                    <p className="text-gray-600">
                        We're working to add admissions information for this institution.
                    </p>
                </div>
            </div>
        );
    }

    const selectivityCategory = AdmissionsService.getSelectivityCategory(stats.acceptance_rate);
    const selectivityColor = AdmissionsService.getSelectivityColor(stats.acceptance_rate);

    const getColorClasses = (color: string) => {
        const colors = {
            red: 'bg-red-50 border-red-200 text-red-700',
            orange: 'bg-orange-50 border-orange-200 text-orange-700',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            green: 'bg-green-50 border-green-200 text-green-700',
            blue: 'bg-blue-50 border-blue-200 text-blue-700',
            gray: 'bg-gray-50 border-gray-200 text-gray-700',
        };
        return colors[color as keyof typeof colors] || colors.gray;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admissions Statistics</h2>
                {stats.academic_year && (
                    <span className="text-sm text-gray-500">{stats.academic_year}</span>
                )}
            </div>

            {/* Acceptance Rate Highlight */}
            {stats.acceptance_rate !== null && stats.acceptance_rate !== undefined && (
                <div className={`rounded-xl p-6 border-2 mb-6 ${getColorClasses(selectivityColor)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1">Acceptance Rate</p>
                            <p className="text-4xl font-bold">
                                {AdmissionsService.formatPercentage(stats.acceptance_rate)}
                            </p>
                        </div>
                        <div className="text-right">
                            <Award className="w-8 h-8 mb-2 ml-auto" />
                            <p className="text-sm font-semibold">{selectivityCategory}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Statistics */}
                <div>
                    <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Application Stats</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.total_applicants && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Total Applicants</span>
                                <span className="font-medium">
                                    {stats.total_applicants.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {stats.total_admitted && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Total Admitted</span>
                                <span className="font-medium">
                                    {stats.total_admitted.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {stats.total_enrolled && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Total Enrolled</span>
                                <span className="font-medium">
                                    {stats.total_enrolled.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {stats.yield_rate !== null && stats.yield_rate !== undefined && (
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-gray-700">Yield Rate</span>
                                <span className="font-semibold text-blue-600">
                                    {AdmissionsService.formatPercentage(stats.yield_rate)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Test Scores */}
                <div>
                    <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Test Scores (SAT)</h3>
                    </div>

                    {(stats.sat_math_range || stats.sat_reading_range) ? (
                        <div className="space-y-4">
                            {stats.sat_math_range && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Math</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">25th percentile</span>
                                            <span className="font-medium">{stats.sat_math_range.percentile_25}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">50th percentile</span>
                                            <span className="font-medium">{stats.sat_math_range.percentile_50}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">75th percentile</span>
                                            <span className="font-medium">{stats.sat_math_range.percentile_75}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {stats.sat_reading_range && (
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Reading</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">25th percentile</span>
                                            <span className="font-medium">{stats.sat_reading_range.percentile_25}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">50th percentile</span>
                                            <span className="font-medium">{stats.sat_reading_range.percentile_50}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">75th percentile</span>
                                            <span className="font-medium">{stats.sat_reading_range.percentile_75}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {stats.percent_submitting_sat !== null && stats.percent_submitting_sat !== undefined && (
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-700">Students Submitting SAT</span>
                                        <span className="text-sm font-semibold text-purple-600">
                                            {AdmissionsService.formatPercentage(stats.percent_submitting_sat)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                            <p className="text-sm text-gray-600">
                                SAT score data not available for this institution.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                    <strong>Note:</strong> Admissions statistics reflect data from the {stats.academic_year || 'most recent'} academic year.
                    These numbers can vary year to year. For the most current information, visit the institution's admissions website.
                </p>
            </div>
        </div>
    );
}