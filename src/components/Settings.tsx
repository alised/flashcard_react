import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode, dailyNewWords, setDailyNewWords, autoShowAnswer, toggleAutoShowAnswer } = useTheme();

  const handleDailyWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setDailyNewWords(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
        <div className="mb-5">
          <label htmlFor="theme" className="block text-lg font-medium mb-2 text-indigo-800 dark:text-indigo-300">
            Theme
          </label>
          <div className="flex items-center mb-3">
            <span className="mr-3 text-gray-700 dark:text-gray-300">Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Dark</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {darkMode ? 'Using dark mode (follows system preference)' : 'Using light mode (follows system preference)'}
          </p>
        </div>
        
        <div className="mb-5">
          <label htmlFor="dailyNewWords" className="block text-lg font-medium mb-2 text-indigo-800 dark:text-indigo-300">
            Daily New Words
          </label>
          <input 
            type="number" 
            id="dailyNewWords" 
            min="1" 
            max="50" 
            value={dailyNewWords}
            onChange={handleDailyWordsChange}
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 transition-colors"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Number of new words you want to learn each day (between 1 and 50). New words are words from Box 1 that you haven't studied yet. This setting doesn't affect review words from other boxes that are due for review.
          </p>
        </div>

        <div className="mb-5">
          <label htmlFor="autoShowAnswer" className="block text-lg font-medium mb-2 text-indigo-800 dark:text-indigo-300">
            Auto Show Answer
          </label>
          <div className="flex items-center mb-3">
            <span className="mr-3 text-gray-700 dark:text-gray-300">Off</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="autoShowAnswer"
                className="sr-only peer" 
                checked={autoShowAnswer}
                onChange={toggleAutoShowAnswer}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="ml-3 text-gray-700 dark:text-gray-300">On</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {autoShowAnswer 
              ? 'Answers will be automatically shown in the Learn section' 
              : 'You need to click "Show Answer" to see answers in the Learn section'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 