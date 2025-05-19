import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axiosUser from "../../../api/axiosUser";
import { API_PATHS } from "../../../api/config";
import "./login-register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const isFormValid = userName && email && password && agreed; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosUser.post(API_PATHS.REGISTER, {
        user_name: userName,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container-1">
      <h1>NETWORKSCAN</h1>
      <div className="wrapper active">
        <div className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>

            <div className="remember-forget">
              <label>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(!agreed)}
                />{" "}
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`register-btn ${!isFormValid ? "disabled" : ""}`}
            >
              Register
            </button>

            <div className="register-link">
              <p>
                Already have an account? <Link to="/user/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
