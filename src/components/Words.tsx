import { useState } from 'react';
import { useWords, WordEntry } from '../contexts/WordsContext';

const Words = () => {
  const { words, addWord, deleteWord, doesWordExist } = useWords();
  const [newWord, setNewWord] = useState('');
  const [context, setContext] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({ text: '', type: null });
  const [isLoading, setIsLoading] = useState(false);

  // Handle adding a new word
  const handleAddWord = async () => {
    if (!newWord.trim() || !context.trim()) {
      setMessage({ text: 'Both word and context are required', type: 'error' });
      return;
    }

    if (doesWordExist(newWord)) {
      setMessage({ text: 'This word already exists in your collection', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const success = await addWord(newWord, context);
      if (success) {
        setMessage({ text: 'Word added successfully', type: 'success' });
        setNewWord('');
        setContext('');
      } else {
        setMessage({ text: 'Failed to add word', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to add word', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  // Handle deleting a word
  const handleDeleteWord = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteWord(id);
      setMessage({ text: 'Word deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete word', type: 'error' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: null }), 3000);
    }
  };

  // Filter words based on search term
  const filteredWords = words.filter(word => 
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    word.context.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Get next review date in readable format
  const getNextReviewDate = (dateString: string): string => {
    if (dateString === '9999-12-31') return 'Never';
    return dateString;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Words</h1>
      
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
      
      {/* Add new word form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Add New Word</h2>
        
        <div className="mb-4">
          <label htmlFor="word" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Word</label>
          <input
            id="word"
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter a new word or phrase"
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="context" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Context (example sentence)</label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter a sentence that uses this word"
            rows={3}
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={handleAddWord}
          disabled={isLoading}
          className={`bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors shadow-sm ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Adding...' : 'Add Word'}
        </button>
      </div>
      
      {/* Words list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Your Words</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total: {words.length}</div>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words..."
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
            disabled={isLoading}
          />
        </div>
        
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-50 dark:bg-indigo-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Word</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Context</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Box</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Next Review</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredWords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No words found
                  </td>
                </tr>
              ) : (
                filteredWords.map((wordEntry: WordEntry) => (
                  <tr key={wordEntry.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{wordEntry.word}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{wordEntry.context}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${wordEntry.box === 6 ? 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'}`
                      }>
                        {getBoxName(wordEntry.box)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {getNextReviewDate(wordEntry.nextReview)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDeleteWord(wordEntry.id)}
                        disabled={isLoading}
                        className={`text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Words; 