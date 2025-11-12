import React, {useEffect, useState} from 'react';
import { supabase } from '../../supabase';

export default function PublikasiAdmin(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({title:'', content:''});
  useEffect(()=> load(), []);
  async function load(){ const { data } = await supabase.from('publications').select('*').order('created_at',{ascending:false}); setList(data||[]); }
  async function save(e){ e.preventDefault(); await supabase.from('publications').insert([{...form}]); setForm({title:'',content:''}); load(); }
  async function del(id){ await supabase.from('publications').delete().eq('id', id); load(); }

  return (
    <div>
      <h3 className="font-semibold mb-2">Publikasi</h3>
      <form onSubmit={save} className="mb-4 p-3 bg-white/5 rounded">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Judul" className="w-full p-2 mb-2 bg-transparent border rounded"/>
        <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Konten" className="w-full p-2 mb-2 bg-transparent border rounded"/>
        <button className="btn-primary px-3 py-2">Simpan</button>
      </form>
      <ul className="space-y-2">
        {list.map(i=>(
          <li key={i.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-xs text-gray-300">{i.author}</div>
            </div>
            <div><button onClick={()=>del(i.id)} className="px-2 py-1 border rounded">Hapus</button></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
