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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4 py-6">
      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-b from-blue-200 to-transparent rounded-full blur-3xl opacity-15 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-indigo-200 to-transparent rounded-full blur-3xl opacity-15 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-3 shadow-lg">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-1 tracking-tight">
            MANIS
          </h1>
          <p className="text-slate-600 text-sm font-light">MAster Non-stock Item System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Gradient Header Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Masuk ke Akun</h2>
            <p className="text-slate-500 text-xs mb-5 font-light">Masukkan kredensial untuk melanjutkan</p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 disabled:bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 disabled:bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 text-base mt-1"
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
            <div className="relative my-5">
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
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center gap-2 text-base"
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 md:px-10 py-6 border-t border-slate-200">
            <p className="text-slate-600 font-semibold text-xs uppercase tracking-wide mb-4 block">Tipe Akses</p>
            
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="text-2xl flex-shrink-0">🔐</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Admin</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">Akses penuh untuk membuat, mengedit, dan menghapus data master</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-2xl flex-shrink-0">👥</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tamu</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">Akses read-only, hanya dapat melihat data tanpa dapat mengubahnya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 md:px-10 py-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-light">SKF Indonesia © 2026 · MANIS v1.0</p>
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
