'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlobalFooter from '../../components/GlobalFooter';

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Hakkımızda', path: '/kurumsal/hakkimizda' },
    { name: 'Teslimat ve Kargo', path: '/kurumsal/teslimat-ve-kargo' },
    { name: 'İade ve Değişim', path: '/kurumsal/iade-ve-degisim' },
    { name: 'Kullanım Koşulları', path: '/kurumsal/kullanim-kosullari' },
    { name: 'KVKK Aydınlatma', path: '/kurumsal/kvkk' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-dark selection:bg-gold selection:text-white">
      {/* MINIMAL CORPORATE HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.25em] font-black uppercase text-dark">
            ZERAY GOLD <span className="text-gray-300 font-sans text-sm tracking-widest font-light ml-4">| KURUMSAL</span>
          </Link>
          <Link href="/" className="text-xs font-bold tracking-[0.2em] text-gray-500 hover:text-gold transition-colors uppercase">
            Geri Dön
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 md:px-8 py-12 md:py-24 gap-8 md:gap-16">
        {/* STICKY SIDEBAR */}
        <aside className="md:w-[280px] flex-shrink-0 animate-fade-in">
          <div className="sticky top-32 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gold/10 rounded-sm">
            <h3 className="font-serif text-xl tracking-[0.2em] uppercase text-dark mb-6 border-b border-zinc-100 pb-5">
              Rehber
            </h3>
            <nav className="flex flex-col gap-5 text-[13px] font-medium tracking-wide">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path} 
                    className={`transition-all duration-300 flex items-center gap-3 ${isActive ? 'text-gold-dark font-bold' : 'text-zinc-500 hover:text-gold'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-gold' : 'bg-transparent border border-zinc-300'}`}></span>
                    {item.name}
                  </Link>
                );
              })}
              <Link href="/iletisim" className="text-zinc-500 hover:text-gold transition-colors flex items-center gap-3 mt-4 pt-5 border-t border-zinc-100">
                <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-zinc-300"></span>
                Bize Ulaşın
              </Link>
            </nav>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white p-8 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gold/10 rounded-sm min-h-[500px] animate-slide-up">
          {children}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
