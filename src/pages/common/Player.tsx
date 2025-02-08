import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { GetMetadata_API } from "../../api/movieUploadApi";
import { MetaData, MovieCatalogData } from "../../model/types/movie.types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  fetchMovieCatalog_API,
  getEpisodeDetails_API,
} from "../../api/content";
import { EpisodeCatalog, IEpisode } from "../../model/types/series.types";
import { useLocation } from "react-router-dom";
import { getEpisodeCatalog_API } from "../../api/seriesApi";

const Player: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const location = useLocation();

  let dataSave = false;
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [episode, setEpisode] = useState<IEpisode | null>(null);
  const [catalogs, setCatalogs] = useState<MovieCatalogData | null>(null);
  const [episodeCatalog, setEpisodeCatalog] = useState<EpisodeCatalog | null>(
    null
  );
  const { title, image } = location.state || {};

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
      console.log(catalogs);
      const autoResolution = catalogs?.encodedFiles?.find(
        (item) => item.resolution === "auto"
      );
      const lowResolution = catalogs?.encodedFiles.find(
        (item) => item.resolution === "360p"
      );
      console.log(autoResolution);
      if (autoResolution && lowResolution)
        playerSetup(autoResolution?.fileUrl, lowResolution.fileUrl);
    }
    if (episodeCatalog) {
      console.log("finding res")
      const autoResolution = episodeCatalog?.resolutions.find(
        (item) => item.resolution === "auto"
      );
      const lowResolution = episodeCatalog?.resolutions.find(
        (item) => item.resolution === "360p"
      );
      console.log(autoResolution);
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

  // useEffect(() => {}, [metadata, episode]);

  // Update poster when metadata changes
  // useEffect(() => {
  //   if (playerRef.current && metadata?.thumbnailUrl) {
  //     playerRef.current.poster(metadata.thumbnailUrl);
  //   }
  // }, [metadata]);

  // if (!videoId) {
  //   return <p className="text-white">No video found.</p>;
  // }

  return (
    <div className="w-full mx-auto">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

export default Player;
