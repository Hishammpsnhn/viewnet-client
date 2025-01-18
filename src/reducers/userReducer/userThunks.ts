import { createAsyncThunk } from "@reduxjs/toolkit";
import { GETMe_API, login_API, OtpVerify_API } from "../../api/user/userApi";
import { editProfile_API, ProfileCreate_API, updateProfile_API } from "../../api/user/profileApis";

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
        const data = await GETMe_API();
        return data; 
      } catch (error: any) {
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
  export const editProfile = createAsyncThunk(
    "user/EditProfile",
    async (
      { userId, profileData }: { userId: string; profileData: ProfileData },
      { rejectWithValue }
    ) => {
      try {
        const response = await editProfile_API(userId, profileData);
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