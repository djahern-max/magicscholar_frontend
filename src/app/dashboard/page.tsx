// src/app/dashboard/page.tsx
// src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Theme = 'light' | 'dark';

function DashboardContent() {
    const { user, logout } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    const router = useRouter();
    const [theme, setTheme] = useState<Theme>('light');

    // Theme management
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const stored = window.localStorage.getItem('ms-theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored);
            document.documentElement.classList.toggle('dark', stored === 'dark');
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: Theme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        window.localStorage.setItem('ms-theme', theme);
    }, [theme]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    // Calculate profile completion percentage
    const getProfileCompletion = () => {
        if (!profile) return 0;

        const fields = [
            profile.high_school_name,
            profile.graduation_year,
            profile.gpa,
            profile.sat_score || profile.act_score,
            profile.intended_major,
            profile.city && profile.state,
            profile.extracurriculars && profile.extracurriculars.length > 0,
            profile.work_experience && profile.work_experience.length > 0,
            profile.honors_awards && profile.honors_awards.length > 0,
            profile.skills && profile.skills.length > 0,
        ];

        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    };

    const completion = getProfileCompletion();
    const isProfileEmpty = completion === 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
            {/* Top nav */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            MagicScholar
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition"
                        >
                            {theme === 'light' ? 'Dark mode' : 'Light mode'}
                        </button>

                        <div className="hidden text-right text-xs sm:block">
                            <p className="font-medium text-slate-900 dark:text-slate-50">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                        Welcome back, {user?.first_name}.
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Here&apos;s where your college planning stands today.
                    </p>
                </div>

                {/* Profile Status Card */}
                {!profileLoading && profile && (
                    <section className="mb-8">
                        {isProfileEmpty ? (
                            // Empty profile - show upload resume prompt
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8 dark:border-indigo-800 dark:bg-slate-900/80">
                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                    <div className="flex-1 text-center lg:text-left">
                                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                                            Get started with your profile
                                        </h2>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                            Upload your resume and we&apos;ll use it to fill in your profile. You can review and edit
                                            everything later.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                            <button
                                                onClick={() => router.push('/profile/onboarding')}
                                                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"
                                            >
                                                Upload resume
                                            </button>
                                            <button
                                                onClick={() => router.push('/profile/edit')}
                                                className="rounded-full border border-indigo-300 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800 transition"
                                            >
                                                Fill out profile manually
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Profile has data
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        {profile.profile_image_url ? (
                                            <img
                                                src={profile.profile_image_url}
                                                alt="Profile"
                                                className="h-16 w-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                                    {user?.first_name?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                                Your profile
                                            </h2>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {profile.high_school_name || 'Add more information to complete your profile.'}
                                            </p>
                                            {profile.city && profile.state && (
                                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                                    {profile.city}, {profile.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                                    >
                                        View profile
                                    </button>
                                </div>

                                {/* Profile Completion */}
                                <div className="mt-6">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Profile completion
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {completion}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                        <div
                                            className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
                                            style={{ width: `${completion}%` }}
                                        />
                                    </div>
                                    {completion < 100 && (
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            Add more details to get better scholarship and college matches.
                                        </p>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">GPA</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                            {profile.gpa ? `${profile.gpa}` : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">SAT</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                            {profile.sat_score || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Intended major</p>
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                                            {profile.intended_major || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Graduation year</p>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                            {profile.graduation_year || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Quick Actions */}
                <section className="grid gap-6 md:grid-cols-3">
                    <button
                        onClick={() => router.push('/colleges')}
                        className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition dark:border-white/10 dark:bg-slate-900/80"
                    >
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                            Browse colleges
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {profile?.location_preference
                                ? `Explore colleges in ${profile.location_preference}.`
                                : 'Set a location preference on your profile to see more relevant colleges.'}
                        </p>
                    </button>

                    <button
                        onClick={() => router.push('/scholarships')}
                        className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition dark:border-white/10 dark:bg-slate-900/80"
                    >
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                            Find scholarships
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Look for scholarships that match your background and goals.
                        </p>
                    </button>

                    <button
                        onClick={() =>
                            isProfileEmpty ? router.push('/profile/onboarding') : router.push('/profile')
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition dark:border-white/10 dark:bg-slate-900/80"
                    >
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                            {isProfileEmpty ? 'Set up your profile' : 'Update your profile'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {isProfileEmpty
                                ? 'Upload your resume or enter your details to create your profile.'
                                : 'Keep your information current so your matches stay accurate.'}
                        </p>
                    </button>
                </section>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
