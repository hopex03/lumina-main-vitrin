import { Metadata } from 'next';
import { corporateData } from '../../../lib/corporateData';

export const metadata: Metadata = {
  title: 'İade ve Değişim | Zeray Gold',
  description: 'Zeray Gold iade, iptal ve değişim işlemlerine dair kurumsal prosedürler ve yönergeler.',
  alternates: {
    canonical: 'https://www.zeraygold.com.tr/kurumsal/iade-ve-degisim',
  },
};

export default function IadeVeDegisimPage() {
  const data = corporateData.iadeVeDegisim;
  
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl md:text-5xl font-serif text-dark mb-8 pb-4 border-b border-gold/30">
        {data.title}
      </h1>
      
      <p className="text-zinc-600 text-base md:text-lg leading-loose font-light mb-8">
        {data.content}
      </p>

      <div className="bg-zinc-50 rounded-sm p-8 mt-10">
        <h2 className="text-2xl font-serif text-dark mb-6 tracking-wide">
          İade İşlem Adımları
        </h2>
        
        <ul className="flex flex-col gap-6 text-zinc-600 font-light list-none p-0">
          <li className="flex gap-4">
            <span className="text-gold font-bold text-xl">1.</span>
            <span>Müşteri Hizmetleriyle iletişime geçerek iptal veya iade talebinizi iletmelisiniz.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-gold font-bold text-xl">2.</span>
            <span>Tarafınıza özel olarak oluşturulacak kargo kodu ile ürünü faturası ve tüm iade formlarıyla birlikte teslim etmelisiniz.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-gold font-bold text-xl">3.</span>
            <span>Ürün kalite kontrol usta ekibimizce teslim alındıktan sonra 3 iş günü içinde tutar iadeniz yapılacaktır.</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
