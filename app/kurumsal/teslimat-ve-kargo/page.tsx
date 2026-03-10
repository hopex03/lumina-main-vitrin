import { Metadata } from 'next';
import { corporateData } from '../../../lib/corporateData';

export const metadata: Metadata = {
  title: 'Teslimat ve Kargo | Zeray Gold',
  description: 'Zeray Gold sigortalı ve VIP teslimat kargo koşulları hakkında prosedürler.',
  alternates: {
    canonical: 'https://www.zeraygold.com.tr/kurumsal/teslimat-ve-kargo',
  },
};

export default function TeslimatKargoPage() {
  const data = corporateData.teslimatVeKargo;
  
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl md:text-5xl font-serif text-dark mb-8 pb-4 border-b border-gold/30">
        {data.title}
      </h1>
      
      <div className="bg-zinc-50 border-l-4 border-gold p-6 mb-10 text-lg font-serif text-gold-dark italic leading-relaxed shadow-sm">
        "{data.logisticsLogic}"
      </div>
      
      <p className="text-zinc-600 text-base md:text-lg leading-loose font-light mb-8">
        {data.content}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t border-zinc-100 pt-10">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm">Güvenli Gönderim</h2>
          <p className="text-zinc-600 font-light leading-relaxed">
            Paketleriniz özel muhafazalı olarak yola çıkar. Kaybolma ve çalınma riskine karşı sigortalıdır. Teslimat sırasında kimlik doğrulama yapılmaktadır.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm">Teslim Süreleri</h2>
          <p className="text-zinc-600 font-light leading-relaxed">
            Aksi belirtilmedikçe siparişiniz, 1 ila 4 iş günü içerisinde kargo firmasına teslim edilir. Teslimat süresi şehrinize göre 12 ile 48 saat arasında değişiklik gösterebilir.
          </p>
        </div>
      </div>
    </article>
  );
}
