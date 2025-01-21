import axios from "axios";
import { gateWayUrl } from "../baseUrls";
import { toast } from "react-toastify";
import { handleApiError } from "../../utils/ErrorHanlder.tsx";

interface ProfileData {
  username: string;
  isAdult: boolean;
  profilePic: string;
}

interface ProfileCreateResponse {
  success: boolean;
  user: any;
}

const handleError = (error: any) => {
  if (error.response?.status === 403) {
    window.location.href = "/";
  } else {
    console.error("Error:", error);
    handleApiError(error);
  }
};

export const ProfileCreate_API = async (
  userId: string,
  profileData: ProfileData
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.post<ProfileCreateResponse>(
      `${gateWayUrl}/api/user/profile`,
      {
        userId,
        profileData,
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
    handleError(error);
  }
};

export const updateProfile_API = async (
  userId: string,
  defaultProfile: any
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.patch<any>(
      `${gateWayUrl}/api/user/profile/${userId}`,
      {
        defaultProfile,
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
    handleError(error);
  }
};

export const editProfile_API = async (
  userId: string,
  defaultProfile: any
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.put<any>(
      `${gateWayUrl}/api/user/profile/${userId}`,
      {
        defaultProfile,
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
    handleError(error);
  }
};
