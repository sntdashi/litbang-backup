import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navItems = [
        { to: "/", label: "Home" },
        { to: "/#About", label: "Tentang" },
        { to: "/publikasi", label: "Publikasi" },
        { to: "/galeri", label: "Galeri" },
        { to: "/kontak", label: "Kontak" },
        { to: "/admin", label: "Admin" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-40 bg-white/6 backdrop-blur-md border-b border-white/6 ${scrolled ? "shadow-md" : ""}`}>
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold" style={{color:'#6b0f1a'}}>DEPT LITBANG</Link>
                <div className="hidden md:flex gap-6 items-center text-sm">
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to} className="hover:text-purple-600">
                            {item.label}
                        </Link>
                    ))}
                </div>
                <button className="md:hidden px-2 py-1" onClick={()=>setIsOpen(!isOpen)}>{isOpen ? <X/> : <Menu/>}</button>
            </div>
            {isOpen && (
                <div className="md:hidden px-4 pb-4 bg-white/5">
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to} className="block py-2" onClick={()=>setIsOpen(false)}>{item.label}</Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
