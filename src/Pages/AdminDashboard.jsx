// --- UBAH 1 BARIS INI ---
import ReactDOM from 'react-dom'; 
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Plus, Trash2, Edit3, Pin, PinOff, Loader2, 
  ShieldCheck, LayoutDashboard, MessageSquare, Code, FlaskConical, X, AlertTriangle,
  Home, 
  Users,
  UserPlus,
  Lightbulb // <-- 1. INI DIA YANG KETINGGALAN
} from 'lucide-react';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- (1) BACKGROUND EFFECT (Aman) ---
const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-r from-[#6A0000]/20 to-[#8B0000]/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-[#6A0000]/10 via-transparent to-[#8B0000]/10 blur-2xl animate-float" />
  </div>
);

// --- (2) MODAL COMPONENT (Aman) ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal( 
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 grid place-items-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0d0a1f] border border-white/10 rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        data-aos="fade-up"
        data-aos-duration="300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body 
  );
};
// --- AKHIR MODAL ---

// --- (3) MANAGE PROKER COMPONENT (Aman) ---
const ManageProker = () => {
  // ... (Kode full ManageProker ada di sini, aman, ga diubah)
  const [prokerList, setProkerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); 
  const [formData, setFormData] = useState({ Title: '', Description: '', Img: '', Link: '', TechStack: '', Features: '' });
  const fetchProker = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('proker').select('*').order('id', { ascending: false });
    if (!error) setProkerList(data);
    else console.error("Error fetch proker:", error);
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchProker();
    AOS.refresh();
  }, [fetchProker]);
  const handleOpenModal = (item) => {
    if (item) { 
      setCurrentItem(item);
      setFormData({ 
        Title: item.Title, 
        Description: item.Description, 
        Img: item.Img, 
        Link: item.Link,
        TechStack: (item.TechStack || []).join(','), 
        Features: (item.Features || []).join(',') 
      });
    } else { 
      setCurrentItem(null);
      setFormData({ Title: '', Description: '', Img: '', Link: '', TechStack: '', Features: '' });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = {
      Title: formData.Title,
      Description: formData.Description,
      Img: formData.Img,
      Link: formData.Link,
      TechStack: formData.TechStack.split(',').map(s => s.trim()).filter(Boolean),
      Features: formData.Features.split(',').map(s => s.trim()).filter(Boolean),
    };
    let error;
    if (currentItem) { 
      const { error: updateError } = await supabase.from('proker').update(dataToSubmit).eq('id', currentItem.id);
      error = updateError;
    } else { 
      const { error: insertError } = await supabase.from('proker').insert([dataToSubmit]);
      error = insertError;
    }
    if (error) {
      Swal.fire('Gagal!', `Data gagal disimpan: ${error.message}`, 'error');
    } else {
      Swal.fire('Slay!', 'Data berhasil disimpan!', 'success');
      handleCloseModal();
      fetchProker(); 
    }
    setLoading(false);
  };
  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Lu yakin, ngab?',
      text: `Mau hapus proker "${title}"? Data yg udah dihapus gabisa balik!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!',
      cancelButtonText: 'Ga jadi, WKWK',
      background: '#0d0a1f',
      color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('proker').delete().eq('id', id);
        if (error) {
          Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        } else {
          Swal.fire('Beres!', 'Data proker berhasil dihapus.', 'success');
          fetchProker(); 
        }
        setLoading(false);
      }
    });
  };
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Tambah Program Kerja
      </button>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && prokerList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {prokerList.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-lg">{item.Title}</h3>
              <p className="text-gray-400 text-sm truncate max-w-md">{item.Description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id, item.Title)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentItem ? 'Edit Proker' : 'Tambah Proker Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputForm label="Judul Proker" name="Title" value={formData.Title} onChange={handleChange} />
          <InputForm label="Deskripsi" name="Description" value={formData.Description} onChange={handleChange} isTextarea={true} />
          <InputForm label="Image URL" name="Img" value={formData.Img} onChange={handleChange} placeholder="https://... (link ke gambar)" />
          <InputForm label="Link Proyek (Instagram/Demo)" name="Link" value={formData.Link} onChange={handleChange} placeholder="https://instagram.com/..." />
          <InputForm 
            label="Tech Stack (Pisahkan dengan koma)" 
            name="TechStack" 
            value={formData.TechStack} 
            onChange={handleChange} 
            placeholder="Contoh: React,Tailwind,Supabase" 
          />
          <InputForm 
            label="Fitur Utama (Pisahkan dengan koma)" 
            name="Features" 
            value={formData.Features} 
            onChange={handleChange} 
            placeholder="Contoh: Login Admin,CRUD Proker,Realtime Comment"
            isTextarea={true} 
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// --- (4) MANAGE WORKSHOP COMPONENT (Aman) ---
const ManageWorkshop = () => {
  const [workshopList, setWorkshopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ Title: '', Img: '' });
  const fetchWorkshop = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('workshop').select('*').order('id', { ascending: false });
    if (!error) setWorkshopList(data);
    else console.error("Error fetch workshop:", error);
    setLoading(false);
  }, []);
  useEffect(() => { fetchWorkshop(); AOS.refresh(); }, [fetchWorkshop]);
  const handleOpenModal = (item) => {
    if (item) { setCurrentItem(item); setFormData({ Title: item.Title, Img: item.Img }); } 
    else { setCurrentItem(null); setFormData({ Title: '', Img: '' }); }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); let error;
    if (currentItem) { const { error: updateError } = await supabase.from('workshop').update(formData).eq('id', currentItem.id); error = updateError; } 
    else { const { error: insertError } = await supabase.from('workshop').insert([formData]); error = insertError; }
    if (error) Swal.fire('Gagal!', `Data gagal disimpan: ${error.message}`, 'error');
    else { Swal.fire('Slay!', 'Data berhasil disimpan!', 'success'); handleCloseModal(); fetchWorkshop(); }
    setLoading(false);
  };
  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Lu yakin, ngab?', text: `Mau hapus workshop "${title}"?`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!', cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('workshop').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else { Swal.fire('Beres!', 'Data workshop berhasil dihapus.', 'success'); fetchWorkshop(); }
        setLoading(false);
      }
    });
  };
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Tambah Workshop/Riset
      </button>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && workshopList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {workshopList.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">{item.Title}</h3>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id, item.Title)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentItem ? 'Edit Workshop' : 'Tambah Workshop Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputForm label="Judul Workshop/Riset" name="Title" value={formData.Title} onChange={handleChange} />
          <InputForm label="Image URL (Poster/Foto)" name="Img" value={formData.Img} onChange={handleChange} placeholder="https://... (link ke gambar)" />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// --- (5) MANAGE KOMENTAR COMPONENT (Aman) ---
const ManageKomentar = () => {
  // ... (Kode full ManageKomentar ada di sini, aman, ga diubah)
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchKomentar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('litbang_guestbook').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    if (!error) setKomentarList(data);
    else console.error("Error fetch komentar:", error);
    setLoading(false);
  }, []);
  useEffect(() => { fetchKomentar(); AOS.refresh(); }, [fetchKomentar]);
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Lu yakin, ngab?', text: `Mau hapus komentar dari "${name}"?`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!', cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('litbang_guestbook').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else { Swal.fire('Beres!', 'Komentar berhasil dihapus.', 'success'); fetchKomentar(); }
        setLoading(false);
      }
    });
  };
  const handleTogglePin = async (item) => {
    setLoading(true);
    const { error } = await supabase.from('litbang_guestbook').update({ is_pinned: !item.is_pinned }).eq('id', item.id);
    if (error) Swal.fire('Gagal!', `Gagal update pin: ${error.message}`, 'error');
    else { Swal.fire('Sip!', 'Status pin berhasil di-update.', 'success'); fetchKomentar(); }
    setLoading(false);
  };
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <h3 className="text-xl font-semibold text-white mb-4">Manage Guestbook</h3>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && komentarList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {komentarList.map(item => (
          <div 
            key={item.id} 
            className={`bg-white/5 border p-4 rounded-lg ${item.is_pinned ? 'border-red-500' : 'border-white/10'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white">{item.user_name}</h4>
                  {item.is_pinned && <Pin className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-gray-300 text-sm mt-1">{item.content}</p>
                <span className="text-xs text-gray-500 mt-2 block">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleTogglePin(item)} className={`p-2 rounded-lg transition-colors ${item.is_pinned ? 'text-red-400 hover:bg-red-500/20' : 'text-gray-400 hover:bg-white/20'}`}>
                  {item.is_pinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
                </button>
                <button onClick={() => handleDelete(item.id, item.user_name)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- (6) MANAGE ANGGOTA COMPONENT (Aman) ---
const ManageAnggota = () => {
  // ... (Kode full ManageAnggota ada di sini, aman, ga diubah)
  const [anggotaList, setAnggotaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ nama: '', jabatan: 'Anggota', foto_url: '' });
  const fetchAnggota = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('anggota').select('*').order('id', { ascending: false });
    if (!error) setAnggotaList(data);
    else console.error("Error fetch anggota:", error);
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchAnggota(); 
    AOS.refresh();
  }, [fetchAnggota]);
  const handleOpenModal = (item) => {
    if (item) {
      setCurrentItem(item);
      setFormData({ nama: item.nama, jabatan: item.jabatan, foto_url: item.foto_url || '' });
    } else {
      setCurrentItem(null);
      setFormData({ nama: '', jabatan: 'Anggota', foto_url: '' }); 
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); let error;
    if (currentItem) {
      const { error: updateError } = await supabase.from('anggota').update(formData).eq('id', currentItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('anggota').insert([formData]);
      error = insertError;
    }
    if (error) Swal.fire('Gagal!', `Data gagal disimpan: ${error.message}`, 'error');
    else {
      Swal.fire('Slay!', 'Anggota berhasil disimpan!', 'success');
      handleCloseModal();
      fetchAnggota();
    }
    setLoading(false);
  };
  const handleDelete = (id, nama) => {
    Swal.fire({
      title: 'Lu yakin, ngab?',
      text: `Mau hapus anggota "${nama}"?`,
      icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!', cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('anggota').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else {
          Swal.fire('Beres!', 'Data anggota berhasil dihapus.', 'success');
          fetchAnggota();
        }
        setLoading(false);
      }
    });
  };
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Tambah Anggota Baru
      </button>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && anggotaList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {anggotaList.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              {item.foto_url ? (
                <img src={item.foto_url} alt={item.nama} className="w-12 h-12 rounded-full object-cover border-2 border-red-500/50" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-red-300">
                  <UserPlus className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-lg">{item.nama}</h3>
                <p className="text-gray-400 text-sm">{item.jabatan}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id, item.nama)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentItem ? 'Edit Anggota' : 'Tambah Anggota Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputForm label="Nama Anggota" name="nama" value={formData.nama} onChange={handleChange} placeholder="John Doe" />
          <InputForm label="Jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} placeholder="Anggota" />
          <InputForm label="URL Foto Profil (Opsional)" name="foto_url" value={formData.foto_url} onChange={handleChange} placeholder="https://... (link ke gambar)" />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Anggota'}
          </button>
        </form>
      </Modal>
    </div>
  );
};


// --- 7. KOMPONEN BARU: MANAGE IDE (INI YANG KETINGGALAN) ---
const ManageIde = () => {
  const [ideList, setIdeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIde = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ide_bank')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching ide:", error);
      Swal.fire('Gagal!', 'Gagal ngambil list ide.', 'error');
    } else {
      setIdeList(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIde();
    AOS.refresh();
  }, [fetchIde]);

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Lu yakin, ngab?',
      text: `Mau hapus ide "${title}"?`,
      icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33',
      confirmButtonText: 'Iya, Hapus Aja!', cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('ide_bank').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else { Swal.fire('Beres!', 'Ide berhasil dihapus.', 'success'); fetchIde(); }
        setLoading(false);
      }
    });
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = {
      'Pending': 'Di-review',
      'Di-review': 'Diterima',
      'Diterima': 'Pending',
    };
    const newStatus = nextStatus[currentStatus] || 'Pending';

    setLoading(true);
    const { error } = await supabase
      .from('ide_bank')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) Swal.fire('Gagal!', `Gagal update status: ${error.message}`, 'error');
    else fetchIde();
    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Diterima') return 'bg-green-500/20 text-green-300';
    if (status === 'Di-review') return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300'; // Default 'Pending'
  };

  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <h3 className="text-xl font-semibold text-white mb-4">Manage Kotak Ide</h3>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && ideList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        
        {ideList.map(item => (
          <div 
            key={item.id} 
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-lg">{item.ide_title}</h4>
                <p className="text-gray-400 text-sm mt-1 mb-2">
                  Dari: <span className="font-medium text-gray-300">{item.nama_pengirim}</span>
                </p>
                <p className="text-gray-200 text-base">{item.ide_deskripsi}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 items-end flex-shrink-0 ml-4">
                <button 
                  onClick={() => handleUpdateStatus(item.id, item.status)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-transform hover:scale-105 ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.ide_title)} 
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!loading && ideList.length === 0) && (
          <div className="text-center py-10 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-2" />
            Kotak Ide masih kosong, ngab.
          </div>
        )}
      </div>
    </div>
  );
};


