import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { QRScanner_API } from "../../api/qrLogin";
import MovieCard from "../../components/card/MovieCard";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import VideoBanner from "../../components/VideoBanner";
import { getLatestMovies_API, getLatestSeries_API } from "../../api/content";
import { ISeries, ISeriesResponse } from "../../model/types/series.types";
import { MetaData } from "../../model/types/movie.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchMoviesFailure,
  fetchMoviesStart,
  fetchMoviesSuccess,
} from "../../reducers/movieReducer";
import {
  fetchSeriesFailure,
  fetchSeriesStart,
  fetchSeriesSuccess,
} from "../../reducers/seriesReducer";

const ScrollableSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, movies } = useSelector(
    (state: RootState) => state.movies
  );
  const series = useSelector((state: RootState) => state.series);
  //const [loading, setLoading] = useState(false);
  const [LatestSeries, setLatestSeries] = useState<ISeriesResponse[]>([]);
  const [LatestMovies, setLatestMovies] = useState<MetaData[]>([]);

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

  useEffect(() => {
    async function fetchLatestSeries() {
      dispatch(fetchSeriesStart());
      try {
        const response = await getLatestSeries_API();
        if (response.success) {
          dispatch(fetchSeriesSuccess(response.series));
        } else {
          dispatch(fetchSeriesFailure("Failed to fetch series"));
        }
      } catch (error: any) {
        console.log(error);
        dispatch(fetchSeriesFailure(error.message));
      }
    }
    async function fetchLatestMovies() {
      dispatch(fetchMoviesStart());
      try {
        const response = await getLatestMovies_API();
        if (response.success) {
          dispatch(fetchMoviesSuccess(response.data));
        } else {
          dispatch(fetchMoviesFailure("Failed to fetch movies"));
        }
      } catch (error: any) {
        console.log(error);
        dispatch(fetchMoviesFailure(error.message));
      }
    }
    fetchLatestMovies();
    fetchLatestSeries();
  }, []);

  return (
    <div className="ml-16 relative mb-10 ">
      <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6 ">
        Latest Series
      </h1>
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
          {series.series.map((movie, index) => (
            <MovieCard
              url={`/series/${movie._id}/more`}
              title={movie.title}
              description={movie.description}
              id={movie._id}
              image={movie.posterImage}
              key={index}
            />
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
      <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6">
        Latest Movies
      </h1>
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
          {movies.map((movie, index) => (
            <MovieCard
              url={`/movie/${movie._id}details/more`}
              title={movie.title}
              description={movie.description}
              id={movie._id}
              image={movie.thumbnailUrl}
              key={index}
            />
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
          <ScrollableSection />
        </div>
      </div>

      {/* <div className="mt-[0vh] md:mt-[30vh]">
      <ScrollableSection title="Trending Now" />
      <ScrollableSection title="Top Picks" />
    </div> */}

      <ToastContainer theme="dark" />
    </div>
  );
};
