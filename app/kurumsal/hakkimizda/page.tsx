import { Metadata } from 'next';
import { corporateData } from '../../../lib/corporateData';

export const metadata: Metadata = {
  title: 'Hakkımızda | Zeray Gold',
  description: 'Zeray Gold misyonu, vizyonu ve altın kuyumculuğu üzerine kurumsal kimlik detayları.',
  alternates: {
    canonical: 'https://www.zeraygold.com.tr/kurumsal/hakkimizda',
  },
};

export default function HakkimizdaPage() {
  const data = corporateData.hakkimizda;
  
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl md:text-5xl font-serif text-dark mb-8 pb-4 border-b border-gold/30">
        {data.title}
      </h1>
      
      <div className="bg-zinc-50 border-l-4 border-gold p-6 mb-10 text-xl font-serif text-gold-dark italic leading-relaxed">
        "{data.missionStatement}"
      </div>
      
      <p className="text-zinc-600 text-base md:text-lg leading-loose font-light mb-8">
        {data.content}
      </p>

      <h2 className="text-2xl font-serif text-dark mt-12 mb-6 tracking-wide">
        Ustalıktan Sanata
      </h2>
      <p className="text-zinc-600 font-light leading-relaxed">
        Geleneksel motifleri modern bir vizyonla yeniden tasarlayan atölyelerimiz, her zaman estetikle mükemmelliği bir araya getirmiştir. Tüm eserlerimiz el emeği, göz nuru olup nesiller boyu aktarılacak nadide bir miras değerindedir.
      </p>
    </article>
  );
}
