// File: src/pages/Portofolio.jsx (Versi Upgrade + Anggota)

import React, { useEffect, useState, useCallback, memo } from "react";
import { supabase } from "../supabase"; 
import PropTypes from "prop-types"; // <-- INI PENTING, JANGAN KETINGGALAN
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject"; 
import Certificate from "../components/Certificate"; 
import AOS from "aos";
import "aos/dist/aos.css";
// Perubahan: Ganti Boxes -> Users, tambah Loader2
import { Code, FlaskConical, Users, Loader2, UserPlus } from "lucide-react"; 


// --- Komponen baru: AnggotaCard (Kita copy dari Anggota.jsx) ---
const AnggotaCard = memo(({ nama, jabatan, foto_url, delay }) => {
  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg transform transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {foto_url ? (
        <img 
          src={foto_url} 
          alt={nama} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover border-4 border-red-500/30"
        />
      ) : (
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-white/5 border-4 border-red-500/30 flex items-center justify-center">
          <UserPlus className="w-12 h-12 text-red-300" />
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-semibold text-white mt-4">{nama}</h3>
      <p className="text-sm md:text-base text-red-300">{jabatan}</p>
    </div>
  );
});
// --- Akhir Komponen AnggotaCard ---


// ToggleButton (Aman)
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    {/* Ini udah auto-merah dari config */}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

// TabPanel (Aman)
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}


