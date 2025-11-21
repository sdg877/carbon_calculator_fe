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
  transport:   "#6DBF73",
  energy:      "#4E91D9",
  food:        "#F5A15A",
  shopping:    "#E57373",
  waste:       "#9B6DD6",
  other:       "#4DD0B2",
  travel:      "#FFB86C",
  services:    "#64B5F6",
  housing:     "#81C784",
  leisure:     "#BA68C8",
  flights:     "#FF8A65",
  commuting:   "#AED581",
};


const normalise = (raw) =>
  String(raw || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const mapCategory = (raw) => {
  const key = raw.toLowerCase();

  if (key.includes("transport")) return "transport";
  if (key.includes("car")) return "transport";
  if (key.includes("bus")) return "transport";
  if (key.includes("train")) return "transport";

  if (key.includes("energy") || key.includes("electricity")) return "energy";

  if (key.includes("food") || key.includes("diet")) return "food";

  if (key.includes("shop")) return "shopping";

  if (key.includes("waste") || key.includes("recycle")) return "waste";

  if (key.includes("flight") || key.includes("plane")) return "flights";

  if (key.includes("commut")) return "commuting";

  return "other"; // fallback
};

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

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

        const formatted = data.map((item) => {
          const raw = normalise(item.activity_type);
          const mapped = mapCategory(raw);
          return {
            ...item,
            raw_type: mapped,
            activity_type: toTitleCase(mapped),
            created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
          };
        });

        setFootprints(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFootprints();
  }, []);

  const aggregatedByCategory = useMemo(() => {
    const map = {};
    for (const row of footprints) {
      const key = row.raw_type || "other";
      const value = Number(row.carbon_kg) || 0;
      if (!map[key]) {
        map[key] = {
          raw_type: key,
          activity_type: toTitleCase(key),
          carbon_kg: 0,
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
          {/* PIE CHART */}
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
                  {aggregatedByCategory.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={CATEGORY_COLOURS[entry.raw_type] || "#999999"} // fallback
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend
                  payload={aggregatedByCategory.map((a) => ({
                    id: a.raw_type,
                    value: `${a.activity_type} (${a.carbon_kg.toFixed(2)} kg)`,
                    type: "square",
                    color: CATEGORY_COLOURS[a.raw_type] || "#999999",
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LINE CHART */}
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
