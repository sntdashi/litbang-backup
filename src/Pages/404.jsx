import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Home, ArrowLeft } from 'lucide-react';

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleGoHome = () => {
    navigate('/'); 
  };

  return (
    // 1. Perubahan di sini: HAPUS '-z-20'
    <div className="relative min-h-screen bg-[#1A0000] flex items-center justify-center px-4">
      <BackgroundEffect />
      
      {/* 2. Perubahan di sini: TAMBAH 'relative z-10' biar nongol di DEPAN */}
      <div className="text-center relative z-10">
        
        {/* 404 Number (Warna diubah) */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-400 mb-4 animate-bounce">
            404
          </h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Message (Warna diubah) */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada seperti perasaan dia padamu.
          </p>
        </div>

        {/* Illustration (BG diubah) */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
            <div className="text-6xl animate-pulse">🔍</div>
          </div>
        </div>

        {/* Action Buttons (Style diubah total) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors duration-200 shadow-lg hover:shadow-indigo-500/10"
          >
            <ArrowLeft size={20} />
            Kembali
          </button> 
          
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <Home size={20} />
            Beranda
          </button>
        </div> 

      </div>
    </div>
  );
}