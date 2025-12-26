import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  const getTranslatedText = (key: string, fallback: string) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  return (
    <footer className="bg-[#1a332a] text-gray-300 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Logo size="lg" className="inline-block brightness-0 invert" />
            <p className="text-sm leading-relaxed text-gray-400">
              {getTranslatedText('footer.description', "Pakistan's leading agricultural marketplace connecting farmers with buyers.")}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, bg: 'hover:bg-[#1877F2]', link: 'https://www.facebook.com/904334279419778' },
                { icon: Instagram, bg: 'hover:bg-[#E4405F]', link: 'https://www.instagram.com/kisanmarkaz/' },
                { icon: SiTiktok, bg: 'hover:bg-[#000000]', link: 'https://www.tiktok.com/@kisanmarkaz' },
                { icon: Youtube, bg: 'hover:bg-[#FF0000]', link: 'https://www.youtube.com/@Kisan_markaz' }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full bg-white/5 text-white transition-all duration-300 ${social.bg}`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {getTranslatedText('footer.quickLinks.title', 'Quick Links')}
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/featured', label: 'Featured Listings', icon: '⭐' },
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/safety-tips', label: 'Safety Tips' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-secondary transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {link.icon && <span>{link.icon}</span>}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {getTranslatedText('footer.support.title', 'Support')}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/help', label: 'Help Center' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/refund-policy', label: 'Refund Policy' },
                { to: '/shipping-policy', label: 'Shipping Policy' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {getTranslatedText('footer.contact.title', 'Contact')}
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</span>
                  <span className="text-gray-300">support@kisanmarkaz.pk</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</span>
                  <span className="text-gray-300">03213037082</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Address</span>
                  <span className="text-gray-300">L-377, Sector-4, New Karachi</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Kisan Markaz. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
