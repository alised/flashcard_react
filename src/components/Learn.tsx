import { useState, useEffect } from 'react';
import { useWords, WordEntry } from '../contexts/WordsContext';
import { useTheme } from '../contexts/ThemeContext';

const Learn = () => {
  const { 
    words, 
    getDueWords, 
    updateWordBox, 
    setWordAsMastered 
  } = useWords();
  
  const { dailyNewWords, autoShowAnswer } = useTheme();
  
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [studySession, setStudySession] = useState<WordEntry[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({ text: '', type: null });
  const [sessionActive, setSessionActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isProcessing) return;

      if (event.code === 'Space') {
        event.preventDefault();
        
        if (!sessionActive) {
          // Start session if not active and there are due words
          if (dueCount > 0) {
            startSession();
          }
        } else {
          // During session
          if (!isShowingAnswer) {
            showAnswer();
          } else {
            handleResponse(true);
          }
        }
      }

      // Only handle these shortcuts during active session
      if (sessionActive && isShowingAnswer) {
        switch (event.code) {
          case 'Digit1':
          case 'Numpad1':
            event.preventDefault();
            handleResponse(false);
            break;
          case 'Digit2':
          case 'Numpad2':
            event.preventDefault();
            handleResponse(true);
            break;
          case 'Digit3':
          case 'Numpad3':
            event.preventDefault();
            handleMarkAsMastered();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sessionActive, isShowingAnswer, isProcessing, dueCount]);

  // Load due words when component mounts
  useEffect(() => {
    checkDueWords();
  }, [words, dailyNewWords]);

  // Check for due words
  const checkDueWords = () => {
    const dueWords = getDueWords(dailyNewWords);
    setDueCount(dueWords.length);
  };

  // Start a new study session
  const startSession = () => {
    const dueWords = getDueWords(dailyNewWords);
    if (dueWords.length === 0) {
      setMessage({ text: 'No words due for review!', type: 'info' });
      return;
    }
    
    setStudySession(dueWords);
    setCurrentWord(dueWords[0]);
    setIsShowingAnswer(autoShowAnswer);
    setAnsweredCount(0);
    setSessionActive(true);
    setMessage({ text: '', type: null });
  };

  // Show the answer for the current word
  const showAnswer = () => {
    setIsShowingAnswer(true);
  };

  // Handle user response to a word
  const handleResponse = async (understood: boolean) => {
    if (!currentWord || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await updateWordBox(currentWord.id, understood);
      
      // Update answered count
      setAnsweredCount(prev => prev + 1);
      
      // Move to next word or end session
      const currentIndex = studySession.findIndex(w => w.id === currentWord.id);
      if (currentIndex < studySession.length - 1) {
        setCurrentWord(studySession[currentIndex + 1]);
        setIsShowingAnswer(autoShowAnswer);
      } else {
        // End of session
        setSessionActive(false);
        setCurrentWord(null);
        setMessage({ 
          text: `Session complete! You reviewed ${studySession.length} words.`, 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error('Error updating word:', error);
      setMessage({ 
        text: 'An error occurred while updating the word.', 
        type: 'error' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Mark a word as completely mastered
  const handleMarkAsMastered = async () => {
    if (!currentWord || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await setWordAsMastered(currentWord.id);
      
      // Update answered count
      setAnsweredCount(prev => prev + 1);
      
      // Move to next word or end session
      const currentIndex = studySession.findIndex(w => w.id === currentWord.id);
      if (currentIndex < studySession.length - 1) {
        setCurrentWord(studySession[currentIndex + 1]);
        setIsShowingAnswer(autoShowAnswer);
      } else {
        // End of session
        setSessionActive(false);
        setCurrentWord(null);
        setMessage({ 
          text: `Session complete! You reviewed ${studySession.length} words.`, 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error('Error marking word as mastered:', error);
      setMessage({ 
        text: 'An error occurred while updating the word.', 
        type: 'error' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get box name for display
  const getBoxName = (box: number): string => {
    switch (box) {
      case 1: return 'Box 1 (Daily)';
      case 2: return 'Box 2 (Every 2 days)';
      case 3: return 'Box 3 (Every 4 days)';
      case 4: return 'Box 4 (Weekly)';
      case 5: return 'Box 5 (Every 2 weeks)';
      case 6: return 'Mastered';
      default: return `Box ${box}`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Learning</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
        {!sessionActive ? (
          <div className="text-center">
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              You have {dueCount} words due for review.
            </p>
            <div className="flex flex-col items-center">
              <button
                onClick={startSession}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                disabled={dueCount === 0 || isProcessing}
              >
                Start Review Session
              </button>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Press Space to start</span>
            </div>
            {message.text && (
              <div className={`mt-4 p-2 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Progress: {answeredCount}/{studySession.length}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {currentWord && getBoxName(currentWord.box)}
              </span>
            </div>
            
            {currentWord && (
              <div className="mb-6">
                <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <h2 className="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">{currentWord.word}</h2>
                  {isShowingAnswer && (
                    <p className="text-gray-700 dark:text-gray-300">{currentWord.context}</p>
                  )}
                </div>
                
                {!isShowingAnswer ? (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={showAnswer}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                      disabled={isProcessing}
                    >
                      Show Answer
                    </button>
                    <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Press Space to show</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <div className="flex-1 flex flex-col items-center">
                        <button
                          onClick={() => handleResponse(false)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                          disabled={isProcessing}
                        >
                          Didn't Know
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <button
                          onClick={() => handleResponse(true)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                          disabled={isProcessing}
                        >
                          Knew It
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <button
                          onClick={handleMarkAsMastered}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                          disabled={isProcessing}
                        >
                          Mark as Mastered
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
        <h2 className="text-lg font-semibold mb-2 text-indigo-800 dark:text-indigo-300">Keyboard Shortcuts</h2>
        <ul className="text-gray-700 dark:text-gray-300 space-y-1">
          <li><strong>Space</strong> - Start session / Show answer / Mark as known</li>
          <li><strong>1</strong> - Didn't know the word</li>
          <li><strong>2</strong> - Knew the word</li>
          <li><strong>3</strong> - Mark word as mastered</li>
        </ul>
      </div>
    </div>
  );
};

export default Learn; 