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
      return theme === 'dark' ? 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20ENG%20color%20(1).png?alt=media&token=b789d3d7-6394-4ef7-a404-521e30bea5a0' : 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20ENG%20color.png?alt=media&token=41a8a342-a17a-424d-af11-d0bd60b1ca12';
    } else {
      return theme === 'dark' ? 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20%D0%9A%D0%9C%D0%9C%D0%A0%20ua%20color.png?alt=media&token=01278564-fec1-45fc-8777-0451d0351864' : 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FGroup%206680.png?alt=media&token=2da4c663-70f3-4415-90bf-458feae55e30';
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
