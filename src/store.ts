import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/userReducer/userReducers";
import movieReducer from "./reducers/movieReducer";
import seriesReducer from "./reducers/seriesReducer";

const store = configureStore({
  reducer: {
    user: authReducer,
    series:seriesReducer,
    movies:movieReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
