// src/components/tuition/TuitionDisplay.tsx
'use client';

import React, { useState } from 'react';
import { TuitionData } from '@/types/tuition';

interface TuitionDisplayProps {
    tuitionData: TuitionData;
    showProjections?: boolean;
    residencyStatus?: 'in_state' | 'out_of_state';
}

export default function TuitionDisplay({
    tuitionData,
    residencyStatus = 'in_state'
}: TuitionDisplayProps) {
    const [selectedResidency, setSelectedResidency] = useState<'in_state' | 'out_of_state'>(residencyStatus);

    const formatCurrency = (amount?: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getAffordabilityColor = (category: string) => {
        switch (category) {
            case 'VERY_AFFORDABLE': return 'text-green-600 bg-green-100';
            case 'AFFORDABLE': return 'text-green-500 bg-green-50';
            case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
            case 'EXPENSIVE': return 'text-orange-600 bg-orange-100';
            case 'VERY_EXPENSIVE': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getDataQualityBadge = (score: number) => {
        if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
        if (score >= 80) return { text: 'Very Good', color: 'bg-green-100 text-green-700' };
        if (score >= 70) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
        if (score >= 60) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Limited', color: 'bg-red-100 text-red-800' };
    };

    const primaryTuition = selectedResidency === 'in_state' ? tuitionData.tuition_in_state : tuitionData.tuition_out_state;
    const primaryTuitionFees = selectedResidency === 'in_state' ? tuitionData.tuition_fees_in_state : tuitionData.tuition_fees_out_state;
    const primaryTotalCost = selectedResidency === 'in_state' ? tuitionData.total_cost_in_state : tuitionData.total_cost_out_state;
    const primaryFees = selectedResidency === 'in_state' ? tuitionData.required_fees_in_state : tuitionData.required_fees_out_state;

    const qualityBadge = getDataQualityBadge(tuitionData.data_completeness_score);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tuition & Financial Information
                    </h2>
                    <p className="text-sm text-gray-600">Academic Year: {tuitionData.academic_year}</p>
                </div>
                <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${qualityBadge.color}`}>
                        {qualityBadge.text} Data
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAffordabilityColor(tuitionData.affordability_category)}`}>
                        {tuitionData.affordability_category.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Residency Toggle */}
            <div className="mb-6">
                <div className="flex rounded-lg bg-gray-100 p-1 max-w-xs">
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedResidency === 'in_state'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                        onClick={() => setSelectedResidency('in_state')}
                    >
                        In-State
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedResidency === 'out_of_state'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                        onClick={() => setSelectedResidency('out_of_state')}
                    >
                        Out-of-State
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tuition Breakdown */}
                <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Annual Costs</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Tuition:</span>
                            <span className="font-semibold text-lg">{formatCurrency(primaryTuition)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Required Fees:</span>
                            <span className="font-medium">{formatCurrency(primaryFees)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">Tuition & Fees Total:</span>
                            <span className="font-bold text-xl text-blue-600">{formatCurrency(primaryTuitionFees)}</span>
                        </div>
                    </div>
                </div>

                {/* Living Expenses */}
                <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Living Expenses</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Room & Board:</span>
                            <span className="font-medium">{formatCurrency(tuitionData.room_board_on_campus)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Books & Supplies:</span>
                            <span className="font-medium">{formatCurrency(tuitionData.books_supplies)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Personal Expenses:</span>
                            <span className="font-medium">{formatCurrency(tuitionData.personal_expenses)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700">Transportation:</span>
                            <span className="font-medium">{formatCurrency(tuitionData.transportation)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Cost Summary */}
            <div className="mt-6 bg-blue-50 rounded-lg p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Total Cost of Attendance</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Includes tuition, fees, and estimated living expenses for {selectedResidency === 'in_state' ? 'in-state' : 'out-of-state'} students
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                            {formatCurrency(primaryTotalCost)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">per academic year</p>
                    </div>
                </div>
            </div>

            {/* Data Quality Indicators */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                            Data Completeness: <span className="font-medium">{tuitionData.data_completeness_score}%</span>
                        </span>
                        <span className="text-gray-600">
                            Source: <span className="font-medium">{tuitionData.data_source}</span>
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        {tuitionData.has_tuition_data && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Tuition
                            </span>
                        )}
                        {tuitionData.has_fees_data && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Fees
                            </span>
                        )}
                        {tuitionData.has_living_data && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Living Costs
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}