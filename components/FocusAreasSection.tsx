import React from 'react';
import { FOCUS_AREAS_UK, FOCUS_AREAS_EN } from '../constants';
import { useLanguage } from '../context/LanguageContext';

export const FocusAreasSection: React.FC = () => {
  const { language, t } = useLanguage();
  const areas = language === 'uk' ? FOCUS_AREAS_UK : FOCUS_AREAS_EN;

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-kmmr-pink font-bold uppercase tracking-widest text-sm mb-2 block">{t('focus.tag')}</span>
          <h2 className="text-4xl font-black text-kmmr-blue dark:text-white">{t('focus.title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('focus.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area) => (
            <div key={area.id} className="group p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:shadow-2xl transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 ${area.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <area.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-kmmr-blue dark:text-white mb-4">{area.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};