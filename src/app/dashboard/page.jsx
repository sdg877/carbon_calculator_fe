// "use client";

// import { useEffect, useState, useMemo } from "react";
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
//   transport:   "#6DBF73",
//   energy:      "#4E91D9",
//   food:        "#F5A15A",
//   shopping:    "#E57373",
//   waste:       "#9B6DD6",
//   other:       "#4DD0B2",
//   travel:      "#FFB86C",
//   services:    "#64B5F6",
//   housing:     "#81C784",
//   leisure:     "#BA68C8",
//   flights:     "#FF8A65",
//   commuting:   "#AED581",
// };


// const normalise = (raw) =>
//   String(raw || "")
//     .replace(/_/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const mapCategory = (raw) => {
//   const key = raw.toLowerCase();

//   if (key.includes("transport")) return "transport";
//   if (key.includes("car")) return "transport";
//   if (key.includes("bus")) return "transport";
//   if (key.includes("train")) return "transport";

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

// export default function DashboardPage() {
//   const [footprints, setFootprints] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchFootprints = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("You must be logged in to view the dashboard.");
//         return;
//       }

//       try {
//         const res = await fetch(`${API_URL}/footprints`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch footprints");

//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const raw = normalise(item.activity_type);
//           const mapped = mapCategory(raw);
//           return {
//             ...item,
//             raw_type: mapped,
//             activity_type: toTitleCase(mapped),
//             created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
//           };
//         });

//         setFootprints(formatted);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchFootprints();
//   }, []);

//   const aggregatedByCategory = useMemo(() => {
//     const map = {};
//     for (const row of footprints) {
//       const key = row.raw_type || "other";
//       const value = Number(row.carbon_kg) || 0;
//       if (!map[key]) {
//         map[key] = {
//           raw_type: key,
//           activity_type: toTitleCase(key),
//           carbon_kg: 0,
//         };
//       }
//       map[key].carbon_kg += value;
//     }
//     return Object.values(map);
//   }, [footprints]);

//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="dashboard-container">
//       <h1>My Carbon Dashboard</h1>

//       {footprints.length > 0 ? (
//         <>
//           <div className="chart-card">
//             <h2>Carbon Footprint by Activity</h2>
//             <ResponsiveContainer width="100%" height={400}>
//               <PieChart>
//                 <Pie
//                   data={aggregatedByCategory}
//                   dataKey="carbon_kg"
//                   nameKey="activity_type"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={120}
//                   label
//                 >
//                   {aggregatedByCategory.map((entry, i) => (
//                     <Cell
//                       key={`cell-${i}`}
//                       fill={CATEGORY_COLOURS[entry.raw_type] || "#999999"} 
//                     />
//                   ))}
//                 </Pie>

//                 <Tooltip />
//                 <Legend
//                   payload={aggregatedByCategory.map((a) => ({
//                     id: a.raw_type,
//                     value: `${a.activity_type} (${a.carbon_kg.toFixed(2)} kg)`,
//                     type: "square",
//                     color: CATEGORY_COLOURS[a.raw_type] || "#999999",
//                   }))}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="chart-card">
//             <h2>Carbon Footprint Over Time</h2>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={footprints}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="created_at" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="carbon_kg"
//                   stroke={CATEGORY_COLOURS.transport}
//                   strokeWidth={2}
//                   dot={true}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </>
//       ) : (
//         <p>No footprint data available yet.</p>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useMemo } from "react";
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

