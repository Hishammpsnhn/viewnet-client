export interface ISeries {
  title: string;
  isRelease: boolean;
  description: string;
  genre: string;
  isBlock:boolean;
  releaseDate: Date;
  rating: number;
  posterImage?: string | null;
  seasons: ISeason[];
  audience: "kids" | "adults";
}

export interface ISeason {
  _id?: string;
  seriesId: string;
  seasonNumber: number;
  releaseDate: Date;
  episodes: IEpisode[];
}
export interface IEpisode {
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  releaseDate: Date;
  videoUrl: File | null;
  key:string;
  transcoding: "pending" | "completed" | "failed" | "processing";
  thumbnailUrl: File | null;
  _id?:string
}

export interface IEpisodeResponse extends IEpisode {
  _id: string; 
}
export interface ISeriesResponse {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: Date;
  isRelease:boolean;
  isBlock:boolean;
  rating: number;
  posterImage: string 
  thumbnailUrl: string,
  seasons: string[];
  audience: "kids" | "adults";
}
export interface ISeriesDetailsResponse {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseDate: Date;
  rating: number;
  isBlock:boolean;
  posterImage: string 
  seasons: ISeasonRes[];
  audience: "kids" | "adults";
}

export interface ISeasonRes {
  _id: string;
  seriesId: string;
  seasonNumber: number;
  releaseDate: string;
  episodes: IEpisodeRes[];
}
export interface IEpisodeRes {
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  releaseDate: Date;
  key:string,
  videoUrl: File | null;
  transcoding: "pending" | "completed" | "failed" | "processing";
  thumbnailUrl:string;
  progress?:number;
  _id:string
}

//catalog
interface Resolution {
  resolution: string;
  fileUrl: string;
  format: string;
  _id: string;
}

export interface EpisodeCatalog {
  _id: string;
  episodeId: string;
  key: string;
  resolutions: Resolution[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
