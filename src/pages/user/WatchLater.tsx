import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getWatchLaterMovies_API,
  getWatchLaterSeries_API,
  removeWatchLaterMovies_API,
  removeWatchLaterSeries_API,
} from "../../api/watchLaterApi";

// Types
interface BaseMedia {
  _id: number;
  title: string;
  thumbnailUrl: string;
  description: string;
}

interface Movie {
  type: "movie";
  director: string;
  videoCatalog: BaseMedia;
}

interface Series {
  type: "series";
  seasons: number;
  videoCatalog: BaseMedia;
}

type Media = Movie | Series;

interface MediaCardProps {
  item: Media;
  onRemove: (id: number) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onRemove }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg bg-gray-900">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.videoCatalog.thumbnailUrl}
          alt={item.videoCatalog.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-semibold text-white text-lg mb-1">
            {item.videoCatalog.title}
          </h2>
          <p className="text-sm text-gray-300 line-clamp-2 mb-2">
            {item.videoCatalog.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {item.type === "movie" ? "Movie" : `${item.seasons} Seasons`}
            </span>
            <button
              onClick={() => onRemove(item.videoCatalog._id)}
              className="text-white bg-red-600/80 hover:bg-red-600 p-2 rounded-full transition-colors"
              aria-label="Remove from watch later"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-200 ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {children}
  </button>
);

const WatchLater: React.FC = () => {
  const { selectedProfile } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (!selectedProfile) return;
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          getWatchLaterMovies_API(selectedProfile._id),
          getWatchLaterSeries_API(selectedProfile._id),
        ]);

        if (moviesRes?.success) setMovies(moviesRes.data);
        if (seriesRes?.success) setSeries(seriesRes.data);
      } catch (error) {
        console.error("Error fetching watch later content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedProfile?._id]);

  const removeMovie = async (id: number): Promise<void> => {
    console.log("id for deletion", id);
    const res = await removeWatchLaterMovies_API(
      selectedProfile._id,
      id.toString()
    );
    if (res.success) {
      setMovies(movies.filter((movie) => movie.videoCatalog._id !== id));
    }
  };

  const removeSeries = async (id: number): Promise<void> => {
    if (selectedProfile) {
      const res = await removeWatchLaterSeries_API(
        selectedProfile._id,
        id.toString()
      );
      if (res.success)
        setSeries(series.filter((show) => show.videoCatalog._id !== id));
    }
  };

  const activeItems = activeTab === "movies" ? movies : series;
  const removeItem = activeTab === "movies" ? removeMovie : removeSeries;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500 w-8 h-8"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="m12 17 5-5-5-5" />
          </svg>
          <h1 className="text-3xl font-bold">Watch Later</h1>
        </div>

        <div className="flex gap-3 mb-8 bg-gray-800/50 p-1 rounded-lg inline-block">
          <TabButton
            active={activeTab === "movies"}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </TabButton>
          <TabButton
            active={activeTab === "series"}
            onClick={() => setActiveTab("series")}
          >
            Series
          </TabButton>
        </div>

        {isLoading ? (
          <div className="grid place-items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : activeItems.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">
              No {activeTab} in your watch later list
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeItems.map((item) => (
              <MediaCard
                key={item.videoCatalog._id}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;
