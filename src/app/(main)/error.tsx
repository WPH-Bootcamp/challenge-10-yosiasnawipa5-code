"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-5xl mb-4">😕</span>
      <h2 className="font-bold text-xl text-gray-900 mb-2">Terjadi kesalahan</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        Sesuatu tidak berjalan dengan baik. Coba lagi atau kembali ke halaman utama.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          Coba Lagi
        </Button>
        <Button onClick={() => (window.location.href = "/")}>
          Ke Halaman Utama
        </Button>
      </div>
    </div>
  );
}
