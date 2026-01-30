import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, FileText, Calendar, LogOut, Plus, Search, Trash2, Edit2, Download, Briefcase, CheckCircle, XCircle, Clock, Loader2, Save, GripVertical, List, Languages, Image as ImageIcon, Smile, Filter, ChevronDown, ChevronUp, Building2, Palette, Handshake, Link as LinkIcon, Settings, Mail, Instagram, Menu, X, HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy, onSnapshot, writeBatch 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { 
  Submission, 
  DocumentItem, 
  Project, 
  Opportunity, 
  TeamMember, 
  Department, 
  PartnerItem, 
  PartnerType,
  SupportSubmission,
  ContactSubmission,
  ApplicationSubmission
} from '../types';
// @ts-ignore - using importmap for xlsx
import { utils, writeFile } from 'xlsx';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'projects' | 'docs' | 'opportunities' | 'team' | 'partners'>('submissions');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [partnerTypes, setPartnerTypes] = useState<PartnerType[]>([]);
  
  // Drag and Drop State
  const [draggedDeptIndex, setDraggedDeptIndex] = useState<number | null>(null);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [draggedDocIndex, setDraggedDocIndex] = useState<number | null>(null);
  const [draggedPartnerIndex, setDraggedPartnerIndex] = useState<number | null>(null);
  const [draggedPartnerTypeIndex, setDraggedPartnerTypeIndex] = useState<number | null>(null);
  const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);

  // Submission Filters
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'contact' | 'application' | 'newsletter' | 'support'>('all');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  // Team Filters & State
  const [teamFilterDept, setTeamFilterDept] = useState<string>('all');
  const [showDeptManager, setShowDeptManager] = useState(false);

  // Partners State
  const [partnerFilterType, setPartnerFilterType] = useState<string>(''); // Default to first available type
  const [showPartnerTypeManager, setShowPartnerTypeManager] = useState(false);

  // Form States (Simplified for brevity, usually these would be in separate components or modals)
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({ questions: [] });
  const [projectLang, setProjectLang] = useState<'uk' | 'en'>('uk');
  
  const [isAddingOpp, setIsAddingOpp] = useState(false);
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({ type: 'Volunteering', questions: [] });
  const [oppLang, setOppLang] = useState<'uk' | 'en'>('uk');

  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({ details: [], detailsEn: [] });
  const [teamLang, setTeamLang] = useState<'uk' | 'en'>('uk');
  const [teamDetailsStr, setTeamDetailsStr] = useState('');
  const [teamDetailsEnStr, setTeamDetailsEnStr] = useState('');

  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDept, setNewDept] = useState<Partial<Department>>({ color: '#031B47' });
  const [deptLang, setDeptLang] = useState<'uk' | 'en'>('uk');

  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<PartnerItem>>({ bgColor: '#ffffff', link: '#' });
  const [partnerLang, setPartnerLang] = useState<'uk' | 'en'>('uk');

  const [isAddingPartnerType, setIsAddingPartnerType] = useState(false);
  const [newPartnerType, setNewPartnerType] = useState<Partial<PartnerType>>({ color: '#031B47' });
  const [partnerTypeLang, setPartnerTypeLang] = useState<'uk' | 'en'>('uk');

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Helper to handle permission errors nicely
  const handleFirebaseError = (error: any, action: string) => {
    console.error(`Error during ${action}:`, error);
    if (error.code === 'permission-denied') {
      alert(`Помилка доступу (${action}).\n\nБудь ласка, перевірте 'Firestore Database Rules' або 'Storage Rules' у Firebase Console.\n\nКод помилки: permission-denied`);
    } else {
      alert(`Помилка (${action}): ${error.message}`);
    }
  };

  // --- FETCH DATA (Realtime Listeners) ---
  useEffect(() => {
    try {
      const unsubSubmissions = onSnapshot(query(collection(db, "submissions"), orderBy("createdAt", "desc")), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
        setSubmissions(data);
      }, (error) => console.error("Submissions listener error:", error));

      const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });
        setProjects(data);
      }, (error) => console.error("Projects listener error:", error));

      const unsubDocs = onSnapshot(collection(db, "documents"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentItem));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });
        setDocuments(data);
      }, (error) => console.error("Docs listener error:", error));
      
      const unsubOpps = onSnapshot(collection(db, "opportunities"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
        setOpportunities(data);
      }, (error) => console.error("Opps listener error:", error));

      const unsubTeam = onSnapshot(collection(db, "team"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });
        setTeamMembers(data);
      }, (error) => console.error("Team listener error:", error));

      const unsubDepts = onSnapshot(collection(db, "departments"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name);
        });
        setDepartments(data);
      }, (error) => console.error("Departments listener error:", error));

      const unsubPartners = onSnapshot(collection(db, "partners"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerItem));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });
        setPartners(data);
      }, (error) => console.error("Partners listener error:", error));

      const unsubPartnerTypes = onSnapshot(collection(db, "partner_types"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerType));
        data.sort((a,b) => {
          const orderA = a.order !== undefined ? a.order : 999;
          const orderB = b.order !== undefined ? b.order : 999;
          return orderA - orderB;
        });
        setPartnerTypes(data);
        // Set default filter if not set and data exists
        if (data.length > 0) {
           setPartnerFilterType(prev => prev || data[0].id);
        }
      }, (error) => console.error("Partner Types listener error:", error));

      setLoading(false);

      return () => {
        unsubSubmissions();
        unsubProjects();
        unsubDocs();
        unsubOpps();
        unsubTeam();
        unsubDepts();
        unsubPartners();
        unsubPartnerTypes();
      };
    } catch (e) {
      console.error("Setup listeners failed", e);
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); 
  };

  const updateStatus = async (id: string, newStatus: Submission['status']) => {
    try {
      await updateDoc(doc(db, "submissions", id), { status: newStatus });
    } catch (e) { handleFirebaseError(e, 'оновлення статусу'); }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if(confirm('Ви впевнені, що хочете видалити цей запис?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (e: any) {
        handleFirebaseError(e, 'видалення запису');
      }
    }
  };

  // --- REORDERING & DRAG-AND-DROP LOGIC ---

  const handleReorder = async (list: any[], setList: Function, collectionName: string) => {
    try {
      const batch = writeBatch(db);
      list.forEach((item, index) => {
        const ref = doc(db, collectionName, item.id);
        batch.update(ref, { order: index });
      });
      await batch.commit();
    } catch (e) {
      handleFirebaseError(e, 'збереження порядку');
    }
  };

  const moveItemGeneric = (index: number, direction: 'up' | 'down', list: any[], setList: Function, collectionName: string) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === list.length - 1)) return;
    
    const newList = [...list];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    
    setList(newList);
    handleReorder(newList, setList, collectionName);
  };

  // Wrapper for Documents
  const moveItem = (index: number, direction: 'up' | 'down', list: any[], setList: any, collectionName: string) => 
    moveItemGeneric(index, direction, list, setList, collectionName);

  // Wrapper for Projects
  const moveProject = (index: number, direction: 'up' | 'down') => 
    moveItemGeneric(index, direction, projects, setProjects, 'projects');

  // Wrapper for Partners
  const movePartner = (index: number, direction: 'up' | 'down') => {
    const filtered = partners.filter(p => p.type === partnerFilterType);
    if (filtered.length < 2) return;
    
    // We need to reorder within the filtered context, then merge back to full list logic
    // But simplest is to just swap order values of the two items involved if they are adjacent
    // However, since we show a filtered list, "adjacent" in UI isn't adjacent in full array.
    // For simplicity in this basic dashboard: we reorder the *filtered* list and update their order values.
    
    const itemToMove = filtered[index];
    const itemTarget = filtered[direction === 'up' ? index - 1 : index + 1];
    
    if(!itemToMove || !itemTarget) return;

    // Swap their order values
    const order1 = itemToMove.order || 0;
    const order2 = itemTarget.order || 0;

    const batch = writeBatch(db);
    batch.update(doc(db, 'partners', itemToMove.id), { order: order2 });
    batch.update(doc(db, 'partners', itemTarget.id), { order: order1 });
    batch.commit();
  };

  // Wrapper for Team
  const moveTeamMember = (index: number, direction: 'up' | 'down') => {
    const filtered = teamMembers.filter(m => m.department === teamFilterDept);
    if (filtered.length < 2) return;
    
    const itemToMove = filtered[index];
    const itemTarget = filtered[direction === 'up' ? index - 1 : index + 1];
    if(!itemToMove || !itemTarget) return;

    const order1 = itemToMove.order || 0;
    const order2 = itemTarget.order || 0;

    const batch = writeBatch(db);
    batch.update(doc(db, 'team', itemToMove.id), { order: order2 });
    batch.update(doc(db, 'team', itemTarget.id), { order: order1 });
    batch.commit();
  };

  // Drag Handlers
  const handleDragStartDept = (index: number) => setDraggedDeptIndex(index);
  const handleDropDept = async (dropIndex: number) => {
    if (draggedDeptIndex === null || draggedDeptIndex === dropIndex) return;
    const newList = [...departments];
    const [moved] = newList.splice(draggedDeptIndex, 1);
    newList.splice(dropIndex, 0, moved);
    setDepartments(newList);
    setDraggedDeptIndex(null);
    handleReorder(newList, setDepartments, 'departments');
  };

  const handleDragStartProject = (index: number) => setDraggedProjectIndex(index);
  const handleDropProject = async (dropIndex: number) => {
    if (draggedProjectIndex === null || draggedProjectIndex === dropIndex) return;
    const newList = [...projects];
    const [moved] = newList.splice(draggedProjectIndex, 1);
    newList.splice(dropIndex, 0, moved);
    setProjects(newList);
    setDraggedProjectIndex(null);
    handleReorder(newList, setProjects, 'projects');
  };

  const handleDragStartDoc = (index: number) => setDraggedDocIndex(index);
  const handleDropDoc = async (dropIndex: number) => {
    if (draggedDocIndex === null || draggedDocIndex === dropIndex) return;
    const newList = [...documents];
    const [moved] = newList.splice(draggedDocIndex, 1);
    newList.splice(dropIndex, 0, moved);
    setDocuments(newList);
    setDraggedDocIndex(null);
    handleReorder(newList, setDocuments, 'documents');
  };

  const handleDragStartPartnerType = (index: number) => setDraggedPartnerTypeIndex(index);
  const handleDropPartnerType = async (dropIndex: number) => {
    if (draggedPartnerTypeIndex === null || draggedPartnerTypeIndex === dropIndex) return;
    const newList = [...partnerTypes];
    const [moved] = newList.splice(draggedPartnerTypeIndex, 1);
    newList.splice(dropIndex, 0, moved);
    setPartnerTypes(newList);
    setDraggedPartnerTypeIndex(null);
    handleReorder(newList, setPartnerTypes, 'partner_types');
  };

  const handleDragStartPartner = (index: number) => setDraggedPartnerIndex(index);
  const handleDropPartner = async (dropIndex: number) => {
    // Only support drag/drop within filtered view for simplicity logic
    if (draggedPartnerIndex === null || draggedPartnerIndex === dropIndex) return;
    const filtered = partners.filter(p => p.type === partnerFilterType);
    
    const newList = [...filtered];
    const [moved] = newList.splice(draggedPartnerIndex, 1);
    newList.splice(dropIndex, 0, moved);
    
    setDraggedPartnerIndex(null);
    
    // Update order of all items in this filtered list
    try {
      const batch = writeBatch(db);
      newList.forEach((item, idx) => {
        batch.update(doc(db, 'partners', item.id), { order: idx });
      });
      await batch.commit();
    } catch (e) {
      handleFirebaseError(e, 'оновлення порядку партнерів');
    }
  };

  const handleDragStartMember = (index: number) => setDraggedMemberIndex(index);
  const handleDropMember = async (dropIndex: number) => {
    if (draggedMemberIndex === null || draggedMemberIndex === dropIndex) return;
    const filtered = teamMembers.filter(m => m.department === teamFilterDept);
    
    const newList = [...filtered];
    const [moved] = newList.splice(draggedMemberIndex, 1);
    newList.splice(dropIndex, 0, moved);
    
    setDraggedMemberIndex(null);
    
    try {
      const batch = writeBatch(db);
      newList.forEach((item, idx) => {
        batch.update(doc(db, 'team', item.id), { order: idx });
      });
      await batch.commit();
    } catch (e) {
      handleFirebaseError(e, 'оновлення порядку команди');
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-600';
      case 'contacted': return 'bg-yellow-100 text-yellow-600';
      case 'approved': return 'bg-green-100 text-green-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- EXTRACT UNIQUE EVENTS FOR FILTER ---
  const uniqueEvents = useMemo(() => {
    const events = new Set<string>();
    submissions.forEach((sub: any) => {
      if (sub.formType === 'opportunity_application' && sub.opportunityTitle) {
        events.add(sub.opportunityTitle);
      }
    });
    return Array.from(events);
  }, [submissions]);

  // --- FILTER LOGIC ---
  const getFilteredSubmissions = () => {
    return submissions.filter(sub => {
      const type = sub.formType;
      
      // If we are looking for Newsletter subscribers
      if (submissionFilter === 'newsletter') {
         return type === 'newsletter';
      }

      // If we are looking for Support requests
      if (submissionFilter === 'support') {
         return type === 'initiative_support';
      }

      // If we are looking for other tabs, EXCLUDE newsletter and support items
      if (type === 'newsletter' || type === 'initiative_support') return false;

      const isApp = type === 'opportunity_application';
      
      // 1. Filter by Type
      if (submissionFilter === 'application' && !isApp) return false;
      if (submissionFilter === 'contact' && isApp) return false;

      // 2. Filter by Event (only if showing applications or all)
      if (selectedEventFilter !== 'all') {
         if (!isApp) return false; // Hide contacts if filtering by specific event
         if ((sub as ApplicationSubmission).opportunityTitle !== selectedEventFilter) return false;
      }

      return true;
    });
  };

  const filteredSubmissions = getFilteredSubmissions();

  // --- EXPORT TO EXCEL ---
  const downloadExcel = () => {
    const dataToExport = getFilteredSubmissions();
    if (dataToExport.length === 0) { alert("Немає даних для експорту"); return; }

    const formattedData = dataToExport.map(sub => {
      const isApp = sub.formType === 'opportunity_application';
      const isSupport = sub.formType === 'initiative_support';
      const isNewsletter = sub.formType === 'newsletter';
      
      if (isNewsletter) {
         return {
            "ID": sub.id, "Email": (sub as any).email, "Date": sub.createdAt
         };
      }

      const date = sub.createdAt && typeof sub.createdAt === 'object' 
        ? new Date((sub.createdAt as any).seconds * 1000).toLocaleString('uk-UA') 
        : sub.createdAt;
      
      let typeLabel = isApp ? 'Реєстрація' : 'Контакт';
      if (isSupport) typeLabel = 'Підтримка';

      const baseObj: any = {
        "ID": sub.id,
        "Дата": date,
        "Статус": sub.status,
        "Тип": typeLabel,
      };

      if (isSupport) {
         const s = sub as SupportSubmission;
         baseObj["Ім'я/Представник"] = s.representativeName;
         baseObj["Організація"] = s.orgName;
         baseObj["Телефон"] = s.phone;
         baseObj["Email"] = s.email;
         baseObj["Назва Проєкту"] = s.projectTitle;
         baseObj["Тип Підтримки"] = s.supportType;
         baseObj["Опис"] = s.description;
      } else if (isApp) {
         const s = sub as ApplicationSubmission;
         baseObj["Ім'я"] = s.name;
         baseObj["Телефон"] = s.phone;
         baseObj["Email"] = s.email;
         baseObj["Подія"] = s.opportunityTitle;
         if (s.answers) {
            Object.entries(s.answers).forEach(([key, val]) => {
                const cleanKey = key.replace(/_/g, ' ').replace('q ', '');
                baseObj[`Відповідь: ${cleanKey}`] = val;
            });
         }
      } else {
         const s = sub as ContactSubmission;
         baseObj["Ім'я"] = s.name;
         baseObj["Телефон"] = s.phone;
         baseObj["Email"] = s.email;
         baseObj["Департамент"] = s.department || '-';
         baseObj["Мотивація"] = s.motivation || '';
      }
      return baseObj;
    });
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Заявки");
    const fileName = `Export_${submissionFilter}_${new Date().toISOString().split('T')[0]}.xlsx`;
    writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      <aside className={`w-64 bg-kmmr-blue text-white flex flex-col fixed h-full z-30 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <button onClick={() => handleNavClick('submissions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'submissions' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Users size={20} />
            <span className="font-medium">Заявки</span>
            {submissions.filter(s => s.status === 'new').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{submissions.filter(s => s.status === 'new').length}</span>
            )}
          </button>
          <button onClick={() => handleNavClick('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}><Calendar size={20} /><span className="font-medium">Проєкти</span></button>
          <button onClick={() => handleNavClick('opportunities')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'opportunities' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}><Briefcase size={20} /><span className="font-medium">Можливості</span></button>
          <button onClick={() => handleNavClick('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'team' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}><Smile size={20} /><span className="font-medium">Команда</span></button>
          <button onClick={() => handleNavClick('partners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'partners' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}><Handshake size={20} /><span className="font-medium">Партнери</span></button>
          <button onClick={() => handleNavClick('docs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'docs' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}><FileText size={20} /><span className="font-medium">Документи</span></button>
        </nav>
        <div className="p-4 border-t border-white/10">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 hover:text-red-200 rounded-lg transition-colors">
             <LogOut size={20} />
             <span className="font-medium">Вийти</span>
           </button>
        </div>
      </aside>

      <main className="flex-grow md:ml-64 p-4 md:p-8 transition-all duration-300">
        
        {/* 1. SUBMISSIONS CRM */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => { setSubmissionFilter('all'); setSelectedEventFilter('all'); }}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${submissionFilter === 'all' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Всі
                  </button>
                  <button 
                    onClick={() => { setSubmissionFilter('contact'); setSelectedEventFilter('all'); }}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${submissionFilter === 'contact' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Зв'язок
                  </button>
                  <button 
                    onClick={() => setSubmissionFilter('application')}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${submissionFilter === 'application' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Реєстрації
                  </button>
                  <button 
                    onClick={() => setSubmissionFilter('support')}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all flex items-center gap-1 ${submissionFilter === 'support' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <HeartHandshake size={14} /> Підтримка
                  </button>
                  <button 
                    onClick={() => setSubmissionFilter('newsletter')}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${submissionFilter === 'newsletter' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Розсилка
                  </button>
                </div>
                
                {/* Event Dropdown Filter */}
                {submissionFilter !== 'contact' && submissionFilter !== 'newsletter' && submissionFilter !== 'support' && uniqueEvents.length > 0 && (
                   <div className="relative w-full sm:w-auto">
                      <select 
                        value={selectedEventFilter}
                        onChange={(e) => setSelectedEventFilter(e.target.value)}
                        className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-kmmr-blue focus:outline-none focus:ring-2 focus:ring-kmmr-blue/20 cursor-pointer sm:min-w-[200px]"
                      >
                         <option value="all">Всі події</option>
                         {uniqueEvents.map(event => (
                           <option key={event} value={event}>{event}</option>
                         ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                   </div>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                 <button onClick={downloadExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm transition-colors shadow-sm">
                    <Download size={16} /> <span className="hidden sm:inline">Експорт (XLSX)</span>
                 </button>
                 <div className="text-sm text-gray-500 font-semibold px-2">
                    Всього: {filteredSubmissions.length}
                 </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
               {/* --- NEWSLETTER TABLE --- */}
               {submissionFilter === 'newsletter' ? (
                 <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="p-4 text-sm font-bold text-gray-500 uppercase">ID</th>
                          <th className="p-4 text-sm font-bold text-gray-500 uppercase">Email</th>
                          <th className="p-4 text-sm font-bold text-gray-500 uppercase">Дата підписки</th>
                          <th className="p-4 text-sm font-bold text-gray-500 uppercase">Дії</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredSubmissions.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-sm font-bold text-gray-400">#{idx + 1}</td>
                            <td className="p-4"><div className="font-bold text-gray-800">{(sub as any).email}</div></td>
                            <td className="p-4 text-sm text-gray-500">{sub.createdAt && typeof sub.createdAt === 'object' ? new Date((sub.createdAt as any).seconds * 1000).toLocaleString('uk-UA') : sub.createdAt || '-'}</td>
                            <td className="p-4"><button onClick={() => deleteItem('submissions', sub.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button></td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
               ) : (
                 /* --- MAIN TABLE (App, Contact, Support) --- */
                 filteredSubmissions.length === 0 ? (
                   <div className="p-12 text-center flex flex-col items-center text-gray-400">
                      <Search className="w-12 h-12 mb-2 opacity-50"/>
                      <p>Заявки відсутні в цій категорії.</p>
                   </div>
                 ) : (
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Ім'я / Дата</th>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Тип заявки</th>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Контакти</th>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Деталі</th>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Статус</th>
                        <th className="p-4 text-sm font-bold text-gray-500 uppercase">Дії</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSubmissions.map(sub => {
                        const isSupport = sub.formType === 'initiative_support';
                        const isApp = sub.formType === 'opportunity_application';
                        
                        // Type guards for safe access
                        const supportSub = isSupport ? sub as SupportSubmission : null;
                        const appSub = isApp ? sub as ApplicationSubmission : null;
                        const contactSub = (!isSupport && !isApp) ? sub as ContactSubmission : null;

                        return (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-800">
                                {isSupport ? supportSub?.representativeName : (appSub?.name || contactSub?.name)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {sub.createdAt && typeof sub.createdAt === 'object' 
                                ? new Date((sub.createdAt as any).seconds * 1000).toLocaleDateString() 
                                : sub.createdAt}
                            </div>
                          </td>
                          <td className="p-4">
                              {isApp ? (
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-kmmr-purple bg-purple-50 px-2 py-0.5 rounded w-fit mb-1">Реєстрація</span>
                                      <span className="text-sm font-bold text-gray-800 leading-tight">{appSub?.opportunityTitle}</span>
                                      <span className="text-xs text-gray-500">{appSub?.type}</span>
                                  </div>
                              ) : isSupport ? (
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mb-1">Підтримка</span>
                                      <span className="text-sm font-bold text-gray-800">{supportSub?.orgName}</span>
                                      <span className="text-xs text-gray-500">{supportSub?.supportType}</span>
                                  </div>
                              ) : (
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit mb-1">Контакт</span>
                                      <span className="text-sm font-bold text-gray-700">{contactSub?.department || 'Загальне питання'}</span>
                                  </div>
                              )}
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">
                               {isSupport ? supportSub?.email : (appSub?.email || contactSub?.email)}
                            </div>
                            <div className="text-sm text-gray-500">
                               {isSupport ? supportSub?.phone : (appSub?.phone || contactSub?.phone)}
                            </div>
                          </td>
                          <td className="p-4">
                              {isSupport ? (
                                <div className="space-y-1 text-xs text-gray-600 max-w-xs">
                                    <div><span className="font-bold">Проєкт:</span> {supportSub?.projectTitle}</div>
                                    <div className="italic line-clamp-2" title={supportSub?.description}>"{supportSub?.description}"</div>
                                </div>
                              ) : isApp ? (
                                  <div className="space-y-1 text-xs text-gray-600 max-w-xs">
                                      {appSub?.answers && Object.entries(appSub.answers).map(([key, val]) => (
                                          <div key={key} className="truncate group relative cursor-help">
                                              <span className="font-bold text-gray-700">{key.replace(/_/g, ' ')}:</span> {String(val)}
                                              <div className="absolute hidden group-hover:block z-10 bg-black text-white p-2 rounded text-xs w-64 -translate-y-full left-0 shadow-lg">
                                                {String(val)}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="text-xs text-gray-600 max-w-xs line-clamp-3 italic" title={contactSub?.motivation}>"{contactSub?.motivation}"</div>
                              )}
                          </td>
                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(sub.status)}`}>{sub.status}</span></td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button onClick={() => updateStatus(sub.id, 'contacted')} title="Зв'язались" className="p-1 text-yellow-500 hover:bg-yellow-50 rounded"><Clock size={18}/></button>
                              <button onClick={() => updateStatus(sub.id, 'approved')} title="Прийнято" className="p-1 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={18}/></button>
                              <button onClick={() => updateStatus(sub.id, 'rejected')} title="Відхилено" className="p-1 text-red-500 hover:bg-red-50 rounded"><XCircle size={18}/></button>
                              <button onClick={() => deleteItem('submissions', sub.id)} title="Видалити" className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                 )
               )}
            </div>
          </div>
        )}

        {/* ... (Docs, Projects, Opportunities, Team, Partners Tabs) ... */}
        {activeTab === 'docs' && (
           <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, index) => (
                <div key={doc.id} draggable onDragStart={() => handleDragStartDoc(index)} onDragOver={handleDragOver} onDrop={() => handleDropDoc(index)} className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4 group cursor-move transition-all ${draggedDocIndex === index ? 'opacity-50 border-dashed border-kmmr-blue' : ''}`}>
                  <div className="mt-2 text-gray-300 hidden md:block"><GripVertical size={20}/></div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0"><FileText className="text-gray-500" /></div>
                  <div className="flex-grow min-w-0"><h3 className="font-bold text-gray-800 truncate">{doc.title}</h3><p className="text-xs text-gray-500 mt-1">{doc.date} • {doc.size}</p><a href={doc.link} target="_blank" rel="noreferrer" className="text-xs text-kmmr-blue hover:underline mt-1 block">Завантажити</a></div>
                  <div className="flex flex-col gap-1 items-center"><button onClick={() => moveItem(index, 'up', documents, setDocuments, 'documents')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-kmmr-blue"><ChevronUp size={16}/></button><button onClick={() => moveItem(index, 'down', documents, setDocuments, 'documents')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-kmmr-blue"><ChevronDown size={16}/></button></div>
                  <button onClick={() => deleteItem('documents', doc.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all absolute top-2 right-2"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
           </div>
        )}
        
        {activeTab === 'projects' && (
           <div className="space-y-6">
             {/* Note: In a real app, this would render project cards similar to docs with drag and drop handlers using handleDragStartProject/handleDropProject/moveProject */}
             <div onClick={() => { setNewProject({ questions: [] }); setFileToUpload(null); setIsAddingProject(true); }} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-100 transition-colors group"><Plus className="w-8 h-8 text-kmmr-blue" /><span className="font-bold text-gray-500 text-lg mt-2">Створити Проєкт</span></div>
             
             {projects.map((proj, index) => (
                <div key={proj.id} draggable onDragStart={() => handleDragStartProject(index)} onDragOver={handleDragOver} onDrop={() => handleDropProject(index)} className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 group cursor-move ${draggedProjectIndex === index ? 'opacity-50' : ''}`}>
                   <div className="mt-1 text-gray-300"><GripVertical size={20}/></div>
                   <img src={proj.image} className="w-16 h-16 object-cover rounded-lg" />
                   <div className="flex-grow">
                      <h4 className="font-bold">{proj.title}</h4>
                      <p className="text-xs text-gray-500">{proj.date}</p>
                   </div>
                   <div className="flex flex-col gap-1">
                      <button onClick={() => moveProject(index, 'up')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-kmmr-blue"><ChevronUp size={16}/></button>
                      <button onClick={() => moveProject(index, 'down')} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-kmmr-blue"><ChevronDown size={16}/></button>
                   </div>
                   <button onClick={() => deleteItem('projects', proj.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                </div>
             ))}
           </div>
        )}

        {/* ... (Team and Partners would follow similar patterns using the handlers defined above) ... */}
      </main>
    </div>
  );
};