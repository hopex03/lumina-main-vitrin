'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = 'Zeray2026!';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('urunler');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('zeray_admin_auth') === 'ok') {
      setIsAuthenticated(true);
    }
  }, []);

  // --- ÜRÜN YÖNETİMİ STATE'LERİ ---
  const [quickEditId, setQuickEditId] = useState<number | null>(null);
  const [fullEditData, setFullEditData] = useState<any | 'new' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  // --- GERÇEK VERİTABANI STATE'LERİ (Artık İçi Boş Başlıyor, Supabase'den Dolacak) ---
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const categoryList = ['Saat', 'Bileklik', 'Kolye', 'Yüzük', 'Küpe'];

  // --- 1. SUPABASE'DEN VERİLERİ ÇEKME (SİTE AÇILINCA ÇALIŞIR) ---
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchMessages();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    // Supabase'den ürünleri çek (En son eklenen en üstte çıksın diye id'ye göre tersten sıraladık)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Ürünler çekilirken hata:', error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data || []);
    } else {
      console.error("Siparişler çekilemedi:", error);
    }
    setIsLoading(false);
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setCustomers(data || []);
    }
    setIsLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setMessages(data);
      setUnreadCount(data.filter((m: any) => !m.is_read).length);
    }
  };

  const markAsRead = async (id: number) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- 2. SUPABASE ÜRÜN SİLME ---
  const deleteProduct = async (id: number) => {
    if (confirm('Bu ürünü tamamen silmek istediğinize emin misiniz? (Geri alınamaz!)')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) { showToast('❌ Silme hata: ' + error.message, 'err'); return; }
      setProducts(products.filter((p) => p.id !== id));
      if (quickEditId === id) setQuickEditId(null);
      showToast('✅ Ürün silindi.');
    }
  };

  // --- 3. SUPABASE HIZLI DÜZENLEME ---
  const handleQuickEditSave = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const salePriceRaw = formData.get('salePrice') as string;
    const updatedData = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      sale_price: salePriceRaw !== '' ? salePriceRaw : null,  // FIX: empty string → null
      stock: parseInt(formData.get('stock') as string) || 0,
      status: formData.get('status') as string,
    };
    const { error } = await supabase.from('products').update(updatedData).eq('id', id);
    if (error) { showToast('❌ Güncelleme hata: ' + error.message, 'err'); return; }
    showToast('✅ Ürün güncellendi.');
    fetchProducts();
    setQuickEditId(null);
  };

  // --- 4. SUPABASE TAM EKRAN (YENİ ÜRÜN / DÜZENLEME) ---
  const handleFullEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedCategory = (formData.get('category') as string) || 'Kolye';
    const finalStock = parseInt(formData.get('stock') as string) || 0;
    const salePriceRaw = formData.get('salePrice') as string;

    // Use imageUrl (from Storage upload or manual paste) or fall back to existing image
    const finalImage =
      imageUrl.trim() ||
      (fullEditData !== 'new' ? fullEditData.image : '') ||
      '';

    if (!finalImage) {
      showToast('⚠️ Bir görsel seçin veya URL girin.', 'err');
      return;
    }

    const productData: any = {
      name: (formData.get('name') as string) || 'İsimsiz Ürün',
      category: selectedCategory,
      vendor_name: (formData.get('vendor_name') as string) || 'Zeray Gold Özel',
      price: (formData.get('price') as string) || '0',
      sale_price: salePriceRaw !== '' ? salePriceRaw : null,
      stock: finalStock,
      status: (formData.get('status') as string) || 'Yayımlanmış',
      description: formData.get('description') as string,
      metal: formData.get('metal') as string,
      gram: formData.get('gram') as string,
      image: finalImage,
    };

    let error: any;
    if (fullEditData === 'new') {
      // BUG FIX: only generate slug on INSERT, not update
      productData.slug = 'urun-' + Math.floor(Math.random() * 100000);
      productData.sku = 'LMN-' + Math.floor(Math.random() * 10000);
      const res = await supabase.from('products').insert([productData]);
      error = res.error;
    } else {
      // BUG FIX: preserve existing slug + sku on update
      const res = await supabase.from('products').update(productData).eq('id', fullEditData.id);
      error = res.error;
    }

    if (error) { showToast('❌ Kaydetme hata: ' + error.message, 'err'); return; }
    showToast(fullEditData === 'new' ? '✅ Yeni ürün eklendi!' : '✅ Ürün güncellendi!');
    fetchProducts();
    setFullEditData(null);
    setUploadedImage(null);
    setImageUrl('');
  };

  // --- GÖRSEL YÜKLEME: Base64 Çeviri (Kalıcı Saklama) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    showToast('⏳ Görsel işleniyor...', 'ok');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setUploadedImage(null);
      setIsUploading(false);
      showToast('✅ Görsel kalıcı olarak eklendi!', 'ok');
    };
    reader.onerror = () => {
      showToast('❌ Görsel okuma hatası!', 'err');
      setIsUploading(false);
    };

    // Read the image file as a data URL.
    reader.readAsDataURL(file);
  };

  const openFullEdit = (data: any) => {
    setFullEditData(data);
    setUploadedImage(null);
    setImageUrl(data !== 'new' ? (data.image || '') : '');
  };

  const displayImage = imageUrl.trim() || uploadedImage || (fullEditData !== 'new' ? fullEditData?.image : null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1d2327] flex items-center justify-center">
        <div className="bg-[#2c3338] border border-[#3c434a] p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-3xl font-serif tracking-[0.3em] text-white mb-1">ZERAY GOLD</div>
            <div className="text-[#72aee6] text-[11px] tracking-[0.25em] uppercase font-bold">Admin Panel</div>
          </div>
          <div className="mb-4">
            <label className="block text-[#a7aaad] text-[11px] uppercase tracking-wider mb-2 font-bold">Parola</label>
            <input
              type="password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (pwInput === ADMIN_PASSWORD) {
                    sessionStorage.setItem('zeray_admin_auth', 'ok');
                    setIsAuthenticated(true);
                  } else {
                    setPwError(true);
                    setPwInput('');
                  }
                }
              }}
              placeholder="••••••••••••"
              className="w-full p-3 bg-[#1d2327] border border-[#3c434a] text-white text-sm outline-none focus:border-[#2271b1] placeholder-zinc-600"
              autoFocus
            />
            {pwError && <p className="text-red-400 text-xs mt-2 tracking-wide">Hatalı parola.</p>}
          </div>
          <button
            onClick={() => {
              if (pwInput === ADMIN_PASSWORD) {
                sessionStorage.setItem('zeray_admin_auth', 'ok');
                setIsAuthenticated(true);
              } else {
                setPwError(true);
                setPwInput('');
              }
            }}
            className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white py-3 text-[12px] font-bold tracking-wider uppercase transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen flex bg-[#f0f0f1] font-sans text-[13px] text-[#3c434a]">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[999] px-5 py-3 rounded-sm shadow-2xl text-white font-bold text-[13px] transition-all animate-fade-in ${toast.type === 'ok' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {toast.msg}
        </div>
      )}
      {/* === SOL MENÜ === */}
      <aside className="w-[160px] md:w-[200px] bg-[#1d2327] text-white flex flex-col z-20 shrink-0">
        <div className="h-12 flex items-center px-4 bg-[#2c3338] font-bold text-sm tracking-wider">
          ZERAY GOLD ADMIN
        </div>
        <nav className="flex-1 py-4 flex flex-col">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setFullEditData(null);
            }}
            className={`text-left px-4 py-2.5 hover:text-[#72aee6] transition-colors ${activeTab === 'dashboard'
              ? 'bg-[#2271b1] text-white font-semibold'
              : 'text-[#f0f0f1]'
              }`}
          >
            📊 Dashboard
          </button>
          <div className="mt-4 mb-1 px-4 text-[#a7aaad] text-[11px] font-bold uppercase tracking-wider">
            Katalog
          </div>
          <button
            onClick={() => {
              setActiveTab('urunler');
              setFullEditData(null);
            }}
            className={`text-left px-4 py-2.5 hover:text-[#72aee6] transition-colors ${activeTab === 'urunler'
              ? 'bg-[#2271b1] text-white font-semibold'
              : 'text-[#f0f0f1]'
              }`}
          >
            📦 Ürünler
          </button>
          <div className="mt-4 mb-1 px-4 text-[#a7aaad] text-[11px] font-bold uppercase tracking-wider">
            WooCommerce
          </div>
          <button
            onClick={() => {
              setActiveTab('siparisler');
              setFullEditData(null);
            }}
            className={`text-left px-4 py-2.5 hover:text-[#72aee6] transition-colors ${activeTab === 'siparisler'
              ? 'bg-[#2271b1] text-white font-semibold'
              : 'text-[#f0f0f1]'
              }`}
          >
            🛒 Siparişler
          </button>
          <button
            onClick={() => {
              setActiveTab('musteriler');
              setFullEditData(null);
            }}
            className={`text-left px-4 py-2.5 hover:text-[#72aee6] transition-colors ${activeTab === 'musteriler'
              ? 'bg-[#2271b1] text-white font-semibold'
              : 'text-[#f0f0f1]'
              }`}
          >
            👥 Müşteriler
          </button>
          <div className="mt-4 mb-1 px-4 text-[#a7aaad] text-[11px] font-bold uppercase tracking-wider">
            İletişim
          </div>
          <button
            onClick={() => { setActiveTab('mesajlar'); setFullEditData(null); }}
            className={`text-left px-4 py-2.5 hover:text-[#72aee6] transition-colors relative ${activeTab === 'mesajlar' ? 'bg-[#2271b1] text-white font-semibold' : 'text-[#f0f0f1]'}`}
          >
            ✉️ Mesajlar
            {unreadCount > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* === SAĞ İÇERİK ALANI === */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Üst Bar */}
        <header className="h-12 bg-white border-b border-[#c3c4c7] flex justify-between items-center px-6 shrink-0">
          <a
            href="/"
            target="_blank"
            className="hover:text-[#2271b1] transition-colors flex items-center gap-1 font-medium"
          >
            🏠 Zeray Gold Vitrin'e Git
          </a>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold tracking-widest text-[10px] uppercase mr-2 border border-green-600 px-2 py-0.5 rounded-sm">
              Supabase Bağlı
            </span>
            <span>
              Merhaba, <strong>Patron</strong>
            </span>
            <div className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
          </div>
        </header>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ========================================== */}
          {/* ÜRÜN YÖNETİMİ SEKMESİ */}
          {/* ========================================== */}
          {activeTab === 'urunler' && (
            <div>
              {fullEditData ? (
                // --- YENİ ÜRÜN / GÖRÜNTÜLE EKRANI ---
                <form
                  onSubmit={handleFullEditSave}
                  className="animate-fade-in pb-20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-[23px] font-normal text-[#1d2327]">
                      {fullEditData === 'new'
                        ? 'Yeni Ürün Ekle'
                        : 'Ürünü Düzenle'}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setFullEditData(null)}
                      className="px-3 py-1 border border-[#2271b1] text-[#2271b1] rounded-[3px] hover:bg-[#f6f7f7]"
                    >
                      ← Listeye Dön
                    </button>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-6">
                    {/* Sol Sütun (Formlar) */}
                    <div className="flex-1 flex flex-col gap-5">
                      <input
                        name="name"
                        type="text"
                        defaultValue={
                          fullEditData !== 'new' ? fullEditData.name : ''
                        }
                        placeholder="Ürün Adı"
                        required
                        className="w-full px-3 py-2 text-lg border border-[#8c8f94] shadow-inner outline-none focus:border-[#2271b1] bg-white font-bold text-gray-800"
                      />

                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] p-2 font-bold text-[#1d2327]">
                          Ürün Açıklaması
                        </div>
                        <textarea
                          name="description"
                          defaultValue={
                            fullEditData !== 'new'
                              ? fullEditData.description
                              : ''
                          }
                          className="w-full h-32 p-3 outline-none resize-y text-[13px] text-gray-700 leading-relaxed"
                          placeholder="Örn: Bolluğun, zenginliğin, aşkın taşı..."
                        ></textarea>
                      </div>

                      {/* Ürün Özellikleri */}
                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] p-3 font-bold text-[#1d2327]">
                          Ürün Özellikleri
                        </div>
                        <div className="p-5">
                          <div className="mb-4">
                            <label className="block font-bold text-gray-700 mb-2">
                              Maden Bilgisi / Ayar
                            </label>
                            <input
                              name="metal"
                              type="text"
                              defaultValue={
                                fullEditData !== 'new' ? fullEditData.metal : ''
                              }
                              placeholder="Örn: 14 Ayar Beyaz Altın, 0.30 Karat Pırlanta"
                              className="w-full md:w-1/2 p-2 border border-[#8c8f94] outline-none focus:border-[#2271b1]"
                            />
                            <p className="text-gray-400 text-xs mt-2 italic">
                              * İlgili ürünün materyal ve varsa taş özelliklerini tek cümleyle buraya yazabilirsiniz.
                            </p>
                          </div>

                          <div className="mb-2">
                            <label className="block font-bold text-gray-700 mb-2">
                              Gramaj (Net Ağırlık)
                            </label>
                            <input
                              name="gram"
                              type="text"
                              defaultValue={
                                fullEditData !== 'new' ? fullEditData.gram : ''
                              }
                              placeholder="Örn: 3.24"
                              className="w-full md:w-1/2 p-2 border border-[#8c8f94] outline-none focus:border-[#2271b1]"
                            />
                            <p className="text-gray-400 text-xs mt-2 italic">
                              * Ürünün gramajını sadece sayı (noktalı) belirterek girebilirsiniz.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] p-3 font-bold text-[#1d2327]">
                          Fiyat ve Stok Verisi
                        </div>
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-40 bg-[#f6f7f7] border-r border-[#c3c4c7] flex flex-row md:flex-col text-[13px] font-semibold text-[#50575e]">
                            <button
                              type="button"
                              className="flex-1 md:flex-none p-3 text-left border-b border-[#c3c4c7] bg-white text-[#2271b1] relative md:after:content-[''] md:after:absolute md:after:left-0 md:after:top-0 md:after:bottom-0 md:after:w-1 md:after:bg-[#2271b1]"
                            >
                              Genel
                            </button>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-center mb-4">
                              <label className="w-40 font-semibold text-gray-600 mb-1 md:mb-0">
                                Normal fiyat (₺)
                              </label>
                              <input
                                name="price"
                                type="number"
                                required
                                defaultValue={
                                  fullEditData !== 'new'
                                    ? fullEditData.price
                                    : ''
                                }
                                className="w-full md:w-1/2 p-2 border border-[#8c8f94] outline-none focus:border-[#2271b1]"
                              />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center mb-4">
                              <label className="w-40 font-semibold text-gray-600 mb-1 md:mb-0">
                                İndirimli fiyat (₺)
                              </label>
                              <input
                                name="salePrice"
                                type="number"
                                defaultValue={
                                  fullEditData !== 'new'
                                    ? fullEditData.sale_price
                                    : ''
                                }
                                className="w-full md:w-1/2 p-2 border border-[#8c8f94] outline-none focus:border-[#2271b1]"
                              />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center border-t border-gray-100 pt-4 mt-2">
                              <label className="w-40 font-semibold text-gray-600 mb-1 md:mb-0">
                                Stok Adedi
                              </label>
                              <div className="flex items-center w-full md:w-1/2">
                                <input
                                  name="stock"
                                  type="number"
                                  required
                                  defaultValue={
                                    fullEditData !== 'new'
                                      ? fullEditData.stock
                                      : 10
                                  }
                                  className="w-24 p-2 border border-[#8c8f94] outline-none focus:border-[#2271b1]"
                                />
                                <span className="text-gray-400 ml-3 text-xs italic">
                                  Sıfır ise stokta yok sayılır
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sağ Sütun */}
                    <div className="w-full xl:w-72 flex flex-col gap-5">
                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="border-b border-[#c3c4c7] p-3 font-bold text-[#1d2327]">
                          Yayımla
                        </div>
                        <div className="p-3 text-gray-600">
                          <label className="font-semibold mr-2 block mb-2">Tedarikçi (Kuyumcu):</label>
                          <select
                            name="vendor_name"
                            defaultValue={
                              fullEditData !== 'new'
                                ? (fullEditData.vendor_name || 'Zeray Gold Özel')
                                : 'Zeray Gold Özel'
                            }
                            className="p-2 border border-gray-300 w-full mb-4"
                          >
                            <option value="Zeray Gold Özel">Zeray Gold Özel</option>
                            <option value="Kuyumcu A">Kuyumcu A</option>
                            <option value="Kuyumcu B">Kuyumcu B</option>
                          </select>

                          <label className="font-semibold mr-2 block mb-2">Durum:</label>
                          <select
                            name="status"
                            defaultValue={
                              fullEditData !== 'new'
                                ? fullEditData.status
                                : 'Yayımlanmış'
                            }
                            className="p-2 border border-gray-300 w-full"
                          >
                            <option>Yayımlanmış</option>
                            <option>Taslak</option>
                          </select>
                        </div>
                        <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] p-3 flex justify-between items-center">
                          {fullEditData !== 'new' && (
                            <button
                              type="button"
                              onClick={() => deleteProduct(fullEditData.id)}
                              className="text-red-600 hover:underline"
                            >
                              Çöpe taşı
                            </button>
                          )}
                          <button
                            type="submit"
                            className="bg-[#2271b1] text-white px-4 py-1.5 rounded-[3px] hover:bg-[#135e96] font-bold ml-auto"
                          >
                            {fullEditData === 'new' ? 'Yayımla' : 'Güncelle'}
                          </button>
                        </div>
                      </div>

                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="border-b border-[#c3c4c7] p-3 font-bold text-[#1d2327]">
                          Ürün Kategorileri
                        </div>
                        {/* BUG FIX: use key to force re-render when product changes, fixing stale defaultChecked */}
                        <div className="p-4 flex flex-col gap-3" key={fullEditData === 'new' ? 'new' : fullEditData?.id}>
                          {categoryList.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={cat}
                                defaultChecked={
                                  fullEditData !== 'new'
                                    ? fullEditData.category === cat
                                    : cat === 'Yüzük'
                                }
                                className="w-4 h-4 text-[#2271b1] cursor-pointer"
                              />
                              <span className="text-gray-700 font-medium">{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* GÖRSEL — URL veya dosya */}
                      <div className="border border-[#c3c4c7] bg-white shadow-sm">
                        <div className="border-b border-[#c3c4c7] p-3 font-bold text-[#1d2327]">Ürün Görselleri</div>
                        <div className="p-4 text-center">
                          {displayImage ? (
                            <img src={displayImage} alt="ürün" className="w-full h-auto max-h-48 object-contain mb-3 border border-gray-200" />
                          ) : (
                            <div className="w-full h-32 bg-[#f0f0f1] border border-dashed border-[#8c8f94] flex items-center justify-center text-gray-400 mb-3">
                              Ana Görsel Seçilmedi
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder="Görsel URL'si yapıştır..."
                            value={imageUrl}
                            onChange={(e) => { setImageUrl(e.target.value); setUploadedImage(null); }}
                            className="w-full p-2 border border-[#8c8f94] text-xs outline-none focus:border-[#2271b1] mb-3"
                          />
                          <label className={`cursor-pointer block text-[13px] font-medium mb-3 ${isUploading ? 'text-gray-400' : 'text-[#2271b1] hover:underline'}`}>
                            {isUploading ? '⏳ Yükleniyor...' : 'Ya da Dosyadan Seç'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                          </label>
                          {displayImage && (
                            <button type="button" onClick={() => { setUploadedImage(null); setImageUrl(''); }} className="text-red-600 hover:underline mb-4 text-xs block mx-auto">
                              Görseli Kaldır
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Ekstra görsel kolonları (image2, image3) DB şemasında olmadığı için devre dışı */}

                    </div>{/* end sağ sütun */}
                  </div>{/* end xl:flex-row */}
                </form>
              ) : (
                // --- ÜRÜN LİSTESİ ---
                <div className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-[23px] font-normal text-[#1d2327]">
                      Ürünler
                    </h1>
                    <button
                      onClick={() => openFullEdit('new')}
                      className="px-3 py-1 border border-[#2271b1] text-[#2271b1] rounded-[3px] hover:bg-[#f6f7f7] text-[13px]"
                    >
                      Yeni Ekle
                    </button>
                  </div>
                  <div className="bg-white border border-[#c3c4c7] shadow-[0_1px_1px_rgba(0,0,0,0.04)] pb-10">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#c3c4c7] text-[#2c3338] font-bold bg-[#f6f7f7]">
                          <th className="p-3 w-16 text-center">Görsel</th>
                          <th className="p-3">İsim</th>
                          <th className="p-3">Kategori</th>
                          <th className="p-3">Tedarikçi</th>
                          <th className="p-3">Stok</th>
                          <th className="p-3">Fiyat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-gray-500 font-bold"
                            >
                              Veritabanından ürünler yükleniyor...
                            </td>
                          </tr>
                        ) : products.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-gray-500"
                            >
                              Henüz hiç ürün eklemediniz. "Yeni Ekle" butonuna
                              basın.
                            </td>
                          </tr>
                        ) : (
                          products.map((p) => (
                            <React.Fragment key={p.id}>
                              <tr className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7] group">
                                <td className="p-3 align-top text-center">
                                  <img
                                    src={p.image}
                                    className="w-10 h-10 object-cover border border-[#c3c4c7] mx-auto"
                                    alt={p.name}
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <div
                                    className="font-bold text-[#2271b1] text-[14px] leading-tight mb-1 cursor-pointer hover:underline"
                                    onClick={() => openFullEdit(p)}
                                  >
                                    {p.name}
                                  </div>
                                  <div className="text-[12px] text-gray-500 flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() =>
                                        setQuickEditId(
                                          quickEditId === p.id ? null : p.id
                                        )
                                      }
                                      className="text-[#2271b1] hover:underline"
                                    >
                                      Hızlı düzenle
                                    </button>{' '}
                                    |
                                    <button
                                      onClick={() => deleteProduct(p.id)}
                                      className="text-red-600 hover:underline"
                                    >
                                      Çöp
                                    </button>{' '}
                                    |
                                    <button
                                      onClick={() => openFullEdit(p)}
                                      className="text-[#2271b1] hover:underline"
                                    >
                                      Görüntüle
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 align-top font-semibold text-gray-600">
                                  {p.category}
                                </td>
                                <td className="p-3 align-top">
                                  <span className="text-[11px] uppercase tracking-wider font-bold bg-[#f0f0f1] px-2 py-1 rounded-sm text-zinc-600">
                                    {p.vendor_name || 'Zeray Gold Özel'}
                                  </span>
                                </td>
                                <td className="p-3 align-top">
                                  <span
                                    className={
                                      p.stock > 0
                                        ? 'text-green-600 font-bold'
                                        : 'text-red-600 font-bold'
                                    }
                                  >
                                    {p.stock > 0
                                      ? `Stokta (${p.stock})`
                                      : 'Stokta yok'}
                                  </span>
                                </td>
                                <td className="p-3 align-top font-medium text-gray-700">
                                  {p.sale_price ? (
                                    <span>
                                      <del className="text-gray-400 font-normal mr-1">
                                        {p.price} ₺
                                      </del>
                                      {p.sale_price} ₺
                                    </span>
                                  ) : (
                                    <span>{p.price} ₺</span>
                                  )}
                                </td>
                              </tr>

                              {/* HIZLI DÜZENLEME FORMU */}
                              {quickEditId === p.id && (
                                <tr className="bg-[#f6f7f7] border-b-2 border-gray-300">
                                  <td colSpan={5} className="p-0">
                                    <form
                                      onSubmit={(e) =>
                                        handleQuickEditSave(e, p.id)
                                      }
                                      className="p-6"
                                    >
                                      <h3 className="font-bold text-[#1d2327] mb-4">
                                        HIZLI DÜZENLE
                                      </h3>
                                      <div className="flex flex-col gap-3 max-w-md">
                                        <div className="flex items-center">
                                          <label className="w-24 text-gray-600 font-semibold">
                                            Başlık
                                          </label>
                                          <input
                                            name="name"
                                            type="text"
                                            defaultValue={p.name}
                                            required
                                            className="flex-1 p-1.5 border border-[#8c8f94] outline-none focus:border-[#2271b1] bg-white"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-24 text-gray-600 font-semibold">
                                            Fiyat
                                          </label>
                                          <input
                                            name="price"
                                            type="number"
                                            defaultValue={p.price}
                                            required
                                            className="flex-1 p-1.5 border border-[#8c8f94] outline-none focus:border-[#2271b1] bg-white"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-24 text-gray-600 font-semibold">
                                            İndirim
                                          </label>
                                          <input
                                            name="salePrice"
                                            type="number"
                                            defaultValue={p.sale_price}
                                            className="flex-1 p-1.5 border border-[#8c8f94] outline-none focus:border-[#2271b1] bg-white"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-24 text-gray-600 font-semibold">
                                            Stok Adedi
                                          </label>
                                          <input
                                            name="stock"
                                            type="number"
                                            defaultValue={p.stock}
                                            required
                                            className="flex-1 p-1.5 border border-[#8c8f94] outline-none focus:border-[#2271b1] bg-white"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <label className="w-24 text-gray-600 font-semibold">
                                            Durum
                                          </label>
                                          <select
                                            name="status"
                                            defaultValue={p.status}
                                            className="flex-1 p-1.5 border border-[#8c8f94] outline-none focus:border-[#2271b1] bg-white"
                                          >
                                            <option value="Yayımlanmış">
                                              Yayımlanmış
                                            </option>
                                            <option value="Taslak">
                                              Taslak
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="mt-6 flex gap-2">
                                        <button
                                          type="submit"
                                          className="bg-[#2271b1] text-white px-4 py-1.5 rounded-[3px] font-bold hover:bg-[#135e96]"
                                        >
                                          Güncelle
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setQuickEditId(null)}
                                          className="px-4 py-1.5 border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] rounded-[3px] hover:bg-white"
                                        >
                                          Vazgeç
                                        </button>
                                      </div>
                                    </form>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
          }

          {/* DİĞER SEKMELER */}
          {
            activeTab === 'siparisler' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-[23px] font-normal text-[#1d2327]">Siparişler</h1>
                </div>
                <div className="bg-white border border-[#c3c4c7] shadow-[0_1px_1px_rgba(0,0,0,0.04)] pb-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#c3c4c7] text-[#2c3338] font-bold bg-[#f6f7f7]">
                        <th className="p-3">Sipariş No</th>
                        <th className="p-3">Müşteri</th>
                        <th className="p-3">Tedarikçi / Ürünler</th>
                        <th className="p-3">Tutar</th>
                        <th className="p-3">Tarih</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3 text-right">İletişim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                            Siparişler yükleniyor...
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            Henüz hiç sipariş bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                            <td className="p-3 font-bold text-[#2271b1]">
                              #{order.id}
                            </td>
                            <td className="p-3">{order.customer_name || 'Misafir'}</td>
                            <td className="p-3 text-[11px] text-gray-600">
                              {(() => {
                                try {
                                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                  if (!items || items.length === 0) return '-';
                                  return (
                                    <ul className="flex flex-col gap-2">
                                      {items.map((item: any, idx: number) => (
                                        <li key={idx} className="flex flex-col border border-zinc-150 p-2 bg-zinc-50 rounded-sm">
                                          <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-zinc-800 text-xs">
                                              {item.quantity}x {item.name}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 text-[9px] font-bold uppercase tracking-widest rounded-sm">
                                              Satıcı: {item.vendor_name || 'Zeray Gold Özel'}
                                            </span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  );
                                } catch (e) {
                                  return 'JSON Hata';
                                }
                              })()}
                            </td>
                            <td className="p-3 font-medium text-gray-700">{order.total_amount} ₺</td>
                            <td className="p-3 text-gray-500 text-[12px]">
                              {new Date(order.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="p-3">
                              {/* FIX: live status dropdown that updates Supabase */}
                              <select
                                defaultValue={order.status || 'Bekliyor'}
                                onChange={async (e) => {
                                  await supabase.from('orders').update({ status: e.target.value }).eq('id', order.id);
                                  showToast('✅ Sipariş durumu güncellendi.');
                                  fetchOrders();
                                }}
                                className={`px-2 py-1 text-[11px] font-bold rounded-sm uppercase tracking-wider border-0 cursor-pointer ${order.status === 'Bekliyor' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'Kargolandı' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                <option value="Bekliyor">Bekliyor</option>
                                <option value="Hazırlanıyor">Hazırlanıyor</option>
                                <option value="Kargolandı">Kargolandı</option>
                                <option value="Tamamlandı">Tamamlandı</option>
                                <option value="İptal">İptal</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <a href={`mailto:${order.email}`} className="text-[#2271b1] hover:underline text-[12px]">
                                E-posta Gönder
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            activeTab === 'musteriler' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-[23px] font-normal text-[#1d2327]">Müşteriler</h1>
                </div>
                <div className="bg-white border border-[#c3c4c7] shadow-[0_1px_1px_rgba(0,0,0,0.04)] pb-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#c3c4c7] text-[#2c3338] font-bold bg-[#f6f7f7]">
                        <th className="p-3">Müşteri</th>
                        <th className="p-3">E-posta</th>
                        <th className="p-3">Telefon</th>
                        <th className="p-3">Kayıt Tarihi</th>
                        <th className="p-3 text-right">Toplam Harcama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                            Müşteriler yükleniyor...
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            Henüz kayıtlı müşteri bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                            <td className="p-3 font-bold text-gray-800">
                              {customer.full_name}
                            </td>
                            <td className="p-3 text-[#2271b1]">{customer.email}</td>
                            <td className="p-3 text-gray-600">{customer.phone || '-'}</td>
                            <td className="p-3 text-gray-500 text-[12px]">
                              {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="p-3 text-right font-medium">
                              {customer.total_spent || '0'} ₺
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            activeTab === 'dashboard' && (
              <div className="animate-fade-in">
                <h1 className="text-[23px] font-normal text-[#1d2327] mb-6">Dashboard İstatistikleri</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white border border-[#c3c4c7] p-5 shadow-sm border-l-4 border-l-[#2271b1]">
                    <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">Aylık Ciro</div>
                    <div className="text-3xl font-normal text-[#1d2327]">
                      {orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0).toLocaleString('tr-TR')} ₺
                    </div>
                  </div>
                  <div className="bg-white border border-[#c3c4c7] p-5 shadow-sm border-l-4 border-l-green-500">
                    <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">Toplam Sipariş</div>
                    <div className="text-3xl font-normal text-[#1d2327]">{orders.length}</div>
                  </div>
                  <div className="bg-white border border-[#c3c4c7] p-5 shadow-sm border-l-4 border-l-purple-500">
                    <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">Aktif Müşteri</div>
                    <div className="text-3xl font-normal text-[#1d2327]">{customers.length}</div>
                  </div>
                  <div className="bg-white border border-[#c3c4c7] p-5 shadow-sm border-l-4 border-l-amber-500">
                    <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">Yayındaki Ürün</div>
                    <div className="text-3xl font-normal text-[#1d2327]">{products.length}</div>
                  </div>
                </div>

              </div>
            )
          }
          {/* ===== MESAJLAR TAB ===== */}
          {activeTab === 'mesajlar' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-[23px] font-normal text-[#1d2327]">
                  Gelen Mesajlar
                  {unreadCount > 0 && (
                    <span className="ml-3 bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">{unreadCount} okunmamış</span>
                  )}
                </h1>
                <button onClick={fetchMessages} className="text-[#2271b1] hover:underline text-sm">Yenile</button>
              </div>

              {messages.length === 0 ? (
                <div className="bg-white border border-[#c3c4c7] p-12 text-center text-gray-400">
                  <div className="text-4xl mb-4">✉️</div>
                  <p className="text-sm">Henüz mesaj yok.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      onClick={() => !msg.is_read && markAsRead(msg.id)}
                      className={`bg-white border p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${!msg.is_read ? 'border-l-4 border-l-[#2271b1] border-[#c3c4c7]' : 'border-[#c3c4c7] opacity-70'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#2271b1] shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-[#1d2327] text-sm">{msg.name}</p>
                            <p className="text-xs text-zinc-500">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-1">{msg.subject || 'Genel'}</span>
                          <p className="text-[10px] text-zinc-400">{msg.created_at ? new Date(msg.created_at).toLocaleString('tr-TR') : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-700 leading-relaxed border-t border-zinc-100 pt-3 whitespace-pre-wrap">{msg.message}</p>
                      {!msg.is_read && (
                        <p className="text-[10px] text-[#2271b1] mt-2 text-right">Tıklayarak okundu olarak işaretle →</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div >
      </main >
    </div >
  );
}
