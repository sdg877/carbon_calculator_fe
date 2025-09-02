"use client";

import { useState, useEffect } from "react";
import "../../styles/forms.css";

const activityFields = {
  flight: [{ label: "Flight Type", name: "flight_type", type: "select", options: ["short", "long"] }],
  driving: [
    { label: "Commute Distance", name: "commute", type: "select", options: ["short", "medium", "long"] },
    { label: "Fuel Type", name: "fuel_type", type: "select", options: ["petrol", "diesel"] },
  ],
  train: [{ label: "Commute Distance", name: "commute", type: "select", options: ["short", "medium", "long"] }],
  tube: [{ label: "Commute Distance", name: "commute", type: "select", options: ["short", "medium", "long"] }],
  bus: [{ label: "Commute Distance", name: "commute", type: "select", options: ["short", "medium", "long"] }],
  meat: [
    { label: "Type of Meat", name: "type", type: "select", options: ["beef", "lamb", "pork", "chicken", "fish"] },
    { label: "Servings per Week", name: "servings_per_week", type: "number" },
  ],
  dairy: [
    { label: "Type of Dairy", name: "type", type: "select", options: ["milk", "cheese", "butter", "yoghurt"] },
    { label: "Servings per Week", name: "servings_per_week", type: "number" },
  ],
  food_waste: [
    { label: "Frequency", name: "frequency", type: "select", options: ["rare", "weekly"] },
  ],
  electricity_use: [{ label: "kWh per Month", name: "kwh_per_month", type: "number" }],
  gas_use: [{ label: "kWh per Month", name: "kwh_per_month", type: "number" }],
  water_use: [{ label: "Litres per Day", name: "litres_per_day", type: "number" }],
  plastic_waste: [{ label: "Bags per Week", name: "bags_per_week", type: "number" }],
  general_waste: [{ label: "Kg per Week", name: "kg_per_week", type: "number" }],
  recycling: [{ label: "Percent Recycled", name: "percent", type: "number" }],
  streaming: [{ label: "Hours per Week", name: "hours_per_week", type: "number" }],
  gaming: [{ label: "Hours per Week", name: "hours_per_week", type: "number" }],
  events: [{ label: "Events per Year", name: "per_year", type: "number" }],
  hotel_stays: [{ label: "Nights per Year", name: "nights_per_year", type: "number" }],
};

export default function FootprintPage() {
  const [activityType, setActivityType] = useState("");
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({});
    setResult(null);
    setError(null);
  }, [activityType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/footprints/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activity_type: activityType, details: formData }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Failed to submit");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    }
  };

  return (
    <div className="footprint-container">
      <h1>Add Carbon Activity</h1>

      <label>Activity Type:</label>
      <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
        <option value="">Select activity</option>
        {Object.keys(activityFields).map((act) => (
          <option key={act} value={act}>
            {act.replace("_", " ")}
          </option>
        ))}
      </select>

      {activityType && (
        <form onSubmit={handleSubmit}>
          {activityFields[activityType].map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}:</label>
              {field.type === "select" ? (
                <select name={field.name} onChange={handleChange} required>
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit">Add Activity</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h2>Carbon Footprint Added!</h2>
          <p>Activity Type: {result.activity_type}</p>
          <p>Carbon kg: {result.carbon_kg}</p>
          {result.suggestions && (
            <div>
              <h3>Offset Suggestions:</h3>
              <ul>
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s.title || s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
