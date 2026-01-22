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
        {/* Purple Gradient (Top Center) */}
        <linearGradient id="gradPurple" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" /> {/* Purple 400 */}
          <stop offset="1" stopColor="#7c3aed" /> {/* Violet 600 */}
        </linearGradient>

        {/* Pink Gradient (Middle Sides) */}
        <linearGradient id="gradPink" x1="14" y1="26" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" /> {/* Pink 400 */}
          <stop offset="1" stopColor="#db2777" /> {/* Pink 600 */}
        </linearGradient>

        {/* Green Gradient (Bottom Sides) */}
        <linearGradient id="gradGreen" x1="10" y1="38" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" /> {/* Green 400 */}
          <stop offset="1" stopColor="#059669" /> {/* Emerald 600 */}
        </linearGradient>
      </defs>

      {/* Background: White Rounded Square */}
      <rect x="0" y="0" width="64" height="64" rx="16" fill="white" />

      {/* Intertwined Lotus Paths */}
      <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Bottom Leaves (Green) */}
        <path d="M32 52 C 24 54, 6 50, 10 38 C 14 32, 28 46, 32 52" stroke="url(#gradGreen)" />
        <path d="M32 52 C 40 54, 58 50, 54 38 C 50 32, 36 46, 32 52" stroke="url(#gradGreen)" />

        {/* Middle Petals (Pink) */}
        <path d="M32 52 C 22 50, 10 40, 14 26 C 18 20, 28 35, 32 52" stroke="url(#gradPink)" />
        <path d="M32 52 C 42 50, 54 40, 50 26 C 46 20, 36 35, 32 52" stroke="url(#gradPink)" />

        {/* Center Petal (Purple) - Drawn last to be on top */}
        <path d="M32 52 C 24 40, 24 20, 32 12 C 40 20, 40 40, 32 52" stroke="url(#gradPurple)" />
      </g>
    </svg>
  );
};

export default BloomLogo;