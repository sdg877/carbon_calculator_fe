// "use client";
// import { useState, useEffect } from "react";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// // DO_IT_API_URL constant has been removed as it's no longer needed.

// export default function VolunteerPage() {
//   const [offsets, setOffsets] = useState([]);
//   const [doItOpportunities, setDoItOpportunities] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [doItError, setDoItError] = useState("");
//   const [location, setLocation] = useState(null);

//   // Effect to fetch theoretical offsets
//   useEffect(() => {
//     const fetchOffsets = async () => {
//       try {
//         const res = await fetch(`${API_URL}/offsets`);
//         if (!res.ok) throw new Error("Failed to fetch volunteering options");
//         const data = await res.json();
//         setOffsets(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchOffsets();
//   }, []);

//   // Effect to get user location and fetch Do-it opportunities
//   useEffect(() => {
//     // Function to fetch opportunities based on location
//     const fetchOpportunities = async (lat, lon, locationName = "London") => {
//       try {
//         const queryParams = new URLSearchParams({
//           keyword: "environment", // Focusing on environment-related opportunities
//           location: locationName,
//           lat: lat,
//           lon: lon,
//           maxResults: 10,
//         }).toString();

//         // **This is the key change:** Using the new, proxied URL.
//         const res = await fetch(`/api/do-it/api/volunteering/opportunities?${queryParams}`);
        
//         if (!res.ok) throw new Error("Failed to fetch local opportunities");
        
//         const data = await res.json();
//         setDoItOpportunities(data.value);
//         if (data.value.length === 0) {
//           setDoItError("No local opportunities found. Try checking other locations.");
//         } else {
//           setDoItError(""); // Clear error if opportunities are found
//         }
//       } catch (err) {
//         console.error("Do-it API error:", err);
//         setDoItError("Failed to load local volunteering opportunities.");
//       }
//     };

//     // Use the browser's Geolocation API to get the user's current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           fetchOpportunities(latitude, longitude, "My Location");
//         },
//         (err) => {
//           console.error("Geolocation error:", err);
//           // If geolocation fails, use a default location like London
//           setDoItError("Could not get your location. Displaying opportunities for London.");
//           setLocation({ latitude: 51.5074, longitude: -0.1278 }); // Coordinates for London
//           fetchOpportunities(51.5074, -0.1278);
//         }
//       );
//     } else {
//       setDoItError("Geolocation not supported by this browser. Displaying opportunities for London.");
//       setLocation({ latitude: 51.5074, longitude: -0.1278 });
//       fetchOpportunities(51.5074, -0.1278);
//     }
//   }, []); // Empty dependency array means this effect runs once on mount

//   const handleAddOffset = async (offsetId) => {
//     setSuccess("");
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/user/offsets`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ offset_id: offsetId }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.detail || "Failed to add offset");
//       }

//       setSuccess("Offset added to your profile!");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="volunteer-container">
//       <h1>Volunteering & Offsets</h1>
//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       <div className="live-opportunities-section">
//         <h2>Live Local Opportunities</h2>
//         <p>Powered by <a href="https://do-it.org/" target="_blank" rel="noopener noreferrer">Do-it.org</a></p>
        
//         {doItError && <p className="error">{doItError}</p>}

//         {doItOpportunities.length > 0 && (
//           <div className="opportunities-list">
//             {doItOpportunities.map((opportunity) => (
//               <div key={opportunity.opportunityId} className="opportunity-card">
//                 <h3>{opportunity.title}</h3>
//                 <p><strong>Organisation:</strong> {opportunity.organisationName}</p>
//                 <p><strong>Location:</strong> {opportunity.displayLocation}</p>
//                 <p>{opportunity.summary}</p>
//                 <a 
//                   href={opportunity.url} 
//                   target="_blank" 
//                   rel="noopener noreferrer" 
//                   className="button"
//                 >
//                   Learn More & Apply
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <hr />

//       <h2>Theoretical Carbon Offsets</h2>
//       <div className="offsets-list">
//         {offsets.map((offset) => (
//           <div key={offset.id} className="offset-card">
//             <h3>{offset.name}</h3>
//             <p>{offset.description}</p>
//             <p><strong>Estimated Offset:</strong> {offset.carbon_kg} kg CO₂</p>
//             <button onClick={() => handleAddOffset(offset.id)}>
//               Add to My Offsets
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VolunteerPage() {
  const [offsets, setOffsets] = useState([]);
  const [doItOpportunities, setDoItOpportunities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doItError, setDoItError] = useState("");
  const [location, setLocation] = useState(null);

  // Effect to fetch theoretical offsets
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

  // Effect to get user location and fetch Do-it opportunities
  useEffect(() => {
    // Function to fetch opportunities based on location
    const fetchOpportunities = async (params) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        
        const res = await fetch(`/api/do-it/api/volunteering/opportunities?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch local opportunities");
        
        const data = await res.json();
        setDoItOpportunities(data.value);
        if (data.value.length === 0) {
          setDoItError("No local opportunities found. Try checking other locations.");
        } else {
          setDoItError(""); // Clear error if opportunities are found
        }
      } catch (err) {
        console.error("Do-it API error:", err);
        setDoItError("Failed to load local volunteering opportunities.");
      }
    };

    // Use the browser's Geolocation API to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Use lat/lon for the query
          const params = {
            keyword: "environment",
            lat: latitude,
            lon: longitude,
            maxResults: 10,
          };
          fetchOpportunities(params);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // If geolocation fails, use a default location like London
          setDoItError("Could not get your location. Displaying opportunities for London.");
          setLocation({ latitude: 51.5074, longitude: -0.1278 }); // Coordinates for London
          
          // Use location string for the query
          const params = {
            keyword: "environment",
            location: "London", // This is the corrected value
            maxResults: 10,
          };
          fetchOpportunities(params);
        }
      );
    } else {
      setDoItError("Geolocation not supported by this browser. Displaying opportunities for London.");
      setLocation({ latitude: 51.5074, longitude: -0.1278 });
      
      const params = {
        keyword: "environment",
        location: "London",
        maxResults: 10,
      };
      fetchOpportunities(params);
    }
  }, []); // Empty dependency array means this effect runs once on mount

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

      {/* Section for Live Volunteering Opportunities */}
      <div className="live-opportunities-section">
        <h2>Live Local Opportunities</h2>
        <p>Powered by <a href="https://do-it.org/" target="_blank" rel="noopener noreferrer">Do-it.org</a></p>
        
        {doItError && <p className="error">{doItError}</p>}

        {doItOpportunities.length > 0 && (
          <div className="opportunities-list">
            {doItOpportunities.map((opportunity) => (
              <div key={opportunity.opportunityId} className="opportunity-card">
                <h3>{opportunity.title}</h3>
                <p><strong>Organisation:</strong> {opportunity.organisationName}</p>
                <p><strong>Location:</strong> {opportunity.displayLocation}</p>
                <p>{opportunity.summary}</p>
                <a 
                  href={opportunity.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button"
                >
                  Learn More & Apply
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Your original Offsets section */}
      <h2>Theoretical Carbon Offsets</h2>
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