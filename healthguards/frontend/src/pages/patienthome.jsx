  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";

  function PatientHome() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [appointment, setAppointment] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("access_token"); 

      if (!username || !token) {
        alert("Please log in again!");
        navigate("/signin");
        return;
      }

      const fetchPatientData = async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/api/patient/${username}/`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          setPatient(res.data);


       
          const appRes = await axios.get(`http://127.0.0.1:8000/api/patient-appointments/${res.data.id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
         
             setAppointment(appRes.data); 



        } catch (err) {
          console.error(err);
          alert("Unable to fetch patient details");
        } finally {
          setLoading(false);
        }
      };

      fetchPatientData();
    }, [navigate]);

    const handleLogout = () => {
      
      localStorage.removeItem("username");
      alert("You have been logged out.");
      navigate("/signin");
    };

      const handleProfile = () => {
      navigate("/profile");
    };

    const handleHealthAssistant = () => {
      navigate("/health-assistant");
    };


    if (loading) {
      return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
    }

    if (!patient) {
      return <p style={{ textAlign: "center", marginTop: "100px" }}>No patient data found.</p>;
    }

    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h1 style={{ marginBottom: "30px" }}>Welcome, {patient.full_name}</h1>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "60%",
              boxShadow: "0px 4px 10px rgba(172, 21, 21, 0.2)",
              borderRadius: "10px",
              overflow: "hidden",
              
            }}
          >
            <thead style={{ backgroundColor: "#fof4f8", color: "white" }}>
              <tr>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Field</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>Username</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{patient.username}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>Blood Group</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{patient.blood_group}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>Age</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{patient.age}</td>
              </tr>
             
            </tbody>
          </table>
        </div>



       
            <div style={{ marginTop: "40px" }}>
  <h2>Your Appointments</h2>
  {appointment.length > 0 ? (
    <table
      style={{
        borderCollapse: "collapse",
        width: "80%",
        margin: "auto",
        boxShadow: "0px 4px 10px hsla(0, 9.70%, 93.90%, 0.10)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <thead style={{  color: "white" }}>
        <tr>
          <th style={{ padding: "12px", border: "1px solid #ddd" }}>Doctor</th>
          <th style={{ padding: "12px", border: "1px solid #ddd" }}>Date</th>
          <th style={{ padding: "12px", border: "1px solid #ddd" }}>Time Slot</th>
          <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointment  .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)) 
            .slice(0, 7) 
            .map((app) => (
          <tr key={app.id}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Dr. {app.doctor_name}</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.appointment_date}</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.appointment_time ? new Date(`1970-01-01T${app.appointment_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "-"}</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No appointments scheduled yet.</p>
  )}
</div>

        <p style={{ marginTop: "20px", color:"red"}}>
        Note: This result is not a sure prediction. Please consult a doctor for practical medical advice. This is only for basic awareness.</p>

        <div style={{ marginTop: "30px" }}>
          {/* <button
            onClick={handleProfile}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "15px",
              fontSize: "16px",
            }}
          >
            Profile
          </button> */}

          <button
            onClick={handleHealthAssistant}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "15px",
              fontSize: "16px",
            }}
          >
            Health Assistant
          </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      </div>
    );
  }

  export default PatientHome;
