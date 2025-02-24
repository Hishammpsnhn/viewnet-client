import { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import videojs from "video.js";
import { useLocation, useSearchParams } from "react-router-dom";
import { selectMovie } from "../../reducers/movieReducer";
import {
  fetchMovieCatalog_API,
  fetchMovieMetadata_API,
  getEpisodeCatalogDetails_API,
  getEpisodeDetails_API,
  WatchHistoryUpdate_API,
} from "../../api/content";
import { MovieCatalogData } from "../../model/types/movie.types";
import { EpisodeCatalog } from "../../model/types/series.types";
import { useSocket } from "../../providers/socketProvider";

// Types
interface PlayerState {
  currentProgress: number;
  isPlaying: boolean;
  videoDuration: number;
  catalogs: MovieCatalogData | null;
  episodeCatalog: EpisodeCatalog | null;
}
export const UserPlayer = () => {
  const { selectedMovie } = useSelector((state: RootState) => state.movies);
  const dataSaver = true;
  const [searchParams] = useSearchParams();
  const { selectedProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const partyId = searchParams.get("partyId");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const series = queryParams.get("series");
  const id = queryParams.get("v");
  const seasonId = queryParams.get("season");

  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentProgress: 0,
    isPlaying: false,
    videoDuration: 0,
    catalogs: null,
    episodeCatalog: null,
  });

  let lastUpdateTime = Date.now();
  const sendWatchTime = () => {
    if (!socket) return;

    const timeSpent = (Date.now() - lastUpdateTime) / 1000;

    lastUpdateTime = Date.now();

    socket.emit("update_watch_time", {
      profileId: selectedProfile._id,
      watchTime: timeSpent,
    });
  };
  let duration = 0;

  // Video Player Setup
  const setupVideoPlayer = (autoRes: string, lowRes: string) => {
    if (!videoRef.current || playerRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add(
      "video-js",
      "vjs-default-skin",
      "vjs-big-play-centered"
    );
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: true,
      autoplay: false,
      responsive: true,
      fluid: true,
      poster: selectedMovie?.thumbnailUrl || "",
      sources: [{ src: dataSaver ? lowRes : autoRes }],
    });

    // Player Event Handlers
    setupPlayerEvents(player);
    playerRef.current = player;
  };

  // Player Event Setup
  const setupPlayerEvents = (player: any) => {
    let lastApiCallTime = 0;

    player.on("play", () => {
      setState((prev) => ({ ...prev, isPlaying: true }));
      if (socket && partyId) {
        socket.emit("sync-action", {
          partyId,
          videoState: "play",
          time: player.currentTime(),
        });
      }
      sendWatchTime();
    });
    player.on("pause", () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      if (socket && partyId) {
        socket.emit("sync-action", {
          partyId,
          videoState: "pause",
          time: player.currentTime(),
        });
      }
      sendWatchTime();
    });
    player.on("seek", () => {
      const time = player.currentTime();
      //const progress = (time / duration) * 100;
      //setState((prev) => ({...prev, currentProgress: progress }));
      if (socket && partyId) {
        socket.emit("sync-action", { partyId, videoState: "pause", time });
      }
    });

    player.on("ended", async () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      sendWatchTime();
      if (selectedMovie && selectedProfile) {
        await WatchHistoryUpdate_API(
          selectedProfile._id,
          series && id ? id : selectedMovie._id,
          100
        );
      }
    });

    player.on("loadedmetadata", () => {
      const durationMain = player.duration();
      duration = durationMain;
      setState((prev) => ({ ...prev, videoDuration: duration }));

      if (!state.currentProgress) return;
      // Overlay for center point indication
      const centerIndicator = document.createElement("div");
      centerIndicator.className =
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/50 text-black px-4 py-2 rounded";

      // Set current time and play
      if ((state.currentProgress * duration) / 100 === duration) {
        player.currentTime(0);
        centerIndicator.textContent = `Replaying..`;
      } else {
        centerIndicator.textContent = `Resuming..`;

        // Add center point indicator temporarily
        videoRef.current?.appendChild(centerIndicator);
        player.currentTime((state.currentProgress * duration) / 100 || 0);
      }
      player.play();

      setTimeout(() => {
        centerIndicator.remove();
      }, 3000);
    });

    //playFromPercent(player, 50);
    player.on("timeupdate", async () => {
      const currentTime = player.currentTime();
      setState((prev) => ({ ...prev, currentProgress: currentTime }));

      // Update progress every 10 seconds
      if (
        Math.floor(currentTime) % 10 === 0 &&
        Math.floor(currentTime) !== lastApiCallTime
      ) {
        if (selectedMovie && selectedProfile && duration) {
          const progress = (Math.floor(currentTime) / duration) * 100;
          await WatchHistoryUpdate_API(
            selectedProfile._id,
            series && id ? id : selectedMovie._id,
            progress
          );
          lastApiCallTime = Math.floor(currentTime);
        }
      }
    });
  };

  useEffect(() => {
    socket?.on("sync-action", (state) => {
      if (state.action === "play") {
        playerRef.current?.play();
        playerRef.current?.currentTime(state.time);
      } else if (state.action === "pause") {
        playerRef.current?.pause();
        playerRef.current?.currentTime(state.time);
      } else if (state.action === "seek") {
        playerRef.current?.currentTime(state.time);
      }
    });
  }, [socket]);

  // Load Video Sources
  useEffect(() => {
    if (state.catalogs) {
      const autoRes = state.catalogs.encodedFiles.find(
        (item) => item.resolution === "auto"
      );
      const lowRes = state.catalogs.encodedFiles.find(
        (item) => item.resolution === "360p"
      );

      if (autoRes && lowRes) {
        setupVideoPlayer(autoRes.fileUrl, lowRes.fileUrl);
      }
    }

    if (state.episodeCatalog) {
      const autoRes = state.episodeCatalog.resolutions.find(
        (item) => item.resolution === "auto"
      );
      const lowRes = state.episodeCatalog.resolutions.find(
        (item) => item.resolution === "360p"
      );

      if (autoRes && lowRes) {
        setupVideoPlayer(autoRes.fileUrl, lowRes.fileUrl);
      }
    }
  }, [state.catalogs, state.episodeCatalog]);

  // Fetch Video Data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMovie?._id || !id) return;

      try {
        if (series) {
          const res = await getEpisodeCatalogDetails_API(
            id,
            selectedProfile._id
          );
          if (res.success) {
            setState((prev) => ({ ...prev, episodeCatalog: res.data }));
            if (res.data.progress) {
              setState((prev) => ({
                ...prev,
                currentProgress: res.data.progress.progress,
              }));
            }
          }
        } else {
          const res = await fetchMovieCatalog_API(id, selectedProfile._id);
          if (res?.success) {
            setState((prev) => ({
              ...prev,
              catalogs: res.data.catalog,
              currentProgress: res.data.watchHistory?.progress,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      }
    };

    fetchData();
  }, [selectedMovie, id, series]);

  // Fetch Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      if (selectedMovie !== null) return;

      try {
        if (series && seasonId) {
          const res = await getEpisodeDetails_API(seasonId);
          if (res.success && res.data) {
            dispatch(selectMovie(res.data));
          }
        } else if (id) {
          const res = await fetchMovieMetadata_API(id);
          if (res.success && res.data) {
            dispatch(selectMovie(res.data));
          }
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchMetadata();
  }, [selectedMovie, series, seasonId, id]);

  return (
    <div className="relative w-full h-full">
      <div ref={videoRef} className="video-container relative" />
    </div>
  );
};
