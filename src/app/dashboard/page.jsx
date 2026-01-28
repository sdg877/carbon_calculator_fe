// "use client";

// import { useEffect, useState, useMemo } from "react";
// import Link from "next/link";
// import "../../styles/dashboard.css";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const CATEGORY_COLOURS = {
//   transport: "#A29BFE",
//   flights: "#D6A2E8",
//   leisure: "#E0D7FF",
//   energy: "#74B9FF",
//   services: "#81ECEC",
//   travel: "#7499FF",
//   commuting: "#A5D8FF",
//   food: "#B2BEC3",
//   shopping: "#636E72",
//   housing: "#D1D8E0",
//   waste: "#ADD8E6",
//   other: "#8FBC8F",
// };

// const DEMO_FOOTPRINTS = [
//   {
//     id: 1,
//     activity_type: "Commuting",
//     carbon_kg: 5.5,
//     created_at: "2025-09-04",
//     raw_type: "commuting",
//   },
//   {
//     id: 2,
//     activity_type: "Food",
//     carbon_kg: 1.2,
//     created_at: "2025-09-04",
//     raw_type: "food",
//   },
//   {
//     id: 3,
//     activity_type: "Energy",
//     carbon_kg: 8.9,
//     created_at: "2025-10-09",
//     raw_type: "energy",
//   },
//   {
//     id: 4,
//     activity_type: "Transport",
//     carbon_kg: 4.1,
//     created_at: "2025-10-14",
//     raw_type: "transport",
//   },
//   {
//     id: 5,
//     activity_type: "Food",
//     carbon_kg: 2.7,
//     created_at: "2025-10-14",
//     raw_type: "food",
//   },
//   {
//     id: 6,
//     activity_type: "Shopping",
//     carbon_kg: 15.0,
//     created_at: "2025-11-19",
//     raw_type: "shopping",
//   },
//   {
//     id: 7,
//     activity_type: "Flights",
//     carbon_kg: 150.0,
//     created_at: "2025-11-22",
//     raw_type: "flights",
//   },
// ];

// const normalise = (raw) =>
//   String(raw || "")
//     .replace(/_/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const mapCategory = (raw) => {
//   const key = raw.toLowerCase();
//   if (
//     key.includes("transport") ||
//     key.includes("car") ||
//     key.includes("bus") ||
//     key.includes("train") ||
//     key.includes("tube")
//   )
//     return "transport";
//   if (key.includes("energy") || key.includes("electricity")) return "energy";
//   if (key.includes("food") || key.includes("diet")) return "food";
//   if (key.includes("shop")) return "shopping";
//   if (key.includes("waste") || key.includes("recycle")) return "waste";
//   if (key.includes("flight") || key.includes("plane")) return "flights";
//   if (key.includes("commut")) return "commuting";
//   return "other";
// };

// const toTitleCase = (str) =>
//   str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

// const getMonthStart = (dateStr) => {
//   const date = new Date(dateStr);
//   if (isNaN(date.getTime())) return { key: "0000-00-01", display: "Unknown" };
//   const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-01`;
//   const display = date.toLocaleDateString("en-GB", {
//     month: "short",
//     year: "numeric",
//   });
//   return { key, display };
// };

// export default function DashboardPage() {
//   const [footprints, setFootprints] = useState([]);
//   const [error, setError] = useState("");
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const fetchFootprints = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setIsDemoMode(true);
//         setFootprints(
//           DEMO_FOOTPRINTS.map((item) => ({
//             ...item,
//             activity_type: toTitleCase(item.raw_type),
//           }))
//         );
//         return;
//       }
//       try {
//         const res = await fetch(`${API_URL}/footprints/self`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Failed");
//         const data = await res.json();
//         setFootprints(
//           data.map((item) => {
//             const mapped = mapCategory(normalise(item.activity_type));
//             const displayDate = item.entry_date || item.created_at;
//             return {
//               ...item,
//               raw_type: mapped,
//               activity_type: toTitleCase(mapped),
//               display_date: displayDate,
//             };
//           })
//         );
//       } catch (err) {
//         setError("Error loading data.");
//       }
//     };
//     fetchFootprints();
//   }, []);

//   const aggregatedByCategory = useMemo(() => {
//     const map = {};
//     footprints.forEach((row) => {
//       const key = row.raw_type || "other";
//       if (!map[key])
//         map[key] = {
//           raw_type: key,
//           activity_type: toTitleCase(key),
//           carbon_kg: 0,
//         };
//       map[key].carbon_kg += Number(row.carbon_kg) || 0;
//     });
//     return Object.values(map);
//   }, [footprints]);

//   const aggregatedByMonth = useMemo(() => {
//     const monthlyMap = {};
//     footprints.forEach((row) => {
//       const { key, display } = getMonthStart(row.display_date);
//       if (!monthlyMap[key])
//         monthlyMap[key] = { month_start: display, carbon_kg: 0, raw_date: key };
//       monthlyMap[key].carbon_kg += Number(row.carbon_kg) || 0;
//     });
//     return Object.values(monthlyMap).sort(
//       (a, b) => new Date(a.raw_date) - new Date(b.raw_date)
//     );
//   }, [footprints]);

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container">
//         <h1 className="dashboard-title">
//           My Carbon Dashboard{isDemoMode ? " (Demo)" : ""}
//         </h1>
//         {isDemoMode && (
//           <p className="demo-message">
//             Viewing Demo Data: Log in to track your personal footprint.
//           </p>
//         )}
//         {error && <p className="error">{error}</p>}

