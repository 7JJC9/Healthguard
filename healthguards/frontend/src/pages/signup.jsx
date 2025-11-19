import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    age: "",
    blood_group: "",
    address: "",
    mobile_number: "",
    role: "",
    specialization: "",
    hospital_name: "",
    username: "",
    password: "",
    email: "",
    state: "",
    district: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

   if (!formData.date_of_birth) {
      alert("Date of birth is required");
      setLoading(false);
      return;
    }

    let apiUrl = "";
    let postData = {};

  if (formData.role === "doctor") {
    apiUrl = "http://127.0.0.1:8000/api/register/doctor/";

    // Only send required doctor fields
    postData = {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      age: formData.age,
      blood_group: formData.blood_group,
      mobile_number: formData.mobile_number,
      specialization: formData.specialization,
      hospital_name: formData.hospital_name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      state: formData.state,
      district: formData.district,
    };

    // Check if doctor-specific fields are empty
    if (!formData.specialization || !formData.hospital_name) {
      alert("Please fill specialization and hospital name for doctor");
      setLoading(false);
      return;
    }
  // if (formData.role === "doctor") {
  //   apiUrl = "http://127.0.0.1:8000/api/register/doctor/" ;
  } else if (formData.role === "patient") {
    apiUrl = "http://127.0.0.1:8000/api/register/patient/";
  } else {
    alert("Please select a role before registering.");
    setLoading(false);
    return;
  }

    console.log("Sending form data:", formData);  
    try {
      const response = await axios.post(apiUrl, formData );
      alert(" Registration Successful!");
      console.log("Server Response:", response.data);
      navigate("/signin");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      alert("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    maxWidth: "500px",
    margin: "80px auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
    textAlign: "left",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
    fontSize: "15px",
  };

  const registerBtn = { ...buttonStyle, backgroundColor: "#4CAF50", color: "white" };
  const backBtn = { ...buttonStyle, backgroundColor: "#f44336", color: "white" };

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Registration
      </h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          name="full_name"
          placeholder="Enter your full name"
          style={inputStyle}
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          style={inputStyle}
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Gender</label>
        <select
          name="gender"
          style={inputStyle}
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label style={labelStyle}>Age</label>
        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          style={inputStyle}
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Blood Group</label>
        <select
          name="blood_group"
          style={inputStyle}
          value={formData.blood_group}
          onChange={handleChange}
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label style={labelStyle}>Address</label>
        <textarea
          name="address"
          placeholder="Enter your address"
          style={{ ...inputStyle, height: "70px" }}
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Mobile Number</label>
        <input
          type="tel"
          name="mobile_number"
          placeholder="Enter your mobile number"
          style={inputStyle}
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Role</label>
        <select
          name="role"
          style={inputStyle}
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {formData.role === "doctor" && (
          <>
            <label style={labelStyle}>Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="Enter your specialization"
              style={inputStyle}
              value={formData.specialization}
              onChange={handleChange}
            />

            <label style={labelStyle}>Hospital Name</label>
            <input
              type="text"
              name="hospital_name"
              placeholder="Enter hospital name"
              style={inputStyle}
              value={formData.hospital_name}
              onChange={handleChange}
            />
          </>
        )}

        <label style={labelStyle}>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          style={inputStyle}
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          style={inputStyle}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          style={inputStyle}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>State</label>
        <input
          type="text"
          name="state"
          placeholder="Enter your state"
          style={inputStyle}
          value={formData.state}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>District</label>
        <input
          type="text"
          name="district"
          placeholder="Enter your district"
          style={inputStyle}
          value={formData.district}
          onChange={handleChange}
          required
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" style={registerBtn} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            style={backBtn}
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
