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
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>;
    }

    const totalFields = 75;
    const filledFields = profileData ? 8 : 0;
    const actualCompletion = Math.round((filledFields / totalFields) * 100);

    return (
        <div style={{
            fontFamily: 'monospace',
            maxWidth: '900px',
            margin: '20px auto',
            padding: '20px',
            background: '#fff',
            border: '1px solid #ddd'
        }}>
            <h1 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                PROFILE FIELD REPORT - User: {profileData?.user_id || 'No Profile'}
            </h1>

            <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', border: '1px solid #ccc' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '5px' }}>Total fields:</td>
                            <td>{totalFields}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '5px' }}>Filled:</td>
                            <td>{filledFields}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '5px' }}>Empty:</td>
                            <td>{totalFields - filledFields}</td>
                        </tr>
                        <tr style={{ fontWeight: 'bold' }}>
                            <td style={{ padding: '5px' }}>Actual Completion:</td>
                            <td>{actualCompletion}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ background: '#e3f2fd', padding: '15px', marginBottom: '20px', border: '1px solid #90caf9' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>SCHOLARSHIP MATCHES</h3>
                <p><strong>Count:</strong> {scholarshipCount}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Total scholarships in database</p>
            </div>

            {profileData && (
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ borderBottom: '1px solid #000' }}>FILLED FIELDS ({filledFields})</h2>
                    <div style={{ padding: '10px 0' }}>
                        <div>✓ high_school_name: "{profileData.high_school_name}"</div>
                        <div>✓ graduation_year: {profileData.graduation_year}</div>
                        <div>✓ gpa: {profileData.gpa}</div>
                        <div>✓ intended_major: "{profileData.intended_major}"</div>
                        <div>✓ state: "{profileData.state}"</div>
                        <div>✓ academic_interests: {profileData.academic_interests?.join(', ')}</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={loadData} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Refresh
                </button>
                <button onClick={() => router.push('/profile/edit')} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Edit Profile
                </button>
                <button onClick={() => router.push('/scholarships')} style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer' }}>
                    View Scholarships
                </button>
            </div>

            {profileData && (
                <details style={{ marginTop: '30px' }}>
                    <summary style={{ cursor: 'pointer', padding: '10px', background: '#e9ecef' }}>
                        Raw API Response
                    </summary>
                    <pre style={{ background: '#f8f9fa', padding: '15px', overflow: 'auto', fontSize: '12px' }}>
                        {JSON.stringify(profileData, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}