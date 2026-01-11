import React, { useEffect, useState } from 'react';
import { DOCUMENTS_LIST_UK, DOCUMENTS_LIST_EN } from '../constants';
import { FileText, Download, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DocumentItem } from '../types';

export const DocumentsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "documents"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDocs: DocumentItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DocumentItem));
      
      let displayDocs = fetchedDocs.length > 0 ? fetchedDocs : (language === 'uk' ? DOCUMENTS_LIST_UK : DOCUMENTS_LIST_EN);
      
      // Sort by order
      displayDocs.sort((a,b) => {
         const orderA = a.order !== undefined ? a.order : 999;
         const orderB = b.order !== undefined ? b.order : 999;
         return orderA - orderB;
      });

      setDocuments(displayDocs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching docs:", error);
      setDocuments(language === 'uk' ? DOCUMENTS_LIST_UK : DOCUMENTS_LIST_EN);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Visual Header */}
      <div className="bg-kmmr-blue dark:bg-gray-900 text-white py-16 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-kmmr-green rounded-full blur-3xl opacity-20 -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-kmmr-pink rounded-full blur-3xl opacity-20 translate-y-10 -translate-x-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full mb-6 backdrop-blur-md border border-white/20">
            <ShieldCheck size={16} className="text-kmmr-green" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('documents.tag')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">{t('documents.title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light">
            {t('documents.desc')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 transition-colors">
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-kmmr-blue dark:text-blue-400 w-10 h-10" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, idx) => (
                <div 
                  key={doc.id} 
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:bg-white dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 hover:border-kmmr-blue/20 dark:hover:border-blue-400/20 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                     <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10 rotate-45 ${idx % 2 === 0 ? 'bg-kmmr-green/20' : 'bg-kmmr-pink/20'} group-hover:scale-110 transition-transform`}></div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${idx % 2 === 0 ? 'bg-kmmr-blue dark:bg-blue-400 text-white' : 'bg-white border-2 border-kmmr-blue dark:border-blue-400 text-kmmr-blue dark:text-blue-400 dark:bg-gray-600'}`}>
                      <FileText size={24} />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-2 group-hover:text-kmmr-blue dark:group-hover:text-blue-300 transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="font-semibold bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{doc.type}</span>
                        <span>{doc.date}</span>
                        {doc.size && <span>{doc.size}</span>}
                      </div>
                      
                      <a 
                        href={doc.link} 
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-kmmr-blue dark:text-blue-400 hover:text-kmmr-pink transition-colors"
                      >
                        {t('documents.download')} <Download size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-kmmr-blue/5 dark:bg-gray-700/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div>
                <h4 className="font-bold text-kmmr-blue dark:text-white mb-1">{t('documents.other')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('documents.otherDesc')}</p>
             </div>
             <a href="mailto:info@kmmr.org" className="flex items-center gap-2 px-5 py-2 bg-kmmr-blue dark:bg-blue-400 text-white rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all">
               {t('documents.request')} <ChevronRight size={16} />
             </a>
          </div>

        </div>
      </div>
    </div>
  );
};