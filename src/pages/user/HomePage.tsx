import React, { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { QRScanner_API } from "../../api/user/qrLogin";
import MovieCard from "../../components/card/MovieCard";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import VideoBanner from "../../components/VideoBanner";

const ScrollableSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="ml-16 relative mb-10 ">
      <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6 ">Recommended for You</h1>
      <div className="relative mb-5">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
        >
          <IoIosArrowBack />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hidden"
        >
          {[...Array(10)].map((_, index) => (
            <MovieCard key={index} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent to-black text-white p-3 shadow-md z-10 h-full"
        >
          <IoIosArrowForward />
        </button>
      </div>
      <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6">Latest</h1>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
        >
          <IoIosArrowBack />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hidden"
        >
          {[...Array(10)].map((_, index) => (
            <MovieCard key={index} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent to-black text-white p-3 shadow-md z-10 h-full"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

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
      const res = await QRScanner_API(token);
      toast.update(loadingToast, {
        render: res ? "Login successfully!" : "Failed to scan QR code.",
        type: res ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        className: "bg-black",
      });
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
    <div className="relative mb-6">
      <VideoBanner />
      <div className="absolute top-[60vh] md:top-[70vh] w-full z-10">
        <ScrollableSection/>
      </div>
    </div>

    {/* <div className="mt-[0vh] md:mt-[30vh]">
      <ScrollableSection title="Trending Now" />
      <ScrollableSection title="Top Picks" />
    </div> */}

    <ToastContainer theme="dark"/>
  </div>
  );
};
