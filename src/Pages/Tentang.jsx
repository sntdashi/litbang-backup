import { motion } from "framer-motion";

function Tentang() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-white bg-[radial-gradient(circle_at_center,_rgba(128,0,64,0.5),_#1a001f)] relative overflow-hidden">
      {/* grid effect background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 max-w-3xl text-center p-6 backdrop-blur-md bg-white/5 rounded-2xl shadow-lg"
      >
        <h1 className="text-4xl font-bold text-red-400 mb-4">
          Departemen Litbang HIMATIF
        </h1>
        <p className="text-lg text-gray-200 leading-relaxed">
          Departemen Litbang (Penelitian dan Pengembangan) adalah divisi yang
          berfokus pada inovasi, pengembangan teknologi, dan penelitian internal
          untuk meningkatkan kualitas serta daya saing organisasi HIMATIF IKMI.
          Kami hadir sebagai wadah ide, riset, dan kreativitas mahasiswa
          Informatika untuk menciptakan karya yang berdampak nyata.
        </p>
      </motion.div>
    </section>
  );
}

export default Tentang;
