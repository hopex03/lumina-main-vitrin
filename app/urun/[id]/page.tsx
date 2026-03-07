'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; // YOL HATASI DÜZELTİLDİ!

const formatPrice = (price: any) =>
  Number(price).toLocaleString('tr-TR') + ' ₺';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ozellikler'); // 'ozellikler' veya 'hikaye'
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setProduct(data);
        setActiveImage(data.image);
      }
      setLoading(false);
    };

    if (params.id) fetchProductDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-serif text-xl tracking-[0.2em] animate-pulse">
        LUMINA YÜKLENİYOR...
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    const storedCart = JSON.parse(localStorage.getItem('lumina_cart') || '[]');
    const existing = storedCart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('lumina_cart', JSON.stringify(storedCart));
    alert('Ürün başarıyla sepetinize eklendi!');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ürün bulunamadı.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ÜST BİLGİ BARI & HEADER */}
      <div className="bg-[#cc0000] text-white text-[10px] text-center py-2.5 tracking-[0.2em] font-bold uppercase">
        Online Özel Ücretsiz ve Sigortalı Teslimat
      </div>
      <header className="py-6 px-10 border-b border-gray-100 flex justify-between items-center">
        <Link
          href="/"
          className="text-xs font-bold tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          ← VİTRİNE DÖN
        </Link>
        <Link
          href="/"
          className="text-3xl font-serif tracking-[0.3em] text-black"
        >
          LUMINA
        </Link>
        <div className="w-20"></div> {/* Denge için boşluk */}
      </header>

      {/* YOL GÖSTERİCİ (Breadcrumb) */}
      <div className="max-w-6xl mx-auto px-6 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        <Link href="/" className="hover:text-black">
          Ana Sayfa
        </Link>{' '}
        <span className="mx-2">/</span>
        <span className="hover:text-black cursor-pointer">
          {product.category}
        </span>{' '}
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* ANA ÜRÜN BÖLÜMÜ */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* SOL: GÖRSEL GALERİSİ */}
        <div className="sticky top-10">
          <div className="bg-[#f9f9f9] p-4 md:p-10 aspect-square flex items-center justify-center relative mb-4">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-700"
            />
            {product.sale_price && (
              <span className="absolute top-6 left-6 z-10 bg-[#cc0000] text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
                İNDİRİM
              </span>
            )}

            {/* FAVORİ İKONU (WİSHLİST PDP) */}
            <button
              onClick={() => {
                let stored = JSON.parse(localStorage.getItem('lumina_wishlist') || '[]');
                const exists = stored.some((w: any) => w.id === product.id);
                if (exists) {
                  stored = stored.filter((w: any) => w.id !== product.id);
                } else {
                  stored.push(product);
                }
                localStorage.setItem('lumina_wishlist', JSON.stringify(stored));
                alert(exists ? 'Ürün favorilerden çıkarıldı.' : 'Ürün favorilere eklendi!');
              }}
              className="absolute top-6 right-6 z-20 text-gray-300 hover:text-red-500 transition-colors drop-shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:fill-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* KÜÇÜK GÖRSELLER (THUMBNAILS) */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[product.image, product.image2, product.image3].filter(Boolean).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img as string)}
                className={`w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#f9f9f9] border transition-all ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img as string} className="w-full h-full object-cover mix-blend-multiply p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* SAĞ: ÜRÜN DETAYLARI VE SATIN ALMA */}
        <div className="flex flex-col pt-4">
          <h1 className="text-3xl md:text-4xl font-serif text-black mb-2">
            {product.name}
          </h1>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-8">
            Ürün Kodu: {product.sku}
          </p>

          <div className="mb-10 border-b border-gray-100 pb-8">
            {product.sale_price ? (
              <div className="flex flex-col">
                <del className="text-lg text-gray-400 mb-1">
                  {formatPrice(product.price)}
                </del>
                <span className="text-4xl text-[#cc0000] font-bold tracking-tight">
                  {formatPrice(product.sale_price)}
                </span>
              </div>
            ) : (
              <span className="text-4xl text-black font-bold tracking-tight">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* SİPARİŞ BUTONU */}
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#cc0000] transition-colors shadow-2xl mb-4"
            >
              SEPETE EKLE
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-5 text-xs font-bold tracking-[0.2em] uppercase cursor-not-allowed mb-4"
            >
              ŞU AN STOKTA YOK
            </button>
          )}

          {/* GÜVENLİK İKONLARI */}
          <div className="grid grid-cols-3 gap-2 mt-6 border-t border-gray-100 pt-6">
            <div className="text-center">
              <div className="text-xl mb-1">🛡️</div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                Sigortalı Kargo
              </p>
            </div>
            <div className="text-center border-l border-r border-gray-100">
              <div className="text-xl mb-1">✨</div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                Sertifikalı Ürün
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">💎</div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                Bakım Garantisi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ALT SEKMELER: SERTİFİKA VE HİKAYE (ZEN Tarzı) */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <div className="flex justify-center gap-12 border-b border-gray-200 mb-10">
          <button
            onClick={() => setActiveTab('ozellikler')}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'ozellikler'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 hover:text-black'
              }`}
          >
            Sertifika & Özellikler
          </button>
          <button
            onClick={() => setActiveTab('hikaye')}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'hikaye'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 hover:text-black'
              }`}
          >
            Ürün Açıklaması
          </button>
        </div>

        {/* 1. SEKME: ÜRÜN ÖZELLİKLERİ */}
        {activeTab === 'ozellikler' && (
          <div className="animate-fade-in">
            <div className="mb-0">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#cc0000] mb-4 border-l-4 border-[#cc0000] pl-3">
                Ürün Özellikleri
              </h3>
              <p className="text-gray-600 text-sm ml-4 mb-2 leading-relaxed">
                {product.metal || 'Belirtilmemiş'}
              </p>
              {product.gram && (
                <p className="text-gray-600 text-sm ml-4 mb-4 leading-relaxed">
                  {product.gram} gram
                </p>
              )}
              <div className="ml-4 text-xs text-gray-400 italic font-serif mt-4">
                *Tüm ürünlerimiz özenle hazırlanır, siparişinize özel faturalandırılıp sigortalı kargo ile tarafınıza güvenle teslim edilir.
              </div>
            </div>
          </div>
        )}

        {/* 2. SEKME: HİKAYE / AÇIKLAMA */}
        {activeTab === 'hikaye' && (
          <div className="animate-fade-in text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
            {product.description ||
              'Bu eşsiz parçanın hikayesi çok yakında eklenecektir.'}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-10 text-center text-[10px] text-gray-400 tracking-widest border-t">
        © 2026 LUMINA JEWELRY. TÜM HAKLARI SAKLIDIR.
      </footer>
    </div>
  );
}
