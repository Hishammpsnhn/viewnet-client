import axios from "axios";
import { gateWayUrl } from "../baseUrls";

export const QRSave_API = async (random:string) => {
  try {
    const { data } = await axios.post(`${gateWayUrl}/api/user/qr`,{random});
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const QRValidate_API = async (id:string) => {
  try {
    const { data } = await axios.get(`${gateWayUrl}/api/user/qr/${id}`);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
//   export const OtpVerify_API = async (otp: string, email: string) => {
//     try {
//        (otp);
//       const { data } = await axios.post(`${gateWayUrl}/api/user/otpVerify`, {
//         otp,
//         email,
//       },{ withCredentials: true });
//        (data);
//       return data;
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
