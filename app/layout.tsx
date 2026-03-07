import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lumina | Premium Mücevherat & Pırlanta',
  description: 'Seçkin tasarımlar, sertifikalı pırlantalar ve eşsiz mücevher koleksiyonları ile Lumina ışıltısı.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} ${playfair.variable} font-sans bg-white text-zinc-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
