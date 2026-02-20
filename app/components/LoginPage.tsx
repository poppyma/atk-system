"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Toast from "./Toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (!username || !password) {
        setError("Username dan password harus diisi");
        setIsLoading(false);
        return;
      }

      const success = login(username, password);
      if (success) {
        setUsername("");
        setPassword("");
        setToastMessage("Login berhasil!");
      } else {
        setError("Username atau password salah");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsGuest();
      setToastMessage("Login sebagai Tamu berhasil!");
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      {/* Abstract decorative shapes */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {/* Large circles */}
        <circle cx="100" cy="120" r="150" fill="rgba(59, 130, 246, 0.12)" />
        <circle cx="850" cy="500" r="120" fill="rgba(191, 219, 254, 0.11)" />
        <circle cx="950" cy="900" r="200" fill="rgba(96, 165, 250, 0.09)" />
        <circle cx="150" cy="750" r="100" fill="rgba(59, 130, 246, 0.1)" />
        <circle cx="700" cy="150" r="180" fill="rgba(147, 197, 253, 0.08)" />
        
        {/* Medium circles scattered */}
        <circle cx="400" cy="200" r="70" fill="rgba(96, 165, 250, 0.12)" />
        <circle cx="600" cy="400" r="60" fill="rgba(191, 219, 254, 0.1)" />
        <circle cx="300" cy="850" r="85" fill="rgba(59, 130, 246, 0.11)" />
        <circle cx="800" cy="700" r="75" fill="rgba(147, 197, 253, 0.09)" />
        
        {/* Small circles */}
        <circle cx="200" cy="300" r="30" fill="rgba(59, 130, 246, 0.15)" />
        <circle cx="500" cy="600" r="25" fill="rgba(96, 165, 250, 0.12)" />
        <circle cx="750" cy="300" r="35" fill="rgba(191, 219, 254, 0.13)" />
        <circle cx="450" cy="850" r="28" fill="rgba(59, 130, 246, 0.1)" />
        
        {/* Squares and rectangles */}
        <rect x="800" y="50" width="200" height="200" fill="rgba(147, 197, 253, 0.1)" transform="rotate(45 900 150)" />
        <rect x="50" y="400" width="60" height="60" fill="rgba(191, 219, 254, 0.12)" />
        <rect x="600" y="150" width="80" height="80" fill="rgba(59, 130, 246, 0.09)" transform="rotate(30 640 190)" />
        <rect x="200" y="550" width="70" height="70" fill="rgba(96, 165, 250, 0.11)" transform="rotate(-25 235 585)" />
        <rect x="850" y="400" width="90" height="90" fill="rgba(147, 197, 253, 0.08)" transform="rotate(60 895 445)" />
        <rect x="100" y="600" width="50" height="50" fill="rgba(191, 219, 254, 0.1)" transform="rotate(-45 125 625)" />
        
        {/* Triangles */}
        <polygon points="0,900 200,700 100,900" fill="rgba(96, 165, 250, 0.09)" />
        <polygon points="800,100 850,50 900,100 850,150" fill="rgba(59, 130, 246, 0.12)" />
        <polygon points="500,100 550,50 550,150" fill="rgba(191, 219, 254, 0.1)" />
        <polygon points="100,200 150,150 150,250" fill="rgba(96, 165, 250, 0.11)" />
        <polygon points="700,600 750,550 700,700" fill="rgba(59, 130, 246, 0.09)" />
        
        {/* Wavy and curved lines */}
        <path d="M 0,300 Q 250,250 500,300 T 1000,300" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="2" fill="none" />
        <path d="M 0,700 Q 250,650 500,700 T 1000,700" stroke="rgba(147, 197, 253, 0.09)" strokeWidth="2" fill="none" />
        <path d="M 0,450 Q 200,400 400,450 T 800,450 T 1000,450" stroke="rgba(96, 165, 250, 0.07)" strokeWidth="3" fill="none" />
        <path d="M 100,0 Q 150,200 100,400" stroke="rgba(191, 219, 254, 0.08)" strokeWidth="2" fill="none" />
        <path d="M 900,0 Q 850,150 900,300" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="2" fill="none" />
        
        {/* Dots pattern scatter */}
        <circle cx="150" cy="650" r="8" fill="rgba(59, 130, 246, 0.12)" />
        <circle cx="200" cy="700" r="6" fill="rgba(147, 197, 253, 0.1)" />
        <circle cx="250" cy="670" r="7" fill="rgba(96, 165, 250, 0.11)" />
        <circle cx="180" cy="720" r="5" fill="rgba(191, 219, 254, 0.12)" />
        <circle cx="280" cy="710" r="6" fill="rgba(59, 130, 246, 0.1)" />
        <circle cx="350" cy="450" r="7" fill="rgba(96, 165, 250, 0.12)" />
        <circle cx="380" cy="480" r="5" fill="rgba(147, 197, 253, 0.11)" />
        <circle cx="320" cy="470" r="6" fill="rgba(191, 219, 254, 0.1)" />
        <circle cx="750" cy="230" r="7" fill="rgba(59, 130, 246, 0.11)" />
        <circle cx="780" cy="250" r="5" fill="rgba(96, 165, 250, 0.1)" />
        <circle cx="900" cy="350" r="6" fill="rgba(147, 197, 253, 0.12)" />
        <circle cx="920" cy="380" r="7" fill="rgba(191, 219, 254, 0.11)" />
        <circle cx="620" cy="800" r="5" fill="rgba(59, 130, 246, 0.1)" />
        <circle cx="650" cy="820" r="6" fill="rgba(96, 165, 250, 0.11)" />
        <circle cx="590" cy="830" r="7" fill="rgba(147, 197, 253, 0.1)" />
        
        {/* Additional small geometric accents */}
        <circle cx="400" cy="100" r="15" fill="rgba(191, 219, 254, 0.14)" />
        <circle cx="150" cy="500" r="20" fill="rgba(59, 130, 246, 0.11)" />
        <circle cx="820" cy="600" r="18" fill="rgba(96, 165, 250, 0.12)" />
        <circle cx="550" cy="750" r="22" fill="rgba(147, 197, 253, 0.1)" />
      </svg>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl shadow-2xl overflow-hidden bg-white relative z-10">
        {/* Left Section - Branding & Description */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-1 tracking-tight drop-shadow-lg transform hover:scale-105 transition-transform duration-200">
              📋 MANIS
            </h2>
            <p className="text-base md:text-lg text-blue-100 font-light mb-1">
              (MAster Non-stock Item System)
            </p>
            <p className="text-lg md:text-xl text-blue-50 font-semibold mb-6">
              Sistem Manajemen Item Non-Stock dan Supplier
            </p>
            
            {/* Feature cards */}
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <div className="text-4xl flex-shrink-0 hover:scale-110 transition-transform duration-200">📊</div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">Data Management</h3>
                  <p className="text-sm text-blue-100/90">Kelola master data dengan mudah</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="text-4xl flex-shrink-0 hover:scale-110 transition-transform duration-200">🔍</div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">Advanced Search</h3>
                  <p className="text-sm text-blue-100/90">Cari dan filter data dengan cepat</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="text-4xl flex-shrink-0 hover:scale-110 transition-transform duration-200">🛡️</div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">Secure Access</h3>
                  <p className="text-sm text-blue-100/90">Kontrol akses berbasis peran</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="relative z-10 pt-4">
            <div className="text-5xl opacity-20">📁</div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex flex-col justify-center p-6 md:p-8">
          {/* Mobile Header */}
          <div className="md:hidden mb-4 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-3 shadow-lg">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">
              MANIS
            </h1>
            <p className="text-slate-600 text-xs font-light">MAster Non-stock Item System</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h2>
            <p className="text-slate-500 text-xs mb-6 font-light">Masukkan kredensial untuk melanjutkan ke sistem</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">👤</span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 disabled:bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="admin"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔒</span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 disabled:bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-lg flex-shrink-0 mt-0">⚠️</span>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 transform hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 text-sm mt-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    <span>Login Admin</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-slate-500 text-sm font-medium">atau</span>
              </div>
            </div>

            {/* Guest Login Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-lg transition duration-300 transform hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>👥</span>
                  <span>Masuk sebagai Tamu</span>
                </>
              )}
            </button>
          </div>

          {/* Info Footer */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-slate-600 font-semibold text-xs uppercase tracking-wide mb-2 block">Tipe Akses</p>
            
            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <div className="text-lg flex-shrink-0 mt-0">🔐</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Admin</h3>
                  <p className="text-xs text-slate-600 mt-0.25 leading-relaxed">Akses penuh untuk membuat, mengedit, dan menghapus data</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="text-lg flex-shrink-0 mt-0">👥</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Tamu</h3>
                  <p className="text-xs text-slate-600 mt-0.25 leading-relaxed">Akses read-only, hanya dapat melihat data</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-light mt-3 text-center">SKF Indonesia © 2026 · MANIS v1.0</p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}