"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const COLORS = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#e91e63",
  "#9c27b0",
  "#00bcd4",
];

export default function DashboardPage() {
  const [footprints, setFootprints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFootprints = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view the dashboard.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/footprints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch footprints");

        const data = await res.json();
        const formatted = data.map((item) => ({
          ...item,
          activity_type: item.activity_type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          completed_at: item.completed_at
            ? new Date(item.completed_at).toLocaleDateString()
            : "Not completed",
        }));
        setFootprints(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFootprints();
  }, []);

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>My Carbon Dashboard</h1>

      {footprints.length > 0 ? (
        <>
          <div className="chart-card">
            <h2>Carbon Footprint by Activity</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={footprints}
                  dataKey="carbon_kg"
                  nameKey="activity_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {footprints.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Carbon Footprint Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={footprints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="completed_at" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="carbon_kg"
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No footprint data available yet.</p>
      )}
    </div>
  );
}
