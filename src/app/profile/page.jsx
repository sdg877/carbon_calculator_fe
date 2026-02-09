
"use client";
import { useState, useEffect } from "react";
import "@/styles/profile.css";

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
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchRecentFootprint = async () => {
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
  }, [token]);

  const getCurrentMonthRange = () => {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    return { startOfMonth, endOfMonth };
  };

  useEffect(() => {
    const monthName = new Date().toLocaleString("en-GB", {
      month: "long",
    });
    setCurrentMonthName(monthName);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchMonthlyTotal = async () => {
      try {
        const res = await fetch(`${API_URL}/footprints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        const total = data
          .filter((footprint) => {
            const createdAt = new Date(footprint.created_at);
            return createdAt >= startOfMonth && createdAt <= endOfMonth;
          })
          .reduce((sum, footprint) => sum + Number(footprint.carbon_kg), 0);

        setMonthlyTotal(total);
      } catch {}
    };

    fetchMonthlyTotal();
  }, [token, recentFootprint]);

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
                {recentFootprint.activity_type} –{" "}
                {recentFootprint.carbon_kg} kg on{" "}
                {new Date(recentFootprint.created_at).toLocaleString()}
              </p>
            ) : (
              <p>No footprints added yet</p>
            )}
                        <p>
              <strong>{currentMonthName} Total:</strong>{" "}
              {monthlyTotal.toFixed(2)} kg CO₂
            </p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
