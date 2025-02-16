import apiClient, { handleError } from "./apiClient";

export const GetNotification_API = async (userId: string) => {
  try {
    const { data } = await apiClient.get(`/notification/${userId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
export const GetNotificationCount_API = async (userId: string) => {
  try {
    const { data } = await apiClient.get(`/notification/count/${userId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
export const DeleteNotification_API = async (userId: string) => {
  try {
    const { data } = await apiClient.delete(`/notification/${userId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
export const GetWatchTime_API = async (userId: string) => {
  try {
    const { data } = await apiClient.get(`/notification/watchTime`, {
      params: { userId },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
