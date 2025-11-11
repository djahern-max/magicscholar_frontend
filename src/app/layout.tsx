// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'MagicScholar',
  description: 'Find your perfect college and scholarships',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'MagicScholar',
    description: 'Find your perfect college and scholarships',
    url: '/',
    siteName: 'MagicScholar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MagicScholar',
    description: 'Find your perfect college and scholarships',
  },
}

export const viewport: Viewport = {
  themeColor: '#1f2937',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 👇 This is the line you change */}
      <body className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
