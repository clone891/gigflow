import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // REQUIRED for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
