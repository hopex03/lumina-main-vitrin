"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ZerayGoldVitrin() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const categories = [
        {
            id: "yuzuk",
            category: "YÜZÜK",
            title: "FİRENBİR Filigran Ateş Yüzüğü",
            image: "/placeholder-yuzuk.png"
        },
        {
            id: "bilezik",
            category: "BİLEZİK",
            title: "TRABZON HASIRI Anadolu Dokuma Bilezik",
            image: "/placeholder-bilezik.png"
        },
        {
            id: "kolye",
            category: "KOLYE",
            title: "LIRA REŞAT Kolye",
            image: "/placeholder-kolye.png"
        },
        {
            id: "kupe",
            category: "KÜPE",
            title: "Geleneksel Çiçek Küpe",
            image: "/placeholder-kupe.png"
        },
        {
            id: "set",
            category: "SET",
            title: "Giresun Gelin Seti",
            image: "/placeholder-set.png"
        },
        {
            id: "zincir",
            category: "ZİNCİR",
            title: "Sarmal Halat Zincir",
            image: "/placeholder-zincir.png"
        }
    ];

    return (
        <div className="relative min-h-screen bg-[#1a1a1a] overflow-hidden text-[#E1C699] font-sans selection:bg-[#E1C699] selection:text-black">
            {/* Background - Smooth Dark Grey Velvet & Champagne Bokeh */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Velvet Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#181818] via-[#222222] to-[#111111] opacity-90" />

                {/* Subtle Velvet Texture Overlay (Noise) */}
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}
                />

                {/* Champagne Bokeh Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#E1C699] rounded-full blur-[120px] mix-blend-screen opacity-30"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -top-20 right-10 w-[400px] h-[400px] bg-[#F7E7CE] rounded-full blur-[140px] mix-blend-screen opacity-20"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[150px] mix-blend-screen opacity-10"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 pb-40">

                {/* Premium Header */}
                <div className="text-center mb-24 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="inline-block"
                    >
                        <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F7E7CE] to-[#AA7C11] uppercase pb-2">
                            Zeray Gold
                        </h1>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#E1C699] to-transparent mt-4 opacity-50" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-xl tracking-widest font-light text-[#C4A478] uppercase"
                    >
                        Özel Koleksiyon Vitrini
                    </motion.p>
                </div>

                {/* Categories Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                    {categories.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group relative flex flex-col items-center"
                        >
                            {/* Product Pedestal / Velvet Spot */}
                            <div className="relative w-full aspect-square max-w-[320px] rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10 flex items-center justify-center p-8 border border-[#E1C699]/10 group-hover:border-[#E1C699]/40 transition-colors duration-500 overflow-hidden">

                                {/* Spotlight effect */}
                                <div className="absolute top-0 right-1/4 w-3/4 h-3/4 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />

                                {/* Imaginary specific light hitting the jewelry to show texture */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#F7E7CE]/5 to-[#F7E7CE]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* We cannot actually put the AI cut image, so we put a beautiful metallic placeholder that symbolizes the extracted product */}
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                                >
                                    {/* Placeholder content while missing image_0.png crops */}
                                    <div className="text-center opacity-40">
                                        <div className="text-4xl text-[#D4AF37] mb-2">{item.category}</div>
                                        <div className="text-xs tracking-widest">GÖRSELE HAZIR</div>
                                    </div>
                                </motion.div>

                                {/* Stage shadow */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/60 blur-md rounded-[100%]" />
                            </div>

                            {/* Bronze Plaque */}
                            <div className="relative flex flex-col items-center bg-gradient-to-b from-[#8C6D46] via-[#B89961] to-[#604928] p-[2px] rounded shadow-xl">
                                <div className="bg-[#1f1b18] px-8 py-4 text-center rounded-[2px] w-full min-w-[280px]">

                                    {/* Screws for plaque */}
                                    <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#8C6D46] shadow-sm transform -rotate-45" />
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#8C6D46] shadow-sm transform rotate-45" />
                                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#8C6D46] shadow-sm transform rotate-12" />
                                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE0B2] to-[#8C6D46] shadow-sm transform -rotate-12" />

                                    <p className="text-[10px] md:text-xs text-[#E1C699] tracking-[0.3em] font-medium opacity-80 mb-2">
                                        {item.category}
                                    </p>

                                    <div className="h-[1px] w-12 mx-auto bg-[#8C6D46] mb-3 opacity-50" />

                                    <h3 className="text-sm md:text-base font-serif tracking-widest text-[#F7E7CE] leading-relaxed max-w-[220px]">
                                        {item.title}
                                    </h3>

                                    {/* Gram Alanı */}
                                    <div className="mt-4 flex items-center justify-center space-x-2">
                                        <span className="text-xs font-light text-[#E1C699]/70 tracking-widest">AĞIRLIK:</span>
                                        <span className="text-sm font-semibold text-[#D4AF37] border-b border-[#D4AF37]/30 px-2 pb-0.5">
                                            (........)g
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
