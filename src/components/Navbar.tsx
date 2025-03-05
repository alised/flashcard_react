import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { darkMode } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700 dark:bg-indigo-900' : '';
  };

  return (
    <nav className="bg-indigo-800 dark:bg-gray-800 text-white p-3 shadow-md transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">FlashCard App</Link>
        <div className="flex space-x-4">
          <Link 
            to="/learn" 
            className={`px-3 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors ${isActive('/learn')}`}
          >
            Learn
          </Link>
          <Link 
            to="/database" 
            className={`px-3 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors ${isActive('/database')}`}
          >
            Database
          </Link>
          <Link 
            to="/words" 
            className={`px-3 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors ${isActive('/words')}`}
          >
            Words
          </Link>
          <Link 
            to="/settings" 
            className={`px-3 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors ${isActive('/settings')}`}
          >
            Settings
          </Link>
          <Link 
            to="/help" 
            className={`px-3 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors ${isActive('/help')}`}
          >
            Help
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 