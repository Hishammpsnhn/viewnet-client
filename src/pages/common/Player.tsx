import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { GetMetadata_API } from "../../api/movieUploadApi";
import { MetaData } from "../../model/types/movie.types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getEpisodeDetails_API } from "../../api/content";
import { IEpisode } from "../../model/types/series.types";

const Player: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const [searchParams] = useSearchParams();
  let dataSave = false;
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [episode, setEpisode] = useState<IEpisode | null>(null);
  const videoId = searchParams.get("v");
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  // Fetch metadata when videoId changes
  useEffect(() => {
    async function fetchById() {
      if (videoId && user?.isAdmin && videoId.length > 12) {
        const res = await GetMetadata_API(videoId);
        if (res.success) {
          setMetadata(res.data);
        } else {
          console.error("Failed to fetch video metadata:");
        }
      }
    }
    fetchById();
  }, [videoId]);

  useEffect(() => {
    async function fetchById() {
      if (videoId && user) {
        const res = await getEpisodeDetails_API(videoId);
        if (res.success) {
          setEpisode(res.series);
        } else {
          console.error("Failed to fetch video metadata:");
        }
      }
    }
    fetchById();
  }, [videoId]);

  // Initialize or update player when videoId or metadata changes
  useEffect(() => {
    if (episode) {
      console.log("dfjkdjfk123");
      if (!videoId || !videoRef.current) return;

      // Initialize player if it doesn't exist
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add(
          "video-js",
          "vjs-default-skin",
          "vjs-big-play-centered"
        );

        videoRef.current.appendChild(videoElement);

        playerRef.current = videojs(videoElement, {
          controls: true,
          autoplay: false,
          responsive: true,
          fluid: true,
          poster: episode?.thumbnailUrl || "", // Set initial poster
          sources: [
            {
              src: dataSave
                ? `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${episode?.key}/360p/index.m3u8`
                : `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${episode?.key}/master.m3u8`,
            },
          ],
          // sources: [
          //   {
          //     src: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/1080p/index.m3u8`,
          //     type: "application/x-mpegURL",
          //   },
          // ],
        });
        //s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/master.m3u8
        https: playerRef.current.on("ready", () => {
          videojs.log("Player is ready");
        });
      } else {
        // Update existing player if options change
        playerRef.current.src([
          {
            src: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/avathar3/master.m3u8`,
            type: "application/x-mpegURL",
          },
        ]);
      }
    } else {
      if (!videoId || !videoRef.current || !metadata) return;

      // Initialize player if it doesn't exist
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add(
          "video-js",
          "vjs-default-skin",
          "vjs-big-play-centered"
        );

        videoRef.current.appendChild(videoElement);

        playerRef.current = videojs(videoElement, {
          controls: true,
          autoplay: false,
          responsive: true,
          fluid: true,
          poster: metadata?.thumbnailUrl || "", // Set initial poster
          sources: [
            {
              src: dataSave
                ? `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/360p/index.m3u8`
                : `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/master.m3u8`,
            },
          ],
          // sources: [
          //   {
          //     src: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/1080p/index.m3u8`,
          //     type: "application/x-mpegURL",
          //   },
          // ],
        });
        //s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${metadata?._id}/master.m3u8
        https: playerRef.current.on("ready", () => {
          videojs.log("Player is ready");
        });
      } else {
        // Update existing player if options change
        playerRef.current.src([
          {
            src: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/avathar3/master.m3u8`,
            type: "application/x-mpegURL",
          },
        ]);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [metadata, episode]);

  // Update poster when metadata changes
  useEffect(() => {
    if (playerRef.current && metadata?.thumbnailUrl) {
      playerRef.current.poster(metadata.thumbnailUrl);
    }
  }, [metadata]);

  if (!videoId) {
    return <p className="text-white">No video found.</p>;
  }

  return (
    <div className="w-full mx-auto">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

export default Player;
