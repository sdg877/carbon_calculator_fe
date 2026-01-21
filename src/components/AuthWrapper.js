"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/profile", "/footprint"];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const loginUrl = `/identity?redirect=${encodeURIComponent(pathname)}`;

      if (!token) {
        setIsAuthenticated(false);
        if (protectedRoutes.includes(pathname)) router.push(loginUrl);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          if (protectedRoutes.includes(pathname)) router.push(loginUrl);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (protectedRoutes.includes(pathname)) router.push(loginUrl);
      }
      setLoading(false);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 10000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  if (loading && protectedRoutes.includes(pathname)) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
