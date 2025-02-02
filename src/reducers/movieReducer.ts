import { createSlice } from "@reduxjs/toolkit";
import { MetaData } from "../model/types/movie.types";

interface MoviesState {
  movies: MetaData[];
  loading: boolean;
  error: string | null;
  selectedMovie: MetaData | null;
}
const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovie: null,
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
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  selectMovie,
  clearMovies,
} = MoviesSlice.actions;
export default MoviesSlice.reducer;
