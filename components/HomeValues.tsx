import React from 'react';
import { Zap, Heart, Globe, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HomeValues: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
           <div className="order-2 md:order-1">
             <div className="relative">
               {/* Abstract illustration placeholder using colored shapes if no image */}
               <div className="aspect-square rounded-full bg-kmmr-mint/30 dark:bg-kmmr-mint/10 absolute -top-10 -left-10 w-32 h-32 blur-2xl"></div>
               <div className="aspect-square rounded-full bg-kmmr-pink/20 dark:bg-kmmr-pink/10 absolute -bottom-10 -right-10 w-40 h-40 blur-2xl"></div>
               <img 
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Collaboration" 
                 className="relative rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 z-10"
               />
             </div>
           </div>
           <div className="order-1 md:order-2">
             <h2 className="text-4xl font-black text-kmmr-blue dark:text-white mb-6 whitespace-pre-line">
               {t('values.title')}
             </h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
               {t('values.desc')}
             </p>
             <ul className="space-y-4">
               {[
                 t('values.list1'),
                 t('values.list2'),
                 t('values.list3')
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 font-bold text-gray-800 dark:text-gray-100">
                   <div className="w-8 h-8 rounded-full bg-kmmr-green/20 flex items-center justify-center text-kmmr-green">
                     <Zap size={16} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-kmmr-pink hover:-translate-y-2 transition-transform duration-300">
            <Heart className="w-12 h-12 text-kmmr-pink mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">{t('values.card1Title')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('values.card1Desc')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-kmmr-blue dark:border-blue-400 hover:-translate-y-2 transition-transform duration-300">
            <Globe className="w-12 h-12 text-kmmr-blue dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">{t('values.card2Title')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('values.card2Desc')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-kmmr-orange hover:-translate-y-2 transition-transform duration-300">
            <Users className="w-12 h-12 text-kmmr-orange mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">{t('values.card3Title')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('values.card3Desc')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};