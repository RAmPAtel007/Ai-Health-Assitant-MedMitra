import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((res) => {
        if (res.data.status === "Success") {
          // Store user identifier if needed (e.g. token or email)
          localStorage.setItem("userEmail", email);
          navigate("/home");
        } else {
          // If login fails, alert user and clear password field
          alert(res.data.status || "Login failed");
          setPassword(""); 
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          
          <div className="login-logo">
            <div className="logo-icon-login">
              <span>M</span>
            </div>
            {/* Medmitra Logo Text */}
            <span className="logo-text-login">Medmitra</span>
          </div>

          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your healthcare journey</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login-submit">
              Sign In
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <Link to="/register">
              <button type="button" className="btn-create-account">
                Create New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;