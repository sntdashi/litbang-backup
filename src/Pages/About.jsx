// File: src/pages/About.jsx (Versi FIX FINAL LENGKAP)

import React, { useEffect, memo, useMemo, useState } from "react"
import { FileText, Code, Sparkles, ArrowUpRight, FlaskConical, Users, Brain } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabaseClient" 

// --- Header Component (INI KODE LENGKAPNYA) ---
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        Tentang Litbang
      </h2>
    </div>
    <p 
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-red-400" />
      Inovasi, Riset, dan Pengembangan Teknologi
      <Sparkles className="w-5 h-5 text-red-400" />
    </p>
  </div>
));

// --- ProfileImage Component (INI KODE LENGKAPNYA) ---
const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-red-500 via-red-500 to-red-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-red-500 to-red-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(139,0,0,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-transparent to-red-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            src="/images/logo-litbang.png"
            alt="Logo Litbang HIMATIF"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

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

// --- StatCard Component (INI KODE LENGKAPNYA) ---
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


// --- AboutPage Component ---
// --- Perubahan: Terima props 'setActiveTab' ---
const AboutPage = ({ setActiveTab }) => { 
  const [prokerCount, setProkerCount] = useState(0);
  const [workshopCount, setWorkshopCount] = useState(0);
  const [anggotaCount, setAnggotaCount] = useState(0);

  // Fetch data (Aman)
  useEffect(() => {
    const fetchStats = async () => {
      const { count: prokerData, error: prokerError } = await supabase
        .from('proker') 
        .select('*', { count: 'exact', head: true });
      if (!prokerError) setProkerCount(prokerData);

      const { count: workshopData, error: workshopError } = await supabase
        .from('workshop') 
        .select('*', { count: 'exact', head: true });
      if (!workshopError) setWorkshopCount(workshopData);

      const { count: anggotaData, error: anggotaError } = await supabase
        .from('anggota') 
        .select('*', { count: 'exact', head: true });
      if (!anggotaError) setAnggotaCount(anggotaData);
    };
    fetchStats();
  }, []); 

  // AOS init (Aman)
  useEffect(() => {
    const initAOS = () => { AOS.init({ once: false, }); };
    initAOS();
    let resizeTimer;
    const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(initAOS, 250); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(resizeTimer); };
  }, []);

  // --- Perubahan: Tambah 'href' & 'tabIndex' di tiap data ---
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#8B0000] to-[#FF4444]",
      value: prokerCount,
      label: "Total Program Kerja",
      description: "Solusi inovatif untuk Himpunan",
      animation: "fade-right",
      href: "#proker",
      tabIndex: 0 // <-- Tab ke-0 (Proker)
    },
    {
      icon: FlaskConical,
      color: "from-[#FF4444] to-[#8B0000]",
      value: workshopCount,
      label: "Riset & Workshop",
      description: "Mengembangkan wawasan & skill",
      animation: "fade-up",
      href: "#proker",
      tabIndex: 1 // <-- Tab ke-1 (Workshop)
    },
    {
      icon: Users,
      color: "from-[#8B0000] to-[#FF4444]",
      value: anggotaCount,
      label: "Total Anggota Aktif",
      description: "Tim solid penuh talenta",
      animation: "fade-left",
      href: "#proker", // <-- Link tetep ke #proker
      tabIndex: 2 // <-- Tab ke-2 (Anggota)
    },
  ], [prokerCount, workshopCount, anggotaCount]);
  // --- Akhir Perubahan ---

  // --- Fungsi Baru: Buat handle klik StatCard ---
  const handleStatCardClick = (e, stat) => {
    e.preventDefault(); // Stop link <a> biasa
    
    // 1. Ganti Tab Aktif
    setActiveTab(stat.tabIndex);

    // 2. Scroll ke #proker
    const section = document.querySelector(stat.href);
    if (section) {
        const top = section.offsetTop - 100; // Offset (biar ga mentok)
        window.scrollTo({
            top: top,
            behavior: "smooth"
        });
    }
  };
  // --- Akhir Fungsi Baru ---


  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* Judul, Paragraf, Quote - Aman */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
                Selamat Datang di
              </span>
              <span 
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Departemen Litbang
              </span>
            </h2>
            
            <p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
             Departemen Penelitian dan Pengembangan (Litbang) adalah jantung inovasi di HIMATIF. Kami berfokus pada riset teknologi, pengembangan proyek internal, dan menyelenggarakan workshop untuk meningkatkan skill anggota. Misi kami adalah menciptakan ekosistem teknologi yang kreatif dan solutif.
            </p>

            <div 
              className="relative bg-gradient-to-br from-[#8B0000]/5 via-transparent to-[#FF4444]/5 border border-gradient-to-r border-[#8B0000]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#8B0000]/20 to-[#FF4444]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#FF4444]/20 to-[#8B0000]/20 rounded-full blur-lg"></div>
              <div className="absolute top-3 left-4 text-[#8B0000] opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                "Think, Create, Innovate."
              </blockquote>
            </div>

            {/* Tombol CTA (href #struktur udah bener) */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a href="#struktur" className="w-full lg:w-auto"> 
                <button 
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#FF4444] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl "
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Struktur Organisasi
                </button>
              </a>
              <a href="#proker" className="w-full lg:w-auto"> 
                <button 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#FF4444]/50 text-[#FF4444] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#FF4444]/10 "
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> Lihat Program Kerja
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        {/* --- PERUBAHAN DI SINI: Ganti <a> jadi <button> onClick --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
          {statsData.map((stat) => (
            // Ganti <a> jadi <div onClick... > biar bisa nge-set tab
            <div key={stat.label} onClick={(e) => handleStatCardClick(e, stat)}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>
        {/* --- AKHIR PERUBAHAN --- */}
      </div>

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