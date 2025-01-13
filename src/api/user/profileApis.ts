import axios from "axios";
import { gateWayUrl } from "../baseUrls";

interface ProfileData {
  username: string;
  isAdult: boolean;
  profilePic: string;
}

interface ProfileCreateResponse {
  success: boolean;
  user: any;
}

export const ProfileCreate_API = async (
  userId: string,
  profileData: ProfileData
): Promise<ProfileCreateResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    accessToken;
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
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
export const updateProfile_API = async (
  userId: string,
  defaultProfile: string
): Promise<ProfileCreateResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    accessToken;
    const { data } = await axios.patch<ProfileCreateResponse>(
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
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
