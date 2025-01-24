import apiClient, { handleError } from "./apiClient";

export const QRSave_API = async (random: string) => {
  try {
    const { data } = await apiClient.post(`/user/qr`, { random });
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
export const QRValidate_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/user/qr/${id}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
export const QRScanner_API = async (id: string) => {
  try {
    const { data } = await apiClient.get(`/user/qr/scan/${id}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch plans");
  }
};
