'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './DocumentVault.module.css';

export default function DocumentVault() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    if (isUploading || isSuccess) return;
    
    // Simulate Cloud Storage Upload
    setIsUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload();
    }
  };

  return (
    <div className={styles.vaultContainer}>
      <div className={styles.vaultHeader}>
        <div className={styles.vaultIconWrapper}>
          <Shield size={16} />
        </div>
        <h3>Secure Document Vault</h3>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className={styles.hiddenInput}
        accept="image/*,.pdf"
      />

      <div 
        className={`${styles.uploadArea} ${isUploading ? styles.uploading : ''}`}
        onClick={() => !isSuccess && fileInputRef.current?.click()}
      >
        {isSuccess ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <CheckCircle size={32} className={styles.uploadIcon} style={{ color: 'var(--india-green)' }} />
            <p className={styles.uploadText}>Document Secured in Encrypted Vault</p>
          </motion.div>
        ) : (
          <>
            {isUploading ? (
              <FileText size={32} className={styles.uploadIcon} style={{ color: 'var(--ashoka-blue)' }} />
            ) : (
              <UploadCloud size={32} className={styles.uploadIcon} />
            )}
            <p className={styles.uploadText}>
              {isUploading ? "Encrypting and Uploading..." : <span><strong>Click to Upload</strong> Voter ID (Mock)</span>}
            </p>
          </>
        )}

        {isUploading && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
