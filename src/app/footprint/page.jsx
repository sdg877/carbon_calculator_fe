"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/forms.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CarbonFootprintForm() {
  const [activityType, setActivityType] = useState("");
  const [details, setDetails] = useState({});
  const [carbonResult, setCarbonResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/footprints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ activity_type: activityType, details })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Calculation failed");
        return;
      }

      const data = await res.json();
      setCarbonResult(data.carbon_kg);
      setSuccess(`Carbon Footprint Added! The activity was ${activityType.replace(/_/g, ' ')}.`);
      
      setActivityType("");
      setDetails({});

    } catch (err) {
      setError("Server error, please try again");
      console.error(err);
    }
  };

  return (
    <div className="carbon-form-container">
      <h1>Track Your Carbon Footprint</h1>
      <div className="journey-index">
        <h3>Journey Definitions</h3>
        <p>A **short** journey is less than 16km.</p>
        <p>A **medium** journey is 16-32km.</p>
        <p>A **long** journey is greater than 32km.</p>
      </div>

      <form onSubmit={handleSubmit} className="carbon-form">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <label>Activity Type:</label>
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required
        >
          <option value="">Select an activity</option>
          <option value="flight">Flight</option>
          <option value="driving">Driving</option>
          <option value="train">Train</option>
          <option value="tube">Tube</option>
          <option value="bus">Bus</option>
          <option value="meat">Meat</option>
          <option value="dairy">Dairy</option>
          <option value="food_waste">Food Waste</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="online_shopping">Online Shopping</option>
          <option value="electricity_use">Electricity Use</option>
          <option value="gas_use">Gas Use</option>
          <option value="water_use">Water Use</option>
          <option value="plastic_waste">Plastic Waste</option>
          <option value="general_waste">General Waste</option>
          <option value="recycling">Recycling</option>
          <option value="streaming">Streaming</option>
          <option value="gaming">Gaming</option>
          <option value="events">Events</option>
          <option value="hotel_stays">Hotel Stays</option>
        </select>

        {/* Dynamic form fields based on activityType */}
        {(activityType === "driving" || activityType === "train" || activityType === "tube" || activityType === "bus") && (
          <div className="dynamic-fields">
            <label>Commute Type:</label>
            <select name="commute" value={details.commute || ""} onChange={handleDetailsChange}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            {activityType === "driving" && (
              <>
                <label>Fuel Type:</label>
                <select name="fuel_type" value={details.fuel_type || ""} onChange={handleDetailsChange}>
                  <option value="petrol">Petrol</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}
          </div>
        )}
        
        {activityType === "online_shopping" && (
          <div className="dynamic-fields">
            <label>Orders per Month:</label>
            <input
              type="number"
              name="orders_per_month"
              value={details.orders_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
            <label>Returns per Month:</label>
            <input
              type="number"
              name="returns_per_month"
              value={details.returns_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "flight" && (
          <div className="dynamic-fields">
            <label>Flight Type:</label>
            <select name="flight_type" value={details.flight_type || ""} onChange={handleDetailsChange}>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>
        )}
        
        {activityType === "meat" && (
          <div className="dynamic-fields">
            <label>Meat Type:</label>
            <select name="type" value={details.type || ""} onChange={handleDetailsChange}>
              <option value="beef">Beef</option>
              <option value="lamb">Lamb</option>
              <option value="pork">Pork</option>
              <option value="chicken">Chicken</option>
              <option value="fish">Fish</option>
            </select>
            <label>Servings per Week:</label>
            <input
              type="number"
              name="servings_per_week"
              value={details.servings_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "dairy" && (
          <div className="dynamic-fields">
            <label>Dairy Type:</label>
            <select name="type" value={details.type || ""} onChange={handleDetailsChange}>
              <option value="milk">Milk</option>
              <option value="cheese">Cheese</option>
              <option value="butter">Butter</option>
              <option value="yoghurt">Yoghurt</option>
            </select>
            <label>Servings per Week:</label>
            <input
              type="number"
              name="servings_per_week"
              value={details.servings_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "food_waste" && (
          <div className="dynamic-fields">
            <label>Frequency:</label>
            <select name="frequency" value={details.frequency || ""} onChange={handleDetailsChange}>
              <option value="rare">Rare</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
        
        {activityType === "clothing" && (
          <div className="dynamic-fields">
            <label>Frequency:</label>
            <select name="frequency" value={details.frequency || ""} onChange={handleDetailsChange}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
        
        {activityType === "electronics" && (
          <div className="dynamic-fields">
            <label>Frequency:</label>
            <select name="frequency" value={details.frequency || ""} onChange={handleDetailsChange}>
              <option value="rare">Rare</option>
              <option value="frequent">Frequent</option>
            </select>
          </div>
        )}
        
        {activityType === "electricity_use" && (
          <div className="dynamic-fields">
            <label>KWH per Month:</label>
            <input
              type="number"
              name="kwh_per_month"
              value={details.kwh_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "gas_use" && (
          <div className="dynamic-fields">
            <label>KWH per Month:</label>
            <input
              type="number"
              name="kwh_per_month"
              value={details.kwh_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "water_use" && (
          <div className="dynamic-fields">
            <label>Litres per Day:</label>
            <input
              type="number"
              name="litres_per_day"
              value={details.litres_per_day || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "plastic_waste" && (
          <div className="dynamic-fields">
            <label>Bags per Week:</label>
            <input
              type="number"
              name="bags_per_week"
              value={details.bags_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "general_waste" && (
          <div className="dynamic-fields">
            <label>KG per Week:</label>
            <input
              type="number"
              name="kg_per_week"
              value={details.kg_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "recycling" && (
          <div className="dynamic-fields">
            <label>Recycling Percentage:</label>
            <input
              type="number"
              name="percent"
              value={details.percent || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "streaming" && (
          <div className="dynamic-fields">
            <label>Hours per Week:</label>
            <input
              type="number"
              name="hours_per_week"
              value={details.hours_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "gaming" && (
          <div className="dynamic-fields">
            <label>Hours per Week:</label>
            <input
              type="number"
              name="hours_per_week"
              value={details.hours_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "events" && (
          <div className="dynamic-fields">
            <label>Events per Year:</label>
            <input
              type="number"
              name="per_year"
              value={details.per_year || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}
        
        {activityType === "hotel_stays" && (
          <div className="dynamic-fields">
            <label>Nights per Year:</label>
            <input
              type="number"
              name="nights_per_year"
              value={details.nights_per_year || ""}
              onChange={handleDetailsChange}
              required
            />
          </div>
        )}

        <button type="submit">Calculate Footprint</button>
      </form>
      
      {carbonResult !== null && (
        <div className="result">
          <h2>Your Carbon Footprint</h2>
          <p>This activity added **{carbonResult} kg CO₂** to your footprint.</p>
        </div>
      )}
    </div>
  );
}