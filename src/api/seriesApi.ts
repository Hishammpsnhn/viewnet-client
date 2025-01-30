import { ISeries } from "../model/types/series.types";
import apiClient, { handleError } from "./apiClient";

//series APIs
export const CreateSeries_API = async (seriesData: ISeries) => {
  try {
    const { data } = await apiClient.post(`/uploading/series`, seriesData );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};

//season APIs

//episode APIs
