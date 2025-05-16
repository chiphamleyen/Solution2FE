// src/api/axiosAdmin.js
import axios from "axios";

const BASE_URL = 'https://networkattack-hch7gmbudveqhaau.australiaeast-01.azurewebsites.net/api';

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
