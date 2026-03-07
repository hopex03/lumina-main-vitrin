'use client';
import React, { useState } from 'react';

// --- MOCK VERİTABANI (Şimdilik örnek ürünler) ---
const initialProducts = [
  {
    id: 101,
    name: 'Safir Cam Klasik Saat',
    category: 'Saat',
    price: '45.000 ₺',
    stock: 3,
    status: 'Aktif',
  },
  {
    id: 201,
    name: '18 Ayar Kelepçe Bileklik',
    category: 'Bileklik',
    price: '22.000 ₺',
    stock: 8,
    status: 'Aktif',
  },
  {
    id: 301,
    name: 'Tektaş Pırlanta Kolye',
    category: 'Kolye',
    price: '18.500 ₺',
    stock: 0,
    status: 'Tükendi',
  },
  {
    id: 401,
    name: 'Baget Pırlanta Yüzük',
    category: 'Yüzük',
    price: '15.900 ₺',
    stock: 12,
    status: 'Aktif',
  },
];

export default function UrunYonetimi() {
  const [products, setProducts] = useState(initialProducts);

  return (
    <div>
      {/* ÜST BAŞLIK VE BUTON */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 tracking-wide">
            Ürün Yönetimi
          </h2>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">
            Sistemdeki Tüm Ürünleriniz
          </p>
        </div>
        <button className="bg-black text-white px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#cc0000] transition-colors shadow-lg">
          + YENİ ÜRÜN EKLE
        </button>
      </div>

      {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
      <div className="bg-white p-4 border border-gray-200 shadow-sm flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün adı, ID veya kategori ara..."
          className="flex-1 p-2.5 text-sm border border-gray-300 outline-none focus:border-black transition-colors"
        />
        <select className="p-2.5 text-sm border border-gray-300 outline-none focus:border-black bg-white cursor-pointer uppercase tracking-widest text-[10px] font-bold">
          <option>Tüm Kategoriler</option>
          <option>Saat</option>
          <option>Yüzük</option>
          <option>Kolye</option>
        </select>
      </div>

      {/* ÜRÜNLER TABLOSU */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-200">
                <th className="p-4 font-bold">Görsel</th>
                <th className="p-4 font-bold">Ürün Adı</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Fiyat</th>
                <th className="p-4 font-bold">Stok</th>
                <th className="p-4 font-bold">Durum</th>
                <th className="p-4 font-bold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium text-gray-800">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-sm"></div>{' '}
                    {/* Resim placeholder */}
                  </td>
                  <td className="p-4 font-bold uppercase tracking-wider">
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-500">{product.category}</td>
                  <td className="p-4 font-bold text-black">{product.price}</td>
                  <td className="p-4">
                    <span
                      className={
                        product.stock > 0
                          ? 'text-green-600 font-bold'
                          : 'text-red-600 font-bold'
                      }
                    >
                      {product.stock} Adet
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-[9px] font-bold rounded-sm uppercase tracking-wider ${
                        product.status === 'Aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-[10px] font-bold tracking-widest text-blue-600 hover:text-black uppercase mr-3 underline">
                      Düzenle
                    </button>
                    <button className="text-[10px] font-bold tracking-widest text-red-600 hover:text-black uppercase underline">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
