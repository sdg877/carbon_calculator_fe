"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/identity");
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}