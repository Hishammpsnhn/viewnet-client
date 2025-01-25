import axios, { AxiosHeaders } from "axios";
import { gateWayUrl } from "./baseUrls";
import { handleApiError } from "../utils/ErrorHanlder";
import { refreshAccessToken } from "../utils/RefreshToken";

const apiClient = axios.create({
  baseURL: `${gateWayUrl}/api`,
  withCredentials: true,
});
// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Use AxiosHeaders to set headers
      const headers = new AxiosHeaders();
      headers.set("Authorization", `Bearer ${accessToken}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("Network error or no response from server");
      return Promise.reject(new Error("Network error"));
    }

    const { status, config } = error.response;

    if (status === 403) {
     
      
        sessionStorage.setItem("isRedirecting", "true"); 
        localStorage.removeItem("accessToken"); 
        localStorage.removeItem("refreshToken");
       
        window.location.href = "/blocked";
        return;
      
    }

    if (status === 401 && !config._retry) {
      config._retry = true; 
      try {
        console.warn("Access token expired, attempting to refresh...");
        await refreshAccessToken();
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          if (config.data) {
            config.data = JSON.parse(config.data);
          }
          return apiClient(config); 
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

// Utility Function for Error Handling
export const handleError = (error: any, defaultMessage: string): never => {
  console.error("Error:", error);
  handleApiError(error);
  throw new Error(error.response?.data?.message || defaultMessage);
};

export default apiClient;
