import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <span className="text-7xl mb-4">🍽️</span>
      <h1 className="font-bold text-4xl text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Halaman yang kamu cari tidak ditemukan.</p>
      <Link
        href="/"
        className="bg-[#C8102E] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#a00d25] transition-colors"
      >
        Kembali ke Home
      </Link>
    </div>
  );
}
