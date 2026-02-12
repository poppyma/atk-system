"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface PhotoItem {
  id: string;
  description: string;
  foto: string;
}

export default function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<PhotoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`/api/photo/${id}`);
        if (!response.ok) {
          throw new Error("Foto tidak ditemukan");
        }
        const data = await response.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  const handleDownload = () => {
    if (!item?.foto) return;

    // Jika base64
    if (item.foto.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = item.foto;
      link.download = `${item.description}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Jika URL biasa
      const link = document.createElement("a");
      link.href = item.foto;
      link.download = item.description;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white text-lg">Memuat foto...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white mb-6 text-lg">{error || "Foto tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-white px-6 py-2 font-medium text-black hover:bg-gray-100 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Image Container */}
      <div className="flex items-center justify-center w-full h-full p-4">
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.description}
            className="max-h-full max-w-full object-contain"
            title={item.description}
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🖼️</div>
            <p>Foto tidak tersedia</p>
          </div>
        )}
      </div>

      {/* Top Right Actions */}
      <div className="fixed top-4 right-4 flex flex-col gap-3 z-40">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
          title="Download foto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {/* Back Button */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
          title="Kembali"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Title at bottom */}
      <div className="fixed bottom-4 left-4 text-white z-40">
        <p className="text-sm font-medium">{item.description}</p>
      </div>
    </div>
  );
}
