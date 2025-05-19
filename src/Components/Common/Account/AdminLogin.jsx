import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axiosAdmin from "../../../api/axiosAdmin";
import { API_PATHS_ADMIN } from "../../../api/config";
import "./login-register.css";  

const AdminLogin = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosAdmin.post(API_PATHS_ADMIN.LOGIN, {
        email,
        password,
      });

      const data = res.data;
      localStorage.setItem("adminToken", data.data.access_token);
      console.log(data.data.access_token);

      navigate("/admin/dashboard");
    } catch (err) {
  console.error("Admin login failed:", err);

  if (err.response) {
    console.error("Response data:", err.response.data);
    console.error("Status code:", err.response.status);
    console.error("Headers:", err.response.headers);
  } else if (err.request) {
    console.error("Request sent but no response:", err.request);
  } else {
    console.error("Error setting up request:", err.message);
  }
}
  };

  return (
    <div className="container-1">
      <h1>NETWORKSCAN</h1>
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Admin Login</h1>

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
        </div>
      </div>

      <button className="button-79" role="button">
        <Link to="/user/login">User Login</Link>
      </button>
    </div>
  );
};

export default AdminLogin;
