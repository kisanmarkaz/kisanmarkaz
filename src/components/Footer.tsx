import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CursorToggle from './CursorToggle';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="glass-dark bg-gray-900/90 text-gray-300 backdrop-blur-md border-t border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('common.appName')}</h3>
            <p className="text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }} className="hover-glow">
                <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }} className="hover-glow">
                <Twitter className="h-5 w-5 hover:text-blue-300 cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }} className="hover-glow">
                <Instagram className="h-5 w-5 hover:text-pink-400 cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }} className="hover-glow">
                <Youtube className="h-5 w-5 hover:text-red-400 cursor-pointer" />
              </motion.div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/about" className="hover:text-white hover-lift inline-block">{t('footer.quickLinks.about')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/how-it-works" className="hover:text-white hover-lift inline-block">{t('footer.quickLinks.howItWorks')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/safety-tips" className="hover:text-white hover-lift inline-block">{t('footer.quickLinks.safetyTips')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/success-stories" className="hover:text-white hover-lift inline-block">{t('footer.quickLinks.successStories')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/blog" className="hover:text-white hover-lift inline-block">{t('footer.quickLinks.blog')}</Link>
              </motion.li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">{t('footer.support.title')}</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/help" className="hover:text-white hover-lift inline-block">{t('footer.support.helpCenter')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/terms" className="hover:text-white hover-lift inline-block">{t('footer.support.terms')}</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/privacy" className="hover:text-white hover-lift inline-block">{t('footer.support.privacy')}</Link>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">{t('footer.contact.title')}</h4>
            <ul className="space-y-3 text-sm">
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.03, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="bg-green-600/30 p-2 rounded-full mr-3 glass"
                  whileHover={{ rotate: 10 }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Mail className="h-4 w-4 text-white" />
                </motion.div>
                {t('footer.contact.email')}
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.03, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="bg-green-600/30 p-2 rounded-full mr-3 glass"
                  whileHover={{ rotate: -10 }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                >
                  <Phone className="h-4 w-4 text-white" />
                </motion.div>
                {t('footer.contact.phone')}
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.03, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="bg-green-600/30 p-2 rounded-full mr-3 glass"
                  whileHover={{ rotate: 10 }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                >
                  <MapPin className="h-4 w-4 text-white" />
                </motion.div>
                {t('footer.contact.address')}
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm glass-dark rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              className="hover-lift"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {t('footer.copyright')}
            </motion.p>
            <CursorToggle className="mt-4 md:mt-0 glass-button px-3 py-2 rounded-lg" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
