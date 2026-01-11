import React, { useState, useEffect } from 'react';
import { DEPARTMENTS_UK, DEPARTMENTS_EN, TEAM_MEMBERS_UK, TEAM_MEMBERS_EN } from '../constants';
import { Modal } from './ui/Modal';
import { TeamMember, Department } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Loader2, Instagram } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    setLoading(true);

    // Fetch Departments (Realtime)
    const unsubDepts = onSnapshot(query(collection(db, "departments")), (snapshot) => {
        const fetchedDepts: Department[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Department));

        // Sort Departments by order
        fetchedDepts.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name);
        });

        if (fetchedDepts.length > 0) {
           setDepartments(fetchedDepts);
        } else {
           // Fallback to constants if DB is empty but typically DB has data
           setDepartments(language === 'uk' ? DEPARTMENTS_UK as any : DEPARTMENTS_EN as any);
        }
    }, (error) => {
        console.warn("Error fetching departments:", error);
        setDepartments(language === 'uk' ? DEPARTMENTS_UK as any : DEPARTMENTS_EN as any);
    });

    // Fetch Team (Realtime)
    const unsubTeam = onSnapshot(query(collection(db, "team")), (snapshot) => {
        const fetchedTeam: TeamMember[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TeamMember));

        // Sort Team Members by order
        fetchedTeam.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });

        if (fetchedTeam.length > 0) {
          setTeamMembers(fetchedTeam);
        } else {
          setTeamMembers(language === 'uk' ? TEAM_MEMBERS_UK : TEAM_MEMBERS_EN);
        }
        setLoading(false);
    }, (error) => {
        console.warn("Error fetching team:", error);
        setTeamMembers(language === 'uk' ? TEAM_MEMBERS_UK : TEAM_MEMBERS_EN);
        setLoading(false);
    });

    return () => {
        unsubDepts();
        unsubTeam();
    };
  }, [language]);

  // Function to get members for a specific department
  const getMembersByDept = (deptId: string) => {
    return teamMembers.filter(m => m.department === deptId);
  };

  // Helper to get localized text
  const getMemberName = (m: TeamMember) => language === 'uk' ? m.name : (m.nameEn || m.name);
  const getMemberRole = (m: TeamMember) => language === 'uk' ? m.role : (m.roleEn || m.role);
  const getMemberBio = (m: TeamMember) => language === 'uk' ? m.bio : (m.bioEn || m.bio);
  const getMemberDetails = (m: TeamMember) => language === 'uk' ? m.details : (m.detailsEn || m.details);

  const getDeptName = (d: Department) => language === 'uk' ? d.name : (d.nameEn || d.name);
  const getDeptDesc = (d: Department) => language === 'uk' ? d.description : (d.descriptionEn || d.description);

  return (
    <div className="py-16 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-kmmr-pink font-bold uppercase tracking-widest text-sm mb-2 block">{t('team.tag')}</span>
          <h2 className="text-4xl font-black text-kmmr-blue dark:text-white">{t('team.title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('team.desc')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-kmmr-blue dark:text-blue-400 w-10 h-10" />
          </div>
        ) : (
          <div className="space-y-16">
            {departments.map((dept) => {
              const members = getMembersByDept(dept.id);
              
              return (
                <div key={dept.id} className="relative">
                  {/* Department Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div 
                      className={`p-3 rounded-lg text-white flex items-center justify-center w-12 h-12 shrink-0 ${dept.color.startsWith('bg-') ? dept.color : ''}`}
                      style={{ backgroundColor: dept.color.startsWith('bg-') ? undefined : dept.color }}
                    >
                       {/* Render Icon: Check if string (URL) or Component (Legacy) */}
                       {typeof dept.icon === 'string' ? (
                          <img 
                            src={dept.icon} 
                            alt="" 
                            className="w-full h-full object-contain brightness-0 invert" 
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                       ) : (
                          <dept.icon size={24} />
                       )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-kmmr-blue dark:text-white">{getDeptName(dept)}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{getDeptDesc(dept)}</p>
                    </div>
                  </div>

                  {/* Members Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.length > 0 ? (
                      members.map((member) => (
                        <div 
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img 
                              src={member.image} 
                              alt={getMemberName(member)} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4">
                             <h4 className="font-bold text-lg text-kmmr-blue dark:text-white leading-tight mb-1">{getMemberName(member)}</h4>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{getMemberRole(member)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center text-gray-400 text-sm">
                        {t('team.empty')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)}>
        {selectedMember && (
          <div className="flex flex-col md:flex-row overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <div className="md:w-1/3 h-64 md:h-auto bg-gray-100 dark:bg-gray-700">
              <img 
                src={selectedMember.image} 
                alt={getMemberName(selectedMember)} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h3 className="text-3xl font-black text-kmmr-blue dark:text-white mb-2">{getMemberName(selectedMember)}</h3>
                <span className="bg-kmmr-green/10 text-kmmr-green px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                  {getMemberRole(selectedMember)}
                </span>
              </div>
              
              <div className="space-y-4 mb-8">
                 <p className="text-gray-600 dark:text-gray-300 italic text-lg">"{getMemberBio(selectedMember)}"</p>
                 <div className="h-px bg-gray-100 dark:bg-gray-700 w-full my-4"></div>
                 <h5 className="font-bold text-kmmr-blue dark:text-gray-200 uppercase text-sm">{t('team.modal.role')}</h5>
                 <ul className="space-y-2">
                   {getMemberDetails(selectedMember)?.map((detail, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-kmmr-pink shrink-0"></span>
                       <span>{detail}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {selectedMember.email && (
                  <a 
                    href={`mailto:${selectedMember.email}`}
                    className="inline-flex items-center gap-2 text-kmmr-blue dark:text-blue-400 hover:text-kmmr-pink font-semibold transition-colors"
                  >
                    {t('team.modal.contact')} {selectedMember.email}
                  </a>
                )}

                {selectedMember.instagram && (
                  <a 
                    href={selectedMember.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-gray-600 dark:text-gray-300"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};