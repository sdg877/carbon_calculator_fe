"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/identity");
      return;
    }

    fetch(`${apiUrl}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/identity");
      }
    });
  }, [router, apiUrl]);

  return children;
}
