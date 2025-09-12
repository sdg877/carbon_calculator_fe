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

// // Please replace this with your actual API URL
// const API_URL = "http://localhost:8000";

// const CATEGORY_COLOURS = {
//   transport: "#6DBF73",
//   energy: "#4E91D9",
//   food: "#F5A15A",
//   shopping: "#E57373",
//   waste: "#9B6DD6",
//   other: "#4DD0B2",
//   travel: "#FFB86C",
//   services: "#64B5F6",
//   housing: "#81C784",
//   leisure: "#BA68C8",
//   flights: "#FF8A65",
//   commuting: "#AED581",
// };

// const FALLBACK_COLOURS = [
//   "#A084E8",
//   "#C3AED6",
//   "#FFD2B8",
//   "#9AE6B4",
//   "#84A0E8",
//   "#FFAB91",
//   "#7DD8C0",
//   "#F5B860",
//   "#E07870",
//   "#A8C8F0",
//   "#D9A8E5",
//   "#FFC973",
//   "#A2D0C1",
//   "#E6A0A0",
//   "#C9B0E0",
//   "#A0C881",
//   "#C6B6D2",
//   "#FFD891",
//   "#82B7D6",
// ];

// const toTitleCase = (str) =>
//   str
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");

// const normalise = (raw) =>
//   String(raw || "")
//     .replace(/\s+/g, "_")
//     .trim()
//     .toLowerCase();

// export default function DashboardPage() {
//   const [userFootprints, setUserFootprints] = useState([]);
//   const [allFootprints, setAllFootprints] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const userRes = await fetch(`${API_URL}/footprints/self`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const allRes = await fetch(`${API_URL}/footprints/all`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!userRes.ok || !allRes.ok)
//           throw new Error("Failed to fetch footprint data");

//         const userData = await userRes.json();
//         const allData = await allRes.json();

//         const formattedUserData = userData.map((item) => ({
//           ...item,
//           raw_type: normalise(item.activity_type),
//           created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
//         }));
//         setUserFootprints(formattedUserData);
//         setAllFootprints(allData);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchData();
//   }, []);

//   const aggregatedByCategory = useMemo(() => {
//     const map = {};
//     const categoryColors = { ...CATEGORY_COLOURS };
//     const allCategories = new Set(userFootprints.map((f) => f.raw_type));
//     let fallbackIndex = 0;

//     allCategories.forEach((category) => {
//       if (!categoryColors[category]) {
//         categoryColors[category] =
//           FALLBACK_COLOURS[fallbackIndex % FALLBACK_COLOURS.length];
//         fallbackIndex++;
//       }
//     });

//     for (const row of userFootprints) {
//       const key = row.raw_type || "other";
//       const value = Number(row.carbon_kg) || 0;
//       if (!map[key]) {
//         map[key] = {
//           raw_type: key,
//           activity_type: toTitleCase(key),
//           carbon_kg: 0,
//           color: categoryColors[key],
//         };
//       }
//       map[key].carbon_kg += value;
//     }
//     return Object.values(map);
//   }, [userFootprints]);

//   const aggregatedByDate = useMemo(() => {
//     const map = {};
//     for (const fp of userFootprints) {
//       const date = fp.created_at;
//       map[date] = map[date] || { created_at: date, user_carbon_kg: 0 };
//       map[date].user_carbon_kg += Number(fp.carbon_kg) || 0;
//     }
//     return Object.values(map);
//   }, [userFootprints]);

//   const allAggregatedByDate = useMemo(() => {
//     const map = {};
//     const dailyUserTotals = {};

//     for (const fp of allFootprints) {
//       const date = new Date(fp.created_at).toLocaleDateString("en-GB");
//       const userId = fp.user_id;
      
//       if (!dailyUserTotals[date]) {
//         dailyUserTotals[date] = {};
//       }
//       if (!dailyUserTotals[date][userId]) {
//         dailyUserTotals[date][userId] = 0;
//       }
//       dailyUserTotals[date][userId] += Number(fp.carbon_kg) || 0;
//     }

