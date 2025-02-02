import React, { useEffect, useState } from "react";
import UploadCard from "../../components/admin/uploadCard/UplaodCard";
import NumberCard from "../../components/admin/NumberCard/NumberCard";
import HistoryCard from "../../components/movie/HistoryCard";
import { MetaData } from "../../model/types/movie.types";
import { getLatestMovies_API } from "../../api/movieUploadApi";
import HistoryCardSkeleton from "../../components/movie/HistoryCardSkelition";
import { ISeriesResponse } from "../../model/types/series.types";
import { getLatestSeries_API } from "../../api/content";
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
    navigate: "/",
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

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchLatestMovies() {
      setLoading(true);
      try {
        const response = await getLatestMovies_API();
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
        const response = await getLatestSeries_API();
        if (response.success) {
          setLatestSeries(response.series);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestMovies();
  }, []);

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
        <NumberCard />
        <NumberCard />
        <NumberCard />
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
