
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
  
  const [suggestedOffsets, setSuggestedOffsets] = useState([]);
  const router = useRouter();

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSuggestedOffsets([]);

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activity_type: activityType, details }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Calculation failed");
        return;
      }

      const data = await res.json();
      setCarbonResult(data.carbon_kg);
      setSuccess(
        `Carbon Footprint Added! The activity was ${activityType.replace(/_/g, " ")}.`
      );
      if (data.suggested_offsets) {
        setSuggestedOffsets(data.suggested_offsets);
      }

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


      <form onSubmit={handleSubmit} className="carbon-form">
        <div aria-live="assertive">
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <div className="success" role="status">
              <p>{success}</p>
              {/* NEW: Conditionally render the suggestions inside the success message */}
              {suggestedOffsets.length > 0 && (
                <div>
                  <p>Here are some ways to help offset your footprint:</p>
                  <ul>
                    {suggestedOffsets.map((offset, index) => (
                      <li key={index}>{offset}</li>
                    ))}
                  </ul>
                  <p>
                    Have a look at our <a href="/volunteer">volunteer</a> page for live opportunities.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

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

        {(activityType === "driving" ||
          activityType === "train" ||
          activityType === "tube" ||
          activityType === "bus") && (
          <fieldset>
            <legend>{activityType.charAt(0).toUpperCase() + activityType.slice(1)} Details</legend>

            <label htmlFor="commute">Commute Type:</label>
            <select
              id="commute"
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
                <label htmlFor="fuel_type">Fuel Type:</label>
                <select
                  id="fuel_type"
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

        {activityType === "online_shopping" && (
          <fieldset>
            <legend>Online Shopping Details</legend>

            <label htmlFor="orders_per_month">Orders per Month:</label>
            <input
              type="number"
              id="orders_per_month"
              name="orders_per_month"
              value={details.orders_per_month || ""}
              onChange={handleDetailsChange}
              required
            />

            <label htmlFor="returns_per_month">Returns per Month:</label>
            <input
              type="number"
              id="returns_per_month"
              name="returns_per_month"
              value={details.returns_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "flight" && (
          <fieldset>
            <legend>Flight Details</legend>

            <label htmlFor="flight_type">Flight Type:</label>
            <select
              id="flight_type"
              name="flight_type"
              value={details.flight_type || ""}
              onChange={handleDetailsChange}
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </fieldset>
        )}

        {activityType === "meat" && (
          <fieldset>
            <legend>Meat Consumption</legend>

            <label htmlFor="meat_type">Meat Type:</label>
            <select
              id="meat_type"
              name="type"
              value={details.type || ""}
              onChange={handleDetailsChange}
            >
              <option value="beef">Beef</option>
              <option value="lamb">Lamb</option>
              <option value="pork">Pork</option>
              <option value="chicken">Chicken</option>
              <option value="fish">Fish</option>
            </select>

            <label htmlFor="meat_servings">Servings per Week:</label>
            <input
              type="number"
              id="meat_servings"
              name="servings_per_week"
              value={details.servings_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "dairy" && (
          <fieldset>
            <legend>Dairy Consumption</legend>

            <label htmlFor="dairy_type">Dairy Type:</label>
            <select
              id="dairy_type"
              name="type"
              value={details.type || ""}
              onChange={handleDetailsChange}
            >
              <option value="milk">Milk</option>
              <option value="cheese">Cheese</option>
              <option value="butter">Butter</option>
              <option value="yoghurt">Yoghurt</option>
            </select>

            <label htmlFor="dairy_servings">Servings per Week:</label>
            <input
              type="number"
              id="dairy_servings"
              name="servings_per_week"
              value={details.servings_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "food_waste" && (
          <fieldset>
            <legend>Food Waste</legend>
            <label htmlFor="food_frequency">Frequency:</label>
            <select
              id="food_frequency"
              name="frequency"
              value={details.frequency || ""}
              onChange={handleDetailsChange}
            >
              <option value="rare">Rare</option>
              <option value="weekly">Weekly</option>
            </select>
          </fieldset>
        )}

        {activityType === "clothing" && (
          <fieldset>
            <legend>Clothing Purchases</legend>
            <label htmlFor="clothing_frequency">Frequency:</label>
            <select
              id="clothing_frequency"
              name="frequency"
              value={details.frequency || ""}
              onChange={handleDetailsChange}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </fieldset>
        )}

        {activityType === "electronics" && (
          <fieldset>
            <legend>Electronics Purchases</legend>
            <label htmlFor="electronics_frequency">Frequency:</label>
            <select
              id="electronics_frequency"
              name="frequency"
              value={details.frequency || ""}
              onChange={handleDetailsChange}
            >
              <option value="rare">Rare</option>
              <option value="frequent">Frequent</option>
            </select>
          </fieldset>
        )}

        {activityType === "electricity_use" && (
          <fieldset>
            <legend>Electricity Use</legend>
            <label htmlFor="electricity_kwh">KWH per Month:</label>
            <input
              type="number"
              id="electricity_kwh"
              name="kwh_per_month"
              value={details.kwh_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "gas_use" && (
          <fieldset>
            <legend>Gas Use</legend>
            <label htmlFor="gas_kwh">KWH per Month:</label>
            <input
              type="number"
              id="gas_kwh"
              name="kwh_per_month"
              value={details.kwh_per_month || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "water_use" && (
          <fieldset>
            <legend>Water Use</legend>
            <label htmlFor="litres_per_day">Litres per Day:</label>
            <input
              type="number"
              id="litres_per_day"
              name="litres_per_day"
              value={details.litres_per_day || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "plastic_waste" && (
          <fieldset>
            <legend>Plastic Waste</legend>
            <label htmlFor="bags_per_week">Bags per Week:</label>
            <input
              type="number"
              id="bags_per_week"
              name="bags_per_week"
              value={details.bags_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "general_waste" && (
          <fieldset>
            <legend>General Waste</legend>
            <label htmlFor="kg_per_week">KG per Week:</label>
            <input
              type="number"
              id="kg_per_week"
              name="kg_per_week"
              value={details.kg_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "recycling" && (
          <fieldset>
            <legend>Recycling</legend>
            <label htmlFor="recycling_percent">Recycling Percentage:</label>
            <input
              type="number"
              id="recycling_percent"
              name="percent"
              value={details.percent || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "streaming" && (
          <fieldset>
            <legend>Streaming</legend>
            <label htmlFor="streaming_hours">Hours per Week:</label>
            <input
              type="number"
              id="streaming_hours"
              name="hours_per_week"
              value={details.hours_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "gaming" && (
          <fieldset>
            <legend>Gaming</legend>
            <label htmlFor="gaming_hours">Hours per Week:</label>
            <input
              type="number"
              id="gaming_hours"
              name="hours_per_week"
              value={details.hours_per_week || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "events" && (
          <fieldset>
            <legend>Events</legend>
            <label htmlFor="events_per_year">Events per Year:</label>
            <input
              type="number"
              id="events_per_year"
              name="per_year"
              value={details.per_year || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        {activityType === "hotel_stays" && (
          <fieldset>
            <legend>Hotel Stays</legend>
            <label htmlFor="nights_per_year">Nights per Year:</label>
            <input
              type="number"
              id="nights_per_year"
              name="nights_per_year"
              value={details.nights_per_year || ""}
              onChange={handleDetailsChange}
              required
            />
          </fieldset>
        )}

        <button type="submit">Calculate Footprint</button>
      </form>

      {carbonResult !== null && (
        <div className="result" aria-live="polite">
          <h2>Your Carbon Footprint</h2>
          <p>
            This activity added **{carbonResult} kg CO₂** to your
            footprint.
          </p>
        </div>
      )}
    </div>
  );
}