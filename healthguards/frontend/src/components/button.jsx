import React from "react";
import "./button.css"; 

function Button({ label, onClick, type = "primary" }) {
  return (
    <button className={`btn ${type}`} onClick={onClick}>
      {label}
      submit
    </button>
  );
}

export default Button;
