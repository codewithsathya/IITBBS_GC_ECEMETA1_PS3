import axios from "axios";
import config from "../config.json"

const connectConfig = config[config.env]

const API = axios.create({ baseURL: connectConfig.backend_url });

// API.interceptors.request.use((req) => {});
API.defaults.withCredentials = true;

export const googleLogin = (formData) =>
  API.post("/api/user/googleLogin", formData);

export const logout = () => API.post("/api/user/logout");

export const checkStatus = () => API.get("/api/user/status");

export const createMeeting = () => API.post("/api/meeting");

export const inviteMembers = (formData) => {
  let meetingDetails = JSON.parse(localStorage.getItem("meeting-details"))
  return API.post(`/api/meeting/add/${meetingDetails.data._id}?meetingId=${meetingDetails.data._id}`, formData)
}
