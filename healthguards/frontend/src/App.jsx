import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Button from './components/button.jsx';
import Home from './components/home.jsx';
import Navbar from './components/navbar.jsx';
import './App.css'
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup.jsx";
import Signin from './pages/signin.jsx';
import PatientHome from './pages/patienthome.jsx';
import DoctorHome from './pages/doctorhome.jsx';

import Demographicdata from './pages/demographicdata.jsx';
import Lifestyle from './pages/lifestyledata.jsx';
import Medical from './pages/medicaldata.jsx';
import Predcit from './pages/prediction.jsx';

function App() {


  return (
    <> 
      {/* <Navbar/>  */}
      {/* <Home /> */}

      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patienthome" element={<PatientHome />} />
        <Route path="/doctorhome" element={<DoctorHome />} />
       
        <Route path="/health-assistant" element={<Demographicdata />} />
        <Route path="/next1" element={<Lifestyle />} />
        <Route path="/next2" element={<Medical />} />
        <Route path="/predict" element={<Predcit />} />
        


        
      </Routes>
    
    </>
  );
}

export default App;
