import React, { useEffect, useState } from "react";
import { UserPlayer } from "../common/UserPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MetaData } from "../../model/types/movie.types";
import { RecommendedMovie_API } from "../../api/content";
import { CiFacebook } from "react-icons/ci";
import { CiTwitter } from "react-icons/ci";
import { CiLink } from "react-icons/ci";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TwitterShareButton,
} from "react-share";
const WatchingPage = () => {
  const shareUrl = import.meta.env.VITE_CLIENT_URL;
  const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const { user } = useSelector((state: RootState) => state.user);
  const [similar, setSimilar] = useState<MetaData[]>([]);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const fetchRecommendation = async () => {
    try {
      if (!user?.defaultProfile) return;
      const response = await RecommendedMovie_API(user?.defaultProfile);
      if (response.success) {
        setSimilar(response.data);
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const handleShare = async (platform: "facebook" | "twitter" | "copy") => {

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShowShareTooltip(true);
          setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
        break;
    }
  };

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
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">{selectedMovie?.title}</h1>
                  <p className="text-gray-400 mt-2">
                    {selectedMovie?.description}
                  </p>
                </div>
                {/* Share Options */}
                <div className="relative">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                      <FacebookShareButton url={shareUrl}>
                        <CiFacebook />
                      </FacebookShareButton>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                      <TwitterShareButton url={shareUrl}>
                        <CiTwitter />
                      </TwitterShareButton>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <CiLink />
                    </button>
                  </div>
                  {showShareTooltip && (
                    <div className="absolute top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded text-sm">
                      Link copied!
                    </div>
                  )}
                </div>
              </div>
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
