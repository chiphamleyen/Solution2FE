// src/api/axiosUser.js
import axios from "axios";

const BASE_URL = 'https://networkattack-hch7gmbudveqhaau.australiaeast-01.azurewebsites.net/api/';

const axiosUser = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosUser;
