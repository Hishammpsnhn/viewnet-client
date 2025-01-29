export interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  releaseDateTime: string;
  audience: "kids" | "adult";
  thumbnail: File | null;
  movieFile: File | null;
  trailerFile: File | null;
}
export interface MetaData {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDateTime: string;
  audience: "kids" | "adult";
  thumbnailUrl: string;
  movieFile: string;
  trailerFile: string;
  block: boolean;
  createdAt: string;
  updatedAt: string;
  uploadStatus: "pending" | "success" | "failed";
  transcoding: {
    status: "pending" | "processing" | "completed" | "failed";
    availableResolutions?: string[];
    format?: string[];
  };
}
