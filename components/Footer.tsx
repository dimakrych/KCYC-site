import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Heart, Loader2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DonationModal } from './DonationModal';
import { Logo } from './Logo';
import { subscribeToNewsletter } from '../services/api';

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { t, language } = useLanguage();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-kmmr-blue text-white pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="mb-4">
              <Logo className="h-16" forceTheme="dark" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Column 2: Contacts */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4">{t('footer.contacts')}</h4>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-white transition-colors">
                <a 
                  href="https://maps.app.goo.gl/oLVazPLxvkL6ibrv6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 w-full"
                >
                  <MapPin className="w-5 h-5 text-kmmr-pink shrink-0" />
                  <span className="text-sm">м. Київ, вул. Хрещатик, 36</span>
                </a>
              </li>
              <li className="text-gray-300 hover:text-white transition-colors">
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=kyiv.city.yc.nycu@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full"
                >
                  <Mail className="w-5 h-5 text-kmmr-pink shrink-0" />
                  <span className="text-sm">kyiv.city.yc.nycu@gmail.com</span>
                </a>
              </li>
              <li className="text-gray-300 hover:text-white transition-colors">
                <a href="tel:+380440000000" className="flex items-center gap-3 w-full">
                  <Phone className="w-5 h-5 text-kmmr-pink shrink-0" />
                  <span className="text-sm">+38 (044) 000-00-00</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4">{t('footer.news')}</h4>
            <p className="text-gray-300 text-sm">{t('footer.newsDesc')}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder={t('footer.inputPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-kmmr-green transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-kmmr-green text-white font-bold py-2 rounded hover:bg-opacity-90 transition-colors uppercase text-sm tracking-wide flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? <Loader2 className="animate-spin w-4 h-4" /> : 
                 status === 'success' ? <Check className="w-4 h-4" /> :
                 t('footer.subscribe')}
              </button>
            </form>
          </div>

          {/* Column 4: Socials & Support */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-4">{t('footer.follow')}</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/kyiv.city.yc.nycu/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kmmr-pink transition-all duration-300 transform hover:-translate-y-1">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/kyiv.city.yc.nycu/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://t.me/Kyiv_City_Youth_Council" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                  <TelegramIcon className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@kyiv_city_youth_council" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Donation Button */}
            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => setIsDonationOpen(true)}
                className="w-full bg-kmmr-pink hover:bg-pink-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-kmmr-pink/20 group"
              >
                <Heart size={18} className="fill-white group-hover:animate-pulse" />
                <span>{t('donation.btn')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center flex flex-col items-center gap-2">
          <a href="https://nycukraine.org" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors pb-1">
            {t('footer.memberOf')}
          </a>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {language === 'en' ? 'KCYC' : 'КММР'}. {t('footer.rights')}
          </p>
        </div>
      </div>

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </footer>
  );
};