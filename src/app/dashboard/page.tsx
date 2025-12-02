'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Theme = 'light' | 'dark';

function DashboardContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [theme, setTheme] = useState<Theme>('light');

    // On mount: read stored theme or system preference
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

    // Whenever theme changes, update <html> and localStorage
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
            {/* Top nav */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            MagicScholar
                        </span>
                        <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:inline-block">
                            Dashboard
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
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
                            className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome + summary */}


                <section className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
                    <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-lg shadow-slate-300/40
                  dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Welcome back
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            {user?.first_name
                                ? `Hey ${user.first_name}, let’s plan your next step.`
                                : 'Welcome to your MagicScholar dashboard.'}
                        </h1>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                            This is where you’ll keep track of your college list, scholarship deadlines,
                            and all the little tasks that move you closer to your acceptance letters.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
                    dark:border-white/10 dark:bg-slate-900/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Application status
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                                Getting started
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Add colleges to your list to see your progress here.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
                    dark:border-white/10 dark:bg-slate-900/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Scholarships saved
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                                0
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Start by bookmarking scholarships that fit your profile.
                            </p>
                        </div>
                    </div>
                </section>


                {/* Cards grid */}
                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Colleges you&apos;re exploring
                        </h2>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Once you start saving colleges, they&apos;ll show up here with quick stats
                            like acceptance rate, tuition, and deadlines.
                        </p>
                        <button className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition">
                            Add your first college
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Scholarship planner
                        </h2>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Keep track of scholarship amounts, eligibility, and due dates in one place.
                        </p>
                        <ul className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            <li>• Add scholarships you find online or through your school.</li>
                            <li>• Tag them by priority or category.</li>
                            <li>• See upcoming deadlines at a glance.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md md:col-span-2 xl:col-span-1 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Next steps checklist
                        </h2>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            You can wire real data into this later. For now, here&apos;s a starter flow:
                        </p>
                        <ol className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                            <li>Create or update your profile.</li>
                            <li>Save 3–5 colleges you&apos;re interested in.</li>
                            <li>Bookmark at least 2 scholarships that fit you.</li>
                            <li>Plan your next application milestone.</li>
                        </ol>
                    </div>
                </section>

                {/* Account details */}
                <section className="mt-8">
                    <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Your account
                        </h2>
                        <dl className="mt-3 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">Name</dt>
                                <dd>
                                    {user?.first_name} {user?.last_name}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                                <dd>{user?.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">Username</dt>
                                <dd>{user?.username}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                                <dd>{user?.is_active ? 'Active' : 'Inactive'}</dd>
                            </div>
                        </dl>
                    </div>
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
