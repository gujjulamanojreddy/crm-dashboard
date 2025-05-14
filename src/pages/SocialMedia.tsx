import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

const defaultLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/',
  twitter: 'https://x.com/',
  instagram: 'https://www.instagram.com/',
  youtube: 'https://www.youtube.com/',
  linkedin: 'https://in.linkedin.com/'
};

const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const SocialMedia = (): JSX.Element => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('content')
        .eq('id', 'social-media')
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setLinks(JSON.parse(data.content));
      }
    } catch (error) {
      console.error('Error loading social media links:', error);
      toast.error('Failed to load social media links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate all URLs before saving
    const newErrors: Partial<Record<keyof SocialLinks, string>> = {};
    Object.entries(links).forEach(([key, value]) => {
      if (!validateURL(value)) {
        newErrors[key as keyof SocialLinks] = 'Please enter a valid URL';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the invalid URLs');
      return;
    }

    setIsSaving(true);
    try {
      const { data: existingData, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('id', 'social-media')
        .maybeSingle();

      if (checkError) throw checkError;

      let error;
      
      if (existingData) {
        const { error: updateError } = await supabase
          .from('content')
          .update({ 
            content: JSON.stringify(links),
            updated_at: new Date().toISOString()
          })
          .eq('id', 'social-media');
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content')
          .insert({ 
            id: 'social-media',
            content: JSON.stringify(links),
            updated_at: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) throw error;

      setErrors({});
      toast.success('Social media links updated successfully');
    } catch (error) {
      console.error('Error saving social media links:', error);
      toast.error('Failed to save social media links');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Social Media</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
        <div className="space-y-4">
          {Object.entries(links).map(([key, value]) => (
            <div key={key}>
              <Input
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                type="url"
                value={value}
                error={errors[key as keyof SocialLinks]}
                onChange={(e) => {
                  setLinks(prev => ({ ...prev, [key]: e.target.value }));
                  if (errors[key as keyof SocialLinks]) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[key as keyof SocialLinks];
                      return newErrors;
                    });
                  }
                }}
                className="font-mono text-sm"
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              className={`${
                isSaving 
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded text-sm font-medium transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
