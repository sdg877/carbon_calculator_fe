"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    window.addEventListener("auth", handleAuthChange);

    return () => window.removeEventListener("auth", handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
