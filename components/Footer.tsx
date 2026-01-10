import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DonationModal } from './DonationModal';
import { Logo } from './Logo';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { t, language } = useLanguage();
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-kmmr-blue text-white pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-10" />
              <h3 className="text-2xl font-bold text-kmmr-green">
                {language === 'en' ? 'KCYC' : 'КММР'}
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Column 2: Contacts */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4">{t('footer.contacts')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-kmmr-pink shrink-0" />
                <a href="https://maps.app.goo.gl/oLVazPLxvkL6ibrv6" className="text-sm">м. Київ, вул. Хрещатик, 36</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-kmmr-pink shrink-0" />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kyiv.city.yc.nycu@gmail.com" className="text-sm">kyiv.city.yc.nycu@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-kmmr-pink shrink-0" />
                <a href="tel:+380440000000" className="text-sm">+38 (044) 000-00-00</a>
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
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-kmmr-green transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-kmmr-green text-white font-bold py-2 rounded hover:bg-opacity-90 transition-colors uppercase text-sm tracking-wide"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>

          {/* Column 4: Socials & Support */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-4">{t('footer.follow')}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kmmr-pink transition-all duration-300 transform hover:-translate-y-1">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-black transition-all duration-300 transform hover:-translate-y-1">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1">
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