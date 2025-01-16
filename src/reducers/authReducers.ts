import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GETMe_API, login_API, OtpVerify_API } from "../api/user/userApi";
import { UserType } from "../model/types/user.types";
import { ProfileCreate_API, updateProfile_API } from "../api/user/profileApis";

interface UserState {
  loading: boolean;
  error: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  selectedProfile: any;
}

// Initial state
const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
  selectedProfile: null,
};

// Thunk to login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (email: string, { rejectWithValue }) => {
    try {
      return login_API(email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Thunk to verify OTP
export const verifyOtp = createAsyncThunk(
  "user/verifyotp",
  async (
    { otp, email }: { otp: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      return OtpVerify_API(otp, email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);
export const getME = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      const data = await GETMe_API(); // Ensure GETMe_API returns the data
      return data; // Return the data if successful
    } catch (error: any) {
      // Handle the error, use rejectWithValue to send the error message
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

interface ProfileData {
  id?: string;
  username: string;
  isAdult: boolean;
  profilePic: string;
}
// Thunk to update user profile
export const editProfile = createAsyncThunk(
  "user/EditProfile",
  async (
    { userId, profileData }: { userId: string; profileData: ProfileData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProfile_API(userId, profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    { userId, profileData }: { userId: string; profileData: ProfileData },
    { rejectWithValue }
  ) => {
    try {
      const response = await ProfileCreate_API(userId, profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const updateDefaultProfile = createAsyncThunk(
  "user/updateDefaultProfile",
  async (
    { userId, defaultProfile }: { userId: string; defaultProfile: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProfile_API(userId, defaultProfile);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
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
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.selectedProfile = action.payload.user.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
        localStorage.setItem("token", action.payload.accessToken);
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
        action.payload;
        //localStorage.setItem("token", action.payload.accessToken);
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

        // Update the user profiles in the state
        if (state.user) {
          const updatedProfileIndex = state.user.profiles.findIndex(
            (profile: any) => profile._id === action.payload.user.id
          );
          console.log(updatedProfileIndex);
          if (updatedProfileIndex !== -1) {
            state.user.profiles[updatedProfileIndex] = action.payload.user;
          }
        }

        // Update local storage
        localStorage.setItem("user", JSON.stringify(state.user));
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
        action.payload;
        state.loading = false;
        state.user = action.payload.user;
        state.selectedProfile = action.payload.user.profiles.find(
          (item: any) => item._id === action.payload.user.defaultProfile
        );
        localStorage.setItem("user", JSON.stringify(state.user));
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
