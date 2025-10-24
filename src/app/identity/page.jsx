"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/forms.css"; // Ensure this path is correct

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
        const errData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.detail)
          ? errData.detail[0].msg
          : errData.detail || "Login failed";
        setLoginError(errorMessage);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      window.dispatchEvent(
        new CustomEvent("auth", { detail: { loggedIn: true } })
      );
      try {
        localStorage.setItem("__auth_changed_at", Date.now().toString());
      } catch (err) {
        // ignore
      }

      router.push("/dashboard");
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    try {
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
        const data = await res.json().catch(() => ({}));
        setRegisterError(data.detail || "Registration failed");
        return;
      }

      const loginRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: registerEmail,
          password: registerPassword,
        }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.detail)
          ? errData.detail[0].msg
          : errData.detail;
        setRegisterError(errorMessage || "Login failed after registration");
        return;
      }

      const data = await loginRes.json();
      localStorage.setItem("token", data.access_token);

      window.dispatchEvent(
        new CustomEvent("auth", { detail: { loggedIn: true } })
      );
      try {
        localStorage.setItem("__auth_changed_at", Date.now().toString());
      } catch (err) {}

      setRegisterSuccess("Registration successful! You are now logged in.");
      router.push("/dashboard");
    } catch (err) {
      setRegisterError("Server error, please try again");
      console.error(err);
    }
  };


  return (
    <div className="auth-page-background">
      <div className="auth-card">
        <h1 className="auth-title">CarbonCalc</h1>
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form login-form">
            <h2>Login to Your Account</h2>
            {loginError && <p className="error">{loginError}</p>}
            <div className="form-group">
              <label htmlFor="loginEmail">Email:</label>
              <input
                id="loginEmail"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password:</label>
              <input
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            <button type="submit" className="primary-button">
              Login
            </button>
            <div className="toggle-container">
              <p>Don't have an account?</p>
              <button 
                type="button" 
                onClick={() => setIsLogin(false)}
                className="toggle-button"
              >
                Register here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form register-form">
            <h2>Create an Account</h2>
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && <p className="success">{registerSuccess}</p>}
            <div className="form-group">
              <label htmlFor="registerUsername">Username:</label>
              <input
                id="registerUsername"
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerEmail">Email:</label>
              <input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword">Password:</label>
              <input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            <button type="submit" className="primary-button">
              Register
            </button>
            <div className="toggle-container">
              <p>Already have an account?</p>
              <button 
                type="button" 
                onClick={() => setIsLogin(true)}
                className="toggle-button"
              >
                Login here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}