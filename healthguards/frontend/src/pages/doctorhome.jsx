
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorHome() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");

    if (!username || !token) {
      alert("Please log in again!");
      navigate("/signin");
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/doctor/${username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Doctor data:", res.data);
        setDoctor(res.data);
      } catch (err) {
        console.error(err);
        alert("Unable to fetch doctor details");
      }

      try {
        const patientsRes = await axios.get(`http://127.0.0.1:8000/api/get_assigned_patients/${username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignedPatients(patientsRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Unable to fetch assigned patient details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleAssignSlot = async () => {
    const token = localStorage.getItem("access_token");

    if (!selectedPatientId) return alert("Patient ID is missing!");
    if (!doctor || !doctor.username) return alert("Doctor ID is missing!");
    if (!date || !time) return alert("Please provide both date and time!");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/assign-slot/",
        {
          patient_id: selectedPatientId,
          doctor_username : doctor.username,
          date: date,
          time_slot: time,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment assigned successfully!");
      setShowForm(false);
      setDate("");
      setTime("");

      const username = localStorage.getItem("username");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/get_assigned_patients/${username}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedPatients(res.data || []);
    } catch (err) {
     
       console.error(err.response?.data || err);
      alert(" Failed to assign slot. Try again.");
    }
  };

  const openForm = (patientId) => {
    setSelectedPatientId(patientId);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
  if (!doctor) return <p style={{ textAlign: "center", marginTop: "100px" }}>No doctor data found.</p>;

   return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ marginBottom: "30px" }}>Welcome :  {doctor.full_name}</h1>

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
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{doctor.username}</td>
            </tr>
            
             <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Specialization</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{doctor.specialization}</td>
            </tr>
             <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Hospital Name</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{doctor.hospital_name}</td>
            </tr>
          </tbody>
        </table>
      </div>

       <div style={{ marginTop: "40px" }}>
         <h2> Assigned Patients</h2>
         {assignedPatients.length > 0 ? (
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
             <thead style={{ color: "white" }}>
               <tr>
                 <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
                 <th style={{ padding: "12px", border: "1px solid #ddd" }}>Age</th>
                 <th style={{ padding: "12px", border: "1px solid #ddd" }}>Blood Group</th>
                 <th style={{ padding: "12px", border: "1px solid #ddd" }}>Mobile</th>
                 {/* <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th> */}
                 <th style={{ padding: "12px", border: "1px solid #ddd" }}>Time Slot</th>
                

               </tr>
             </thead>
             <tbody>
               {assignedPatients .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)) // latest date first
                    .slice(0, 7)  
                    .map((app) => (
                 <tr key={app.id}>
                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.full_name}</td>
                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.age}</td>
                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.blood_group}</td>
                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.mobile_number}</td>
                   {/* <td style={{ padding: "10px", border: "1px solid #ddd" }}>{app.status || "Pending"}</td> */}
                   <td>
                     {app.status !== "Accepted" && (
                       <button
                         onClick={() => openForm(app.id)}
                         style={{ backgroundColor: "#1976d2", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                       >
                         Accept
                       </button>
                     )}
                     {app.status === "Accepted" && <span style={{ color: "green" }}> Accepted</span>}
                   </td>
                 </tr>



               ))}
             </tbody>
           </table>
         ) : (
           <p>No patients assigned yet.</p>
         )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "20px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <h3>Assign Appointment Slot</h3>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ display: "block", width: "100%", margin: "10px 0" }} />
          <label>Time:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          >
            <option value="">Select Time</option>
            <option value="10:00">10:00 am</option>
            <option value="10:15">10:15 am</option>
            <option value="10:30">10:30 am</option>
            <option value="10:45">10:45 am</option>
            <option value="11:00">11:00 am</option>
            <option value="11:15">11:15 am</option>
            <option value="11:30">11:30 am</option>
            <option value="11:45">11:45 am</option>
            <option value="12:00">12:00 pm</option>
            <option value="12:15">12:15 pm</option>
            <option value="12:30">12:30 pm</option>
          
            <option value="16:00">3:00 pm</option>
            <option value="16:15">3:15 pm</option>
            <option value="16:30">3:30 pm</option>
            <option value="16:45">3:45 pm</option>
            <option value="15:00">4:00 pm</option>
            <option value="15:00">4:15 pm</option>
            <option value="15:00">4:30 pm</option>
            <option value="15:00">4:45 pm</option>
            <option value="15:00">5:00 pm</option>

          </select>          <button onClick={handleAssignSlot} style={{ backgroundColor: "green", color: "white", padding: "10px", borderRadius: "5px", marginRight: "10px" }}>
            Submit
          </button>
          <button onClick={() => setShowForm(false)} style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
            Cancel
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{ backgroundColor: "red", color: "white", padding: "10px 20px", marginTop: "40px", borderRadius: "10px" }}
      >
        Logout
      </button>
    </div>
  );
}

export default DoctorHome;
