import axios from "axios";

const importEnv = import.meta.env.VITE_IP_BACK_END;

const api = axios.create({
  baseURL: importEnv,
  withCredentials: true
});

export default api; 