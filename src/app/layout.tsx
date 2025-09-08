import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MagicScholar',
  description: 'Find your perfect college and scholarships',
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
