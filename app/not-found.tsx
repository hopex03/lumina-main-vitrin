'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';


export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-6">
            {/* Animated gold line */}
            <motion.div
                className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-12"
                animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />

            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <Link href="/" className="group inline-flex flex-col items-center transition-opacity hover:opacity-90 relative mb-8">
                    <svg viewBox="0 0 100 85" className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[52%] w-24 h-24 text-[#D4AF37] opacity-[0.15] drop-shadow-sm group-hover:scale-105 transition-transform duration-700 z-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter">
                        <path d="M50 10 L15 75 h70 Z" />
                        <path d="M35 10 L5 75 h30 M65 10 L95 75 h-30" />
                        <path d="M25 45 L50 85 L75 45" />
                    </svg>
                    <span className="relative z-10 text-2xl font-serif tracking-[0.2em] font-black text-white uppercase">
                        Zeray Gold
                    </span>
                    <p className="relative z-10 text-[10px] text-zinc-400 font-bold tracking-[0.4em] uppercase">
                        Est. 2026
                    </p>
                </Link>
                <h1 className="font-serif text-[120px] md:text-[180px] leading-none text-white/10 font-black tracking-tighter select-none">
                    404
                </h1>
                <h2 className="font-serif text-2xl md:text-3xl text-white mt-[-2rem] mb-6 relative z-10">
                    Sayfa Bulunamadı
                </h2>
                <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mb-8" />
                <p className="text-zinc-500 text-sm font-light tracking-wide mb-10 max-w-xs mx-auto leading-relaxed">
                    Aradığınız sayfa kaldırılmış ya da hiç var olmamış olabilir.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black px-8 py-3 text-[11px] font-bold tracking-[0.3em] uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
                    >
                        Vitrine Dön
                    </Link>
                    <Link
                        href="/iletisim"
                        className="border border-zinc-700 text-zinc-400 px-8 py-3 text-[11px] font-bold tracking-[0.3em] uppercase hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
                    >
                        Bize Ulaşın
                    </Link>
                </div>
            </motion.div>

            <motion.div
                className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-12"
                animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 1.25 }}
            />
        </div>
    );
}
