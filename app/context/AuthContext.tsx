"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  role: "admin" | "user" | "guest";
  login: (username: string, password: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"admin" | "user" | "guest">("guest");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const { isLoggedIn: saved, role: savedRole } = JSON.parse(savedAuth);
        setIsLoggedIn(saved);
        setRole(savedRole);
      } catch (e) {
        console.error("Failed to parse auth from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Hardcode admin credentials
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setRole("admin");
      localStorage.setItem(
        "auth",
        JSON.stringify({ isLoggedIn: true, role: "admin" })
      );
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    setIsLoggedIn(true);
    setRole("guest");
    localStorage.setItem(
      "auth",
      JSON.stringify({ isLoggedIn: true, role: "guest" })
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole("guest");
    localStorage.removeItem("auth");
  };

  // Always provide context, but return loading state if not hydrated
  const value: AuthContextType = {
    isLoggedIn,
    role,
    login,
    loginAsGuest,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
