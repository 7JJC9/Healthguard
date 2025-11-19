import React , { useState }  from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {


      const response = await axios.post("http://127.0.0.1:8000/api/token/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      
      });
         const { access, refresh } = response.data;
       
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          localStorage.setItem("username", formData.username);
 
      const profileRes = await axios.get(`http://127.0.0.1:8000/api/profile/${formData.username}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );

         const role = profileRes.data.role;

  
        localStorage.setItem("role", role);

        if (role === "doctor") {
          navigate("/doctorhome");
        } else if (role === "patient") {
          navigate("/patienthome");
        } else {
          navigate("/");
        }
      
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Invalid username or password");
      } else {
        setError("Something went wrong, please try again.");
      }
    }
  };

  const cardStyle = {
    maxWidth: "400px",
    margin: "100px auto",
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

  const signInBtn = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const backBtn = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    color: "white",
  };

  const forgotStyle = {
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Sign In
      </h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Username</label>
        <input type="text" placeholder="Enter your username" name="username"  value={formData.username}
          onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Password</label>
        <input type="password" placeholder="Enter your password"  name="password"  value={formData.password}
          onChange={handleChange} style={inputStyle} />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" style={signInBtn}>Sign In</button>
          <button type="button" style={backBtn} onClick={() => navigate("/")}>
            Back
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          {/* <span
            style={forgotStyle}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span> */}
        </div>
      </form>
    </div>
  );
}

export default Signin;

