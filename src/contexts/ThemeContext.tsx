import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  dailyNewWords: number;
  setDailyNewWords: (count: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if user prefers dark mode from system
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Initialize dark mode based on localStorage or system preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : prefersDarkMode;
  });

  // Initialize daily new words count from localStorage or default to 10
  const [dailyNewWords, setDailyNewWordsState] = useState<number>(() => {
    const savedCount = localStorage.getItem('dailyNewWords');
    return savedCount ? parseInt(savedCount, 10) : 10;
  });

  // Listen for changes in system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save daily new words count to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dailyNewWords', dailyNewWords.toString());
  }, [dailyNewWords]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const setDailyNewWords = (count: number) => {
    if (count >= 1 && count <= 50) { // Ensure count is within reasonable limits
      setDailyNewWordsState(count);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, dailyNewWords, setDailyNewWords }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 