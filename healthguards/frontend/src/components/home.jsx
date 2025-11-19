import React from "react";
import "./home.css";
import Navbar from "./navbar";

function Home() {
  return (
    <div>
        <Navbar/>
    <div className="home">
        
      <div className="cards-container">
        
        <div className="card">
          <h2>Healthy Eating</h2>
          <p>Learn about balanced diets and nutrition tips.</p>
        </div>
        <div className="card">
          <h2>Exercise Plans</h2>
          <p>Stay fit with personalized workout routines.</p>
        </div>
        <div className="card">
          <h2>Mental Wellness</h2>
          <p>Explore ways to keep your mind healthy and relaxed.</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
