
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadAll, clearAll } from "./formstorage";

function Medical() {
  const navigate = useNavigate();

  const [fever, setFever] = useState("");
  const [cough, setCough] = useState("");
  const [headache, setHeadache] = useState("");
  const [chestpain, setChestpain] = useState("");
  const [fatigue, setFatigue] = useState("");
  const [vomiting, setVomiting] = useState("");
  const [shortnessofbreath, setShotnessofbreath] = useState("");
  const [stomachpain, setStomachpain] = useState("");
  const [nothungry, setNothungry] = useState("");
  const [rashes, setRashes] = useState("");


  const handleSubmit = async () => {
    const all = loadAll();

    const payload = {
      ...all.demographic,
      ...all.lifestyle,
      fever: Number(fever),
      cough: Number(cough),
      headache: Number(headache),
      chestpain: Number(chestpain),
      fatigue: Number(fatigue),
      vomiting: Number(vomiting),
      shortnessofbreath: Number(shortnessofbreath),
      stomachpain: Number(stomachpain),
      nothungry: Number(nothungry),
      rashes: Number(rashes),
    };

    
    for (const k of [
      "age",
      "gender",
      "height",
      "weight",
      "bmi",
      "bmi_category",
    ]) {
      if (!payload[k]) {
        alert("Missing: " + k);
        return;
      }
    }
 

    try {
     
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert(" No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      
      const resp = await axios.post("http://localhost:8000/predict/", payload,

      {headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json",},}
      );

      const data = resp.data;

    
      navigate("/predict" , { 

       state: { 
           predicted_disease: data.predicted_disease,
           probability: data.probability,
           symptoms: payload,
           alternative: data.alternative_diseases || [],
           recommendation: data.recommendation || "Consult a doctor for confirmation.",
           
            }, 
      });
       clearAll();

    } catch (err) {
      if (err.response) {
        
        alert(" Server Error: " + JSON.stringify(err.response.data));
      } else if (err.request) {
        
        alert(" No response from server. Check if Django is running.");
      } else {
        
        alert(" Request Error: " + err.message);
      }
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center" }}>
      <h2>Medical Symptoms Details</h2>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
   
        <label>
          <strong>Fever:</strong>
          <select
            value={fever}
            onChange={(e) => setFever(e.target.value)}
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
          <strong>Cough:</strong>
          <select
            value={cough}
            onChange={(e) => setCough(e.target.value)}
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
          <strong>Headache:</strong>
          <select
            value={headache}
            onChange={(e) => setHeadache(e.target.value)}
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
          <strong>Chest Pain:</strong>
          <select
            value={chestpain}
            onChange={(e) => setChestpain(e.target.value)}
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
          <strong>Fatigue:</strong>
          <select
            value={fatigue}
            onChange={(e) => setFatigue(e.target.value)}
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
          <strong>Vomiting:</strong>
          <select
            value={vomiting}
            onChange={(e) => setVomiting(e.target.value)}
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
          <strong>Shortness of breath:</strong>
          <select
            value={shortnessofbreath}
            onChange={(e) => setShotnessofbreath(e.target.value)}
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
          <strong>Stomach Pain:</strong>
          <select
            value={stomachpain}
            onChange={(e) => setStomachpain(e.target.value)}
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
          <strong>Not Hungry:</strong>
          <select
            value={nothungry}
            onChange={(e) => setNothungry(e.target.value)}
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
          <strong>Rashes:</strong>
          <select
            value={rashes}
            onChange={(e) => setRashes(e.target.value)}
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
            onClick={() => navigate("/next1")}
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
            onClick={handleSubmit}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Medical;
