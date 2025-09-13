import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MagicScholar', // Clean, short title
  description: 'Find your perfect college and scholarships',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
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
      <body>{children}</body>
    </html>
  )
}