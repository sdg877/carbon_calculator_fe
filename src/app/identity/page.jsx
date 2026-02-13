"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@/styles/identity.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

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
        new CustomEvent("auth", { detail: { loggedIn: true } }),
      );
      try {
        localStorage.setItem("__auth_changed_at", Date.now().toString());
      } catch (err) {}

      router.push(redirectTo);
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
        new CustomEvent("auth", { detail: { loggedIn: true } }),
      );
      try {
        localStorage.setItem("__auth_changed_at", Date.now().toString());
      } catch (err) {}

      setRegisterSuccess("Registration successful! You are now logged in.");
      router.push(redirectTo);
    } catch (err) {
      setRegisterError("Server error, please try again");
      console.error(err);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        {isLogin ? (
          <form onSubmit={handleLogin} className="authForm loginForm">
            <h2 className="cardTitle">Login</h2>
            {loginError && <p className="error">{loginError}</p>}
            <div className="formGroup">
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
            <div className="formGroup">
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
            <button type="submit" className="ctaButton" disabled={isLoading}>
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
            <div className="toggleContainer">
              <p className="paragraph">Don't have an account?</p>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="toggleButton"
              >
                Register here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="authForm registerForm">
            <h2 className="cardTitle">Create an Account</h2>
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && (
              <p className="success">
                Registration successful! You are now logged in.
              </p>
            )}
            <div className="formGroup">
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
            <div className="formGroup">
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
            <div className="formGroup">
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
            <button type="submit" className="ctaButton">
              Register
            </button>
            <div className="toggleContainer">
              <p className="paragraph">Already have an account?</p>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="toggleButton"
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

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
