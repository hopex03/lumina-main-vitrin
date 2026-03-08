'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
    productName?: string;
    variant?: 'floating' | 'inline';
}

export default function WhatsAppButton({ productName, variant = 'floating' }: WhatsAppButtonProps) {
    const phoneNumber = "905353658468"; // Destek Hattı

    // Dynamic text generation based on product context
    const text = productName
        ? `Zeray Gold Mücevherat Destek Merkezi: ${productName} hakkında bilgi almak istiyorum.`
        : `Merhaba Zeray Gold, seçtiğim mücevherler hakkında özel destek almak istiyorum.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    const icon = (
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={variant === 'floating' ? "w-8 h-8" : "w-5 h-5"}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
    );

    if (variant === 'inline') {
        return (
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#25D366] text-white py-4 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#20bd5a] transition-colors rounded-sm flex items-center justify-center gap-3 drop-shadow-md"
            >
                {icon}
                Executive Support Al
            </motion.a>
        );
    }

    // Default Floating Variant
    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="button"
            aria-label="Zeray Gold Executive Support"
            className="fixed bottom-6 right-6 z-[999] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.4)] group"
            whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(37,211,102,0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            {icon}
            <span className="absolute right-16 bg-white text-zinc-800 text-xs font-bold py-2 px-4 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block border border-zinc-100">
                Zeray Gold Executive Support ✦
            </span>
        </motion.a>
    );
}
