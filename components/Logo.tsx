import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  // Logic: 
  // UK Light: /logo.png
  // UK Dark: /logo_light.png (Assume exists)
  // EN Light: /logo_en.png
  // EN Dark: /logo_en_light.png (Assume exists)
  
  const getLogoSrc = () => {
    if (language === 'en') {
      return theme === 'dark' ? '/logo_en_light.png' : '/logo_en.png';
    } else {
      return theme === 'dark' ? '/logo_light.png' : '/logo.png';
    }
  };

  return (
    <img 
      src={getLogoSrc()}
      onError={(e) => {
        // Fallback to default if light version not found
        const target = e.target as HTMLImageElement;
        const fallback = language === 'en' ? '/logo_en.png' : '/logo.png';
        if (target.src.indexOf(fallback) === -1) {
            target.src = fallback;
        }
      }}
      alt={language === 'uk' ? 'Київська Міська Молодіжна Рада' : 'Kyiv City Youth Council'} 
      className={`${className} w-auto object-contain transition-all duration-300`}
    />
  );
};