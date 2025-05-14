import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { uploadLogo, updateSettings, getSettings } from '../lib/storage';
import toast from 'react-hot-toast';
import { Trash2, Save } from 'lucide-react';

interface LogoState {
  file: File | null;
  preview: string;
}

interface LogoUploadState {
  headerLogo: LogoState;
  footerLogo: LogoState;
  adminLogo: LogoState;
}

const Logos: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logos, setLogos] = useState<LogoUploadState>({
    headerLogo: { file: null, preview: '' },
    footerLogo: { file: null, preview: '' },
    adminLogo: { file: null, preview: '' }
  });

  useEffect(() => {
    const fetchCurrentLogos = async () => {
      try {
        const settings = await getSettings();
        setLogos(prev => ({
          headerLogo: { ...prev.headerLogo, preview: settings?.headerLogo || '' },
          footerLogo: { ...prev.footerLogo, preview: settings?.footerLogo || '' },
          adminLogo: { ...prev.adminLogo, preview: settings?.adminLogo || '' }
        }));
      } catch (error) {
        console.error('Error fetching logos:', error);
        toast.error('Failed to load current logos');
      }
    };

    fetchCurrentLogos();
  }, []);

  const handleFileChange = (type: keyof LogoUploadState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setLogos(prev => ({
        ...prev,
        [type]: { file, preview }
      }));
    }
  };

  const handleSave = async (type: keyof LogoUploadState) => {
    if (!logos[type].file) return;
    
    setIsLoading(true);
    try {
      const { url } = await uploadLogo(logos[type].file!, type);
      const updates = {
        [type]: url
      };
      await updateSettings(updates);
      setLogos(prev => ({
        ...prev,
        [type]: { file: null, preview: url }
      }));
      toast.success('Logo saved successfully');
    } catch (error) {
      console.error('Error saving logo:', error);
      toast.error('Failed to save logo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (type: keyof LogoUploadState) => {
    setIsLoading(true);
    try {
      const updates = {
        [type]: ''
      };
      await updateSettings(updates);
      setLogos(prev => ({
        ...prev,
        [type]: { file: null, preview: '' }
      }));
      toast.success('Logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Failed to remove logo');
    } finally {
      setIsLoading(false);
    }
  };

  const LogoUploadField = ({ 
    label, 
    type, 
    value,
    frameStyle = 'regular' 
  }: { 
    label: string; 
    type: keyof LogoUploadState; 
    value: LogoState;
    frameStyle?: 'regular' | 'yellow' | 'dark'
  }) => {
    const getFrameStyle = () => {
      switch (frameStyle) {
        case 'yellow':
          return 'text-amber-400';
        case 'dark':
          return 'text-gray-800 bg-gray-200 px-2 py-1 rounded';
        default:
          return 'text-rose-500';
      }
    };

    return (
      <div>
        <label className="block mb-2 text-sm text-gray-700">{label}</label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(type)}
                  disabled={isLoading}
                  className="block flex-grow text-sm text-slate-500 p-2 border rounded
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <span className={getFrameStyle()}>
                  Frame Ji
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Recommended size: 250 x 100 pixels</p>
            </div>
            {value.preview && (
              <div className="flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden">
                <img 
                  src={value.preview} 
                  alt={`${type} preview`} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {value.file && (
              <Button
                onClick={() => handleSave(type)}
                isLoading={isLoading}
                className="bg-green-500 text-white hover:bg-green-600"
                leftIcon={<Save size={16} />}
              >
                Save
              </Button>
            )}
            {value.preview && (
              <Button
                onClick={() => handleRemove(type)}
                isLoading={isLoading}
                className="bg-red-500 text-white hover:bg-red-600"
                leftIcon={<Trash2 size={16} />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Logo</h2>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
        <div className="space-y-8">
          <LogoUploadField 
            label="Header Logo for user Website" 
            type="headerLogo" 
            value={logos.headerLogo}
            frameStyle="yellow"
          />
          
          <LogoUploadField 
            label="Footer logo for user Website" 
            type="footerLogo" 
            value={logos.footerLogo}
            frameStyle="yellow"
          />
          
          <LogoUploadField 
            label="Logo for admin website" 
            type="adminLogo" 
            value={logos.adminLogo}
            frameStyle="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default Logos;
