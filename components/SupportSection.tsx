import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, HeartHandshake } from 'lucide-react';
import { submitSupportForm, SupportFormData } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const SupportSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<SupportFormData>({
    orgName: '',
    representativeName: '',
    phone: '',
    email: '',
    projectTitle: '',
    supportType: '',
    description: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitSupportForm(formData);
      setStatus('success');
      setFormData({ 
        orgName: '', 
        representativeName: '', 
        phone: '', 
        email: '', 
        projectTitle: '', 
        supportType: '', 
        description: '' 
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-20 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
      {/* Decorative background similar to contacts but with different colors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-kmmr-orange rounded-full blur-[120px] opacity-20 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-kmmr-pink rounded-full blur-[120px] opacity-10 translate-y-20 -translate-x-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md border border-white/10">
             <HeartHandshake className="w-8 h-8 text-kmmr-green" />
          </div>
          <h2 className="text-4xl font-black mb-4">{t('support.title')}</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('support.subtitle')}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-kmmr-green rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('contacts.successTitle')}</h3>
              <p className="text-gray-300 max-w-md">
                {t('contacts.successDesc')}
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-kmmr-green font-bold hover:text-white transition-colors"
              >
                {t('contacts.retryBtn')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Organization Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('support.labels.orgName')}</label>
                  <input 
                    type="text" 
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                    placeholder={t('support.placeholders.orgName')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('support.labels.repName')}</label>
                  <input 
                    type="text" 
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                    placeholder={t('support.placeholders.repName')}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('contacts.labels.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('contacts.labels.phone')}</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                    placeholder="+380..."
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('support.labels.projectTitle')}</label>
                  <input 
                    type="text" 
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                    placeholder={t('support.placeholders.projectTitle')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('support.labels.supportType')}</label>
                  <select 
                    name="supportType"
                    value={formData.supportType}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors appearance-none disabled:opacity-50 cursor-pointer"
                  >
                    <option value="" className="text-gray-800 bg-white">{t('support.placeholders.supportType')}</option>
                    <option value="Info" className="text-gray-800 bg-white">{t('support.types.info')}</option>
                    <option value="Resource" className="text-gray-800 bg-white">{t('support.types.resource')}</option>
                    <option value="Partner" className="text-gray-800 bg-white">{t('support.types.partner')}</option>
                    <option value="Volunteers" className="text-gray-800 bg-white">{t('support.types.volunteers')}</option>
                    <option value="Expert" className="text-gray-800 bg-white">{t('support.types.expert')}</option>
                    <option value="Other" className="text-gray-800 bg-white">{t('support.types.other')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-400">{t('support.labels.description')}</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green focus:ring-1 focus:ring-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-500"
                  placeholder={t('support.placeholders.description')}
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
                  className="w-full bg-gradient-to-r from-kmmr-green to-teal-600 hover:from-teal-600 hover:to-kmmr-green text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
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
                <p className="text-xs text-gray-500 mt-3 text-center">
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