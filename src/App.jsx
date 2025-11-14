// File: src/App.jsx (Versi Lift State)

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import "./index.css";

// --- Halaman Publik ---
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio"; // Ini halaman 'proker'
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import NotFoundPage from "./Pages/404"; 
import Struktur from "./Pages/Struktur"; // <-- Import Struktur

// --- Halaman Admin (Aman) ---
import LoginPage from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";

import { AnimatePresence } from 'framer-motion';

// --- (1) Layout Halaman Utama / Landing Page ---
// --- Perubahan: Terima props 'activeTab' & 'setActiveTab' ---
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
          {/* --- Perubahan: Kirim props 'setActiveTab' --- */}
          <About setActiveTab={setActiveTab} />
          {/* --- Perubahan: Kirim props 'activeTab' & 'setActiveTab' --- */}
          <Portofolio activeTab={activeTab} setActiveTab={setActiveTab} /> 
          <Struktur /> {/* <-- Render Struktur di sini */}
          {/* Kita HAPUS <Anggota /> dari sini, karena udah masuk Portofolio */}
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
    <ProjectDetails />
    <footer>
      <center>
        {/* ... footer ... */}
      </center>
    </footer>
  </>
);

// --- (3) KOMPONEN UTAMA APP (ROUTER) ---
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  
  // --- Perubahan: Tambah state buat 'activeTab' ---
  const [activeTab, setActiveTab] = useState(0); // 0 = Proker, 1 = Workshop, 2 = Anggota

  return (
    <BrowserRouter> 
      <Routes>
        {/* --- Perubahan: Kirim props 'activeTab' & 'setActiveTab' --- */}
        <Route path="/" element={<LandingPage 
            showWelcome={showWelcome} 
            setShowWelcome={setShowWelcome} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />} 
        />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;