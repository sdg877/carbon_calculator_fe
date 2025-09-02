"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/login"; // redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">CarbonCalc</Link>
      </div>
      <ul className="navbar-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/footprint">Add Activity</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        {!loggedIn && <li><Link href="/login">Login</Link></li>}
        {!loggedIn && <li><Link href="/register">Register</Link></li>}
        {loggedIn && <li><button onClick={handleLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
}
