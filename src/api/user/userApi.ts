import axios from "axios";
import { gateWayUrl } from "../baseUrls";
import cookie from "js-cookie";
import { handleApiError } from "../../utils/ErrorHanlder";
import { GetUserPlanDetailsResponse } from "../../model/types/user.types";


const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await axios.post(`${gateWayUrl}/api/user/refresh-Token`, {
      refreshToken,
    });
    const { accessToken } = response.data;
    console.log("access token created by refresth", accessToken);
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

export const GETMe_API = async (): Promise<any | null> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.get(`${gateWayUrl}/api/user/me`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log("calling new access");
      const newAccessToken = await refreshAccessToken();
      console.log("new access token", newAccessToken);

      if (newAccessToken) {
        return GETMe_API();
      }
    }
  }
};
export const login_API = async (email: string) => {
  try {
    const { data } = await axios.post(
      `${gateWayUrl}/api/user/login`,
      {
        email,
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    handleApiError(error);
  }
};
export const OtpVerify_API = async (otp: string, email: string) => {
  try {
    const { data } = await axios.post(
      `${gateWayUrl}/api/user/otpVerify`,
      {
        otp,
        email,
        deviceId: navigator.userAgent,
      },
      { withCredentials: true }
    );
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (error) {
    handleApiError(error);
    console.error("Error:", error);
  }
};
export const Logout_API = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.get(
      `${gateWayUrl}/api/user/logout/${refreshToken}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    handleApiError(error);
    console.error("Error:", error);
  }
};
export const GETAllUsers_API = async (): Promise<any | null> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.get(`${gateWayUrl}/api/user/users`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    console.log(error);
    handleApiError(error);
  }
};
export const UpdateUser_API = async (id: string, newData: any) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.patch(
      `${gateWayUrl}/api/user/${id}`,
      {
        newData,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    console.log(error);
    handleApiError(error);
  }
};

export const GETUserPlanDetails_API = async (
  userId: string
): Promise<any | undefined> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.get(
      `${gateWayUrl}/api/subscription/${userId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    console.log(error);
    handleApiError(error);
  }
};
