import React from 'react';

export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* HEADER (MENÜ - Sitede gezinmeyi sağlar) */}
      <header className="flex justify-between items-center py-6 px-10 border-b border-gray-100">
        <a
          href="/"
          className="text-sm font-semibold tracking-widest cursor-pointer hover:text-gray-500"
        >
          GÜMÜŞ & ALTIN
        </a>
        <a
          href="/"
          className="text-3xl font-serif tracking-widest text-black cursor-pointer"
        >
          LUMINA
        </a>
        <div className="text-sm font-semibold tracking-widest cursor-pointer hover:text-gray-500">
          SEPETİM (0)
        </div>
      </header>

      {/* ÜRÜN DETAY ALANI (Ana Kısım) */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* SOL TARAF: Büyük Ürün Görseli */}
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/5] overflow-hidden bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f66128e08?auto=format&fit=crop&w=1000&q=80"
                alt="14 Ayar Altın Baget Yüzük"
                className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-1000 cursor-crosshair"
              />
            </div>
          </div>

          {/* SAĞ TARAF: Ürün Bilgileri ve Satın Alma Butonu */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-sm text-gray-400 tracking-widest uppercase font-medium mb-3">
              Yüzük Koleksiyonu
            </p>

            <h1 className="text-4xl font-serif text-gray-900 mb-4 leading-tight">
              14 Ayar Altın Baget Yüzük
            </h1>

            <p className="text-2xl font-medium text-black mb-8">12.500 ₺</p>

            <div className="border-t border-gray-200 py-6 mb-6">
              <p className="text-gray-600 leading-relaxed mb-6">
                Zarafeti ve ışıltıyı bir araya getiren bu özel tasarım baget
                yüzük, 14 ayar altın işçiliği ve özenle seçilmiş taşları
                ile hayat buluyor. Gündüzden geceye her anınıza
                eşlik edecek kusursuz bir parça.
              </p>

              {/* Teknik Detaylar */}
              <ul className="text-sm text-gray-500 space-y-2 mb-8">
                <li>
                  <span className="font-semibold text-gray-900">Maden:</span> 14
                  Ayar Sarı Altın
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Ağırlık:</span>{' '}
                  ~2.45 Gram
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Taş:</span>{' '}
                  Zirkon Baget (Altın Montür)
                </li>
                <li>
                  <span className="font-semibold text-gray-900">
                    Sertifika:
                  </span>{' '}
                  Lumina Orijinallik Belgesi
                </li>
              </ul>
            </div>

            {/* SEPETE EKLE BUTONU */}
            <button className="w-full bg-black text-white py-5 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 duration-200">
              SEPETE EKLE
            </button>

            {/* Güven Verici İkonlar/Metinler */}
            <div className="mt-8 flex items-center justify-between text-xs text-gray-400 font-medium tracking-wide border-t border-gray-100 pt-6">
              <span className="flex items-center gap-2">✓ ÜCRETSİZ KARGO</span>
              <span className="flex items-center gap-2">✓ 14 GÜN İADE</span>
              <span className="flex items-center gap-2">
                ✓ SİGORTALI TESLİMAT
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
