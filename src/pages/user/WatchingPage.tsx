import React from "react";
import { UserPlayer } from "../common/UserPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const WatchingPage = () => {
    const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const similarVideos = [
    { id: 1, title: "Similar Movie 1", thumbnail: "/api/placeholder/280/157" },
    { id: 2, title: "Similar Movie 2", thumbnail: "/api/placeholder/280/157" },
    { id: 3, title: "Similar Movie 3", thumbnail: "/api/placeholder/280/157" },
    { id: 4, title: "Similar Movie 4", thumbnail: "/api/placeholder/280/157" },
    { id: 5, title: "Similar Movie 5", thumbnail: "/api/placeholder/280/157" },
    { id: 6, title: "Similar Movie 6", thumbnail: "/api/placeholder/280/157" },
  ];

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
              {similarVideos.map((video) => (
                <div 
                  key={video.id}
                  className="flex gap-3 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{video.title}</h3>
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