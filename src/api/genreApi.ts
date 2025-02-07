//watch later

import { Genre } from "../model/types/genrePage";
import apiClient, { handleError } from "./apiClient";

export const getAllGenre_API = async () => {
  try {
    const { data } = await apiClient.get(`uploading/genre`);
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};

export const createGenre_API = async (formData: Genre) => {
  try {
    const { data } = await apiClient.post(`uploading/genre`, formData);
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
