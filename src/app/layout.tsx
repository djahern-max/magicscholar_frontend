import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ProfileProvider } from '@/lib/contexts/ProfileContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MagicScholar',
    description: 'Scholarship management platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <ProfileProvider>
                        {children}
                    </ProfileProvider>
                </AuthProvider>
            </body>
        </html>
    );
}