const Database = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Database</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors shadow-sm bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Import</h2>
            <button className="bg-teal-600 dark:bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors shadow-sm">
              Select File
            </button>
          </div>
          <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors shadow-sm bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-indigo-800 dark:text-indigo-300">Export</h2>
            <button className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors shadow-sm">
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Database; 