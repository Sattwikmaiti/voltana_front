import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To redirect the user after login

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear any previous token
      localStorage.removeItem("token");

      const response = await axios.post("https://voltana.onrender.com/api/login", formData);

      if (response.status === 200) {
        alert("Login successful!");

        // Store JWT token in localStorage
        const { token } = response.data;  // Assuming the token is returned in the response

        localStorage.setItem("token", token); // Save the token to localStorage

        // Redirect to dashboard
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Error logging in!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
