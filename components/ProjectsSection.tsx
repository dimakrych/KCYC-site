import React, { useEffect, useState } from 'react';
import { PROJECTS_UK, PROJECTS_EN } from '../constants';
import { ExternalLink, Calendar, Loader2, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Project, Opportunity } from '../types';
import { Modal } from './ui/Modal';
import { ApplicationModal } from './ApplicationModal';
import { useNavigate } from 'react-router-dom';

interface ProjectsSectionProps {
  limit?: number;
  isHome?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ limit, isHome = false }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applicationOpp, setApplicationOpp] = useState<Opportunity | null>(null);

  // Fetch projects from Firebase with Realtime Listener
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "projects"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProjects: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      
      // Decide whether to use DB data or Static Fallback
      let displayProjects = fetchedProjects.length > 0 ? fetchedProjects : (language === 'uk' ? PROJECTS_UK : PROJECTS_EN);

      // HYBRID SORTING:
      // 1. Priority: Manual Order (from Drag and Drop)
      // 2. Fallback: Deadline (Nearest first)
      displayProjects.sort((a, b) => {
         const orderA = a.order !== undefined ? a.order : 9999;
         const orderB = b.order !== undefined ? b.order : 9999;
         
         // If orders are distinctly different (and not default), obey order
         if (orderA !== orderB) {
            return orderA - orderB;
         }

         // Otherwise sort by deadline
         const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
         const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
         return dateA - dateB;
      });

      setProjects(displayProjects);
      setLoading(false);
    }, (error) => {
      console.warn("Error fetching projects:", error);
      setProjects(language === 'uk' ? PROJECTS_UK : PROJECTS_EN);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [language]);

  // Determine if project is active based on deadline
  const isActiveProject = (project: Project): boolean => {
    if (!project.deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    const deadline = new Date(project.deadline);
    return deadline >= today;
  };

  // Convert Project to Opportunity for the ApplicationModal
  const projectToOpportunity = (p: Project): Opportunity => {
    const title = language === 'uk' ? p.title : (p.titleEn || p.title);
    const desc = language === 'uk' ? p.description : (p.descriptionEn || p.description);

    return {
      id: p.id,
      title: title,
      description: desc,
      deadline: p.deadline || '',
      type: 'Event', 
      link: '',
      image: p.image,
      questions: p.questions || [] 
    };
  };

  const handleRegisterClick = (project: Project) => {
    setApplicationOpp(projectToOpportunity(project));
    setSelectedProject(null);
  };

  const getProjectTitle = (p: Project) => language === 'uk' ? p.title : (p.titleEn || p.title);
  const getProjectDesc = (p: Project) => language === 'uk' ? p.description : (p.descriptionEn || p.description);
  const getProjectFullDesc = (p: Project) => {
    if (language === 'uk') {
        return p.fullDescription || p.description;
    } else {
        return p.fullDescriptionEn || p.descriptionEn || p.fullDescription || p.description;
    }
  };

  // Determine which projects to show based on limit
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className={`py-16 transition-colors duration-300 ${isHome ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-kmmr-green font-bold uppercase tracking-widest text-sm mb-2 block">{t('projects.tag')}</span>
          <h2 className="text-4xl font-black text-kmmr-blue dark:text-white">{t('projects.title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('projects.desc')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-kmmr-blue dark:text-blue-400 w-10 h-10" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((project) => {
                const active = isActiveProject(project);
                const title = getProjectTitle(project);
                const desc = getProjectDesc(project);

                return (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full animate-fade-in-up cursor-pointer group transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={project.image} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-kmmr-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-bold border border-white/80 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          {t('projects.details')}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-kmmr-pink font-semibold">
                            <Calendar size={14} />
                            <span>{project.date}</span>
                        </div>
                        {active && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Активно</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-kmmr-blue dark:text-white mb-3 line-clamp-2">{title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">{desc}</p>
                      
                      <button 
                        onClick={(e) => {
                          if (active) {
                            e.stopPropagation();
                            handleRegisterClick(project);
                          }
                        }}
                        className={`mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${
                          active 
                            ? 'bg-kmmr-pink text-white hover:bg-pink-600 shadow-md hover:shadow-lg' 
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-kmmr-blue group-hover:text-white dark:group-hover:bg-blue-400 dark:group-hover:text-white'
                        }`}
                      >
                        {active ? 'Реєстрація' : t('projects.details')}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {limit && (
              <div className="mt-12 text-center animate-fade-in-up">
                <button 
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-kmmr-blue dark:border-blue-400 text-kmmr-blue dark:text-blue-400 rounded-full font-bold uppercase tracking-wider hover:bg-kmmr-blue hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300"
                >
                  {t('projects.viewAll')}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Detail Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)}>
        {selectedProject && (
          <div className="flex flex-col bg-white dark:bg-gray-800 transition-colors">
            <div className="h-64 w-full relative">
               <img 
                src={selectedProject.image} 
                alt={getProjectTitle(selectedProject)} 
                className="w-full h-full object-cover rounded-t-2xl" 
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-kmmr-blue flex items-center gap-2 shadow-sm">
                 <Calendar size={14} /> 
                 <span>{selectedProject.date}</span>
               </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-3xl font-black text-kmmr-blue dark:text-white mb-2 leading-tight">{getProjectTitle(selectedProject)}</h3>
              
              {selectedProject.deadline && (
                <div className="flex items-center gap-2 text-red-500 font-bold mb-4 text-sm bg-red-50 dark:bg-red-900/20 inline-block px-3 py-1 rounded-lg">
                  <Clock size={16} />
                  <span>Дедлайн реєстрації: {new Date(selectedProject.deadline).toLocaleDateString('uk-UA')}</span>
                </div>
              )}
              
              <div className="prose text-gray-600 dark:text-gray-300 mb-8 w-full max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{getProjectFullDesc(selectedProject)}</p>
              </div>

              {isActiveProject(selectedProject) ? (
                 <button 
                    onClick={() => handleRegisterClick(selectedProject)}
                    className="w-full bg-kmmr-pink hover:bg-pink-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-pink-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                 >
                    Зареєструватися на подію <ArrowRight size={20} />
                 </button>
              ) : (
                 selectedProject.instagramLink ? (
                   <a 
                     href={selectedProject.instagramLink} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90"
                   >
                     <span>Звіт в Instagram</span>
                     <ExternalLink size={20} />
                   </a>
                 ) : (
                   <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold py-4 rounded-xl text-center">
                     Подія завершена
                   </div>
                 )
              )}
            </div>
          </div>
        )}
      </Modal>

      <ApplicationModal 
        isOpen={!!applicationOpp} 
        onClose={() => setApplicationOpp(null)} 
        opportunity={applicationOpp} 
      />
    </div>
  );
};