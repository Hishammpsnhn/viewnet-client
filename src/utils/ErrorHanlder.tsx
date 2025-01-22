import { AxiosError } from "axios"; 
import { toast } from "react-toastify";

export const handleApiError = (err: unknown): void => {

  if (err instanceof AxiosError) {
    if (err.response && err.response.data && err.response.data.message) {

      toast.error(err.response.data.message);
      console.error("API Error:", err.response.data.message);
      return;
    } else {
      const fallbackMessage = "An unknown error occurred";
      toast.error(fallbackMessage);
      console.error("API Error:", fallbackMessage);
      return;
    }
  }

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
