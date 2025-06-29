import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Transform Your Physique with Brandon Hendrickson - 3x Mr. Olympia Champion',
  description: 'Discover the proven methods used by triple Mr. Olympia champion Brandon Hendrickson to build an aesthetic, championship-winning physique.',
  keywords: 'Brandon Hendrickson, Mr. Olympia, physique transformation, bodybuilding, fitness program',
  openGraph: {
    title: 'Transform Your Physique with Brandon Hendrickson',
    description: 'Learn from a 3x Mr. Olympia Champion',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-inter bg-champion-black text-champion-white antialiased">
        {children}
      </body>
    </html>
  )
}