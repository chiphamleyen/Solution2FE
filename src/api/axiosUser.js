import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosUser = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  console.log("Sending token:", token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosUser;
