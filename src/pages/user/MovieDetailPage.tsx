import { NavLink, Outlet, useParams } from "react-router-dom";
import Carousel from "../../components/Carousel";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect } from "react";
import { selectMovie } from "../../reducers/movieReducer";
import {
  fetchMovieMetadata_API,
  getSeriesDetails_API,
} from "../../api/content";
interface MovieDetailProps {
  series: boolean;
}
const MovieDetailPage = ({ series }: MovieDetailProps) => {
  const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();

  async function fetchMovieMetadata() {
    if (id) {
      const res = await fetchMovieMetadata_API(id);
      if (res.success) {
        dispatch(selectMovie(res.data));
      }
    }
  }
  async function fetchSeriesMetadata() {
    if (id) {
      const res = await getSeriesDetails_API(id);
      if (res.success) {
        dispatch(selectMovie(res.data));
      }
    }
  }
  useEffect(() => {
    if (series) {
      fetchSeriesMetadata();
    } else {
      fetchMovieMetadata();
    }
  }, [id]);

  if (!selectedMovie) {
    return (
      <div className="w-full  flex items-center ml-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="">
      {/* Carousel Section */}

      <>{selectedMovie && <Carousel series={series} selectedMovie={selectedMovie} />}</>

      {/* Tab Navigation */}
      <div className="mt-6 mx-14">
        <nav className="flex space-x-4 text-xl font-medium">
          <NavLink
            to="more"
            className={({ isActive }) =>
              isActive
                ? "text-secondary  underline  font-semibold border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-600"
            }
          >
            Details
          </NavLink>
          <NavLink
            to="related"
            className={({ isActive }) =>
              isActive
                ? "text-secondary underline font-semibold border-b-2 border-primary"
                : "text-gray-500  hover:text-gray-600"
            }
          >
            Related
          </NavLink>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 ml-16">
        <Outlet />
      </div>
    </div>
  );
};

export default MovieDetailPage;
