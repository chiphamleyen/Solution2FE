import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axiosUser from "../../../api/axiosUser";
import { API_PATHS_USER } from "../../../api/config";
import "./login-register.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosUser.post(API_PATHS_USER.LOGIN, {
        email,
        password,
      });

      const data = res.data;
      localStorage.setItem("userToken", data.data.access_token);
      console.log("User login successful:", data.data.access_token);

      navigate("/user/dashboard");
    } catch (err) {
      console.error("User login failed:", err);
      alert("User login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container-1">
      <h1>LOGIN</h1>
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>User Login</h1>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser className="icon" />
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
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
          <div className="register-link">
            <p style={{textAlign: "center"}}>
              Don't have an account? <Link to="/user/register">Register</Link>
            </p>
          </div>
        </div>
      </div>

      <button className="button-79" role="button">
        <Link to="/admin/login">Admin Login</Link>
      </button>
    </div>
  );
};

export default UserLogin;
