import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();

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
          <label htmlFor="language" className="block text-lg font-medium mb-2 text-indigo-800 dark:text-indigo-300">Language</label>
          <select 
            id="language" 
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 transition-colors"
          >
            <option value="en">English</option>
            <option value="fa">Persian</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings; 