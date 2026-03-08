'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setError('Lütfen zorunlu alanları doldurunuz.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const { error: dbErr } = await supabase.from('messages').insert([{
                name: form.name,
                email: form.email,
                phone: form.phone || null,
                subject: form.subject || 'Genel',
                message: form.message,
                is_read: false,
                status: 'unread',
                created_at: new Date().toISOString(),
            }]);
            if (dbErr) throw dbErr;
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err: any) {
            setError('Mesajınız gönderilemedi. Lütfen tekrar deneyin.');
        } finally {
            setSubmitting(false);
        }
    };

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
                <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[0.35em] text-black">LUMINA</Link>
                <div className="w-24" />
            </header>

            {/* HERO */}
            <section className="relative bg-zinc-950 py-20 md:py-32 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f7ca1523?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
                <motion.div className="relative z-10 max-w-2xl mx-auto px-6"
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <p className="text-[#d4af37] text-[10px] tracking-[0.45em] uppercase font-bold mb-6">Zeray Gold</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">Bize Ulaşın</h1>
                    <div className="w-12 h-px bg-[#d4af37]/50 mx-auto mb-6" />
                    <p className="text-zinc-400 text-sm font-light leading-relaxed tracking-wide">
                        Sorularınız, özel siparişleriniz veya geri bildirimleriniz için buradayız.
                        En geç 24 saat içinde size dönüş yapıyoruz.
                    </p>
                </motion.div>
            </section>

            {/* MAIN GRID */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 grid grid-cols-1 lg:grid-cols-5 gap-16">

                {/* LEFT — Info */}
                <motion.div className="lg:col-span-2 flex flex-col gap-10"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                    <div>
                        <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase font-bold mb-4">İletişim Bilgileri</p>
                        <div className="space-y-6">
                            {[
                                { label: 'E-Posta', value: 'info@luminajewelry.com', href: 'mailto:info@luminajewelry.com' },
                                { label: 'Telefon', value: '+90 (532) 000 00 00', href: 'tel:+905320000000' },
                                { label: 'Adres', value: 'İstanbul, Türkiye', href: '#' },
                            ].map(item => (
                                <div key={item.label}>
                                    <p className="text-[9px] text-[#d4af37] font-bold tracking-[0.3em] uppercase mb-1">{item.label}</p>
                                    <a href={item.href} className="text-zinc-700 text-sm font-light hover:text-[#d4af37] transition-colors">{item.value}</a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-10">
                        <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase font-bold mb-6">Çalışma Saatleri</p>
                        <div className="space-y-3 text-sm text-zinc-500 font-light">
                            <div className="flex justify-between"><span>Pazartesi – Cuma</span><span className="text-zinc-800 font-medium">09:00 – 18:00</span></div>
                            <div className="flex justify-between"><span>Cumartesi</span><span className="text-zinc-800 font-medium">10:00 – 15:00</span></div>
                            <div className="flex justify-between"><span>Pazar</span><span className="text-zinc-400">Kapalı</span></div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-6 border border-[#d4af37]/20">
                        <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Özel Sipariş</p>
                        <p className="text-zinc-400 text-xs font-light leading-relaxed">
                            İsminizi ya da özel bir tarihi taşıyan kişiselleştirilmiş altın takılarınızı birlikte tasarlayabiliriz.
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT — Form */}
                <motion.div className="lg:col-span-3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div key="success"
                                className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                <motion.div
                                    className="w-16 h-16 rounded-full border-2 border-[#d4af37] flex items-center justify-center"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                                    <svg className="w-7 h-7 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                                <div>
                                    <h2 className="font-serif text-2xl text-zinc-900 mb-4 tracking-wide uppercase">Talebiniz Kayıt Altına Alınmıştır</h2>
                                    <p className="text-zinc-500 text-sm font-light leading-relaxed mt-4">
                                        Değerli müşterimiz, iletmiş olduğunuz talep kurumumuzca işleme alınmış olup, <br />
                                        <b className="text-zinc-700 font-semibold tracking-wider">support@zeraygold.com.tr</b> üzerinden tarafınıza en kısa sürede resmi geri dönüş sağlanacaktır.
                                    </p>
                                </div>
                                <button onClick={() => setSuccess(false)} className="text-[10px] font-bold tracking-[0.25em] uppercase border-b border-zinc-800 pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors">
                                    Yeni Mesaj Gönder
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">Ad Soyad *</label>
                                        <input
                                            type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm outline-none focus:border-[#d4af37] focus:bg-white transition-all font-light"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">E-Posta *</label>
                                        <input
                                            type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="ornek@email.com"
                                            className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm outline-none focus:border-[#d4af37] focus:bg-white transition-all font-light"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">Telefon</label>
                                        <input
                                            type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+90 5XX XXX XX XX"
                                            className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm outline-none focus:border-[#d4af37] focus:bg-white transition-all font-light"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">Konu</label>
                                        <select
                                            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm outline-none focus:border-[#d4af37] transition-all font-light text-zinc-600"
                                        >
                                            <option value="">Konu Seçin</option>
                                            <option value="Sipariş">Sipariş Hakkında</option>
                                            <option value="Ürün">Ürün Bilgisi</option>
                                            <option value="İade">İade / Değişim</option>
                                            <option value="Özel Sipariş">Özel Sipariş</option>
                                            <option value="Diğer">Diğer</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">Mesajınız *</label>
                                    <textarea
                                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                        rows={6} placeholder="Mesajınızı buraya yazın..."
                                        className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm outline-none focus:border-[#d4af37] focus:bg-white transition-all resize-none font-light"
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 text-center">{error}</div>
                                )}
                                <button
                                    type="submit" disabled={submitting}
                                    className="w-full bg-gradient-to-r from-zinc-900 to-black text-white py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:from-[#b8962e] hover:to-[#d4af37] transition-all duration-500 disabled:opacity-50"
                                >
                                    {submitting ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
                                </button>
                                <p className="text-[9px] text-zinc-400 text-center tracking-widest">* Zorunlu alanlar</p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </section>

            {/* FOOTER MINI */}
            <footer className="bg-zinc-950 border-t border-zinc-800 py-8 text-center">
                <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">© 2026 <span className="text-[#d4af37]/70">LUMINA</span> JEWELRY</p>
            </footer>
        </div>
    );
}