//     const dailyAverages = {};
//     for (const date in dailyUserTotals) {
//       const userIds = Object.keys(dailyUserTotals[date]);
//       const totalForDay = userIds.reduce((sum, userId) => sum + dailyUserTotals[date][userId], 0);
//       dailyAverages[date] = totalForDay / userIds.length;
//     }

//     return Object.keys(dailyAverages).map(date => ({
//       created_at: date,
//       average_carbon_kg: dailyAverages[date],
//     }));
//   }, [allFootprints]);

//   const mergedData = useMemo(() => {
//     const allDates = [...new Set([...aggregatedByDate.map(d => d.created_at), ...allAggregatedByDate.map(d => d.created_at)])];
//     const map = {};
    
//     allDates.forEach(date => {
//       map[date] = { created_at: date };
//     });

//     aggregatedByDate.forEach(item => {
//       map[item.created_at].user_carbon_kg = item.user_carbon_kg;
//     });

//     allAggregatedByDate.forEach(item => {
//       map[item.created_at].average_carbon_kg = item.average_carbon_kg;
//     });
    
//     return Object.values(map).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//   }, [aggregatedByDate, allAggregatedByDate]);

//   if (error) return <div className="dashboard-container error">{error}</div>;
  
//   if (userFootprints.length === 0) {
//     return <div className="dashboard-container"><p>No footprint data available yet.</p></div>
//   }

//   return (
//     <div className="dashboard-container">
//       <h1>My Carbon Dashboard</h1>

//       <>
//         <div className="chart-card">
//           <h2>Carbon Footprint by Activity</h2>
//           <ResponsiveContainer width="100%" height={400}>
//             <PieChart>
//               <Pie
//                 data={aggregatedByCategory}
//                 dataKey="carbon_kg"
//                 nameKey="activity_type"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label
//               >
//                 {aggregatedByCategory.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>

//               <Tooltip
//                 formatter={(value, name) => [
//                   `${value.toFixed(2)} Carbon KG`,
//                   toTitleCase(name),
//                 ]}
//               />
//               <Legend
//                 payload={aggregatedByCategory.map((a) => ({
//                   id: a.raw_type,
//                   value: `${toTitleCase(a.raw_type)} (${a.carbon_kg.toFixed(2)} Carbon KG)`,
//                   type: "square",
//                   color: a.color,
//                 }))}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <hr />
//         <div className="chart-card">
//           <h2>Your Carbon Footprint Over Time</h2>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={mergedData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="created_at" />
//               <YAxis
//                 label={{
//                   value: "Carbon KG",
//                   angle: -90,
//                   position: "insideLeft",
//                 }}
//               />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="user_carbon_kg"
//                 stroke="#4E91D9"
//                 strokeWidth={2}
//                 name="Your Emissions"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="average_carbon_kg"
//                 stroke="#FF8A65"
//                 strokeDasharray="5 5"
//                 strokeWidth={2}
//                 name="Average Emissions"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  initializeApp
} from "firebase/app";

