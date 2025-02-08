import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { QRScanner_API } from "../../api/qrLogin";
import MovieCard from "../../components/card/MovieCard";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import VideoBanner from "../../components/VideoBanner";
import {
  getLatestMovies_API,
  getLatestSeries_API,
  RecommendedMovie_API,
} from "../../api/content";
import { ISeries, ISeriesResponse } from "../../model/types/series.types";
import { MetaData } from "../../model/types/movie.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchMoviesFailure,
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchSeriesFailure,
  fetchSeriesStart,
  fetchSeriesSuccess,
  selectMovie,
} from "../../reducers/movieReducer";

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
        <div className="absolute top-[60vh] md:top-[70vh] w-full z-10 pl-16">
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

const ScrollableSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const moviesRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [moviePage, setMoviePage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreSeries, setHasMoreSeries] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<MetaData[]>([]);

  const { loading, movies, series } = useSelector(
    (state: RootState) => state.movies
  );

  const { user } = useSelector((state: RootState) => state.user);

  const scroll = (
    direction: "left" | "right",
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll-based loading for movies
  const handleMoviesScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const scrollThreshold = scrollWidth - clientWidth - 100; // 100px before the end

    if (scrollLeft > scrollThreshold && !isLoadingMore && hasMoreMovies) {
      setIsLoadingMore(true);
      await fetchMovies(moviePage + 1);
      setMoviePage((prev) => prev + 1);
      setIsLoadingMore(false);
    }
  };

  const handleSeriesScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const scrollThreshold = scrollWidth - clientWidth - 100;

    if (scrollLeft > scrollThreshold && !isLoadingMore && hasMoreSeries) {
      setIsLoadingMore(true);
      await fetchSeries(seriesPage + 1);
      setSeriesPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }
  };

  const fetchMovies = async (page: number) => {
    if (!hasMoreMovies) return;

    dispatch(fetchMoviesStart());
    try {
      const response = await getLatestMovies_API(page);
      if (response.success) {
        if (page === 1) {
          dispatch(fetchMoviesSuccess(response.data));
        } else {
          dispatch(fetchMoviesSuccess([...movies, ...response.data]));
        }
        setHasMoreMovies(response.data.length > 0);
      } else {
        dispatch(fetchMoviesFailure("Failed to fetch movies"));
        setHasMoreMovies(false);
      }
    } catch (error: any) {
      dispatch(fetchMoviesFailure(error.message));
      setHasMoreMovies(false);
    }
  };

  const fetchSeries = async (page: number) => {
    if (!hasMoreSeries) return;

    dispatch(fetchSeriesStart());
    try {
      const response = await getLatestSeries_API(page);
      if (response.success) {
        if (page === 1) {
          dispatch(fetchSeriesSuccess(response.data));
        } else {
          dispatch(fetchSeriesSuccess([...series, ...response.data]));
        }
        setHasMoreSeries(response.data.length > 0);
      } else {
        dispatch(fetchSeriesFailure("Failed to fetch series"));
        setHasMoreSeries(false);
      }
    } catch (error: any) {
      dispatch(fetchSeriesFailure(error.message));
      setHasMoreSeries(false);
    }
  };
  const fetchRecommandation = async () => {
    // if (!hasMoreSeries) return;

    // dispatch(fetchSeriesStart());
    try {
      if (!user?.defaultProfile) return;
      const response = await RecommendedMovie_API(user?.defaultProfile);
      if (response.success) {
        setRecommendedMovies(response.data);

        // if (page === 1) {
        //   dispatch(fetchSeriesSuccess(response.data));
        // } else {
        //   dispatch(fetchSeriesSuccess([...series, ...response.data]));
        // }
        //setHasMoreSeries(response.data.length > 0);
      } else {
        // dispatch(fetchSeriesFailure("Failed to fetch series"));
        // setHasMoreSeries(false);
      }
    } catch (error: any) {
      // dispatch(fetchSeriesFailure(error.message));
      // setHasMoreSeries(false);
    }
  };
  useEffect(() => {
    if (movies.length === 0) fetchMovies(1); 
    if (series.length === 0) fetchSeries(1); 
    if (user?.defaultProfile) fetchRecommandation();
  }, []);

  return (
    <div className=" relative mb-10 overflow-hidden">
      {recommendedMovies.length > 0 && (
        <>
          <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6 ">
            Recommended
          </h1>
          <div className="relative mb-5">
            <button
              //onClick={() => scroll("left", seriesRef)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
            >
              <IoIosArrowBack />
            </button>

            <div
              // ref={seriesRef}
              //  onScroll={handleSeriesScroll}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >
              {recommendedMovies.map((movie, index) => (
                <div
                  key={movie._id}
                  onClick={() => dispatch(selectMovie(movie))}
                >
                  <MovieCard
                    url={`/movie/${movie._id}/more`}
                    title={movie.title}
                    description={movie.description}
                    id={movie._id}
                    image={movie.thumbnailUrl}
                    key={index}
                    series={false}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll("right", seriesRef)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent to-black text-white p-3 shadow-md z-10 h-full"
            >
              <IoIosArrowForward />
            </button>
          </div>
        </>
      )}
      <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6 ">
        Latest Series
      </h1>
      <div className="relative mb-5">
        <button
          onClick={() => scroll("left", seriesRef)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
        >
          <IoIosArrowBack />
        </button>

        <div
          ref={seriesRef}
          onScroll={handleSeriesScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {series.map((movie, index) => (
            <div key={movie._id} onClick={() => dispatch(selectMovie(movie))}>
              <MovieCard
                url={`/series/${movie._id}/more`}
                title={movie.title}
                description={movie.description}
                id={movie._id}
                image={movie.posterImage}
                key={index}
                series={true}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right", seriesRef)}
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
          onClick={() => scroll("left", moviesRef)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
        >
          <IoIosArrowBack />
        </button>

        <div
          ref={moviesRef}
          onScroll={handleMoviesScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {movies.map((movie, index) => (
            <div key={movie._id} onClick={() => dispatch(selectMovie(movie))}>
              <MovieCard
                url={`/movie/${movie._id}/more`}
                title={movie.title}
                description={movie.description}
                id={movie._id}
                image={movie.thumbnailUrl}
                key={index}
                series={false}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right", moviesRef)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent to-black text-white p-3 shadow-md z-10 h-full"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};
