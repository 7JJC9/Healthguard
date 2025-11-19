import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveStep } from "./formstorage";


function Demographic() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState(""); 
  const [weight, setWeight] = useState(""); 
  const [bmi, setBmi] = useState("");
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    if (height && weight) {
      const h = height / 100; 
      const bmiValue = (weight / (h * h)).toFixed(1);
      setBmi(bmiValue);

      if (bmiValue < 18.5) setBmiCategory("Underweight");
      else if (bmiValue < 25) setBmiCategory("Normal weight");
      else if (bmiValue < 30) setBmiCategory("Overweight");
      else setBmiCategory("Obese");
    } else {
      setBmi("");
      setBmiCategory("");
    }
  }, [height, weight]);

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center" }}>
      <h2> Demographic Details</h2>

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
          <strong>Age:</strong>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Age Cateogry</option>
            <option value="child">Child (0-12)</option>
            <option value="teen">Teen (13-19)</option>
            <option value="youngadult">young Adult (20-35)</option>
            <option value="adult">Adult (36-55)</option>
            <option value="senoir">Senior (56+)</option>



          </select>
        </label>

      
        <label>
          <strong>Gender:</strong>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male </option>
            <option value="Female">Female </option>
            <option value="Other">Other </option>
          </select>
        </label>

        <label>
          <strong>Height (cm):</strong>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            placeholder="e.g. 170"
            style={{
              marginLeft: "10px",
              padding: "8px",
              width: "150px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>

       
        <label>
          <strong>Weight (kg):</strong>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="e.g. 65"
            style={{
              marginLeft: "10px",
              padding: "8px",
              width: "150px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </label>


        <label>
          <strong>BMI:</strong>
          <input
            type="text"
            value={bmi || ""}
            readOnly
            placeholder="Auto-calculated"
            style={{
              marginLeft: "10px",
              padding: "8px",
              width: "150px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#e9ecef",
            }}
          />
        </label>

        
        <label>
          <strong>BMI Category:</strong>
          <input
            type="text"
            value={bmiCategory || ""}
            readOnly
            placeholder="Will appear here"
            style={{
              marginLeft: "10px",
              padding: "8px",
              width: "200px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#e9ecef",
            }}
          />
        </label>

        
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
          <button
            type="button"
            onClick={() => navigate("/patienthome")}
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
            onClick={() =>  { saveStep("demographic", {
            age: age,
             gender,
             height: Number(height),
            weight: Number(weight),
             bmi: bmi ? Number(bmi) : null,
               bmi_category: bmiCategory
             });
               navigate("/next1")}}


            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}>
          
            Next ➡
          </button>
        </div>
      </form>
    </div>
  );
}

export default Demographic;
