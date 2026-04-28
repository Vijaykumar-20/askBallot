'use client';

import React, { createContext, useContext, useState } from 'react';

const AssistantContext = createContext();

export function AssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  return (
    <AssistantContext.Provider value={{ isOpen, openAssistant, closeAssistant, toggleAssistant }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
}
