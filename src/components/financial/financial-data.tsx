import React from 'react';
import { DollarSign } from 'lucide-react';

interface FinancialData {
    ipeds_id: number;
    tuition_in_state?: number;
    tuition_out_state?: number;
}

interface FinancialDataProps {
    data: FinancialData;
    className?: string;
}

export default function FinancialDataDisplay({
    data,
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

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <DollarSign className="w-5 h-5 mr-2" />
                Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">In-State Tuition</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(data.tuition_in_state)}
                    </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Out-of-State Tuition</div>
                    <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(data.tuition_out_state)}
                    </div>
                </div>
            </div>
        </div>
    );
}