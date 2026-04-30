'use client';

import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

/**
 * LanguageProvider Component
 * 
 * Context provider for managing and distributing the currently selected language
 * across the application.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
