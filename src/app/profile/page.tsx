'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [scholarshipCount, setScholarshipCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const profileRes = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData(data);
            }

            const scholarshipsRes = await fetch(`${API_BASE_URL}/api/v1/scholarships/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (scholarshipsRes.ok) {
                const scholarships = await scholarshipsRes.json();
                setScholarshipCount(scholarships.scholarships?.length || 0);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-5 text-center">Loading profile...</div>;
    }

    const totalFields = 75;
    const filledFields = profileData ? 8 : 0;
    const actualCompletion = Math.round((filledFields / totalFields) * 100);

    return (
        <div className="font-mono max-w-4xl mx-auto my-5 p-5 bg-white border border-gray-300">
            <h1 className="border-b-2 border-black pb-2.5 mb-5">
                PROFILE FIELD REPORT - User: {profileData?.user_id || 'No Profile'}
            </h1>

            <div className="bg-gray-100 p-4 mb-5 border border-gray-400">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="py-1">Total fields:</td>
                            <td>{totalFields}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Filled:</td>
                            <td>{filledFields}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Empty:</td>
                            <td>{totalFields - filledFields}</td>
                        </tr>
                        <tr className="font-bold">
                            <td className="py-1">Actual Completion:</td>
                            <td>{actualCompletion}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 p-4 mb-5 border border-blue-300">
                <h3 className="mt-0 mb-2.5">SCHOLARSHIP MATCHES</h3>
                <p><strong>Count:</strong> {scholarshipCount}</p>
                <p className="text-xs text-gray-600">Total scholarships in database</p>
            </div>

            {profileData && (
                <div className="mb-5">
                    <h2 className="border-b border-black">FILLED FIELDS ({filledFields})</h2>
                    <div className="py-2.5">
                        <div>✓ high_school_name: "{profileData.high_school_name}"</div>
                        <div>✓ graduation_year: {profileData.graduation_year}</div>
                        <div>✓ gpa: {profileData.gpa}</div>
                        <div>✓ intended_major: "{profileData.intended_major}"</div>
                        <div>✓ state: "{profileData.state}"</div>
                        <div>✓ academic_interests: {profileData.academic_interests?.join(', ')}</div>
                    </div>
                </div>
            )}

            <div className="flex gap-2.5">
                <button
                    onClick={loadData}
                    className="px-5 py-2.5 bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-colors"
                >
                    Refresh
                </button>
                <button
                    onClick={() => router.push('/profile/edit')}
                    className="px-5 py-2.5 bg-green-600 text-white border-none cursor-pointer hover:bg-green-700 transition-colors"
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => router.push('/scholarships')}
                    className="px-5 py-2.5 bg-cyan-600 text-white border-none cursor-pointer hover:bg-cyan-700 transition-colors"
                >
                    View Scholarships
                </button>
            </div>

            {profileData && (
                <details className="mt-8">
                    <summary className="cursor-pointer p-2.5 bg-gray-200 hover:bg-gray-300 transition-colors">
                        Raw API Response
                    </summary>
                    <pre className="bg-gray-50 p-4 overflow-auto text-xs">
                        {JSON.stringify(profileData, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}