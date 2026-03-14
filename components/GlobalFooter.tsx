import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function GlobalFooter() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 mt-0 relative overflow-hidden border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <BrandLogo className="w-48 h-20 mb-6" textColor="text-gold" subText="GİRESUN" />
            <p className="text-gray-300 text-[10px] leading-relaxed mb-8 pe-4 font-serif tracking-[0.2em] font-medium uppercase text-center md:text-left">
              SEKTÖREL BİRLEŞİK GÜÇ VE KURUMSAL GÜVENCE
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">In</div>
              <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">Fb</div>
              <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer">Tw</div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Kurumsal</h4>
            <ul className="flex flex-col gap-4 text-xs text-gray-400 font-light">
              <li><Link href="/kurumsal/hakkimizda" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">İletişim</Link></li>
              <li><Link href="/referanslar" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Referanslar</Link></li>
              <li><Link href="/kurumsal/kvkk" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">KVKK</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Müşteri İlişkileri</h4>
            <ul className="flex flex-col gap-4 text-xs text-gray-400 font-light">
              <li><Link href="/kurumsal/iade-ve-degisim" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">İade ve Değişim</Link></li>
              <li><Link href="/kurumsal/teslimat-ve-kargo" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Teslimat & Kargo</Link></li>
              <li><Link href="/kurumsal/kullanim-kosullari" className="hover:text-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Kullanım Koşulları</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-white">Güvenli Alışveriş</h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
              Tüm gönderiler sigortalı kurye ile 1 ila 4 iş günü içerisinde kargolanır.
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
            <Link href="/kurumsal/kvkk" className="hover:text-gold transition-colors">Gizlilik Politikası</Link>
            <Link href="/kurumsal/kullanim-kosullari" className="hover:text-gold transition-colors">Çerez Politikası</Link>
            <Link href="/kurumsal/kullanim-kosullari" className="hover:text-gold transition-colors">Mesafeli Sözleşme</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
