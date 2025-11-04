// src/components/institutions/admissions-section.tsx
'use client';

import React from 'react';
import { Users, Award, BookOpen } from 'lucide-react';

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

interface AdmissionsSectionProps {
    data: AdmissionsData;
}

export default function AdmissionsSection({ data }: AdmissionsSectionProps) {
    const getSelectivityLabel = (rate?: number | null): string => {
        if (!rate) return 'Not Available';
        if (rate < 10) return 'Most Selective';
        if (rate < 25) return 'Highly Selective';
        if (rate < 50) return 'Selective';
        if (rate < 75) return 'Moderately Selective';
        return 'Accessible';
    };

    const getSelectivityColor = (rate?: number | null) => {
        if (!rate) return 'bg-gray-50 border-gray-300 text-gray-700';
        if (rate < 10) return 'bg-red-50 border-red-300 text-red-800';
        if (rate < 25) return 'bg-orange-50 border-orange-300 text-orange-800';
        if (rate < 50) return 'bg-yellow-50 border-yellow-300 text-yellow-800';
        if (rate < 75) return 'bg-green-50 border-green-300 text-green-800';
        return 'bg-blue-50 border-blue-300 text-blue-800';
    };

    const selectivityLabel = getSelectivityLabel(data.acceptance_rate);
    const acceptanceRate = data.acceptance_rate || 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admissions Overview</h2>
                {data.academic_year && (
                    <span className="text-sm text-gray-500">{data.academic_year}</span>
                )}
            </div>

            {/* Main Acceptance Rate Card */}
            {data.acceptance_rate !== null && data.acceptance_rate !== undefined && (
                <div className={`rounded-2xl p-8 border-2 mb-6 ${getSelectivityColor(data.acceptance_rate)}`}>
                    <div className="text-center">
                        <div className="mb-3">
                            <Award className="w-12 h-12 mx-auto mb-2 opacity-80" />
                            <p className="text-sm font-semibold uppercase tracking-wide mb-1">
                                {selectivityLabel}
                            </p>
                        </div>
                        <p className="text-6xl font-bold mb-4">
                            {acceptanceRate.toFixed(0)}%
                        </p>
                        <p className="text-lg font-medium">
                            {Math.round(acceptanceRate)} out of 100 applicants get accepted
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Numbers */}
                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                    <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Application Stats</h3>
                    </div>
                    <div className="space-y-3">
                        {data.applications_total && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Students Applied</span>
                                <span className="text-xl font-bold text-gray-900">
                                    {data.applications_total.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {data.admissions_total && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Students Accepted</span>
                                <span className="text-xl font-bold text-green-600">
                                    {data.admissions_total.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {data.enrolled_total && (
                            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                                <span className="text-gray-700">Freshman Class Size</span>
                                <span className="text-xl font-bold text-blue-600">
                                    {data.enrolled_total.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* SAT Scores - Simplified */}
                <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-200">
                    <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Typical SAT Scores</h3>
                    </div>

                    {(data.sat_math_25th || data.sat_reading_25th) ? (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-600 mb-3">
                                Middle 50% of admitted students scored:
                            </p>

                            {data.sat_math_25th && data.sat_math_25th > 0 && data.sat_math_75th && (
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-sm font-medium text-gray-700">Math</span>
                                        <span className="text-2xl font-bold text-purple-700">
                                            {data.sat_math_25th} - {data.sat_math_75th}
                                        </span>
                                    </div>
                                    {data.sat_math_50th && (
                                        <div className="text-xs text-gray-500">
                                            Median: {data.sat_math_50th}
                                        </div>
                                    )}
                                </div>
                            )}

                            {data.sat_reading_25th && data.sat_reading_25th > 0 && data.sat_reading_75th && (
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-sm font-medium text-gray-700">Reading & Writing</span>
                                        <span className="text-2xl font-bold text-purple-700">
                                            {data.sat_reading_25th} - {data.sat_reading_75th}
                                        </span>
                                    </div>
                                    {data.sat_reading_50th && (
                                        <div className="text-xs text-gray-500">
                                            Median: {data.sat_reading_50th}
                                        </div>
                                    )}
                                </div>
                            )}

                            {data.percent_submitting_sat !== null && data.percent_submitting_sat !== undefined && (
                                <div className="pt-3 mt-3 border-t border-purple-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Submitted SAT scores</span>
                                        <span className="text-lg font-bold text-purple-700">
                                            {typeof data.percent_submitting_sat === 'number'
                                                ? data.percent_submitting_sat.toFixed(0)
                                                : Math.round(Number(data.percent_submitting_sat))}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {Number(data.percent_submitting_sat) < 50
                                            ? 'Test optional - many students admitted without scores'
                                            : 'Most admitted students submit test scores'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-white rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-600">
                                This school may be test-optional or SAT data is not available.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                    <strong>💡 What this means:</strong> These numbers show how competitive admission is and what test scores
                    admitted students typically have. Remember that test scores are just one part of your application -
                    grades, activities, and essays matter too!
                </p>
            </div>
        </div>
    );
}