//         {footprints.length > 0 ? (
//           <div className="dashboard-grid">
//             <div className="chart-card">
//               <h2>By Activity</h2>
//               <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
//                 <PieChart>
//                   <Pie
//                     data={aggregatedByCategory}
//                     dataKey="carbon_kg"
//                     nameKey="activity_type"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={isMobile ? 70 : 100}
//                     innerRadius={isMobile ? 45 : 65}
//                     paddingAngle={0}
//                     stroke="none"
//                   >
//                     {aggregatedByCategory.map((entry, i) => (
//                       <Cell
//                         key={`cell-${i}`}
//                         fill={CATEGORY_COLOURS[entry.raw_type] || "#999999"}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend
//                     verticalAlign="bottom"
//                     align="center"
//                     iconType="circle"
//                     wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="chart-card">
//               <h2>Monthly Total</h2>
//               <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
//                 <LineChart
//                   data={aggregatedByMonth}
//                   margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f0f0f0"
//                   />
//                   <XAxis
//                     dataKey="month_start"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 10, fill: "#7f8c8d" }}
//                     dy={10}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 10, fill: "#7f8c8d" }}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       borderRadius: "10px",
//                       border: "none",
//                       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                     }}
//                     formatter={(v) => [`${v.toFixed(2)} kg`, "Carbon"]}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="carbon_kg"
//                     stroke="#4d7c8a"
//                     strokeWidth={3}
//                     dot={{
//                       r: 4,
//                       fill: "#4d7c8a",
//                       strokeWidth: 2,
//                       stroke: "#fff",
//                     }}
//                     activeDot={{ r: 6 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         ) : (
//           <div className="chart-card">
//             <p style={{ textAlign: "center" }}>
//               No data yet. Go to{" "}
//               <Link
//                 href="/footprint"
//                 style={{
//                   color: "#cd5b68",
//                   fontWeight: "bold",
//                   textDecoration: "underline",
//                 }}
//               >
//                 Add Activity
//               </Link>{" "}
//               to start tracking.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import "../../styles/dashboard.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

// --- Configuration & Constants ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORY_COLOURS = {
  transport: "#A29BFE", flights: "#D6A2E8", leisure: "#E0D7FF",
  energy: "#74B9FF", services: "#81ECEC", travel: "#7499FF",
  commuting: "#A5D8FF", food: "#B2BEC3", shopping: "#636E72",
  housing: "#D1D8E0", waste: "#ADD8E6", other: "#8FBC8F",
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

// --- Helper Functions ---
const toTitleCase = (str) => str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

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
    label: date.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
  };
};

// --- Main Component ---
export default function DashboardPage() {
  const [footprints, setFootprints] = useState([]);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Data Fetching
  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsDemoMode(true);
      setFootprints(DEMO_DATA.map(d => ({
        ...d,
        display_date: d.created_at,
        activity_type: toTitleCase(d.raw_type)
      })));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/footprints/self`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setFootprints(data.map(item => {
        const category = formatCategory(item.activity_type);
        return {
          ...item,
          raw_type: category,
          activity_type: toTitleCase(category),
          display_date: item.entry_date || item.created_at,
        };
      }));
    } catch {
      setError("Could not load your data.");
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Data Processing
  const categoryData = useMemo(() => {
    const totals = {};
    footprints.forEach(fp => {
      const type = fp.raw_type || "other";
      totals[type] = (totals[type] || 0) + (Number(fp.carbon_kg) || 0);
    });
    return Object.entries(totals).map(([key, val]) => ({
      raw_type: key,
      activity_type: toTitleCase(key),
      carbon_kg: val
    }));
  }, [footprints]);

  const monthlyData = useMemo(() => {
    const months = {};
    footprints.forEach(fp => {
      const { key, label } = getMonthLabel(fp.display_date);
      if (!months[key]) months[key] = { month_start: label, carbon_kg: 0, sortKey: key };
      months[key].carbon_kg += Number(fp.carbon_kg) || 0;
    });
    return Object.values(months).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [footprints]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          My Carbon Dashboard {isDemoMode && "(Demo)"}
        </h1>

        {isDemoMode && <p className="demo-message">Viewing demo data. Log in to see your own.</p>}
        {error && <p className="error">{error}</p>}

        {footprints.length > 0 ? (
          <div className="dashboard-grid">
            {/* Pie Chart Card */}
            <div className="chart-card">
              <h2>By Activity</h2>
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="carbon_kg"
                    nameKey="activity_type"
                    cx="50%" cy="50%"
                    innerRadius={isMobile ? 45 : 65}
                    outerRadius={isMobile ? 70 : 100}
                    stroke="none"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={CATEGORY_COLOURS[entry.raw_type] || "#999"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v.toFixed(1)} kg`} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart Card */}
            <div className="chart-card">
              <h2>Monthly Total</h2>
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month_start" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v.toFixed(1)} kg`, "Carbon"]} />
                  <Line type="monotone" dataKey="carbon_kg" stroke="#4d7c8a" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="chart-card empty-state">
            <p>No data yet. <Link href="/footprint">Add Activity</Link> to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}