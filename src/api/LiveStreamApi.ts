import { LiveDetailModel } from "../model/types/live.types";
import apiClient, { handleError } from "./apiClient";

export const StreamLiveStart_API = async (formData: LiveDetailModel) => {
  try {
    const { data } = await apiClient.post(`/live`, {
      formData,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const StreamLiveDetails_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/live/stream-details/${id}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const StreamList_API = async () => {
  try {
    const { data } = await apiClient.get(`/live/user/list/all`);
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const ActiveStreamList_API = async () => {
  try {
    const { data } = await apiClient.get(`/live/user/list/active`);
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const StopStreaming_API = async (streamId: string) => {
  try {
    const { data } = await apiClient.post(`/live/stop-stream`, {
      streamId,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const RemoveStreaming_API = async (streamId: string) => {
  try {
    const { data } = await apiClient.delete(`/live/remove-stream/${streamId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const GetAssets_API = async (page: number) => {
  try {
    const { data } = await apiClient.get(`/live/user/assets`, {
      params: {
        page,
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
export const GetAssetsDetails_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/live/user/assets-details/${id}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};
