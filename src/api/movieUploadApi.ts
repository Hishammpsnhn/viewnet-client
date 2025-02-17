import { MetaData, MovieFormData } from "../model/types/movie.types";
import apiClient, { handleError } from "./apiClient";

interface PresignedUrlResponse {
  success: boolean;
  signedUrls: {
    movieSignedUrl: { url: string; fileName: string };
    thumbnailSignedUrl: { url: string; fileName: string };
  };
  data: MetaData;
}
interface GetAllMetadataResponse {
  success: boolean;
  data: MetaData[];
}
interface GetMetadataResponse {
  success: boolean;
  data: MetaData;
}
interface UpdateThumbnailResponse {
  success: boolean;
  signedUrl: { url: string; fileName: string };
  data: MetaData;
  message?: string;
}

export const UploadMetadataAndGenerateSingedURL_API = async (
  formData: MovieFormData
): Promise<PresignedUrlResponse> => {
  try {
    const { data } = await apiClient.post<PresignedUrlResponse>(
      "/uploading/movies/generate-presigned-url",
      formData
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};
export const UpdataMetadata_API = async (
  id: string,
  formData: Partial<MetaData>
): Promise<PresignedUrlResponse> => {
  try {
    const { data } = await apiClient.put<PresignedUrlResponse>(
      `/uploading/movies/${id}`,
      formData
    );
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate presigned URL");
    throw error;
  }
};
export const GetAllMetadata_API = async (): Promise<GetAllMetadataResponse> => {
  try {
    const { data } = await apiClient.get(`/uploading/movies`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch movies");
    throw error;
  }
};

export const GetMetadata_API = async (
  id: string
): Promise<GetMetadataResponse> => {
  try {
    const { data } = await apiClient.get(`uploading/movies/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch");
    throw error;
  }
};
export const updateThumbnail_API = async (
  movieMetadata: MetaData,
  newThumbnail: File
): Promise<UpdateThumbnailResponse> => {
  const { data } = await apiClient.post(
    `/uploading/${movieMetadata._id}/update-thumbnail`,
    {
      title: movieMetadata.title,
      thumbnailContentType: newThumbnail.type,
    }
  );
  return data;
};

//reciever
export const getLatestMovies_API =
  async (): Promise<GetAllMetadataResponse> => {
    try {
      const { data } = await apiClient.get(`/uploading/movies/latest-movies`);
      console.log(data);
      return data;
    } catch (error) {
      handleError(error, "Failed to generate presigned URL");
      throw error;
    }
  };

//reciever
