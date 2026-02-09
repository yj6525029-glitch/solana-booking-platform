import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WanderLux - Curated Stays Protocol',
  description: 'Open protocol for luxury vacation rentals on Solana. Real SOL escrow, NFT receipts, agent API.',
  keywords: 'Solana, vacation rental, crypto booking, NFT, escrow, Web3 travel',
  authors: [{ name: 'Oscar' }],
  openGraph: {
    title: 'WanderLux - Curated Stays Protocol',
    description: 'Luxury vacation rentals on Solana',
    url: 'https://solana-booking-platform.vercel.app',
    siteName: 'WanderLux',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WanderLux - Curated Stays Protocol',
    description: 'Luxury vacation rentals on Solana',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#c9a227" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
