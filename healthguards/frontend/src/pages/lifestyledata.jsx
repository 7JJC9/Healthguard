import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveStep } from "./formstorage";

function Lifestyle() {
  const navigate = useNavigate();

  const [smoking, setSmoking] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [exercise, setExercise] = useState(""); 
  const [diet, setDiet] = useState(""); 
  const [sleep, setSleep] = useState("");
  const [waterintake, setWaterintake] = useState("");
  const [stress, setStress] = useState("");


 

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center" }}>
      <h2> Lifestyle Details</h2>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
      <label >
          <strong>Smoking:     </strong>
          <select
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Occasional</option>
            <option value="2">Regular</option>
            <option value="3">Heavy Smoker</option>
           



          </select>
        </label>

        <label>
          <strong>Alcohol Use:   </strong>
          <select
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Occasional</option>
            <option value="2">Regular</option>
            <option value="3">Heavy Alcoholic</option>
          </select>
        </label>

        <label>
          <strong>Exercise: </strong>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">Moderate</option>
            <option value="3">High</option>
          </select>
        </label>

      <label>
          <strong>Diet Habits:      </strong> 
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">Moderate</option>
            <option value="3">High</option>
          </select>
        </label>

        <label>
          <strong>Sleep:</strong>
          <select
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Low (3-5 hour)</option>
            <option value="2">Moderate (6-7 hour)</option>
            <option value="3">High (8-10 hour)</option>
          </select>
        </label>

       <label>
          <strong>Water Intake:</strong>
          <select
            value={waterintake}
            onChange={(e) => setWaterintake(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Low (0.5-1.5 L)</option>
            <option value="2">Moderate (1.6-2.5 L)</option>
            <option value="3">High (2.6-4.0 L)</option>
          </select>
        </label>

        <label>
          <strong>Stress Level:</strong>
          <select
            value={stress}
            onChange={(e) => setStress(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Type</option>
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">Moderate</option>
            <option value="3">High</option>
          </select>
        </label>



        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
          <button
            type="button"
            onClick={() => navigate("/health-assistant")}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ⬅ Back
          </button>

          <button
            type="button"
            onClick={() => {
            saveStep("lifestyle", {
            smoking: Number(smoking),
            alcohol: Number(alcohol),
            exercise: Number(exercise),
            diet: Number(diet),
            sleep: Number(sleep),
            waterintake: Number(waterintake),
            stress: Number(stress)
           });
             navigate("/next2")}}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Next ➡
          </button>
        </div>
      </form>
    </div>
  );
}

export default Lifestyle;
