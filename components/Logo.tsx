import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  forceTheme?: 'light' | 'dark';
}

const LOGOS = {
  uk: {
    // UK Light Theme (usually dark logo)
    light: 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FGroup%206680.png?alt=media&token=2da4c663-70f3-4415-90bf-458feae55e30',
    // UK Dark Theme (usually light logo)
    dark: 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20%D0%9A%D0%9C%D0%9C%D0%A0%20ua%20color.png?alt=media&token=01278564-fec1-45fc-8777-0451d0351864'
  },
  en: {
    // EN Light Theme
    light: 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20ENG%20color.png?alt=media&token=41a8a342-a17a-424d-af11-d0bd60b1ca12',
    // EN Dark Theme
    dark: 'https://firebasestorage.googleapis.com/v0/b/kcyc-site.firebasestorage.app/o/LOGO%20KCYC%2FLogo%20ENG%20color%20(1).png?alt=media&token=b789d3d7-6394-4ef7-a404-521e30bea5a0'
  }
};

export const Logo: React.FC<LogoProps> = ({ className = "h-12", forceTheme }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  // Use forced theme if provided, otherwise use global theme
  const activeTheme = forceTheme || theme;
  
  const getLogoSrc = () => {
    const langKey = language === 'en' ? 'en' : 'uk';
    const themeKey = activeTheme === 'dark' ? 'dark' : 'light';
    return LOGOS[langKey][themeKey];
  };

  return (
    <img 
      src={getLogoSrc()}
      alt={language === 'uk' ? 'Київська Міська Молодіжна Рада' : 'Kyiv City Youth Council'} 
      className={`${className} w-auto object-contain transition-all duration-300`}
    />
  );
};