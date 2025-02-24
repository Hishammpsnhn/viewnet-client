import apiClient, { handleError } from "./apiClient";
interface ProfileData {
  username: string;
  isAdult: boolean;
  profilePic: string;
}


export const ProfileCreate_API = async (
  userId: string,
  profileData: ProfileData
) => {
  try {
    const { data } = await apiClient.post("/user/profile", {
      userId,
      profileData,
    });
    return data;
  } catch (error: any) {
    handleError(error, "Payment API request failed");
  }
};

export const updateProfile_API = async (
  userId: string,
  defaultProfile: any
) => {
  try {
    const { data } = await apiClient.post(`/user/profile/${userId}`, {
      defaultProfile,
    });
    return data;
  } catch (error: any) {
    handleError(error, "Payment API request failed");
  }
};

export const editProfile_API = async (userId: string, defaultProfile: any) => {
  try {
    const { data } = await apiClient.put(`/user/profile/${userId}`, {
      defaultProfile,
    });
    return data;
  } catch (error: any) {
    handleError(error, "Payment API request failed");
  }
};
