"use client";

import { useState } from "react";
import { Modal } from '@/components';
import "@/styles/forms.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CarbonFootprintForm() {
  const [activityType, setActivityType] = useState("");
  const [details, setDetails] = useState({});
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("daily");

  const [carbonResult, setCarbonResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [suggestedOffsets, setSuggestedOffsets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setActivityType("");
    setDetails({});
    setEntryDate(new Date().toISOString().split("T")[0]);
    setIsRecurring(false);
    setRecurrenceFrequency("daily");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setError("");

    if (!token) {
      setError("Please log in to save your footprint.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/footprints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activity_type: activityType,
          details,
          entry_date: entryDate,
          is_recurring: isRecurring,
          recurrence_frequency: isRecurring ? recurrenceFrequency : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Calculation failed");

      setCarbonResult(data.carbon_kg);
      setSuggestedOffsets(data.suggested_offsets || []);
      setSuccess(
        `Carbon Footprint Added! (${activityType.replace(/_/g, " ")})`,
      );
      setIsModalOpen(true);
      resetForm();
    } catch (err) {
      setError(err.message || "Server error, please try again");
    }
  };

  // Helper for consistent number inputs
  const renderInput = (name, label) => (
    <div key={name} className="form-group">
      <label htmlFor={name}>{label}:</label>
      <input
        type="number"
        id={name}
        name={name}
        value={details[name] || ""}
        onChange={handleDetailsChange}
        required
      />
    </div>
  );

  return (
    <div className="carbon-form-wrapper">
      <div className="carbon-form-container">
        <h1>Track Your Carbon Footprint</h1>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="carbon-form" noValidate>
          {/* Date */}
          <label htmlFor="entry-date">Date of Activity:</label>
          <input
            type="date"
            id="entry-date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="date-input"
          />

          {/* Activity Selector */}
          <label htmlFor="activity-type">Activity Type:</label>
          <select
            id="activity-type"
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

          {/* Recurring Section */}
          {activityType && !["meat", "dairy"].includes(activityType) && (
            <div
              className="recurring-section"
              style={{
                background: "rgba(0,0,0,0.03)",
                padding: "10px",
                borderRadius: "8px",
                margin: "15px 0",
              }}
            >
              <label
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                Make this a recurring activity
              </label>
              {isRecurring && (
                <div style={{ marginTop: "10px" }}>
                  <label htmlFor="frequency">Repeat every:</label>
                  <select
                    id="frequency"
                    value={recurrenceFrequency}
                    onChange={(e) => setRecurrenceFrequency(e.target.value)}
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekday">Every Weekday</option>
                    <option value="weekly">Every Week</option>
                    <option value="monthly">Every Month</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Transport Details */}
          {["driving", "train", "tube", "bus"].includes(activityType) && (
            <fieldset>
              <legend>{activityType} Details</legend>
              <label>Commute Type:</label>
              <select
                name="commute"
                value={details.commute || ""}
                onChange={handleDetailsChange}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
              {activityType === "driving" && (
                <>
                  <label>Fuel Type:</label>
                  <select
                    name="fuel_type"
                    value={details.fuel_type || ""}
                    onChange={handleDetailsChange}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="other">Other</option>
                  </select>
                </>
              )}
            </fieldset>
          )}

          {/* Flight */}
          {activityType === "flight" && (
            <fieldset>
              <legend>Flight Details</legend>
              <label>Flight Type:</label>
              <select
                name="flight_type"
                value={details.flight_type || ""}
                onChange={handleDetailsChange}
              >
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </fieldset>
          )}

          {/* Food */}
          {activityType === "meat" && (
            <fieldset>
              <legend>Meat Consumption</legend>
              <label>Meat Type:</label>
              <select
                name="type"
                value={details.type || ""}
                onChange={handleDetailsChange}
              >
                {["beef", "lamb", "pork", "chicken", "fish"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {renderInput("servings_per_week", "Servings per Week")}
            </fieldset>
          )}

          {activityType === "dairy" && (
            <fieldset>
              <legend>Dairy Consumption</legend>
              <label>Dairy Type:</label>
              <select
                name="type"
                value={details.type || ""}
                onChange={handleDetailsChange}
              >
                {["milk", "cheese", "butter", "yoghurt"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {renderInput("servings_per_week", "Servings per Week")}
            </fieldset>
          )}

          {/* Shopping */}
          {activityType === "online_shopping" && (
            <fieldset>
              <legend>Online Shopping</legend>
              {renderInput("orders_per_month", "Orders per Month")}
              {renderInput("returns_per_month", "Returns per Month")}
            </fieldset>
          )}

          {/* Everything else (Simple Inputs) */}
          {activityType === "electricity_use" &&
            renderInput("kwh_per_month", "KWH per Month")}
          {activityType === "gas_use" &&
            renderInput("kwh_per_month", "KWH per Month")}
          {activityType === "water_use" &&
            renderInput("litres_per_day", "Litres per Day")}
          {activityType === "plastic_waste" &&
            renderInput("bags_per_week", "Bags per Week")}
          {activityType === "general_waste" &&
            renderInput("kg_per_week", "KG per Week")}
          {activityType === "streaming" &&
            renderInput("hours_per_week", "Hours per Week")}
          {activityType === "gaming" &&
            renderInput("hours_per_week", "Hours per Week")}
          {activityType === "hotel_stays" &&
            renderInput("nights_per_year", "Nights per Year")}

          <button type="submit">Calculate Footprint</button>
        </form>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Success!</h2>
          <p>{success}</p>
          {carbonResult && (
            <p className="result">Added {carbonResult} kg CO₂</p>
          )}
          {suggestedOffsets.length > 0 && (
            <div>
              <p>Suggested Offsets:</p>
              <ul>
                {suggestedOffsets.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
