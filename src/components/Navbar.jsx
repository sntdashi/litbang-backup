// File: src/components/Navbar.jsx (Versi Final Pake HashLink)

import React, { useState, useEffect } from "react";
import { Menu, X, Send } from "lucide-react"; // <-- Tambah ikon Send
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; // <-- 1. IMPORT JURUS BARU

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const location = useLocation();
    
    const isHomePage = location.pathname === '/';

    // --- 2. HAPUS 'Kotak Ide' dari sini ---
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "Tentang" },
        { href: "#proker", label: "Program Kerja" },
        { href: "#Contact", label: "Kontak" },
    ];
    // --- AKHIR PERUBAHAN ---

    // (useEffect buat activeSection di /aspirasi udah aman)
    useEffect(() => {
      if (location.pathname === '/aspirasi') {
        setActiveSection('Kotak Ide');
      }
    }, [location.pathname]);

    // (useEffect buat deteksi scroll udah aman)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            if (location.pathname !== '/') {
              if (location.pathname === '/aspirasi') {
                setActiveSection('Kotak Ide');
              } else {
                setActiveSection('');
              }
              return;
            }

            const sections = navItems.filter(item => item.href).map(item => { 
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        label: item.label,
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            if (currentPosition < 400) {
                 setActiveSection("Home");
                 return;
            }
            
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.label);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname, navItems]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    // --- 3. FUNGSI 'scrollToSection' UDAH GA DIPAKE! ---
    // (Boleh dihapus, 'HashLink' udah auto-scroll)
    // const scrollToSection = (e, href) => { ... };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[#1A0000]" 
                    : scrolled
                    ? "bg-[#1A0000]/50 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo (Aman) */}
                    <div className="flex-shrink-0">
                        {isHomePage ? (
                          <a
                            href="#Home" // Kalo di homepage, biarin pake <a>
                            onClick={(e) => {
                              e.preventDefault();
                              const section = document.querySelector("#Home");
                              if (section) window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-xl font-bold bg-gradient-to-r from-[#FF4444] to-[#8B0000] bg-clip-text text-transparent"
                          >
                            Litbang
                          </a>
                        ) : (
                          <Link
                            to="/"
                            className="text-xl font-bold bg-gradient-to-r from-[#FF4444] to-[#8B0000] bg-clip-text text-transparent"
                          >
                            Litbang
                          </Link>
                        )}
                    </div>
        
                    {/* --- 4. PERUBAHAN DESKTOP NAV --- */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-6"> {/* <-- Ubah space-x-8 jadi 6 */}
                            
                            {/* Render 4 link utama pake HashLink */}
                            {navItems.map((item) => {
                              const isActive = activeSection === item.label;
                              return (
                                <HashLink
                                  key={item.label}
                                  smooth // <-- Ini magic-nya
                                  to={`/${item.href}`} // <-- Ini magic-nya
                                  onClick={() => setIsOpen(false)}
                                  className="group relative px-1 py-2 text-sm font-medium"
                                >
                                  <span
                                    className={`relative z-10 transition-colors duration-300 ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#8B0000] to-[#FF4444] bg-clip-text text-transparent font-semibold"
                                            : "text-[#e2d3fd] group-hover:text-white"
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  <span
                                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#8B0000] to-[#FF4444] transform origin-left transition-transform duration-300 ${
                                        isActive
                                            ? "scale-x-100"
                                            : "scale-x-0 group-hover:scale-x-100"
                                    }`}
                                  />
                                </HashLink>
                              );
                            })}
                            
                            {/* Render Tombol "Kotak Ide" (pake <Link> biasa) */}
                            <Link
                                to="/aspirasi"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg
                                  ${activeSection === 'Kotak Ide' 
                                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-500/20' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                  }`}
                              >
                                <Send className="w-4 h-4" />
                                Kotak Ide
                            </Link>
                        </div>
                    </div>
                    {/* --- AKHIR PERUBAHAN --- */}
        
                    {/* Mobile Menu Button (Aman) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-[#e2d3fd] hover:text-white ... ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* --- 5. PERUBAHAN MOBILE MENU --- */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => {
                      const isActive = activeSection === item.label;
                      const style = {
                        transitionDelay: `${index * 100}ms`,
                        transform: isOpen ? "translateX(0)" : "translateX(50px)", 
                        opacity: isOpen ? 1 : 0,
                      };
                      
                      return (
                          <HashLink
                            key={item.label}
                            smooth
                            to={`/${item.href}`}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                isActive
                                    ? "bg-gradient-to-r from-[#8B0000] to-[#FF4444] bg-clip-text text-transparent font-semibold"
                                    : "text-[#e2d3fd] hover:text-white"
                            }`}
                            style={style}
                          >
                            {item.label}
                          </HashLink>
                        );
                    })}
                    
                    {/* Tambah Tombol "Kotak Ide" di Mobile */}
                    <Link
                      to="/aspirasi"
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                          activeSection === 'Kotak Ide'
                              ? "bg-gradient-to-r from-[#8B0000] to-[#FF4444] bg-clip-text text-transparent font-semibold"
                              : "text-[#e2d3fd] hover:text-white"
                      }`}
                      style={{
                        transitionDelay: `${navItems.length * 100}ms`,
                        transform: isOpen ? "translateX(0)" : "translateX(50px)", 
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      Kotak Ide
                    </Link>
                </div>
            </div>
            {/* --- AKHIR PERUBAHAN --- */}
        </nav>
    );
};

export default Navbar;