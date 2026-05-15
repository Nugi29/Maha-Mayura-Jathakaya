import { createContext, useState, useContext, useEffect } from 'react';

const MuteContext = createContext();

export function MuteProvider({ children }) {
  // Initialize from localStorage if available
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('globalMuteState');
    return saved === 'true';
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('globalMuteState', isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <MuteContext.Provider value={{ isMuted, setIsMuted, toggleMute }}>
      {children}
    </MuteContext.Provider>
  );
}

export function useMute() {
  return useContext(MuteContext);
}
