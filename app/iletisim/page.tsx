'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Mesajınız bizimle paylaşıldı. Teşekkür ederiz.");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* TEPEDEKİ SİYAH/ALTIN BAR */}
            <div className="bg-[#cc0000] text-white text-[10px] md:text-[11px] text-center py-2.5 tracking-[0.2em] font-bold uppercase">
                Online Özel: Ücretsiz & Sigortalı Teslimat Özel Kutusunda
            </div>

            {/* HEADER */}
            <header className="py-6 px-6 md:px-12 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-50">
                <Link
                    href="/"
                    className="text-xs font-bold tracking-widest text-[#cc0000] hover:text-black transition-colors flex items-center gap-2 uppercase"
                >
                    <span>&larr;</span> Vitrine Dön
                </Link>
                <div className="text-3xl md:text-5xl font-serif tracking-[0.2em] text-center text-dark">
                    <Link href="/">LUMINA</Link>
                </div>
                <div className="w-24"></div> {/* Dengeleme için */}
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif text-center mb-16 text-[#111]">Bize Ulaşın</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

                    {/* SOL: İLETİŞİM FORMU */}
                    <div>
                        <div className="mb-8">
                            <Link href="#" className="text-[#cc0000] text-[13px] underline hover:text-black transition-colors">
                                Sipariş Takibi için tıklayın
                            </Link>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="border-b border-gray-300 pb-2">
                                <input
                                    type="text"
                                    placeholder="Adınız ve Soyadınız"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="border-b border-gray-300 pb-2">
                                <input
                                    type="email"
                                    placeholder="E posta"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="border-b border-gray-300 pb-2">
                                <input
                                    type="tel"
                                    placeholder="Telefon*"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                                    required
                                />
                            </div>

                            <div className="border-b border-gray-300 pb-2 relative">
                                <select
                                    className="w-full text-[13px] text-gray-700 outline-none appearance-none bg-transparent cursor-pointer"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Konu Seçiniz</option>
                                    <option value="bilgi">Bilgi Alma</option>
                                    <option value="oneri">Öneri & Şikayet</option>
                                    <option value="diger">Diğer</option>
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                                    ▼
                                </div>
                            </div>

                            <div className="border-b border-gray-300 pb-2 mt-4">
                                <textarea
                                    placeholder="Mesajınız"
                                    rows={2}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full text-[13px] text-gray-700 outline-none placeholder-gray-400 bg-transparent resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full py-4 text-sm font-bold tracking-widest uppercase transition-colors rounded-[4px] bg-[#f64747] hover:bg-[#cc0000] text-white cursor-pointer"
                            >
                                Gönder
                            </button>
                        </form>
                    </div>

                    {/* SAĞ: ŞİRKET BİLGİLERİ (MOCK DATA) */}
                    <div className="flex flex-col gap-8 text-[14px] text-gray-700 pt-2 md:pt-14 leading-relaxed font-light">
                        <div>
                            <h2 className="text-[22px] font-normal text-black mb-4">Lumina</h2>
                            <p>Yenibosna Merkez Mah. Kuyumcukent Sokak No:34/40</p>
                            <p>Kat:5 Elmas Kule Bahçelievler İstanbul</p>
                        </div>

                        <div>
                            <p>MERSİS No: 0997070336200017</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="flex items-center gap-2 font-normal text-black">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766 0 1.018.265 2.01.768 2.885l-.813 2.97 3.038-.797c.844.462 1.802.705 2.775.705 3.18 0 5.765-2.585 5.767-5.765 0-3.179-2.586-5.765-5.767-5.765zm0 10.155c-.863 0-1.708-.232-2.448-.671l-.175-.104-1.815.476.484-1.768-.114-.182a4.629 4.629 0 01-.715-2.484c0-2.548 2.073-4.62 4.621-4.62 2.549 0 4.621 2.073 4.621 4.621 0 2.549-2.073 4.62-4.62 4.62zm2.536-3.468c-.139-.07-8.23-4.103-8.36-4.195-.129-.093-.223-.147-.317-.008-.095.14-.325.42-.399.505-.075.085-.15.097-.289.027A10.165 10.165 0 018.5 7.828c-.854-.852-1.928-1.579-2.094-1.782-.165-.203-.018-.313.052-.383.063-.063.14-.163.21-.245.07-.08.093-.139.14-.233.047-.093.023-.174-.012-.244-.035-.07-.317-.765-.434-1.047-.114-.275-.23-.238-.317-.243-.082-.005-.175-.005-.269-.005-.094 0-.246.035-.375.174-.129.14-0.492.481-0.492 1.173s.504 1.36.575 1.453c.07.094 0.99 1.512 2.406 2.087 0.337.137.601.219.807.28.341.109.652.093.896.056.273-.041.838-.342.956-.673.117-.331.117-.614.082-.673-.035-.059-.129-.094-.268-.164z" />
                                </svg>
                                Whatsapp Hattı: 905529889396
                            </p>
                            <p className="text-[13px] text-gray-500 ml-7">(Pazartesi - Cuma 09:00-18:00 saatleri arası)</p>
                        </div>

                        <div>
                            <Link href="mailto:info@luminapirlanta.com" className="text-[#cc0000] underline hover:text-black transition-colors">
                                info@luminapirlanta.com
                            </Link>
                        </div>

                    </div>
                </div>
            </main>

            {/* FOOTER BASİT VERSİYON */}
            <footer className="border-t border-gray-100 py-8 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
                    © 2026 LUMINA JEWELRY. TÜM HAKLARI SAKLIDIR.
                </div>
            </footer>
        </div>
    );
}
