export interface MuxStreamResponse {
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
export interface MuxAssetsResponse {
  test: boolean;
  status: string;
  srt_passphrase: string;
  max_continuous_duration: number;
  latency_mode: string;
  id: string;
  created_at: string;
  playback_ids: Array<{
    policy: string;
    id: string;
  }>;
}
