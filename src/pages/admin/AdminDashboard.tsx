import { useEffect, useState } from "react";
import UploadCard from "../../components/admin/uploadCard/UplaodCard";
import NumberCard from "../../components/admin/NumberCard/NumberCard";
import HistoryCard from "../../components/movie/HistoryCard";
import { MetaData } from "../../model/types/movie.types";
import { GetAllMetadata_API } from "../../api/movieUploadApi";
import HistoryCardSkeleton from "../../components/movie/HistoryCardSkelition";
import { ISeriesResponse } from "../../model/types/series.types";
import { GetAllSeries_API } from "../../api/seriesApi";
import { useSocket } from "../../providers/socketProvider";
import PieGraph from "../../components/PieGraph";
import HeatMap from "../../components/HeatMap";

const task: Task[] = [
  {
    title: "Upload And Publish a Movie",
    desc: "Upload Movie",
    navigate: "/upload/movie",
  },
  {
    title: "Upload And Publish Series",
    desc: "Upload Series",
    navigate: "/upload/series",
  },
  {
    title: "Start Live Streaming",
    desc: "Go To Live",
    navigate: "/dashboard/live",
  },
];
interface Task {
  title: string;
  desc: string;
  navigate: string;
}

const AdminDashboard = () => {
  const [LatestMovies, setLatestMovies] = useState<MetaData[]>([]);
  const [LatestSeries, setLatestSeries] = useState<ISeriesResponse[]>([]);
  const [userCount, setUserCount] = useState(0);

  const { socket } = useSocket();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchLatestMovies() {
      setLoading(true);
      try {
        const response = await GetAllMetadata_API();
        if (response.success) {
          setLatestMovies(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestMovies();
  }, []);

  useEffect(() => {
    async function fetchLatestMovies() {
      setLoading(true);
      try {
        const response = await GetAllSeries_API();
        if (response.success) {
          setLatestSeries(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestMovies();
  }, []);

  useEffect(() => {
    socket?.on("activeUsers", (size) => {
      setUserCount(size);
    });
  }, [socket]);

  return (
    <div className=" container mx-auto px-16 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {task.map((item) => (
          <UploadCard
            key={item.title}
            title={item.title}
            desc={item.desc}
            navigation={item.navigate}
          />
        ))}
      </div>
      {/* Number Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <NumberCard userCount={userCount} />
        <NumberCard userCount={0} />
        <NumberCard userCount={0} />
      </div>

      <div className="flex gap-2">
        <PieGraph />
        <HeatMap />
      </div>

      {/* History Cards Section */}
      <h1 className="text-white text-3xl font-bold mb-5">Movies </h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {loading ? (
          [...Array(5)].map((_, index) => <HistoryCardSkeleton key={index} />)
        ) : (
          <>
            {LatestMovies.map((movie) => (
              <HistoryCard
                key={movie._id}
                description="abc"
                image={movie.thumbnailUrl}
                title={movie.title}
                id={movie._id}
                transcoding={movie.transcoding.status}
                uniqueKey="gf"
              />
            ))}
          </>
        )}
      </div>
      <h1 className="text-white text-3xl font-bold  mb-5 mt-10">series </h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {loading ? (
          [...Array(5)].map((_, index) => <HistoryCardSkeleton key={index} />)
        ) : (
          <>
            {LatestSeries.map((movie) => (
              <HistoryCard
                key={movie._id}
                description="abc"
                image={movie.posterImage}
                title={movie.title}
                id={movie._id}
                seriesManagement={true}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
