import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { NAV_LINKS_UK, NAV_LINKS_EN } from '../constants';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const currentLinks = language === 'uk' ? NAV_LINKS_UK : NAV_LINKS_EN;

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleJoinClick = () => {
    setIsOpen(false);
    navigate('/contacts');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'uk' ? 'en' : 'uk');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <Logo className="h-16 md:h-20" />
          </div>

          {/* Desktop Menu (Visible only on LG screens and up) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {currentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 uppercase tracking-wider ${
                    isActive ? 'text-kmmr-pink' : 'text-kmmr-blue dark:text-gray-200 hover:text-kmmr-green'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="flex items-center gap-3 ml-2">
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-kmmr-blue dark:text-gray-200 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-kmmr-blue dark:hover:border-kmmr-pink transition-colors text-xs font-bold uppercase text-kmmr-blue dark:text-gray-200"
              >
                <Globe size={14} />
                <span className={language === 'uk' ? 'text-kmmr-pink' : ''}>UA</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className={language === 'en' ? 'text-kmmr-pink' : ''}>EN</span>
              </button>

              <button
                onClick={() => navigate('/contacts')}
                className="bg-kmmr-pink text-white px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-kmmr-pink/30"
              >
                {t('nav.join')}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="lg:hidden flex items-center gap-3">
             <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-kmmr-blue dark:text-gray-200 transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

             <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase text-kmmr-blue dark:text-gray-200"
            >
              <span className={language === 'uk' ? 'text-kmmr-pink' : ''}>UA</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className={language === 'en' ? 'text-kmmr-pink' : ''}>EN</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-kmmr-blue dark:text-white hover:text-kmmr-pink focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {currentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md text-base font-bold uppercase text-center transition-colors ${
                    isActive 
                      ? 'text-kmmr-pink bg-pink-50 dark:bg-gray-800' 
                      : 'text-kmmr-blue dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4">
              <button
                onClick={handleJoinClick}
                className="w-full bg-kmmr-pink text-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-opacity-90"
              >
                {t('nav.join')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};