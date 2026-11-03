"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import "@/styles/dashboard.css";
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
  transport: "#A29BFE",
  flights: "#D6A2E8",
  leisure: "#E0D7FF",
  energy: "#74B9FF",
  services: "#81ECEC",
  travel: "#7499FF",
  commuting: "#A5D8FF",
  food: "#B2BEC3",
  shopping: "#636E72",
  housing: "#D1D8E0",
  waste: "#ADD8E6",
  other: "#8FBC8F",
};

const DEMO_DATA = [
  { id: 1, carbon_kg: 5.5, created_at: "2025-09-04", raw_type: "commuting" },
  { id: 2, carbon_kg: 1.2, created_at: "2025-09-04", raw_type: "food" },
  { id: 3, carbon_kg: 8.9, created_at: "2025-10-09", raw_type: "energy" },
  { id: 4, carbon_kg: 4.1, created_at: "2025-10-14", raw_type: "transport" },
  { id: 5, carbon_kg: 2.7, created_at: "2025-10-14", raw_type: "food" },
  { id: 6, carbon_kg: 15.0, created_at: "2025-11-19", raw_type: "shopping" },
  { id: 7, carbon_kg: 150.0, created_at: "2025-11-22", raw_type: "flights" },
];

const DEMO_GLOBAL_AVG = [
  { created_at: "2025-09-04", carbon_kg: 9.4 },
  { created_at: "2025-10-09", carbon_kg: 11.2 },
  { created_at: "2025-10-14", carbon_kg: 8.6 },
  { created_at: "2025-11-19", carbon_kg: 12.1 },
  { created_at: "2025-11-22", carbon_kg: 10.3 },
];

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

const formatCategory = (raw) => {
  const str = String(raw || "").toLowerCase();
  if (/transport|car|bus|train|tube/.test(str)) return "transport";
  if (/energy|electricity/.test(str)) return "energy";
  if (/food|diet/.test(str)) return "food";
  if (/shop/.test(str)) return "shopping";
  if (/waste|recycle/.test(str)) return "waste";
  if (/flight|plane/.test(str)) return "flights";
  if (/commut/.test(str)) return "commuting";
  return "other";
};

const getMonthLabel = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { key: "0000-00", label: "Unknown" };
  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    }),
  };
};

const toDayKey = (dateStr) => String(dateStr || "").slice(0, 10);

const formatDayLabel = (dayKey) => {
  const date = new Date(dayKey);
  if (isNaN(date.getTime())) return dayKey;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function DashboardPage() {
  const [footprints, setFootprints] = useState([]);
  const [globalAverages, setGlobalAverages] = useState([]);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsDemoMode(true);
      setFootprints(
        DEMO_DATA.map((d) => ({
          ...d,
          display_date: d.created_at,
          activity_type: toTitleCase(d.raw_type),
        })),
      );
      setGlobalAverages(DEMO_GLOBAL_AVG);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${API_URL}/footprints/self`, { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();

      setFootprints(
        data.map((item) => {
          const category = formatCategory(item.activity_type);
          return {
            ...item,
            raw_type: category,
            activity_type: toTitleCase(category),
            display_date: item.entry_date || item.created_at,
          };
        }),
      );
    } catch {
      setError("Could not load your data.");
    }

    try {
      const avgRes = await fetch(`${API_URL}/footprints/all`, { headers });
      if (avgRes.ok) {
        setGlobalAverages(await avgRes.json());
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryData = useMemo(() => {
    const totals = {};
    footprints.forEach((fp) => {
      const type = fp.raw_type || "other";
      totals[type] = (totals[type] || 0) + (Number(fp.carbon_kg) || 0);
    });
    return Object.entries(totals).map(([key, val]) => ({
      raw_type: key,
      activity_type: toTitleCase(key),
      carbon_kg: val,
    }));
  }, [footprints]);

  const monthlyData = useMemo(() => {
    const months = {};
    footprints.forEach((fp) => {
      const { key, label } = getMonthLabel(fp.display_date);
      if (!months[key])
        months[key] = { month_start: label, carbon_kg: 0, sortKey: key };
      months[key].carbon_kg += Number(fp.carbon_kg) || 0;
    });
    return Object.values(months).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey),
    );
  }, [footprints]);

  const comparisonData = useMemo(() => {
    const days = {};

    footprints.forEach((fp) => {
      const key = toDayKey(fp.display_date);
      if (!key) return;
      if (!days[key]) days[key] = { day: key, you: 0, global: null };
      days[key].you += Number(fp.carbon_kg) || 0;
    });

    globalAverages.forEach((row) => {
      const key = toDayKey(row.entry_date || row.created_at);
      if (!key) return;
      if (!days[key]) days[key] = { day: key, you: null, global: null };
      days[key].global = Number(row.carbon_kg) || 0;
    });

    return Object.values(days)
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ ...d, label: formatDayLabel(d.day) }));
  }, [footprints, globalAverages]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {footprints.length > 0 ? (
          <>
            <h1 className="dashboard-title">
              My Carbon Dashboard {isDemoMode && "(Demo)"}
            </h1>

            {isDemoMode && (
              <p className="demo-message">
                Viewing demo data. Log in to see your own.
              </p>
            )}
            {error && <p className="error">{error}</p>}

            <div className="dashboard-grid">
              <div className="chart-card">
                <h2>By Activity</h2>
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="carbon_kg"
                      nameKey="activity_type"
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 45 : 65}
                      outerRadius={isMobile ? 70 : 100}
                      stroke="none"
                    >
                      {categoryData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={CATEGORY_COLOURS[entry.raw_type] || "#999"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h2>Monthly Total</h2>
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="month_start"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [`${v.toFixed(1)} kg`, "Carbon"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbon_kg"
                      stroke="#4d7c8a"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {globalAverages.length > 0 && (
                <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
                  <h2>You vs Global Average (Daily)</h2>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 280 : 350}
                  >
                    <LineChart
                      data={comparisonData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(v, name) => [
                          `${Number(v).toFixed(1)} kg`,
                          name,
                        ]}
                      />
                      <Legend verticalAlign="bottom" iconType="circle" />
                      <Line
                        type="monotone"
                        dataKey="you"
                        name="You"
                        stroke="#4d7c8a"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="global"
                        name="Global average"
                        stroke="#A29BFE"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-dashboard-container">
            <div className="welcome-card">
              <div className="welcome-icon">🌱</div>
              <h1>Welcome to your Green Journey!</h1>
              <p>
                Your dashboard is ready, it just needs some data to come to
                life.
              </p>

              <div className="onboarding-steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <p>
                    Track your first activity (commute, meal, or energy use).
                  </p>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <p>See your footprint broken down by category.</p>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <p>Set goals and reduce your impact over time.</p>
                </div>
              </div>

              <Link href="/footprint" className="start-button">
                Track My First Activity
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
