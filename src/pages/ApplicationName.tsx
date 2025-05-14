import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ApplicationName = (): JSX.Element => {
  const [appName, setAppName] = useState('Frame Ji');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadApplicationName();
  }, []);

  const loadApplicationName = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('content')
        .eq('id', 'application-name')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setAppName(data.content);
      }
    } catch (error) {
      console.error('Error loading application name:', error);
      toast.error('Failed to load application name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appName.trim()) {
      toast.error('Application name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('id', 'application-name')
        .maybeSingle();

      if (checkError) throw checkError;

      let error;
      
      if (existingData) {
        const { error: updateError } = await supabase
          .from('content')
          .update({ 
            content: appName.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', 'application-name');
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content')
          .insert({ 
            id: 'application-name',
            content: appName.trim(),
            updated_at: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) throw error;

      toast.success('Application name saved successfully');
    } catch (error) {
      console.error('Error saving application name:', error);
      toast.error('Failed to save application name');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              disabled={isSaving}
              className={`${
                isSaving 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-1.5 rounded text-sm font-medium transition-colors`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationName;
