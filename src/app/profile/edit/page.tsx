'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const US_STATES = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

const POPULAR_STATES = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];

export default function ProfileEditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedState, setSelectedState] = useState<string>('');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSelectedState(data.location_preference || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedState) return;

        setSaving(true);
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ location_preference: selectedState })
            });

            if (res.ok) {
                setMessage('success');
                setTimeout(() => {
                    router.push('/profile');
                }, 1000);
            } else {
                setMessage('error');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('error');
        } finally {
            setSaving(false);
        }
    };

    const selectPopular = () => {
        if (POPULAR_STATES.length > 0) {
            setSelectedState(POPULAR_STATES[0]);
        }
    };

    const filteredStates = US_STATES.filter(state =>
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Where Do You Want to Go?</h1>
                    <p className="text-slate-600">Select your preferred state for college and discover matching schools</p>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📍</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Location Matching</h3>
                            <p className="text-slate-700 text-sm mb-2">
                                Choose the state where you'd like to attend college. We'll instantly show you all available schools in that state.
                            </p>
                            <div className="bg-blue-100 rounded-lg p-3 mt-3">
                                <p className="text-xs text-blue-900">
                                    💡 <strong>Pro tip:</strong> In-state schools typically offer lower tuition rates (50-70% cheaper than out-of-state)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selection Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Your Selection</h2>
                            {selectedState ? (
                                <p className="text-sm text-slate-600 mt-1">
                                    Currently selected: <span className="font-semibold text-blue-600">{selectedState}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-slate-500 mt-1">No state selected yet</p>
                            )}
                        </div>
                        {selectedState && (
                            <button
                                onClick={() => setSelectedState('')}
                                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search for a state..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Popular States Quick Select */}
                    <div className="mb-4 pb-4 border-b border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Popular States</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_STATES.map((code) => {
                                const state = US_STATES.find(s => s.code === code);
                                return (
                                    <button
                                        key={code}
                                        onClick={() => setSelectedState(code)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedState === code
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {code}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* All States List */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">All States</h3>
                        <div className="max-h-96 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50">
                            {filteredStates.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {filteredStates.map((state) => (
                                        <button
                                            key={state.code}
                                            onClick={() => setSelectedState(state.code)}
                                            className={`w-full text-left px-5 py-4 transition-all ${selectedState === state.code
                                                    ? 'bg-blue-50 border-l-4 border-blue-600'
                                                    : 'hover:bg-white border-l-4 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-lg font-bold ${selectedState === state.code ? 'text-blue-600' : 'text-slate-900'
                                                        }`}>
                                                        {state.code}
                                                    </span>
                                                    <span className={`text-sm ${selectedState === state.code ? 'text-blue-700 font-medium' : 'text-slate-600'
                                                        }`}>
                                                        {state.name}
                                                    </span>
                                                </div>
                                                {selectedState === state.code && (
                                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    No states match "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`rounded-xl p-4 ${message === 'success'
                            ? 'bg-green-50 border-2 border-green-200'
                            : 'bg-red-50 border-2 border-red-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message === 'success' ? (
                                <>
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-800 font-medium">
                                        Preferences saved! Finding your matches...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-red-800 font-medium">
                                        Error saving preferences. Please try again.
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedState}
                        className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${saving || !selectedState
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800'
                            }`}
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Finding Matches...
                            </span>
                        ) : selectedState ? (
                            `Show Me Schools in ${selectedState}`
                        ) : (
                            'Select a State to Continue'
                        )}
                    </button>
                    <button
                        onClick={() => router.push('/profile')}
                        className="px-6 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>

                {!selectedState && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-start gap-3">
                            <span className="text-amber-600 text-xl">⚠️</span>
                            <p className="text-sm text-amber-800">
                                Please select a state from the list above to continue
                            </p>
                        </div>
                    </div>
                )}

                {/* Why Location Matters */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span>💡</span> Why Location Matters
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                                1
                            </span>
                            <span>In-state tuition is typically 50-70% cheaper than out-of-state rates</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                                2
                            </span>
                            <span>Staying close to home can significantly reduce travel and living costs</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                                3
                            </span>
                            <span>Some states have reciprocity agreements with neighboring states for reduced tuition</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                                4
                            </span>
                            <span>Regional job networks and internship opportunities vary by location</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}