// --- CONSOLIDATED AUTH CONTEXT ---
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    authToken: null
  });

  useEffect(() => {
    // These globals are provided by the environment
    const __initial_auth_token = typeof window !== 'undefined' && typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    
    // Check if firebase is already initialized
    if (!firebaseConfig.apiKey) {
      console.error("Firebase config is missing. Please check your environment.");
      return;
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleAuth = async () => {
      try {
        if (__initial_auth_token) {
          const userCredential = await signInWithCustomToken(auth, __initial_auth_token);
          const user = userCredential.user;
          const token = await user.getIdToken();
          setAuthState({ isAuthenticated: true, user, authToken: token });
        } else {
          // Fallback to anonymous auth if custom token is not provided
          await signInAnonymously(auth);
          setAuthState({ isAuthenticated: true, user: auth.currentUser, authToken: null });
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(token => {
          setAuthState({ isAuthenticated: true, user, authToken: token });
        });
      } else {
        setAuthState({ isAuthenticated: false, user: null, authToken: null });
        handleAuth(); // Try to authenticate again if no user is found
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
// --- END AUTH CONTEXT ---

// --- CONSOLIDATED MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative p-8 bg-white w-96 max-h-[80vh] mx-auto rounded-xl shadow-lg transform transition-all scale-100 opacity-100 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
// --- END MODAL COMPONENT ---

// --- CONSOLIDATED ADD FOOTPRINT FORM ---
const AddFootprintForm = ({ onClose, onAddSuccess }) => {
  const { authState } = useAuth();
  const [activityType, setActivityType] = useState('');
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const getLabelForField = (field) => {
    switch (field) {
      case 'distance_km': return 'Distance (km)';
      case 'gallons_used': return 'Gallons Used';
      case 'kwh': return 'kWh';
      case 'flight_km': return 'Flight Distance (km)';
      case 'fuel_type': return 'Fuel Type';
      case 'food_type': return 'Food Type';
      case 'waste_kg': return 'Waste (kg)';
      default: return field;
    }
  };

  const formFields = {
    transportation: ['distance_km', 'fuel_type'],
    energy: ['kwh'],
    food: ['food_type'],
    waste: ['waste_kg'],
    flight: ['flight_km'],
  };

  const handleDetailsChange = (e) => {
    const { name, value, type } = e.target;
    setDetails(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const footprintData = {
      activity_type: activityType,
      details: details,
    };

    try {
      const response = await fetch('/api/footprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.authToken}`,
        },
        body: JSON.stringify(footprintData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add footprint.');
      }

      setMessage({ text: 'Footprint added successfully!', type: 'success' });
      setTimeout(() => {
        onAddSuccess();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error adding footprint:', error);
      setMessage({ text: error.message || 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700">
          Activity Type
        </label>
        <select
          id="activity_type"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>Select an activity...</option>
          <option value="transportation">Transportation</option>
          <option value="energy">Energy</option>
          <option value="food">Food</option>
          <option value="waste">Waste</option>
          <option value="flight">Flight</option>
        </select>
      </div>

      {activityType && formFields[activityType] && (
        <div className="space-y-2">
          {formFields[activityType].map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">{getLabelForField(field)}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={details[field] || ''}
                onChange={handleDetailsChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
          {isLoading ? 'Adding...' : 'Add Footprint'}
        </button>
      </div>
    </form>
  );
};
// --- END ADD FOOTPRINT FORM ---


// MAIN DASHBOARD COMPONENT
const DashboardPage = ({ onNavigate }) => {
  const { authState } = useAuth();
  const [userFootprints, setUserFootprints] = useState([]);
  const [allFootprints, setAllFootprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const aggregateData = (data) => {
    const dailyTotals = {};
    data.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString();
      if (!dailyTotals[date]) {
        dailyTotals[date] = 0;
      }
      dailyTotals[date] += item.carbon_kg;
    });
    return Object.keys(dailyTotals).map(date => ({ date, carbon_kg: dailyTotals[date] }));
  };

  const userAggregatedByDate = aggregateData(userFootprints);
  const allAggregatedByDate = aggregateData(allFootprints);
  
  // Calculate average by dividing the total aggregated by a hardcoded number of users (for demonstration)
  const averageAggregatedByDate = allAggregatedByDate.map(item => ({ ...item, carbon_kg: item.carbon_kg / 10 }));

  const userChartData = userAggregatedByDate.map(d => ({ date: d.date, 'Your Emissions': d.carbon_kg }));
  const allChartData = averageAggregatedByDate.map(d => ({ date: d.date, 'Average Emissions': d.carbon_kg }));

  const combinedChartData = userChartData.map(userItem => {
    const allItem = allChartData.find(item => item.date === userItem.date) || {};
    return {
      date: userItem.date,
      'Your Emissions': userItem['Your Emissions'],
      'Average Emissions': allItem['Average Emissions'] || 0
    };
  });

  useEffect(() => {
    const fetchFootprints = async () => {
      if (!authState.isAuthenticated) return;
      setIsLoading(true);

      const headers = {
        'Authorization': `Bearer ${authState.authToken}`,
        'Content-Type': 'application/json'
      };

      try {
        // Fetch user's own footprints
        const userResponse = await fetch('/api/footprints/self', { headers });
        const userData = await userResponse.json();
        setUserFootprints(userData);

        // Fetch all footprints to calculate the average
        const allResponse = await fetch('/api/footprints/all', { headers });
        const allData = await allResponse.json();
        setAllFootprints(allData);

        // Calculate total carbon for the user
        const totalCarbon = userData.reduce((sum, f) => sum + f.carbon_kg, 0);
        setTotalCarbon(totalCarbon);

        // Get the last set of suggestions
        const lastFootprint = userData[userData.length - 1];
        setSuggestions(lastFootprint?.suggested_offsets || []);

        // Fetch user points
        const pointsResponse = await fetch('/api/footprints/gamification', { headers });
        const pointsData = await pointsResponse.json();
        setTotalPoints(pointsData.points);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFootprints();
  }, [authState.isAuthenticated, authState.authToken]);

  const handleAddClick = () => {
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleBulkDeleteClick = async () => {
    setModalType('delete');
    setIsModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const response = await fetch('/api/footprints/bulk', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete footprints');
      }
      setIsModalOpen(false);
      setUserFootprints([]);
    } catch (error) {
      console.error('Error deleting footprints:', error);
    }
  };

  const refreshFootprints = async () => {
    setIsLoading(true);
    const headers = {
      'Authorization': `Bearer ${authState.authToken}`,
      'Content-Type': 'application/json'
    };
    try {
      const userResponse = await fetch('/api/footprints/self', { headers });
      const userData = await userResponse.json();
      setUserFootprints(userData);

      const allResponse = await fetch('/api/footprints/all', { headers });
      const allData = await allResponse.json();
      setAllFootprints(allData);

      const totalCarbon = userData.reduce((sum, f) => sum + f.carbon_kg, 0);
      setTotalCarbon(totalCarbon);
      const lastFootprint = userData[userData.length - 1];
      setSuggestions(lastFootprint?.suggested_offsets || []);

      const pointsResponse = await fetch('/api/footprints/gamification', { headers });
      const pointsData = await pointsResponse.json();
      setTotalPoints(pointsData.points);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <svg onClick={() => onNavigate('home')} className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800" role="button" aria-label="Back to home" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
          </svg>
          <h1 className="text-xl font-bold">Carbon Footprint Dashboard</h1>
        </div>
        <button onClick={handleAddClick} className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Add Footprint</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total CO₂ (kg)</span>
            <span className="text-2xl font-bold text-gray-800">{totalCarbon.toFixed(2)} kg</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Lifetime Points</span>
            <span className="text-2xl font-bold text-gray-800">{totalPoints}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">User ID</span>
            <span className="text-xs font-bold text-gray-800">{authState.user.uid}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Daily Carbon Emissions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Your Emissions" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Average Emissions" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Suggested Offsets</h2>
          <ul className="space-y-2">
            {suggestions.map((s, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <svg className="mt-1 mr-2 w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
        <button onClick={handleBulkDeleteClick} className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Delete All</span>
        </button>
      </footer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Add a new Footprint' : 'Confirm Deletion'}>
        {modalType === 'add' ? (
          <AddFootprintForm onClose={() => setIsModalOpen(false)} onAddSuccess={refreshFootprints} />
        ) : (
          <div>
            <p className="text-gray-700">Are you sure you want to delete all your footprints?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={confirmBulkDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <AuthProvider>{renderDashboard()}</AuthProvider>;
};

export default DashboardPage;
