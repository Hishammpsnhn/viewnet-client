import { useEffect, useState } from "react";
import HistoryCard from "../../components/movie/HistoryCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import HistoryGraph from "../../components/HistoryGraph";
import {
  ClearUserWatchHistory_API,
  GETUserWatchHistory_API,
} from "../../api/content";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import HistoryCardSkeleton from "../../components/movie/HistoryCardSkelition";
import ConfirmDialog from "../../components/ConfirmDialog";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

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

  const handleClearHistory = async () => {
    setLoading(true);
    try {
      const res = await ClearUserWatchHistory_API(selectedProfile._id);
      if (res.success) {
        setWatchHistory([]);
      }
    } catch (error) {
      console.error("Error clearing watch history:", error);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="ml-10">
      <div className="flex items-center justify-between pr-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Continue</h2>
          <IoIosArrowBack className="cursor-pointer" />
          <IoIosArrowForward className="cursor-pointer" />

          <div className="flex items-center gap-2 ml-10 cursor-pointer text-sm ">
            <span>See more</span>
            <IoIosArrowForward />
          </div>
        </div>

        <button
          onClick={() => setShowConfirmDialog(true)}
          className="px-3 py-1  text-sm text-white  border border-red-800 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={loading || watchHistory.length === 0}
        >
          Clear History
        </button>
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
                    key={history.videoCatalog._id}
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

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClearHistory}
        message="Are you sure you want to clear your watch history?"
      />
    </div>
  );
};

export default HistoryPage;