// // --- Configuration and Data ---
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const CATEGORY_COLOURS = {
//   transport:   "#6DBF73",
//   energy:      "#4E91D9",
//   food:        "#F5A15A",
//   shopping:    "#E57373",
//   waste:       "#9B6DD6",
//   other:       "#4DD0B2",
//   travel:      "#FFB86C",
//   services:    "#64B5F6",
//   housing:     "#81C784",
//   leisure:     "#BA68C8",
//   flights:     "#FF8A65",
//   commuting:   "#AED581",
// };

// // Data used for portfolio showcase when the user is not logged in.
// const DEMO_FOOTPRINTS = [
//   { id: 1, activity_type: "Commuting", carbon_kg: 5.5, created_at: new Date(Date.now() - 86400000 * 3).toLocaleDateString("en-GB"), raw_type: "commuting" },
//   { id: 2, activity_type: "Food", carbon_kg: 1.2, created_at: new Date(Date.now() - 86400000 * 3).toLocaleDateString("en-GB"), raw_type: "food" },
//   { id: 3, activity_type: "Energy", carbon_kg: 8.9, created_at: new Date(Date.now() - 86400000 * 2).toLocaleDateString("en-GB"), raw_type: "energy" },
//   { id: 4, activity_type: "Transport", carbon_kg: 4.1, created_at: new Date(Date.now() - 86400000 * 1).toLocaleDateString("en-GB"), raw_type: "transport" },
//   { id: 5, activity_type: "Food", carbon_kg: 2.7, created_at: new Date().toLocaleDateString("en-GB"), raw_type: "food" },
//   { id: 6, activity_type: "Shopping", carbon_kg: 15.0, created_at: new Date().toLocaleDateString("en-GB"), raw_type: "shopping" },
// ];

// // --- Utility Functions (Unchanged) ---
// const normalise = (raw) =>
//   String(raw || "")
//     .replace(/_/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const mapCategory = (raw) => {
//   const key = raw.toLowerCase();

//   if (key.includes("transport") || key.includes("car") || key.includes("bus") || key.includes("train")) return "transport";
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

// // --- Component ---
// export default function DashboardPage() {
//   const [footprints, setFootprints] = useState([]);
//   const [error, setError] = useState("");
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   useEffect(() => {
//     const fetchFootprints = async () => {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         // Fallback to Demo Mode for unauthenticated users
//         setIsDemoMode(true);
//         setFootprints(DEMO_FOOTPRINTS);
//         return;
//       }

//       try {
//         const res = await fetch(`${API_URL}/footprints`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch footprints");

//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const raw = normalise(item.activity_type);
//           const mapped = mapCategory(raw);
//           return {
//             ...item,
//             raw_type: mapped,
//             activity_type: toTitleCase(mapped),
//             created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
//           };
//         });

//         setFootprints(formatted);
//         setError(""); // Clear error if successful
//       } catch (err) {
//         setError("Error loading your data. Please try again later.");
//         setFootprints([]); // Clear data on failure
//       }
//     };

//     fetchFootprints();
//   }, []);

//   const aggregatedByCategory = useMemo(() => {
//     const map = {};
//     for (const row of footprints) {
//       const key = row.raw_type || "other";
//       const value = Number(row.carbon_kg) || 0;
//       if (!map[key]) {
//         map[key] = {
//           raw_type: key,
//           activity_type: toTitleCase(key),
//           carbon_kg: 0,
//         };
//       }
//       map[key].carbon_kg += value;
//     }
//     return Object.values(map);
//   }, [footprints]);

//   // Display a full error if fetching failed for a logged-in user
//   if (!isDemoMode && error) return <div className="error">{error}</div>;

//   const titleSuffix = isDemoMode ? " (Demo Data)" : "";

//   return (
//     <div className="dashboard-container">
//       <h1>My Carbon Dashboard{titleSuffix}</h1>

//       {isDemoMode && (
//         <p className="demo-message">
//           **Viewing Demo Data:** Log in or Register to start tracking your own personal footprint.
//         </p>
//       )}

//       {footprints.length > 0 ? (
//         <>
//           <div className="chart-card">
//             <h2>Carbon Footprint by Activity</h2>
//             <ResponsiveContainer width="100%" height={400}>
//               <PieChart>
//                 <Pie
//                   data={aggregatedByCategory}
//                   dataKey="carbon_kg"
//                   nameKey="activity_type"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={120}
//                   innerRadius={60} // Added for Doughnut look
//                   paddingAngle={3} // Added for visual separation
//                   label
//                 >
//                   {aggregatedByCategory.map((entry, i) => (
//                     <Cell
//                       key={`cell-${i}`}
//                       fill={CATEGORY_COLOURS[entry.raw_type] || "#999999"} 
//                     />
//                   ))}
//                 </Pie>

//                 <Tooltip />
//                 <Legend
//                   layout="horizontal" // Ensures legend flows better on small screens
//                   payload={aggregatedByCategory.map((a) => ({
//                     id: a.raw_type,
//                     value: `${a.activity_type} (${a.carbon_kg.toFixed(2)} kg)`,
//                     type: "square",
//                     color: CATEGORY_COLOURS[a.raw_type] || "#999999",
//                   }))}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="chart-card">
//             <h2>Carbon Footprint Over Time</h2>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={footprints}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="created_at" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="carbon_kg"
//                   stroke={CATEGORY_COLOURS.transport} 
//                   strokeWidth={3} 
//                   dot={{ r: 5 }} 
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </>
//       ) : (
//         // Enhanced Empty State Message for logged-in users with no data
//         <div className="empty-dashboard">
//           <h2>Welcome to your Carbon Dashboard!</h2>
//           <p>
//             There's no data to display yet. Start tracking your daily activities to
//             see your footprint broken down by category and plotted **over time**.
//           </p>
//           <p>
//             To begin, navigate to the **Log Activity** page.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

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

// --- Configuration and Data ---
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

// Data used for portfolio showcase. Dates are set as 'DD/MM/YYYY' strings for consistency.
const DEMO_FOOTPRINTS = [
  { id: 1, activity_type: "Commuting", carbon_kg: 5.5, created_at: "04/09/2025", raw_type: "commuting" },
  { id: 2, activity_type: "Food", carbon_kg: 1.2, created_at: "04/09/2025", raw_type: "food" },
  { id: 3, activity_type: "Energy", carbon_kg: 8.9, created_at: "09/10/2025", raw_type: "energy" },
  { id: 4, activity_type: "Transport", carbon_kg: 4.1, created_at: "14/10/2025", raw_type: "transport" },
  { id: 5, activity_type: "Food", carbon_kg: 2.7, created_at: "14/10/2025", raw_type: "food" },
  { id: 6, activity_type: "Shopping", carbon_kg: 15.0, created_at: "19/11/2025", raw_type: "shopping" },
  { id: 7, activity_type: "Flights", carbon_kg: 150.0, created_at: "22/11/2025", raw_type: "flights" },
];

// --- Utility Functions ---
const normalise = (raw) =>
  String(raw || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const mapCategory = (raw) => {
  const key = raw.toLowerCase();
  if (key.includes("transport") || key.includes("car") || key.includes("bus") || key.includes("train")) return "transport";
  if (key.includes("energy") || key.includes("electricity")) return "energy";
  if (key.includes("food") || key.includes("diet")) return "food";
  if (key.includes("shop")) return "shopping";
  if (key.includes("waste") || key.includes("recycle")) return "waste";
  if (key.includes("flight") || key.includes("plane")) return "flights";
  if (key.includes("commut")) return "commuting";
  return "other"; 
};

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

/**
 * Safely parses DD/MM/YYYY string and returns the first day of that month.
 */
const getMonthStart = (dateStr) => {
    // Safely parse the DD/MM/YYYY string
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
        console.error("Invalid date format in data:", dateStr);
        return getMonthStart(new Date().toLocaleDateString("en-GB")); 
    }
    
    // Create new Date object: new Date(year, monthIndex, day)
    // We set day to 1 to get the start of the month.
    const date = new Date(parts[2], parts[1] - 1, 1); 

    if (isNaN(date.getTime())) {
         console.error("Date construction failed for:", dateStr);
         return getMonthStart(new Date().toLocaleDateString("en-GB"));
    }
    
    // YYYY-MM-01 for consistent keying and sorting
    const key = date.toISOString().slice(0, 10); 
    // Format for display (e.g., Nov 2025)
    const display = date.toLocaleDateString("en-GB", { month: 'short', year: 'numeric' });

    return { key, display };
};

// --- Component ---
export default function DashboardPage() {
  const [footprints, setFootprints] = useState([]);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchFootprints = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsDemoMode(true);
        const formattedDemo = DEMO_FOOTPRINTS.map(item => ({
            ...item,
            activity_type: toTitleCase(item.raw_type),
            created_at: item.created_at,
        }));
        setFootprints(formattedDemo);
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
            // Ensure date is a consistent DD/MM/YYYY string for getMonthStart
            created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
          };
        });

        setFootprints(formatted);
        setError("");
      } catch (err) {
        setError("Error loading your data. Please try again later.");
        setFootprints([]);
      }
    };

    fetchFootprints();
  }, []);

  // Calculate Aggregation by Category (for Pie Chart)
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
  
  // Calculate Aggregation by Month (for smoother Line Chart)
  const aggregatedByMonth = useMemo(() => {
    const monthlyMap = {};

    for (const row of footprints) {
      // Use the monthly grouping function
      const { key, display } = getMonthStart(row.created_at); 
      const value = Number(row.carbon_kg) || 0;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month_start: display, 
          carbon_kg: 0,
          raw_date: key, 
        };
      }
      monthlyMap[key].carbon_kg += value;
    }
    
    // Convert map to array and sort by date 
    return Object.values(monthlyMap).sort((a, b) => 
      new Date(a.raw_date) - new Date(b.raw_date)
    );

  }, [footprints]);


  // Display a full error if fetching failed for a logged-in user
  if (!isDemoMode && error) return <div className="error">{error}</div>;

  const titleSuffix = isDemoMode ? " (Demo Data)" : "";

  return (
    <div className="dashboard-container">
      <h1>My Carbon Dashboard{titleSuffix}</h1>

      {isDemoMode && (
        <p className="demo-message">
          **Viewing Demo Data:** Log in or Register to start tracking your own personal footprint.
        </p>
      )}

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
                  innerRadius={60}
                  paddingAngle={3} 
                  label
                >
                  {aggregatedByCategory.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={CATEGORY_COLOURS[entry.raw_type] || "#999999"} 
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend
                  layout="horizontal"
                  payload={aggregatedByCategory.map((a) => ({
                    id: a.raw_type,
                    value: `${a.carbon_kg.toFixed(2)} kg`, 
                    type: "square",
                    color: CATEGORY_COLOURS[a.raw_type] || "#999999",
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Carbon Footprint Over Time (Monthly Totals)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={aggregatedByMonth}> {/* Using monthly aggregated data */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month_start" // X-Axis now shows the start date of the month
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)} kg`, 'Monthly Carbon']} 
                />
                <Line
                  type="monotone"
                  dataKey="carbon_kg"
                  stroke={CATEGORY_COLOURS.transport}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="empty-dashboard">
          <h2>Welcome to your Carbon Dashboard!</h2>
          <p>
            There's no data to display yet. Start tracking your daily activities to
            see your footprint broken down by **category** and plotted **over time**.
          </p>
          <p>
            To begin, navigate to the **Log Activity** page.
          </p>
        </div>
      )}
    </div>
  );
}