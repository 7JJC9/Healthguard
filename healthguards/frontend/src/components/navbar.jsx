import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
     const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo"><h1>HealthCare</h1></div>
      <div className="nav-buttons">
        <button className="btn btn-signin" onClick={() => navigate("/signin")}>Sign In</button>
        <button className="btn btn-signup" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;
