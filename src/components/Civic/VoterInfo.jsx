'use client';

import React, { useState } from 'react';
import { Search, MapPin, Landmark } from 'lucide-react';
import styles from './VoterInfo.module.css';

export default function VoterInfo() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    if (!address.trim()) return;
    setLoading(true);
    
    // Improved Mock logic for Voter Information
    setTimeout(() => {
      const isDelhi = address.includes('110') || address.toLowerCase().includes('delhi');
      setResult({
        electionName: "General Election 2026",
        pollingLocation: isDelhi ? "Kendriya Vidyalaya, New Delhi" : "Public School Hall, " + address,
        representative: isDelhi ? "Member of Parliament (New Delhi)" : "Local Representative for " + address
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className={styles.civicContainer}>
      <div className={styles.civicHeader}>
        <div className={styles.civicIconWrapper}>
          <Landmark size={16} />
        </div>
        <h3>Election Search Hub</h3>
      </div>
      
      <div className={styles.searchBox}>
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your Zip Code or City..."
          className={styles.searchInput}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching Civic API..." : "Find My Representatives"}
        </button>
      </div>

      {result && (
        <div className={styles.resultBox}>
          <div><strong><Landmark size={12} style={{display:'inline', marginRight:'4px'}}/> Election:</strong> {result.electionName}</div>
          <div style={{marginTop: '0.5rem'}}><strong><MapPin size={12} style={{display:'inline', marginRight:'4px'}}/> Polling Station:</strong> {result.pollingLocation}</div>
        </div>
      )}
    </div>
  );
}
