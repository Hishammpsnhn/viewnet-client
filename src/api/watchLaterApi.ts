//watch later

import apiClient, { handleError } from "./apiClient";

export const getWatchLaterSeries_API = async (profileId: string) => {
    try {
      const { data } = await apiClient.get(
        `content/public/series/watch-later/${profileId}`
      );
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  export const getWatchLaterMovies_API = async (profileId: string) => {
    try {
      const { data } = await apiClient.get(
        `content/public/movies/watch-later/${profileId}`
      );
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  export const addWatchLaterSeries_API = async (
    profileId: string,
    catalogId: string
  ) => {
    try {
      const { data } = await apiClient.post(`content/public/series/watch-later`, {
        profileId,
        catalogId,
      });
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  export const addWatchLaterMovies_API = async (
    profileId: string,
    catalogId: string
  ) => {
    try {
      const { data } = await apiClient.post(`content/public/movies/watch-later`, {
        profileId,
        catalogId,
      });
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  export const removeWatchLaterSeries_API = async (
    profileId: string,
    catalogId: string
  ) => {
    try {
      const { data } = await apiClient.delete(
        `content/public/series/watch-later`,
        {
          params: {
            profileId,
            catalogId,
          },
        }
      );
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  export const removeWatchLaterMovies_API = async (
    profileId: string,
    catalogId: string
  ) => {
    try {
      const { data } = await apiClient.delete(
        `content/public/movies/watch-later`,
        {
          params: {
            profileId,
            catalogId,
          },
        }
      );
      return data;
    } catch (error: any) {
      handleError(error, "Failed to fetch API");
    }
  };
  