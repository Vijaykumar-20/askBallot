'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import electionData from '@/data/india-election.json';
import { useAssistant } from '@/context/AssistantContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, FileCheck, ShieldCheck, Phone, Info, ArrowRight, Trophy, Ticket, Fingerprint, Sparkles, Lightbulb, Zap, UserPlus, FileSearch, Send, CheckCircle, Map, Eye, Flag, ExternalLink, Activity, Award, UserCheck, CheckSquare, BarChart3, Users, Landmark, Shield, Bot } from 'lucide-react';

const Timeline = dynamic(() => import('@/components/Timeline/Timeline'), { ssr: false });
const Explainers = dynamic(() => import('@/components/Explainers/StageAccordion'), { ssr: false });
const ElectionQuiz = dynamic(() => import('@/components/Quiz/ElectionQuiz'), { ssr: false });
const PollingMap = dynamic(() => import('@/components/Map/PollingMap'), { ssr: false });
const DocumentVault = dynamic(() => import('@/components/Storage/DocumentVault'), { ssr: false });
const VoterInfo = dynamic(() => import('@/components/Civic/VoterInfo'), { ssr: false });

const WISDOM_FACTS = [
  "India's election is the largest democratic event in human history.",
  "Every polling booth is reachable within 2km of every voter.",
  "Over 1 million polling stations are set up for you.",
  "The 'Indelible Ink' on your finger can last up to 40 days.",
  "A single polling station was set up for 1 voter in Gir Forest, Gujarat.",
  "India uses approximately 5.5 million EVMs during a general election.",
  "The 1951-52 first general election took 4 months to complete.",
  "Your vote is secret - Section 94 of the RP Act ensures total privacy.",
  "National Voters Day (25 January) reminds everyone that being enrolled and voting is a sign of empowerment."
];

const POWER_NODES = [
  { title: "Democratic Power", desc: "One vote can change a nation. Decisions are often made by less than 1000 votes.", icon: Zap, trend: "+ Strong Impact" },
  { title: "Fraud Protection", desc: "VVPAT verification, Indelible Ink, and 24/7 C-Vigil monitoring ensure total integrity.", icon: Shield, trend: "🛡️ 100% Secure" },
  { title: "Voter Portal", desc: "Instant registration portal. Update details or apply online securely.", icon: ExternalLink, link: "https://voters.eci.gov.in/", label: "voters.eci.gov.in" },
  { title: "ECI Helpline", desc: "Contact the National Contact Centre (1950) for any voter grievance.", icon: Phone, link: "tel:1950", label: "1950 Helpline" }
];

const CHECKLIST_ITEMS = [
  "EPIC/Aadhaar Ready",
  "Constituency Mapped",
  "Polling Station Located",
  "Candidate List Reviewed",
  "Verify NVSP Name",
  "Final Slip Downloaded"
];

/**
 * Home Page Component
 * 
 * The main landing page for Ask-Ballot.
 * Orchestrates the hero section and lazily loads major feature components
 * such as Timeline, Explainers, ElectionQuiz, and Civic Hub modules to optimize initial bundle size.
 * 
 * @returns {JSX.Element} The rendered homepage
 */
