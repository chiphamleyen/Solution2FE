// src/api/axiosAdmin.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosAdmin = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosAdmin;
