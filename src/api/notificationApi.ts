import apiClient, { handleError } from "./apiClient";

export const GetNotification_API = async (userId:string) => {
    try {
      const { data } = await apiClient.get(`/notification/${userId}`);
      return data;
    } catch (error) {
      handleError(error, "Failed to fetch plans");
    }
  };
  