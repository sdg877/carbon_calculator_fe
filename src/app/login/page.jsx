"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email, // OAuth2PasswordRequestForm expects `username`
          password: password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        // FastAPI sometimes returns a list in "detail", sometimes a string
        if (Array.isArray(errData.detail)) {
          setError(errData.detail[0].msg);
        } else {
          setError(errData.detail);
        }
        return;
      }

      const data = await res.json();
      console.log("Logged in:", data);
      localStorage.setItem("token", data.access_token);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
