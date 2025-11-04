// src/components/institutions/cost-section.tsx
'use client';

import React, { useState } from 'react';
import { DollarSign, Home, AlertCircle } from 'lucide-react';

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

interface CostSectionProps {
    data: CostData | null;
}

export default function CostSection({ data }: CostSectionProps) {
    const [selectedResidency, setSelectedResidency] = useState<'in_state' | 'out_of_state'>('in_state');

    const formatCurrency = (amount: number | null | undefined): string => {
        if (!amount || amount === 0) return 'Not available';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getCurrentTuition = () => {
        if (!data) return null;
        return selectedResidency === 'in_state'
            ? data.tuition_in_state
            : data.tuition_out_state;
    };

    const getCurrentFees = () => {
        if (!data) return null;
        return selectedResidency === 'in_state'
            ? data.required_fees_in_state
            : data.required_fees_out_state;
    };

    const getAcademicTotal = () => {
        const tuition = getCurrentTuition() || 0;
        const fees = getCurrentFees() || 0;
        return tuition + fees;
    };

    const getRoomBoard = () => {
        return data?.room_board_on_campus || null;
    };

    const getBooks = () => {
        return data?.books_supplies || null;
    };

    const getTotalCost = () => {
        const academic = getAcademicTotal();
        const roomBoard = getRoomBoard() || 0;
        const books = getBooks() || 0;
        return academic + roomBoard + books;
    };

    const getAcademicYear = () => {
        return data?.academic_year || '2024-25';
    };

    const hasAnyTuitionData = data?.has_cost_data && (getCurrentTuition() || getCurrentFees() || getRoomBoard());

    if (!hasAnyTuitionData) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Information Not Available</h3>
                    <p className="text-gray-600">We're working to add cost information for this institution.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cost of Attendance</h2>
                <span className="text-sm text-gray-500">{getAcademicYear()}</span>
            </div>

            {/* Residency Toggle */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-8 max-w-md border-2 border-gray-200">
                <button
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedResidency === 'in_state'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setSelectedResidency('in_state')}
                >
                    In-State Resident
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedResidency === 'out_of_state'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setSelectedResidency('out_of_state')}
                >
                    Out-of-State Resident
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Academic Costs */}
                <div>
                    <div className="flex items-center mb-4">
                        <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Academic Costs</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Tuition</span>
                            <span className="font-medium">{formatCurrency(getCurrentTuition())}</span>
                        </div>
                        {getCurrentFees() && getCurrentFees()! > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Required Fees</span>
                                <span className="font-medium">{formatCurrency(getCurrentFees())}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">Academic Total</span>
                            <span className="font-bold text-blue-600">{formatCurrency(getAcademicTotal())}</span>
                        </div>
                    </div>
                </div>

                {/* Living Costs */}
                <div>
                    <div className="flex items-center mb-4">
                        <Home className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Living Costs</h3>
                    </div>
                    <div className="space-y-3">
                        {getRoomBoard() && getRoomBoard()! > 0 ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Room & Board</span>
                                    <span className="font-medium">{formatCurrency(getRoomBoard())}</span>
                                </div>
                                {getBooks() && getBooks()! > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Books & Supplies</span>
                                        <span className="font-medium">{formatCurrency(getBooks())}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">Living Total</span>
                                    <span className="font-bold text-green-600">
                                        {formatCurrency((getRoomBoard() || 0) + (getBooks() || 0))}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                <p className="text-sm text-yellow-800">
                                    This institution doesn't provide on-campus housing data.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Total Cost Summary */}
            {getTotalCost() > 0 && (
                <div className="mt-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 text-xl">Estimated Total Cost</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedResidency === 'in_state' ? 'In-state resident' : 'Out-of-state resident'}
                                {getRoomBoard() && getRoomBoard()! > 0 && ', living on campus'}
                            </p>
                        </div>
                        <span className="font-bold text-3xl text-blue-600">{formatCurrency(getTotalCost())}</span>
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                    <strong>Note:</strong> Costs shown are estimates for the {getAcademicYear()} academic year.
                    Contact the institution for current information and financial aid details.
                </p>
            </div>
        </div>
    );
}