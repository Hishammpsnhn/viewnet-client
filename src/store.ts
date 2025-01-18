import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/userReducer/userReducers";

const store = configureStore({
  reducer: {
    user: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
