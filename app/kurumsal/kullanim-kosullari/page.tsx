import { Metadata } from 'next';
import { corporateData } from '../../../lib/corporateData';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Zeray Gold',
  description: 'Zeray Gold platformu yasal kullanım ve telif hakları beyanı.',
  alternates: {
    canonical: 'https://www.zeraygold.com.tr/kurumsal/kullanim-kosullari',
  },
};

export default function KullanimKosullariPage() {
  const data = corporateData.kullanimKosullari;
  
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl md:text-5xl font-serif text-dark mb-8 pb-4 border-b border-gold/30">
        {data.title}
      </h1>
      
      <p className="text-zinc-600 text-base md:text-lg leading-loose font-light mb-8">
        {data.content}
      </p>

      <section className="mb-10 text-zinc-600 font-light leading-relaxed">
        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">1. Fikri Mülkiyet Hakları</h2>
        <p>
          Bu web sitesindeki fotoğraflar, videolar, yazılımlar ve ticari markalar dâhil her türlü içerik Zeray Gold'a aittir. Önceden yazılı izin alınmaksızın bunların ticari amaçla kopyalanması ve kullanılması kesinlikle yasaktır.
        </p>

        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">2. Ürün Fiyatlandırma Politikası</h2>
        <p>
          Ekrandaki ürün fiyatları anlık altın kuruna bağlı olarak değişebilmekte ve kura dayalı manipülasyonları engellemek üzere güvence altına alınmıştır. Sepete atılan ürün sistemin anlık kur opsiyonu ile rezerve edilir.
        </p>

        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">3. Site Erişimi</h2>
        <p>
          Site üzerindeki işlemlerinizi 256-Bit SSL güvencesiyle sağlamaktayız. Zararlı girişimler veya sistemsel kopyalamalar yapan IP adresleri hakkında yasal işlem başlatılır.
        </p>
      </section>
    </article>
  );
}
