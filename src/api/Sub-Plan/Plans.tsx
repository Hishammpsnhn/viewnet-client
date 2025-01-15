import axios from "axios";
import { gateWayUrl } from "../baseUrls";
import { Plan } from "../../model/types/user.types";

export interface PlansResponse {
  success: boolean;
  plans: Plan[];
}
export const GetPlans_API = async (): Promise<PlansResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    accessToken;
    const { data } = await axios.get(`${gateWayUrl}/api/subscription`);
    return data;
  } catch (error: any) {
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
export const CreatePlans_API = async (
  planData: Plan
): Promise<PlansResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    accessToken;
    const { data } = await axios.post(
      `${gateWayUrl}/api/subscription`,
      {
        planData,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
export const UpdatePlans_API = async (
  planId:string,
  planData: Plan
): Promise<PlansResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    accessToken;
    const { data } = await axios.post(
      `${gateWayUrl}/api/subscription/${planId}`,
      {
        planData,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
