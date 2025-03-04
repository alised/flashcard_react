import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FlashcardDB } from '../db';

// Box intervals in days
const BOX_INTERVALS = [1, 2, 4, 8, 16];

// Helper function to get today's date in local timezone as YYYY-MM-DD
const getTodayLocalDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Helper function to convert timestamp to date string (YYYY-MM-DD) in local timezone
const timestampToDateString = (timestamp: number): string => {
  if (timestamp === Number.MAX_SAFE_INTEGER) return '9999-12-31';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Helper function to convert date string to timestamp (start of day) in local timezone
const dateStringToTimestamp = (dateString: string): number => {
  if (dateString === '9999-12-31') return Number.MAX_SAFE_INTEGER;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

// Calculate next review date based on box number
const calculateNextReview = (box: number): string => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Define spaced repetition intervals in days
  switch (box) {
    case 1: // every day
      now.setDate(now.getDate() + 1);
      break;
    case 2: // every 2 days
      now.setDate(now.getDate() + 2);
      break;
    case 3: // every 4 days
      now.setDate(now.getDate() + 4);
      break;
    case 4: // every 7 days
      now.setDate(now.getDate() + 7);
      break;
    case 5: // every 14 days
      now.setDate(now.getDate() + 14);
      break;
    case 6: // Mastered, never review again
      return '9999-12-31';
    default:
      now.setDate(now.getDate() + 1); // Default to 1 day
  }
  
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Types
export interface WordEntry {
  id: string;
  word: string;
  context: string;
  box: number; // 1-6, where 6 is mastered
  nextReview: string; // Date string in YYYY-MM-DD format
  lastReviewed: string; // Date string in YYYY-MM-DD format
}

export interface WordsContextType {
  words: WordEntry[];
  addWord: (word: string, context: string) => Promise<boolean>;
  deleteWord: (id: string) => Promise<void>;
  updateWord: (id: string, word: string, context: string) => Promise<boolean>;
  doesWordExist: (word: string) => boolean;
  exportWords: () => string;
  exportWordsSimple: () => string;
  importWords: (jsonData: string) => Promise<boolean>;
  getDueWords: (dailyLimit?: number) => WordEntry[];
  updateWordBox: (id: string, understood: boolean) => Promise<void>;
  setWordAsMastered: (id: string) => Promise<void>;
}

const WordsContext = createContext<WordsContextType | undefined>(undefined);

export const WordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [db] = useState(() => new FlashcardDB());

  // Load words from IndexedDB on initial render
  useEffect(() => {
    const loadWords = async () => {
      try {
        const allWords = await db.words.toArray();
        setWords(allWords);
      } catch (error) {
        console.error('Failed to load words:', error);
        setWords([]);
      }
    };
    loadWords();
  }, [db]);

  // Add a new word
  const addWord = async (word: string, context: string): Promise<boolean> => {
    if (!word.trim() || !context.trim()) return false;
    
    // Check for duplicates (case insensitive)
    if (doesWordExist(word)) return false;

    const today = getTodayLocalDate();
    const newWord: WordEntry = {
      id: Date.now().toString(),
      word: word.trim(),
      context: context.trim(),
      box: 1, // Start in box 1
      nextReview: today, // Review immediately
      lastReviewed: '1970-01-01' // Never reviewed yet
    };

    try {
      await db.words.add(newWord);
      setWords(prev => [...prev, newWord]);
      return true;
    } catch (error) {
      console.error('Failed to add word:', error);
      return false;
    }
  };

  // Delete a word
  const deleteWord = async (id: string): Promise<void> => {
    try {
      await db.words.delete(id);
      setWords(prev => prev.filter(word => word.id !== id));
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  };

  // Update a word
  const updateWord = async (id: string, word: string, context: string): Promise<boolean> => {
    if (!word.trim() || !context.trim()) return false;
    
    try {
      const existingWord = words.find(w => w.id === id);
      if (!existingWord) return false;
      
      // Check for duplicates (case insensitive) but exclude the current word
      if (words.some(w => w.id !== id && w.word.toLowerCase() === word.toLowerCase())) {
        return false;
      }
      
      const updatedWord = {
        ...existingWord,
        word: word.trim(),
        context: context.trim()
      };
      
      await db.words.update(id, updatedWord);
      setWords(prev => prev.map(w => 
        w.id === id ? updatedWord : w
      ));
      return true;
    } catch (error) {
      console.error('Failed to update word:', error);
      return false;
    }
  };

  // Check if a word already exists
  const doesWordExist = (word: string): boolean => {
    return words.some(w => w.word.toLowerCase() === word.toLowerCase());
  };

  // Export words to JSON
  const exportWords = (): string => {
    return JSON.stringify(words, null, 2);
  };

  // Export only words and context to JSON (without learning data)
  const exportWordsSimple = (): string => {
    const simpleWords = words.map(word => ({
      word: word.word,
      context: word.context
    }));
    return JSON.stringify(simpleWords, null, 2);
  };

  // Import words from JSON
  const importWords = async (jsonData: string): Promise<boolean> => {
    try {
      const importedWords = JSON.parse(jsonData) as WordEntry[];
      
      // Validate that the imported data has the expected structure
      if (!Array.isArray(importedWords)) {
        return false;
      }
      
      // Basic validation of each word entry
      for (const word of importedWords) {
        if (!word.word || !word.context) {
          return false;
        }
      }
      
      // Merge with existing words, avoiding duplicates by word text
      const existingWordTexts = new Set(words.map(w => w.word.toLowerCase()));
      
      const today = getTodayLocalDate();
      const newWords = importedWords
        .filter(w => !existingWordTexts.has(w.word.toLowerCase()))
        .map(word => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          word: word.word.trim(),
          context: word.context.trim(),
          box: word.box || 1,
          nextReview: word.nextReview || today,
          lastReviewed: word.lastReviewed || '1970-01-01'
        }));
      
      if (newWords.length > 0) {
        await db.words.bulkAdd(newWords);
        setWords(prev => [...prev, ...newWords]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import words:', error);
      return false;
    }
  };

  // Get all words due for review
  const getDueWords = (dailyLimit?: number): WordEntry[] => {
    const today = getTodayLocalDate();
    
    // Get all due words
    const allDueWords = words
      .filter(word => word.nextReview <= today && word.box < 6) // Only get words due for review and not mastered
      .sort((a, b) => a.box - b.box); // Sort by box, so lower boxes come first
    
    // If no limit specified, return all due words
    if (!dailyLimit) return allDueWords;
    
    // Separate words by box
    const box1Words = allDueWords.filter(word => word.box === 1);
    const otherBoxWords = allDueWords.filter(word => word.box > 1);
    
    // Limit box 1 words to dailyLimit
    const limitedBox1Words = box1Words.slice(0, dailyLimit);
    
    // Combine and return
    return [...limitedBox1Words, ...otherBoxWords];
  };

  // Update a word's box based on understanding
  const updateWordBox = async (id: string, understood: boolean): Promise<void> => {
    try {
      const word = words.find(w => w.id === id);
      if (!word) return;
      
      let newBox = word.box;
      
      if (understood) {
        // Move up a box if they understood it (max box 5)
        newBox = Math.min(word.box + 1, 5);
      } else {
        // Move back to box 1 if they didn't understand it
        newBox = 1;
      }
      
      const today = getTodayLocalDate();
      const updatedWord = {
        ...word,
        box: newBox,
        nextReview: calculateNextReview(newBox),
        lastReviewed: today
      };
      
      await db.words.put(updatedWord);
      setWords(prev => prev.map(w => 
        w.id === id ? updatedWord : w
      ));
    } catch (error) {
      console.error('Failed to update word box:', error);
    }
  };

  // Set a word as completely mastered (box 6, never review again)
  const setWordAsMastered = async (id: string): Promise<void> => {
    try {
      const word = words.find(w => w.id === id);
      if (!word) return;
      
      const today = getTodayLocalDate();
      const updatedWord = {
        ...word,
        box: 6, // Mastered
        nextReview: '9999-12-31', // Never review
        lastReviewed: today
      };
      
      await db.words.put(updatedWord);
      setWords(prev => prev.map(w => 
        w.id === id ? updatedWord : w
      ));
    } catch (error) {
      console.error('Failed to set word as mastered:', error);
    }
  };

  const contextValue: WordsContextType = {
    words,
    addWord,
    deleteWord,
    updateWord,
    doesWordExist,
    exportWords,
    exportWordsSimple,
    importWords,
    getDueWords,
    updateWordBox,
    setWordAsMastered
  };

  return (
    <WordsContext.Provider value={contextValue}>
      {children}
    </WordsContext.Provider>
  );
};

export const useWords = (): WordsContextType => {
  const context = useContext(WordsContext);
  if (context === undefined) {
    throw new Error('useWords must be used within a WordsProvider');
  }
  return context;
};

export default WordsContext; 