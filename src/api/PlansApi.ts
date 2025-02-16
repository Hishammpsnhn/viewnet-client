import apiClient, { handleError } from "./apiClient";
import { Plan } from "../model/types/user.types";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

// // Interfaces for API responses
// export interface PlansResponse {
//   success: boolean;
//   plan: Plan;
// }

// export interface GetPlansResponse {
//   success: boolean;
//   plans: Plan[];
// }

// export interface PaymentResponse {
//   success: boolean;
//   clientSecret: string;
//   message?: string;
// }

// Plans APIs
export const GetPlans_API = async () => {
  try {
    const { data } = await apiClient.get("/subscription/public");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};

export const CreatePlans_API = async (planData: Plan) => {
  try {
    const { data } = await apiClient.post("/subscription/admin", planData);
    return data;
  } catch (error) {
    handleError(error, "Failed to create plan");
  }
};

export const UpdatePlans_API = async (planId: string, planData: Plan) => {
  try {
    const { data } = await apiClient.put(
      `/subscription/admin/${planId}`,
      planData
    );
    return data;
  } catch (error) {
    handleError(error, "Failed to update plan");
  }
};

// Payment APIs
export const Payment_API = async (planId: string, userId: string,email:string) => {
  try {
    const { data } = await apiClient.post("/subscription/payment", {
      planId,
      userId,
      email
    });
    return data;
  } catch (error) {
    handleError(error, "Payment API request failed");
  }
};

export const Payment_Success_API = async (
  planId: string,
  userId: string,
  paymentIntent: string
) => {
  try {
    const { data } = await apiClient.post("/subscription/payment-success", {
      planId,
      userId,
      paymentIntent,
    });
    return data;
  } catch (error) {
    handleError(error, "Payment success API request failed");
  }
};

export const GETPaymentHistory_API = async (page: number, limit: number) => {
  try {
    const transactions = await apiClient.get("/subscription/transactions", {
      params: {
        page,
        limit,
      },
    });
    console.log("Transaction from stripe", transactions);
    return transactions;
  } catch (error) {
    handleError(error, "Transactions API request failed");
  }

  // Mock API call
};
