import React, { useEffect, useState } from "react";
import HistoryCard from "./movie/HistoryCard";
import { useParams } from "react-router-dom";
import { getSeriesDetails_API } from "../api/content";
import { ISeries, ISeriesDetailsResponse } from "../model/types/series.types";
interface DetailsProps {
  series: boolean;
}
const Details = ({ series }: DetailsProps) => {
  const { id } = useParams();
  const [seriesDetails, setSeriesDetails] = useState<ISeriesDetailsResponse>();

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      if (!id) return;

      try {
        const res = await getSeriesDetails_API(id);
        if (res.success) {
          setSeriesDetails(res.series);
        }
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };
    if (series) fetchSeriesDetails();
  }, []);
  console.log(id);
  console.log(setSeriesDetails);
  return (
    <div className="ml-4">
      {seriesDetails?.seasons.map((season) => (
        <>
          <h2 className="text-xl font-semibold">
            Season {season.seasonNumber}
          </h2>
          <div className="flex w-fit gap-2">
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
              />
            ))}
            {/* <HistoryCard />
            <HistoryCard />
            <HistoryCard />
            <HistoryCard />
            <HistoryCard />
            <HistoryCard />
            <HistoryCard />
            <HistoryCard /> */}
          </div>
        </>
      ))}

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
