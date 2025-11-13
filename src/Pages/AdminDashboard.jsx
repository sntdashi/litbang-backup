import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Pastiin path ini bener
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Plus, Trash2, Edit3, Pin, PinOff, Loader2, 
  ShieldCheck, LayoutDashboard, MessageSquare, Code, FlaskConical, X, AlertTriangle 
} from 'lucide-react';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- (1) BACKGROUND EFFECT (Aman) ---
const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

// --- (2) MODAL COMPONENT (Aman) ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#0d0a1f] border border-white/10 rounded-2xl shadow-xl p-6"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

// --- (3) MANAGE PROKER COMPONENT (INI YANG KITA UPGRADE) ---
const ManageProker = () => {
  const [prokerList, setProkerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); 
  
  // Perubahan 1: Tambah TechStack & Features di state
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

  // Perubahan 2: handleOpenModal di-upgrade
  const handleOpenModal = (item) => {
    if (item) { // Mode EDIT
      setCurrentItem(item);
      setFormData({ 
        Title: item.Title, 
        Description: item.Description, 
        Img: item.Img, 
        Link: item.Link,
        // Ubah array jadi string (dipisah koma)
        TechStack: (item.TechStack || []).join(','), 
        Features: (item.Features || []).join(',') 
      });
    } else { // Mode TAMBAH BARU
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

  // Perubahan 3: handleSubmit di-upgrade
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Siapin data: Ubah string (dipisah koma) jadi array
    const dataToSubmit = {
      Title: formData.Title,
      Description: formData.Description,
      Img: formData.Img,
      Link: formData.Link,
      TechStack: formData.TechStack.split(',').map(s => s.trim()).filter(Boolean),
      Features: formData.Features.split(',').map(s => s.trim()).filter(Boolean),
    };

    let error;
    if (currentItem) { // Mode EDIT (Update)
      const { error: updateError } = await supabase.from('proker').update(dataToSubmit).eq('id', currentItem.id);
      error = updateError;
    } else { // Mode TAMBAH BARU (Insert)
      const { error: insertError } = await supabase.from('proker').insert([dataToSubmit]);
      error = insertError;
    }

    if (error) {
      Swal.fire('Gagal!', `Data gagal disimpan: ${error.message}`, 'error');
    } else {
      Swal.fire('Slay!', 'Data berhasil disimpan!', 'success');
      handleCloseModal();
      fetchProker(); // Refresh list-nya
    }
    setLoading(false);
  };

  // --- Fungsi Hapus Data (Aman) ---
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

  // --- Render (Aman) ---
  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-5 h-5" />
        Tambah Program Kerja
      </button>

      {/* List Data Proker (Aman) */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading && prokerList.length === 0 && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {prokerList.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-lg">{item.Title}</h3>
              <p className="text-gray-400 text-sm truncate max-w-md">{item.Description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id, item.Title)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Perubahan 4: Tambah 2 InputForm baru di Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentItem ? 'Edit Proker' : 'Tambah Proker Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputForm label="Judul Proker" name="Title" value={formData.Title} onChange={handleChange} />
          <InputForm label="Deskripsi" name="Description" value={formData.Description} onChange={handleChange} isTextarea={true} />
          <InputForm label="Image URL" name="Img" value={formData.Img} onChange={handleChange} placeholder="https://... (link ke gambar)" />
          <InputForm label="Link Proyek (GitHub/Demo)" name="Link" value={formData.Link} onChange={handleChange} placeholder="https://github.com/..." />
          
          {/* --- INI DIA TAMBAHANNYA --- */}
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
            isTextarea={true} // Bikin textarea biar muat banyak
          />
          {/* --- AKHIR TAMBAHAN --- */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// --- (4) MANAGE WORKSHOP COMPONENT (Aman, tidak diubah) ---
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

  useEffect(() => {
    fetchWorkshop();
    AOS.refresh();
  }, [fetchWorkshop]);

  const handleOpenModal = (item) => {
    if (item) {
      setCurrentItem(item);
      setFormData({ Title: item.Title, Img: item.Img });
    } else {
      setCurrentItem(null);
      setFormData({ Title: '', Img: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let error;
    if (currentItem) {
      const { error: updateError } = await supabase.from('workshop').update(formData).eq('id', currentItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('workshop').insert([formData]);
      error = insertError;
    }
    if (error) Swal.fire('Gagal!', `Data gagal disimpan: ${error.message}`, 'error');
    else {
      Swal.fire('Slay!', 'Data berhasil disimpan!', 'success');
      handleCloseModal();
      fetchWorkshop();
    }
    setLoading(false);
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Lu yakin, ngab?',
      text: `Mau hapus workshop "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!',
      cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('workshop').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else {
          Swal.fire('Beres!', 'Data workshop berhasil dihapus.', 'success');
          fetchWorkshop();
        }
        setLoading(false);
      }
    });
  };

  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <button
        onClick={() => handleOpenModal(null)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
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
              <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
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
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// --- (5) MANAGE KOMENTAR COMPONENT (Aman, tidak diubah) ---
const ManageKomentar = () => {
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKomentar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('litbang_guestbook').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    if (!error) setKomentarList(data);
    else console.error("Error fetch komentar:", error);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchKomentar();
    AOS.refresh();
  }, [fetchKomentar]);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Lu yakin, ngab?',
      text: `Mau hapus komentar dari "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Iya, Hapus Aja!',
      cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from('litbang_guestbook').delete().eq('id', id);
        if (error) Swal.fire('Gagal!', `Gagal hapus data: ${error.message}`, 'error');
        else {
          Swal.fire('Beres!', 'Komentar berhasil dihapus.', 'success');
          fetchKomentar();
        }
        setLoading(false);
      }
    });
  };

  const handleTogglePin = async (item) => {
    setLoading(true);
    const { error } = await supabase.from('litbang_guestbook').update({ is_pinned: !item.is_pinned }).eq('id', item.id);
    if (error) Swal.fire('Gagal!', `Gagal update pin: ${error.message}`, 'error');
    else {
      Swal.fire('Sip!', 'Status pin berhasil di-update.', 'success');
      fetchKomentar();
    }
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
            className={`bg-white/5 border p-4 rounded-lg ${item.is_pinned ? 'border-indigo-500' : 'border-white/10'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white">{item.user_name}</h4>
                  {item.is_pinned && <Pin className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-gray-300 text-sm mt-1">{item.content}</p>
                <span className="text-xs text-gray-500 mt-2 block">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleTogglePin(item)} className={`p-2 rounded-lg transition-colors ${item.is_pinned ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-gray-400 hover:bg-white/20'}`}>
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

// Helper buat Form Input (Aman)
const InputForm = ({ label, name, value, onChange, placeholder, isTextarea = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        rows={4}
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
    )}
  </div>
);


// --- (6) KOMPONEN UTAMA: ADMIN DASHBOARD (Aman, tidak diubah) ---
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('proker'); 
  const navigate = useNavigate();

  // Protected route (Aman)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
      } else {
        setUser(session.user);
        AOS.init({ once: true, duration: 800 });
      }
    };
    checkSession();
  }, [navigate]);

  // Logout (Aman)
  const handleLogout = async () => {
    Swal.fire({
      title: 'Mau Logout, ngab?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Iya, Logout',
      cancelButtonText: 'Ga jadi',
      background: '#0d0a1f', color: '#ffffff'
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
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Render Halaman Admin (Aman)
  return (
    <div className="relative min-h-screen w-full bg-[#1A0000] text-white p-4 md:p-8">
      <BackgroundEffect />

      {/* Header Admin */}
      <header 
        className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
        data-aos="fade-down"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Login sebagai: {user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </header>

      {/* Konten Admin */}
      <main className="relative z-10 flex flex-col lg:flex-row gap-8">
        {/* Navigasi / Tabs */}
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
          </ul>
        </nav>

        {/* Content Area */}
        <section className="lg:w-3/4 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl min-h-[60vh]">
          {activeTab === 'proker' && <ManageProker />}
          {activeTab === 'workshop' && <ManageWorkshop />}
          {activeTab === 'komentar' && <ManageKomentar />}
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
            background: rgba(99, 156, 241, 0.5);
            border-radius: 6px;
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
          ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white shadow-lg' 
          : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-300' : 'text-gray-500'}`} />
      <span className="font-medium">{label}</span>
    </button>
  </li>
);

export default AdminDashboard;