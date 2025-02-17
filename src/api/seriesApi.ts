import { IEpisode, ISeason, ISeries } from "../model/types/series.types";
import apiClient, { handleError } from "./apiClient";

interface Catalog {
  key: string;
  episodeId: string;
  format: string;
}

//series APIs
export const GetAllSeries_API = async () => {
  try {
    const { data } = await apiClient.get(`/uploading/series`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch series");
    throw error;
  }
};
export const CreateSeries_API = async (seriesData: ISeries) => {
  try {
    const { data } = await apiClient.post(`/uploading/series`, seriesData);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to  create series");
    throw error;
  }
};

export const fetchSeriesDetails_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/uploading/series/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch series detail");
    throw error;
  }
};

export const updateSeriesDetails_API = async (
  id: string,
  newData: Partial<ISeries>
) => {
  try {
    const { data } = await apiClient.put(`/uploading/series/${id}`, newData);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed ");
    throw error;
  }
};

//season APIs

export const createSeason_API = async (id: string, seasonDetails: ISeason) => {
  try {
    const { data } = await apiClient.post(
      `/uploading/seasons/${id}`,
      seasonDetails
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to create season");
    throw error;
  }
};


//episode APIs
export const createEpisodeWithSignedUrl_API = async (episodeData: IEpisode) => {
  try {
    const { data } = await apiClient.post(
      `/uploading/episode/generateSignedUrl`,
      episodeData
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to create episode");
    throw error;
  }
};
export const createEpisodeCatalog_API = async (obj: Catalog) => {
  try {
    const { data } = await apiClient.post(`/uploading/episode/catalog`, obj);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to create episode catalog");
    throw error;
  }
};
export const getEpisodeCatalog_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/uploading/episode/catalog/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to get episode catalog");
    throw error;
  }
};







