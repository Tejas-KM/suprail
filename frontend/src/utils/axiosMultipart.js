// src/utils/axiosInstance.js
import axios from "axios";

const axiosMultipartInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change to your API domain
  withCredentials: true, // crucial for cookie-based auth
});

export default axiosMultipartInstance;
