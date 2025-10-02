'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const navigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-gray-900"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bg-white border-b-2 border-gray-300 z-50 shadow-lg">
                        <nav className="py-4">
                            <button
                                onClick={() => navigate('/')}
                                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                            >
                                Schools
                            </button>
                            <button
                                onClick={() => navigate('/scholarships')}
                                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                            >
                                Scholarships
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                            >
                                Profile
                            </button>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}