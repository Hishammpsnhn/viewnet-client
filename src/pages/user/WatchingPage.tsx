import React, { useEffect, useState } from "react";
import { UserPlayer } from "../common/UserPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MetaData } from "../../model/types/movie.types";
import { RecommendedMovie_API } from "../../api/content";

const WatchingPage = () => {
  const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const { user } = useSelector((state: RootState) => state.user);
  const [similar, setSimilar] = useState<MetaData[]>([]);

  const fetchRecommandation = async () => {
    try {
      if (!user?.defaultProfile) return;
      const response = await RecommendedMovie_API(user?.defaultProfile);
      if (response.success) {
        setSimilar(response.data);
      }
    } catch (error: any) {}
  };
  useEffect(() => {
    fetchRecommandation();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main container with max width */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Player section */}
          <div className="lg:w-2/3">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <UserPlayer />
            </div>
            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-xl font-bold">{selectedMovie?.title}</h1>
              <p className="text-gray-400 mt-2">{selectedMovie?.description}</p>
            </div>
          </div>

          {/* Right side - Similar videos */}
          <div className="lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Similar Videos</h2>
            <div className="flex flex-col gap-4">
              {similar.map((video) => (
                <div
                  key={video._id}
                  className="flex gap-3 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-40 h-24 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{video.title}</h3>
                    <h3 className="font-semibold text-xs text-gray-400">
                      {video.description.length > 35
                        ? video.description.substring(0, 35) + "..."
                        : video.description}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchingPage;
