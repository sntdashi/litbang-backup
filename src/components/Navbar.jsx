import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "Tentang" },
        { href: "#Publikasi", label: "Publikasi" },
        { href: "#Galeri", label: "Galeri" },
        { href: "#Contact", label: "Kontak" },
        { href: "#Admin", label: "Admin" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);

            // update active section based on scroll position
            const sections = ["Home", "About", "Publikasi", "Galeri", "Contact", "Admin"];
            let current = "Home";
            sections.forEach(sec => {
                const el = document.getElementById(sec);
                if (el) {
                    const top = el.getBoundingClientRect().top;
                    if (top <= 120) current = sec;
                }
            });
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-40 bg-white/6 backdrop-blur-md border-b border-white/6 ${scrolled ? "shadow-md" : ""}`}>
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="#Home" className="text-xl font-bold" style={{color:'#6b0f1a'}}>DEPT LITBANG</a>
                <div className="hidden md:flex gap-6 items-center text-sm">
                    {navItems.map(item => (
                        <a key={item.href} href={item.href} className={`hover:text-purple-600 ${activeSection === item.label || activeSection === (item.label==='Tentang'?'About':item.label) ? "font-semibold" : ""}`}>
                            {item.label}
                        </a>
                    ))}
                </div>
                <button className="md:hidden px-2 py-1" onClick={()=>setIsOpen(!isOpen)}>{isOpen ? <X/> : <Menu/>}</button>
            </div>
            {isOpen && (
                <div className="md:hidden px-4 pb-4 bg-white/5">
                    {navItems.map(item => (
                        <a key={item.href} href={item.href} className="block py-2">{item.label}</a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
