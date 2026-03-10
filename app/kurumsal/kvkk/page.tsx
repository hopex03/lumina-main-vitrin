import { Metadata } from 'next';
import { corporateData } from '../../../lib/corporateData';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Zeray Gold',
  description: 'Kişisel Verilerin Korunması Kanunu ve veri işleme politikalarımız hakkında duyurular.',
  alternates: {
    canonical: 'https://www.zeraygold.com.tr/kurumsal/kvkk',
  },
};

export default function KVKKPage() {
  const data = corporateData.kvkk;
  
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl md:text-5xl font-serif text-dark mb-8 pb-4 border-b border-gold/30">
        {data.title}
      </h1>
      
      <p className="text-zinc-600 text-base md:text-lg leading-loose font-light mb-8">
        {data.content}
      </p>

      <section className="mb-10 text-zinc-600 font-light leading-relaxed">
        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">Veri Sorumlusu</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, "Veri Sorumlusu" sıfatıyla şirketimiz tarafından paylaşılan kişisel verileriniz, yine yasal güvenceler kapsamında kaydedilecek ve işlenecektir.
        </p>

        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">Verilerin Hangi Amaçla İşleneceği</h2>
        <p>
          Toplanan verileriniz, siparişlerin temini, fatura işlemlerinin yürütülmesi ve teslimatın sorunsuz bir sigortalı kuryeyle sağlanabilmesi amacıyla kayıt altına alınmaktadır.
        </p>

        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">Kişisel Verilerin Kimlere Aktarılabileceği</h2>
        <p>
          İşlenen kişisel verileriniz ancak sipariş ve yasal teslimat sürecinde; taşıyıcı acentemiz olan kargo lojistik firmalarına, mevzuatın güvence altına aldığı kurumlara ve bağımsız vergi denetim kuruluşlarına sözleşmesel gizlilik garantisi ile aktarılabilmektedir.
        </p>

        <h2 className="text-xl font-bold tracking-widest uppercase text-dark mb-4 drop-shadow-sm mt-8 border-b border-zinc-100 pb-2">Kullanıcı Hakları</h2>
        <p>
          KVKK 11. madde uyarınca kişisel verilerinizle ilgili bilgi alma, silinmesini/düzeltilmesini talep etme ve kayıtlı olduğu durumlara itiraz etme hakkına sahipsiniz. Tüm taleplerinizi <strong>destek@zeraygold.com.tr</strong> adresinden bize ulaştırabilirsiniz.
        </p>
      </section>
    </article>
  );
}
