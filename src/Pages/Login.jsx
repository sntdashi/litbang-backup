import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Pastiin path ini bener
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Ini komponen 'BackgroundEffect' dari WelcomeScreen.jsx lu
// Kita pake lagi di sini biar stylenya konsisten!
const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030014] text-white px-4">
      <BackgroundEffect />
      
      <div 
        className="relative w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-[#6366f1]/10"
        data-aos="fade-up"
      >
        {/* Header Form */}
        <div className="text-center mb-8" data-aos="fade-down" data-aos-delay="100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">
            Admin Panel Login
          </h1>
          <p className="text-gray-400 mt-2">Litbang HIMATIF</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Input Email */}
          <div className="relative group" data-aos="fade-up" data-aos-delay="200">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
            <input
              type="email"
              placeholder="Email Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative group" data-aos="fade-up" data-aos-delay="300">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
            <input
              type="password"
              placeholder="Password Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
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
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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