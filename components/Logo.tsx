
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect width="100" height="100" rx="22" fill="#F97316"/>
      <circle cx="46" cy="42" r="28" fill="none" stroke="white" strokeWidth="7"/>
      <path d="M46 22V42L62 52" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="32" y="62" width="58" height="28" rx="4" fill="white"/>
      <rect x="38" y="69" width="6" height="6" rx="1" fill="#F97316"/>
      <rect x="38" y="78" width="6" height="6" rx="1" fill="#F97316"/>
      <rect x="50" y="70" width="32" height="4" rx="1" fill="#F97316"/>
      <rect x="50" y="79" width="32" height="4" rx="1" fill="#F97316"/>
    </svg>
  );
};

export default Logo;
