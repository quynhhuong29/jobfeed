import { getApiRootUrl } from "@/config";
import { clearLocalStorageContent, getItem } from "@/utils/localStorage.util";
import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: getApiRootUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearLocalStorageContent();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
