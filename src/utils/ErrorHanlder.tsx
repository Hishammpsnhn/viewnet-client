import { AxiosError } from "axios";
import { toast } from "react-toastify";

const TOAST_ERROR_ID = "api-error";

export const handleApiError = (err: unknown, retry?: () => void): void => {
  let errorMessage = "An unknown error occurred";

  if (err instanceof AxiosError) {
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.request) {
      errorMessage = "No response from server. Please check your network.";
    } else {
      errorMessage = "Request failed. Please try again.";
    }
  } else if (err instanceof Error) {
    errorMessage = err.message;
  } else if (err && typeof err === "object" && "message" in err) {
    errorMessage = (err as { message: string }).message;
  }

  console.error("API Error:", errorMessage);

  if (!toast.isActive(TOAST_ERROR_ID)) {
    toast.error(errorMessage, { toastId: TOAST_ERROR_ID });
  }

  if (retry) {
    setTimeout(retry, 3000);
  }
};
