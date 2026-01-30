import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { submitContactForm, ContactFormData } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ContactsSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
    motivation: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', department: '', motivation: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-24 bg-[#0F172A] text-white relative overflow-hidden flex items-center justify-center">
       {/* Background decorative circles - Unique Colors for Contacts */}
       <div className="absolute top-0 left-0 w-96 h-96 bg-kmmr-pink/30 rounded-full blur-[100px] translate-y-[-20%] translate-x-[-20%]"></div>
       <div className="absolute bottom-0 right-0 w-96 h-96 bg-kmmr-green/20 rounded-full blur-[100px] translate-y-[20%] translate-x-[20%]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-[#1E293B] rounded-2xl border border-white/5 shadow-lg shadow-kmmr-pink/10">
                <Users size={40} className="text-kmmr-pink"/>
             </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">{t('contacts.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">{t('contacts.subtitle')}</p>
        </div>

        <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-1">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-kmmr-pink rounded-full flex items-center justify-center mb-6 shadow-lg shadow-kmmr-pink/20">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">{t('contacts.successTitle')}</h3>
              <p className="text-gray-400 max-w-md">
                {t('contacts.successDesc')}
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 bg-[#0F172A] text-white border border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                {t('contacts.retryBtn')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{t('contacts.labels.name')}</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-kmmr-pink/50 focus:ring-1 focus:ring-kmmr-pink/50 transition-all placeholder-gray-600 text-sm"
                    placeholder={t('contacts.placeholders.name')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{t('contacts.labels.phone')}</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-kmmr-pink/50 focus:ring-1 focus:ring-kmmr-pink/50 transition-all placeholder-gray-600 text-sm"
                    placeholder="+380..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{t('contacts.labels.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-kmmr-pink/50 focus:ring-1 focus:ring-kmmr-pink/50 transition-all placeholder-gray-600 text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{t('contacts.labels.dept')}</label>
                  <div className="relative">
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-kmmr-pink/50 focus:ring-1 focus:ring-kmmr-pink/50 transition-all appearance-none cursor-pointer text-sm"
                    >
                      <option value="" className="text-gray-500 bg-[#0F172A]">{t('contacts.placeholders.dept')}</option>
                      <option value="smm" className="bg-[#0F172A] text-white">SMM</option>
                      <option value="projects" className="bg-[#0F172A] text-white">Projects</option>
                      <option value="pr" className="bg-[#0F172A] text-white">PR</option>
                      <option value="fundraising" className="bg-[#0F172A] text-white">Fundraising</option>
                      <option value="helpers" className="bg-[#0F172A] text-white">Volunteering</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{t('contacts.labels.motivation')}</label>
                <textarea 
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  disabled={status === 'loading'}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-kmmr-pink/50 focus:ring-1 focus:ring-kmmr-pink/50 transition-all placeholder-gray-600 text-sm resize-none"
                  placeholder={t('contacts.placeholders.motivation')}
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                  <AlertCircle size={20} />
                  <span>{t('contacts.error')}</span>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-kmmr-pink text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all hover:bg-pink-600 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-kmmr-pink/20"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('contacts.loading')}
                    </>
                  ) : (
                    <>
                      {t('contacts.submit')} <Send size={18} className="ml-1" />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-4 text-center">
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