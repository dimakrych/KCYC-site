import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  const { language } = useLanguage();
  
  const logoSrc = language === 'en' ? '/logo_en.png' : '/logo.png';

  return (
    <img 
      src={logoSrc} 
      alt={language === 'uk' ? 'Київська Міська Молодіжна Рада' : 'Kyiv City Youth Council'} 
      className={`${className} w-auto object-contain`}
    />
  );
};