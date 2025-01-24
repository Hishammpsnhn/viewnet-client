import axios from "axios";
import { gateWayUrl } from "../baseUrls";
import { Plan } from "../../model/types/user.types";
import { handleApiError } from "../../utils/ErrorHanlder";

const handleError = (error: any) => {
  if (error.response?.status === 403) {
    window.location.href = "/";
  } else {
    console.error("Error:", error);
    handleApiError(error);
  }
};

export interface PlansResponse {
  success: boolean;
  plan: Plan;
}
export interface GetPlansResponse {
  success: boolean;
  plans: Plan[];
}
export interface PaymentResponse {
  success: boolean;
  clientSecret: string;
  message?: string;
}
//plans
export const GetPlans_API = async (): Promise<GetPlansResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.get(`${gateWayUrl}/api/subscription`);
    return data;
  } catch (error: any) {
    console.error("Error creating profile:", error);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};
export const CreatePlans_API = async (planData: Plan) => {
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
    handleError(error);
  }
};
export const UpdatePlans_API = async (planId: string, planData: Plan) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.put(
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
    handleError(error);
  }
};


//payment
export const Payment_Success_API = async (
  planId: string,
  userId: string,
  paymentIntent: string
): Promise<any> => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("caling api success payment.......");
  try {
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.post(
      `${gateWayUrl}/api/subscription/payment-success`,
      {
        planId,
        userId,
        paymentIntent,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch {
    console.error("Payment failed");
    throw new Error("Payment failed");
  }
};
export const Payment_API = async (
  planId: string,
  userId: string
): Promise<PaymentResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const { data } = await axios.post(
      `${gateWayUrl}/api/subscription/payment`,
      {
        planId,
        userId,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (err: unknown) {
    console.log(err);
    handleApiError(err);
    throw new Error("Payment API request failed");
  }
};
