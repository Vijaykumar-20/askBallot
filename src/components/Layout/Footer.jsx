'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, Mail, X, Zap, Bot, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';
import { useAssistant } from '@/context/AssistantContext';

export default function Footer() {
  const { openAssistant } = useAssistant();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <div className={styles.chakraWrapper}>
              <svg viewBox="0 0 100 100" className={styles.chakraSpin}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="50" cy="50" r="8" fill="white" />
                {[...Array(24)].map((_, i) => {
                  const x2 = (50 + 40 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(2);
                  const y2 = (50 + 40 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(2);
                  return (
                    <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="white" strokeWidth="1.5" />
                  );
                })}
              </svg>
            </div>
            <span className={styles.logoTitle}>askBallot</span>
          </div>
          <p className={styles.mission}>Empowering 1.4 billion voices with interactive, high-fidelity democratic education. Decoding the world&apos;s largest election, one quest at a time.</p>
          <div className={styles.socials}>
            <a href="#"><Zap size={20} /></a>
            <a href="#"><ShieldCheck size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>

        <div className={styles.linkGrid}>
          <div className={styles.linkCol}>
            <h4>Official Portals</h4>
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer">Voter Service Portal <ExternalLink size={12} /></a>
            <a href="https://www.eci.gov.in/" target="_blank" rel="noreferrer">Election Commission <ExternalLink size={12} /></a>
            <a href="https://affidavit.eci.gov.in/" target="_blank" rel="noreferrer">Candidate Affidavits <ExternalLink size={12} /></a>
          </div>
          <div className={styles.linkCol}>
            <h4>Help & Support</h4>
            <button className={styles.footerBtn} onClick={openAssistant}>
              <Bot size={14} /> AI Assistant
            </button>
            <a href="tel:1950"><Phone size={14} /> Helpline: 1950</a>
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer">
              <MapPin size={14} /> Locate PS
            </a>
          </div>
          {/* Platform column removed as requested */}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          <ShieldCheck size={16} /> <span>© 2026 askBallot India. Dedicated to the Voter.</span>
        </div>
        <div className={styles.disclaimer}>
          Disclaimer: This is an educational visualization project. Always refer to official ECI guidelines for binding rules.
        </div>
      </div>
    </footer>
  );
}
