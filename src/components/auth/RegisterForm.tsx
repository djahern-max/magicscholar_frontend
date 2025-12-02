'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterForm() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password: string): boolean => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError(
                'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
            );
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 flex items-center justify-center px-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left side: messaging */}
                <div className="hidden lg:flex flex-col space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm border border-emerald-100">
                            <span className="text-lg">🎓</span>
                            <span>Start your journey</span>
                        </div>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                            Create your <span className="text-indigo-600">MagicScholar</span> account
                        </h1>
                        <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-md">
                            Build a college list, track scholarships, and keep your application planning organized from day one.
                        </p>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Save colleges and compare tuition, majors, and campus life.</li>
                        <li>• Track scholarship requirements and deadlines in one dashboard.</li>
                        <li>• Stay on top of essays, recommendations, and application checklists.</li>
                    </ul>
                </div>

                {/* Right side: form */}
                <div className="w-full">
                    <div className="relative">
                        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 opacity-70 blur-lg" />
                        <div className="relative rounded-3xl bg-white/90 shadow-xl border border-slate-100 px-6 py-8 sm:px-8 sm:py-10">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Create your account
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    It only takes a minute, and you can always update your info later.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="first_name"
                                                className="block text-sm font-medium text-slate-700 mb-1.5"
                                            >
                                                First name
                                            </label>
                                            <input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                required
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                                placeholder="Alex"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="last_name"
                                                className="block text-sm font-medium text-slate-700 mb-1.5"
                                            >
                                                Last name
                                            </label>
                                            <input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                required
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                                placeholder="Johnson"
                                            />
                                        </div>
                                    </div>

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
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="username"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                            placeholder="magicstudent123"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="confirmPassword"
                                                className="block text-sm font-medium text-slate-700 mb-1.5"
                                            >
                                                Confirm password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-50 outline-none transition"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500">
                                        Passwords must be at least 8 characters and include upper &amp; lowercase letters, a
                                        number, and a special character.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? 'Creating account…' : 'Create account'}
                                </button>

                                <p className="text-center text-xs text-slate-500">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                                    >
                                        Sign in instead
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Mobile-only small branding */}
                    <div className="mt-6 text-center text-xs text-slate-500 lg:hidden">
                        <span className="font-semibold text-slate-700">MagicScholar</span> ·
                        Stay organized from your first search to your final decision.
                    </div>
                </div>
            </div>
        </div>
    );
}
