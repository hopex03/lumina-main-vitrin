import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = 'https://zeraygold.com.tr';

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('status', 'Yayımlanmış');

    const productUrls: MetadataRoute.Sitemap = (products || []).map((p) => ({
        url: `${siteUrl}/urun/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${siteUrl}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        ...productUrls,
    ];
}
