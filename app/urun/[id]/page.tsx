'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import WhatsAppButton from '@/components/WhatsAppButton';

const formatPrice = (price: any) =>
  Number(price).toLocaleString('tr-TR') + ' ₺';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ozellikler');
  const [activeImage, setActiveImage] = useState<string>('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setProduct(data);
        setActiveImage(data.image);
        const wl = JSON.parse(localStorage.getItem('lumina_wishlist') || '[]');
        setWishlistActive(wl.some((w: any) => w.id === data.id));
        setWishlistItems(wl);
        // sync cart from localStorage
        setCart(JSON.parse(localStorage.getItem('lumina_cart') || '[]'));

        // Fetch related products: same category, different id
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(8);
        if (related && related.length > 0) {
          setRelatedProducts(related);
        } else {
          // Fallback: any other products
          const { data: fallback } = await supabase
            .from('products')
            .select('*')
            .neq('id', data.id)
            .limit(8);
          setRelatedProducts(fallback || []);
        }
      }
      setLoading(false);
    };
    if (params.id) fetchProductDetails();
  }, [params.id]);

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
    setCart(storedCart);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      setIsCartOpen(true); // open mini-cart after button animation
    }, 900);
  };

  const removeFromCart = (id: number) => {
    const updated = cart.filter((item: any) => item.id !== id);
    setCart(updated);
    localStorage.setItem('lumina_cart', JSON.stringify(updated));
  };

  const cartTotal = cart.reduce((sum: number, item: any) => {
    const p = item.sale_price ? Number(item.sale_price) : Number(item.price);
    return sum + p * item.quantity;
  }, 0);

  const toggleWishlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!product) return;
    let stored = JSON.parse(localStorage.getItem('lumina_wishlist') || '[]');
    const exists = stored.some((w: any) => w.id === product.id);
    if (exists) {
      stored = stored.filter((w: any) => w.id !== product.id);
    } else {
      stored.push(product);
    }
    localStorage.setItem('lumina_wishlist', JSON.stringify(stored));
    setWishlistActive(!exists);
    setWishlistItems(stored);
  };

  const cartCount = cart.reduce((s: number, i: any) => s + i.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
        <motion.div
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
        <p className="font-serif text-xl tracking-[0.4em] text-white/60 uppercase">ZERAY GOLD</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <p className="font-serif text-2xl text-zinc-400">Ürün bulunamadı.</p>
        <Link href="/" className="text-[10px] font-bold tracking-[0.3em] uppercase border-b border-black pb-1 hover:text-gold transition-colors">
          Vitrine Dön
        </Link>
      </div>
    );
  }

  const images = [product.image, product.image2, product.image3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ---- MİNİ CART DRAWER ---- */}
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl flex flex-col border-l border-[#d4af37]/20 transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 flex justify-between items-center border-b border-zinc-100 bg-zinc-50">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <h2 className="font-serif tracking-[0.2em] text-lg text-black">ALIŞVERİŞ SEPETİ</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-3xl text-zinc-400 hover:text-[#d4af37] transition-colors font-light">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center text-zinc-400 mt-24 flex flex-col items-center gap-4">
                <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <p className="text-xs tracking-widest uppercase font-light">Sepetiniz boş.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-[10px] font-bold tracking-[0.2em] border-b border-zinc-800 pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors uppercase">Koleksiyona Dön</button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex gap-4 border-b border-zinc-100 pb-6">
                    <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-800 leading-snug">{item.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-serif text-sm text-black">
                          {(item.sale_price ? Number(item.sale_price) : Number(item.price)).toLocaleString('tr-TR')} ₺
                          {item.quantity > 1 && <span className="text-zinc-400 text-xs ml-1">×{item.quantity}</span>}
                        </span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[9px] text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest">Kaldır</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 bg-zinc-50 border-t border-zinc-200">
              <div className="flex justify-between mb-6 font-serif text-xl">
                <span className="text-xs font-bold tracking-widest uppercase flex items-center">Toplam</span>
                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
              </div>
              <a
                href="/?cart_open=true"
                className="block w-full bg-gradient-to-r from-zinc-900 to-black text-white py-4 text-[11px] font-bold tracking-[0.3em] text-center hover:from-[#b8962e] hover:to-[#d4af37] transition-all duration-500 uppercase"
              >
                ÖDEMEYE GEÇ →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ---- FAVORİLER DRAWER ---- */}
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isWishlistOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsWishlistOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl flex flex-col border-l border-[#d4af37]/20 transform transition-transform duration-500 ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 flex justify-between items-center border-b border-zinc-100 bg-zinc-50 relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <h2 className="font-serif tracking-[0.2em] text-lg text-black">FAVORİLERİM</h2>
            <button onClick={() => setIsWishlistOpen(false)} className="text-3xl text-zinc-400 hover:text-[#d4af37] transition-colors font-light">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center text-zinc-400 mt-24 flex flex-col items-center gap-4">
                <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                <p className="text-xs tracking-widest uppercase font-light">Henüz favori eklemediniz.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {wishlistItems.map((item: any) => (
                  <Link key={item.id} href={`/urun/${item.id}`} onClick={() => setIsWishlistOpen(false)}
                    className="flex gap-4 border-b border-zinc-100 pb-6 hover:bg-zinc-50 -mx-2 px-2 rounded-sm transition-colors">
                    <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-800 leading-snug">{item.name}</p>
                      <span className="font-serif text-sm text-black mt-2">
                        {(item.sale_price ? Number(item.sale_price) : Number(item.price)).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP BAR */}
      <div className="bg-black text-[#d4af37] text-[9px] text-center py-2.5 tracking-[0.35em] font-bold uppercase border-b border-[#d4af37]/20">
        Ücretsiz &amp; Sigortalı Teslimat · Tüm Türkiye
      </div>

      {/* HEADER */}
      <header className="py-5 px-8 md:px-16 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
        <Link
          href="/"
          className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 hover:text-[#d4af37] transition-colors uppercase flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Vitrine Dön
        </Link>
        <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[0.35em] text-black">LUMINA</Link>
        <div className="w-24 flex justify-end gap-3">
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-[#d4af37] transition-colors relative hidden md:block"
          >
            Fav{wishlistItems.length > 0 && <span className="ml-0.5 text-[#d4af37]">({wishlistItems.length})</span>}
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-black transition-colors relative"
          >
            Sepet{cartCount > 0 && (
              <span className="ml-1 bg-[#d4af37] text-white text-[9px] w-4 h-4 rounded-full inline-flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-medium flex items-center gap-2">
        <Link href="/" className="hover:text-[#d4af37] transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <span className="hover:text-[#d4af37] transition-colors cursor-pointer">{product.category}</span>
        <span>/</span>
        <span className="text-zinc-800">{product.name}</span>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* LEFT — Image Gallery */}
        <motion.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Image */}
          <div className="relative bg-zinc-50 border border-zinc-100 overflow-hidden rounded-sm mb-4 aspect-square flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply p-4 md:p-8"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </AnimatePresence>

            {/* Sale Badge */}
            {product.sale_price && (
              <span className="absolute top-5 left-0 z-10 bg-gradient-to-r from-zinc-900 to-zinc-800 text-[#d4af37] text-[9px] font-bold px-4 py-1.5 tracking-[0.25em] uppercase shadow-md border-r border-t border-b border-[#d4af37]/30">
                ÖZEL FİYAT
              </span>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => toggleWishlist(e)}
              className="absolute top-5 right-5 z-20 transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                fill={wishlistActive ? '#d4af37' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={wishlistActive ? '#d4af37' : '#a1a1aa'}
                className="w-6 h-6 drop-shadow-sm"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 shrink-0 bg-zinc-50 border transition-all duration-300 rounded-sm overflow-hidden ${activeImage === img
                    ? 'border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover mix-blend-multiply p-1" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* RIGHT — Product Info */}
        <motion.div
          className="flex flex-col pt-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Category Tag */}
          <p className="text-[10px] text-[#d4af37] tracking-[0.4em] uppercase font-bold mb-4">
            {product.category}
          </p>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-serif text-black mb-3 leading-snug">
            {product.name}
          </h1>

          {/* Thin gold divider */}
          <div className="w-12 h-[1px] bg-[#d4af37]/50 mb-6" />

          {/* SKU & Vendor */}
          <div className="flex items-center gap-4 mb-8">
            {product.sku && (
              <p className="text-[10px] text-zinc-400 tracking-[0.25em] uppercase font-medium">
                Ürün Kodu: {product.sku}
              </p>
            )}
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold bg-[#f0f0f1] px-3 py-1.5 rounded-sm text-zinc-600">
              Satıcı: {product.vendor_name || 'Zeray Gold Özel'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-10 pb-8 border-b border-zinc-100">
            {product.sale_price ? (
              <div className="flex flex-col gap-1">
                <del className="text-base text-zinc-400 font-light font-serif">
                  {formatPrice(product.price)}
                </del>
                <span className="text-4xl text-black font-serif tracking-tight">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="mt-2 text-[10px] text-[#d4af37] tracking-widest uppercase font-bold">
                  Özel Fiyat
                </span>
              </div>
            ) : (
              <span className="text-4xl text-black font-serif tracking-tight">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {product.stock > 0 ? (
            <motion.button
              onClick={handleAddToCart}
              className="relative w-full overflow-hidden py-5 text-[11px] font-bold tracking-[0.3em] uppercase mb-4 rounded-sm"
              style={{
                background: addedToCart
                  ? 'linear-gradient(to right, #d4af37, #b8962e)'
                  : 'linear-gradient(to right, #18181b, #09090b)',
                color: 'white',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Sepete Eklendi
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    Sepete Ekle
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <button
              disabled
              className="w-full bg-zinc-100 border border-zinc-200 text-zinc-400 py-5 text-[11px] font-bold tracking-[0.3em] uppercase rounded-sm cursor-not-allowed mb-4"
            >
              Tükendi
            </button>
          )}

          {/* Wishlist CTA */}
          <button
            onClick={(e) => toggleWishlist(e)}
            className="w-full border border-zinc-200 text-zinc-600 py-4 text-[10px] font-bold tracking-[0.25em] uppercase mb-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill={wishlistActive ? '#d4af37' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            {wishlistActive ? 'Favorilerde' : 'Favorilere Ekle'}
          </button>

          {/* Inline Executive Support WhatsApp */}
          <div className="mb-8">
            <WhatsAppButton variant="inline" productName={product.name} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-zinc-100 pt-8">
            {[
              { icon: '🚚', label: 'Ücretsiz Teslimat' },
              { icon: '✦', label: 'Ayar Damgası' },
              { icon: '↩', label: '14 Gün İade' },
            ].map((item, i) => (
              <div key={i} className={`text-center ${i === 1 ? 'border-x border-zinc-100' : ''}`}>
                <div className="text-lg mb-2 text-[#d4af37]">{item.icon}</div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-medium leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TABS SECTION */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-32">
        <div className="flex justify-center gap-10 border-b border-zinc-100 mb-10 relative">
          <div
            className="absolute bottom-0 h-[1px] bg-[#d4af37] transition-all duration-500"
            style={{
              left: activeTab === 'ozellikler' ? '0%' : '50%',
              width: '50%',
            }}
          />
          {['ozellikler', 'hikaye'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors flex-1 ${activeTab === tab ? 'text-black' : 'text-zinc-400 hover:text-zinc-700'
                }`}
            >
              {tab === 'ozellikler' ? 'Özellikler & Sertifika' : 'Ürün Açıklaması'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'ozellikler' && (
            <motion.div
              key="ozellikler"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { label: 'Maden', value: product.metal || '—' },
                { label: 'Ağırlık', value: product.gram ? `${product.gram} gram` : '—' },
                { label: 'Kategori', value: product.category || '—' },
                { label: 'Stok Durumu', value: product.stock > 0 ? `${product.stock} adet mevcut` : 'Tükendi' },
              ].map((row, i) => (
                <div key={i} className="border border-zinc-100 p-5 rounded-sm">
                  <p className="text-[9px] text-[#d4af37] tracking-[0.3em] uppercase font-bold mb-2">{row.label}</p>
                  <p className="text-sm text-zinc-700 font-medium">{row.value}</p>
                </div>
              ))}
              <div className="md:col-span-2 bg-zinc-50 border border-zinc-100 p-5 rounded-sm">
                <p className="text-[10px] text-zinc-400 font-light italic leading-relaxed">
                  ✦ Tüm Zeray Gold ürünleri Türkiye'de el işçiliğiyle üretilmekte olup her parça kalite kontrolünden geçtikten sonra özenle paketlenmektedir.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'hikaye' && (
            <motion.div
              key="hikaye"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-zinc-600 leading-relaxed font-serif text-lg max-w-2xl whitespace-pre-wrap"
            >
              {product.description || (
                <span className="italic text-zinc-400 text-base">
                  Bu eşsiz parçanın hikâyesi çok yakında eklenecektir.
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ——— ÖNERİLEN ÜRÜNLER CAROUSEL ——— */}
      {relatedProducts.length > 0 && (
        <section className="bg-zinc-950 py-20 md:py-28 overflow-hidden border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 md:px-10">

            {/* Section header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] text-[#d4af37] tracking-[0.45em] uppercase font-bold mb-3">Koleķsiyon</p>
                <h2 className="text-2xl md:text-4xl font-serif text-white leading-tight">
                  İlgini Çekebilir
                </h2>
              </div>
              <Link
                href="/"
                className="hidden md:flex items-center gap-2 text-[10px] text-zinc-400 tracking-[0.3em] uppercase hover:text-[#d4af37] transition-colors font-bold group"
              >
                Tümünü Gör
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {/* Draggable Carousel Track */}
            <motion.div
              ref={carouselRef}
              className="flex gap-5 cursor-grab active:cursor-grabbing select-none"
              drag="x"
              dragConstraints={{
                left: -((relatedProducts.length - 1) * 280),
                right: 0,
              }}
              dragElastic={0.08}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              style={{ x: dragX }}
              whileTap={{ cursor: 'grabbing' }}
            >
              {relatedProducts.map((rel, idx) => (
                <motion.div
                  key={rel.id}
                  className="relative shrink-0 w-[240px] md:w-[280px] group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Card */}
                  <div className="bg-zinc-900 border border-zinc-800 group-hover:border-[#d4af37]/30 transition-all duration-500 overflow-hidden">

                    {/* Image area */}
                    <Link href={`/urun/${rel.id}`} className="relative block aspect-square overflow-hidden bg-zinc-800">
                      <motion.img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                      {/* Sale badge */}
                      {rel.sale_price && (
                        <span className="absolute top-3 left-0 bg-[#d4af37] text-black text-[8px] font-black px-3 py-1 tracking-[0.2em] uppercase">
                          İNDİRİM
                        </span>
                      )}

                      {/* Quick action overlay */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 flex gap-2 p-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const cart = JSON.parse(localStorage.getItem('lumina_cart') || '[]');
                            const ex = cart.find((i: any) => i.id === rel.id);
                            if (ex) ex.quantity += 1; else cart.push({ ...rel, quantity: 1 });
                            localStorage.setItem('lumina_cart', JSON.stringify(cart));
                            setAddedIds(prev => new Set(prev).add(rel.id));
                            setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(rel.id); return s; }), 2000);
                          }}
                          className="flex-1 bg-[#d4af37] text-black py-2.5 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors"
                        >
                          {addedIds.has(rel.id) ? '✓ Eklendi' : 'Sepete Ekle'}
                        </button>
                        <Link
                          href={`/urun/${rel.id}`}
                          className="bg-zinc-800/80 text-white px-3 py-2.5 text-[9px] hover:bg-zinc-700 transition-colors border border-zinc-600 backdrop-blur-sm"
                          onClick={e => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                      </motion.div>
                    </Link>

                    {/* Card info */}
                    <div className="p-4">
                      <Link href={`/urun/${rel.id}`}>
                        <p className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-1.5">{rel.category}</p>
                        <p className="text-sm text-white font-medium leading-snug mb-3 line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300">
                          {rel.name}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2">
                        {rel.sale_price && (
                          <del className="text-[11px] text-zinc-600">{formatPrice(rel.price)}</del>
                        )}
                        <span className="text-base font-serif text-white">
                          {formatPrice(rel.sale_price || rel.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Drag hint */}
            <div className="flex items-center gap-3 mt-8 opacity-40">
              <div className="w-8 h-[1px] bg-zinc-600" />
              <span className="text-[9px] text-zinc-500 tracking-[0.3em] uppercase">Sürükleyerek Geçin</span>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-black py-10 text-center text-[10px] text-zinc-600 tracking-[0.3em] uppercase border-t border-zinc-800">
        © 2026 <span className="text-[#d4af37]/70">LUMINA</span> JEWELRY. TÜM HAKLARI SAKLIDIR.
      </footer>
    </div>
  );
}
