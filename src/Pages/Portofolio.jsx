import React, { useEffect, useState, useCallback } from "react";

// Pastikan path import supabase ini udah bener
import { supabase } from "../supabase"; 

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject"; // Asumsi komponen ini ada
import TechStackIcon from "../components/TechStackIcon"; // Asumsi komponen ini ada
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate"; // Asumsi komponen ini ada
// Perubahan: Ganti Award dengan FlaskConical (riset)
import { Code, FlaskConical, Boxes } from "lucide-react";


// ToggleButton: TIDAK DIUBAH (AMAN)
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
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

// TabPanel: TIDAK DIUBAH (AMAN)
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

// techStacks: TIDAK DIUBAH
// Ini udah bagus, teknologi ini relevan untuk Litbang
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  // --- Perubahan State ---
  // State diganti namanya biar sesuai konteks
  const [prokerList, setProkerList] = useState([]);
  const [workshopList, setWorkshopList] = useState([]);
  const [showAllProker, setShowAllProker] = useState(false);
  const [showAllWorkshop, setShowAllWorkshop] = useState(false);
  // --- Akhir Perubahan State ---

  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  // --- Perubahan Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      // Mengambil data dari tabel 'proker' dan 'workshop'
      const [prokerResponse, workshopResponse] = await Promise.all([
        supabase.from("proker").select("*").order('id', { ascending: true }), // Diubah: projects -> proker
        supabase.from("workshop").select("*").order('id', { ascending: true }), // Diubah: certificates -> workshop
      ]);

      if (prokerResponse.error) throw prokerResponse.error;
      if (workshopResponse.error) throw workshopResponse.error;

      const prokerData = prokerResponse.data || [];
      const workshopData = workshopResponse.data || [];

      setProkerList(prokerData); // Diubah: setProjects -> setProkerList
      setWorkshopList(workshopData); // Diubah: setCertificates -> setWorkshopList

      // Simpan ke localStorage dengan key baru
      localStorage.setItem("proker", JSON.stringify(prokerData)); // Diubah: projects -> proker
      localStorage.setItem("workshop", JSON.stringify(workshopData)); // Diubah: certificates -> workshop
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);
  // --- Akhir Perubahan Data Fetching ---

  // --- Perubahan useEffect (Cache) ---
  useEffect(() => {
    // Ambil dari localStorage dengan key baru
    const cachedProker = localStorage.getItem('proker'); // Diubah: projects -> proker
    const cachedWorkshop = localStorage.getItem('workshop'); // Diubah: certificates -> workshop

    if (cachedProker && cachedWorkshop) {
        setProkerList(JSON.parse(cachedProker)); // Diubah: setProjects -> setProkerList
        setWorkshopList(JSON.parse(cachedWorkshop)); // Diubah: setCertificates -> setWorkshopList
    }
    
    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);
  // --- Akhir Perubahan useEffect (Cache) ---

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // --- Perubahan Toggle "See More" ---
  const toggleShowMore = useCallback((type) => {
    if (type === 'proker') { // Diubah: 'projects' -> 'proker'
      setShowAllProker(prev => !prev); // Diubah: setShowAllProjects -> setShowAllProker
    } else if (type === 'workshop') { // Diubah: 'certificates' -> 'workshop'
      setShowAllWorkshop(prev => !prev); // Diubah: setShowAllCertificates -> setShowAllWorkshop
    }
  }, []);

  // Diubah: variabel disesuaikan
  const displayedProker = showAllProker ? prokerList : prokerList.slice(0, initialItems);
  const displayedWorkshop = showAllWorkshop ? workshopList : workshopList.slice(0, initialItems);
  // --- Akhir Perubahan Toggle ---

  return (
    // Diubah: id="Portofolio" -> id="proker" (biar nyambung sama link di Home/About)
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#1A0000] overflow-hidden" id="proker">
      
      {/* --- Perubahan Header --- */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {/* Diubah: Teks Judul */}
            Program Kerja Litbang
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          {/* Diubah: Teks Deskripsi */}
          Lihat berbagai program kerja, workshop, dan riset yang telah kami kembangkan untuk Himpunan.
        </p>
      </div>
      {/* --- Akhir Perubahan Header --- */}

      <Box sx={{ width: "100%" }}>
        {/* AppBar/Tabs: Style TIDAK DIUBAH (AMAN) */}
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
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* --- Perubahan Label & Ikon Tabs --- */}
          <Tabs
            value={value}
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
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
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
              label="Program Kerja" // Diubah: Label
              {...a11yProps(0)}
            />
            <Tab
              icon={<FlaskConical className="mb-2 w-5 h-5 transition-all duration-300" />} // Diubah: Ikon
              label="Workshop & Riset" // Diubah: Label
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Fokus Teknologi" // Diubah: Label
              {...a11yProps(2)}
            />
          </Tabs>
          {/* --- Akhir Perubahan Tabs --- */}
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          {/* --- Perubahan TabPanel 0 (Program Kerja) --- */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {/* Diubah: displayedProjects -> displayedProker */}
                {displayedProker.map((proker, index) => ( 
                  <div
                    key={proker.id || index} // Diubah: project.id -> proker.id
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    {/* Diubah: props disesuaikan dengan 'proker' */}
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
            {/* Diubah: Cek panjang 'prokerList' */}
            {prokerList.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('proker')} // Diubah: 'projects' -> 'proker'
                  isShowingMore={showAllProker} // Diubah: showAllProjects -> showAllProker
                />
              </div>
            )}
          </TabPanel>
          {/* --- Akhir Perubahan TabPanel 0 --- */}

          {/* --- Perubahan TabPanel 1 (Workshop & Riset) --- */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {/* Diubah: displayedCertificates -> displayedWorkshop */}
                {displayedWorkshop.map((workshop, index) => (
                  <div
                    key={workshop.id || index} // Diubah: certificate.id -> workshop.id
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    {/* Asumsi tabel 'workshop' punya kolom 'Img' */}
                    <Certificate ImgSertif={workshop.Img} /> 
                  </div>
                ))}
              </div>
            </div>
            {/* Diubah: Cek panjang 'workshopList' */}
            {workshopList.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('workshop')} // Diubah: 'certificates' -> 'workshop'
                  isShowingMore={showAllWorkshop} // Diubah: showAllCertificates -> showAllWorkshop
                />
              </div>
            )}
          </TabPanel>
          {/* --- Akhir Perubahan TabPanel 1 --- */}
          
          {/* --- TabPanel 2 (Fokus Teknologi) --- */}
          {/* TIDAK ADA PERUBAHAN LOGIC, karena 'techStacks' statis dan relevan */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]"> 
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
          {/* --- Akhir TabPanel 2 --- */}

        </SwipeableViews>
      </Box>
    </div>
  );
}