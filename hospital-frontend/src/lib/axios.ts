import axios from "axios";
import {tokenStorage} from "../features/auth/utils/tokenStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;

apiClient.interceptors.request.use(
    (config) => {
        const isPublicEndpoint =
    config.url?.includes("/api/auth/");

        
        if (!isPublicEndpoint) {
            const token = tokenStorage.get();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);