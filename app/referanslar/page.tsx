'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlobalFooter from '../../components/GlobalFooter';

const references = [
    {
        id: 1,
        name: 'Atar Kuyumculuk',
        image: '/references/ref-1.png',
        address: 'Şeyh Keramettin, Gazi Cd. No: 6/A, 28000 Giresun Merkez/Giresun',
        googleMapsUrl: 'https://maps.google.com/?q=%C5%9Eeyh+Keramettin,+Gazi+Cd.+No:+6/A,+28000+Giresun+Merkez/Giresun',
    },
    {
        id: 2,
        name: 'Fatih Kuyumculuk',
        image: '/references/ref-2.png',
        address: 'Sultan Selim, Arifbey Cd. no:4/c, 28100 Giresun Merkez/Giresun',
        googleMapsUrl: 'https://maps.google.com/?q=Sultan+Selim,+Arifbey+Cd.+no:4/c,+28100+Giresun+Merkez/Giresun',
    },
];

export default function ReferencesPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            {/* TOP BAR */}
            <div className="bg-black text-[#d4af37] text-[10px] text-center py-2.5 tracking-[0.35em] font-bold uppercase border-b border-[#d4af37]/20">
                Ücretsiz &amp; Sigortalı Teslimat · Tüm Türkiye
            </div>

            {/* HEADER */}
            <header className="py-5 px-8 md:px-16 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
                <Link href="/" className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 hover:text-[#d4af37] transition-colors uppercase flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Ana Sayfa
                </Link>
                <Link href="/" className="group flex items-center justify-center transition-opacity hover:opacity-90 relative w-[200px] h-[60px]">
                    <svg viewBox="0 0 100 85" className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[52%] w-16 h-16 text-[#D4AF37] opacity-[0.15] drop-shadow-sm group-hover:scale-105 transition-transform duration-700 z-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter">
                        <path d="M50 10 L15 75 h70 Z" />
                        <path d="M35 10 L5 75 h30 M65 10 L95 75 h-30" />
                        <path d="M25 45 L50 85 L75 45" />
                    </svg>
                    <span className="relative z-10 text-xl md:text-2xl font-serif tracking-[0.25em] font-black bg-clip-text text-transparent bg-dark-gradient uppercase">
                        Zeray Gold
                    </span>
                </Link>
                <div className="w-24" />
            </header>

            {/* HERO */}
            <section className="relative bg-zinc-950 py-20 md:py-32 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
                <motion.div className="relative z-10 max-w-2xl mx-auto px-6"
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="text-[#d4af37] text-[10px] tracking-[0.45em] uppercase font-bold mb-6">Zeray Gold</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">Referanslarımız</h1>
                    <div className="w-12 h-px bg-[#d4af37]/50 mx-auto mb-6" />
                    <p className="text-zinc-400 text-sm font-light leading-relaxed tracking-wide">
                        Güvenilir iş ortaklarımız ve referans noktalarımız.
                        <br />Yıllardır süren kaliteli hizmetimizin kanıtı.
                    </p>
                </motion.div>
            </section>

            {/* REFERENCES GRID */}
            <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
                <div className="text-center mb-16">
                    <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Güvenilir İş Ortaklarımız</p>
                    <h2 className="font-serif text-2xl md:text-4xl text-zinc-900 mb-4 tracking-wide">Referans Mağazalarımız</h2>
                    <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
                    {references.map((ref, index) => (
                        <motion.div
                            key={ref.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Circular Image */}
                            <div className="relative w-52 h-52 md:w-60 md:h-60 mb-8">
                                {/* Gold border ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/30 group-hover:border-[#d4af37]/70 transition-colors duration-500" />
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[0_0_40px_rgba(212,175,55,0.2)]" />
                                {/* Image */}
                                <div className="absolute inset-[4px] rounded-full overflow-hidden">
                                    <img
                                        src={ref.image}
                                        alt={ref.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Subtle overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>

                            {/* Store Name */}
                            <h3 className="font-serif text-lg md:text-xl text-zinc-900 mb-3 tracking-wider uppercase">
                                {ref.name}
                            </h3>

                            {/* Divider */}
                            <div className="w-8 h-[1px] bg-[#d4af37]/40 mb-4" />

                            {/* Location + Address */}
                            <a
                                href={ref.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 text-zinc-500 hover:text-[#d4af37] transition-colors duration-300 group/link"
                            >
                                {/* Location Pin Icon */}
                                <svg
                                    className="w-4 h-4 mt-0.5 text-[#d4af37] flex-shrink-0 group-hover/link:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="text-xs font-light leading-relaxed tracking-wide">
                                    {ref.address}
                                </span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-zinc-950 py-16 text-center border-t border-[#d4af37]/20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-xl mx-auto px-6"
                >
                    <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Siz de Ailemize Katılın</p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-6 leading-relaxed">
                        Referans <span className="text-[#d4af37]">Ortağımız</span> Olmak İster misiniz?
                    </h3>
                    <Link
                        href="/iletisim"
                        className="inline-block bg-gradient-to-r from-[#AA8C2C] via-[#D4AF37] to-[#AA8C2C] text-white px-10 py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-500 hover:scale-105"
                    >
                        BİZE ULAŞIN
                    </Link>
                </motion.div>
            </section>

            <GlobalFooter />
        </div>
    );
}
