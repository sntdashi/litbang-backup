import React, { useState, useEffect, useCallback, memo } from "react"
// Perubahan: Ganti Linkedin dengan Mail di import (kalo belom)
import { Github, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import TikTokIcon from '../components/icons/TikTokIcon';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// --- Memoized Components ---

// StatusBadge Component (Sudah diubah)
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      {/* Style: TIDAK DIUBAH (AMAN) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B0000] to-[#FF4444] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#8B0000] to-[#FF4444] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          {/* Diubah: Teks badge */}
          Kreatif & Inovatif
        </span>
      </div>
    </div>
  </div>
));

// MainTitle Component (Sudah diubah)
const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight">
      <span className="relative inline-block">
        {/* Style: TIDAK DIUBAH (AMAN) */}
        <span className="absolute -inset-2 bg-gradient-to-r from-[#8B0000] to-[#FF4444] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          {/* Diubah: Teks Judul Baris 1 */}
          Departemen
        </span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          {/* Diubah: Teks Judul Baris 1 */}
          Riset
        </span>
      </span>
      <br className="hidden sm:block" />
      <span className="relative inline-block mt-2">
        {/* Style: TIDAK DIUBAH (AMAN) */}
        <span className="absolute -inset-2 bg-gradient-to-r from-[#8B0000] to-[#FF4444] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#8B0000] to-[#FF4444] bg-clip-text text-transparent">
          {/* Diubah: Teks Judul Baris 2 */}
          & Pengembangan
        </span>
      </span>
    </h1>
  </div>
));

// TechStack Component (TIDAK DIUBAH)
// Komponennya tetap, isinya diubah lewat constant di bawah
const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

// CTAButton Component (TIDAK DIUBAH)
// Komponennya tetap, isinya diubah saat dipanggil di render()
const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      {/* Style: TIDAK DIUBAH (AMAN) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7A0000] to-[#6A0000] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#1A0000] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#7A0000]/20 to-[#6A0000]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

// SocialLink Component (TIDAK DIUBAH)
// Komponennya tetap, isinya diubah lewat constant di bawah
const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      {/* Style: TIDAK DIUBAH (AMAN) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] to-[#FF4444] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// --- Constants (Sudah diubah) ---
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

// Diubah: Teks typing
const WORDS = ["Inovasi & Teknologi", "Riset & Pengembangan"]; 

// Diubah: Tech stack Litbang
const TECH_STACK = ["Web Dev", "Mobile Dev", "Riset AI", "UI/UX"]; 

// Diubah: Social links (ganti pake placeholder himatif)
const SOCIAL_LINKS = [
  { icon: TikTokIcon, link: "https://tiktok.com/himatif-placeholder" }, // Ganti link ini
  { icon: Instagram, link: "https://www.instagram.com/himatif_placeholder" }, // Ganti link ini
  { icon: Mail, link: "mailto:litbang@himatif.id" } // Ganti email ini
];

// --- Home Component (Logic Inti) ---
const Home = () => {
  // Semua state & logic: TIDAK DIUBAH (AMAN)
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // AOS init: TIDAK DIUBAH (AMAN)
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
       
      });
    };
    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Typing effect logic: TIDAK DIUBAH (AMAN)
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Lottie config: TIDAK DIUBAH (AMAN)
  const lottieOptions = {
    src: "https://lottie.host/0c37adb3-8d18-4127-855f-645807341484/EGI0d9iGV3.lottie",
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 lottie-color-fix ${ // <-- TAMBAHIN DI SINI
      isHovering 
        ? "scale-[180%] sm:scale-[160%] md:scale-[150%] lg:scale-[145%] rotate-2" 
        : "scale-[175%] sm:scale-[155%] md:scale-[145%] lg:scale-[140%]"
    }`
  };

  // --- Render JSX (Konten sudah diubah) ---
  return (
    <div className="min-h-screen bg-[#1A0000] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] " id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto  min-h-screen ">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect (logic sama, data dari constant baru) */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#8B0000] to-[#FF4444] ml-1 animate-blink"></span>
                </div>

                {/* Description (Diubah) */}
                <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  {/* Diubah: Teks deskripsi personal -> organisasi */}
                  Kami berfokus pada riset, pengembangan proyek, dan workshop untuk memajukan inovasi teknologi di HIMATIF.
                </p>

                {/* Tech Stack (data dari constant baru) */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons (Diubah) */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  {/* Diubah: Teks "Projects" -> "Program Kerja" dan href -> "#proker" */}
                  <CTAButton href="#proker" text="Program Kerja" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links (data dari constant baru) */}
                <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Lottie Animation (TIDAK DIUBAH) */}
            <div className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full opacity-90">
                {/* Style: TIDAK DIUBAH (AMAN) */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[#8B0000]/10 to-[#FF4444]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                  isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                }`}>
                </div>

                {/* Style: TIDAK DIUBAH (AMAN) */}
                <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${
                  isHovering ? "scale-105" : "scale-100"
                }`}>
                  <DotLottieReact {...lottieOptions} />
                </div>

                {/* Style: TIDAK DIUBAH (AMAN) */}
                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                  isHovering ? "opacity-50" : "opacity-20"
                }`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                    isHovering ? "scale-110" : "scale-100"
                  }`}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);