'use client';

import React, { createContext, useContext, useState } from 'react';

const AssistantContext = createContext();

/**
 * AssistantProvider Component
 * 
 * Context provider that manages the global state of the AI assistant's visibility.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const AssistantProvider = ({ children }) => {
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
