// File: src/pages/Login.jsx (Versi Fix)

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Pastiin path ini bener
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// HAPUS 'BackgroundEffect' dari sini, karena udah ada di layout

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  // --- PENTING: Cek Sesi ---
  // Cek kalo admin UDAH login, langsung lempar ke dashboard.
  // Ga perlu login lagi.
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin'); // Langsung redirect ke dashboard admin
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Ini fungsi magic dari Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error; // Lempar error kalo ada
      }

      // Kalo sukses, 'data.session' bakal keisi
      if (data.session) {
        console.log('Login sukses, ngab!');
        // 'session' otomatis kesimpen di browser.
        // Langsung redirect ke halaman admin.
        navigate('/admin'); 
      }

    } catch (error) {
      console.error('Error login:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        setError('Email atau password salah, ngab. Coba lagi.');
      } else {
        setError('Gagal login, ada masalah jaringan kayaknya.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // --- GANTI TOTAL LAYOUT DI SINI ---
    // (Kita copy style dari IdeBank.jsx)
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 pt-32 overflow-hidden pb-[10%]" id="login-page">
      
      {/* Judul (Style-nya kita samain kayak IdeBank.jsx) */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Admin Panel Login
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Masukkan kredensial admin untuk mengelola website.
        </p>
      </div>

      {/* Form Card (Style-nya kita samain kayak IdeBank.jsx) */}
      {/* Kita pake max-w-md biar form login ga terlalu lebar */}
      <div 
        className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-lg"
        data-aos="fade-up" 
        data-aos-duration="1200"
      >
        {/* Langsung Form Login (Form header-nya kita hapus biar rapi) */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Input Email */}
          <div className="relative group" data-aos="fade-up" data-aos-delay="200">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 transition-all duration-300 hover:border-[#8B0000]/30 disabled:opacity-50"
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative group" data-aos="fade-up" data-aos-delay="300">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
            <input
              type="password"
              placeholder="Password Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 transition-all duration-300 hover:border-[#8B0000]/30 disabled:opacity-50"
              required
            />
          </div>

          {/* Alert Error (kalo ada) */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            data-aos="fade-up"
            data-aos-delay="400"
            className="w-full bg-gradient-to-r from-[#8B0000] to-[#FF4444] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#8B0000]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengecek...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;