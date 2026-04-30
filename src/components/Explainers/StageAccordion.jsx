'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronRight, Info, Maximize2, ArrowRight } from 'lucide-react';
import styles from './Explainers.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * Explainers Component (StageAccordion)
 * 
 * Renders an interactive library of election topics, allowing users to select
 * different subjects from a sidebar to view detailed explanations and images.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.data - Array of explainer topics containing title, content, image, etc.
 * @param {string} props.fact - A quick tip or fact displayed at the bottom of the content
 * @param {Function} props.onOpenAssistant - Callback to open the AI assistant
 * @returns {JSX.Element} The rendered Explainers component
 */
export default function Explainers({ data, fact, onOpenAssistant }) {
  const [selectedId, setSelectedId] = useState(0);

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.sidebar}>
        {data.map((item, index) => (
          <button
            key={index}
            className={`${styles.navItem} ${selectedId === index ? styles.active : ''}`}
            onClick={() => setSelectedId(index)}
            aria-expanded={selectedId === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
          >
            <div className={styles.itemTitle}>{item.title}</div>
            <ChevronRight size={16} className={styles.chevron} />
          </button>
        ))}
      </div>
      
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedId}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={styles.contentInner}
            id={`panel-${selectedId}`}
            role="region"
            aria-labelledby={`tab-${selectedId}`}
          >
            <div className={styles.contentHeader}>
              <div className={styles.headerIconWrapper}><BookOpen size={20} /></div>
              <h3>{data[selectedId].title}</h3>
            </div>
            
            <div className={styles.contentBody}>
              {data[selectedId].image && (
                <div className={styles.imageFrame}>
                  <Image 
                    src={data[selectedId].image} 
                    alt={data[selectedId].title} 
                    width={800}
                    height={450}
                    style={{ width: '100%', height: 'auto' }}
                    className={styles.explainerImage} 
                    priority={true}
                  />
                  <div className={styles.imageOverlay}><Maximize2 size={14} /> View Details</div>
                </div>
              )}
              
              <div className={styles.textContent}>
                <p>{data[selectedId].content}</p>
                
                {data[selectedId].bullets && (
                  <ul className={styles.bulletList}>
                    {data[selectedId].bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              {data[selectedId].cta && (
                <button className={styles.ctaButton} onClick={onOpenAssistant}>
                  {data[selectedId].cta} <ArrowRight size={18} />
                </button>
              )}
              
              <div className={styles.quickFact}>
                <div className={styles.factIcon}><Info size={14} /></div>
                <span><strong>Pro Tip:</strong> {fact}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
