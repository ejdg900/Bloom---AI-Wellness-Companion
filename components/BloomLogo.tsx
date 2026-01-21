import React from 'react';

interface BloomLogoProps {
  size?: number;
  className?: string;
}

const BloomLogo: React.FC<BloomLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="petalGradient" x1="32" y1="14" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" /> {/* Teal 600 */}
          <stop offset="1" stopColor="#0f766e" /> {/* Teal 700 */}
        </linearGradient>
         <linearGradient id="bgGradient" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe4e6" /> {/* Rose 100 */}
          <stop offset="1" stopColor="#fecdd3" /> {/* Rose 200 */}
        </linearGradient>
      </defs>

      {/* Background Shape - Soft Squircle */}
      <rect x="0" y="0" width="64" height="64" rx="20" fill="url(#bgGradient)" />

      {/* Main Flower/Lotus Shape */}
      <g transform="translate(0, 2)">
        {/* Left Petal Outline */}
        <path 
          d="M26 32C26 32 20 30 16 26C14 24 16 20 20 18C24 16 28 22 32 26" 
          stroke="#0d9488" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Right Petal Outline */}
         <path 
          d="M38 32C38 32 44 30 48 26C50 24 48 20 44 18C40 16 36 22 32 26" 
          stroke="#0d9488" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Center Petal (Solid) */}
        <path 
          d="M32 14C32 14 39 24 39 32C39 39 35 44 32 46C29 44 25 39 25 32C25 24 32 14 32 14Z" 
          fill="url(#petalGradient)" 
        />
        
        {/* Heart Core (Wellness Symbol) */}
        <path 
          d="M32 28C33.2 26.8 35 26.8 36.2 28C37.4 29.2 37.4 31 36.2 32.2L32 36.4L27.8 32.2C26.6 31 26.6 29.2 27.8 28C29 26.8 30.8 26.8 32 28Z" 
          fill="#ffffff" 
        />
      </g>
    </svg>
  );
};

export default BloomLogo;