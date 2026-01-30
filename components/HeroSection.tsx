
import React from 'react';
import { ArrowRight, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Active Youth of Kyiv" 
          className="w-full h-full object-cover"
        />
        {/* Mobile: Vertical dark gradient from top to ensure text readability. Desktop: Horizontal gradient from left. */}
        <div className="absolute inset-0 bg-gradient-to-b from-kmmr-blue/90 via-kmmr-blue/60 to-transparent md:bg-gradient-to-r md:from-kmmr-blue/95 md:via-kmmr-blue/80 md:to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-kmmr-pink rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-kmmr-green rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl animate-fade-in-up mt-10 md:mt-0">
          <div className="inline-block px-4 py-1 mb-6 border border-kmmr-green/50 rounded-full bg-kmmr-green/10 backdrop-blur-sm">
            <span className="text-kmmr-green font-bold text-xs md:text-sm tracking-wider uppercase">{t('hero.tag')}</span>
          </div>
          
          {/* Adjusted font sizes for mobile */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            {t('hero.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kmmr-green to-kmmr-mint">{t('hero.titleMid')}</span>,<br/>
            {t('hero.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kmmr-pink to-purple-400">{t('hero.titleEnd')}</span>!
          </h1>
          
          <p className="text-base md:text-lg text-gray-200 md:text-gray-300 mb-8 md:mb-10 leading-relaxed font-light drop-shadow-md md:drop-shadow-none">
            {t('hero.subtitle')}
          </p>
          
          {/* Adjusted buttons for mobile */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              onClick={() => navigate('/contacts')}
              className="group bg-kmmr-pink text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-kmmr-pink/40 text-sm md:text-base"
            >
              {t('hero.btnJoin')}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/support')}
              className="group bg-kmmr-green text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-kmmr-green/40 text-sm md:text-base"
            >
              {t('hero.btnSupport')}
              <Handshake className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
