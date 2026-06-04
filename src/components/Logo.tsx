import React from 'react';

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
  height?: number | string;
}

export default function Logo({ showText = true, className = '', iconOnly = false, height = 40 }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={`${import.meta.env.BASE_URL}Trade_Vignate_Logo.png`} 
        alt="Trade Vignate Logo" 
        style={{ height: height }}
        className="w-auto object-contain" 
      />
    </div>
  );
}
