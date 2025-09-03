"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the dashboard.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/footprints/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await res.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchActivities();
  }, []);

  const totalCarbon = activities.reduce((sum, a) => sum + (a.carbon_kg || 0), 0).toFixed(1);

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>My Dashboard</h1>

      <div className="summary">
        <h2>Summary</h2>
        <p>Total Activities: {activities.length}</p>
        <p>Total Carbon: {totalCarbon} kg CO₂</p>
      </div>

      <div className="history">
        <h2>Activity History</h2>
        {activities.length === 0 ? (
          <p>No activities logged yet.</p>
        ) : (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Carbon (kg)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td>{a.activity_type.replace(/_/g, " ")}</td>
                  <td>{a.carbon_kg.toFixed(1)}</td>
                  <td>{new Date(a.completed_at || a.created_at || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
