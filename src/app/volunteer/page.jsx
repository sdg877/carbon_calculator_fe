"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VolunteerPage() {
  const [offsets, setOffsets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOffsets = async () => {
      try {
        const res = await fetch(`${API_URL}/offsets`);
        if (!res.ok) throw new Error("Failed to fetch volunteering options");
        const data = await res.json();
        setOffsets(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffsets();
  }, []);

  const handleAddOffset = async (offsetId) => {
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/offsets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offset_id: offsetId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to add offset");
      }

      setSuccess("Offset added to your profile!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="volunteer-container">
      <h1>Volunteering & Offsets</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="offsets-list">
        {offsets.map((offset) => (
          <div key={offset.id} className="offset-card">
            <h3>{offset.name}</h3>
            <p>{offset.description}</p>
            <p><strong>Estimated Offset:</strong> {offset.carbon_kg} kg CO₂</p>
            <button onClick={() => handleAddOffset(offset.id)}>
              Add to My Offsets
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
