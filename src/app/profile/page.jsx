"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your profile.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setError("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update password");
      }

      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {user ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.last_login_at && (
            <p>
              <strong>Last Login:</strong>{" "}
              {new Date(user.last_login_at).toLocaleString()}
            </p>
          )}

          <form onSubmit={handlePasswordChange} className="password-form">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Update Password</button>
          </form>

          {passwordSuccess && <p className="success">{passwordSuccess}</p>}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
