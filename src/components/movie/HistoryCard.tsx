import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { selectMovie } from "../../reducers/movieReducer";

interface HistoryCardProps {
  title: string;
  image: string;
  description: string;
  id: string;
  uniqueKey?: string;
  history?: boolean;
  transcoding?: "pending" | "completed" | "failed" | "processing";
  progress?: Record<string, number>;
  seriesManagement?: boolean;
  seriesWatch?: boolean;
  seasonId?: string;
  track?: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  title,
  image,
  description,
  history,
  id,
  transcoding,
  uniqueKey,
  progress,
  seriesWatch,
  seasonId,
  seriesManagement,
  track,
}) => {
  const navigate = useNavigate();
  const { user ,planDetails} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  if (progress && progress[id] && progress[id] >= 100) {
    delete progress[id];
  }
  let isUploadingOrTranscoding;
  if (user?.isAdmin && uniqueKey) {
    isUploadingOrTranscoding =
      (progress && progress[id]) || transcoding !== "completed";
    console.log(isUploadingOrTranscoding);
  }
  console.log(progress, transcoding, isUploadingOrTranscoding);

  const handleWatch = () => {
    if (seriesManagement) {
      navigate(`/series/${id}`);
      return;
    }
    if (!seriesWatch) {
      if (user?.isAdmin) {
        navigate(`/watch?v=${id}`, {
          state: { title, image },
        });
      } else {
        navigate(`/watch?v=${id}`);
      }
    } else if (user) {
      navigate(`/watch?series=true&season=${seasonId}&v=${id}`);
      dispatch(selectMovie(null));
    }
  };

  return (
    <div className={`relative min-w-52 border border-gray-500 mx-auto bg-primary shadow-md rounded-lg overflow-hidden ${!planDetails && !user?.isAdmin && 'opacity-60'}`}>
      {/* Overlay for Uploading and Transcoding */}
      {transcoding && isUploadingOrTranscoding && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-yellow-400 text-sm  ">
          {progress && progress[id] && <span>Uploading {progress[id]}%</span>}
          {transcoding !== "completed" && (
            <span>Transcoding is {transcoding}...</span>
          )}
        </div>
      )}

      <div className="flex items-center p-1 ">
        <img src={image} alt={title} className="w-12 h-12 object-cover" />
        <div className="ml-3 text-white">
          <h3 className="text-xs font-semibold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>

      {history && track ? (
        <div className="p-1">
          <div className="w-full h-1 bg-white rounded-full">
            <div
              className="h-full bg-secondary"
              style={{ width: `${track}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="p-1">
        <button
          className={`w-full py-1 bg-secondary text-black font-semibold rounded-lg transition duration-200 ${
            isUploadingOrTranscoding
              ? "opacity-60 cursor-not-allowed"
              : "opacity-90 hover:opacity-100"
          }`}
          onClick={handleWatch}
          disabled={isUploadingOrTranscoding ? true : false || !user?.isAdmin && !planDetails}
        >
          Watch
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
