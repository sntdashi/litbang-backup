import React, {useEffect, useState} from 'react';
import { supabase } from '../../supabase';

export default function UsersAdmin(){
  const [users, setUsers] = useState([]);
  useEffect(()=> load(), []);
  async function load(){ const { data } = await supabase.from('profiles').select('*'); setUsers(data || []); }
  async function makeAdmin(id){ await supabase.from('profiles').update({ role: 'admin' }).eq('id', id); load(); }
  async function revokeAdmin(id){ await supabase.from('profiles').update({ role: 'user' }).eq('id', id); load(); }

  return (
    <div>
      <h3 className="font-semibold mb-2">Users</h3>
      <ul className="space-y-2">
        {users.map(u=>(
          <li key={u.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
            <div>
              <div className="font-medium">{u.full_name || u.id}</div>
              <div className="text-xs text-gray-300">{u.role}</div>
            </div>
            <div>
              {u.role !== 'admin' ? <button onClick={()=>makeAdmin(u.id)} className="px-2 py-1 border rounded">Make Admin</button> : <button onClick={()=>revokeAdmin(u.id)} className="px-2 py-1 border rounded">Revoke</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
