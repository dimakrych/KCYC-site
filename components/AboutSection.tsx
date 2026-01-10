import React from 'react';
import { SDGS_UK, SDGS_EN, PARTNER_GROUPS_UK, PARTNER_GROUPS_EN, TIMELINE_EVENTS_UK, TIMELINE_EVENTS_EN } from '../constants';
import { Target, Flag, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();
  
  const sdgs = language === 'uk' ? SDGS_UK : SDGS_EN;
  const partners = language === 'uk' ? PARTNER_GROUPS_UK : PARTNER_GROUPS_EN;
  const timeline = language === 'uk' ? TIMELINE_EVENTS_UK : TIMELINE_EVENTS_EN;

  return (
    <div className="space-y-20 py-16 overflow-x-hidden dark:bg-gray-950 transition-colors duration-300">
      
      {/* Intro Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: t('about.stats.community'), text: t('about.stats.communityDesc'), color: 'bg-kmmr-blue' },
            { icon: Target, title: t('about.stats.impact'), text: t('about.stats.impactDesc'), color: 'bg-kmmr-green' },
            { icon: Flag, title: t('about.stats.action'), text: t('about.stats.actionDesc'), color: 'bg-kmmr-pink' }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} rounded-2xl p-8 text-white transform hover:-translate-y-2 transition-transform duration-300 shadow-xl`}>
              <item.icon className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="font-medium opacity-90">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Intro: Who We Are */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-kmmr-pink font-bold uppercase tracking-widest text-sm mb-2 block">{t('about.who.tag')}</span>
            <h2 className="text-4xl font-black text-kmmr-blue dark:text-white mb-6">{t('about.who.title')}</h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              <p className="font-medium text-xl text-kmmr-blue/80 dark:text-blue-300">
                {t('about.who.p1')}
              </p>
              <p>
                {t('about.who.p2')}
              </p>
              <p>
                {t('about.who.p3')}
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-kmmr-green/20 rounded-3xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="КММР Team" 
              className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Detailed History Timeline */}
      <div className="bg-white dark:bg-gray-900 py-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-kmmr-blue dark:text-white">{t('about.timeline.title')}</h2>
            <div className="w-24 h-1 bg-kmmr-pink mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Timeline Container */}
          <div className="relative ml-4 md:ml-0 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-[3px] md:left-[20%] top-0 bottom-0 w-1 bg-gray-100 dark:bg-gray-700"></div>

            <div className="space-y-12 relative">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative md:grid md:grid-cols-5 gap-8 items-start">
                  
                  {/* Year/Label Column */}
                  <div className="md:col-span-1 hidden md:flex justify-end items-center pr-8 pt-4">
                    <span className="text-2xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right w-full">
                      {event.year}
                    </span>
                  </div>

                  {/* Dot on Line */}
                  <div className={`absolute left-[-6px] md:left-[calc(20%-9px)] top-6 w-5 h-5 ${event.bg} rounded-full border-4 border-white dark:border-gray-800 shadow z-10`}></div>

                  {/* Content Card Column */}
                  <div className="md:col-span-4 pl-8 md:pl-0">
                     <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                        {/* Mobile Year Badge */}
                        <span className="md:hidden absolute top-4 right-4 text-sm font-black text-gray-300 dark:text-gray-600 uppercase">
                          {event.year}
                        </span>

                        <div className="flex items-center gap-3 mb-3">
                          <event.icon className={event.color} size={24} />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-10 md:pr-0">{event.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{event.desc}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SDGs Section */}
      <div className="bg-gray-50 dark:bg-gray-950 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-kmmr-green font-bold uppercase tracking-widest text-sm mb-2 block">{t('about.sdg.tag')}</span>
          <h2 className="text-3xl font-black text-kmmr-blue dark:text-white mb-12">{t('about.sdg.title')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sdgs.map((sdg) => (
              <div key={sdg.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all group">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110"
                  style={{ backgroundColor: sdg.color }}
                >
                  <sdg.icon size={28} />
                </div>
                <div className="text-3xl font-black text-gray-200 dark:text-gray-600 absolute top-4 right-4 group-hover:text-gray-300 dark:group-hover:text-gray-500 transition-colors">{sdg.id}</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">{sdg.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Detailed Partners Section (Team Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-black text-kmmr-blue dark:text-white">{t('about.partners.title')}</h2>
           <p className="mt-4 text-gray-600 dark:text-gray-400">{t('about.partners.desc')}</p>
        </div>

        <div className="space-y-16">
          {partners.map((group) => (
            <div key={group.id} className="relative">
              {/* Group Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-lg text-white ${group.color}`}>
                  <group.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-kmmr-blue dark:text-white">{group.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{group.description}</p>
                </div>
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.items.map((partner, idx) => (
                  <div 
                    key={idx}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-video overflow-hidden bg-white relative flex items-center justify-center p-4">
                      {/* Changed to object-contain for better logo visibility and added padding */}
                      <img 
                        src={partner.image} 
                        alt={partner.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-center text-center h-20 bg-gray-50 dark:bg-gray-700">
                       <h4 className="font-bold text-sm text-kmmr-blue dark:text-gray-200 leading-tight">{partner.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};