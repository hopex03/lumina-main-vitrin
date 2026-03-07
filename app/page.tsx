'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Sayfalar arası geçiş için Next.js Link componenti
import { supabase } from './lib/supabase';

const formatPrice = (price: any) =>
  Number(price).toLocaleString('tr-TR') + ' ₺';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');

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

  // BAŞLANGIÇ YÜKLEMELERİ (SEPET & URL PARAMETRELERİ)
  useEffect(() => {
    const storedCart = localStorage.getItem('lumina_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }
    const storedWishlist = localStorage.getItem('lumina_wishlist');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
    if (typeof window !== 'undefined' && window.location.search.includes('cart_open=true')) {
      setIsCartOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // SUPABASE'DEN GERÇEK ÜRÜNLERİ ÇEKME
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Yayımlanmış')
        .order('id', { ascending: false });

      if (data) setAllProducts(data);
    };
    fetchProducts();
  }, []);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2000&q=80',
      content: (
        <div className="text-center px-4">
          <p className="text-white text-3xl md:text-5xl font-serif max-w-3xl drop-shadow-2xl mb-6">
            Işıltınızı Keşfedin.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Hepsi');
              window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
            }}
            className="bg-white text-dark px-10 py-3 text-xs font-bold tracking-[0.2em] hover:bg-gold hover:text-white transition-all duration-300"
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
        <div className="absolute bottom-12 md:bottom-24 left-0 w-full flex justify-center">
          <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 shadow-2xl text-center border-t-2 border-gold max-w-lg mx-6">
            <h2 className="text-gold text-[10px] font-bold mb-3 uppercase tracking-[0.3em]">
              Lumina Ayrıcalığı
            </h2>
            <div className="text-dark text-xl md:text-2xl font-serif mb-4 leading-relaxed">
              Zamana Meydan Okuyan<br />Pırlanta İşçiliği
            </div>
            <p className="text-gray-500 text-xs font-medium tracking-widest uppercase mb-0">
              Uluslararası HRD & GIA Sertifikalı
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
    localStorage.setItem('lumina_cart', JSON.stringify(newCart));
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
    if (quantity < 1) return;
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
    localStorage.setItem('lumina_wishlist', JSON.stringify(updatedWishlist));
  };

  // --- SİPARİŞ & ÜYELİK İŞLEMLERİ ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email) return alert("E-Posta zorunludur.");
    if (authMode === 'register') {
      if (!authForm.fullName) return alert("Ad Soyad zorunludur.");
      if (!authForm.phone) return alert("Telefon zorunludur.");
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
      return alert("Lütfen zorunlu iletişim ve adres alanlarını doldurunuz.");
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
        total_amount: totalAmount,
        status: 'Bekliyor',
        shipping_address: addressString
      }]);
      if (oErr) throw oErr;

      alert('Lumina Siparişiniz Alındı! Müşteri temsilcimiz sizinle en kısa sürede iletişime geçecektir.');
      localStorage.removeItem('lumina_cart');
      setCart([]);
      setIsCheckoutOpen(false);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert("Sipariş oluşturulurken bir hata oluştu.");
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
    <div className="min-h-screen bg-white text-dark font-sans">
      {/* TEPEDEKİ SİYAH/ALTIN BAR */}
      <div className="bg-dark text-gold-light text-[10px] md:text-[11px] text-center py-2.5 tracking-[0.25em] font-bold uppercase">
        Online Özel: Ücretsiz & Sigortalı Teslimat Özel Kutusunda
      </div>

      {/* HEADER */}
      <header className="pt-6 pb-4 px-6 md:px-12 sticky top-0 bg-white z-[60] border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
          <div className="flex-1 hidden md:flex gap-4 text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
            <Link href="/iletisim" className="hover:text-gold transition-colors">İletişim</Link>
          </div>

          <div className="text-3xl md:text-5xl font-serif tracking-[0.2em] text-center flex-1 text-dark">
            <Link href="/" className="hover:text-gold-dark transition-colors">
              LUMINA
            </Link>
          </div>

          <div className="flex-1 flex justify-end gap-6">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1.5 hover:text-gold transition-colors hidden md:flex"
            >
              HESABIM
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 hover:text-gold transition-colors relative"
            >
              SEPETİM {totalItems > 0 && <span className="bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center absolute -top-2 -right-3">{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* MEGA MENÜ KATEGORİ LİSTESİ (BASİTLEŞTİRİLMİŞ) */}
        <div className="flex justify-center gap-6 md:gap-12 overflow-x-auto text-[11px] font-bold tracking-[0.15em] uppercase pb-2 scrollbar-hide border-t border-gray-50 pt-5">
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

      {/* SAĞ SEPET ÇEKMECESİ */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50">
            <h2 className="font-serif tracking-widest text-lg">
              ALIŞVERİŞ SEPETİ
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-2xl hover:text-gray-500"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p className="mb-4">Sepetiniz şu an boş.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs font-bold tracking-widest border-b border-black pb-1 text-black"
                >
                  ALIŞVERİŞE BAŞLA
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-gray-100 pb-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-gray-50"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider">
                          {item.name}
                        </h3>
                        <p className="text-sm font-medium mt-1">
                          {item.sale_price
                            ? formatPrice(item.sale_price)
                            : formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-gray-400 hover:text-red-600 underline"
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
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex justify-between mb-3 text-sm text-gray-500">
                <span>Ara Toplam:</span>
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
                  <div className="flex justify-between mb-4 text-sm font-semibold text-[#cc0000]">
                    <span>İndirim Kazancınız:</span>
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

              <div className="flex justify-between mb-6 text-xl font-serif font-bold text-dark border-t border-gray-100 pt-4">
                <span>Genel Toplam:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-dark text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-gold-dark transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                GÜVENLİ ÖDEMEYE GEÇ
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </button>

              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 text-gray-400 text-xl">
                  {/* Ödeme Yöntemi İkonları (Sembolik) */}
                  <i className="fab fa-cc-visa" title="Visa"></i>
                  <i className="fab fa-cc-mastercard" title="Mastercard"></i>
                  <span className="text-[10px] font-bold tracking-widest text-dark border border-gray-200 px-2 py-0.5 rounded uppercase">256-Bit SSL</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Lumina Sigortalı Kargo Güvencesiyle
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AFİŞ (SLIDER) */}
      <main className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img src={slide.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {slide.content}
            </div>
          </div>
        ))}
      </main>

      {/* ÜRÜNLER VİTRİNİ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif text-center mb-12 underline underline-offset-8 uppercase">
          {selectedCategory} KOLEKSİYONU
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400 font-bold tracking-widest uppercase">
              Koleksiyon yükleniyor...
            </div>
          ) : (
            (selectedCategory === 'Hepsi'
              ? allProducts
              : allProducts.filter((p) => p.category === selectedCategory)
            ).map((product) => (
              <div
                key={product.id}
                className="group border border-gray-100 p-3 hover:shadow-xl transition-all flex flex-col bg-white relative"
              >
                {/* FAVORİ İKONU (WİSHLİST) */}
                <button
                  onClick={(e) => toggleWishlist(product, e)}
                  className="absolute top-4 right-4 z-20 text-gray-300 hover:text-red-500 transition-colors drop-shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={wishlist.some(w => w.id === product.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-5 h-5 ${wishlist.some(w => w.id === product.id) ? "text-red-500" : "text-gray-400"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                {/* --- DETAY SAYFASINA GİDEN TIKLANABİLİR GÖRSEL --- */}
                <Link
                  href={`/urun/${product.id}`}
                  className="relative aspect-square overflow-hidden mb-4 bg-gray-50 block cursor-pointer group/image"
                >
                  {product.sale_price && (
                    <span className="absolute top-2 left-2 z-10 bg-[#cc0000] text-white text-[8px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
                      İNDİRİM
                    </span>
                  )}
                  {/* Birinci Görsel */}
                  <img
                    src={product.image}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 mix-blend-multiply ${product.image2 ? 'group-hover/image:opacity-0' : 'group-hover/image:scale-105'}`}
                  />
                  {/* İkinci Görsel (Hover) */}
                  {product.image2 && (
                    <img
                      src={product.image2}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/image:opacity-100 transition-all duration-700 mix-blend-multiply group-hover/image:scale-105"
                    />
                  )}
                </Link>

                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    {/* --- DETAY SAYFASINA GİDEN TIKLANABİLİR İSİM --- */}
                    <Link
                      href={`/urun/${product.id}`}
                      className="block text-[11px] font-medium uppercase mb-1 text-gray-700 hover:text-black hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="font-bold mb-3">
                      {product.sale_price ? (
                        <span>
                          <del className="text-gray-400 font-normal mr-2 text-xs">
                            {formatPrice(product.price)}
                          </del>
                          {formatPrice(product.sale_price)}
                        </span>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </p>
                  </div>

                  {/* SEPETE EKLE BUTONU */}
                  {product.stock > 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-white border border-black text-black py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors mb-2"
                    >
                      SEPETE EKLE
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 text-gray-400 py-2.5 text-[10px] font-bold tracking-widest uppercase mb-2 cursor-not-allowed"
                    >
                      STOKTA YOK
                    </button>
                  )}

                  <div className="text-[8px] text-gray-400 font-bold border-t border-gray-50 pt-1.5 uppercase tracking-tighter">
                    Özel Ücretsiz ve Sigortalı Teslimat
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="bg-zinc-50 pt-20 pb-10 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-serif tracking-[0.2em] mb-6 text-dark">LUMINA</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6 pe-4">
                Her detayında zarif bir ustalık barındıran sessiz lüks koleksiyonlarımızla, en özel anlarınıza zamansız bir ışıltı katıyoruz. Sadece size özel hissettirecek bu ayrıcalığı keşfedin.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300 cursor-pointer">In</div>
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300 cursor-pointer">Fb</div>
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300 cursor-pointer">Tw</div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-widest uppercase mb-6 text-dark">Markamız</h4>
              <ul className="flex flex-col gap-3 text-xs text-gray-500">
                <li><Link href="/" className="hover:text-gold transition-colors">Biz Kimiz?</Link></li>
                <li><Link href="/iletisim" className="hover:text-gold transition-colors">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-widest uppercase mb-6 text-dark">Müşteri İlişkileri</h4>
              <ul className="flex flex-col gap-3 text-xs text-gray-500">
                <li><Link href="/" className="hover:text-gold transition-colors">İade ve Değişim</Link></li>
                <li><Link href="/" className="hover:text-gold transition-colors">Teslimat Bilgileri</Link></li>
                <li><Link href="/" className="hover:text-gold transition-colors">Bakım ve Garanti</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-widest uppercase mb-6 text-dark">Güvenli Alışveriş</h4>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Tüm siparişleriniz size özel muhafaza edilerek sigortalı kurye ile ücretsiz teslim edilmektedir.
              </p>
              <div className="flex gap-3 items-center opacity-70 grayscale">
                <div className="text-xs font-bold border border-gray-300 px-2 py-1 tracking-wider">SSL</div>
                <div className="text-xs font-bold border border-gray-300 px-2 py-1 tracking-wider">GIA</div>
                <div className="text-xs font-bold border border-gray-300 px-2 py-1 tracking-wider">HRD</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] text-gray-400 tracking-widest uppercase">
              © 2026 LUMINA JEWELRY. TÜM HAKLARI SAKLIDIR.
            </div>
            <div className="flex gap-6 text-[10px] text-gray-400 tracking-widest uppercase">
              <Link href="/" className="hover:text-dark transition-colors">Gizlilik Politikası</Link>
              <Link href="/" className="hover:text-dark transition-colors">Çerez Politikası</Link>
              <Link href="/" className="hover:text-dark transition-colors">Mesafeli Sözleşme</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CHECKOUT (GÜVENLİ ÖDEME) MODALI */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full shadow-2xl relative flex flex-col md:flex-row max-h-[95vh] overflow-hidden">
            {/* Sol: Müşteri Formu */}
            <div className="md:w-3/5 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="font-serif tracking-[0.2em] text-2xl text-dark">GÜVENLİ ÖDEME</h2>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="text-[10px] font-bold border border-gray-300 px-2 py-0.5 tracking-wider uppercase">SSL</div>
                  <div className="text-[10px] font-bold border border-gray-300 px-2 py-0.5 tracking-wider uppercase">PCI DSS</div>
                </div>
              </div>

              <div className="mb-8 animate-fade-in">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-dark flex items-center gap-2">
                  <span className="bg-dark text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">1</span>
                  İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Adınız Soyadınız *" value={checkoutForm.fullName} onChange={e => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                  <input type="email" placeholder="E-Posta Adresiniz *" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                  <input type="tel" placeholder="Telefon Numaranız *" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all md:col-span-2" />
                </div>
              </div>

              <div className="mb-8 animate-fade-in">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-dark flex items-center gap-2">
                  <span className="bg-dark text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">2</span>
                  Teslimat Adresi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="İl *" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                  <input type="text" placeholder="İlçe *" value={checkoutForm.district} onChange={e => setCheckoutForm({ ...checkoutForm, district: e.target.value })} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                  <textarea placeholder="Açık Adres *" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} rows={3} className="p-3 border border-gray-200 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all md:col-span-2 resize-none"></textarea>
                </div>
              </div>

              <div className="animate-fade-in">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-dark flex items-center gap-2">
                  <span className="bg-dark text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">3</span>
                  Ödeme Seçimi
                </h3>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer border-2 border-dark p-4 flex-1">
                    <input type="radio" name="payment" defaultChecked className="accent-dark" />
                    <span className="text-xs font-bold uppercase tracking-widest text-dark">Kredi Kartı</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-4 flex-1 opacity-50 bg-gray-50">
                    <input type="radio" name="payment" disabled />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Havale <br />(Yakında)</span>
                  </label>
                </div>
                <div className="bg-white p-6 border border-gray-200 relative overflow-hidden group">
                  <input type="text" placeholder="Kart Numarası" className="w-full p-3 mb-4 border border-gray-200 text-xs outline-none font-mono focus:border-dark transition-colors bg-gray-50/50" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="AA/YY" className="w-1/2 p-3 border border-gray-200 text-xs outline-none font-mono focus:border-dark transition-colors bg-gray-50/50" />
                    <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-200 text-xs outline-none font-mono focus:border-dark transition-colors bg-gray-50/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Sipariş Özeti */}
            <div className="md:w-2/5 bg-gray-50 p-8 border-l border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold tracking-widest uppercase text-xs text-dark">Sipariş Özeti</h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-2xl text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                </div>
                <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-200" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.quantity} Adet</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>Ara Toplam</span>
                    <span>{formatPrice(cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#cc0000] font-bold">
                    <span>İndirim</span>
                    <span>-{formatPrice(cart.reduce((total, item) => total + (Number(item.price) - (item.sale_price ? Number(item.sale_price) : Number(item.price))) * item.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-medium pb-4 border-b border-gray-200">
                    <span>Sigortalı Kargo</span>
                    <span className="text-dark font-bold">ÜCRETSİZ</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Genel Toplam</span>
                  <span className="text-3xl font-serif font-black text-dark">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-dark text-white py-4 text-xs font-bold tracking-[0.2em] shadow-2xl hover:bg-gold-dark transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? 'SİPARİŞ İŞLENİYOR...' : 'SİPARİŞİ TAMAMLA'}
                </button>
                <p className="text-[9px] text-gray-400 text-center mt-4">Siparişi Tamamla'ya tıklayarak Mesafeli Satış Sözleşmesi'ni kabul etmiş olursunuz.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HESABIM (GİRİŞ/KAYIT) MODALI */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full shadow-2xl p-8 relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-dark transition-colors">&times;</button>
            <h2 className="font-serif tracking-[0.2em] text-2xl text-dark mb-6 text-center">HESABIM</h2>

            <div className="flex w-full mb-8 border-b border-gray-200">
              <button
                className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-all ${authMode === 'login' ? 'text-dark border-b-2 border-dark' : 'text-gray-400 hover:text-dark'}`}
                onClick={() => setAuthMode('login')}
              >
                Giriş Yap
              </button>
              <button
                className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-all ${authMode === 'register' ? 'text-dark border-b-2 border-dark' : 'text-gray-400 hover:text-dark'}`}
                onClick={() => setAuthMode('register')}
              >
                Kayıt Ol
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 animate-fade-in">
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Ad Soyad*"
                  required
                  value={authForm.fullName}
                  onChange={e => setAuthForm({ ...authForm, fullName: e.target.value })}
                  className="p-3 border border-gray-200 text-xs outline-none focus:border-gold transition-all"
                />
              )}
              <input
                type="email"
                placeholder="E-Posta*"
                required
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                className="p-3 border border-gray-200 text-xs outline-none focus:border-gold transition-all"
              />
              {authMode === 'register' && (
                <input
                  type="tel"
                  placeholder="Telefon*"
                  required
                  value={authForm.phone}
                  onChange={e => setAuthForm({ ...authForm, phone: e.target.value })}
                  className="p-3 border border-gray-200 text-xs outline-none focus:border-gold transition-all"
                />
              )}
              {authMode === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-[10px] text-gray-400 hover:text-dark underline transition-colors">Şifremi Unuttum</a>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dark text-white mt-4 py-4 text-xs font-bold tracking-[0.2em] shadow-2xl hover:bg-gold-dark transition-all duration-300 disabled:opacity-50 uppercase"
              >
                {isSubmitting ? 'İŞLENİYOR...' : (authMode === 'login' ? 'GİRİŞ YAP' : 'KAYIT OL')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
