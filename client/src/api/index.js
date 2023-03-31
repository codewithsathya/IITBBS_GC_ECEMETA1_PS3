import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// API.interceptors.request.use((req) => {});
API.defaults.withCredentials = true;

export const googleLogin = (formData) =>
  API.post("/api/user/googleLogin", formData);

export const logout = () => API.post("/api/user/logout");

export const checkStatus = () => API.get("/api/user/status");
