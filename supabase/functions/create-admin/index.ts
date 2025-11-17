// File: supabase/functions/create-admin/index.ts (Versi Upgrade + Nama)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Fungsi 'create-admin' di-load");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Ambil 'adminName' dari body
    const { email, password, adminName } = await req.json()

    // (Cek Keamanan... Aman, ga diubah)
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user: callerUser }, error: callerError } = await supabaseClient.auth.getUser()
    if (callerError) throw callerError
    const { data: callerProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', callerUser.id)
      .single()
    if (profileError) throw profileError
    if (callerProfile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Akses ditolak, lu bukan admin ngab' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // (Bikin Admin Client... Aman, ga diubah)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' 
    )

    // (Bikin user baru... Aman, ga diubah)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    })
    if (createError) throw createError

    // 2. UPDATE role + 'full_name' pake 'adminName' dari form
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin', full_name: adminName }) // <-- PAKE NAMA BARU
      .eq('id', newUser.user.id) 

    if (updateError) throw updateError

    // (Response... Aman, ga diubah)
    return new Response(JSON.stringify({ message: `Admin baru ${adminName} berhasil dibuat!` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})