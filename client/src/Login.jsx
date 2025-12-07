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
          localStorage.setItem("userEmail", email);
          navigate("/home");
        } else {
          alert(res.data.status);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <h5>e-mail</h5>

          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h5>password</h5>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />


          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>

          <Link to="/register">
            <button type="button" className="btn btn-outline-light w-100 mt-3">
              Create Account
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
