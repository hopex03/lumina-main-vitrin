'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            {/* TOP BAR */}
            <div className="bg-black text-[#d4af37] text-[10px] text-center py-2.5 tracking-[0.35em] font-bold uppercase border-b border-[#d4af37]/20">
                Zeray Gold · Sektörel Birleşik Güç
            </div>

            {/* HEADER */}
            <header className="py-5 px-8 md:px-16 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
                <Link href="/" className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 hover:text-[#d4af37] transition-colors uppercase flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Ana Sayfa
                </Link>
                <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[0.35em] text-black">LUMINA</Link>
                <div className="w-24" />
            </header>

            {/* HERO IMAGE SECTION */}
            <section className="relative h-[40vh] md:h-[50vh] bg-zinc-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6"
                >
                    <p className="text-[#d4af37] text-[10px] tracking-[0.45em] uppercase font-bold mb-4">Hakkımızda</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-white tracking-widest uppercase">Biz Kimiz?</h1>
                </motion.div>
            </section>

            {/* CONTENT */}
            <main className="max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-12"
                >
                    <div className="text-center max-w-3xl mx-auto">
                        <p className="text-lg md:text-xl text-zinc-800 font-serif leading-relaxed">
                            Zeray Gold, mücevherat sektörünün önde gelen üç büyük tedarikçisinin operasyonel güçlerini ve stok kabiliyetlerini tek bir dijital platformda birleştiren stratejik bir oluşumdur. Bireysel ustalığın sınırlarını aşarak, sektörel bir ekosistem inşa etme vizyonuyla yola çıkan Zeray Gold, üç farklı mücevherat odağının toplam sermayesini ve zanaat birikimini temsil eder.
                        </p>
                        <div className="w-16 h-px bg-[#d4af37]/50 mx-auto my-10" />
                        <p className="text-sm text-zinc-500 font-light leading-relaxed">
                            Bu yapı, pazarın dinamiklerini belirleyen yüksek montanlı stok gücünü, modern e-ticaret disipliniyle birleştirerek nihai tüketiciye ulaştırır. Zeray Gold bünyesinde sunulan her bir parça, üç farklı atölyenin ortak kalite denetim süreçlerinden geçmekte ve kurumsal standartlarımıza göre optimize edilmektedir.
                        </p>
                    </div>

                    <div className="mt-20">
                        <h2 className="text-center text-2xl font-serif tracking-widest uppercase mb-12 text-zinc-900">Kurumsal Sütunlarımız</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Column 1 */}
                            <div className="bg-zinc-50 p-8 border border-zinc-100 hover:border-[#d4af37]/30 transition-colors duration-500 text-center">
                                <div className="w-12 h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900 mb-4">Stratejik Stok Yönetimi</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                                    Üç ana tedarikçinin Altın, Pırlanta ve Saat kategorilerindeki geniş ürün gamı, kesintisiz ürün çeşitliliği için tek bir merkezden yönetilir.
                                </p>
                            </div>

                            {/* Column 2 */}
                            <div className="bg-zinc-50 p-8 border border-zinc-100 hover:border-[#d4af37]/30 transition-colors duration-500 text-center">
                                <div className="w-12 h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900 mb-4">Mali ve Lojistik Güvence</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                                    Tüm operasyonlarımız şeffaflık ilkesine dayanır. Sevkiyatlar, adınıza faturalandırılmış ve tam kapsamlı sigorta poliçeleriyle koruma altına alınmış şekilde ulaştırılır.
                                </p>
                            </div>

                            {/* Column 3 */}
                            <div className="bg-zinc-50 p-8 border border-zinc-100 hover:border-[#d4af37]/30 transition-colors duration-500 text-center">
                                <div className="w-12 h-12 rounded-full border border-[#d4af37]/50 flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900 mb-4">Denetlenmiş Zanaat</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                                    Geleneksel kuyumculuk tecrübesi, Zeray Gold'un modern ve tavizsiz kalite kontrol mekanizmalarıyla tescillenmiştir.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* FOOTER MINI */}
            <footer className="bg-zinc-950 border-t border-zinc-800 py-8 text-center mt-12">
                <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">© 2026 <span className="text-[#d4af37]/70">LUMINA</span> JEWELRY</p>
            </footer>
        </div>
    );
}
