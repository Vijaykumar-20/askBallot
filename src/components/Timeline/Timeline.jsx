'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Unlock, ChevronRight, CheckCircle2, BookOpen, Shield, UserCheck, Users, Vote } from 'lucide-react';
import styles from './Timeline.module.css';

/**
 * Timeline Component
 * 
 * Renders an interactive, gamified progress timeline representing the election cycle.
 * Users can navigate through stages sequentially. Future stages are locked until the active level is reached.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.data - Array of timeline stages (e.g., voter registration, announcement, voting day)
 * @returns {JSX.Element} The rendered Timeline component
 */
export default function Timeline({ data }) {
  const [activeLevel, setActiveLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([0]);

  const handleLevelClick = (index) => {
    if (unlockedLevels.includes(index)) {
      setActiveLevel(index);
    }
  };

  const unlockNext = () => {
    if (activeLevel + 1 < data.length) {
      if (!unlockedLevels.includes(activeLevel + 1)) {
        setUnlockedLevels([...unlockedLevels, activeLevel + 1]);
      }
      setActiveLevel(activeLevel + 1);
    }
  };

  return (
    <div className={styles.questContainer}>
      {/* Progress Hub */}
      <div className={styles.progressHub}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Trophy size={18} className={styles.trophyIcon} />
            <span>{unlockedLevels.length} / {data.length} Stages Explored</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(unlockedLevels.length / data.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Game Path */}
      <div className={styles.pathWrapper}>
        <div className={styles.scrollPath}>
          {data.map((item, index) => {
            const isUnlocked = unlockedLevels.includes(index);
            const isActive = activeLevel === index;
            return (
              <div key={index} className={styles.nodeWrapper}>
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  className={`${styles.node} ${isActive ? styles.active : ''} ${!isUnlocked ? styles.locked : ''}`}
                  onClick={() => handleLevelClick(index)}
                  style={{ '--node-color': item.color }}
                >
                  <div className={styles.nodeContent}>
                    {isUnlocked ? (isActive ? <Star fill="currentColor" size={24} /> : <CheckCircle2 size={24} />) : <Lock size={20} />}
                  </div>
                  <span className={styles.nodeTitle}>{item.stage}</span>
                </motion.button>
                {index < data.length - 1 && (
                  <div className={`${styles.connector} ${unlockedLevels.includes(index + 1) ? styles.connectorActive : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quest Details Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeLevel} 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }} 
          className={styles.questCard}
        >
          <div className={styles.cardHeader}>
            <div className={styles.levelBadge}>Stage {activeLevel + 1}</div>
            <h3 style={{ color: data[activeLevel].color }}>{data[activeLevel].stage}</h3>
          </div>
          
          <p className={styles.questDesc}>{data[activeLevel].description}</p>
          
          <div className={styles.questDeepDive}>
            <div className={styles.taskTitle}>Key Milestones:</div>
            <div className={styles.taskList}>
              {data[activeLevel].tasks?.map((task, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskBullet} style={{ backgroundColor: data[activeLevel].color }} />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {activeLevel === unlockedLevels[unlockedLevels.length - 1] && activeLevel < data.length - 1 && (
            <button className={styles.unlockBtn} onClick={unlockNext}>
              Explore Next Stage <ChevronRight size={18} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
