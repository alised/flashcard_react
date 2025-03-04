import React from 'react';

const Help = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-indigo-900 dark:text-indigo-300">Help Guide</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Getting Started</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome to the Flashcard App! This application helps you learn and memorize words using a spaced repetition system.
          Here's how to get started:
        </p>
        
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Add new words in the <strong>Words</strong> section</li>
          <li>Review due words in the <strong>Learn</strong> section</li>
          <li>Import or export your word collection in the <strong>Database</strong> section</li>
          <li>Customize your settings in the <strong>Settings</strong> section</li>
        </ol>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Words Section</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          In the Words section, you can:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Add new words with example sentences</li>
          <li>Search through your existing words</li>
          <li>Delete words you no longer want to study</li>
          <li>See which box each word is in and when it's due for review</li>
        </ul>
        
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          When adding a new word:
        </p>
        
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 ml-4">
          <li>Enter the word in the "Word" field</li>
          <li>Enter an example sentence or context in the "Context" field</li>
          <li>Click "Add Word" to save it to your collection</li>
        </ol>
        
        <p className="text-gray-700 dark:text-gray-300">
          New words are automatically placed in Box 1 and will be due for review the next day.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Learn Section</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Learn section is where you review words based on the spaced repetition schedule:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Click "Start Review" to begin reviewing due words</li>
          <li>For each word, try to recall its meaning and context</li>
          <li>Click "Show Answer" to see the example sentence</li>
          <li>After seeing the answer, provide feedback on how well you remembered it:</li>
        </ul>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>I Know It</strong> - If you remembered the word correctly, click this button. The word will move up one box (maximum Box 5) and will be scheduled for review after a longer interval.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>I Don't Know It</strong> - If you couldn't remember the word, click this button. The word will move back to Box 1 and will be scheduled for review the next day.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Mark as Mastered</strong> - If you know the word perfectly and don't need to review it anymore, click this button. The word will move to Box 6 and will not appear in future reviews.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Spaced Repetition System</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This app uses a modified Leitner System with 6 boxes. Words move between boxes based on your feedback:
        </p>
        
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 dark:bg-indigo-900">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Box</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Review Interval</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 1</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Every day</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">New words or words you had difficulty remembering</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 2</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Every 2 days</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Words you've remembered once</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 3</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Every 4 days</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Words you've remembered twice</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 4</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Every 7 days</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Words you've remembered three times</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 5</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Every 14 days</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Words you've remembered four times</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Box 6</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Never</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Mastered words that don't need further review</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
          <h3 className="text-sm font-medium mb-2 text-yellow-800 dark:text-yellow-300">Important Note:</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            When using the "I Know It" button, words will only progress up to Box 5 (maximum). This ensures that words are still reviewed periodically (every 14 days).
            To completely remove a word from the review schedule, use the "Mark as Mastered" button, which will move it to Box 6.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Database Section</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Database section allows you to import and export your word collection:
        </p>
        
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Exporting Words</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The app provides two options for exporting your words:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 ml-4">
          <li>
            <strong>Export Words & User Data</strong> - Exports all words with their complete learning data (box number, review dates, etc.). 
            Use this for creating a full backup of your progress.
          </li>
          <li>
            <strong>Export Words Only</strong> - Exports only the words and their context sentences, without any learning data.
            Use this when you want to share your word collection with others without your personal learning progress.
          </li>
        </ul>
        
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Importing Words</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Click "Select File" to import words from a JSON file. The file should contain an array of word objects.
          Only the "word" and "context" fields are required - other fields will be generated automatically.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Note: Duplicate words (words that already exist in your collection) will be skipped during import.
        </p>

        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Database Management</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Database section also includes database management options:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 ml-4">
          <li>
            <strong>Delete All Words</strong> - Permanently removes all words and learning progress from your database.
            This action cannot be undone, so make sure to export a backup before proceeding.
          </li>
        </ul>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600 mb-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Always export a backup of your data before performing any database management operations.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Settings Section</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          In the Settings section, you can customize your learning experience:
        </p>
        
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Theme Settings</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Choose between light mode, dark mode, or system preference for the app's appearance.
        </p>
        
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Daily New Words</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Set the maximum number of new words (from Box 1) you want to learn each day. This helps manage your daily workload.
          Words from higher boxes (Box 2-5) that are due for review will always be included regardless of this setting.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-300">Tips for Effective Learning</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Review your due words daily to maintain the spaced repetition schedule</li>
          <li>Add meaningful context sentences that help you remember the word's usage</li>
          <li>Don't add too many new words at once - focus on quality over quantity</li>
          <li>Be honest with yourself when providing feedback during reviews</li>
          <li>Use the "Mark as Mastered" button only when you're truly confident about a word</li>
          <li>Export your collection regularly as a backup</li>
        </ul>
      </div>
    </div>
  );
};

export default Help; 