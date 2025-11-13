import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import "./index.css";

// --- Halaman Publik ---
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio"; // Ini udah jadi 'Proker'
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import NotFoundPage from "./Pages/404"; // Halaman 404

// --- Halaman Admin (BARU) ---
import LoginPage from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";

import { AnimatePresence } from 'framer-motion';

// --- (1) Layout Halaman Utama / Landing Page ---
// (Logic WelcomeScreen lu udah bagus, kita pertahanin)
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
          <ContactPage />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              {/* --- PERUBAHAN FOOTER --- */}
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "} 
                <a href="https://himatif.id" className="hover:underline"> {/* Ganti ke link Himatif */}
                  Litbang HIMATIF
                </a>
                . All Rights Reserved.
              </span>
              {/* --- AKHIR PERUBAHAN FOOTER --- */}
            </center>
          </footer>
        </>
      )}
    </>
  );
};

// --- (2) Layout Halaman Detail Project ---
// (Kita ganti footernya juga biar konsisten)
const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        {/* --- PERUBAHAN FOOTER --- */}
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "} {/* Samain tahunnya */}
          <a href="https://himatif.id" className="hover:underline">
            Litbang HIMATIF
          </a>
          . All Rights Reserved.
        </span>
        {/* --- AKHIR PERUBAHAN FOOTER --- */}
      </center>
    </footer>
  </>
);

// --- (3) KOMPONEN UTAMA APP (ROUTER) ---
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter> 
      <Routes>
        {/* === RUTE HALAMAN PUBLIK === */}
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
         
        {/* === RUTE ADMIN (BARU) === */}
        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Halaman Dashboard (Protected) */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* === RUTE 404 (NOT FOUND) === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;