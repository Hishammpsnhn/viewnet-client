import apiClient, { handleError } from "./apiClient";
import { UserPlan } from "../model/types/plan.types";

interface GetUserPlanDetailsResponse {
  success: boolean;
  userPlan: UserPlan[];
}

export const GETMe_API = async () => {
  try {
    const { data } = await apiClient.get(`/user/me`);
    return data;
  } catch (error: any) {
    console.log(error);

    handleError(error, "Failed to fetch API");
  }
};
export const login_API = async (email: string) => {
  try {
    const { data } = await apiClient.post(`/user/public/login`, {
      email,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch API");
  }
};
export const OtpVerify_API = async (otp: string, email: string) => {
  try {
    const { data } = await apiClient.post(`/user/public/otpVerify`, {
      otp,
      email,
      deviceId: navigator.userAgent,
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch API");
  }
};
export const Logout_API = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const { data } = await apiClient.get(`/user/logout/${refreshToken}`);

    return data;
  } catch (error) {
    handleError(error, "Failed to fetch API");
  }
};
export const GETAllUsers_API = async (
  page: number,
  limit: number = 5,
  search: string
): Promise<any | null> => {
  try {
    const { data } = await apiClient.get(`/user/admin/users`, {
      params: {
        page,
        limit,
        search,
      },
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};

export const UpdateUser_API = async (id: string, newData: any) => {
  try {
    const { data } = await apiClient.patch(`/user/admin/${id}`, {
      newData,
    });
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};


export const GETUserPlanDetails_API = async (userId: string) => {
  try {
    const { data } = await apiClient.get(`/subscription/${userId}/plans`);
    return data;
  } catch (error: any) {
    handleError(error, "Failed to fetch API");
  }
};
