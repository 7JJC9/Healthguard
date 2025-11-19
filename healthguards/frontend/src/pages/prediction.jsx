
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Predict() {
  const location = useLocation();
  const navigate = useNavigate();

  const { predicted_disease, probability, symptoms, alternative, recommendation} = location.state || {};

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

   useEffect(() => {
    if (!username || !token) {
      alert("Please log in again!");
      navigate("/signin");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/patient/${username}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPatient(res.data))
    .catch(err => {
      console.error("Error fetching patient:", err.response || err);
      alert("Unable to fetch patient data. Please log in again.");
      navigate("/signin");
    });
  }, [navigate, username, token]);

  useEffect(() => {
    if (!predicted_disease) return;

    const fetchDoctors = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/predict_doctors/", 
          { disease: predicted_disease },
          { headers: { Authorization: `Bearer ${token}` } } 
        );
        setDoctors(response.data.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [predicted_disease]);

   const handleLogout = () => {
    
      localStorage.removeItem("username");
      alert("You have been logged out.");
      navigate("/signin");
    };

  const specialistMapping = {
    "Heart Attack": "Cardiologist",
    "Hypertension": "Cardiologist",
    "Stroke": "Neurologist / Cardiologist",
    "Asthma": "Pulmonologist",
    "Pneumonia": "Pulmonologist",
    "Tuberculosis": "Pulmonologist",
    "Lung Cancer": "Pulmonologist",
    "Alzheimer’s Disease": "Neurologist",
    "Migraine": "Neurologist",
    "Diabetes": "Endocrinologist",
    "Thyroid Disorder": "Endocrinologist",
    "COVID-19": "Infectious Disease Specialist",
    "Influenza": "Infectious Disease Specialist / General Physician",
    "Dengue Fever": "Infectious Disease Specialist / General Physician",
    "Malaria": "Infectious Disease Specialist / General Physician",
    "Typhoid": "Infectious Disease Specialist / General Physician",
    "HIV/AIDS": "Infectious Disease Specialist",
    "Chickenpox": "Dermatologist / Infectious Disease Specialist",
    "Cholera": "Infectious Disease Specialist / Gastroenterologist",
    "Breast Cancer": "Oncologist",
    "Prostate Cancer": "Oncologist",
    "Skin Cancer": "Dermatologist / Oncologist",
    "Leukemia": "Hematologist / Oncologist",
    "Cervical Cancer": "Gynecologist / Oncologist",
    "Gastritis": "Gastroenterologist",
    "Peptic Ulcer": "Gastroenterologist",
    "Liver Cirrhosis": "Hepatologist",
    "Fatty Liver": "Hepatologist",
    "Anemia": "Hematologist",
    "Kidney Disease": "Nephrologist",
    "Urinary Tract Infection": "Urologist / Nephrologist"
  };

  const specialist = specialistMapping[predicted_disease] || "General Physician";

  if (!predicted_disease) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>No prediction data found </h2>
        <button onClick={() => navigate("/")} style={buttonStyle}>Go Back</button>
      </div>
    );
  }

  const handleSendToDoctor = async (doc) => {

      if (!patient || !patient.id ) {
      alert("Patient data not available! Please log in again.");
      return;
    }
  
    try {

        const res = await axios.post( "http://localhost:8000/api/assign-patient/",
      { patient_id: patient.id, doctor_id: doc.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.success || "Patient sent successfully!");
  } catch (err) {
    console.error("Error sending patient:", err.response || err);
    alert(err.response?.data?.error || "Failed to send patient details.");
  }
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  };

  return (

<div style={{ maxWidth: "1000px", margin: "60px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
  <h2 style={{ marginBottom: "30px", color: "black" }}>Prediction Details</h2>

  <table style={{
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden"
  }}>
    <tbody>
   
      <tr style={{ backgroundColor: "#f9f9f9", color: "black" }}>
        <td style={{ padding: "12px", fontWeight: "bold" }}>Predicted Disease</td>
        <td style={{ padding: "12px" }}>{predicted_disease}</td>
      </tr>

      <tr style={{ backgroundColor: "#e8f0fe" }}>
        <td style={{ padding: "12px", fontWeight: "bold" }}>Model Confidence</td>
        <td style={{ padding: "12px" }}>{probability}%</td>
      </tr>

      <tr style={{ backgroundColor: "white" }}>
        <td style={{ padding: "12px", fontWeight: "bold", verticalAlign: "top" }}>Alternative Diseases</td>
        <td style={{ padding: "12px", textAlign: "left" }}>
          {alternative && alternative.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {alternative.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : (
            "No strong alternative diseases detected."
          )}
        </td>
      </tr>


      <tr style={{ backgroundColor: "#e8f0fe" }}>
        <td style={{ padding: "12px", fontWeight: "bold", verticalAlign: "top" }}>Recommended Doctors ({specialist})</td>
        <td style={{ padding: "12px" }}>
          {loading ? (
            <p>Loading doctors...</p>
          ) : doctors.length > 0 ? (
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <thead style={{ backgroundColor: "#e8f0fe", color: "black" }}>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Specialization</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Hospital</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Mobile</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>District</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={doc.id} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f1f1f1", transition: "background 0.3s", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#d0e4ff"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#ffffff" : "#f1f1f1"}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{doc.full_name}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{doc.specialization}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{doc.hospital_name || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{doc.mobile_number || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{doc.district || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => handleSendToDoctor(doc)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No doctor contact available for this disease.</p>
          )}
        </td>
      </tr>

     
    </tbody>
  </table>

  <p style={{ marginTop: "20px", color:"red"}}>
    Note: This result is not a sure prediction. Please consult a doctor for practical medical advice. This is only for basic awareness.
  </p>

  <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
    <button onClick={() => navigate("/next2")} style={{
      backgroundColor: "#1976d2",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}>Back</button>
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#f44336",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </div>
</div>

  );
}

export default Predict;
