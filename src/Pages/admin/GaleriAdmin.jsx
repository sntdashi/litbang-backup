import React, {useEffect, useState} from 'react';
import { supabase } from '../../supabase';
import { uploadImageFile } from '../../utils/uploadImage';

export default function GaleriAdmin(){
  const [list, setList] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  useEffect(()=> load(), []);
  async function load(){ const { data } = await supabase.from('gallery').select('*').order('created_at',{ascending:false}); setList(data||[]); }
  async function handleUpload(e){
    e.preventDefault();
    if(!file) return alert('Pilih file');
    try{
      const url = await uploadImageFile(file);
      await supabase.from('gallery').insert([{ image_url: url, caption }]);
      setFile(null); setCaption(''); load();
    }catch(err){ console.error(err); alert('Upload error: ' + err.message); }
  }
  async function del(id){ await supabase.from('gallery').delete().eq('id', id); load(); }

  return (
    <div>
      <h3 className="font-semibold mb-2">Galeri</h3>
      <form onSubmit={handleUpload} className="mb-4 p-3 bg-white/5 rounded">
        <input type="file" onChange={e=>setFile(e.target.files[0])} className="mb-2"/>
        <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Caption" className="w-full p-2 mb-2 bg-transparent border rounded"/>
        <button className="btn-primary px-3 py-2">Upload</button>
      </form>
      <ul className="space-y-2">
        {list.map(i=>(
          <li key={i.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
            <img src={i.image_url} alt="" className="w-20 h-12 object-cover rounded"/>
            <div className="flex-1 px-3 text-sm text-gray-200">{i.caption}</div>
            <div><button onClick={()=>del(i.id)} className="px-2 py-1 border rounded">Hapus</button></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
