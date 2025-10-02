'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const US_STATES = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
];

export default function ProfileEditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [state, setState] = useState('');
    const [preferredStates, setPreferredStates] = useState<string[]>([]);
    const [message, setMessage] = useState('');

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
            const res = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setState(data.state || '');
                setPreferredStates(data.preferred_states || []); // Add this
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state, preferred_states: preferredStates })
            });

            if (res.ok) {
                setMessage('✓ Profile updated successfully');
                setTimeout(() => {
                    router.push('/profile');
                }, 1500);
            } else {
                setMessage('✗ Error updating profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('✗ Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    return (
        <div className="font-mono max-w-4xl mx-auto my-5 p-5 bg-white border border-gray-300">
            <h1 className="border-b-2 border-black pb-2.5 mb-5">
                PROFILE EDITOR
            </h1>

            <div className="bg-blue-50 p-4 mb-5 border border-blue-300">
                <p className="text-sm mb-0">
                    Start by telling us where you want to go to school. This helps us find the best matches for you.
                </p>
            </div>

            <form onSubmit={handleSave}>
                <div className="mb-5">
                    <label className="block mb-2 font-bold">
                        LOCATION PREFERENCE
                    </label>



                    <div className="max-h-60 overflow-y-auto border border-gray-400 p-2 bg-white">
                        {US_STATES.map((s) => (
                            <label key={s.code} className="block py-1 hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={s.code}
                                    checked={preferredStates.includes(s.code)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPreferredStates([...preferredStates, s.code]);
                                        } else {
                                            setPreferredStates(preferredStates.filter(st => st !== s.code));
                                        }
                                    }}
                                    className="mr-2"
                                />
                                {s.code} - {s.name}
                            </label>
                        ))}
                    </div>






                </div>

                {message && (
                    <div className={`p-3 mb-4 border ${message.includes('✓')
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-red-50 border-red-300 text-red-800'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="flex gap-2.5">
                    <button
                        type="submit"
                        disabled={saving || preferredStates.length === 0}
                        className="px-5 py-2.5 bg-green-600 text-white border-none cursor-pointer hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="px-5 py-2.5 bg-gray-600 text-white border-none cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <div className="mt-8 p-4 bg-gray-50 border border-gray-300">
                <h3 className="mt-0 mb-2 text-sm">COMING SOON</h3>
                <ul className="text-xs text-gray-600 list-none pl-0">
                    <li>• Additional state preferences</li>
                    <li>• Campus size preference</li>
                    <li>• Urban/suburban/rural setting</li>
                    <li>• Academic information (GPA, test scores)</li>
                    <li>• Major and career interests</li>
                </ul>
            </div>
        </div>
    );
}