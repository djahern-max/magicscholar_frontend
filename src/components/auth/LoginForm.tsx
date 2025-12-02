'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username: email, password });
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left side: branding */}
                <div className="hidden lg:flex flex-col space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm border border-indigo-100">
                            <span className="text-lg">✨</span>
                            <span>MagicScholar</span>
                        </div>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                            Find your perfect college <span className="text-indigo-600">& scholarships</span>
                        </h1>
                        <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-md">
                            Sign in to track colleges, organize scholarships, and keep all your applications in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-slate-100">
                            <p className="font-semibold text-slate-900">Smart College Matches</p>
                            <p className="mt-1 text-slate-500 text-xs">
                                Get suggestions based on your interests, location, and budget.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-slate-100">
                            <p className="font-semibold text-slate-900">Scholarship Tracker</p>
                            <p className="mt-1 text-slate-500 text-xs">
                                Never lose track of deadlines or requirements again.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side: form card */}
                <div className="w-full">
                    <div className="relative">
                        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 opacity-70 blur-lg" />
                        <div className="relative rounded-3xl bg-white/90 shadow-xl border border-slate-100 px-6 py-8 sm:px-8 sm:py-10">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Sign in to <span className="text-indigo-600">MagicScholar</span>
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Welcome back! Let&apos;s continue your college journey.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>

                                <p className="text-center text-xs text-slate-500">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                                    >
                                        Register for free
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Mobile-only small branding */}
                    <div className="mt-6 text-center text-xs text-slate-500 lg:hidden">
                        <span className="font-semibold text-slate-700">MagicScholar</span> ·
                        Plan your future with confidence.
                    </div>
                </div>
            </div>
        </div>
    );
}
