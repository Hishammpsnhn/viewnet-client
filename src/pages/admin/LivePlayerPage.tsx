import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  GetAssetsDetails_API,
  RemoveStreaming_API,
  StopStreaming_API,
  StreamLiveDetails_API,
} from "../../api/LiveStreamApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import LiveChat from "../../components/LiveChatMessage";
interface StreamState {
  isLive: boolean;
  isMicOn: boolean;
  isVideoOn: boolean;
  viewerCount: number;
  duration: number;
  muxStreamDetails?: MuxStreamResponse;
}
interface MuxStreamResponse {
  test: boolean;
  stream_key: string;
  status: string;
  srt_passphrase: string;
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
}
const LivePlayerPage = ({
  admin,
  assets,
}: {
  admin: boolean;
  assets?: boolean;
}) => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const [streamState, setStreamState] = useState<StreamState>({
    isLive: false,
    isMicOn: true,
    isVideoOn: true,
    viewerCount: 0,
    duration: 0,
  });
  const [loading, setLoading] = useState(false);
  const [assetsVideoId, setAssetsVideoId] = useState<string | undefined>(
    undefined
  );
  let videoId = searchParams.get("v");
  const streamId = searchParams.get("streamId");
  const navigate = useNavigate();
  const toggleLiveStream = () => {
    if (!streamState.muxStreamDetails?.stream_key) return;
    StopStreaming_API(streamState.muxStreamDetails?.id);
    setStreamState((prev) => ({
      ...prev,
      isLive: false,
      muxStreamDetails: undefined,
      duration: 0,
    }));
  };

  const toggleLiveStreamDelete = () => {
    if (!streamState.muxStreamDetails?.stream_key) return;
    RemoveStreaming_API(streamState.muxStreamDetails?.id);
    navigate("/dashboard/live");
  };
  useEffect(() => {
    async function fetchDetails() {
      if (!streamId) return;
      setLoading(true);
      try {
        const res = await StreamLiveDetails_API(streamId);
        if (res && res.success) {
          setStreamState((prev) => ({ ...prev, muxStreamDetails: res.data }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchAssetsDetails() {
      if (id) {
        try {
          const res = await GetAssetsDetails_API(id);
          if (res.success) {
            setAssetsVideoId(res.data.playback_ids[0].id);
            videoId = res.data.playback_ids[0].id;
          }
        } catch (error) {}
      }
    }
    if (admin) fetchDetails();
    if (assets) fetchAssetsDetails();
  }, []);
  return (
    <>
      {!videoId && !assetsVideoId ? (
        <>
          {assets ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <div>Video Not Found {videoId}</div>
          )}
        </>
      ) : (
        <div className=" flex gap-2 p-5">
          <MuxPlayer
            playbackId={videoId ? videoId : assetsVideoId}
            metadataVideoTitle="Placeholder (optional)"
            metadata-viewer-user-id="Placeholder (optional)"
            primary-color="#ffffff"
            secondary-color="#000000"
            accent-color="#fa50b5"
          />
          {!assets && <LiveChat streamId={streamId || ""} />}
        </div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {streamState.muxStreamDetails?.status === "active" && (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
              <button
                onClick={toggleLiveStream}
                className={`px-6 py-3 rounded-md font-medium text-lg min-w-40 transition-colors 
          bg-red-600 hover:bg-red-700`}
              >
                End Stream
              </button>
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
          )}
          {streamState.muxStreamDetails?.status === "idle" && (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
              <button
                onClick={toggleLiveStreamDelete}
                className={`px-6 py-3 rounded-md font-medium text-lg min-w-40 transition-colors 
          bg-red-600 hover:bg-red-700`}
              >
                Delete Stream
              </button>
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
          )}
          {streamState.muxStreamDetails && (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">
                Stream Configuration
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <strong className="text-white">Stream Key:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails.stream_key}
                  </div>
                </div>
                <div>
                  <strong className="text-white">SRT Passphrase:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails.srt_passphrase}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-white">Stream Status:</strong>
                    <div className="bg-gray-700 p-2 rounded mt-1">
                      {streamState.muxStreamDetails.status}
                    </div>
                  </div>
                  <div>
                    <strong className="text-white">Latency Mode:</strong>
                    <div className="bg-gray-700 p-2 rounded mt-1">
                      {streamState.muxStreamDetails.latency_mode}
                    </div>
                  </div>
                </div>
                <div>
                  <strong className="text-white">Playback ID:</strong>
                  <div className="bg-gray-700 p-2 rounded mt-1 break-all">
                    {streamState.muxStreamDetails?.playback_ids[0]?.id}
                  </div>
                </div>
                <p className="text-sm text-yellow-400 mt-4">
                  ⚠️ Copy these details to OBS. The stream will end after{" "}
                  {streamState.muxStreamDetails.max_continuous_duration}{" "}
                  seconds.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {/* 
      {videoId && streamState.muxStreamDetails?.status === "active" && (
      )} */}
    </>
  );
};

export default LivePlayerPage;
