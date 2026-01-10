import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  const { language } = useLanguage();
  
  const logoSrc = language === 'en' ? 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20ENG%20color.png?alt=media&token=41a8a342-a17a-424d-af11-d0bd60b1ca12' : 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FGroup%206680.png?alt=media&token=2da4c663-70f3-4415-90bf-458feae55e30';

  return (
    <img 
      src={logoSrc} 
      alt={language === 'uk' ? 'Київська Міська Молодіжна Рада' : 'Kyiv City Youth Council'} 
      className={`${className} w-auto object-contain`}
    />
  );
};
