import { useState, useEffect } from 'react';
import { useWords, WordEntry } from '../contexts/WordsContext';

const Learn = () => {
  const { 
    words, 
    getDueWords, 
    updateWordBox, 
    setWordAsMastered 
  } = useWords();
  
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [studySession, setStudySession] = useState<WordEntry[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({ text: '', type: null });
  const [sessionActive, setSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load due words when component mounts
  useEffect(() => {
    checkDueWords();
  }, [words]);

  // Check for due words
  const checkDueWords = () => {
    const dueWords = getDueWords();
    setDueCount(dueWords.length);
  };

  // Start learning session
  const startSession = () => {
    const dueWords = getDueWords();
    if (dueWords.length === 0) {
      setMessage({ text: 'No words due for review!', type: 'info' });
      return;
    }
    
    setStudySession(dueWords);
    setCurrentWord(dueWords[0]);
    setIsShowingAnswer(false);
    setAnsweredCount(0);
    setSessionActive(true);
    setMessage({ text: '', type: null });
  };

  // Show answer for current word
  const showAnswer = () => {
    setIsShowingAnswer(true);
  };

  // Handle user response to a word
  const handleResponse = async (understood: boolean) => {
    if (!currentWord) return;

    setIsLoading(true);
    try {
      // Update word's box based on user response
      if (understood) {
        await updateWordBox(currentWord.id, true);
      } else {
        await updateWordBox(currentWord.id, false);
      }

      // Move to next word or end session
      const newAnsweredCount = answeredCount + 1;
      setAnsweredCount(newAnsweredCount);

      if (newAnsweredCount >= studySession.length) {
        setMessage({ text: 'Review session complete!', type: 'success' });
        setSessionActive(false);
        checkDueWords(); // Refresh due words count
      } else {
        setCurrentWord(studySession[newAnsweredCount]);
        setIsShowingAnswer(false);
      }
    } catch (error) {
      setMessage({ text: 'Failed to update word status', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  // Mark word as completely mastered (won't show again)
  const handleMarkAsMastered = async () => {
    if (!currentWord) return;
    
    setIsLoading(true);
    try {
      await setWordAsMastered(currentWord.id);
      
      // Move to next word or end session
      const newAnsweredCount = answeredCount + 1;
      setAnsweredCount(newAnsweredCount);

      if (newAnsweredCount >= studySession.length) {
        setMessage({ text: 'Review session complete!', type: 'success' });
        setSessionActive(false);
        checkDueWords(); // Refresh due words count
      } else {
        setCurrentWord(studySession[newAnsweredCount]);
        setIsShowingAnswer(false);
      }
    } catch (error) {
      setMessage({ text: 'Failed to mark word as mastered', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  // Get box name for display
  const getBoxName = (box: number): string => {
    if (box === 6) return 'Mastered';
    return `Box ${box}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Learning</h1>
      
      {/* Message display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
          message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
          'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
        {!sessionActive ? (
          // Session not active - show start screen
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Spaced Repetition Learning</h2>
            
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                You have <span className="font-bold text-indigo-600 dark:text-indigo-300">{dueCount}</span> words due for review.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total collection: {words.length} words
              </p>
            </div>
            
            <button 
              onClick={startSession}
              disabled={dueCount === 0 || isLoading}
              className={`px-6 py-3 rounded-md shadow-sm text-white transition-colors ${
                dueCount > 0 && !isLoading
                  ? 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {dueCount > 0 ? 'Start Review Session' : 'No Words to Review'}
            </button>
            
            {dueCount === 0 && words.length > 0 && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                All words have been reviewed. Check back later!
              </p>
            )}
            
            {words.length === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-left">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">No words in your collection</h3>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Go to the Words section to add some words to your collection first.
                </p>
              </div>
            )}
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">How It Works</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                This app uses the spaced repetition technique with 6 boxes:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 text-left max-w-md mx-auto space-y-1">
                <li>• Box 1: Review every day</li>
                <li>• Box 2: Review every 2 days</li>
                <li>• Box 3: Review every 4 days</li>
                <li>• Box 4: Review every 7 days</li>
                <li>• Box 5: Review every 14 days</li>
                <li>• Box 6: Mastered (never review)</li>
              </ul>
            </div>
          </div>
        ) : (
          // Active learning session
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Review Session</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Progress: {answeredCount + 1}/{studySession.length}
              </div>
            </div>
            
            {currentWord && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300">{currentWord.word}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {getBoxName(currentWord.box)}
                  </span>
                </div>
                
                {isShowingAnswer ? (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300">{currentWord.context}</p>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={showAnswer}
                      disabled={isLoading}
                      className={`bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Show Context
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {isShowingAnswer && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button 
                  onClick={() => handleResponse(false)}
                  disabled={isLoading}
                  className={`bg-red-500 dark:bg-red-700 text-white px-6 py-3 rounded-md hover:bg-red-600 dark:hover:bg-red-800 transition-colors shadow-sm ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : "I Don't Know It"}
                </button>
                
                <button 
                  onClick={() => handleResponse(true)}
                  disabled={isLoading}
                  className={`bg-green-500 dark:bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-600 dark:hover:bg-green-800 transition-colors shadow-sm ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : 'I Know It'}
                </button>
                
                <button 
                  onClick={handleMarkAsMastered}
                  disabled={isLoading}
                  className={`bg-purple-500 dark:bg-purple-700 text-white px-6 py-3 rounded-md hover:bg-purple-600 dark:hover:bg-purple-800 transition-colors shadow-sm ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Mark as Mastered'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn; 