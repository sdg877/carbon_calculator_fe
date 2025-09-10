"use client";

import { useEffect, useState, useMemo } from "react";
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

const CATEGORY_COLOURS = {
  transport: "#6DBF73", 
  energy: "#4E91D9", 
  food: "#F5A15A",
  shopping: "#E57373",
  waste: "#9B6DD6",
  other: "#4DD0B2",
  travel: "#FFB86C", 
  services: "#64B5F6", 
  housing: "#81C784",
  leisure: "#BA68C8",
  flights: "#FF8A65",
  commuting: "#AED581",
};


const FALLBACK_COLOURS = [
  "#A084E8", 
  "#C3AED6",
  "#FFD2B8",
  "#9AE6B4",
  "#84A0E8",
  "#FFAB91",
  "#7DD8C0",
  "#F5B860",
  "#E07878",
  "#A8C8F0",
  "#D9A8E5",
  "#FFC973",
  "#A2D0C1",
  "#E6A0A0",
  "#C9B0E0",
  "#A0C881",
  "#C6B6D2",
  "#FFD891",
  "#82B7D6", 
];

const toTitleCase = (str) =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalise = (raw) =>
  String(raw || "")
    .replace(/\s+/g, "_")
    .trim()
    .toLowerCase();

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
          raw_type: normalise(item.activity_type),
          created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
        }));
        setFootprints(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFootprints();
  }, []);

  const aggregatedByCategory = useMemo(() => {
    const map = {};
    const categoryColors = { ...CATEGORY_COLOURS };
    const allCategories = new Set(footprints.map(f => f.raw_type));
    let fallbackIndex = 0;

    allCategories.forEach(category => {
      if (!categoryColors[category]) {
        categoryColors[category] = FALLBACK_COLOURS[fallbackIndex % FALLBACK_COLOURS.length];
        fallbackIndex++;
      }
    });

    for (const row of footprints) {
      const key = row.raw_type || "other";
      const value = Number(row.carbon_kg) || 0;
      if (!map[key]) {
        map[key] = {
          raw_type: key,
          activity_type: toTitleCase(key),
          carbon_kg: 0,
          color: categoryColors[key],
        };
      }
      map[key].carbon_kg += value;
    }
    return Object.values(map);
  }, [footprints]);

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
                  data={aggregatedByCategory}
                  dataKey="carbon_kg"
                  nameKey="activity_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {aggregatedByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(2)} Carbon KG`,
                    toTitleCase(name),
                  ]} 
                />
                <Legend
                  payload={aggregatedByCategory.map((a) => ({
                    id: a.raw_type,
                    value: `${toTitleCase(a.raw_type)} (${a.carbon_kg.toFixed(2)} Carbon KG)`,
                    type: "square",
                    color: a.color,
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-card">
            <h2>Carbon Footprint Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={footprints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="created_at" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="carbon_kg"
                  stroke={CATEGORY_COLOURS.transport}
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