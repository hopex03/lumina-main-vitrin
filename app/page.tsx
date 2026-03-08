'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const formatPrice = (price: any) =>
  Number(price).toLocaleString('tr-TR') + ' ₺';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // FORM STATELERİ
  const [checkoutForm, setCheckoutForm] = useState({ fullName: '', email: '', phone: '', city: '', district: '', address: '' });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  // BAŞLANGIÇ YÜKLEMELERİ (SEPET & URL PARAMETRELERİ)
  useEffect(() => {
    const savedCart = localStorage.getItem('zeray_cart');
    const savedWishlist = localStorage.getItem('zeray_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const checkOpenCart = () => {
      const isCartMode = new URLSearchParams(window.location.search).get('openCart');
      if (isCartMode === 'true') {
        setIsCartOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    checkOpenCart();

    // YENİ EKLENEN EVENT LİSTENER
    const handleOpenWishlist = () => setIsWishlistOpen(true);
    window.addEventListener('open-wishlist', handleOpenWishlist);

    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener('open-wishlist', handleOpenWishlist);
    };
  }, []);

  // SUPABASE'DEN GERÇEK ÜRÜNLERİ ÇEKME
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Yayımlanmış')
        .order('id', { ascending: false });

      if (data) setAllProducts(data);
      setIsProductsLoading(false);
    };
    fetchProducts();
  }, []);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2000&q=80',
      content: (
        <div className="text-center px-4 animate-fade-in relative z-20">
          <p className="text-white text-4xl md:text-6xl font-serif max-w-4xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-8">
            <span className="text-gradient-gold">Işıltınızı</span> Keşfedin.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Hepsi');
              window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-white px-12 py-4 text-xs font-bold tracking-[0.3em] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-500 hover:scale-105"
          >
            KOLEKSİYONU İNCELE
          </button>
        </div>
      ),
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=2000&q=80',
      content: (
        <div className="absolute bottom-12 md:bottom-24 left-0 w-full flex justify-center animate-slide-up relative z-20">
          <div className="bg-zinc-950/90 backdrop-blur-md p-8 md:p-12 shadow-2xl text-center border border-gold/30 max-w-lg mx-6">
            <h2 className="text-gradient-gold text-[11px] font-bold mb-4 uppercase tracking-[0.4em]">
              Zeray Gold Ayrıcalığı
            </h2>
            <div className="text-white text-xl md:text-3xl font-serif mb-6 leading-relaxed">
              Zamana Meydan Okuyan<br />Altın İşçiliği
            </div>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mb-6"></div>
            <p className="text-gold-light/70 text-xs font-medium tracking-widest uppercase mb-0">
              Ustalıkla İşlenmiş Som Altın
            </p>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1)),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  // --- SEPET İŞLEMLERİ ---
  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('zeray_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      // BUG FIX: auto-remove when decrementing below 1
      saveCart(cart.filter((item) => item.id !== id));
      return;
    }
    saveCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id: number) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.some(item => item.id === product.id)) {
      updatedWishlist = updatedWishlist.filter(item => item.id !== product.id);
    } else {
      updatedWishlist.push(product);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('zeray_wishlist', JSON.stringify(updatedWishlist));
  };

  // --- SİPARİŞ & ÜYELİK İŞLEMLERİ ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.email.includes('@')) return alert("Lütfen geçerli bir e-posta adresi giriniz.");
    if (authMode === 'register') {
      if (!authForm.fullName) return alert("Lütfen Ad Soyad bilginizi eksiksiz giriniz.");
      if (!authForm.phone) return alert("Lütfen geçerli bir telefon numarası giriniz.");
    }

    setIsSubmitting(true);
    try {
      const { data: existing, error: fetchErr } = await supabase.from('customers').select('*').eq('email', authForm.email).maybeSingle();
      if (fetchErr) throw fetchErr;

      if (authMode === 'register') {
        if (existing) {
          alert("Bu e-posta adresiyle zaten bir hesap mevcut. Lütfen giriş yapın.");
        } else {
          const { error } = await supabase.from('customers').insert([{
            full_name: authForm.fullName,
            email: authForm.email,
            phone: authForm.phone || null,
            total_spent: 0
          }]);
          if (error) throw error;
          alert("Kayıt başarılı! Hoşgeldiniz " + authForm.fullName);
          setIsAuthOpen(false);
        }
      } else {
        // Login mode
        if (!existing) {
          alert("Bu e-posta adresine ait bir hesap bulunamadı. Lütfen kayıt olun.");
        } else {
          alert("Hoşgeldiniz " + existing.full_name);
          setIsAuthOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      setOrderError("Lütfen iletişim ve teslimat bilgilerinizi eksiksiz doldurunuz.");
      setTimeout(() => setOrderError(''), 5000);
      return;
    }
    if (!checkoutForm.email.includes('@')) {
      setOrderError("Lütfen geçerli bir e-posta adresi giriniz.");
      setTimeout(() => setOrderError(''), 5000);
      return;
    }
    setIsSubmitting(true);
    try {
      let customerId = null;
      const { data: existingCustomer, error: ecErr } = await supabase.from('customers').select('*').eq('email', checkoutForm.email).maybeSingle();
      if (ecErr) throw ecErr;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: cErr } = await supabase.from('customers').insert([{
          full_name: checkoutForm.fullName,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          total_spent: 0
        }]).select().single();
        if (cErr) throw cErr;
        customerId = newCustomer.id;
      }

      const totalAmount = cart.reduce((total, item) => total + (item.sale_price ? Number(item.sale_price) : Number(item.price)) * item.quantity, 0);
      const addressString = `${checkoutForm.address}, ${checkoutForm.district}/${checkoutForm.city}`;

      const { error: oErr } = await supabase.from('orders').insert([{
        customer_id: customerId,
        customer_name: checkoutForm.fullName,
        email: checkoutForm.email,
        total_amount: totalAmount,
        status: 'Bekliyor',
        shipping_address: addressString,
        items: JSON.stringify(cart)
      }]);
      if (oErr) throw oErr;

      setOrderSuccess(true);
      localStorage.removeItem('zeray_cart');
      setCart([]);
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
        window.scrollTo(0, 0);
      }, 3500);
    } catch (err) {
      console.error(err);
      setOrderError('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setTimeout(() => setOrderError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // İndirimli fiyat öncelikli sepet toplamı
  const cartTotal = cart.reduce((total, item) => {
    const activePrice = item.sale_price
      ? Number(item.sale_price)
      : Number(item.price);
    return total + activePrice * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-dark font-sans selection:bg-gold selection:text-white">
      {/* TEPEDEKİ SİYAH/ALTIN BAR */}
      <div className="bg-black text-gold text-[10px] md:text-[11px] text-center py-3 tracking-[0.3em] font-medium uppercase border-b border-gold/20">
        Online Özel: Ücretsiz & Sigortalı Teslimat <span className="opacity-70 mx-2">|</span> Özel Kutusunda
      </div>

      {/* HEADER */}
      <header className="pt-8 pb-5 px-6 md:px-12 sticky top-0 bg-white/95 backdrop-blur-xl z-[60] border-b border-gray-100 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
          <div className="flex-1 hidden md:flex gap-6 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
            <div className="flex items-center gap-3">
              <Link href="/iletisim" className="hover:text-dark transition-colors">İletişim</Link>
              {/* Temporary Romantic Gesture */}
              <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity" title="Efe'den...">
                <span className="text-blue-500 font-serif font-black text-xl" style={{ WebkitTextStroke: '1px #3b82f6', color: 'transparent' }}>E</span>
                <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
          </div>
          {/* MOBIL HAMBURGER */}
          <div className="flex md:hidden flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(p => !p)}
              className="text-2xl text-zinc-700 hover:text-[#d4af37] transition-colors w-8 h-8 flex items-center justify-center"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? '×' : '☰'}
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="group flex items-center justify-center transition-opacity hover:opacity-90 relative w-[280px] h-[80px]">
              {/* Opacity %15 to not interrupt readability, absolute centered */}
              <svg viewBox="0 0 100 85" className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[52%] w-24 h-24 text-[#D4AF37] opacity-[0.15] drop-shadow-sm group-hover:scale-105 transition-transform duration-700 z-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter">
                {/* Minimalist Interlocking Triangles Logo Behind Text */}
                <path d="M50 10 L15 75 h70 Z" />
                <path d="M35 10 L5 75 h30 M65 10 L95 75 h-30" />
                <path d="M25 45 L50 85 L75 45" />
              </svg>
              <span className="relative z-10 text-2xl md:text-3xl font-serif tracking-[0.25em] font-black bg-clip-text text-transparent bg-dark-gradient uppercase">
                Zeray Gold
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end gap-5">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1.5 hover:text-gold transition-colors hidden md:flex"
            >
              HESABIM
            </button>
            <button
              onClick={() => {
                // open wishlist drawer via a state
                const e = new CustomEvent('open-wishlist');
                window.dispatchEvent(e);
              }}
              className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 hover:text-gold transition-colors relative hidden md:flex"
            >
              <svg className="w-3.5 h-3.5" fill={wishlist.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
              FAVORİLER{wishlist.length > 0 && <span className="bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 hover:text-gold transition-colors relative"
            >
              SEPETİM {totalItems > 0 && <span className="bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center absolute -top-2 -right-3">{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* MOBiL MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            <Link href="/iletisim" className="text-xs font-bold tracking-widest uppercase text-zinc-600 hover:text-[#d4af37] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Bize Ulaşın</Link>
            <div className="h-px bg-zinc-100" />
            {['Hepsi', 'Saat', 'Bileklik', 'Kolye', 'Yüzük', 'Küpe'].map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
                className={`text-xs font-bold tracking-widest uppercase text-left transition-colors ${selectedCategory === cat ? 'text-[#d4af37]' : 'text-zinc-500'}`}>
                {cat}
              </button>
            ))}
            <div className="h-px bg-zinc-100" />
            <div className="flex gap-4">
              <button onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} className="text-xs font-bold tracking-widest uppercase text-zinc-600 hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                Sepet {totalItems > 0 && <span className="bg-[#d4af37] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
              </button>
              <button onClick={() => setIsAuthOpen(true)} className="text-xs font-bold tracking-widest uppercase text-zinc-600 hover:text-[#d4af37] transition-colors">
                Hesabım
              </button>
            </div>
          </div>
        )}

        {/* KATEGORİ NAV */}
        <div className="flex justify-center gap-6 md:gap-12 overflow-x-auto text-sm font-bold tracking-[0.15em] uppercase pb-2 scrollbar-hide border-t border-gray-50 pt-5">
          {['Hepsi', 'Saat', 'Bileklik', 'Kolye', 'Yüzük', 'Küpe'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap transition-all duration-300 py-1 ${selectedCategory === cat
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-500 hover:text-dark'
                  }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </header>

      {/* SAĞ SEPET ÇEKMECESİ — backdrop closes on click */}
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 flex flex-col border-l border-gold/20 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-200 bg-zinc-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            <h2 className="font-serif tracking-[0.2em] text-xl text-dark">
              ALIŞVERİŞ SEPETİ
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-3xl text-zinc-400 hover:text-gold transition-colors font-light"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
            {cart.length === 0 ? (
              <div className="text-center text-zinc-400 mt-32 flex flex-col items-center">
                <svg className="w-12 h-12 mb-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <p className="mb-6 font-light tracking-widest text-xs uppercase">Sepetiniz şu an boş.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-[10px] font-bold tracking-[0.2em] border-b border-zinc-800 pb-1 text-zinc-800 hover:text-gold hover:border-gold transition-colors uppercase"
                >
                  Koleksiyona Dön
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 border-b border-zinc-100 pb-8"
                  >
                    <div className="relative border border-zinc-200 bg-zinc-50 p-1 w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-sm text-zinc-800 mb-1 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400">
                          {item.category || ''}
                        </p>
                      </div>
                      <p className="font-serif text-base text-dark mt-2">
                        {item.sale_price
                          ? formatPrice(item.sale_price)
                          : formatPrice(item.price)}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-zinc-200 bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 hover:bg-zinc-100 transition-colors text-zinc-600 font-light"
                          >
                            -
                          </button>
                          <span className="px-3 text-[10px] font-bold text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-zinc-100 transition-colors text-zinc-600 font-light"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-zinc-400 hover:text-red-600 transition-colors uppercase tracking-widest border-b border-transparent hover:border-red-600 pb-0.5"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 md:p-8 bg-zinc-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-zinc-200 relative">
              <div className="flex justify-between mb-4 text-xs font-medium text-zinc-500 tracking-widest uppercase">
                <span>Ara Toplam</span>
                <span>
                  {formatPrice(
                    cart.reduce(
                      (total, item) => total + Number(item.price) * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              {cart.reduce(
                (total, item) =>
                  total +
                  (Number(item.price) -
                    (item.sale_price
                      ? Number(item.sale_price)
                      : Number(item.price))) *
                  item.quantity,
                0
              ) > 0 && (
                  <div className="flex justify-between mb-5 text-xs font-bold text-gold-dark tracking-widest uppercase">
                    <span>Özel İndirim</span>
                    <span>
                      -
                      {formatPrice(
                        cart.reduce(
                          (total, item) =>
                            total +
                            (Number(item.price) -
                              (item.sale_price
                                ? Number(item.sale_price)
                                : Number(item.price))) *
                            item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                )}

              <div className="flex justify-between mb-8 text-2xl font-serif text-dark border-t border-zinc-200 pt-5">
                <span className="text-sm font-bold tracking-[0.2em] flex items-center uppercase">Toplam</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-zinc-900 to-black text-white py-4 text-[11px] font-bold tracking-[0.3em] hover:from-gold-dark hover:to-gold transition-all duration-500 shadow-xl flex items-center justify-center gap-3 uppercase group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <span className="relative z-10">GÜVENLİ ÖDEMEYE GEÇ</span>
                <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 text-zinc-300 text-xl grayscale opacity-70">
                  <i className="fab fa-cc-visa" title="Visa"></i>
                  <i className="fab fa-cc-mastercard" title="Mastercard"></i>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 border border-zinc-300 px-2 py-1 rounded-sm uppercase">256-Bit SSL</span>
                </div>
                <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5 mt-2 uppercase tracking-widest font-light">
                  <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Zeray Gold Sigortalı Kargo Güvencesiyle
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AFİŞ (SLIDER) — Framer Motion */}
      <main className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden bg-black">
        <AnimatePresence mode="sync">
          {slides.map((slide, idx) =>
            idx === currentSlide ? (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              >
                {/* Background Image with subtle zoom */}
                <motion.img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 1.04 }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                />

                {/* Rich vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />

                {/* Slide Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {slide.content}
                  </motion.div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="relative h-[2px] rounded-full overflow-hidden bg-white/20 transition-all duration-300"
              style={{ width: idx === currentSlide ? 40 : 16 }}
            >
              {idx === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-gold"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Left/Right Arrow Buttons */}
        <button
          onClick={() => setCurrentSlide(s => (s === 0 ? slides.length - 1 : s - 1))}
          className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/60 transition-all duration-300 backdrop-blur-sm bg-black/20 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => setCurrentSlide(s => (s === slides.length - 1 ? 0 : s + 1))}
          className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/60 transition-all duration-300 backdrop-blur-sm bg-black/20 group"
        >
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 right-8 z-30 flex flex-col items-center gap-2 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[9px] text-white tracking-[0.3em] font-medium uppercase" style={{ writingMode: 'vertical-rl' }}>Keşfet</span>
          <motion.div
            className="w-[1px] h-10 bg-gradient-to-b from-gold to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>
      </main>

      {/* MARKA HİKAYESİ */}
      <section className="bg-zinc-950 text-white py-24 md:py-32 relative overflow-hidden border-t border-b border-gold/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-80 z-0"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-gradient-gold text-xs font-bold tracking-[0.4em] uppercase mb-4">Zanaatkârlık</h2>
          <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight drop-shadow-xl tracking-wide">Altının ve Ustalığın <br /><span className="text-gradient-gold">Kusursuz Uyumu</span></h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto font-light mb-12 drop-shadow-md">
            Kendine has duruşuyla doğanın bize sunduğu en değerli armağan olan altın, Zeray Gold ustalığıyla titizlikle işlenerek nesilden nesile aktarılacak zamansız bir mirasa dönüşüyor. Biz sadece takı değil, en özel anılarınızı kusursuzlaştıracak som altın başyapıtlar tasarlıyoruz. Seçkin zevklere hitap eden markamız, sizi gerçek lüksü keşfetmeye davet ediyor.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 text-gold opacity-90 border-t border-gold/10 pt-10">
            <div className="flex flex-col items-center gap-3 group cursor-default">
              <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Özel Tasarım</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gold/20"></div>
            <div className="flex flex-col items-center gap-3 group cursor-default">
              <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Uluslararası Garanti</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-gold/20"></div>
            <div className="flex flex-col items-center gap-3 group cursor-default">
              <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Zamansız Ustalık</span>
            </div>
          </div>
        </div>
      </section>

      {/* ÜRÜNLER VİTRİNİ */}
      <section className="bg-white pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-dark mb-4 uppercase tracking-[0.1em]">
              {selectedCategory} KOLEKSİYONU
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {isProductsLoading ? (
              // SKELETON LOADER
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-gray-100 p-4 flex flex-col bg-white rounded-sm animate-pulse">
                  <div className="aspect-square bg-zinc-100 mb-4 rounded-sm" />
                  <div className="h-3 bg-zinc-100 rounded mb-2 w-4/5 mx-auto" />
                  <div className="h-4 bg-zinc-100 rounded mb-4 w-2/3 mx-auto" />
                  <div className="h-9 bg-zinc-100 rounded" />
                </div>
              ))
            ) : allProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 font-light tracking-widest uppercase text-sm">
                Bu kategoride henüz ürün bulunmamaktadır.
              </div>
            ) : (
              (selectedCategory === 'Hepsi'
                ? allProducts
                : allProducts.filter((p) => p.category === selectedCategory)
              ).map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-100 p-4 hover:border-gold/40 hover:shadow-[0_8px_30px_rgb(212,175,55,0.12)] transition-all duration-500 flex flex-col bg-white relative rounded-sm"
                >
                  {/* FAVORİ İKONU — animated toggle */}
                  <motion.button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-5 right-5 z-20 transition-colors drop-shadow-sm"
                    whileTap={{ scale: 1.35 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={wishlist.some(w => w.id === product.id) ? '#d4af37' : 'none'}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={wishlist.some(w => w.id === product.id) ? '#d4af37' : '#a1a1aa'}
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </motion.button>

                  {/* --- DETAY SAYFASINA GİDEN TIKLANABİLİR GÖRSEL --- */}
                  <Link
                    href={`/urun/${product.id}`}
                    className="relative aspect-square overflow-hidden mb-6 bg-zinc-50/50 block cursor-pointer group/image rounded-sm"
                  >
                    {product.sale_price && (
                      <span className="absolute top-3 left-0 z-10 bg-gradient-to-r from-dark to-zinc-800 text-gold text-[9px] font-bold px-3 py-1 tracking-widest uppercase shadow-md border-r border-t border-b border-gold/30">
                        ÖZEL FİYAT
                      </span>
                    )}
                    {/* TÜKENDi OVERLAY */}
                    {Number(product.stock) <= 0 && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                        <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.3em] uppercase px-4 py-1.5 rotate-[-10deg] shadow-lg">
                          TÜKENDi
                        </span>
                      </div>
                    )}
                    {/* Birinci Görsel */}
                    <img
                      src={product.image}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 mix-blend-multiply ${product.image2 ? 'group-hover/image:opacity-0 group-hover/image:scale-105' : 'group-hover/image:scale-105'}`}
                    />
                    {/* İkinci Görsel (Hover) */}
                    {product.image2 && (
                      <img
                        src={product.image2}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/image:opacity-100 transition-all duration-1000 mix-blend-multiply group-hover/image:scale-105"
                      />
                    )}
                  </Link>

                  <div className="text-center flex-1 flex flex-col justify-between px-1">
                    <div>
                      {/* Satıcı Etiketi */}
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold bg-[#f0f0f1] inline-block px-2 py-0.5 rounded-sm text-zinc-500 mb-2">
                        {product.vendor_name || 'Zeray Gold Özel'}
                      </p>
                      {/* --- DETAY SAYFASINA GİDEN TIKLANABİLİR İSİM --- */}
                      <Link
                        href={`/urun/${product.id}`}
                        className="block text-[11px] font-semibold uppercase mb-2 text-zinc-800 hover:text-gold transition-colors tracking-widest leading-relaxed"
                      >
                        {product.name}
                      </Link>
                      <div className="flex justify-center mb-4">
                        <div className="w-8 h-[1px] bg-gold/30"></div>
                      </div>
                      <p className="font-serif text-lg mb-5 text-dark">
                        {product.sale_price ? (
                          <span className="flex items-center justify-center gap-3">
                            <del className="text-gray-400 font-sans text-xs">
                              {formatPrice(product.price)}
                            </del>
                            <span className="text-gold-dark font-semibold">{formatPrice(product.sale_price)}</span>
                          </span>
                        ) : (
                          <span>{formatPrice(product.price)}</span>
                        )}
                      </p>
                    </div>

                    {/* SEPETE EKLE BUTONU */}
                    {product.stock > 0 ? (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                        className="w-full bg-transparent border border-zinc-200 text-zinc-700 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-gold hover:bg-gold hover:text-white transition-all duration-300 mb-3 relative z-10"
                      >
                        SEPETE EKLE
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-400 py-3 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 cursor-not-allowed"
                      >
                        TÜKENDİ
                      </button>
                    )}

                    {/* TRUST BADGE ROW — 2 items */}
                    <div className="flex items-center justify-center gap-5 text-[9px] text-gray-400 font-medium py-1 border-t border-zinc-50 mt-1 pt-2">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Ücretsiz Kargo
                      </span>
                      <span className="w-px h-3 bg-zinc-200" />
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        14 Gün İade
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SAĞ FAVORİLER ÇEKMECESİ */}
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isWishlistOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsWishlistOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 flex flex-col border-l border-gold/20 ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-200 bg-zinc-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            <h2 className="font-serif tracking-[0.2em] text-xl text-dark">
              FAVORİLERİM
            </h2>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="text-3xl text-zinc-400 hover:text-gold transition-colors font-light"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
            {wishlist.length === 0 ? (
              <div className="text-center text-zinc-400 mt-32 flex flex-col items-center">
                <svg className="w-12 h-12 mb-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                <p className="mb-6 font-light tracking-widest text-xs uppercase">Favori listeniz henüz boş.</p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-[10px] font-bold tracking-[0.2em] border-b border-zinc-800 pb-1 text-zinc-800 hover:text-gold hover:border-gold transition-colors uppercase"
                >
                  Keşfetmeye Başla
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex gap-5 border-b border-zinc-100 pb-8">
                    <Link href={`/urun/${item.id}`} className="relative border border-zinc-200 bg-zinc-50 p-1 w-24 h-24 flex-shrink-0 group block overflow-hidden rounded-sm">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/urun/${item.id}`} className="font-serif text-sm text-zinc-800 hover:text-gold transition-colors mb-1 leading-snug block line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400">
                          {item.category || ''}
                        </p>
                      </div>
                      <p className="font-serif text-base text-dark mt-2 font-semibold">
                        {item.sale_price ? formatPrice(item.sale_price) : formatPrice(item.price)}
                      </p>
                      <button
                        onClick={(e) => toggleWishlist(item, e)}
                        className="mt-4 text-left w-fit text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {wishlist.length > 0 && (
            <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-200">
              <button
                onClick={() => { setWishlist([]); localStorage.removeItem('zeray_wishlist'); setIsWishlistOpen(false); }}
                className="w-full py-4 bg-transparent border border-zinc-300 text-zinc-600 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 rounded-sm"
              >
                Listeyi Temizle
              </button>
            </div>
          )}
        </div>
      </div>


      <footer className="bg-black text-white pt-24 pb-12 mt-0 relative overflow-hidden border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-3xl font-serif tracking-[0.25em] mb-6 text-gradient-gold">ZERAY GOLD</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 pe-4 font-serif tracking-[0.2em] font-medium uppercase">
                SEKTÖREL BİRLEŞİK GÜÇ VE KURUMSAL GÜVENCE
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">In</div>
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">Fb</div>
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">Tw</div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Markamız</h4>
              <ul className="flex flex-col gap-4 text-xs text-gray-400 font-light">
                <li><Link href="/hakkimizda" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Biz Kimiz?</Link></li>
                <li><Link href="/iletisim" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Müşteri İlişkileri</h4>
              <ul className="flex flex-col gap-4 text-xs text-gray-400 font-light">
                <li><Link href="/iade-sartlari" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">İade ve Değişim</Link></li>
                <li><Link href="/" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Teslimat Bilgileri</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Güvenli Alışveriş</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
                Tüm siparişleriniz size özel muhafaza edilerek sigortalı kurye ile ücretsiz teslim edilmektedir.
              </p>
              <div className="flex gap-3 items-center opacity-60 mix-blend-screen">
                <div className="text-[10px] font-bold border border-zinc-700 px-3 py-1.5 tracking-widest uppercase">SSL</div>
                <div className="text-[10px] font-bold border border-zinc-700 px-3 py-1.5 tracking-widest uppercase">GIA</div>
                <div className="text-[10px] font-bold border border-zinc-700 px-3 py-1.5 tracking-widest uppercase">HRD</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              © 2026 <span className="text-gold/70">ZERAY GOLD</span>. TÜM HAKLARI SAKLIDIR.
            </div>
            <div className="flex gap-6 text-[10px] text-zinc-500 tracking-widest uppercase">
              <Link href="/" className="hover:text-gold transition-colors">Gizlilik Politikası</Link>
              <Link href="/" className="hover:text-gold transition-colors">Çerez Politikası</Link>
              <Link href="/" className="hover:text-gold transition-colors">Mesafeli Sözleşme</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CHECKOUT (GÜVENLİ ÖDEME) MODALI */}
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          onClick={() => setIsCheckoutOpen(false)}
        >
          <div
            className="bg-white max-w-5xl w-full shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-sm border border-gold/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sol: Müşteri Formu */}
            <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto form-scrollbar">
              <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6 relative">
                <div className="absolute bottom-0 left-0 w-16 h-[1px] bg-gold"></div>
                <h2 className="font-serif tracking-[0.25em] text-2xl text-dark">GÜVENLİ ÖDEME</h2>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="text-[9px] font-bold border border-zinc-300 px-2.5 py-1 tracking-widest uppercase text-zinc-600">SSL</div>
                  <div className="text-[9px] font-bold border border-zinc-300 px-2.5 py-1 tracking-widest uppercase text-zinc-600">PCI DSS</div>
                </div>
              </div>

              <div className="mb-10 animate-fade-in group/section">
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 text-zinc-800 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-gold to-gold-dark text-white w-6 h-6 flex items-center justify-center rounded-sm text-[10px] shadow-sm">1</span>
                  İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <input type="text" placeholder="Adınız Soyadınız *" value={checkoutForm.fullName} onChange={e => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer" />
                  </div>
                  <div className="relative">
                    <input type="email" placeholder="E-Posta Adresiniz *" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer" />
                  </div>
                  <div className="relative md:col-span-2">
                    <input type="tel" placeholder="Telefon Numaranız *" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer" />
                  </div>
                </div>
              </div>

              <div className="mb-10 animate-fade-in delay-100 group/section">
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 text-zinc-800 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-gold to-gold-dark text-white w-6 h-6 flex items-center justify-center rounded-sm text-[10px] shadow-sm">2</span>
                  Teslimat Adresi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <input type="text" placeholder="İl *" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer" />
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="İlçe *" value={checkoutForm.district} onChange={e => setCheckoutForm({ ...checkoutForm, district: e.target.value })} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer" />
                  </div>
                  <div className="relative md:col-span-2">
                    <textarea placeholder="Açık Adres *" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} rows={3} className="w-full p-4 bg-zinc-50/50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in delay-200 group/section">
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 text-zinc-800 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-gold to-gold-dark text-white w-6 h-6 flex items-center justify-center rounded-sm text-[10px] shadow-sm">3</span>
                  Ödeme Seçimi
                </h3>
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer border border-gold bg-gold/5 p-4 flex-1 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all">
                    <input type="radio" name="payment" defaultChecked className="accent-gold w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-dark mt-px">Kredi Kartı</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer border border-zinc-200 p-4 flex-1 opacity-50 bg-zinc-50 rounded-sm">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-px">Havale <br />(Yakında)</span>
                  </label>
                </div>
                <div className="bg-white p-6 border border-zinc-200 shadow-sm rounded-sm">
                  <div className="relative mb-5">
                    <input type="text" placeholder="Kart Numarası" className="w-full p-4 border border-zinc-200 text-xs outline-none font-mono focus:border-gold transition-colors bg-zinc-50/50 tracking-widest" />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <div className="flex gap-5">
                    <input type="text" placeholder="AA/YY" className="w-1/2 p-4 border border-zinc-200 text-xs outline-none font-mono focus:border-gold transition-colors bg-zinc-50/50 tracking-widest text-center" />
                    <input type="text" placeholder="CVV" className="w-1/2 p-4 border border-zinc-200 text-xs outline-none font-mono focus:border-gold transition-colors bg-zinc-50/50 tracking-widest text-center" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Sipariş Özeti */}
            <div className="md:w-2/5 bg-zinc-50 p-8 md:p-12 border-l border-zinc-200 flex flex-col justify-between relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5">
                  <h3 className="font-bold tracking-[0.2em] uppercase text-xs text-dark">Sipariş Özeti</h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-3xl text-zinc-400 hover:text-dark transition-colors font-light leading-none">&times;</button>
                </div>
                <div className="flex flex-col gap-5 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 border border-zinc-100 shadow-sm rounded-sm">
                      <div className="relative w-16 h-16 bg-zinc-50 border border-zinc-100 flex-shrink-0 p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest line-clamp-2 text-zinc-800 leading-relaxed mb-1">{item.name}</p>
                        <p className="text-xs text-zinc-500 font-serif italic">{item.quantity} Adet</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-200 pt-6 flex flex-col gap-4">
                  <div className="flex justify-between text-xs text-zinc-500 font-medium tracking-widest uppercase">
                    <span>Ara Toplam</span>
                    <span className="text-dark">{formatPrice(cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gold-dark font-bold tracking-widest uppercase">
                    <span>Ayrıcalıklı İndirim</span>
                    <span>-{formatPrice(cart.reduce((total, item) => total + (Number(item.price) - (item.sale_price ? Number(item.sale_price) : Number(item.price))) * item.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 font-medium pb-6 border-b border-zinc-200 tracking-widest uppercase">
                    <span className="flex items-center gap-2"><svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Sigortalı Kargo</span>
                    <span className="text-dark font-bold">ÜCRETSİZ</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">Genel Toplam</span>
                  <span className="text-3xl lg:text-4xl font-serif font-black text-dark tracking-tight">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-zinc-900 to-black text-white py-5 text-[11px] font-bold tracking-[0.3em] shadow-2xl hover:from-gold-dark hover:to-gold transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 uppercase relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative z-10">{isSubmitting ? 'ONAYLANIYOR...' : 'SİPARİŞİ TAMAMLA'}</span>
                </button>

                {/* INLINE ORDER ERROR BANNER */}
                {orderError && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium p-3 rounded-sm text-center animate-fade-in">
                    ❌ {orderError}
                  </div>
                )}

                <p className="text-[9px] text-zinc-400 text-center mt-5 uppercase tracking-widest leading-relaxed px-4">
                  Siparişi Tamamla'ya tıklayarak <Link href="#" className="underline hover:text-gold transition-colors">Mesafeli Satış Sözleşmesi'ni</Link> kabul etmiş olursunuz.
                </p>
              </div>
            </div>

            {/* INLINE ORDER SUCCESS OVERLAY */}
            <AnimatePresence>
              {orderSuccess && (
                <motion.div
                  className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center gap-6 p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-[#d4af37] flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  >
                    <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-serif text-2xl text-zinc-900 mb-2">Siparişiniz Alındı!</h3>
                    <p className="text-xs text-zinc-400 tracking-widest leading-relaxed max-w-xs mx-auto">
                      Zeray Gold ekibi en kısa sürede sizinle iletişime geçecektir. Teşekkürler! ✦
                    </p>
                  </motion.div>
                  <div className="w-12 h-[1px] bg-[#d4af37]/50" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}


      {/* HESABIM (GİRİŞ/KAYIT) MODALI */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full shadow-2xl p-8 md:p-12 relative border border-gold/10 rounded-sm">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-5 right-5 text-3xl text-zinc-400 hover:text-gold transition-colors font-light leading-none">&times;</button>
            <div className="text-center mb-8 relative">
              <div className="w-12 h-[1px] bg-gold mx-auto mb-6"></div>
              <h2 className="font-serif tracking-[0.25em] text-2xl text-dark">HESABIM</h2>
            </div>

            <div className="flex w-full mb-8 border-b border-zinc-100 relative">
              <div className={`absolute bottom-0 w-1/2 h-[2px] bg-gold transition-transform duration-500 ease-in-out ${authMode === 'login' ? 'translate-x-0' : 'translate-x-full'}`}></div>
              <button
                className={`flex-1 pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${authMode === 'login' ? 'text-dark' : 'text-zinc-400 hover:text-dark'}`}
                onClick={() => setAuthMode('login')}
              >
                Giriş Yap
              </button>
              <button
                className={`flex-1 pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${authMode === 'register' ? 'text-dark' : 'text-zinc-400 hover:text-dark'}`}
                onClick={() => setAuthMode('register')}
              >
                Kayıt Ol
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5 animate-fade-in relative z-10">
              {authMode === 'register' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ad Soyad*"
                    required
                    value={authForm.fullName}
                    onChange={e => setAuthForm({ ...authForm, fullName: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer"
                  />
                </div>
              )}
              <div className="relative">
                <input
                  type="email"
                  placeholder="E-Posta*"
                  required
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer"
                />
              </div>
              {authMode === 'register' && (
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Telefon*"
                    required
                    value={authForm.phone}
                    onChange={e => setAuthForm({ ...authForm, phone: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 text-xs outline-none focus:border-gold focus:bg-white transition-all peer"
                  />
                </div>
              )}
              {authMode === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-[10px] text-zinc-400 hover:text-gold uppercase tracking-widest transition-colors font-medium border-b border-transparent hover:border-gold pb-0.5">Şifremi Unuttum</a>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-zinc-900 to-black text-white mt-4 py-5 text-[11px] font-bold tracking-[0.3em] shadow-xl hover:from-gold-dark hover:to-gold transition-all duration-500 disabled:opacity-50 uppercase relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <span className="relative z-10">{isSubmitting ? 'İŞLENİYOR...' : (authMode === 'login' ? 'GİRİŞ YAP' : 'KAYIT OL')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