// --- (8) MANAGE ADMIN COMPONENT (Aman) ---
const ManageAdmin = () => {
  // ... (Kode full ManageAdmin ada di sini, aman, ga diubah)
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role') 
      .eq('role', 'admin');
    
    if (!error) {
      setAdminList(data);
    } else {
      console.error("Error fetching admins:", error);
      Swal.fire('Gagal!', 'Gagal ngambil list admin.', 'error');
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchAdmins();
    AOS.refresh();
  }, [fetchAdmins]);
  const handleSubmitNewAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      Swal.fire('Error', 'Email & Password ga boleh kosong', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email: adminEmail, password: adminPassword },
      })
      if (error) throw error; 
      Swal.fire('Slay!', `Admin baru ${adminEmail} berhasil dibuat!`, 'success');
      setIsModalOpen(false);
      setAdminEmail('');
      setAdminPassword('');
      fetchAdmins();
    } catch (error) {
      console.error('Error invoke fungsi:', error);
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Gagal nambah admin. Cek console.',
        icon: 'error',
        background: '#0d0a1f', color: '#ffffff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Tambah Admin Baru
      </button>

      <h3 className="text-xl font-semibold text-white mb-4">List Admin Aktif</h3>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && adminList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {adminList.map(admin => (
          <div key={admin.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-lg">
                {admin.full_name || 'Admin (Nama tidak ada)'}
              </h3>
              <p className="text-gray-400 text-sm">ID: {admin.id}</p>
            </div>
            <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full">
              {admin.role}
            </span>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Admin Baru">
        <form onSubmit={handleSubmitNewAdmin} className="space-y-4">
          <InputForm 
            label="Email Admin Baru" 
            name="email" 
            type="email"
            value={adminEmail} 
            onChange={(e) => setAdminEmail(e.target.value)} 
            placeholder="adminbaru@email.com"
          />
          <InputForm 
            label="Password Admin Baru" 
            name="password" 
            type="password"
            value={adminPassword} 
            onChange={(e) => setAdminPassword(e.target.value)} 
            placeholder="Minimal 6 karakter"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Admin Baru'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
// --- AKHIR KOMPONEN BARU ---


// Helper buat Form Input (Aman)
const InputForm = ({ label, name, value, onChange, placeholder, isTextarea = false, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
        rows={4}
      />
    ) : (
      <input
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
      />
    )}
  </div>
);


// --- (7) KOMPONEN UTAMA: ADMIN DASHBOARD (Aman) ---
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('proker'); 
  const navigate = useNavigate();

  // Protected route (Aman)
  useEffect(() => {
    const checkSessionAndRole = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate('/login');
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        navigate('/login');
        return;
      }
      if (profile.role === 'admin') {
        setUser(session.user);
        AOS.init({ once: true, duration: 800 });
      } else {
        Swal.fire({
          title: 'Akses Ditolak!', text: 'Ngab, lu bukan admin. Mau ngapain? 🤨',
          icon: 'error', background: '#0d0a1f', color: '#ffffff',
          confirmButtonColor: '#d33'
        });
        navigate('/');
      }
    };
    checkSessionAndRole();
  }, [navigate]);

  // Logout (Aman)
  const handleLogout = async () => {
    Swal.fire({
      title: 'Mau Logout, ngab?', icon: 'question',
      showCancelButton: true, confirmButtonText: 'Iya, Logout',
      cancelButtonText: 'Ga jadi', background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase.auth.signOut();
        navigate('/login');
      }
    });
  };

  // Loading state (Aman)
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1A0000]">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  // Render Halaman Admin
  return (
    <div className="relative min-h-screen w-full bg-[#1A0000] text-white p-4 md:p-8">
      <BackgroundEffect />

      {/* Header Admin (Aman) */}
      <header 
        className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
        data-aos="fade-down"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Login sebagai: {user.email}</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
          >
              <Home className="w-5 h-5" />
              <span>Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

      </header>

      {/* Konten Admin (Aman) */}
      <main className="relative z-10 flex flex-col lg:flex-row gap-8">
        {/* --- 3. UBAH NAVIGASI DI SINI --- */}
        <nav 
          className="lg:w-1/4 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl self-start"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <ul className="space-y-2">
            <TabButton 
              icon={Code} 
              label="Manage Proker" 
              isActive={activeTab === 'proker'} 
              onClick={() => setActiveTab('proker')}
            />
            <TabButton 
              icon={FlaskConical} 
              label="Manage Workshop" 
              isActive={activeTab === 'workshop'} 
              onClick={() => setActiveTab('workshop')}
            />
            <TabButton 
              icon={MessageSquare} 
              label="Manage Komentar" 
              isActive={activeTab === 'komentar'} 
              onClick={() => setActiveTab('komentar')}
            />
            <TabButton 
              icon={UserPlus} 
              label="Manage Anggota" 
              isActive={activeTab === 'anggota'} 
              onClick={() => setActiveTab('anggota')}
            />
            {/* --- INI TAB BARU-NYA --- */}
            <TabButton 
              icon={Lightbulb} 
              label="Manage Ide" 
              isActive={activeTab === 'ide'} 
              onClick={() => setActiveTab('ide')}
            />
            {/* --------------------- */}
            <TabButton 
              icon={Users} 
              label="Manage Admin" 
              isActive={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
            />
          </ul>
        </nav>

        {/* --- 4. UBAH KONTEN DI SINI --- */}
        <section className="lg:w-3/4 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl min-h-[60vh]">
          {activeTab === 'proker' && <ManageProker />}
          {activeTab === 'workshop' && <ManageWorkshop />}
          {activeTab === 'komentar' && <ManageKomentar />}
          {activeTab === 'anggota' && <ManageAnggota />}
          {activeTab === 'ide' && <ManageIde />} {/* <-- INI KONTEN BARU-NYA */}
          {activeTab === 'admin' && <ManageAdmin />}
        </section>
      </main>

      {/* Style buat scrollbar (Aman) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 0, 0, 0.5);
            border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

// Helper buat Tombol Tab (Aman)
const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-white shadow-lg' 
          : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-red-300' : 'text-gray-500'}`} />
      <span className="font-medium">{label}</span>
    </button>
  </li>
);

export default AdminDashboard;