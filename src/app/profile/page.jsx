"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/profile.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [recentFootprint, setRecentFootprint] = useState(null);

  const router = useRouter();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/identity");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push("/identity");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
        setEditUsername(data.username);
        setEditEmail(data.email);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchRecentFootprint = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/footprints?limit=1&sort=desc`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) setRecentFootprint(data[0]);
      } catch {}
    };

    fetchRecentFootprint();
  }, [user, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateMessage("");

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update profile");

      setUser(data);
      setUpdateMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordSuccess("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    try {
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
      <h1 className="profile-title">
        {user ? `${user.username}'s Profile` : "My Profile"}
      </h1>

      {updateMessage && <div className="success-banner">{updateMessage}</div>}

      {user ? (
        <div className="profile-grid">
          <div className="profile-box">
            <h2>Account Details</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <label>Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />

              <label>Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />

              <button type="submit">Update Profile</button>
            </form>
          </div>

          <div className="profile-box">
            <h2>Security</h2>
            <form onSubmit={handlePasswordChange} className="password-form">
              <label>New Password</label>
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

          <div className="profile-box profile-box-activity">
            <h2>Recent Activity</h2>
            {user.last_login_at ? (
              <p>
                <strong>Last Login:</strong>{" "}
                {new Date(user.last_login_at).toLocaleString()}
              </p>
            ) : (
              <p>No login activity yet</p>
            )}
            {recentFootprint ? (
              <p>
                <strong>Last Footprint Added:</strong>{" "}
                {recentFootprint.activity_type} – {recentFootprint.carbon_kg} kg
                on {new Date(recentFootprint.created_at).toLocaleString()}
              </p>
            ) : (
              <p>No footprints added yet</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
