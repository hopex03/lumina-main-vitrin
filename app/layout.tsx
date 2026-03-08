import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import WhatsAppButton from '../components/WhatsAppButton'

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
  metadataBase: new URL('https://zeraygold.com.tr'),
  title: 'Zeray Gold | Premium Altın Takı & Mücevherat',
  description: 'Ustalıkla işlenmiş som altın koleksiyonları. Her parçada Türk kuyumculuk geleneği ve modern tasarım. Ücretsiz & sigortalı teslimat.',
  keywords: 'altın takı, mücevherat, altın kolye, altın yüzük, altın küpe, Zeray Gold',
  openGraph: {
    title: 'Zeray Gold | Premium Altın Takı & Mücevherat',
    description: 'Ustalıkla işlenmiş som altın koleksiyonları. 3 dev üreticinin tek platformu.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Zeray Gold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeray Gold | Premium Altın Takı',
    description: 'Ustalıkla işlenmiş som altın koleksiyonları.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} ${playfair.variable} font-sans bg-white text-zinc-900 antialiased relative`}>
        {children}

        {/* FLOATING WHATSAPP BUTTON */}
        <WhatsAppButton variant="floating" />
      </body>
    </html>
  )
}
