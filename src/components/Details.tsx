import React, { useEffect, useState } from "react";
import HistoryCard from "./movie/HistoryCard";
import { useParams } from "react-router-dom";
import { getSeriesDetails_API } from "../api/content";
import { ISeries, ISeriesDetailsResponse } from "../model/types/series.types";
import HistoryCardSkeleton from "./movie/HistoryCardSkelition";
import { RootState } from "../store";
import { useSelector } from "react-redux";
interface DetailsProps {
  series: boolean;
}
const Details = ({ series }: DetailsProps) => {
  const { id } = useParams();
  const [seriesDetails, setSeriesDetails] = useState<ISeriesDetailsResponse>();
  const [loading, setLoading] = useState(false);
  
  const { selectedProfile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getSeriesDetails_API(id,selectedProfile._id);
        if (res.success) {
          setSeriesDetails(res.data);
        }
      } catch (error) {
        console.error("Error fetching series details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (series) fetchSeriesDetails();
  }, [id]);

  return (
    <div className="ml-4">
      {loading ? (
        <div className="flex my-10 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex w-fit gap-2">
              <HistoryCardSkeleton key={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="my-10">
          {seriesDetails?.seasons.map((season) => (
            <>
              <h2 className="text-xl font-semibold mb-1">
                {season.episodes.length > 0 && (
                  <>Season {season.seasonNumber}</>
                )}
              </h2>
              <div className="flex w-fit gap-2 mb-4">
                {season.episodes.map((episode) => (
                  <HistoryCard
                    key={episode._id}
                    // uniqueId={episode.}
                    uniqueKey={episode.key}
                    title={episode.title}
                    transcoding={episode.transcoding}
                    description="somthing desc"
                    image={episode.thumbnailUrl}
                    id={episode._id}
                    seriesWatch={true}
                    seasonId={season._id}
                    track={episode.progress}
                    history={true}
                  />
                ))}
              </div>
            </>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold">Movie Details</h2>
      <p className="mt-2 text-gray-600">
        This section contains detailed information about the movie, such as its
        plot, cast, and production details.
      </p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Producer</h3>
        <p className="text-gray-600">John Doe</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Cast</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Jane Smith as Lead Role</li>
          <li>Mike Johnson as Supporting Role</li>
          <li>Emily Davis as Supporting Role</li>
          <li>Chris Brown as Villain</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Director</h3>
        <p className="text-gray-600">Alice Williams</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Release Date</h3>
        <p className="text-gray-600">January 25, 2025</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Genre</h3>
        <p className="text-gray-600">Action, Adventure, Drama</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Duration</h3>
        <p className="text-gray-600">120 minutes</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Rating</h3>
        <p className="text-gray-600">8.5/10</p>
      </div>
    </div>
  );
};

export default Details;
