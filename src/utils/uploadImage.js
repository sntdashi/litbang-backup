import { supabase } from '../supabase';

export async function uploadImageFile(file, folder = 'gallery'){
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('litbang-gallery')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if(error) throw error;
  const { data: urlData } = supabase.storage.from('litbang-gallery').getPublicUrl(fileName);
  return urlData.publicUrl;
}
