import { supabase } from './supabase';

const LOGO_BUCKET = 'logos';

export interface UploadResponse {
  path: string;
  url: string;
}

export const uploadLogo = async (file: File, folder: string): Promise<UploadResponse> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${folder}/${Date.now()}.${fileExt}`;

  const { error: uploadError, data } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error uploading file: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(LOGO_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: publicUrl,
  };
};

export const updateSettings = async (settings: Record<string, any>) => {
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...settings });

  if (error) {
    throw new Error(`Error updating settings: ${error.message}`);
  }
};

export const getSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    throw new Error(`Error fetching settings: ${error.message}`);
  }

  return data;
};
