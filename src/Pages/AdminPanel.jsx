import React, { useState } from 'react';
import { supabase } from '../supabase';
import AuthAdmin from '../components/AuthAdmin';
import PublikasiAdmin from './admin/PublikasiAdmin';
import GaleriAdmin from './admin/GaleriAdmin';
import UsersAdmin from './admin/UsersAdmin';

function AdminShell(){
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        <aside className="w-64 p-4 bg-white/5 rounded-lg">
          <h3 className="font-bold text-lg">Admin Panel</h3>
          <nav className="mt-4 space-y-2">
            <button onClick={()=>setTab('dashboard')} className="block w-full text-left">Dashboard</button>
            <button onClick={()=>setTab('publikasi')} className="block w-full text-left">Publikasi</button>
            <button onClick={()=>setTab('galeri')} className="block w-full text-left">Galeri</button>
            <button onClick={()=>setTab('users')} className="block w-full text-left">Users</button>
            <button onClick={async ()=>{await supabase.auth.signOut(); window.location='/';}} className="block w-full text-left mt-4">Logout</button>
          </nav>
        </aside>

        <main className="flex-1">
          {tab === 'dashboard' && <div>Welcome, Admin — overview here</div>}
          {tab === 'publikasi' && <PublikasiAdmin/>}
          {tab === 'galeri' && <GaleriAdmin/>}
          {tab === 'users' && <UsersAdmin/>}
        </main>
      </div>
    </div>
  )
}

export default function AdminPanel(){
  return (
    <AuthAdmin>
      <AdminShell/>
    </AuthAdmin>
  )
}
