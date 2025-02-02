import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import {
  fetchMovieCatalog_API,
  getEpisodeDetails_API,
} from "../../api/content";
import videojs from "video.js";
import { MovieCatalogData } from "../../model/types/movie.types";

interface PlayerProps {
  series: boolean;
}

export const UserPlayer = ({ series }: PlayerProps) => {
  const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [catalogs, setCatalogs] = useState<MovieCatalogData | null>(null);
  const dataSave = true;

  const playerSetup = (autoRes: string, lowRes: string) => {
    if (!videoRef.current) return;

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
        poster: selectedMovie?.thumbnailUrl || "",
        sources: [
          {
            src: dataSave ? lowRes : autoRes,
          },
        ],
      });
      playerRef.current.on("ready", () => {
        videojs.log("Player is ready");
      });
    }
  };
  useEffect(() => {
    if (catalogs) {
      console.log(catalogs);
      const autoResolution = catalogs?.encodedFiles.find(
        (item) => item.resolution === "auto"
      );
      const lowResolution = catalogs?.encodedFiles.find(
        (item) => item.resolution === "360p"
      );
      console.log(autoResolution);
      if (autoResolution && lowResolution)
        playerSetup(autoResolution?.fileUrl, lowResolution.fileUrl);
    }
  }, [catalogs]);

  useEffect(() => {
    async function fetchById() {
      if (selectedMovie?._id) {
        const res = await getEpisodeDetails_API(selectedMovie._id);
        if (res.success) {
        } else {
          console.error("Failed to fetch video metadata:");
        }
      }
    }
    async function fetchMovieCatalog() {
      if (selectedMovie) {
        const res = await fetchMovieCatalog_API(selectedMovie?._id);
        if (res && res.success) {
          setCatalogs(res.data);
        }
      }
    }
    if (series) {
      fetchById();
    } else {
      fetchMovieCatalog();
    }
  }, [selectedMovie]);

  if (!selectedMovie) {
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
