import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { QRScanner_API } from "../../api/qrLogin";
import MovieCard from "../../components/card/MovieCard";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import VideoBanner from "../../components/VideoBanner";
import {
  getLatestMovies_API,
  getLatestSeries_API,
  RecommendedMovie_API,
} from "../../api/content";
import { MetaData } from "../../model/types/movie.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchMoviesFailure,
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchRecommended,
  fetchSeriesFailure,
  fetchSeriesStart,
  fetchSeriesSuccess,
  selectMovie,
} from "../../reducers/movieReducer";
import { ActiveStreamList_API, GetAssets_API } from "../../api/LiveStreamApi";
import {
  MuxAssetsResponse,
  MuxStreamResponse,
} from "../../model/types/live.types";

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

      <ToastContainer theme="dark" />
    </div>
  );
};

const ScrollableSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const moviesRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Pagination state
  const [moviePage, setMoviePage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);
  const [assetsPage, setAssetsPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreSeries, setHasMoreSeries] = useState(true);
  const [hasMoreAssets, setHasMoreAssets] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<MetaData[]>([]);
  const [liveEvents, setLiveEvents] = useState<MuxStreamResponse[]>([]);
  const [assets, setAssets] = useState<MuxAssetsResponse[]>([]);

  const { movies, series, recommended } = useSelector(
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
  const handleAssetsScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const scrollThreshold = scrollWidth - clientWidth - 100;

    if (scrollLeft > scrollThreshold && !isLoadingMore && hasMoreAssets) {
      setIsLoadingMore(true);
      const res = await GetAssets_API(assetsPage);
      if (res.success) setAssets([...assets, ...res.data]);
      setAssetsPage((prev) => prev + 1);
      setHasMoreAssets(true);
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
        console.log("Fetched series");
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

  useEffect(() => {
    const initializeData = async () => {
      if (movies.length === 0) await fetchMovies(1);
      if (series.length === 0) await fetchSeries(1);

      if (user && user?.defaultProfile) {
        const [recommendedRes, liveRes, assetsRes] = await Promise.all([
          RecommendedMovie_API(user.defaultProfile),
          ActiveStreamList_API(),
          GetAssets_API(assetsPage),
        ]);

        if (recommendedRes.success) {
          setRecommendedMovies(recommendedRes.data);
          dispatch(fetchRecommended(recommendedRes.data));
        }
        if (liveRes.success) setLiveEvents(liveRes.data);
        if (assetsRes.success) setAssets(assetsRes.data);
      }
    };

    initializeData();
  }, [user?.defaultProfile]);

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
              className="flex gap-4 overflow-x-auto scrollbar-hidden scroll-smooth pb-4"
            >
              {recommended.map((movie, index) => (
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
      {series.length && (
        <>
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
              className="flex gap-4 overflow-x-auto scrollbar-hidden scroll-smooth pb-4"
            >
              {series.map((movie, index) => (
                <div
                  key={movie._id}
                  onClick={() => dispatch(selectMovie(movie))}
                >
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
        </>
      )}
      {movies.length && (
        <>
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
              className="flex gap-4 overflow-x-auto scrollbar-hidden scroll-smooth pb-4"
            >
              {movies.map((movie, index) => (
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

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right", moviesRef)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent to-black text-white p-3 shadow-md z-10 h-full"
            >
              <IoIosArrowForward />
            </button>
          </div>
        </>
      )}
      {liveEvents.length ? (
        <>
          <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6">Live</h1>
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
              className="flex gap-4 overflow-x-auto scrollbar-hidden scroll-smooth pb-4"
            >
              {liveEvents.map((live, index) => (
                <div
                  key={live.stream.id}
                  onClick={() =>
                    navigate(
                      `/live?streamId=${live?.stream.id}&v=${live?.stream.playback_ids[0]?.id}`
                    )
                  }
                >
                  <MovieCard
                    url={`/movie/${live.stream.id}/more`}
                    title={live.metadata.title}
                    description={"movie.description"}
                    id={live.stream.id}
                    image={`https://image.mux.com/${live.stream.playback_ids[0].id}/thumbnail.png?width=214&height=121&time=0`}
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
        </>
      ) : (
        <></>
      )}
      {assets.length > 0 ? (
        <>
          <h1 className="text-lg font-bold pb-2 md:text-2xl md:pb-6">
            Recorded Live
          </h1>
          <div className="relative">
            <button
              // onClick={() => scroll("left", moviesRef)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-transparent to-black text-white p-3 shadow-md z-10 h-full "
            >
              <IoIosArrowBack />
            </button>

            <div
              className="flex gap-4 overflow-x-auto scrollbar-hidden scroll-smooth pb-4"
              ref={assetsRef}
              onScroll={handleAssetsScroll}
            >
              {assets.map((live, index) => (
                <div
                  key={live.id}
                  // onClick={() =>
                  //   navigate(
                  //     `/live?streamId=${live?.id}&v=${live?.playback_ids[0]?.id}`
                  //   )
                  // }
                >
                  <MovieCard
                    url={`/assets/${live.assetsId}`}
                    title={live.title}
                    description={"movie.description"}
                    id={live.id}
                    image={live.thumbnailUrl}
                    //image={`https://image.mux.com/${live.playback_ids[0].id}/thumbnail.png?width=214&height=121&time=0`}
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
        </>
      ) : (
        <></>
      )}
      {/* <NotificationComponent/> */}
    </div>
  );
};
