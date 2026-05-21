import axios from "axios";

const api = axios.create({
  baseURL: "https://foodhub-jopb.onrender.com/api"
});

export default api;
