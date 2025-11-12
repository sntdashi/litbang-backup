import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import { motion } from "framer-motion";

export default function LitbangSections() {
  const [publications, setPublications] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPublications();
    fetchGallery();
    // auth state
    supabase.auth.getSession().then(r=> setUser(r.data.session?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return ()=> sub?.data?.subscription?.unsubscribe?.();
  }, []);

  async function fetchPublications(){
    const { data, error } = await supabase.from('publications').select('*').order('created_at', { ascending: false });
    if(error) { console.error(error); setPublications([]); return; }
    setPublications(data || []);
  }

  async function fetchGallery(){
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if(error) { console.error(error); setGallery([]); return; }
    setGallery(data || []);
  }

  async function handleLogin(e){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPass });
    if(error){ alert('Login error: ' + error.message); return; }
    alert('Logged in');
  }

  async function handleLogout(){
    await supabase.auth.signOut();
    alert('Logged out');
  }

  return (
    <>
      <section id="Publikasi" className="pt-20 pb-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white">Publikasi Terbaru</h2>
        <p className="text-gray-300 mt-2">Riset, eksperimen, dan inovasi mahasiswa Teknik Informatika.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {publications.length === 0 && <div className="text-gray-400">Belum ada publikasi.</div>}
          {publications.map(pub => (
            <motion.div key={pub.id} whileHover={{ y: -6 }} className="card-glass p-4 rounded-xl">
              <h3 className="font-semibold text-lg" style={{color:'#ffd7d7'}}>{pub.title}</h3>
              <p className="text-sm text-gray-200 mt-2">{pub.content || pub.excerpt}</p>
              <div className="mt-3 text-xs text-gray-400">{pub.author || pub.authors} • {new Date(pub.created_at || pub.date || pub.created_at).toLocaleDateString()}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="Galeri" className="pt-12 pb-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white">Galeri</h2>
        <p className="text-gray-300 mt-2">Kumpulan foto kegiatan dan dokumentasi riset.</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.length === 0 && <div className="text-gray-400">Belum ada foto.</div>}
          {gallery.map(g => (
            <div key={g.id} className="rounded-xl overflow-hidden shadow-lg bg-white/5">
              <img src={g.image_url || g.url} alt={g.caption || g.title} className="w-full h-36 object-cover" />
              <div className="p-2 text-sm text-gray-200">{g.caption || g.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="Admin" className="pt-12 pb-24 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white">Admin Litbang</h2>
        <p className="text-gray-300 mt-2">Login untuk akses CRUD publikasi dan galeri.</p>

        {user ? (
          <div className="mt-4 p-4 bg-white/5 rounded">
            <div>Signed in as: {user.email}</div>
            <div className="mt-3">
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="mt-4 space-y-3 bg-white/5 p-4 rounded">
            <input value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded bg-transparent border"/>
            <input value={adminPass} onChange={e=>setAdminPass(e.target.value)} type="password" placeholder="Password" className="w-full p-2 rounded bg-transparent border"/>
            <div className="flex gap-2">
              <button className="btn-primary">Login</button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
