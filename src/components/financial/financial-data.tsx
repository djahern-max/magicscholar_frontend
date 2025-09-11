// Replace your existing FinancialDataDisplay component with this:
import React from 'react';
import {
    DollarSign,
    Home,
    BookOpen,
    Car,
    User,
    CheckCircle,
    GraduationCap
} from 'lucide-react';

interface FinancialData {
    id?: number;
    ipeds_id: number;
    academic_year: string;
    data_source: string;
    tuition_in_state?: number;
    tuition_out_state?: number;
    required_fees?: number;
    tuition_fees_in_state?: number;
    tuition_fees_out_state?: number;
    room_board_on_campus?: number;
    room_board_off_campus?: number;
    books_supplies?: number;
    personal_expenses?: number;
    transportation?: number;
    has_tuition_data: boolean;
    has_fees_data: boolean;
    data_completeness_score: number;
    validation_issues?: string;
    validation_status: string;
    total_cost_in_state?: number;
    total_cost_out_state?: number;
    has_comprehensive_data?: boolean;
    cost_breakdown?: any;
    created_at?: string;
    updated_at?: string;
}

interface FinancialDataProps {
    data: FinancialData;
    compact?: boolean;
    showCostSummary?: boolean;
    className?: string;
}

export default function FinancialDataDisplay({
    data,
    compact = false,
    showCostSummary = true,
    className = ""
}: FinancialDataProps) {
    const formatCurrency = (amount?: number) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (compact) {
        return (
            <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Tuition & Fees
                    </h3>
                    <span className="text-xs text-gray-500">AY {data.academic_year}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">In-State</div>
                        <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(data.tuition_fees_in_state)}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Out-of-State</div>
                        <div className="text-xl font-bold text-purple-600">
                            {formatCurrency(data.tuition_fees_out_state)}
                        </div>
                    </div>
                </div>

                {data.room_board_on_campus && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">Room & Board: {formatCurrency(data.room_board_on_campus)}</div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Information
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    {data.data_completeness_score}% complete
                </div>
            </div>

            {/* Data Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Academic Year: {data.academic_year}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Status: <span className="capitalize">{data.validation_status}</span>
                </div>
            </div>

            {/* Tuition & Fees */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tuition & Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                            <GraduationCap className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="font-medium text-gray-900">In-State Tuition</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(data.tuition_in_state)}
                        </div>
                        {data.required_fees && (
                            <div className="text-sm text-gray-600 mt-1">
                                + {formatCurrency(data.required_fees)} fees
                            </div>
                        )}
                        {data.tuition_fees_in_state && (
                            <div className="text-sm font-medium text-gray-900 mt-1">
                                Total: {formatCurrency(data.tuition_fees_in_state)}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                            <GraduationCap className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="font-medium text-gray-900">Out-of-State Tuition</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(data.tuition_out_state)}
                        </div>
                        {data.required_fees && (
                            <div className="text-sm text-gray-600 mt-1">
                                + {formatCurrency(data.required_fees)} fees
                            </div>
                        )}
                        {data.tuition_fees_out_state && (
                            <div className="text-sm font-medium text-gray-900 mt-1">
                                Total: {formatCurrency(data.tuition_fees_out_state)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Living Expenses */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Living Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Home className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Room & Board (On-Campus)</div>
                        <div className="font-bold text-green-600">
                            {formatCurrency(data.room_board_on_campus)}
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Home className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Room & Board (Off-Campus)</div>
                        <div className="font-bold text-blue-600">
                            {formatCurrency(data.room_board_off_campus)}
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <BookOpen className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Books & Supplies</div>
                        <div className="font-bold text-orange-600">
                            {formatCurrency(data.books_supplies)}
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Car className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Transportation</div>
                        <div className="font-bold text-purple-600">
                            {formatCurrency(data.transportation)}
                        </div>
                    </div>
                </div>

                {data.personal_expenses && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Personal Expenses: </span>
                            <span className="ml-2 font-bold text-gray-900">
                                {formatCurrency(data.personal_expenses)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Summary */}
            {showCostSummary && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Estimated Total Annual Cost</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-blue-700 mb-1">In-State Student</div>
                            <div className="text-2xl font-bold text-blue-900">
                                {/* Use the pre-calculated total from API if available, otherwise calculate */}
                                {formatCurrency(
                                    data.total_cost_in_state ||
                                    (data.tuition_fees_in_state || 0) +
                                    (data.room_board_on_campus || 0) +
                                    (data.books_supplies || 0) +
                                    (data.personal_expenses || 0) +
                                    (data.transportation || 0)
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-purple-700 mb-1">Out-of-State Student</div>
                            <div className="text-2xl font-bold text-purple-900">
                                {/* Use the pre-calculated total from API if available, otherwise calculate */}
                                {formatCurrency(
                                    data.total_cost_out_state ||
                                    (data.tuition_fees_out_state || 0) +
                                    (data.room_board_on_campus || 0) +
                                    (data.books_supplies || 0) +
                                    (data.personal_expenses || 0) +
                                    (data.transportation || 0)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}