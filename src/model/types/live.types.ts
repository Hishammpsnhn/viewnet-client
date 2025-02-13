export interface MuxStreamResponse {
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
    title: string;
    __v: number;
  };
}

export interface MuxAssetsResponse {
  title: string;
  status: string;
  description:string;
  genre:string;
  thumbnailUrl: string;
  id: string;
  created_at: string;
  assetsId: string;
}

export interface LiveDetailModel {
  title?: string;
  description?: string;
  genre?: string;
  isPrivate?: boolean;
  thumbnailUrl?: string;
}
