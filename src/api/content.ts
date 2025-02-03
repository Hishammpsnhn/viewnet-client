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
export const fetchMovieCatalog_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/content/public/movies/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const fetchMovieMetadata_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/content/public/movies/meta/${id}`);
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
export const getEpisodeCatalogDetails_API = async (id:string) => {
  try {
    const { data } = await apiClient.get(`/content/public/series/episode/catalog/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};






