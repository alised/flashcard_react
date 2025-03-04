import { useState, useRef } from 'react';
import { useWords } from '../contexts/WordsContext';

const Database = () => {
  const { words, importWords, exportWords, exportWordsSimple } = useWords();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({ text: '', type: null });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMessage({ text: 'No file selected', type: 'error' });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const success = await importWords(content);
        
        if (success) {
          setMessage({ text: 'Words imported successfully', type: 'success' });
          // Clear file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          setMessage({ text: 'Invalid file format', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Failed to import words', type: 'error' });
      } finally {
        setIsLoading(false);
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ text: '', type: null }), 3000);
      }
    };

    reader.onerror = () => {
      setMessage({ text: 'Error reading file', type: 'error' });
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    };

    reader.readAsText(file);
  };

  // Handle full export (words and user learning data)
  const handleExport = async () => {
    if (words.length === 0) {
      setMessage({ text: 'No words to export', type: 'error' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const json = exportWords();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcard_words_full_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ text: 'Words and learning data exported successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to export words', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  // Handle simple export (only words and context)
  const handleSimpleExport = async () => {
    if (words.length === 0) {
      setMessage({ text: 'No words to export', type: 'error' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const json = exportWordsSimple();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcard_words_simple_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ text: 'Words exported successfully (without learning data)', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to export words', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Database</h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Import</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Import words from a JSON file. The file should contain an array of word objects.
          </p>
          
          <div className="mb-4">
            <label 
              className={`block w-full px-4 py-3 text-center border-2 border-dashed rounded-md border-indigo-300 dark:border-indigo-700 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input 
                type="file" 
                className="hidden" 
                accept=".json" 
                onChange={handleImport}
                ref={fileInputRef}
                disabled={isLoading}
              />
              <span className="text-indigo-600 dark:text-indigo-400">
                {isLoading ? 'Importing...' : 'Select File'}
              </span>
            </label>
          </div>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
            <h3 className="text-sm font-medium mb-2 text-indigo-800 dark:text-indigo-300">Import File Format:</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Only "word" and "context" fields are required for import. Other fields will be generated automatically.
            </p>
            <pre className="text-xs overflow-x-auto bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              {`[
  {
    "word": "example",
    "context": "This is an example sentence."
  },
  {
    "word": "sample",
    "context": "Here is a sample sentence."
  }
]`}
            </pre>
          </div>
        </div>
        
        {/* Export Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Export</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Export your collection of words to a JSON file for backup or sharing.
          </p>
          
          <div className="mb-4 space-y-3">
            <button
              onClick={handleExport}
              disabled={words.length === 0 || isLoading}
              className={`w-full px-4 py-3 rounded-md text-white transition-colors ${
                words.length > 0 && !isLoading
                  ? 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Exporting...' : 'Export Words & User Data'}
            </button>
            
            <button
              onClick={handleSimpleExport}
              disabled={words.length === 0 || isLoading}
              className={`w-full px-4 py-3 rounded-md text-white transition-colors ${
                words.length > 0 && !isLoading
                  ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Exporting...' : 'Export Words Only'}
            </button>
          </div>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Words in collection:</span>
              <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">{words.length}</span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">File format:</span>
              <span className="text-sm text-indigo-900 dark:text-indigo-200">JSON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Database; 