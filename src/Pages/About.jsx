import React, { useEffect, memo, useMemo, useState } from "react"
// Perubahan: Import icon baru (FlaskConical, Users, Brain) dan hapus yg lama (Award, Globe)
import { FileText, Code, Sparkles, ArrowUpRight, FlaskConical, Users, Brain } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
// WAJIB: Import Supabase client lu
import { supabase } from "../supabaseClient" 

// --- Header Component (Sudah diubah) ---
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        {/* Diubah: About Me -> Tentang Litbang */}
        Tentang Litbang
      </h2>
    </div>
    <p 
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      {/* Diubah: Teks personal -> Motto Litbang */}
      Inovasi, Riset, dan Pengembangan Teknologi
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

// --- ProfileImage Component (Sudah diubah) ---
const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Animasi & Style: TIDAK DIUBAH (AMAN) */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            // Diubah: src foto pribadi -> src logo/tim
            // WAJIB: Taruh gambar lu di public/images/logo-litbang.png
            src="/images/logo-litbang.png"
            // Diubah: alt
            alt="Logo Litbang HIMATIF"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Animasi & Style: TIDAK DIUBAH (AMAN) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

// --- StatCard Component (TIDAK DIUBAH) ---
// Komponen ini udah bagus, gaperlu diubah, 
// datanya kita ubah dari parent-nya.
const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span 
          className="text-4xl font-bold text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {/* Nilai (value) akan diisi dari state Supabase */}
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-gray-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

// --- AboutPage Component (Perubahan Besar di Logic) ---
const AboutPage = () => {
  // Diubah: Menggunakan useState untuk data dinamis dari Supabase
  const [prokerCount, setProkerCount] = useState(0);
  const [workshopCount, setWorkshopCount] = useState(0);
  const [anggotaCount, setAnggotaCount] = useState(0);

  // Fungsi untuk fetch data count dari Supabase
  useEffect(() => {
    const fetchStats = async () => {
      // 1. Hitung jumlah Program Kerja (dari tabel 'proker')
      const { count: prokerData, error: prokerError } = await supabase
        .from('proker') // GANTI 'proker' kalo nama tabel lu beda
        .select('*', { count: 'exact', head: true });
      if (!prokerError) setProkerCount(prokerData);

      // 2. Hitung jumlah Workshop (dari tabel 'workshop')
      const { count: workshopData, error: workshopError } = await supabase
        .from('workshop') // GANTI 'workshop' kalo nama tabel lu beda
        .select('*', { count: 'exact', head: true });
      if (!workshopError) setWorkshopCount(workshopData);

      // 3. Hitung jumlah Anggota (dari tabel 'anggota')
      const { count: anggotaData, error: anggotaError } = await supabase
        .from('anggota') // GANTI 'anggota' kalo nama tabel lu beda
        .select('*', { count: 'exact', head: true });
      if (!anggotaError) setAnggotaCount(anggotaData);
    };

    fetchStats();
  }, []); // [] = Jalankan sekali pas komponen dimuat

  // Optimized AOS initialization (TIDAK DIUBAH)
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false, 
      });
    };
    initAOS();
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Diubah: statsData sekarang pake data dari state (Supabase)
  const statsData = useMemo(() => [
    {
      icon: Code, // Icon tetap
      color: "from-[#6366f1] to-[#a855f7]",
      value: prokerCount, // Data dari state
      label: "Total Program Kerja", // Teks diubah
      description: "Solusi inovatif untuk Himpunan", // Teks diubah
      animation: "fade-right",
    },
    {
      icon: FlaskConical, // Icon diubah
      color: "from-[#a855f7] to-[#6366f1]",
      value: workshopCount, // Data dari state
      label: "Riset & Workshop", // Teks diubah
      description: "Mengembangkan wawasan & skill", // Teks diubah
      animation: "fade-up",
    },
    {
      icon: Users, // Icon diubah
      color: "from-[#6366f1] to-[#a855f7]",
      value: anggotaCount, // Data dari state
      label: "Total Anggota Aktif", // Teks diubah
      description: "Tim solid penuh talenta", // Teks diubah
      animation: "fade-left",
    },
  ], [prokerCount, workshopCount, anggotaCount]); // Dependency diubah ke state

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* --- Teks Judul (Diubah) --- */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                {/* Diubah: Teks personal */}
                Selamat Datang di
              </span>
              <span 
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                {/* Diubah: Teks personal */}
                Departemen Litbang
              </span>
            </h2>
            
            {/* --- Teks Paragraf (Diubah) --- */}
            <p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
             {/* Diubah: Teks personal -> Deskripsi Litbang */}
             Departemen Penelitian dan Pengembangan (Litbang) adalah jantung inovasi di HIMATIF. Kami berfokus pada riset teknologi, pengembangan proyek internal, dan menyelenggarakan workshop untuk meningkatkan skill anggota. Misi kami adalah menciptakan ekosistem teknologi yang kreatif dan solutif.
            </p>

            {/* --- Quote Section (Diubah) --- */}
            <div 
              className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-gradient-to-r border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              {/* Style: TIDAK DIUBAH (AMAN) */}
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg"></div>
              <div className="absolute top-3 left-4 text-[#6366f1] opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                {/* Diubah: Quote personal -> Motto Litbang */}
                "Think, Create, Innovate."
              </blockquote>
            </div>

            {/* --- Tombol/CTA (Diubah) --- */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              {/* Diubah: Tombol CV -> Struktur Organisasi */}
              <a href="#struktur" className="w-full lg:w-auto"> 
                <button 
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl "
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Struktur Organisasi
                </button>
              </a>
              {/* Diubah: Tombol Projects -> Program Kerja */}
              <a href="#proker" className="w-full lg:w-auto"> 
                <button 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10 "
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> Lihat Program Kerja
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        {/* --- StatCards Section (Diubah) --- */}
        {/* Diubah: href link ke #proker */}
        <a href="#proker">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      {/* Style: TIDAK DIUBAH (AMAN) */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);