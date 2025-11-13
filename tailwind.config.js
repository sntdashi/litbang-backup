/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}", // Pastiin ini ngarah ke file lu
	],
	theme: {
	  extend: {
		colors: {
		  // --- INI DIA MAGIC-NYA ---
		  // Kita timpa warna lama pake palet Merah Ati
		  
		  // Palet Merah Ati / Maroon
		  'maroon-red': {
			'50': '#FFEEEE',  // Merah pucat (buat aksen terang)
			'100': '#FFDDDD', // Merah muda
			'200': '#FFBBBB', // Merah muda
			'300': '#FF8888', // Merah muda/oranye
			'400': '#FF4444', // Merah cerah (buat aksen)
			'500': '#8B0000', // WARNA UTAMA (Merah Ati)
			'600': '#7A0000', // Agak Gelap
			'700': '#6A0000', // Gelap
			'800': '#5A0000', // Sangat Gelap
			'900': '#4A0000', // Gelap Banget
			'950': '#1A0000', // Background
		  },
  
		  // --- NIBAN WARNA DEFAULT TAILWIND ---
		  // Bikin 'indigo', 'purple', 'blue', 'cyan', 'pink'
		  // jadi alias/nama lain dari palet 'maroon-red' di atas.
		  
		  indigo: { // Ganti 'indigo'
			'50': '#FFEEEE',
			'100': '#FFDDDD',
			'200': '#FFBBBB',
			'300': '#FF8888',
			'400': '#FF4444',
			'500': '#8B0000', // <-- Warna Utama
			'600': '#7A0000',
			'700': '#6A0000',
			'800': '#5A0000',
			'900': '#4A0000',
			'950': '#1A0000',
		  },
		  purple: { // Ganti 'purple'
			'50': '#FFEEEE',
			'100': '#FFDDDD',
			'200': '#FFBBBB',
			'300': '#FF8888',
			'400': '#FF4444',
			'500': '#8B0000', // <-- Warna Utama
			'600': '#7A0000',
			'700': '#6A0000',
			'800': '#5A0000',
			'900': '#4A0000',
			'950': '#1A0000',
		  },
		  blue: { // Ganti 'blue'
			'50': '#FFEEEE',
			'100': '#FFDDDD',
			'200': '#FFBBBB',
			'300': '#FF8888',
			'400': '#FF4444',
			'500': '#8B0000', // <-- Warna Utama
			'600': '#7A0000',
			'700': '#6A0000',
			'800': '#5A0000',
			'900': '#4A0000',
			'950': '#1A0000',
		  },
		  cyan: { // Ganti 'cyan' (buat background blob)
			'50': '#FFEEEE',
			'100': '#FFDDDD',
			'200': '#FFBBBB',
			'300': '#FF8888',
			'400': '#FF4444',
			'500': '#8B0000', // <-- Warna Utama
			'600': '#7A0000',
			'700': '#6A0000',
			'800': '#5A0000',
			'900': '#4A0000',
			'950': '#1A0000',
		  },
		  pink: { // Ganti 'pink' (buat background blob)
			'50': '#FFEEEE',
			'100': '#FFDDDD',
			'200': '#FFBBBB',
			'300': '#FF8888',
			'400': '#FF4444',
			'500': '#8B0000', // <-- Warna Utama
			'600': '#7A0000',
			'700': '#6A0000',
			'800': '#5A0000',
			'900': '#4A0000',
			'950': '#1A0000',
		  },
		}
	  },
	},
	plugins: [],
  }