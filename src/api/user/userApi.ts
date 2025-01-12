import axios from "axios";
import { gateWayUrl } from "../baseUrls";

export const login_API = async (email: string) => {
  try {
    const { data } = await axios.post(
      `${gateWayUrl}/api/user/login`,
      {
        email,
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const OtpVerify_API = async (otp: string, email: string) => {
  try {
    otp;
    const { data } = await axios.post(
      `${gateWayUrl}/api/user/otpVerify`,
      {
        otp,
        email,
      },
      { withCredentials: true }
    );
    data;
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
