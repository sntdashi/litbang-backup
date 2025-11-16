// File: src/pages/Galeri.jsx (File Baru)

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Image, X } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
// Import Modal dari MUI (Material-UI)
import { Modal, Box, IconButton, Backdrop } from '@mui/material';

// Kategori buat filter (samain kayak di Admin Panel)
const KATEGORI = ['Semua', 'Makrab', 'Studi Banding', 'Workshop', 'Lomba', 'Lainnya'];

const GaleriPage = () => {
  const [loading, setLoading] = useState(true);
  const [fotoList, setFotoList] = useState([]);
  const [filter, setFilter] = useState('Semua'); // Filter aktif
  
  // State buat Modal Popup
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState(null);

  // 1. Fetch data dari tabel 'galeri'
  const fetchGaleri = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('galeri').select('*').order('created_at', { ascending: false });

    // Kalo filternya BUKAN 'Semua', kita filter
    if (filter !== 'Semua') {
      query = query.eq('kategori', filter);
    }
    
    const { data, error } = await query;
    
    if (error) console.error("Error fetch galeri:", error);
    else setFotoList(data || []);
    
    setLoading(false);
  }, [filter]); // <-- Jalankan ulang kalo 'filter' berubah

  useEffect(() => {
    AOS.init({ once: false, duration: 800 });
    fetchGaleri();
  }, [fetchGaleri]);

  // 2. Fungsi buat Modal
  const handleOpenModal = (foto) => {
    setSelectedFoto(foto);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    // Kasih jarak atas (pt-32) biar ga ketutupan Navbar
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 pt-32 overflow-hidden pb-[10%]" id="galeri">
      
      {/* Judul */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Galeri Litbang
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Semua dokumentasi kegiatan Himpunan ada di sini.
        </p>
      </div>

      {/* Tombol Filter Kategori */}
      <div 
        className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10" 
        data-aos="fade-up" 
        data-aos-duration="1200"
      >
        {KATEGORI.map((kategori) => (
          <button
            key={kategori}
            onClick={() => setFilter(kategori)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg
              ${filter === kategori 
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-500/20' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
          >
            {kategori}
          </button>
        ))}
      </div>

      {/* Grid Foto */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {fotoList.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-2" />
              Belum ada foto di kategori "{filter}", ngab.
            </div>
          )}

          {fotoList.map((foto, index) => (
            <div
              key={foto.id}
              className="relative group bg-white/5 border border-white/10 rounded-lg overflow-hidden cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 50}
              onClick={() => handleOpenModal(foto)}
            >
              <img 
                src={foto.url_foto} 
                alt={foto.judul_foto} 
                className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              {/* Judul & Kategori di bawah gambar */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{foto.judul_foto}</h3>
                <p className="text-sm text-red-300">{foto.kategori}</p>
              </div>
              {/* Overlay pas hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold">Lihat Foto</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup (Kita "curi" style dari Certificate.jsx) */}
      <Modal
				open={modalOpen}
				onClose={handleCloseModal}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Box
					sx={{
						position: "relative",
						width: "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						outline: "none",
					}}>
					{/* Tombol Close */}
					<IconButton
						onClick={handleCloseModal}
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.6)",
							zIndex: 1,
							"&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
						}}
						size="large">
						<X className="w-6 h-6" />
					</IconButton>

					{/* Foto Gede */}
					<img
						src={selectedFoto?.url_foto}
						alt={selectedFoto?.judul_foto}
						style={{
							display: "block",
							maxWidth: "100%",
							maxHeight: "90vh",
							objectFit: "contain",
						}}
					/>
				</Box>
			</Modal>

    </div>
  );
};

export default GaleriPage;