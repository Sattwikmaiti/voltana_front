import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { jwtDecode } from "jwt-decode";

const App = () => {
  // Check if user is logged in by verifying JWT token in localStorage
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");

    if (!token) return false; // If there's no token, user is not logged in

    try {
      // Decode the JWT token to get its payload
      const decodedToken = jwtDecode(token);

      // Check if the token has expired (compare expiration time with current time)
      const currentTime = Date.now() / 1000; // current time in seconds
      if (decodedToken.exp > currentTime) {
        return true; // Token is valid
      } else {
        localStorage.removeItem("token"); // Clear expired token
        return false; // Token has expired
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={isLoggedIn() ? <SignUp /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
