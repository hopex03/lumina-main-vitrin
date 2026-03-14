import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  subText?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "w-24 h-24", 
  showText = true, 
  textColor = "text-dark",
  subText = "GİRESUN"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Monogram SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BF953F" />
              <stop offset="25%" stopColor="#FCF6BA" />
              <stop offset="50%" stopColor="#B38728" />
              <stop offset="75%" stopColor="#FBF5B7" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="1" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Subtle ornate circle background */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.3" strokeDasharray="1 2" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#goldGradient)" strokeWidth="0.2" opacity="0.2" />

          {/* Interlocking Z and G Path (SIMPLIFIED MANUALLY DESIGNED PATHS FOR HIGH QUALITY) */}
          <g filter="url(#shadow)">
            {/* The 'G' */}
            <path 
              d="M75 50 C75 30 65 20 50 20 C35 20 25 30 25 50 C25 70 35 80 50 80 C60 80 68 75 72 65 L60 65 C58 68 55 70 50 70 C42 70 37 63 37 50 C37 37 42 30 50 30 C58 30 63 37 63 45 L50 45 L50 55 L75 55 L75 50 Z" 
              fill="url(#goldGradient)" 
            />
            {/* The 'Z' Interlocking */}
            <path 
              d="M30 28 L70 28 L70 35 L40 65 L70 65 L70 72 L30 72 L30 65 L60 35 L30 35 Z" 
              fill="url(#goldGradient)"
              style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
            />
            {/* Overlay bits to create interlocking effect */}
            <path 
              d="M30 28 L45 28 L45 35 L30 35 Z" 
              fill="url(#goldGradient)"
            />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="mt-4 text-center">
          <h2 className={`font-serif text-xl md:text-2xl tracking-[0.3em] font-black uppercase ${textColor}`}>
            Zeray Gold
          </h2>
          {subText && (
            <p className={`text-[10px] tracking-[0.5em] font-bold opacity-60 uppercase mt-1 ${textColor}`}>
              EST. 2026 • {subText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
