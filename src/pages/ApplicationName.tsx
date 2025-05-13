import React, { useState } from 'react';

const ApplicationName: React.FC = () => {
  const [appName, setAppName] = useState('Frame Ji');

  const handleSave = () => {
    // Handle save functionality
    console.log('Application Name Saved:', appName);
    // Here you would typically make an API call to save the settings
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Application Name</h2>
      
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Application Name</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Enter application name"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationName;
