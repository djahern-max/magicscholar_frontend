'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface School {
    id: number;
    name: string;
    city: string;
    state: string;
    match_score?: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [scholarshipCount, setScholarshipCount] = useState(0);
    const [schoolMatches, setSchoolMatches] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllSchools, setShowAllSchools] = useState(false);

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
            // Load profile
            const profileRes = await fetch(`${API_BASE_URL}/api/v1/profiles/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData(data);
            }

            // Load scholarships
            const scholarshipsRes = await fetch(`${API_BASE_URL}/api/v1/scholarships/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (scholarshipsRes.ok) {
                const scholarships = await scholarshipsRes.json();
                setScholarshipCount(scholarships.scholarships?.length || 0);
            }

            // Load school matches
            const schoolsRes = await fetch(`${API_BASE_URL}/api/v1/profiles/school-matches`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (schoolsRes.ok) {
                const schools = await schoolsRes.json();
                setSchoolMatches(schools.matches || []);
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
    const countFilledFields = (profile: any) => {
        if (!profile) return 0;

        let count = 0;
        if (profile.state) count++;
        if (profile.high_school_name) count++;
        if (profile.graduation_year) count++;
        if (profile.gpa) count++;
        if (profile.intended_major) count++;
        if (profile.academic_interests?.length > 0) count++;

        return count;
    };

    const filledFields = countFilledFields(profileData);
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

            {/* School Matches Section */}
            <div className="bg-green-50 p-4 mb-5 border border-green-300">
                <h3 className="mt-0 mb-2.5">SCHOOL MATCHES</h3>
                <p><strong>Count:</strong> {schoolMatches.length}</p>
                <p className="text-xs text-gray-600 mb-3">Schools matched to your profile</p>
                {schoolMatches.length > 0 && (
                    <>
                        <div className="mt-3 max-h-60 overflow-y-auto border border-green-200 rounded">
                            {schoolMatches.slice(0, showAllSchools ? schoolMatches.length : 5).map((school, idx) => (
                                <div
                                    key={school.id}
                                    className="py-2 px-3 border-b border-green-200 last:border-b-0 hover:bg-green-100 cursor-pointer"
                                    onClick={() => router.push(`/institution/${school.id}`)}
                                >
                                    <span className="font-bold">#{idx + 1}</span> {school.name} - {school.city}, {school.state}
                                    {school.match_score && (
                                        <span className="text-xs text-green-700 ml-2">
                                            ({school.match_score}% match)
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {schoolMatches.length > 5 && (
                            <button
                                onClick={() => setShowAllSchools(!showAllSchools)}
                                className="text-sm text-green-700 hover:text-green-900 font-bold mt-2 cursor-pointer bg-transparent border-none"
                            >
                                {showAllSchools ? '- Show less' : `+ ${schoolMatches.length - 5} more schools`}
                            </button>
                        )}
                    </>
                )}
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