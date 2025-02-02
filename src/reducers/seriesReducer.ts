import { createSlice } from "@reduxjs/toolkit";
import { ISeriesResponse } from "../model/types/series.types";

interface SeriesState {
  series: ISeriesResponse[];
  loading: boolean;
  error: string | null;
  selectedSeries: ISeriesResponse | null;
}
const initialState: SeriesState = {
  series: [],
  loading: false,
  error: null,
  selectedSeries: null,
};
const MoviesSlice = createSlice({
  name: "series",
  initialState,
  reducers: {
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
    selectSeries: (state, action) => {
      state.selectedSeries = action.payload;
    },
    clearSeries: (state) => {
      state.series = [];
      state.selectedSeries = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchSeriesFailure,
  fetchSeriesStart,
  fetchSeriesSuccess,
  clearSeries,
  selectSeries
} = MoviesSlice.actions;
export default MoviesSlice.reducer;
