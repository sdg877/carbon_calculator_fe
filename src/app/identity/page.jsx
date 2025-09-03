"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/forms.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: loginEmail,
          password: loginPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        const errorMessage = Array.isArray(errData.detail)
          ? errData.detail[0].msg
          : errData.detail;
        setLoginError(errorMessage || "Login failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    try {
      // Register user
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setRegisterError(data.detail || "Registration failed");
        return;
      }

      // Auto login
      const loginRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: registerEmail,
          password: registerPassword,
        }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        const errorMessage = Array.isArray(errData.detail)
          ? errData.detail[0].msg
          : errData.detail;
        setRegisterError(errorMessage || "Login failed after registration");
        return;
      }

      const data = await loginRes.json();
      localStorage.setItem("token", data.access_token);
      setRegisterSuccess("Registration successful! You are now logged in.");
      router.push("/dashboard");
    } catch (err) {
      setRegisterError("Server error, please try again");
    }
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <form onSubmit={handleLogin} className="login-form">
          <h1>Login</h1>
          {loginError && <p className="error">{loginError}</p>}
          <label>Email:</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="register-form">
          <h1>Register</h1>
          {registerError && <p className="error">{registerError}</p>}
          {registerSuccess && <p className="success">{registerSuccess}</p>}
          <label>Username:</label>
          <input
            type="text"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      )}
      <div className="toggle-button-container">
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}