import React, { useState, useEffect } from "react";
import {
  StopStreaming_API,
  StreamList_API,
  StreamLiveDetails_API,
  StreamLiveStart_API,
} from "../../api/LiveStreamApi";
import { useNavigate } from "react-router-dom";
import BGLive from "../../assets/images/661bef1a0db9efe639a0483d_tnb-icon-video.webp";
import LoadingSpinner from "../../components/LoadingSpinner";
import LiveDetailForm from "../../components/LiveDetailsForm";
import { LiveDetailModel } from "../../model/types/live.types";

// Existing icon interfaces and components...

// Interface for Mux API response
interface MuxStreamResponse {
  stream: {
    test: boolean;
    stream_key: string;
    status: string;
    srt_passphrase: string;
    recording: boolean;
    reconnect_window: number;
    playback_ids: Array<{
      policy: string;
      id: string;
    }>;
    new_asset_settings: {
      playback_policies: string[];
    };
    max_continuous_duration: number;
    latency_mode: string;
    id: string;
    created_at: string;
    connected: boolean;
    active_ingest_protocol: string;
    active_asset_id: string;
  };
  metadata: {
    _id: string;
    isPrivate: boolean;
    thumbnailUrl: string;
    streamId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Extended StreamState interface
interface StreamState {
  isLive: boolean;
  isMicOn: boolean;
  isVideoOn: boolean;
  viewerCount: number;
  duration: number;
  muxStreamDetails?: MuxStreamResponse;
}

const LivePage: React.FC = () => {
  const navigate = useNavigate();

  // State with Mux stream details
  const [streamState, setStreamState] = useState<StreamState>({
    isLive: false,
    isMicOn: true,
    isVideoOn: true,
    viewerCount: 0,
    duration: 0,
  });
  const [streamList, setStreamList] = useState<MuxStreamResponse[]>([]);
  const [liveDetailModel, setLiveDetailModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  console.log(streamList);

  const startStream = async (formData: LiveDetailModel) => {
    setStreamLoading(true);
    try {
      const res = await StreamLiveStart_API(formData);

      if (res.success) {
        setStreamState((prev) => ({
          ...prev,
          isLive: true,
          muxStreamDetails: res.data,
        }));
        //   setStreamList((prev) => [...prev, {stream:res.data.data,metadata:res.data.metadata}]);
      }
    } catch (error) {
      console.error("Failed to start stream:", error);
    } finally {
      setStreamLoading(false);
    }
  };

  const toggleLiveStream = () => {
    if (!streamState.isLive) {
      setLiveDetailModel(true);
    } else {
      if (!streamState.muxStreamDetails?.stream.stream_key) return;
      console.log("id ", streamState.muxStreamDetails?.stream.id);
      StopStreaming_API(streamState.muxStreamDetails?.stream.id);
      setStreamState((prev) => ({
        ...prev,
        isLive: false,
        muxStreamDetails: undefined,
        duration: 0,
      }));
    }
  };
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const getStatusColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "ended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // const formatDuration = (seconds: number): string => {
  //   const hrs = Math.floor(seconds / 3600);
  //   const mins = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${hrs.toString().padStart(2, "0")}:${mins
  //     .toString()
  //     .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  // };

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;

  //   if (streamState.isLive) {
  //     timer = setInterval(() => {
  //       setStreamState((prev) => ({
  //         ...prev,
  //         duration: prev.duration + 1,
  //       }));
  //     }, 1000);
  //   }

  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, [streamState.isLive]);

  // const fetchLiveDetails = async () => {
  //   if (!streamState.muxStreamDetails?.id) return;

  //   try {
  //     const res = await StreamLiveDetails_API(streamState.muxStreamDetails?.id);
  //     const data = await res.json();

  //     if (data.success) {
  //       setStreamState((prev) => ({
  //         ...prev,
  //         liveDetails: data.data,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch live details:", error);
  //   }
  // };

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   if (streamState.isLive) {
  //     interval = setInterval(fetchLiveDetails, 5000); // Fetch every 5 seconds
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [streamState.isLive]);

  useEffect(() => {
    async function fetchLiveStreamsList() {
      setLoading(true);
      try {
        const res = await StreamList_API();
        if (res.success) {
          console.log(res.data);
          setStreamList(res.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchLiveStreamsList();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Live Stream Dashboard
      </h1>

      {/* Stream Controls */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
        <button
          onClick={toggleLiveStream}
          className={`px-6 py-3 rounded-md font-medium text-lg min-w-40 transition-colors ${
            streamState.isLive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {streamState.isLive ? "End Stream" : "Start Stream"}
        </button>
        {liveDetailModel && (
          <LiveDetailForm
            // liveDetailModel={liveDetailModel}
            onSubmit={(formData) => {
              startStream(formData);
              setLiveDetailModel(false);
            }}
            onClose={() => {
              setLiveDetailModel(false);
            }}
          />
        )}
        {streamState.isLive && (
          <div className="flex items-center space-x-4">
            <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-lg font-medium">LIVE</span>
            <span className="text-gray-300">
              Duration:{" "}
              {new Date(streamState.duration * 1000)
                .toISOString()
                .substr(11, 8)}
            </span>
          </div>
        )}
      </div>
      {streamLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {streamState.muxStreamDetails && (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-6 mb-2">
              <h2 className="text-xl font-semibold mb-4">
                Stream Configuration
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <strong className="text-white">Stream Key:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails.stream.stream_key}
                  </div>
                </div>
                <div>
                  <strong className="text-white">SRT Passphrase:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails.stream.srt_passphrase}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-white">Stream Status:</strong>
                    <div className="bg-gray-700 p-2 rounded mt-1">
                      {streamState.muxStreamDetails.stream.status}
                    </div>
                  </div>
                  <div>
                    <strong className="text-white">Latency Mode:</strong>
                    <div className="bg-gray-700 p-2 rounded mt-1">
                      {streamState.muxStreamDetails.stream.latency_mode}
                    </div>
                  </div>
                </div>
                <div>
                  <strong className="text-white">Playback ID:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails.stream.playback_ids[0]?.id}
                  </div>
                </div>
                <p className="text-sm text-yellow-400 mt-4">
                  ⚠️ Copy these details to OBS. The stream will end after{" "}
                  {streamState.muxStreamDetails.stream.max_continuous_duration}{" "}
                  seconds.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-full text-white p-5">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Live Streams
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              {/* <Activity className="w-5 h-5" /> */}
              <span>{streamList.length} Streams</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streamList.map((stream) => (
              <div
                key={stream.stream.id}
                onClick={() =>
                  navigate(
                    `/live?streamId=${stream?.stream.id}&v=${stream?.stream.playback_ids[0]?.id}`
                  )
                }
                className="group bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-102 hover:shadow-2xl cursor-pointer"
              >
                <div className="relative">
                  {stream?.stream.status === "idle" ? (
                    <img
                      src={BGLive}
                      alt="Stream thumbnail"
                      className="w-full h-20 max-w-max object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={
                        stream?.stream.playback_ids?.[0]?.id &&
                        `https://image.mux.com/${stream.stream.playback_ids[0].id}/thumbnail.png?width=214&height=121&time=0`
                      }
                      alt="Stream thumbnail"
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        stream?.stream.status
                      )} text-white`}
                    >
                      {stream?.stream.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                    {/* <Calendar className="w-4 h-4" /> */}
                    <span>{formatDate(stream.stream.created_at)}</span>
                  </div>

                  {/* <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    Stream ID: {stream?.playback_ids[0]?.id}
                  </h3> */}

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Click to watch</span>
                      <span className="text-blue-400 group-hover:text-blue-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePage;
