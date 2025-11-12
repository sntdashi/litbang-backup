import React from "react";
import AnimatedBackground from "../components/Background";
import Navbar from "../components/Navbar";

const LitbangWeb = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <AnimatedBackground />
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Litbang – Lembaga Penelitian dan Pengembangan
        </h1>

        <p className="text-lg leading-relaxed text-gray-300 text-center mb-10">
          Situs resmi divisi <span className="text-cyan-400 font-semibold">Litbang</span>  
          STIMIK IKMI Cirebon — wadah penelitian, inovasi, dan publikasi karya ilmiah mahasiswa.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Visi & Misi</h2>
            <p className="text-gray-300">
              Mengembangkan potensi riset dan inovasi di lingkungan kampus,
              serta menjadi pusat data penelitian yang bermanfaat bagi masyarakat.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Fokus Pengembangan</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Penelitian teknologi informasi dan sistem cerdas</li>
              <li>Pengembangan perangkat lunak inovatif</li>
              <li>Publikasi karya ilmiah mahasiswa</li>
              <li>Kerjasama riset antar kampus dan industri</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LitbangWeb;
