
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  UserType } from "../../model/types/user.types";
import { getME, loginUser, verifyOtp ,editProfile,updateDefaultProfile,updateUserProfile} from "./userThunks";

interface UserState {
  loading: boolean;
  error: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  selectedProfile:any;
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  selectedProfile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // OTP verification cases
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.selectedProfile = action.payload?.user?.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Me cases
      .addCase(getME.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getME.fulfilled, (state, action) => {
        action.payload;
        state.loading = false;
        state.user = action.payload?.user;
        state.isAuthenticated = action.payload?.user ? true : false;
        state.selectedProfile = action.payload?.user?.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(getME.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        action.payload;
        state.loading = false;
        state.user = action.payload.user;
        state.selectedProfile = action.payload.user.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
      })
      .addCase(
        updateUserProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        if (state.user) {
          const updatedProfileIndex = state.user.profiles.findIndex(
            (profile: any) => profile._id === action.payload.user._id
          );
          console.log(updatedProfileIndex);
          if (updatedProfileIndex !== -1) {
            state.user.profiles[updatedProfileIndex] = action.payload.user;
          }
          if(state.selectedProfile._id === action.payload.user._id){
            state.selectedProfile = action.payload.user;
          }
        }

      })
      .addCase(editProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update default profile cases
      .addCase(updateDefaultProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDefaultProfile.fulfilled, (state, action) => {
        console.log(action.payload)
        action.payload;
        state.loading = false;
        state.user = action.payload.user;
        state.selectedProfile = action.payload.user.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
      })
      .addCase(
        updateDefaultProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
