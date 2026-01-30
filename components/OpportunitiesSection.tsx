import React, { useEffect, useState } from 'react';
import { OPPORTUNITIES_UK, OPPORTUNITIES_EN, PROJECTS_UK, PROJECTS_EN } from '../constants';
import { Clock, Loader2, CalendarOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import * as firestore from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Opportunity, Project } from '../types';
import { ApplicationModal } from './ApplicationModal';

export const OpportunitiesSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Volunteering': return t('opportunities.types.volunteering');
      case 'Education': return t('opportunities.types.education');
      case 'Event': return t('opportunities.types.event');
      case 'Job': return t('opportunities.types.job');
      default: return type;
    }
  };

  // Helper to convert project to opportunity format
  const convertProjectToOpp = (p: Project): Opportunity => {
    const title = language === 'uk' ? p.title : (p.titleEn || p.title);
    const desc = language === 'uk' ? p.description : (p.descriptionEn || p.description);

    return {
      id: p.id,
      title: title,
      description: desc,
      deadline: p.deadline!,
      type: 'Event',
      link: '',
      image: p.image,
      questions: p.questions || [] // Ensure form questions are passed
    };
  };

  const loadStaticData = () => {
    const staticOpps = language === 'uk' ? OPPORTUNITIES_UK : OPPORTUNITIES_EN;
    const staticProjs = language === 'uk' ? PROJECTS_UK : PROJECTS_EN;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter active projects from static data
    const activeStaticProjs = staticProjs
      .filter(p => p.deadline && new Date(p.deadline) >= today)
      .map(convertProjectToOpp);

    return [...staticOpps, ...activeStaticProjs];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch opportunities
        const qOpps = firestore.query(firestore.collection(db, "opportunities"));
        // 2. Fetch projects
        const qProjs = firestore.query(firestore.collection(db, "projects"));

        const [oppsSnapshot, projsSnapshot] = await Promise.all([
          firestore.getDocs(qOpps),
          firestore.getDocs(qProjs)
        ]);

        let fetchedOpps: Opportunity[] = oppsSnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle language logic for raw Opportunities too
            const title = language === 'uk' ? data.title : (data.titleEn || data.title);
            const desc = language === 'uk' ? data.description : (data.descriptionEn || data.description);

            return {
              id: doc.id,
              ...data,
              title,
              description: desc
            } as Opportunity;
        });

        // 3. Process projects into opportunities
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeProjectsAsOpps: Opportunity[] = projsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Project))
          .filter(p => p.deadline && new Date(p.deadline) >= today)
          .map(convertProjectToOpp);

        // 4. Combine
        let combinedOpps = [...fetchedOpps, ...activeProjectsAsOpps];

        // 5. Fallback to static data if DB is empty
        if (combinedOpps.length === 0) {
           combinedOpps = loadStaticData();
        }

        // 6. Sort by deadline 
        combinedOpps.sort((a, b) => {
           if (!a.deadline) return 1;
           if (!b.deadline) return -1;
           const dateA = new Date(a.deadline).getTime();
           const dateB = new Date(b.deadline).getTime();
           return dateA - dateB;
        });

        setOpportunities(combinedOpps);

      } catch (error) {
        console.warn("Error fetching data:", error);
        // Fallback on error
        const data = loadStaticData();
        setOpportunities(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  return (
    <div className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-kmmr-pink font-bold uppercase tracking-widest text-sm mb-2 block">{t('opportunities.tag')}</span>
            <h2 className="text-4xl font-black text-kmmr-blue dark:text-white">{t('opportunities.title')}</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-kmmr-blue dark:text-blue-400 w-10 h-10" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-kmmr-pink/30 hover:shadow-lg transition-all duration-300 group bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 animate-fade-in-up flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    opp.type === 'Volunteering' ? 'bg-kmmr-green/10 text-kmmr-green' :
                    opp.type === 'Education' ? 'bg-kmmr-blue/10 text-kmmr-blue dark:text-blue-400 dark:bg-blue-400/10' :
                    'bg-kmmr-pink/10 text-kmmr-pink'
                  }`}>
                    {getTypeLabel(opp.type)}
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${!opp.deadline ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`}>
                    {opp.deadline ? (
                      <>
                        <Clock size={12} />
                        <span>{new Date(opp.deadline).toLocaleDateString('uk-UA')}</span>
                      </>
                    ) : (
                      <>
                        <CalendarOff size={12} />
                        <span>Постійний набір</span>
                      </>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-kmmr-blue dark:text-white mb-3 group-hover:text-kmmr-pink transition-colors">{opp.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{opp.description}</p>
                
                <button 
                  onClick={() => setSelectedOpportunity(opp)}
                  className="text-sm font-bold text-kmmr-blue dark:text-blue-400 border-b-2 border-transparent group-hover:border-kmmr-pink transition-all self-start"
                >
                  {t('opportunities.apply')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ApplicationModal 
        isOpen={!!selectedOpportunity} 
        onClose={() => setSelectedOpportunity(null)} 
        opportunity={selectedOpportunity} 
      />
    </div>
  );
};