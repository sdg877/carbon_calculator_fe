"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => setLoggedIn(!!localStorage.getItem("token"));

    checkToken();

    const handleStorage = () => {
      checkToken();
    };

    const handleAuth = (e) => {
      if (e && e.detail && typeof e.detail.loggedIn !== "undefined") {
        setLoggedIn(!!e.detail.loggedIn);
      } else {
        checkToken();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth", handleAuth);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth", handleAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);

    window.dispatchEvent(
      new CustomEvent("auth", { detail: { loggedIn: false } })
    );

    try {
      localStorage.setItem("__auth_changed_at", Date.now().toString());
    } catch (err) {}
    router.push("/identity");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">CarbonCalc</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/footprint">Add Activity</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        {!loggedIn && (
          <li>
            <Link href="/identity">Login</Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