// --- PERUBAHAN DI SINI: Terima props 'activeTab' & 'setActiveTab' ---
export default function FullWidthTabs({ activeTab, setActiveTab }) {
  const theme = useTheme();
  // Hapus state lama: const [value, setValue] = useState(0);

  // State
  const [prokerList, setProkerList] = useState([]);
  const [workshopList, setWorkshopList] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]); // <-- Tambah state anggota
  const [showAllProker, setShowAllProker] = useState(false);
  const [showAllWorkshop, setShowAllWorkshop] = useState(false);
  const [showAllAnggota, setShowAllAnggota] = useState(false); // <-- Tambah state anggota
  const [loading, setLoading] = useState(true); // <-- Tambah state loading

  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;
  const initialAnggota = isMobile ? 4 : 8; // Anggota kita tampilkan 8

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  // --- Perubahan Data Fetching (Tambah 'anggota') ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prokerResponse, workshopResponse, anggotaResponse] = await Promise.all([
        supabase.from("proker").select("*").order('id', { ascending: true }),
        supabase.from("workshop").select("*").order('id', { ascending: true }),
        supabase.from("anggota").select("*").order('id', { ascending: true }), // <-- Tambah fetch anggota
      ]);

      if (prokerResponse.error) throw prokerResponse.error;
      if (workshopResponse.error) throw workshopResponse.error;
      if (anggotaResponse.error) throw anggotaResponse.error; // <-- Handle error

      const prokerData = prokerResponse.data || [];
      const workshopData = workshopResponse.data || [];
      const anggotaData = anggotaResponse.data || []; // <-- Ambil data

      setProkerList(prokerData);
      setWorkshopList(workshopData);
      setAnggotaList(anggotaData); // <-- Set data

      localStorage.setItem("proker", JSON.stringify(prokerData));
      localStorage.setItem("workshop", JSON.stringify(workshopData));
      localStorage.setItem("anggota", JSON.stringify(anggotaData)); // <-- Simpan di cache
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
    setLoading(false);
  }, []);
  // --- Akhir Perubahan Data Fetching ---

  // --- Perubahan useEffect (Cache) ---
  useEffect(() => {
    const cachedProker = localStorage.getItem('proker');
    const cachedWorkshop = localStorage.getItem('workshop');
    const cachedAnggota = localStorage.getItem('anggota'); // <-- Ambil cache

    if (cachedProker && cachedWorkshop && cachedAnggota) {
        setProkerList(JSON.parse(cachedProker));
        setWorkshopList(JSON.parse(cachedWorkshop));
        setAnggotaList(JSON.parse(cachedAnggota)); // <-- Set dari cache
        setLoading(false);
    }
    
    fetchData(); // Tetap panggil fetchData
  }, [fetchData]);
  // --- Akhir Perubahan useEffect (Cache) ---

  // Perubahan: Ganti 'setValue' -> 'setActiveTab'
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // --- Perubahan Toggle "See More" ---
  const toggleShowMore = useCallback((type) => {
    if (type === 'proker') setShowAllProker(prev => !prev);
    else if (type === 'workshop') setShowAllWorkshop(prev => !prev);
    else if (type === 'anggota') setShowAllAnggota(prev => !prev); // <-- Tambah toggle anggota
  }, []);

  const displayedProker = showAllProker ? prokerList : prokerList.slice(0, initialItems);
  const displayedWorkshop = showAllWorkshop ? workshopList : workshopList.slice(0, initialItems);
  const displayedAnggota = showAllAnggota ? anggotaList : anggotaList.slice(0, initialAnggota); // <-- Data display anggota
  // --- Akhir Perubahan Toggle ---

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden pb-[5%]" id="proker">
      
      {/* Header (Aman) */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Program Kerja Litbang
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Lihat berbagai program kerja, workshop, dan riset yang telah kami kembangkan untuk Himpunan.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar (Aman, udah merah) */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 0, 0, 0.03) 0%, rgba(255, 68, 68, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          
          {/* --- PERUBAHAN TABS DI SINI --- */}
          <Tabs
            value={activeTab} // <-- Ganti 'value' -> 'activeTab'
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8", 
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 0, 0, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 0, 0, 0.2), rgba(255, 68, 68, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 0, 0, 0.2)",
                  "& .lucide": {
                    color: "#FF8888", 
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Program Kerja"
              {...a11yProps(0)}
            />
            <Tab
              icon={<FlaskConical className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Workshop & Riset"
              {...a11yProps(1)}
            />
            {/* Ganti Tab 2: Fokus Teknologi -> Anggota */}
            <Tab
              icon={<Users className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Anggota"
              {...a11yProps(2)}
            />
          </Tabs>
          {/* --- AKHIR PERUBAHAN TABS --- */}

        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeTab} // <-- Ganti 'index' -> 'activeTab'
          onChangeIndex={setActiveTab} // <-- Ganti 'setValue' -> 'setActiveTab'
        >
          {/* TabPanel 0 (Aman) */}
          <TabPanel value={activeTab} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProker.map((proker, index) => ( 
                  <div
                    key={proker.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={proker.Img}
                      Title={proker.Title}
                      Description={proker.Description}
                      Link={proker.Link}
                      id={proker.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {prokerList.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('proker')}
                  isShowingMore={showAllProker}
                />
              </div>
            )}
          </TabPanel>

          {/* TabPanel 1 (Aman) */}
          <TabPanel value={activeTab} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedWorkshop.map((workshop, index) => (
                  <div
                    key={workshop.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={workshop.Img} /> 
                  </div>
                ))}
              </div>
            </div>
            {workshopList.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('workshop')}
                  isShowingMore={showAllWorkshop}
                />
              </div>
            )}
          </TabPanel>
          
          {/* --- PERUBAHAN TABPANEL 2 (Anggota) --- */}
          <TabPanel value={activeTab} index={2} dir={theme.direction}>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
              </div>
            ) : (
              <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]"> 
                {/* Ganti grid-nya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedAnggota.map((anggota, index) => (
                    <AnggotaCard 
                      key={anggota.id}
                      nama={anggota.nama}
                      jabatan={anggota.jabatan}
                      foto_url={anggota.foto_url}
                      delay={index * 100}
                    />
                  ))}
                </div>
              </div>
            )}
            {anggotaList.length > initialAnggota && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('anggota')}
                  isShowingMore={showAllAnggota}
                />
              </div>
            )}
          </TabPanel>
          {/* --- AKHIR PERUBAHAN TABPANEL 2 --- */}

        </SwipeableViews>
      </Box>
    </div>
  );
}