import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Learn from './components/Learn';
import Database from './components/Database';
import Words from './components/Words';
import Settings from './components/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { WordsProvider } from './contexts/WordsContext';

function App() {
  return (
    <ThemeProvider>
      <WordsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/learn" replace />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/database" element={<Database />} />
              <Route path="/words" element={<Words />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </WordsProvider>
    </ThemeProvider>
  );
}

export default App;
