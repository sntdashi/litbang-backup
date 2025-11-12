import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleEmail(e){
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if(error){ alert(error.message); return; }
    navigate('/admin');
  }

  async function handleGoogle(){
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <div className="pt-28 pb-12 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full p-6 bg-white/5 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3" style={{color:'#5b2a86'}}>Admin Login</h2>
        <form onSubmit={handleEmail} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded bg-transparent border"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded bg-transparent border"/>
          <button className="btn-primary w-full py-2">{loading ? 'Loading...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={handleGoogle} className="px-3 py-2 border rounded">Login dengan Google</button>
        </div>
      </div>
    </div>
  );
}
