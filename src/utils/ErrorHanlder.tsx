import { AxiosError } from "axios"; // Import AxiosError to type the error
import { toast } from "react-toastify";

export const handleApiError = (err: unknown): void => {
  // First, check if the error is an AxiosError
  if (err instanceof AxiosError) {
    if (err.response && err.response.data && err.response.data.message) {
      // If response data contains a message, display it
      toast.error(err.response.data.message);
      console.error("API Error:", err.response.data.message);
      return;
    } else {
      // If no message is found, display a fallback message
      const fallbackMessage = "An unknown error occurred";
      toast.error(fallbackMessage);
      console.error("API Error:", fallbackMessage);
      return;
    }
  }

  // Handle standard JavaScript errors (Error object)
  if (err instanceof Error) {
    toast.error(err.message);
    console.error("API Error:", err.message);
  } else if (err && typeof err === "object" && "message" in err) {
    // Handle custom errors with a 'message' property
    const errorMessage = (err as { message: string }).message;
    toast.error(errorMessage);
    console.error("API Error:", errorMessage);
  } else {
    // Handle unknown errors
    toast.error("An unknown error occurred");
    console.error("Unknown error occurred");
  }
};
