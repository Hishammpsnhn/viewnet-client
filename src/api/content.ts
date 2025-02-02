import axios from "axios";
import { IEpisode, ISeason, ISeries } from "../model/types/series.types";
import apiClient, { handleError } from "./apiClient";

//public
export const getLatestMovies_API = async () => {
  try {
    const { data } = await apiClient.get(`/content/public/movies`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getLatestSeries_API = async () => {
  try {
    const { data } = await apiClient.get(`/content/public/series`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getSeriesDetails_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/content/public/series/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getEpisodeDetails_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/content/public/series/episode/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};







//series
export const fetchSeriesDetails_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/uploading/series/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
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
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};

//season
export const createSeason_API = async (id: string, seasonDetails: ISeason) => {
  try {
    const { data } = await apiClient.post(
      `/uploading/seasons/${id}`,
      seasonDetails
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};

//episode
export const createEpisodeWithSignedUrl_API = async (episodeData: IEpisode) => {
  try {
    const { data } = await apiClient.post(
      `/uploading/episode/generateSignedUrl`,
      episodeData
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};
