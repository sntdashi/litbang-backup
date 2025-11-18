// File: src/pages/IdeBank.jsx (Versi Anti-Spam)

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { Lightbulb, Send, Loader2, ArrowUpCircle, CheckCircle2 } from "lucide-react"; // Tambah CheckCircle2
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

// --- Komponen Form (Aman, ga diubah) ---
const FormIde = () => {
  const [nama, setNama] = useState('');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        .insert([{ 
          nama_pengirim: nama || 'Anonim',
          ide_title: judul, 
          ide_deskripsi: deskripsi,
          status: 'Pending' 
        }]);
      if (error) throw error;
      Swal.fire({
        title: 'Slay! Idemu Terkirim!',
        text: 'Makasih udah ngasih masukan. Ide lu bakal kita review dulu sebelum nampil di Papan Aspirasi.',
        icon: 'success',
        confirmButtonColor: '#8B0000'
      });
      setNama('');
      setJudul('');
      setDeskripsi('');
    } catch (error) {
      console.error("Error submit ide:", error);
      Swal.fire('Gagal!', `Gagal ngirim ide: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-lg"
      data-aos="fade-up" 
      data-aos-duration="1200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <input
            type="text" name="nama" placeholder="Nama Lu (Opsional, boleh anonim)"
            value={nama} onChange={(e) => setNama(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
          />
          <Lightbulb className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-red-300 transition-colors" />
        </div>
        <div className="relative group">
          <input
            type="text" name="judul" placeholder="Judul Ide Lu (Wajib)"
            value={judul} onChange={(e) => setJudul(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
            required
          />
          <Send className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-red-300 transition-colors" />
        </div>
        <div className="relative group">
          <textarea
            name="deskripsi" placeholder="Jelasin ide lu di sini... (Wajib)"
            value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
            disabled={isSubmitting}
            className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300 h-32"
            required
          />
        </div>
        <button
          type="submit" disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Mengirim Ide...</span></>
          ) : (
            <><Send className="w-5 h-5" /><span>Kirim Ide</span></>
          )}
        </button>
      </form>
    </div>
  );
};
// --- Akhir Komponen Form ---


// --- INI HALAMAN UTAMANYA ---
const IdeBank = () => {
  const [ideList, setIdeList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 1. STATE BUAT NYIMPEN JEJAK VOTE ---
  const [votedIds, setVotedIds] = useState([]);

  const fetchPublicIdeas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ide_bank')
      .select('*')
      .neq('status', 'Pending') 
      .order('upvotes', { ascending: false }); 

    if (error) console.error("Error fetch public ideas:", error);
    else setIdeList(data || []);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
    fetchPublicIdeas();
    
    // --- 2. CEK LOCALSTORAGE PAS LOAD ---
    // Ambil data 'voted_ide_ids' dari browser
    const storedVotes = JSON.parse(localStorage.getItem('voted_ide_ids') || '[]');
    setVotedIds(storedVotes);
  }, [fetchPublicIdeas]);

  // --- 3. FUNGSI UPVOTE ANTI-SPAM ---
  const handleUpvote = async (id) => {
    // Cek dulu, udah pernah vote belom?
    if (votedIds.includes(id)) {
      Swal.fire({
        title: 'Eits!',
        text: 'Lu udah vote ide ini, ngab. Gantian sama yang laen!',
        icon: 'warning',
        confirmButtonColor: '#8B0000',
        background: '#0d0a1f',
        color: '#ffffff'
      });
      return; // STOP di sini
    }

    // Kalo belom, lanjut update database
    const { error } = await supabase.rpc('increment_upvotes', {
      ide_id_input: id
    });

    if (error) {
      console.error("Error upvote:", error);
      Swal.fire('Error', 'Gagal ngasih upvote, ngab!', 'error');
    } else {
      // Update UI (Optimistic)
      setIdeList(currentList => 
        currentList.map(ide => 
          ide.id === id ? { ...ide, upvotes: ide.upvotes + 1 } : ide
        )
      );
      
      // --- 4. SIMPEN JEJAK KE LOCALSTORAGE ---
      const newVotedIds = [...votedIds, id];
      setVotedIds(newVotedIds);
      localStorage.setItem('voted_ide_ids', JSON.stringify(newVotedIds));
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Diterima') return 'bg-green-500/20 text-green-300';
    if (status === 'Di-review') return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 pt-32 overflow-hidden pb-[10%]" id="aspirasi">
      
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

      <FormIde />

      <div className="max-w-3xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold text-white mb-6" data-aos="fade-up">
          Papan Aspirasi (Live)
        </h3>
        
        {loading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          {!loading && ideList.length === 0 && (
            <div className="text-center py-10 text-gray-500" data-aos="fade-up">
              <Lightbulb className="w-12 h-12 mx-auto mb-2" />
              Belum ada aspirasi publik, ngab. Jadi yang pertama!
            </div>
          )}

          {ideList.map((ide) => {
            // Cek apakah user ini udah vote ide ini
            const isVoted = votedIds.includes(ide.id);

            return (
              <div 
                key={ide.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 transition-all hover:bg-white/10"
                data-aos="fade-up"
              >
                {/* Tombol Upvote */}
                <button 
                  onClick={() => handleUpvote(ide.id)}
                  disabled={isVoted} // Disable kalo udah vote
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                    isVoted 
                      ? "bg-red-500/20 cursor-not-allowed scale-95" // Style kalo udah vote
                      : "bg-white/5 hover:bg-white/20 hover:scale-105 active:scale-95" // Style kalo belom
                  }`}
                >
                  {isVoted ? (
                    <CheckCircle2 className="w-6 h-6 text-red-400" />
                  ) : (
                    <ArrowUpCircle className="w-6 h-6 text-gray-300 group-hover:text-white" />
                  )}
                  <span className={`text-lg font-bold ${isVoted ? "text-red-400" : "text-white"}`}>
                    {ide.upvotes}
                  </span>
                </button>
                
                {/* Info Ide */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-semibold text-white mb-2">{ide.ide_title}</h4>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ide.status)}`}>
                      {ide.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    Dari: <span className="font-medium text-gray-300">{ide.nama_pengirim}</span>
                  </p>
                  <p className="text-gray-300">{ide.ide_deskripsi}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default IdeBank;