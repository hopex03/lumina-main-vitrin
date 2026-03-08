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
                <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-bold mb-6">
                    Lumina Jewelry
                </p>
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
