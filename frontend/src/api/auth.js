// src/api/auth.js
import axios from "../utils/axiosInstance";

export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials); // Server sets cookie
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/auth/me"); // Corrected route for backend
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};
