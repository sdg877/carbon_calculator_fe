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

const API_URL = "http://localhost:8000";

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
  "#E07870",
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
  const [userFootprints, setUserFootprints] = useState([]);
  const [allFootprints, setAllFootprints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const userRes = await fetch(`${API_URL}/footprints/self`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allRes = await fetch(`${API_URL}/footprints/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok || !allRes.ok)
          throw new Error("Failed to fetch footprint data");

        const userData = await userRes.json();
        const allData = await allRes.json();

        const formattedUserData = userData.map((item) => ({
          ...item,
          raw_type: normalise(item.activity_type),
          created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
        }));
        setUserFootprints(formattedUserData);
        setAllFootprints(allData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const aggregatedByCategory = useMemo(() => {
    const map = {};
    const categoryColors = { ...CATEGORY_COLOURS };
    const allCategories = new Set(userFootprints.map((f) => f.raw_type));
    let fallbackIndex = 0;

    allCategories.forEach((category) => {
      if (!categoryColors[category]) {
        categoryColors[category] =
          FALLBACK_COLOURS[fallbackIndex % FALLBACK_COLOURS.length];
        fallbackIndex++;
      }
    });

    for (const row of userFootprints) {
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
  }, [userFootprints]);

  const aggregatedByDate = useMemo(() => {
    const map = {};
    for (const fp of userFootprints) {
      const date = fp.created_at;
      map[date] = map[date] || { created_at: date, user_carbon_kg: 0 };
      map[date].user_carbon_kg += Number(fp.carbon_kg) || 0;
    }
    return Object.values(map);
  }, [userFootprints]);

  const allAggregatedByDate = useMemo(() => {
    const map = {};
    const dailyUserTotals = {};

    for (const fp of allFootprints) {
      const date = new Date(fp.created_at).toLocaleDateString("en-GB");
      const userId = fp.user_id;
      
      if (!dailyUserTotals[date]) {
        dailyUserTotals[date] = {};
      }
      if (!dailyUserTotals[date][userId]) {
        dailyUserTotals[date][userId] = 0;
      }
      dailyUserTotals[date][userId] += Number(fp.carbon_kg) || 0;
    }

    const dailyAverages = {};
    for (const date in dailyUserTotals) {
      const userIds = Object.keys(dailyUserTotals[date]);
      const totalForDay = userIds.reduce((sum, userId) => sum + dailyUserTotals[date][userId], 0);
      dailyAverages[date] = totalForDay / userIds.length;
    }

    return Object.keys(dailyAverages).map(date => ({
      created_at: date,
      average_carbon_kg: dailyAverages[date],
    }));
  }, [allFootprints]);

  const mergedData = useMemo(() => {
    const allDates = [...new Set([...aggregatedByDate.map(d => d.created_at), ...allAggregatedByDate.map(d => d.created_at)])];
    const map = {};
    
    allDates.forEach(date => {
      map[date] = { created_at: date };
    });

    aggregatedByDate.forEach(item => {
      map[item.created_at].user_carbon_kg = item.user_carbon_kg;
    });

    allAggregatedByDate.forEach(item => {
      map[item.created_at].average_carbon_kg = item.average_carbon_kg;
    });
    
    return Object.values(map).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [aggregatedByDate, allAggregatedByDate]);

  if (error) return <div className="dashboard-container error">{error}</div>;
  
  if (userFootprints.length === 0) {
    return <div className="dashboard-container"><p>No footprint data available yet.</p></div>
  }

  return (
    <div className="dashboard-container">
      <h1>My Carbon Dashboard</h1>

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
        <hr />
        <div className="chart-card">
          <h2>Your Carbon Footprint Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_at" />
              <YAxis
                label={{
                  value: "Carbon KG",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="user_carbon_kg"
                stroke="#4E91D9"
                strokeWidth={2}
                name="Your Emissions"
              />
              <Line
                type="monotone"
                dataKey="average_carbon_kg"
                stroke="#FF8A65"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Average Emissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    </div>
  );
}
