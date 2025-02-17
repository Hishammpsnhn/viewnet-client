import { createSlice } from "@reduxjs/toolkit";
import { MetaData, SearchMeta } from "../model/types/movie.types";
import { ISeriesResponse } from "../model/types/series.types";

interface MoviesState {
  movies: MetaData[];
  recommended: MetaData[];
  series: ISeriesResponse[];
  searchMeta: SearchMeta[];
  loading: boolean;
  error: string | null;
  selectedMovie: MetaData | ISeriesResponse | null;
  // selectedSeries: ISeriesResponse | null;
}
const initialState: MoviesState = {
  movies: [],
  series: [],
  searchMeta: [],
  recommended:[],
  loading: false,
  error: null,
  selectedMovie: null,
  //selectedSeries: null,
};
const MoviesSlice = createSlice({
  name: "Movies",
  initialState,
  reducers: {
    fetchMoviesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess: (state, action) => {
      state.movies = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMoviesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.selectedMovie = null;
      state.loading = false;
      state.error = null;
    },
    fetchSeriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSeriesSuccess: (state, action) => {
      state.series = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSeriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRecommended:(state,action)=>{
      state.recommended = action.payload;
    },
    // selectSeries: (state, action) => {
    //   state.selectedSeries = action.payload;
    // },
    fetchSearching: (state) => {
      state.loading = true;
    },
    addSearchingMeta: (state, action) => {
      state.searchMeta = action.payload;
    },
    fetchSearchingFailure: (state) => {
      state.loading = false;
    },
    clearSeries: (state) => {
      state.series = [];
      //state.selectedSeries = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  fetchSeriesStart,
  fetchSeriesSuccess,
  fetchSeriesFailure,
  clearSeries,
  addSearchingMeta,
  fetchSearching,
  fetchSearchingFailure,
  fetchRecommended,
  //selectSeries,
  selectMovie,
  clearMovies,
} = MoviesSlice.actions;
export default MoviesSlice.reducer;
