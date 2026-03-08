/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'ozqwmcorufpvldzhqfzt.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.imgbb.com',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'zeraygold.com.tr',
            },
        ],
    },
    // Suppress hydration warnings from browser extensions
    reactStrictMode: true,
};

module.exports = nextConfig;
