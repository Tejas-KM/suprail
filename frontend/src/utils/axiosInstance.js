// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change to your API domain
  withCredentials: true, // crucial for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Bootstrap Authorization header from storage (fallback when cookies are blocked in mobile WebView)
try {
  const storedToken =
    window?.localStorage?.getItem("auth_token") ||
    window?.sessionStorage?.getItem("auth_token");
  if (storedToken) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
} catch (_) {
  // ignore SSR or storage access errors
}

// Export a helper to set/remove token after login/logout
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
