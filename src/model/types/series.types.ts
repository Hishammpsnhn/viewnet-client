export interface ISeries {
    title: string;
    description: string;
    genre: string;
    releaseDate: Date;
    rating: number;
    posterImage?: string | null;
    seasons: string[];
    audience: "kids" | "adults";
  }
  
  export interface ISeason {
    seriesId: string;
    seasonNumber: number;
    releaseDate: Date;
    episodes: string[];
  }
  export interface IEpisode {
    seasonId: string;
    episodeNumber: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: Date;
    videoUrl: string;
  }
    