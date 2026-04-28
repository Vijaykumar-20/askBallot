'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Sparkles, Zap } from 'lucide-react';
import styles from './Chat.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssistantPanel({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Namaste! I'm askBallot AI. Your 24/7 democratic guide. How can I help you navigate the 2026 General Election today?" }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: messages.filter(m => m.parts[0].text !== "Namaste! I'm askBallot AI. Your 24/7 democratic guide. How can I help you navigate the 2026 General Election today?") 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: 'Sorry, something went wrong. Please try again.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.aiBadge}>
             <Sparkles size={14} className={styles.sparkleIcon} />
             <span>AI AGENT</span>
          </div>
          <div className={styles.headerText}>
            <h3>askBallot AI</h3>
            <div className={styles.onlineStatus}><div className={styles.statusDot} /> Active Now</div>
          </div>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.messages} ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.bot}`}
            >
              <div className={styles.avatar}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={styles.bubble}>
                {msg.parts[0].text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.avatar}><Bot size={14} /></div>
            <div className={`${styles.bubble} ${styles.typing}`}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <form className={styles.inputArea} onSubmit={handleSend}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the election..."
            autoFocus
          />
          <button type="submit" className={styles.sendButton} disabled={isLoading}>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
