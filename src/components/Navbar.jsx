"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isMenuOpen ? "open" : ""}`}>
      <div className="navbar-logo">
        <Link href="/">CarbonCalc</Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="navbar-menu"
      >
        <div className="hamburger"></div>
      </button>

      <ul className="navbar-links" id="navbar-menu">
        <li>
          <Link href="/" onClick={handleLinkClick}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" onClick={handleLinkClick}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/footprint" onClick={handleLinkClick}>
            Add Activity
          </Link>
        </li>
        <li>
          <Link href="/profile" onClick={handleLinkClick}>
            Profile
          </Link>
        </li>
        {!loggedIn && (
          <li>
            <Link href="/identity" onClick={handleLinkClick}>
              Login
            </Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <button
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
