// File: src/App.jsx (Versi FIX FINAL)

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

// --- 1. IMPORT HALAMAN BARU ---
import Struktur from "./Pages/Struktur";


// --- Halaman Admin (Aman) ---
import LoginPage from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";

import { AnimatePresence } from 'framer-motion';

// --- (1) Layout Halaman Utama / Landing Page ---
const LandingPage = ({ showWelcome, setShowWelcome }) => {
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
          <About />
          <Portofolio /> 
          {/* --- 2. TAMBAHIN 'RUANGAN' BARU DI SINI --- */}
          <Struktur />
          
          {/* ------------------------------------- */}
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
);

// --- (3) KOMPONEN UTAMA APP (ROUTER) (Aman) ---
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;