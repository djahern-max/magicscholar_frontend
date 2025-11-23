// src/app/layout.tsx MagiscScholar App (app.magicscholar.com)
import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  metadataBase: new URL('https://app.magicscholar.com'),
  title: {
    default: 'MagicScholar - Track College Applications & Find Scholarships',
    template: '%s | MagicScholar'
  },
  description: 'Free tools to organize college applications, discover scholarships, and manage your college journey. AI-assisted profile building and deadline tracking.',
  keywords: [
    'college applications',
    'scholarship search',
    'college planning',
    'financial aid',
    'college tracker',
    'application deadlines',
    'college advisor',
    'student planning'
  ],
  authors: [{ name: 'MagicScholar' }],
  creator: 'MagicScholar',
  publisher: 'MagicScholar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.magicscholar.com',
    siteName: 'MagicScholar',
    title: 'MagicScholar - Track College Applications & Find Scholarships',
    description: 'Free tools to organize college applications, discover scholarships, and manage your college journey.',
    images: [
      {
        url: '/opengraph-image.png',  // ← This is the key change
        width: 1200,
        height: 630,
        alt: 'MagicScholar - College Application Tracking',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MagicScholar - Track College Applications & Find Scholarships',
    description: 'Free tools to organize college applications, discover scholarships, and manage your college journey.',
    images: ['/og-image.png'],
    creator: '@magicscholar', // If you have a Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you set them up
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://app.magicscholar.com" />
      </head>
      <body className="min-h-screen bg-white">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}