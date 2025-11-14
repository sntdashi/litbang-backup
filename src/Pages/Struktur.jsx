// File: src/pages/Struktur.jsx

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Struktur = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    // Ini 'ruangan'-nya, ID-nya harus 'struktur'
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="struktur">
      
      {/* Judul (Style-nya kita samain kayak Portofolio.jsx) */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Struktur Organisasi
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Struktur kepengurusan Departemen Litbang HIMATIF.
        </p>
      </div>

      {/* Gambar Strukturnya */}
      <div 
        className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-lg"
        data-aos="fade-up" 
        data-aos-duration="1200"
      >
        <img
          // WAJIB: Ganti nama file ini kalo beda
          src="/images/struktur-org.png" 
          alt="Struktur Organisasi Litbang"
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default Struktur;