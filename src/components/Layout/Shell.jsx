'use client';

import React from 'react';
import { Menu, X, BookOpen, Clock, HelpCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Shell.module.css';
import Footer from './Footer';
import AssistantPanel from '../Chat/AssistantPanel';
import { useLanguage } from '@/context/LanguageContext';
import { AssistantProvider, useAssistant } from '@/context/AssistantContext';

const TRANSLATIONS = {
  en: { 
    hub: 'Power Hub',
    timeline: 'Quest', 
    explainers: 'Deep-Dive', 
    quiz: 'Ready to Lead', 
    region: 'India' 
  },
  hi: { 
    hub: 'पावर हब',
    timeline: 'खोज', 
    explainers: 'गहराई', 
    quiz: 'प्रश्नोत्तरी', 
    region: 'भारत' 
  }
};

const LANGUAGES = [];

function ShellContent({ children }) {
  const { lang } = useLanguage();
  const { isOpen, closeAssistant } = useAssistant();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className={styles.container}>
      <nav className={`${styles.navbar} glass`}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.chakraWrapper}>
              <svg viewBox="0 0 100 100" className="chakra-spin">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--ashoka-blue)" strokeWidth="1" />
                <circle cx="50" cy="50" r="8" fill="var(--ashoka-blue)" />
                {[...Array(24)].map((_, i) => {
                  const x2 = (50 + 40 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(2);
                  const y2 = (50 + 40 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(2);
                  return (
                    <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="var(--ashoka-blue)" strokeWidth="1.5" />
                  );
                })}
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className="gradient-experience">askBallot</span>
              <span className={styles.region}>{t.region}</span>
            </div>
          </div>
          
          <div className={styles.desktopMenu}>
            <a href="#hub" className={styles.navLink}><Zap size={16} /><span>{t.hub}</span></a>
            <a href="#timeline" className={styles.navLink}><Clock size={16} /><span>{t.timeline}</span></a>
            <a href="#explainers" className={styles.navLink}><BookOpen size={16} /><span>{t.explainers}</span></a>
            <a href="#quiz" className={styles.navLink}><HelpCircle size={16} /><span>{t.quiz}</span></a>
          </div>

          <div className={styles.actions}>
            {/* Language change removed as requested */}
          </div>
        </div>
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
