// File: src/App.jsx (Versi Rute /galeri)

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import "./index.css";

// --- Halaman Publik ---
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import NotFoundPage from "./Pages/404"; 
import Struktur from "./Pages/Struktur";
import IdeBank from "./Pages/IdeBank";
import GaleriPage from "./Pages/Galery"; // <-- 1. IMPORT HALAMAN BARU

// --- Halaman Admin (Aman) ---
import LoginPage from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";

import { AnimatePresence } from 'framer-motion';

// --- (1) Layout Halaman Utama (Aman) ---
const LandingPage = ({ showWelcome, setShowWelcome, activeTab, setActiveTab }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About setActiveTab={setActiveTab} />
          <Portofolio activeTab={activeTab} setActiveTab={setActiveTab} /> 
          <Struktur />
          <ContactPage />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "} 
                <a href="https://himatif.id" className="hover:underline"> 
                  Litbang HIMATIF
                </a>
                . All Rights Reserved.
              </span>
            </center>
          </footer>
        </>
      )}
    </>
  );
};

// --- (2) Layout Halaman Detail Project (Aman) ---
const ProjectPageLayout = () => (
  <>
    <Navbar /> 
    <ProjectDetails />
    <footer>
      <center>
        {/* ... footer ... */}
      </center>
    </footer>
  </>
);

// --- 3. BIKIN LAYOUT BARU BUAT HALAMAN BIASA ---
const StandardPageLayout = ({ children }) => (
  // 1. Tambah 'flex flex-col min-h-screen' di pembungkus utama
  <div className="relative z-10 flex flex-col min-h-screen"> 
    <Navbar />
    <AnimatedBackground />
    
    {/* 2. Tambah 'flex-grow' di sini biar kontennya "ngedorong" footer */}
    <div className="flex-grow">
      {children} 
    </div>

    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a href="https://himatif.id" className="hover:underline">
            Litbang HIMATIF
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </div>
);


// --- (4) KOMPONEN UTAMA APP (ROUTER) ---
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState(0); 

  return (
    <BrowserRouter> 
      <Routes>
        {/* === RUTE HALAMAN PUBLIK === */}
        <Route path="/" element={<LandingPage 
            showWelcome={showWelcome} 
            setShowWelcome={setShowWelcome} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />} 
        />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
         
        {/* === RUTE ADMIN (Aman) === */}
        <Route path="/login" element={ <StandardPageLayout><LoginPage /></StandardPageLayout> } />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Rute Aspirasi (Aman) */}
        <Route 
          path="/aspirasi" 
          element={ <StandardPageLayout><IdeBank /></StandardPageLayout> } 
        />
        
        {/* --- 2. TAMBAH RUTE BARU GALERI --- */}
        <Route 
          path="/galeri" 
          element={ <StandardPageLayout><GaleriPage /></StandardPageLayout> } 
        />

        {/* === RUTE 404 (Aman) === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;