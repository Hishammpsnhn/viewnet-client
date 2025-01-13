import { toast, ToastContainer } from "react-toastify";
import { QRScanner_API } from "../../api/user/qrLogin";
import Carousel from "../../components/Carousel";
import MovieCard from "../../components/card/MovieCard";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export const HomePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (token) {
      qrCalling(token);
    }
  }, [token]);

  async function qrCalling(token: string) {
    const loadingToast = toast.loading("Scanning QR code...");
    try {
      let res = await QRScanner_API(token);
      if (res) {
        toast.update(loadingToast, {
          render: "Login successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          className: "bg-black",
        });
        //window.location.replace("/");
      } else {
        toast.update(loadingToast, {
          render: "Failed to scan QR code.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          className: "bg-black",
        });
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: "An error occurred while scanning the QR code.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        className: "bg-black",
      });
    }
  }

  return (
    <div className="">
      {/* Carousel Section */}
      <div className="mb-6">
        <Carousel />
      </div>

      {/* Horizontal Scroll Section */}
      <div className="ml-16 overflow-x-auto scrollbar-hidden">
        <h1 className="text-2xl font-bold pb-6">Recommended</h1>
        <div className="flex space-x-12 w-max scrollbar-hidden">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
      {/* ToastContainer should be placed here */}
      <ToastContainer />
    </div>
  );
};
