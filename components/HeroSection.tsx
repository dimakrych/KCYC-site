import React from 'react';
import { ArrowRight } from 'lucide-react';
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
        <div className="absolute inset-0 bg-gradient-to-r from-kmmr-blue/95 via-kmmr-blue/80 to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-kmmr-pink rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-kmmr-green rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-block px-4 py-1 mb-6 border border-kmmr-green/50 rounded-full bg-kmmr-green/10 backdrop-blur-sm">
            <span className="text-kmmr-green font-bold text-sm tracking-wider uppercase">{t('hero.tag')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            {t('hero.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kmmr-green to-kmmr-mint">{t('hero.titleMid')}</span>,<br/>
            {t('hero.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kmmr-pink to-purple-400">{t('hero.titleEnd')}</span>!
          </h1>
          
          <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/contacts')}
              className="group bg-kmmr-pink text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-kmmr-pink/40"
            >
              {t('hero.btnJoin')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/projects')}
              className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-white border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              {t('hero.btnProjects')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};