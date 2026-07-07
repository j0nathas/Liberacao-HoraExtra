import axios from "axios";

const api = axios.create({
  baseURL: "http://10.109.133.63:3005",
  withCredentials: true
});

export default api;