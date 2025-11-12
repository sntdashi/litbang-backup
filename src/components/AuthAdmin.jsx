import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Navigate } from 'react-router-dom';

export default function AuthAdmin({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const sess = await supabase.auth.getSession();
      const uid = sess?.data?.session?.user?.id;
      if (!uid) {
        if(mounted){ setLoading(false); setIsAdmin(false); }
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single();

      if(mounted){
        setIsAdmin(!error && data?.role === 'admin');
        setLoading(false);
      }
    }
    check();
    const sub = supabase.auth.onAuthStateChange(() => check());
    return () => { mounted = false; sub?.data?.subscription?.unsubscribe?.(); };
  }, []);

  if (loading) return <div className="pt-28 p-4">Checking admin...</div>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}
