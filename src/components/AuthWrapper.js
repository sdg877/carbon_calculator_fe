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


  const protectedRoutes = ["/profile", "/footprint", "/dashboard"];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        if (protectedRoutes.includes(pathname)) {
          router.push("/identity");
        }
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          if (protectedRoutes.includes(pathname)) router.push("/identity");
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (protectedRoutes.includes(pathname)) router.push("/identity");
      }
      setLoading(false);
    };

    checkAuth();
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