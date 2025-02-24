import apiClient, { handleError } from "./apiClient";

//public
export const getLatestMovies_API = async (page: number, limit: number = 5) => {
  try {
    const { data } = await apiClient.get(`/content/public/movies`, {
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getLatestSeries_API = async (page: number) => {
  try {
    const { data } = await apiClient.get(`/content/public/series`,{
      params: {
        page,
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const fetchMovieCatalog_API = async (
  id: string,
  profileId?: string | null
) => {
  try {
    const { data } = await apiClient.get(`/content/public/movies/catalog`, {
      params: {
        id,
        profileId,
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const fetchMovieMetadata_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/content/public/movies/meta/${id}`);
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};

export const getSeriesDetails_API = async (id: string, profileId?: string) => {
  try {
    const { data } = await apiClient.get(`/content/public/series/${id}`, {
      params: {
        profileId,
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getEpisodeDetails_API = async (
  id: string,
  profileId?: string,
  seriesId?: string
) => {
  try {
    const { data } = await apiClient.get(
      `/content/public/series/episode/${id}`,
      {
        params: {
          profileId,
          seriesId,
        },
      }
    );
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};
export const getEpisodeCatalogDetails_API = async (
  id: string,
  profileId?: string
) => {
  try {
    const { data } = await apiClient.get(
      `/content/public/series/episode/catalog/${id}`,
      {
        params: {
          profileId,
        },
      }
    );
    return data;
  } catch (error) {
    handleError(error, "Failed");
    throw error;
  }
};

//Hisory

export const GETUserWatchHistory_API = async (profileId: string) => {
  try {
    const { data } = await apiClient.get(`content/public/history`, {
      params: { profileId },
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
export const ClearUserWatchHistory_API = async (profileId: string) => {
  try {
    const { data } = await apiClient.delete(
      `content/public/history/${profileId}`
    );
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
export const WatchHistoryUpdate_API = async (
  profileId: string,
  videoCatalogId: string,
  progress: number
) => {
  try {
    const { data } = await apiClient.post(`content/public/history`, {
      profileId,
      videoCatalogId,
      progress,
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
export const HistoryContinue_API = async (
  profileId: string,
  videoCatalogId: string
) => {
  try {
    const { data } = await apiClient.get(`content/public/history/continue`, {
      params: {
        profileId,
        videoCatalogId,
      },
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};

//recommended
export const RecommendedMovie_API = async (profileId: string) => {
  try {
    const { data } = await apiClient.get(
      `content/public/movies/recommended/${profileId}`
    );
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};

//search
export const searchMovie_API = async (q: string) => {
  try {
    const { data } = await apiClient.get(`content/public/movies/query`, {
      params: {
        q,
      },
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
// http://localhost:4000/api/content/public/movies/recommended/:id
