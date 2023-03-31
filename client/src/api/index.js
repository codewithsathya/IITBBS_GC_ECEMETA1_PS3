import axios from "axios";
import config from "../config.json"

const API = axios.create({ baseURL: config.backend_url });

// API.interceptors.request.use((req) => {});
API.defaults.withCredentials = true;

export const googleLogin = (formData) =>
  API.post("/api/user/googleLogin", formData);

export const logout = () => API.post("/api/user/logout");

export const checkStatus = () => API.get("/api/user/status");
