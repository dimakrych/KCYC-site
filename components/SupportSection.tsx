
import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Handshake } from 'lucide-react';
import { submitSupportForm, SupportFormData } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const SupportSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<SupportFormData>({
    orgName: '',
    repName: '',
    phone: '',
    email: '',
    projectTitle: '',
    description: '',
    supportType: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitSupportForm(formData);
      setStatus('success');
      setFormData({ 
        orgName: '', repName: '', phone: '', email: '', 
        projectTitle: '', description: '', supportType: '' 
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-20 bg-kmmr-green text-white relative overflow-hidden">
       {/* Background decorative circles */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Handshake size={48} className="text-white"/>
             </div>
          </div>
          <h2 className="text-4xl font-black mb-4">{t('support.title')}</h2>
          <p className="text-gray-100 max-w-2xl mx-auto">{t('support.subtitle')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-kmmr-green" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('support.successTitle')}</h3>
              <p className="text-gray-100 max-w-md">
                {t('support.successDesc')}
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 bg-white text-kmmr-green px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                {t('contacts.retryBtn')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('support.labels.orgName')}</label>
                  <input 
                    type="text" 
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                    placeholder={t('support.placeholders.orgName')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('support.labels.repName')}</label>
                  <input 
                    type="text" 
                    name="repName"
                    value={formData.repName}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                    placeholder={t('support.placeholders.repName')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('contacts.labels.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('contacts.labels.phone')}</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                    placeholder="+380..."
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('support.labels.projectTitle')}</label>
                <input 
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                  placeholder={t('support.placeholders.projectTitle')}
                />
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('support.labels.description')}</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                  placeholder={t('support.placeholders.description')}
                ></textarea>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-200">{t('support.labels.supportType')}</label>
                <textarea 
                  name="supportType"
                  value={formData.supportType}
                  onChange={handleChange}
                  rows={2}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors disabled:opacity-50 placeholder-white/50"
                  placeholder={t('support.placeholders.supportType')}
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3 text-red-200">
                  <AlertCircle size={20} />
                  <span>{t('contacts.error')}</span>
                </div>
              )}

              <div>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-white text-kmmr-green font-bold py-4 rounded-xl uppercase tracking-widest transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('contacts.loading')}
                    </>
                  ) : (
                    <>
                      {t('contacts.submit')} <Send size={20} />
                    </>
                  )}
                </button>
                <p className="text-xs text-white/60 mt-3 text-center">
                  {t('contacts.consent')}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