export default function Home() {
  const { openAssistant, toggleAssistant } = useAssistant();
  const data = electionData.en;
  const [wisdomIndex, setWisdomIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWisdomIndex((prev) => (prev + 1) % WISDOM_FACTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigateToQuest = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        
        <div className={styles.heroLayout}>
          <div className={styles.heroText}>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.missionTicker}>
              <Zap size={14} className={styles.zapIcon} />
              <span>1.4 Billion Voices • 543 Seats • 1 Mission</span>
            </motion.div>
            <h1 className={styles.mainTitle}>Lead the <span className="gradient-experience">Democratic</span> <br/> Revolution <span className={styles.voteText}>with Your Vote</span></h1>
            <p className={styles.heroDescription}>Decode the mechanics of the Indian General Election. From Form 6 to the VVPAT beep, we turn complex rules into your personal quest for power.</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={navigateToQuest} aria-label="Unlock your voter quest">Unlock My Quest <ArrowRight size={20} /></button>
              <button className={styles.secondaryBtn} onClick={() => window.open('https://electoralsearch.eci.gov.in/', '_blank')} aria-label="Check your name in the voter list on ECI website">Check Voter List <Search size={18} /></button>
            </div>
          </div>
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.wisdomCard + " glass"}>
            <div className={styles.wisdomHeader}><Lightbulb className={styles.bulbIcon} size={18} /><span>Voter Wisdom</span></div>
            <AnimatePresence mode="wait">
              <motion.p key={wisdomIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={styles.wisdomText}>{WISDOM_FACTS[wisdomIndex]}</motion.p>
            </AnimatePresence>
            <div className={styles.wisdomFooter}><div className={styles.wisdomBar} /></div>
          </motion.div>
        </div>
        
        <div id="polling-station">
          <PollingMap />
        </div>

        <div id="hub" className={styles.handbookSectionFlowGlass}>
          <div className={styles.handbookHeader}>
            <motion.button whileHover={{ scale: 1.05 }} className={styles.glassVoterBtn} onClick={navigateToQuest}>
              <Fingerprint size={18} className={styles.fingerIcon} /><span>New Voter</span>
            </motion.button>
            <h3 className={styles.handbookTitle}>Civic Power Hub</h3>
          </div>
          <div className={styles.flowChain}>
            {POWER_NODES.map((node, i) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className={styles.flowNodeGlass}>
                <div className={styles.nodeIconWrapperGlass}><node.icon size={22} /><div className={styles.nodeNumberGlass}>{i + 1}</div></div>
                <div className={styles.nodeContent}>
                  <div className={styles.nodeTitleLine}><h4>{node.title}</h4>{node.trend && <span className={styles.trendBadge}>{node.trend}</span>}</div>
                  <p>{node.desc}</p>
                  {node.link && <a href={node.link} target={node.link.startsWith('tel:') ? '' : '_blank'} rel={node.link.startsWith('tel:') ? '' : 'noopener noreferrer'} className={styles.eciLink}>{node.link.startsWith('tel:') ? 'Call ' : 'Visit '}{node.label} <ExternalLink size={14} /></a>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="timeline" 
            className={styles.voterQuestGlass}
          >
            <svg className={styles.questBgSvg} width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
               <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
               <path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" />
            </svg>

            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><Trophy size={20} /></div>
              <h2>Voter&apos;s Quest</h2>
            </div>
            <div className={styles.questContent}>
              <Timeline data={data.timeline} />
            </div>
          </motion.section>

          <section id="explainers" className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><Info size={20} /></div>
              <h2>Election <span className="gradient-experience">Deep-Dive</span></h2>
            </div>
            <Explainers 
              data={data.explainers} 
              fact={data.fact} 
              onOpenAssistant={openAssistant}
            />
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCardSkeuo}>
            <div className={styles.sidebarHeader}>
              <div className={styles.headerIconWrapper}><UserCheck size={18} /></div>
              <h3>Voter Readiness</h3>
            </div>
            <div className={styles.checklistAnimated}>
              {CHECKLIST_ITEMS.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className={styles.checkItem}
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.2, type: "spring" }}
                    className={styles.checkMark}
                  >
                    <CheckSquare size={14} />
                  </motion.div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
            <div className={styles.checklistFooter}>
              <span>Status: Checking...</span>
              <div className={styles.miniPill}>ACTIVE</div>
            </div>
          </div>

          <div className={styles.sidebarCardSkeuo}>
             <div className={styles.sidebarHeader}>
              <div className={styles.headerIconWrapper}><BarChart3 size={18} /></div>
              <h3>National Stats</h3>
            </div>
            <div className={styles.statsDense}>
              <div className={styles.statLine}>
                 <Landmark size={14} className={styles.statIcon} />
                 <div><strong>543</strong><span>Lok Sabha Seats</span></div>
              </div>
              <div className={styles.statLine}>
                 <Users size={14} className={styles.statIcon} />
                 <div><strong>968M</strong><span>Total Electors</span></div>
              </div>
              <div className={styles.statLine}>
                 <MapPin size={14} className={styles.statIcon} />
                 <div><strong>1.05M</strong><span>Polling Stations</span></div>
              </div>
              <div className={styles.statLine}>
                 <Trophy size={14} className={styles.statIcon} />
                 <div><strong>18M+</strong><span>First Time Voters</span></div>
              </div>
            </div>
          </div>
          
          <DocumentVault />
          <VoterInfo />
        </aside>
      </div>

      <section id="quiz" className={styles.quizSectionMinimal}>
        <div className={styles.sectionHeaderCenter}>
          <h2 className="gradient-experience">Ready to Lead?</h2>
          <ElectionQuiz data={data.quiz_rounds} />
        </div>
      </section>

      {/* Floating Assistant Trigger */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={styles.floatingChatBtn}
        onClick={openAssistant}
        onDoubleClick={toggleAssistant}
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </motion.button>
    </div>
  );
}
