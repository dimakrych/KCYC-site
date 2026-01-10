import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const MissionSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Youth Meeting Background" 
          className="w-full h-full object-cover"
        />
        {/* Strong blue overlay to match the screenshot */}
        <div className="absolute inset-0 bg-kmmr-blue/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kmmr-blue/80 to-kmmr-purple/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        
        {/* Main Header */}
        <h2 className="text-4xl font-bold mb-16 inline-block relative">
          {t('mission.title')}
          {/* Decorative underline/glow effect if needed, keeping it clean for now */}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Column 1: Vision */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{t('mission.vision')}</h3>
            <div className="w-full h-px bg-white/40 mb-6"></div>
            <p className="text-gray-100 font-light leading-relaxed text-sm md:text-base">
              {t('mission.visionText')}
            </p>
          </div>

          {/* Column 2: Mission */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{t('mission.mission')}</h3>
            <div className="w-full h-px bg-white/40 mb-6"></div>
            <p className="text-gray-100 font-light leading-relaxed text-sm md:text-base mb-4">
              {t('mission.missionText1')}
            </p>
            <p className="text-gray-100 font-light leading-relaxed text-sm md:text-base">
              {t('mission.missionText2')}
            </p>
          </div>

          {/* Column 3: Goal */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{t('mission.goal')}</h3>
            <div className="w-full h-px bg-white/40 mb-6"></div>
            <p className="text-gray-100 font-light leading-relaxed text-sm md:text-base">
              {t('mission.goalText')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};