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

interface EncodedFiles {
  encodingStatus: string; 
  fileUrl: string;         
  format: string;          
  resolution: string;     
  _id: string;             
}

// Defines the movie data structure
export interface MovieCatalogData {
  _id: string;               
  metadataId: string;        
  movieName: string;        
  encodedFiles: EncodedFiles[]; 
}

export interface SearchMeta {
  _id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  isMovie?: boolean;

}