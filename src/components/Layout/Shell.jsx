'use client';

import React from 'react';
import { Menu, X, BookOpen, Clock, HelpCircle, Zap, MapPin, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Shell.module.css';
import Footer from './Footer';
import AssistantPanel from '../Chat/AssistantPanel';
import { AssistantProvider, useAssistant } from '@/context/AssistantContext';
import Image from 'next/image';

function ShellContent({ children }) {
  const { isOpen, closeAssistant } = useAssistant();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Definining the global callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true,
        }, 'google_translate_element');
      }
    };

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      delete window.googleTranslateElementInit;
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={styles.container}>
      <nav className={`${styles.navbar} glass`}>
        <div className={styles.navContent}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ textDecoration: 'none' }}>
            <div className={styles.logo}>
              <div className={styles.chakraWrapper}>
                <Image src="/icon.png" alt="AskBallot Logo" width={32} height={32} />
              </div>
              <div className={styles.logoText}>
                <span className="gradient-experience">askBallot</span>
                <span className={styles.region}>India</span>
              </div>
            </div>
          </a>
          
          <div className={styles.desktopMenu}>
            <a href="#hub" className={styles.navLink}><Zap size={16} /><span>Power Hub</span></a>
            <a href="#polling-station" className={styles.navLink}><MapPin size={16} /><span>Polling Station</span></a>
            <a href="#timeline" className={styles.navLink}><Clock size={16} /><span>Quest</span></a>
            <a href="#explainers" className={styles.navLink}><BookOpen size={16} /><span>Deep-Dive</span></a>
            <a href="#quiz" className={styles.navLink}><HelpCircle size={16} /><span>Ready to Lead</span></a>
          </div>

          <div className={styles.actions}>
            <div className={styles.translateWrapper}>
              <Languages size={18} className={styles.globeIcon} />
              <div id="google_translate_element" className={styles.translateElement}></div>
            </div>
            <button className={styles.mobileToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.mobileMenu}
            >
              <a href="#hub" onClick={closeMobileMenu} className={styles.mobileNavLink}><Zap size={18} /><span>Power Hub</span></a>
              <a href="#polling-station" onClick={closeMobileMenu} className={styles.mobileNavLink}><MapPin size={18} /><span>Polling Station</span></a>
              <a href="#timeline" onClick={closeMobileMenu} className={styles.mobileNavLink}><Clock size={18} /><span>Quest</span></a>
              <a href="#explainers" onClick={closeMobileMenu} className={styles.mobileNavLink}><BookOpen size={18} /><span>Deep-Dive</span></a>
              <a href="#quiz" onClick={closeMobileMenu} className={styles.mobileNavLink}><HelpCircle size={18} /><span>Ready to Lead</span></a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className={styles.main}>{children}</main>
      <Footer />
      
      <AssistantPanel 
        isOpen={isOpen} 
        onClose={closeAssistant} 
      />
    </div>
  );
}

export default function Shell({ children }) {
  return (
    <AssistantProvider>
      <ShellContent>{children}</ShellContent>
    </AssistantProvider>
  );
}
