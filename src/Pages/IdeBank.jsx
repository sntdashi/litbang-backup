// File: src/pages/IdeBank.jsx (Versi Fix, Ga Pake ...)

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Pastiin path ini bener
import { Lightbulb, Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const IdeBank = () => {
  const [nama, setNama] = useState('');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !deskripsi) {
      Swal.fire('Error', 'Judul Ide dan Deskripsi ga boleh kosong, ngab!', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ide_bank')
        .insert([
          { 
            nama_pengirim: nama || 'Anonim', // Kalo kosong, jadi 'Anonim'
            ide_title: judul, 
            ide_deskripsi: deskripsi,
            status: 'Pending'
          }
        ]);

      if (error) throw error;

      // Kalo sukses
      Swal.fire({
        title: 'Done! udah Terkirim!',
        text: 'Makasih udah ngasih masukan buat Litbang. ide, aspirasi saran dan masukan bakal kita review!',
        icon: 'success',
        confirmButtonColor: '#8B0000'
      });
      // Kosongin form
      setNama('');
      setJudul('');
      setDeskripsi('');

    } catch (error) {
      console.error("Error submit ide:", error);
      Swal.fire('Gagal!', `Gagal ngirim: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Perubahan: Ganti ID jadi 'aspirasi' + Tambah Jarak Atas (pt-32)
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 pt-32 overflow-hidden pb-[10%]" id="aspirasi">
      
      {/* Judul (Kode Lengkap) */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FF4444]">
          <span style={{
            color: '#8B0000',
            backgroundImage: 'linear-gradient(45deg, #8B0000 10%, #FF4444 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Kotak Ide Litbang
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Punya ide, aspirasi, atau masukan gila buat HIMATIF? Kirim di sini! (Boleh anonim)
        </p>
      </div>

      {/* Form Kotak Ide (Kode Lengkap) */}
      <div 
        className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-lg"
        data-aos="fade-up" 
        data-aos-duration="1200"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama (Opsional) */}
          <div className="relative group">
            <input
              type="text"
              name="nama"
              placeholder="Nama kamu (Opsional, boleh anonim)"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
            />
            <Lightbulb className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-red-300 transition-colors" />
          </div>

          {/* Input Judul Ide (Wajib) */}
          <div className="relative group">
            <input
              type="text"
              name="judul"
              placeholder="Judul (Wajib)"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
              required
            />
            <Send className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-red-300 transition-colors" />
          </div>

          {/* Input Deskripsi (Wajib) */}
          <div className="relative group">
            <textarea
              name="deskripsi"
              placeholder="Jelasin di sini... (Wajib)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              disabled={isSubmitting}
              className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300 h-32"
              required
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdeBank;