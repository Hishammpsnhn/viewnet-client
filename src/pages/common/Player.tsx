import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { MovieCatalogData } from "../../model/types/movie.types";

import { fetchMovieCatalog_API } from "../../api/content";
import { EpisodeCatalog } from "../../model/types/series.types";
import { useLocation } from "react-router-dom";
import { getEpisodeCatalog_API } from "../../api/seriesApi";

const Player: React.FC = () => {
  const location = useLocation();

  let dataSave = false;
  const [catalogs, setCatalogs] = useState<MovieCatalogData | null>(null);
  const [episodeCatalog, setEpisodeCatalog] = useState<EpisodeCatalog | null>(
    null
  );
  const { image } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("v");
  const series = queryParams.get("series");
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    async function fetchMovieCatalog() {
      if (id && !series) {
        const res = await fetchMovieCatalog_API(id);
        if (res && res.success) {
          setCatalogs(res.data.catalog);
        }
      }
    }
    async function fetchById() {
      if (id) {
        const res = await getEpisodeCatalog_API(id);
        if (res.success) {
          setEpisodeCatalog(res.episode);
        } else {
          console.error("Failed to fetch video metadata:");
        }
      }
    }
    if (!series) {
      fetchMovieCatalog();
    } else {
      fetchById();
    }
  }, [series]);
  useEffect(() => {
    if (catalogs) {
      const autoResolution = catalogs?.encodedFiles?.find(
        (item) => item.resolution === "auto"
      );
      const lowResolution = catalogs?.encodedFiles.find(
        (item) => item.resolution === "360p"
      );
      if (autoResolution && lowResolution)
        playerSetup(autoResolution?.fileUrl, lowResolution.fileUrl);
    }
    if (episodeCatalog) {
      const autoResolution = episodeCatalog?.resolutions.find(
        (item) => item.resolution === "auto"
      );
      const lowResolution = episodeCatalog?.resolutions.find(
        (item) => item.resolution === "360p"
      );
      if (autoResolution && lowResolution)
        playerSetup(autoResolution?.fileUrl, lowResolution.fileUrl);
    }
  }, [catalogs, episodeCatalog]);

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
        poster: image || "",
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

  return (
    <div className="w-full mx-auto">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

export default Player;
