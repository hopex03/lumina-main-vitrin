'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            {/* TOP BAR */}
            <div className="bg-black text-[#d4af37] text-[10px] text-center py-2.5 tracking-[0.35em] font-bold uppercase border-b border-[#d4af37]/20">
                Zeray Gold · Kurumsal Güvence
            </div>

            {/* HEADER */}
            <header className="py-5 px-8 md:px-16 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
                <Link href="/" className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 hover:text-[#d4af37] transition-colors uppercase flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Ana Sayfa
                </Link>
                <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[0.35em] text-black">ZERAY GOLD</Link>
                <div className="w-24" />
            </header>

            {/* CONTENT */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl font-serif tracking-widest text-center mb-12 uppercase">İptal ve İade Şartları</h1>

                    <div className="space-y-8 text-sm text-zinc-600 leading-relaxed font-light">
                        <section>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-900 uppercase mb-4">Genel İade Koşulları</h2>
                            <p>
                                zeraygold.com.tr üzerinden verdiğiniz siparişleri veya ürünleri iptal ve iade etmek için <strong>0850 XXX XX XX</strong> numaralı Sanal Mağaza Destek Hattımıza, <strong>+90 (532) 000 00 00</strong> WhatsApp hattımıza veya <strong>info@zeraygold.com.tr</strong> e-posta adresine talebinizi bildirmeniz gerekmektedir. Burada belirtilen tüm şartlar, yalnızca zeraygold.com.tr üzerinden satın alınan ürünler için geçerlidir. Paketin merkez ofisimize gelişi sırasındaki sorumluluk tüketiciye aittir. Ürün tarafımıza ulaştıktan sonra, uzmanlarımız tarafından yapılacak incelemelerin ardından iadesi kabul edildiğinde, ürünün tam bedeli tarafınıza iade edilecektir.
                            </p>
                            <p className="mt-4">
                                Ürün iadesi işlemlerinde, 6502 Sayılı Tüketicinin Korunması Hakkındaki Kanun hükümleri uygulanır. Ürün müşteriye ulaştıktan sonra <strong>14 gün içerisinde</strong> cayma hakkı kullanılabilir. Cayma hakkının kullanılabilmesi için müşterinin bu süre içinde tarafımıza bildirimde bulunması ve ürünün kesinlikle kullanılmamış (ambalajı vb.), hasar görmemiş olması şarttır.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-900 uppercase mb-4">Cayma Hakkı</h2>
                            <p>
                                Müşterinin özel istek ve talepleri uyarınca üretilen veya üzerinde değişiklik ya da ilaveler yapılarak kişiye özel hâle getirilen ürünlerde cayma hakkı kullanılamaz. Bu bağlamda, sipariş sırasında belirtilen parmak ölçüsüne göre özel olarak ayarlanan tüm yüzükler, üzerine veya içine lazer kazıma ile yazı yazılan / isim işlenen takılar ve tamamen kişisel isteklere göre tasarlanan <strong>Zeray Gold Özel Üretim</strong> mücevherler cayma hakkı dışındadır.
                            </p>
                            <p className="mt-4">
                                Standart ürünlerimizin iadesinde ise; ürünün size gönderildiği şekliyle (orijinal kutusu, güvenlik mührü, faturası, irsaliyesi, pırlanta/altın sertifikası ve diğer tüm evrak materyalleriyle birlikte) eksiksiz ve hasarsız olarak tarafımıza kargolanması gerekmektedir. Eksik gönderilen veya iade prosedürüne uymayan paketler teslim alınmayacaktır. Fatura aslı gönderilmeyen durumlarda KDV ve diğer yasal yükümlülükler iade edilemez.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-900 uppercase mb-4">İptal İşlemleri</h2>
                            <p>
                                Tıpkı cayma hakkında olduğu gibi, kişiye özel spesifik ölçülerde ve talepler doğrultusunda üretime girmiş siparişlerin iptali yapılamamaktadır. Siparişiniz henüz üretime veya kargoya hazırlanma aşamasına geçmediyse, müşteri hizmetlerimize hızlıca ulaşarak standart ürünlerinizin siparişini ücretsiz olarak iptal edebilirsiniz.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-zinc-900 uppercase mb-4">Değerlendirme ve Geri Ödeme Süreci</h2>
                            <p>
                                Tarafımıza ulaşan iadeler, Zeray Gold uzman ekspertiz ekibi tarafından dikkatle incelenir. İade şartlarının (kullanılmamış olma, eksiksiz belge ve kutu içeriği) eksiksiz şekilde yerine getirildiği onaylandığında, 14 gün içerisinde ürün bedeli sipariş anında kullandığınız ödeme yöntemine (Kredi Kartı veya Havale/EFT) sadık kalınarak iade edilir. İadenin kredi kartı ekstrenize yansıma süresi, bankanızın işlem yoğunluğuna bağlı olarak 1 ile 4 hafta arasında değişebilir.
                            </p>
                        </section>

                        <section className="bg-zinc-50 p-6 border border-zinc-100 mt-8">
                            <h2 className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] uppercase mb-4">İade ve Teslimat Adresimiz</h2>
                            <ul className="space-y-2 text-sm text-zinc-800">
                                <li><strong>Kurum:</strong> Zeray Gold Sanal Mağaza ve Operasyon Merkezi</li>
                                <li><strong>Telefon:</strong> 0850 XXX XX XX</li>
                                <li><strong>E-Posta:</strong> info@zeraygold.com.tr</li>
                                <li><strong>Adres:</strong> Nişantaşı Merkez Mah. Teşvikiye Cad. No:X Şişli / İstanbul (Örnektir, Kargo Gönderimi için Yetkili Onayı Alınmalıdır)</li>
                            </ul>
                            <p className="text-xs text-zinc-500 mt-4 font-light gap-2 flex items-center">
                                <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Lütfen kargo gönderimi sağlamadan önce Destek Hattımız ile iletişime geçerek yetki ve onay kodunuzu almayı unutmayınız.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            {/* FOOTER MINI */}
            <footer className="bg-zinc-950 border-t border-zinc-800 py-8 text-center mt-20">
                <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">© 2026 <span className="text-[#d4af37]/70">ZERAY GOLD</span> JEWELRY</p>
            </footer>
        </div>
    );
}
