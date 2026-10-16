import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  theme = 'dark',
}) => {
  // Height configurations
  const heightMap = {
    sm: 34,
    md: 46,
    lg: 60,
    xl: 78,
  };

  const height = heightMap[size] || 46;
  const textColor = theme === 'dark' ? '#ffffff' : '#0a0a0a';
  const subtextColor = theme === 'dark' ? '#ffffff' : '#171717';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 250 150"
        height={height}
        className="w-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Motopartes Logo"
      >
        <defs>
          {/* Red sport bike gradient */}
          <linearGradient id="redMotorcycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="80%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Rotor metallic gradient */}
          <radialGradient id="rotorGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>

          {/* Tire dark gradient */}
          <radialGradient id="tireGrad" cx="45%" cy="45%" r="55%">
            <stop offset="70%" stopColor="#1e222d" />
            <stop offset="100%" stopColor="#090a0f" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* TOP: RED RACING MOTORCYCLE SILHOUETTE                    */}
        {/* ========================================================= */}
        <g id="motorcycle-fairing" fill="url(#redMotorcycleGrad)">
          {/* Windshield & Front Fairing */}
          <path d="M 104 22 C 114 6 126 2 134 4 C 131 9 127 15 125 21 Z" opacity="0.9" />
          
          {/* Main Racing Body / Fuel Tank / Fairing / Tail Cowl */}
          <path
            d="M 125 21 
               C 133 16 142 15 152 18 
               C 161 21 168 20 178 17 
               C 188 14 195 19 203 26 
               C 214 24 226 21 232 23
               C 225 27 218 31 209 35
               C 204 38 198 39 191 38
               C 183 37 175 35 168 36
               C 160 37 155 42 148 48
               C 138 56 128 66 125 76
               C 123 68 122 55 118 46
               C 114 36 109 29 97 34
               C 92 36 86 44 87 53
               C 88 61 93 72 96 82
               C 90 70 85 58 88 47
               C 90 38 97 29 107 24
               Z"
          />

          {/* Lower Engine Cowl & Frame Accents */}
          <path
            d="M 115 48 
               C 122 43 131 42 140 44 
               C 134 52 127 62 121 72 
               C 117 62 115 54 115 48 Z"
          />

          {/* Rear Swingarm Link connecting to rear wheel */}
          <path
            d="M 183 39 
               L 197 45 
               L 209 52 
               L 218 48 
               L 205 41 Z"
          />
        </g>

        {/* Motorcycle Front Fork / Handlebar Line */}
        <line
          x1="126"
          y1="22"
          x2="97"
          y2="63"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Rear Suspension Diagonal Strut */}
        <line
          x1="168"
          y1="38"
          x2="204"
          y2="54"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* ========================================================= */}
        {/* MIDDLE: "MOTO" WITH WHEEL INTEGRATIONS                   */}
        {/* ========================================================= */}
        <g id="letters-moto">
          {/* LETTER M (Sharp dynamic stylized M) */}
          <path
            d="M 10 98 
               L 10 46 
               L 26 46 
               L 41 78 
               L 55 46 
               L 71 46 
               L 71 98 
               L 56 98 
               L 56 68 
               L 43 95 
               L 38 95 
               L 25 68 
               L 25 98 
               Z"
            fill={textColor}
          />
          {/* Dynamic slanted slit on M */}
          <polygon points="10,62 18,62 14,70 10,70" fill={theme === 'dark' ? '#0c0e12' : '#ffffff'} />

          {/* FIRST LETTER O (Front Motorcycle Wheel) */}
          <g transform="translate(101, 72)">
            {/* Outer Tire */}
            <circle cx="0" cy="0" r="26" fill="url(#tireGrad)" stroke="#dc2626" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="21" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
            
            {/* Inner Rim Area */}
            <circle cx="0" cy="0" r="14" fill={theme === 'dark' ? '#0c0e12' : '#ffffff'} />
            
            {/* Brake Rotor Disc with 8 holes/spokes */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="url(#rotorGrad)" strokeWidth="4" />
            <circle cx="0" cy="0" r="3.5" fill={textColor} />
            
            {/* 8 Rotor Ventilation Studs */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 10;
              const y = Math.sin(rad) * 10;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1.4"
                  fill={theme === 'dark' ? '#0c0e12' : '#ffffff'}
                />
              );
            })}
          </g>

          {/* LETTER T (Bold center T) */}
          <path
            d="M 137 46 
               L 173 46 
               L 173 60 
               L 161 60 
               L 161 98 
               L 149 98 
               L 149 60 
               L 137 60 
               Z"
            fill={textColor}
          />

          {/* SECOND LETTER O (Rear Motorcycle Wheel) */}
          <g transform="translate(214, 72)">
            {/* Outer Tire */}
            <circle cx="0" cy="0" r="26" fill="url(#tireGrad)" stroke="#dc2626" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="21" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
            
            {/* Inner Rim Area */}
            <circle cx="0" cy="0" r="14" fill={theme === 'dark' ? '#0c0e12' : '#ffffff'} />
            
            {/* Brake Rotor / Sprocket Disc with 8 holes/spokes */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="url(#rotorGrad)" strokeWidth="4" />
            <circle cx="0" cy="0" r="3.5" fill={textColor} />
            
            {/* 8 Rotor Ventilation Studs */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 10;
              const y = Math.sin(rad) * 10;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1.4"
                  fill={theme === 'dark' ? '#0c0e12' : '#ffffff'}
                />
              );
            })}
          </g>
        </g>

        {/* ========================================================= */}
        {/* BOTTOM: "PARTES"                                         */}
        {/* ========================================================= */}
        {showSubtitle && (
          <g id="word-partes">
            {/* Drop shadow effect */}
            <text
              x="125"
              y="136"
              textAnchor="middle"
              fontFamily="Impact, 'Barlow Condensed', 'Arial Black', sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="3.5"
              fill="rgba(0,0,0,0.4)"
            >
              PARTES
            </text>
            {/* Foreground text */}
            <text
              x="125"
              y="134"
              textAnchor="middle"
              fontFamily="Impact, 'Barlow Condensed', 'Arial Black', sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="3.5"
              fill={subtextColor}
            >
              PARTES
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
