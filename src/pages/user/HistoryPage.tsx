import React, { useEffect, useState } from "react";
import HistoryCard from "../../components/movie/HistoryCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import HistoryGraph from "../../components/HistoryGraph";
import { GETUserWatchHistory_API } from "../../api/content";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import HistoryCardSkeleton from "../../components/movie/HistoryCardSkelition";

interface VideoCatalog {
  _id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
}

interface WatchHistory {
  profileId: string;
  videoCatalog: VideoCatalog;
  progress: number;
  completed: boolean;
}

const HistoryPage = () => {
  const { selectedProfile } = useSelector((state: RootState) => state.user);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await GETUserWatchHistory_API(selectedProfile._id);
        if (res.success) {
          setWatchHistory(res.data);
        }
      } catch (error) {
        console.error("Error fetching user plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);
  return (
    <div className="ml-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Continue</h2>
        <IoIosArrowBack className="cursor-pointer" />
        <IoIosArrowForward className="cursor-pointer" />

        <div className="flex items-center gap-2 ml-10 cursor-pointer text-sm ">
          <span>See more</span>
          <IoIosArrowForward />
        </div>
      </div>

      <div className="flex w-fit gap-5 overflow-x-scroll scrollbar-hidden p-5 justify-start">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <HistoryCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {watchHistory.length === 0 && "Empty History"}
            {watchHistory.map((history) => {
              if (history.videoCatalog._id)
                return (
                  <HistoryCard
                    description="desc"
                    id={history.videoCatalog._id}
                    image={history.videoCatalog.thumbnailUrl}
                    title={history.videoCatalog.title}
                    track={history.progress}
                    history={true}
                  />
                );
            })}
          </>
        )}
      </div>

      <HistoryGraph />
    </div>
  );
};

export default HistoryPage;
