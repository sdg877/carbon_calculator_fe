"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/forms.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Register user
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Registration failed");
        return;
      }

      // Auto login using the same logic as LoginPage
      const loginRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email, // OAuth2PasswordRequestForm expects `username`
          password: password,
        }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        if (Array.isArray(errData.detail)) {
          setError(errData.detail[0].msg);
        } else {
          setError(errData.detail || "Login failed after registration");
        }
        return;
      }

      const data = await loginRes.json();
      localStorage.setItem("token", data.access_token);

      setSuccess("Registration successful! You are now logged in.");
      setUsername("");
      setEmail("");
      setPassword("");

      router.push("/dashboard"); // redirect after login
    } catch (err) {
      setError("Server error, please try again");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
