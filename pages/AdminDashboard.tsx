import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, FileText, Calendar, LogOut, Plus, Search, Trash2, Edit2, Download, Briefcase, CheckCircle, XCircle, Clock, Loader2, Save, GripVertical, List, Languages, Image as ImageIcon, Smile, Filter, ChevronDown, Building2, Palette, Handshake, Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy, onSnapshot, writeBatch 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { ContactSubmission, DocumentItem, Project, Opportunity, FormQuestion, TeamMember, Department, PartnerItem } from '../types';
// @ts-ignore - using importmap for xlsx
import { utils, writeFile } from 'xlsx';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const activeTabState = useState<'submissions' | 'projects' | 'docs' | 'opportunities' | 'team' | 'partners'>('submissions');
  const [activeTab, setActiveTab] = activeTabState;
  const [loading, setLoading] = useState(true);

  // Data States
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  // Drag and Drop State
  const [draggedDeptIndex, setDraggedDeptIndex] = useState<number | null>(null);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [draggedDocIndex, setDraggedDocIndex] = useState<number | null>(null);
  const [draggedPartnerIndex, setDraggedPartnerIndex] = useState<number | null>(null);

  // Submission Filters
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'contact' | 'application'>('all');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  // Team Filters & State
  const [teamFilterDept, setTeamFilterDept] = useState<string>('all');
  const [showDeptManager, setShowDeptManager] = useState(false);

  // Partners Filter
  const [partnerFilterType, setPartnerFilterType] = useState<string>('partners');

  // Form States
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
  const [newPartner, setNewPartner] = useState<Partial<PartnerItem>>({ type: 'partners', bgColor: '#ffffff', link: '#' });
  const [partnerLang, setPartnerLang] = useState<'uk' | 'en'>('uk');

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
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
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

      setLoading(false);

      return () => {
        unsubSubmissions();
        unsubProjects();
        unsubDocs();
        unsubOpps();
        unsubTeam();
        unsubDepts();
        unsubPartners();
      };
    } catch (e) {
      console.error("Setup listeners failed", e);
      setLoading(false);
    }
  }, []);

  // --- ACTIONS ---

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const updateStatus = async (id: string, newStatus: ContactSubmission['status']) => {
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

  const handleFileUpload = async (file: File, folder: string): Promise<string> => {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // --- DRAG AND DROP HANDLERS ---
  
  // 1. Departments
  const handleDragStartDept = (index: number) => setDraggedDeptIndex(index);
  const handleDropDept = async (dropIndex: number) => {
    if (draggedDeptIndex === null || draggedDeptIndex === dropIndex) return;
    const updated = [...departments];
    const [draggedItem] = updated.splice(draggedDeptIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setDepartments(updated);
    setDraggedDeptIndex(null);
    try {
      const batch = writeBatch(db);
      updated.forEach((item, index) => {
        batch.update(doc(db, "departments", item.id), { order: index });
      });
      await batch.commit();
    } catch (error: any) { handleFirebaseError(error, 'оновлення порядку департаментів'); }
  };

  // 2. Projects
  const handleDragStartProject = (index: number) => setDraggedProjectIndex(index);
  const handleDropProject = async (dropIndex: number) => {
    if (draggedProjectIndex === null || draggedProjectIndex === dropIndex) return;
    const updated = [...projects];
    const [draggedItem] = updated.splice(draggedProjectIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setProjects(updated);
    setDraggedProjectIndex(null);
    try {
      const batch = writeBatch(db);
      updated.forEach((item, index) => {
        batch.update(doc(db, "projects", item.id), { order: index });
      });
      await batch.commit();
    } catch (error: any) { handleFirebaseError(error, 'оновлення порядку проєктів'); }
  };

  // 3. Documents
  const handleDragStartDoc = (index: number) => setDraggedDocIndex(index);
  const handleDropDoc = async (dropIndex: number) => {
    if (draggedDocIndex === null || draggedDocIndex === dropIndex) return;
    const updated = [...documents];
    const [draggedItem] = updated.splice(draggedDocIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setDocuments(updated);
    setDraggedDocIndex(null);
    try {
      const batch = writeBatch(db);
      updated.forEach((item, index) => {
        batch.update(doc(db, "documents", item.id), { order: index });
      });
      await batch.commit();
    } catch (error: any) { handleFirebaseError(error, 'оновлення порядку документів'); }
  };

  // 4. Partners (Filtered DnD)
  const handleDragStartPartner = (index: number) => setDraggedPartnerIndex(index);
  const handleDropPartner = async (dropIndex: number) => {
    if (draggedPartnerIndex === null || draggedPartnerIndex === dropIndex) return;
    
    // We are reordering within the filtered list
    const filteredList = partners.filter(p => p.type === partnerFilterType);
    const updatedFiltered = [...filteredList];
    
    const [draggedItem] = updatedFiltered.splice(draggedPartnerIndex, 1);
    updatedFiltered.splice(dropIndex, 0, draggedItem);
    
    // Now we need to merge this back into the main list or just update IDs
    // Easier: Just update 'order' for items in this specific type group
    // Note: To allow global unique ordering, we might need a sophisticated approach.
    // Simplest: We only update order for *these* items, but we need to know their relative global order?
    // Alternative: Just give them a new order index based on their position in this sub-list + a base offset?
    // Let's keep it simple: We just update the 'order' field for all items in this Type group to be consistent 0, 1, 2... 
    // This works because frontend filters by type then sorts.
    
    // Update local state (visual only for now, fetch will fix sync)
    // Construct new full list
    const otherItems = partners.filter(p => p.type !== partnerFilterType);
    const newFullList = [...otherItems, ...updatedFiltered];
    setPartners(newFullList);
    setDraggedPartnerIndex(null);

    try {
      const batch = writeBatch(db);
      updatedFiltered.forEach((item, index) => {
        batch.update(doc(db, "partners", item.id), { order: index });
      });
      await batch.commit();
    } catch (error: any) { handleFirebaseError(error, 'оновлення порядку партнерів'); }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
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
      const isApp = (sub as any).formType === 'opportunity_application';
      
      // 1. Filter by Type
      if (submissionFilter === 'application' && !isApp) return false;
      if (submissionFilter === 'contact' && isApp) return false;

      // 2. Filter by Event (only if showing applications or all)
      if (selectedEventFilter !== 'all') {
         if (!isApp) return false; // Hide contacts if filtering by specific event
         if ((sub as any).opportunityTitle !== selectedEventFilter) return false;
      }

      return true;
    });
  };

  const filteredSubmissions = getFilteredSubmissions();

  // --- EXPORT TO EXCEL ---
  const downloadExcel = () => {
    const dataToExport = getFilteredSubmissions();
    if (dataToExport.length === 0) {
      alert("Немає даних для експорту");
      return;
    }
    const formattedData = dataToExport.map(sub => {
      const isApp = (sub as any).formType === 'opportunity_application';
      const date = sub.createdAt && typeof sub.createdAt === 'object' 
        ? new Date((sub.createdAt as any).seconds * 1000).toLocaleString('uk-UA') 
        : sub.createdAt;
      
      const baseObj = {
        "ID": sub.id,
        "Дата": date,
        "Статус": sub.status,
        "Тип": isApp ? 'Реєстрація' : 'Контакт',
        "Ім'я": sub.name,
        "Телефон": sub.phone,
        "Email": sub.email,
        "Подія/Департамент": (sub as any).opportunityTitle || sub.department || '-',
        "Мотивація": sub.motivation || '',
      };
      if ((sub as any).answers) {
         Object.entries((sub as any).answers).forEach(([key, val]) => {
            const cleanKey = key.replace(/_/g, ' ').replace('q ', '');
            (baseObj as any)[`Відповідь: ${cleanKey}`] = val;
         });
      }
      return baseObj;
    });
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Заявки");
    const max_width = formattedData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet["!cols"] = [ { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 30 } ];
    const fileName = selectedEventFilter !== 'all' 
      ? `Export_${selectedEventFilter.substring(0, 20)}_${new Date().toISOString().split('T')[0]}.xlsx`
      : `Export_All_${new Date().toISOString().split('T')[0]}.xlsx`;
    writeFile(workbook, fileName);
  };

  // --- PARTNER LOGIC ---
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.type) return;
    setLoading(true);

    try {
      let imageUrl = "https://placehold.co/200x100";
      if (fileToUpload) {
         try {
           imageUrl = await handleFileUpload(fileToUpload, 'partners');
         } catch(storageErr: any) {
            handleFirebaseError(storageErr, 'завантаження лого');
            setLoading(false);
            return;
         }
      } else if (newPartner.image) {
        imageUrl = newPartner.image;
      }

      // Determine order: if new, put at end of its type list
      const typePartners = partners.filter(p => p.type === newPartner.type);
      const nextOrder = newPartner.id ? (newPartner.order ?? 999) : typePartners.length;

      const partnerPayload = {
        name: newPartner.name,
        nameEn: newPartner.nameEn || newPartner.name,
        type: newPartner.type,
        image: imageUrl,
        bgColor: newPartner.bgColor || '#ffffff',
        link: newPartner.link || '#',
        order: nextOrder
      };

      if (newPartner.id) {
         await updateDoc(doc(db, "partners", newPartner.id), partnerPayload);
      } else {
         await addDoc(collection(db, "partners"), partnerPayload);
      }

      setIsAddingPartner(false);
      setNewPartner({ type: 'partners', bgColor: '#ffffff', link: '#' });
      setFileToUpload(null);
    } catch (error: any) {
      handleFirebaseError(error, 'збереження партнера');
    } finally {
      setLoading(false);
    }
  };

  // --- TEAM MEMBER LOGIC ---
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.department) return;
    setLoading(true);

    try {
      let imageUrl = "https://placehold.co/400x400";
      
      if (fileToUpload) {
        try {
          imageUrl = await handleFileUpload(fileToUpload, 'team_images');
        } catch (storageError: any) {
          handleFirebaseError(storageError, 'завантаження фото');
          setLoading(false);
          return;
        }
      } else if (newTeamMember.image) {
        imageUrl = newTeamMember.image;
      }

      const detailsArray = teamDetailsStr.split('\n').filter(line => line.trim() !== '');
      const detailsEnArray = teamDetailsEnStr.split('\n').filter(line => line.trim() !== '');

      const teamPayload = {
        name: newTeamMember.name || '',
        nameEn: newTeamMember.nameEn || newTeamMember.name || '',
        department: newTeamMember.department || '',
        role: newTeamMember.role || '',
        roleEn: newTeamMember.roleEn || newTeamMember.role || '',
        bio: newTeamMember.bio || '',
        bioEn: newTeamMember.bioEn || newTeamMember.bio || '',
        email: newTeamMember.email || '',
        image: imageUrl,
        details: detailsArray,
        detailsEn: detailsEnArray.length > 0 ? detailsEnArray : detailsArray
      };

      if (newTeamMember.id) {
        await updateDoc(doc(db, "team", newTeamMember.id), teamPayload);
      } else {
        await addDoc(collection(db, "team"), teamPayload);
      }

      setIsAddingTeam(false);
      setNewTeamMember({ details: [], detailsEn: [] });
      setTeamDetailsStr('');
      setTeamDetailsEnStr('');
      setFileToUpload(null);
    } catch (error: any) {
      handleFirebaseError(error, 'збереження команди');
    } finally {
      setLoading(false);
    }
  };

  // --- DEPARTMENT LOGIC ---
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name) return;
    setLoading(true);

    try {
       let iconUrl = newDept.icon || "";
       if (fileToUpload) {
          iconUrl = await handleFileUpload(fileToUpload, 'department_icons');
       }

       const deptPayload = {
          name: newDept.name,
          nameEn: newDept.nameEn || newDept.name,
          description: newDept.description || '',
          descriptionEn: newDept.descriptionEn || newDept.description || '',
          color: newDept.color || '#031B47',
          icon: iconUrl,
          order: newDept.id ? (newDept.order !== undefined ? newDept.order : 999) : departments.length
       };

       if (newDept.id) {
          await updateDoc(doc(db, "departments", newDept.id), deptPayload);
       } else {
          await addDoc(collection(db, "departments"), deptPayload);
       }

       setIsAddingDept(false);
       setNewDept({ color: '#031B47' });
       setFileToUpload(null);

    } catch (error: any) {
       handleFirebaseError(error, 'збереження департаменту');
    } finally {
       setLoading(false);
    }
  };

  // --- PROJECT, OPPORTUNITY, DOCS HANDLERS (Reused) ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    setLoading(true);
    try {
      let imageUrl = "https://placehold.co/600x400";
      if (fileToUpload) {
         try {
           imageUrl = await handleFileUpload(fileToUpload, 'project_images');
         } catch(storageErr: any) {
            handleFirebaseError(storageErr, 'завантаження фото проєкту');
            setLoading(false);
            return;
         }
      } else if (newProject.image) {
        imageUrl = newProject.image;
      }
      await addDoc(collection(db, "projects"), {
        title: newProject.title || '',
        titleEn: newProject.titleEn || newProject.title || '',
        description: newProject.description || '',
        descriptionEn: newProject.descriptionEn || newProject.description || '',
        fullDescription: newProject.fullDescription || newProject.description || '',
        fullDescriptionEn: newProject.fullDescriptionEn || newProject.descriptionEn || newProject.description || '',
        date: newProject.date || new Date().toISOString().split('T')[0],
        deadline: newProject.deadline || '',
        image: imageUrl,
        instagramLink: newProject.instagramLink || '',
        questions: newProject.questions || [],
        order: newProject.id ? (newProject.order !== undefined ? newProject.order : 999) : projects.length
      });
      setIsAddingProject(false);
      setNewProject({ questions: [] });
      setFileToUpload(null);
    } catch (error: any) {
      handleFirebaseError(error, 'збереження проєкту');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectQuestion = () => {
    const newQ: FormQuestion = {
      id: `q_${Date.now()}`,
      label: 'Нове питання',
      type: 'text',
      required: false,
      placeholder: ''
    };
    setNewProject(prev => ({ ...prev, questions: [...(prev.questions || []), newQ] }));
  };

  const handleUpdateProjectQuestion = (index: number, field: keyof FormQuestion, value: any) => {
    const updatedQuestions = [...(newProject.questions || [])];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewProject({ ...newProject, questions: updatedQuestions });
  };

  const handleDeleteProjectQuestion = (index: number) => {
    const updatedQuestions = [...(newProject.questions || [])];
    updatedQuestions.splice(index, 1);
    setNewProject({ ...newProject, questions: updatedQuestions });
  };
  
  const handleAddQuestion = () => {
    const newQ: FormQuestion = {
      id: `q_${Date.now()}`,
      label: 'Нове питання',
      type: 'text',
      required: false,
      placeholder: ''
    };
    setNewOpp(prev => ({ ...prev, questions: [...(prev.questions || []), newQ] }));
  };

  const handleUpdateQuestion = (index: number, field: keyof FormQuestion, value: any) => {
    const updatedQuestions = [...(newOpp.questions || [])];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewOpp({ ...newOpp, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...(newOpp.questions || [])];
    updatedQuestions.splice(index, 1);
    setNewOpp({ ...newOpp, questions: updatedQuestions });
  };

  const handleSaveOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.deadline) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "opportunities"), {
        title: newOpp.title || '',
        titleEn: newOpp.titleEn || newOpp.title || '',
        description: newOpp.description || '',
        descriptionEn: newOpp.descriptionEn || newOpp.description || '',
        deadline: newOpp.deadline || '',
        type: newOpp.type || 'Event',
        link: '#', 
        questions: newOpp.questions || []
      });
      setIsAddingOpp(false);
      setNewOpp({ type: 'Volunteering', questions: [] });
    } catch (err: any) {
      handleFirebaseError(err, 'збереження можливості');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      try {
        const url = await handleFileUpload(file, 'documents');
        await addDoc(collection(db, "documents"), {
          title: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          date: new Date().toLocaleDateString('uk-UA'),
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          link: url,
          order: documents.length
        });
        alert('Документ завантажено!');
      } catch (err: any) {
        handleFirebaseError(err, 'завантаження документу');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-kmmr-blue text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-black tracking-wider">КММР ADMIN</h1>
          <p className="text-xs text-gray-400 mt-1">Панель керування</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('submissions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'submissions' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Users size={20} />
            <span className="font-medium">Заявки</span>
            {submissions.filter(s => s.status === 'new').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{submissions.filter(s => s.status === 'new').length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Calendar size={20} />
            <span className="font-medium">Проєкти</span>
          </button>
          <button onClick={() => setActiveTab('opportunities')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'opportunities' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Briefcase size={20} />
            <span className="font-medium">Можливості</span>
          </button>
           <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'team' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Smile size={20} />
            <span className="font-medium">Команда</span>
          </button>
          <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'partners' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Handshake size={20} />
            <span className="font-medium">Партнери</span>
          </button>
          <button onClick={() => setActiveTab('docs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'docs' ? 'bg-kmmr-pink text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <FileText size={20} />
            <span className="font-medium">Документи</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-colors">
            <LogOut size={20} />
            <span>Вийти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeTab === 'submissions' && 'Заявки волонтерів'}
            {activeTab === 'projects' && 'Керування Проєктами'}
            {activeTab === 'opportunities' && 'Актуальні Можливості'}
            {activeTab === 'docs' && 'Документообіг'}
            {activeTab === 'team' && 'Управління Командою'}
            {activeTab === 'partners' && 'Керування Партнерами'}
          </h2>
          {loading && <Loader2 className="animate-spin text-kmmr-blue" />}
        </div>

        {/* 1. SUBMISSIONS CRM */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => { setSubmissionFilter('all'); setSelectedEventFilter('all'); }}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${submissionFilter === 'all' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Всі
                  </button>
                  <button 
                    onClick={() => { setSubmissionFilter('contact'); setSelectedEventFilter('all'); }}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${submissionFilter === 'contact' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Зворотній зв'язок
                  </button>
                  <button 
                    onClick={() => setSubmissionFilter('application')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${submissionFilter === 'application' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Реєстрації
                  </button>
                </div>
                
                {/* Event Dropdown Filter */}
                {submissionFilter !== 'contact' && uniqueEvents.length > 0 && (
                   <div className="relative">
                      <select 
                        value={selectedEventFilter}
                        onChange={(e) => setSelectedEventFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-kmmr-blue focus:outline-none focus:ring-2 focus:ring-kmmr-blue/20 cursor-pointer min-w-[200px]"
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

              <div className="flex items-center gap-2">
                 <button onClick={downloadExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm transition-colors shadow-sm">
                    <Download size={16} /> Експорт (XLSX)
                 </button>
                 <div className="text-sm text-gray-500 font-semibold px-2">
                    Всього: {filteredSubmissions.length}
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               {/* ... Table ... */}
              {filteredSubmissions.length === 0 ? (
                 <div className="p-12 text-center flex flex-col items-center text-gray-400">
                    <Search className="w-12 h-12 mb-2 opacity-50"/>
                    <p>Заявки відсутні в цій категорії.</p>
                 </div>
              ) : (
              <table className="w-full text-left">
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
                  {filteredSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{sub.name}</div>
                        <div className="text-xs text-gray-500">
                          {sub.createdAt && typeof sub.createdAt === 'object' 
                            ? new Date((sub.createdAt as any).seconds * 1000).toLocaleDateString() 
                            : sub.createdAt}
                        </div>
                      </td>
                      <td className="p-4">
                          {(sub as any).formType === 'opportunity_application' ? (
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-kmmr-purple bg-purple-50 px-2 py-0.5 rounded w-fit mb-1">Реєстрація</span>
                                  <span className="text-sm font-bold text-gray-800 leading-tight">{(sub as any).opportunityTitle}</span>
                                  <span className="text-xs text-gray-500">{(sub as any).type}</span>
                               </div>
                          ) : (
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit mb-1">Контакт</span>
                                  <span className="text-sm font-bold text-gray-700">{sub.department || 'Загальне питання'}</span>
                               </div>
                          )}
                      </td>
                      <td className="p-4"><div className="text-sm font-medium">{sub.email}</div><div className="text-sm text-gray-500">{sub.phone}</div></td>
                      <td className="p-4">
                          {(sub as any).answers ? (
                               <div className="space-y-1 text-xs text-gray-600 max-w-xs">
                                   {Object.entries((sub as any).answers).map(([key, val]) => (
                                       <div key={key} className="truncate group relative cursor-help">
                                           <span className="font-bold text-gray-700">{key.replace(/_/g, ' ')}:</span> {String(val)}
                                           <div className="absolute hidden group-hover:block z-10 bg-black text-white p-2 rounded text-xs w-64 -translate-y-full left-0 shadow-lg">
                                             {String(val)}
                                           </div>
                                       </div>
                                   ))}
                               </div>
                          ) : (
                               <div className="text-xs text-gray-600 max-w-xs line-clamp-3 italic" title={sub.motivation}>"{sub.motivation}"</div>
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
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        )}

        {/* 2. DOCUMENTS MANAGER */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
             <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:bg-blue-100 transition-colors relative">
               <input 
                 type="file" 
                 onChange={handleAddDocument}
                 className="absolute inset-0 opacity-0 cursor-pointer"
               />
               <Download className="text-kmmr-blue w-12 h-12 mb-2" />
               <h3 className="font-bold text-kmmr-blue">Завантажити новий документ</h3>
               <p className="text-sm text-gray-500 mb-4">PDF, DOCX (Max 10MB)</p>
               <span className="bg-kmmr-blue text-white px-6 py-2 rounded-lg font-bold">Оберіть файл</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, index) => (
                <div 
                  key={doc.id} 
                  draggable
                  onDragStart={() => handleDragStartDoc(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropDoc(index)}
                  className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4 group cursor-move transition-all ${draggedDocIndex === index ? 'opacity-50 border-dashed border-kmmr-blue' : ''}`}
                >
                  <div className="mt-2 text-gray-300"><GripVertical size={20}/></div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="text-gray-500" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-800 truncate" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{doc.date} • {doc.size}</p>
                    <a href={doc.link} target="_blank" rel="noreferrer" className="text-xs text-kmmr-blue hover:underline mt-1 block">Завантажити</a>
                  </div>
                  <button onClick={() => deleteItem('documents', doc.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROJECTS */}
        {activeTab === 'projects' && (
           <div className="space-y-6">
             {isAddingProject && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-kmmr-pink/20 mb-6 animate-fade-in-up">
                 <div className="flex justify-between items-start mb-6">
                   <h3 className="font-bold text-xl text-kmmr-blue">Додати/Редагувати Проєкт</h3>
                   <button onClick={() => setIsAddingProject(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                </div>
                <form onSubmit={handleAddProject} className="space-y-6">
                    {/* ... Project Form fields ... */}
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                     <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Languages size={16}/> Мова контенту:</span>
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button type="button" onClick={() => setProjectLang('uk')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${projectLang === 'uk' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>UA</button>
                        <button type="button" onClick={() => setProjectLang('en')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${projectLang === 'en' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>EN</button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        {projectLang === 'uk' ? (
                          <>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Назва (UA)</label><input className="border p-2 rounded w-full" value={newProject.title || ''} onChange={e => setNewProject({...newProject, title: e.target.value})} required /></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Короткий опис</label><textarea className="border p-2 rounded w-full h-24" value={newProject.description || ''} onChange={e => setNewProject({...newProject, description: e.target.value})} required /></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Повний опис</label><textarea className="border p-2 rounded w-full h-40" value={newProject.fullDescription || ''} onChange={e => setNewProject({...newProject, fullDescription: e.target.value})} /></div>
                          </>
                        ) : (
                          <>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Title (EN)</label><input className="border p-2 rounded w-full" value={newProject.titleEn || ''} onChange={e => setNewProject({...newProject, titleEn: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Short Desc (EN)</label><textarea className="border p-2 rounded w-full h-24" value={newProject.descriptionEn || ''} onChange={e => setNewProject({...newProject, descriptionEn: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Full Desc (EN)</label><textarea className="border p-2 rounded w-full h-40" value={newProject.fullDescriptionEn || ''} onChange={e => setNewProject({...newProject, fullDescriptionEn: e.target.value})} /></div>
                          </>
                        )}
                     </div>
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="text-xs font-bold text-gray-500 uppercase">Текстова дата</label><input className="border p-2 rounded w-full" value={newProject.date || ''} onChange={e => setNewProject({...newProject, date: e.target.value})} /></div>
                           <div><label className="text-xs font-bold text-blue-700 uppercase block mb-1">Дедлайн реєстрації</label><input className="border p-2 rounded w-full text-sm" type="date" value={newProject.deadline || ''} onChange={e => setNewProject({...newProject, deadline: e.target.value})} /></div>
                        </div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Instagram Link</label><input className="border p-2 rounded w-full" value={newProject.instagramLink || ''} onChange={e => setNewProject({...newProject, instagramLink: e.target.value})} /></div>
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center"><label className="text-xs font-bold text-gray-500 uppercase block mb-2">Обкладинка (Фото)</label><input type="file" onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm"/></div>
                     </div>
                  </div>
                   <div className="border-t border-gray-200 pt-6">
                       <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><List size={20}/> Анкета Реєстрації</h4>
                       <div className="space-y-3 mb-4">
                          {newProject.questions?.map((q, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm group">
                               <div className="mt-2 text-gray-400 cursor-move"><GripVertical size={16} /></div>
                               <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input className="border p-2 rounded text-sm" value={q.label} onChange={(e) => handleUpdateProjectQuestion(idx, 'label', e.target.value)}/>
                                  <select className="border p-2 rounded text-sm" value={q.type} onChange={(e) => handleUpdateProjectQuestion(idx, 'type', e.target.value)}><option value="text">Text</option><option value="textarea">Long Text</option><option value="social">Social</option></select>
                                  <div className="flex items-center gap-3"><input className="border p-2 rounded text-sm flex-grow" placeholder="Placeholder" value={q.placeholder || ''} onChange={(e) => handleUpdateProjectQuestion(idx, 'placeholder', e.target.value)}/><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={q.required} onChange={(e) => handleUpdateProjectQuestion(idx, 'required', e.target.checked)}/> Req</label></div>
                               </div>
                               <button type="button" onClick={() => handleDeleteProjectQuestion(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                          ))}
                       </div>
                       <button type="button" onClick={handleAddProjectQuestion} className="text-sm font-bold text-kmmr-blue border border-dashed border-kmmr-blue/30 px-3 py-2 rounded-lg hover:bg-blue-50"> Додати питання</button>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button type="submit" disabled={loading} className="bg-kmmr-green text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 flex items-center gap-2">{loading ? <Loader2 className="animate-spin"/> : <Save size={18} />} Зберегти</button>
                    <button type="button" onClick={() => setIsAddingProject(false)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold">Скасувати</button>
                  </div>
                </form>
              </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div onClick={() => setIsAddingProject(true)} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center h-96 cursor-pointer hover:bg-gray-100 transition-colors group">
                 <Plus className="w-8 h-8 text-kmmr-blue" /><span className="font-bold text-gray-500 text-lg mt-2">Створити Проєкт</span>
               </div>
               {projects.map((project, index) => (
                 <div 
                   key={project.id} 
                   draggable
                   onDragStart={() => handleDragStartProject(index)}
                   onDragOver={handleDragOver}
                   onDrop={() => handleDropProject(index)}
                   className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all cursor-move ${draggedProjectIndex === index ? 'opacity-50 border-dashed border-kmmr-blue' : ''}`}
                 >
                   <div className="h-48 bg-gray-200 relative group">
                     <div className="absolute top-2 right-2 z-10 p-1 bg-black/30 rounded text-white"><GripVertical size={16}/></div>
                     <img src={project.image} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div className="p-5 flex-grow">
                     <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{project.title}</h3>
                     <p className="text-sm text-gray-500 line-clamp-3">{project.description}</p>
                   </div>
                   <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                      <button onClick={() => { setNewProject(project); setIsAddingProject(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-kmmr-blue text-xs font-bold hover:underline flex items-center gap-1"><Edit2 size={14}/> Редагувати</button>
                      <button onClick={() => deleteItem('projects', project.id)} className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded">Видалити</button>
                   </div>
                 </div>
               ))}
            </div>
           </div>
        )}

        {/* 4. OPPORTUNITIES */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
             {/* ... (Opportunity Logic - Same as before) ... */}
              {isAddingOpp && (
               <div className="bg-white p-6 rounded-2xl shadow-xl border border-kmmr-blue/20 mb-6 animate-fade-in-up">
                 <div className="flex justify-between items-start mb-6"><h3 className="font-bold text-xl text-kmmr-blue">Конструктор Можливості</h3><button onClick={() => setIsAddingOpp(false)}><XCircle size={24}/></button></div>
                 <form onSubmit={handleSaveOpportunity} className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                         <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Languages size={16}/> Мова контенту:</span>
                         <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button type="button" onClick={() => setOppLang('uk')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${oppLang === 'uk' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>UA</button>
                            <button type="button" onClick={() => setOppLang('en')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${oppLang === 'en' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>EN</button>
                         </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                       <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Заголовок ({oppLang})</label>
                          {oppLang === 'uk' ? <input className="w-full border p-2 rounded-lg" value={newOpp.title || ''} onChange={e => setNewOpp({...newOpp, title: e.target.value})} required /> 
                                             : <input className="w-full border p-2 rounded-lg" value={newOpp.titleEn || ''} onChange={e => setNewOpp({...newOpp, titleEn: e.target.value})} />}
                       </div>
                       <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Опис ({oppLang})</label>
                          {oppLang === 'uk' ? <input className="w-full border p-2 rounded-lg" value={newOpp.description || ''} onChange={e => setNewOpp({...newOpp, description: e.target.value})} /> 
                                             : <input className="w-full border p-2 rounded-lg" value={newOpp.descriptionEn || ''} onChange={e => setNewOpp({...newOpp, descriptionEn: e.target.value})} />}
                       </div>
                       <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Тип</label><select className="w-full border p-2 rounded-lg" value={newOpp.type} onChange={e => setNewOpp({...newOpp, type: e.target.value as any})}><option value="Volunteering">Волонтерство</option><option value="Event">Подія</option><option value="Education">Навчання</option><option value="Job">Робота</option></select></div>
                       <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Дедлайн</label><input className="w-full border p-2 rounded-lg" type="date" value={newOpp.deadline || ''} onChange={e => setNewOpp({...newOpp, deadline: e.target.value})} required /></div>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                       <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><List size={20}/> Анкета</h4>
                       <div className="space-y-3 mb-4">
                          {newOpp.questions?.map((q, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                               <div className="mt-2 text-gray-400 cursor-move"><GripVertical size={16} /></div>
                               <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input className="border p-2 rounded text-sm" value={q.label} onChange={(e) => handleUpdateQuestion(idx, 'label', e.target.value)}/>
                                  <select className="border p-2 rounded text-sm" value={q.type} onChange={(e) => handleUpdateQuestion(idx, 'type', e.target.value)}><option value="text">Text</option><option value="textarea">Long Text</option><option value="social">Social</option></select>
                                  <div className="flex items-center gap-3"><input className="border p-2 rounded text-sm flex-grow" value={q.placeholder || ''} onChange={(e) => handleUpdateQuestion(idx, 'placeholder', e.target.value)}/><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={q.required} onChange={(e) => handleUpdateQuestion(idx, 'required', e.target.checked)}/> Req</label></div>
                               </div>
                               <button type="button" onClick={() => handleDeleteQuestion(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                          ))}
                       </div>
                       <button type="button" onClick={handleAddQuestion} className="text-sm font-bold text-kmmr-blue hover:text-kmmr-pink flex items-center gap-1"><Plus size={16} /> Додати питання</button>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                       <button type="submit" disabled={loading} className="bg-kmmr-green text-white px-6 py-3 rounded-lg font-bold shadow-lg w-full flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Створити Можливість</button>
                    </div>
                 </form>
               </div>
             )}
             <div className="grid grid-cols-1 gap-4">
                 <div onClick={() => setIsAddingOpp(true)} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                     <Plus className="w-12 h-12 text-gray-400 mb-2" /><span className="font-bold text-gray-600">Створити Нову Можливість</span>
                 </div>
                 {opportunities.map(opp => (
                    <div key={opp.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${opp.type === 'Volunteering' ? 'bg-green-100 text-green-700' : opp.type === 'Event' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>{opp.type}</span>
                             <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> Дедлайн: {opp.deadline}</span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-800">{opp.title}</h3>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={() => deleteItem('opportunities', opp.id)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-bold text-sm"><Trash2 size={16} /> Видалити</button>
                       </div>
                    </div>
                 ))}
             </div>
          </div>
        )}
        
        {/* 5. TEAM MANAGER */}
        {activeTab === 'team' && (
           <div className="space-y-6">
             {/* Toggle between Members and Departments */}
             <div className="flex gap-4 mb-4">
                <button 
                  onClick={() => setShowDeptManager(false)} 
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${!showDeptManager ? 'bg-kmmr-blue text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Учасники команди
                </button>
                <button 
                  onClick={() => setShowDeptManager(true)} 
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${showDeptManager ? 'bg-kmmr-blue text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Керування Департаментами
                </button>
             </div>

             {/* DEPARTMENT MANAGER VIEW */}
             {showDeptManager ? (
               <div className="space-y-6">
                  {isAddingDept && (
                     <div className="bg-white p-6 rounded-2xl shadow-xl border border-kmmr-blue/20 mb-6 animate-fade-in-up">
                        {/* ... (Department Form) ... */}
                         <div className="flex justify-between items-start mb-6">
                           <h3 className="font-bold text-xl text-kmmr-blue">Додати/Редагувати Департамент</h3>
                           <button onClick={() => setIsAddingDept(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                        </div>
                        <form onSubmit={handleSaveDepartment} className="space-y-6">
                           <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                               <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Languages size={16}/> Мова контенту:</span>
                               <div className="flex bg-gray-100 p-1 rounded-lg">
                                  <button type="button" onClick={() => setDeptLang('uk')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${deptLang === 'uk' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>UA</button>
                                  <button type="button" onClick={() => setDeptLang('en')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${deptLang === 'en' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>EN</button>
                               </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                 {deptLang === 'uk' ? (
                                    <>
                                       <div><label className="text-xs font-bold text-gray-500 uppercase">Назва (UA)</label><input className="border p-2 rounded w-full" value={newDept.name || ''} onChange={e => setNewDept({...newDept, name: e.target.value})} required placeholder="Секретаріат" /></div>
                                       <div><label className="text-xs font-bold text-gray-500 uppercase">Підпис (UA)</label><textarea className="border p-2 rounded w-full h-24" value={newDept.description || ''} onChange={e => setNewDept({...newDept, description: e.target.value})} placeholder="Серце структури..." /></div>
                                    </>
                                 ) : (
                                    <>
                                       <div><label className="text-xs font-bold text-gray-500 uppercase">Name (EN)</label><input className="border p-2 rounded w-full" value={newDept.nameEn || ''} onChange={e => setNewDept({...newDept, nameEn: e.target.value})} /></div>
                                       <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle (EN)</label><textarea className="border p-2 rounded w-full h-24" value={newDept.descriptionEn || ''} onChange={e => setNewDept({...newDept, descriptionEn: e.target.value})} /></div>
                                    </>
                                 )}
                              </div>
                              <div className="space-y-4">
                                 <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Колір фону іконки</label>
                                    <div className="flex items-center gap-2">
                                       <input type="color" className="h-10 w-20 rounded cursor-pointer" value={newDept.color || '#031B47'} onChange={e => setNewDept({...newDept, color: e.target.value})} />
                                       <span className="text-xs text-gray-400">{newDept.color}</span>
                                    </div>
                                 </div>
                                 <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Іконка (SVG/PNG)</label>
                                    <input type="file" onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500"/>
                                    {newDept.icon && typeof newDept.icon === 'string' && (
                                       <div className="mt-2 flex justify-center">
                                          <div style={{ backgroundColor: newDept.color }} className="p-3 rounded-lg inline-flex">
                                             <img src={newDept.icon} className="w-8 h-8 object-contain" alt="icon preview"/>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <button type="submit" disabled={loading} className="bg-kmmr-green text-white px-6 py-3 rounded-lg font-bold shadow-lg w-full flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Зберегти Департамент</button>
                        </form>
                     </div>
                  )}

                  <div onClick={() => { setNewDept({ color: '#031B47' }); setFileToUpload(null); setIsAddingDept(true); }} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                     <Plus className="w-6 h-6 text-gray-400 mr-2" />
                     <span className="font-bold text-gray-600">Створити Новий Департамент</span>
                  </div>

                  {/* Departments List with Drag and Drop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {departments.map((dept, index) => (
                        <div 
                           key={dept.id} 
                           draggable
                           onDragStart={() => handleDragStartDept(index)}
                           onDragOver={handleDragOver}
                           onDrop={() => handleDropDept(index)}
                           className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4 cursor-move transition-all ${draggedDeptIndex === index ? 'opacity-50 border-dashed border-kmmr-blue' : ''}`}
                        >
                           <div className="mt-2 text-gray-300"><GripVertical size={20}/></div>
                           <div style={{ backgroundColor: dept.color }} className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                              {dept.icon && <img src={dept.icon} alt="" className="w-6 h-6 object-contain invert-0 brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />}
                           </div>
                           <div className="flex-grow min-w-0">
                              <h3 className="font-bold text-gray-800">{dept.name}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2">{dept.description}</p>
                           </div>
                           <div className="flex flex-col gap-2">
                              <button onClick={() => { setNewDept(dept); setIsAddingDept(true); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-kmmr-blue hover:bg-blue-50 p-1 rounded"><Edit2 size={16}/></button>
                              <button onClick={() => deleteItem('departments', dept.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             ) : (
               /* ... (Team Members View) ... */
                <div className="space-y-6">
                  {/* Filter Toolbar */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
                     <span className="text-sm font-bold text-gray-500 uppercase flex items-center gap-1"><Filter size={16}/> Фільтр:</span>
                     <select 
                        value={teamFilterDept}
                        onChange={(e) => setTeamFilterDept(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-kmmr-blue"
                     >
                        <option value="all">Всі учасники</option>
                        {departments.map(d => (
                           <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                     </select>
                     <div className="ml-auto text-sm text-gray-500 font-bold">
                        Всього: {teamMembers.filter(m => teamFilterDept === 'all' || m.department === teamFilterDept).length}
                     </div>
                  </div>

                 {isAddingTeam && (
                   <div className="bg-white p-6 rounded-2xl shadow-xl border border-kmmr-blue/20 mb-6 animate-fade-in-up">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-xl text-kmmr-blue">Додати/Редагувати Члена Команди</h3>
                        <button onClick={() => setIsAddingTeam(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                     </div>
                     
                     <form onSubmit={handleSaveTeamMember} className="space-y-6">
                        {/* ... fields ... */}
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                             <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Languages size={16}/> Мова контенту:</span>
                             <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setTeamLang('uk')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${teamLang === 'uk' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>UA</button>
                                <button type="button" onClick={() => setTeamLang('en')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${teamLang === 'en' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>EN</button>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              {teamLang === 'uk' ? (
                                 <>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Ім'я та Прізвище (UA)</label>
                                       <input className="border p-2 rounded w-full" value={newTeamMember.name || ''} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} required />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Роль/Посада (UA)</label>
                                       <input className="border p-2 rounded w-full" value={newTeamMember.role || ''} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} required />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Коротка біографія/Цитата (UA)</label>
                                       <textarea className="border p-2 rounded w-full h-20" value={newTeamMember.bio || ''} onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Деталі (UA) - Кожен рядок це пункт</label>
                                       <textarea className="border p-2 rounded w-full h-24" value={teamDetailsStr} onChange={e => setTeamDetailsStr(e.target.value)} placeholder="Вік: 20 років&#10;Навчання: КНУ&#10;Досвід: 2 роки"/>
                                    </div>
                                 </>
                              ) : (
                                 <>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Full Name (EN)</label>
                                       <input className="border p-2 rounded w-full" value={newTeamMember.nameEn || ''} onChange={e => setNewTeamMember({...newTeamMember, nameEn: e.target.value})} />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Role (EN)</label>
                                       <input className="border p-2 rounded w-full" value={newTeamMember.roleEn || ''} onChange={e => setNewTeamMember({...newTeamMember, roleEn: e.target.value})} />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Bio/Quote (EN)</label>
                                       <textarea className="border p-2 rounded w-full h-20" value={newTeamMember.bioEn || ''} onChange={e => setNewTeamMember({...newTeamMember, bioEn: e.target.value})} />
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-gray-500 uppercase">Details (EN) - Line separated</label>
                                       <textarea className="border p-2 rounded w-full h-24" value={teamDetailsEnStr} onChange={e => setTeamDetailsEnStr(e.target.value)} />
                                    </div>
                                 </>
                              )}
                           </div>
                           
                           <div className="space-y-4">
                              <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase">Департамент</label>
                                 <select 
                                   className="border p-2 rounded w-full" 
                                   value={newTeamMember.department || ''} 
                                   onChange={e => setNewTeamMember({...newTeamMember, department: e.target.value})}
                                   required
                                 >
                                    <option value="">Оберіть...</option>
                                    {departments.map(dept => (
                                       <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                 </select>
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                 <input className="border p-2 rounded w-full" value={newTeamMember.email || ''} onChange={e => setNewTeamMember({...newTeamMember, email: e.target.value})} type="email" />
                              </div>
                              <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
                                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Фото</label>
                                 <input type="file" onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-kmmr-blue/10 file:text-kmmr-blue hover:file:bg-kmmr-blue/20"/>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                           <button type="submit" disabled={loading} className="bg-kmmr-green text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all w-full flex justify-center items-center gap-2">
                              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Зберегти
                           </button>
                        </div>
                     </form>
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div onClick={() => {
                       setNewTeamMember({});
                       setTeamDetailsStr('');
                       setTeamDetailsEnStr('');
                       setIsAddingTeam(true);
                     }} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-64">
                         <Plus className="w-12 h-12 text-gray-400 mb-2" />
                         <span className="font-bold text-gray-600 text-center">Додати Учасника</span>
                     </div>

                     {teamMembers
                       .filter(member => teamFilterDept === 'all' || member.department === teamFilterDept)
                       .map(member => (
                        <div key={member.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                           <div className="h-48 bg-gray-100">
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="p-4 flex-grow">
                              <h3 className="font-bold text-gray-800">{member.name}</h3>
                              <p className="text-sm text-kmmr-pink font-semibold mb-1">{member.role}</p>
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                                 {departments.find(d => d.id === member.department)?.name || 'Невідомий'}
                              </span>
                           </div>
                           <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                               <button onClick={() => {
                                   setNewTeamMember(member);
                                   setTeamDetailsStr(member.details.join('\n'));
                                   setTeamDetailsEnStr(member.detailsEn?.join('\n') || '');
                                   setIsAddingTeam(true);
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                               }} className="text-kmmr-blue text-xs font-bold flex items-center gap-1">
                                   <Edit2 size={14}/> Редагувати
                               </button>
                               <button onClick={() => deleteItem('team', member.id)} className="text-red-500 text-xs font-bold flex items-center gap-1">
                                   <Trash2 size={14}/> Видалити
                               </button>
                           </div>
                        </div>
                     ))}
                 </div>
               </div>
             )}
           </div>
        )}

        {/* 6. PARTNERS MANAGER */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setPartnerFilterType('partners')} className={`px-4 py-2 rounded-lg font-bold transition-all ${partnerFilterType === 'partners' ? 'bg-kmmr-blue text-white' : 'bg-white text-gray-600'}`}>Партнери</button>
              <button onClick={() => setPartnerFilterType('organizations')} className={`px-4 py-2 rounded-lg font-bold transition-all ${partnerFilterType === 'organizations' ? 'bg-kmmr-blue text-white' : 'bg-white text-gray-600'}`}>Організації</button>
              <button onClick={() => setPartnerFilterType('observers')} className={`px-4 py-2 rounded-lg font-bold transition-all ${partnerFilterType === 'observers' ? 'bg-kmmr-blue text-white' : 'bg-white text-gray-600'}`}>Спостерігачі</button>
            </div>

            {isAddingPartner && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-kmmr-blue/20 mb-6 animate-fade-in-up">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-xl text-kmmr-blue">Додати/Редагувати Партнера</h3>
                  <button onClick={() => setIsAddingPartner(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                </div>
                <form onSubmit={handleSavePartner} className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Languages size={16}/> Мова контенту:</span>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setPartnerLang('uk')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${partnerLang === 'uk' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>UA</button>
                      <button type="button" onClick={() => setPartnerLang('en')} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${partnerLang === 'en' ? 'bg-white shadow text-kmmr-blue' : 'text-gray-500'}`}>EN</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {partnerLang === 'uk' ? (
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Назва (UA)</label><input className="border p-2 rounded w-full" value={newPartner.name || ''} onChange={e => setNewPartner({...newPartner, name: e.target.value})} required /></div>
                      ) : (
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Name (EN)</label><input className="border p-2 rounded w-full" value={newPartner.nameEn || ''} onChange={e => setNewPartner({...newPartner, nameEn: e.target.value})} /></div>
                      )}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Тип</label>
                        <select className="border p-2 rounded w-full" value={newPartner.type} onChange={e => setNewPartner({...newPartner, type: e.target.value as any})}>
                          <option value="partners">Партнер</option>
                          <option value="organizations">Членська Організація</option>
                          <option value="observers">Спостерігач</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Посилання</label>
                        <input className="border p-2 rounded w-full" value={newPartner.link || '#'} onChange={e => setNewPartner({...newPartner, link: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Колір фону (стандарт білий)</label>
                        <div className="flex items-center gap-2">
                          <input type="color" className="h-10 w-20 rounded cursor-pointer" value={newPartner.bgColor || '#ffffff'} onChange={e => setNewPartner({...newPartner, bgColor: e.target.value})} />
                          <span className="text-xs text-gray-400">{newPartner.bgColor}</span>
                        </div>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Логотип</label>
                        <input type="file" onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500"/>
                        {newPartner.image && (
                          <div className="mt-2 flex justify-center">
                            <div style={{ backgroundColor: newPartner.bgColor }} className="p-2 border rounded inline-flex">
                              <img src={newPartner.image} className="h-10 object-contain" alt="preview"/>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="bg-kmmr-green text-white px-6 py-3 rounded-lg font-bold shadow-lg w-full flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Зберегти Партнера</button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div onClick={() => { setNewPartner({ type: partnerFilterType as any, bgColor: '#ffffff', link: '#' }); setFileToUpload(null); setIsAddingPartner(true); }} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-video">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="font-bold text-xs text-gray-600">Додати</span>
              </div>
              
              {partners.filter(p => p.type === partnerFilterType).map((partner, index) => (
                <div 
                  key={partner.id} 
                  draggable
                  onDragStart={() => handleDragStartPartner(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropPartner(index)}
                  className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-move hover:shadow-lg transition-all ${draggedPartnerIndex === index ? 'opacity-50 border-dashed border-kmmr-blue' : ''}`}
                >
                  <div className="aspect-video relative p-4 flex items-center justify-center" style={{ backgroundColor: partner.bgColor }}>
                    <img src={partner.image} alt={partner.name} className="w-full h-full object-contain" />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded text-white p-0.5"><GripVertical size={14}/></div>
                  </div>
                  <div className="p-2 text-center border-t border-gray-100">
                    <h4 className="font-bold text-xs text-gray-800 truncate">{partner.name}</h4>
                    <div className="flex justify-center gap-2 mt-2">
                       <button onClick={() => { setNewPartner(partner); setIsAddingPartner(true); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-kmmr-blue hover:bg-blue-50 p-1 rounded"><Edit2 size={14}/></button>
                       <button onClick={() => deleteItem('partners', partner.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};