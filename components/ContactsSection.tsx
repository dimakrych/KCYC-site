import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="py-20 bg-kmmr-blue text-white relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">{t('contacts.title')}</h2>
          <p className="text-gray-300">{t('contacts.subtitle')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-300">{t('contacts.labels.name')}</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-400"
                    placeholder={t('contacts.placeholders.name')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-300">{t('contacts.labels.phone')}</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-400"
                    placeholder="+380..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-300">{t('contacts.labels.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-400"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-300">{t('contacts.labels.dept')}</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green transition-colors appearance-none disabled:opacity-50"
                  >
                    <option value="" className="text-gray-800 bg-white">{t('contacts.placeholders.dept')}</option>
                    <option value="smm" className="text-gray-800 bg-white">SMM</option>
                    <option value="projects" className="text-gray-800 bg-white">Projects</option>
                    <option value="pr" className="text-gray-800 bg-white">PR</option>
                    <option value="fundraising" className="text-gray-800 bg-white">Fundraising</option>
                    <option value="helpers" className="text-gray-800 bg-white">Volunteering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-300">{t('contacts.labels.motivation')}</label>
                <textarea 
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  disabled={status === 'loading'}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-kmmr-green transition-colors disabled:opacity-50 placeholder-gray-400"
                  placeholder={t('contacts.placeholders.motivation')}
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
                  className="w-full bg-kmmr-pink hover:bg-pink-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
                <p className="text-xs text-gray-400 mt-3 text-center">
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