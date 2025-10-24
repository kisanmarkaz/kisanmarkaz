import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from './Logo';

const Footer = () => {
  const { t, language } = useLanguage();

  const getTranslatedText = (key: string, fallback: string) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  return (
    <footer className="glass-dark bg-gray-900/90 text-gray-300 backdrop-blur-md border-t border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo size="lg" className="inline-block" />
            </div>
            <p className="text-sm mb-4">
              {getTranslatedText('footer.description', "Pakistan's leading agricultural marketplace connecting farmers with buyers.")}
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
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">
              {getTranslatedText('footer.quickLinks.title', 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/featured" className="hover:text-white hover-lift inline-block font-semibold text-yellow-400">
                  ⭐ Featured Listings
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/about" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.quickLinks.about', 'About Us')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/how-it-works" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.quickLinks.howItWorks', 'How It Works')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/safety-tips" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.quickLinks.safetyTips', 'Safety Tips')}
                </Link>
              </motion.li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">
              {getTranslatedText('footer.support.title', 'Support')}
            </h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/help" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.support.helpCenter', 'Help Center')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/terms" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.support.terms', 'Terms of Service')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/privacy" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.support.privacy', 'Privacy Policy')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/refund-policy" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.support.refundPolicy', 'Refund Policy')}
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/shipping-policy" className="hover:text-white hover-lift inline-block">
                  {getTranslatedText('footer.support.shippingPolicy', 'Shipping Policy')}
                </Link>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 animate-pulse-slow">
              {getTranslatedText('footer.contact.title', 'Contact')}
            </h4>
            <ul className="space-y-4 text-sm">
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
                {getTranslatedText('footer.contact.email', 'support@kisanmarkaz.pk')}
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
                  transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                >
                  <Phone className="h-4 w-4 text-white" />
                </motion.div>
                {getTranslatedText('footer.contact.phone', '03213037082')}
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
                {getTranslatedText('footer.contact.address', 'L-377, Sector-4, New Karachi')}
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
              {getTranslatedText('footer.copyright', '© 2024 Kisan Markaz. All rights reserved.')}
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
