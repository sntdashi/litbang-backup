import { useEffect } from "react";
// Perubahan: Hapus Linkedin/Github, tambah Globe/Mail
import TikTokIcon from './icons/TikTokIcon';
import {
  Mail,
  Instagram,
  Youtube,
  ExternalLink,
  Globe,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// --- PERUBAHAN BESAR DI SINI ---

// Ini ikon TikTok custom dari file asli lu, kita pake lagi


const socialLinks = [
  {
    name: "Website",
    displayName: "Website Resmi",
    subText: "Kunjungi web utama HIMATIF",
    icon: Globe,
    url: "https://himatif.id", // Ganti ke link yg bener
    color: "#8B0000",
    gradient: "from-[#8B0000] to-[#FF4444]",
    isPrimary: true,
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@himatif_official", // Ganti ke username yg bener
    icon: Instagram,
    url: "https://www.instagram.com/himatif_placeholder", // Ganti ke link yg bener
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
  },
  {
    name: "YouTube",
    displayName: "Youtube",
    subText: "Kanal HIMATIF",
    icon: Youtube,
    url: "https://www.youtube.com/himatif_placeholder", // Ganti ke link yg bener
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
  },
  {
    name: "TikTok",
    displayName: "Tiktok",
    subText: "@himatif_tiktok", // Ganti ke username yg bener
    icon: TikTokIcon, // Pake ikon SVG lu
    url: "https://tiktok.com/@himatif_placeholder", // Ganti ke link yg bener
    color: "black",
    gradient: "from-[#000000] via-[#25F4EE] to-[#FE2C55]",
  },
  {
    name: "Email",
    displayName: "Email",
    subText: "litbang@himatif.id", // Ganti ke email yg bener
    icon: Mail,
    url: "mailto:litbang@himatif.id", // Ganti ke email yg bener
    color: "#4B5563",
    gradient: "from-[#4B5563] to-[#1F2937]",
  },
];

const SocialLinks = () => {
  const primaryLink = socialLinks.find((link) => link.isPrimary);
  const otherLinks = socialLinks.filter((link) => !link.isPrimary);
  
  // Perubahan: Kita bagi 4 link jadi 2 baris
  const [instagram, youtube, tiktok, email] = otherLinks;

  useEffect(() => {
    AOS.init({
      offset: 10,
    });
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3
        className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
        data-aos="fade-down" 
      >
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        {/* Diubah: Me -> Us */}
        Connect With Us
      </h3>

      <div className="flex flex-col gap-4">
        {/* Primary Row (Website) */}
        <a
          href={primaryLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-lg 
                     bg-white/5 border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="100" 
        >
          {/* Style: TIDAK DIUBAH (AMAN) */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                       bg-gradient-to-r ${primaryLink.gradient}`}
          />
          <div className="relative flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                               group-hover:scale-110 group-hover:opacity-30"
                style={{ backgroundColor: primaryLink.color }}
              />
              <div className="relative p-2 rounded-md">
                <primaryLink.icon
                  className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                  style={{ color: primaryLink.color }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold pt-[0.2rem] text-gray-200 tracking-tight leading-none group-hover:text-white transition-colors duration-300">
                {primaryLink.displayName}
              </span>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {primaryLink.subText}
              </span>
            </div>
          </div>
          <ExternalLink
            className="relative w-5 h-5 text-gray-500 group-hover:text-white
                       opacity-0 group-hover:opacity-100 transition-all duration-300
                       transform group-hover:translate-x-0 -translate-x-1"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            />
          </div>
        </a>

        {/* Second Row - Instagram & YouTube */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[instagram, youtube].map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                               bg-white/5 border border-white/10 overflow-hidden
                               hover:border-white/20 transition-all duration-500"
              data-aos="fade-up" 
              data-aos-delay={200 + index * 100} 
            >
              {/* Style: TIDAK DIUBAH (AMAN) */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                     bg-gradient-to-r ${link.gradient}`}
              />
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                                       group-hover:scale-125 group-hover:opacity-30"
                  style={{ backgroundColor: link.color }}
                />
                <div className="relative p-2 rounded-lg">
                  <link.icon
                    className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                    // Kalo TikTok, jangan set style color (biar SVG-nya yg kerja)
                    style={link.name === 'TikTok' ? {} : { color: link.color }}
                  />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>
              <ExternalLink
                className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                       opacity-0 group-hover:opacity-100 transition-all duration-300
                                       transform group-hover:translate-x-0 -translate-x-2"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Third Row - TikTok & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[tiktok, email].map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                               bg-white/5 border border-white/10 overflow-hidden
                               hover:border-white/20 transition-all duration-500"
              data-aos="fade-up" 
              data-aos-delay={400 + index * 100}
            >
              {/* Style: TIDAK DIUBAH (AMAN) */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                     bg-gradient-to-r ${link.gradient}`}
              />
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                                       group-hover:scale-125 group-hover:opacity-30"
                  style={{ backgroundColor: link.color }}
                />
                <div className="relative p-2 rounded-lg">
                  <link.icon
                    className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                    // Kalo TikTok, jangan set style color (biar SVG-nya yg kerja)
                    style={link.name === 'TikTok' ? {} : {}}
                  />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>
              <ExternalLink
                className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                                       opacity-0 group-hover:opacity-100 transition-all duration-300
                                       transform group-hover:translate-x-0 -translate-x-2"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;