import axios from "axios";
import { gateWayUrl } from "../api/baseUrls";

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
  
    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }
  
    try {
      const response = await axios.post(`${gateWayUrl}/api/user/public/refresh-Token`, {
        refreshToken,
      });
      const { accessToken } = response.data;
      
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      return null;
    }
  };