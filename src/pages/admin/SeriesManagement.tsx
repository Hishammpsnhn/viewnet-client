import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HistoryCardSkeleton from "../../components/movie/HistoryCardSkelition";
import {
  createEpisodeWithSignedUrl_API,
  createSeason_API,
  fetchSeriesDetails_API,
  updateSeriesDetails_API,
} from "../../api/seriesApi";
import {
  IEpisode,
  IEpisodeResponse,
  ISeason,
  ISeries,
} from "../../model/types/series.types";
import axios from "axios";
import HistoryCard from "../../components/movie/HistoryCard";
import { toast } from "react-toastify";
import { createEpisodeCatalog_API } from "../../api/seriesApi";
import { UpdataMetadata_API } from "../../api/movieUploadApi";

const SeriesManagement = () => {
  const { seriesId } = useParams();

  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<ISeries | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<ISeason | null>();
  const [episodeDetails, setEpisodeDetails] = useState<IEpisodeResponse>();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  console.log(uploadProgress);

  const [episodeData, setEpisodeData] = useState<IEpisode>({
    title: "",
    description: "",
    videoUrl: null,
    releaseDate: new Date(),
    episodeNumber: 0,
    seasonId: "",
    thumbnailUrl: null,
    transcoding: "pending",
    key: "",
  });
  console.log(series);
  useEffect(() => {
    async function fetchMovies() {
      try {
        if (seriesId) {
          const res = await fetchSeriesDetails_API(seriesId);
          if (res.success) {
            setSeries(res.data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const handleAddSeason = async () => {
    try {
      if (seriesId && series?.seasons) {
        const season: ISeason = {
          episodes: [],
          releaseDate: new Date(),
          seasonNumber: series?.seasons.length + 1,
          seriesId: seriesId,
        };
        const res = await createSeason_API(seriesId, season);
        if (res.success) {
          setSeries((prev) =>
            prev ? { ...prev, seasons: [...prev.seasons, res.season] } : prev
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEpisode = (season: ISeason) => {
    console.log("seoan", season);
    setSelectedSeason(season);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    //setEpisodeData({ title: "", description: "", videoUrl: null });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEpisodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    console.log(e, field);
    if (e.target.files) {
      setEpisodeData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };
  const handleUploadProgress = (movieId: string, progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [movieId]: progress, // Update progress for the specific movie ID
    }));
  };

  const handleBlockSeries = async () => {
    if (seriesId) {
      const res = await updateSeriesDetails_API(seriesId, {
        isBlock: !series?.isBlock,
      });
      if (res.success) {
        setSeries((prev) =>
          prev ? { ...prev, isBlock: !prev.isBlock } : prev
        );
      }
    }
  };

  const uploadFileToS3Movie = async (
    id: string,
    url: string,
    file: File,
    key: string
  ): Promise<void> => {
    console.log("callled s3");
    try {
      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": "video/mp4",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total !== undefined) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            handleUploadProgress(id, percentCompleted);
          }
        },
      });
      console.log(uploadResponse);

      if (uploadResponse.status === 200) {
        console.log("File uploaded successfully");
        const obj = {
          key,
          episodeId: id,
          format: "mp4",
        };
        // UpdataMetadata_API(id, { uploadStatus: "success" });
        // setUploadProgress({ movie: 0, thumbnail: 0 });
        // navigate("/uploads/details");
        const res = await createEpisodeCatalog_API(obj);
        console.log(res);
      } else {
        console.log("Failed to upload file");
        // toast.error("Failed to upload file");
      }
    } catch (error) {
      // UpdataMetadata_API(id, { uploadStatus: "failed" });
      // console.error("Error uploading file to S3:", error);
      // toast.error("Failed to upload file");
    } finally {
      //setLoadingStart(false);
    }
  };
  const uploadFileToS3Thumbnail = async (
    url: string,
    file: File
  ): Promise<void> => {
    try {
      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      console.log(uploadResponse);
      if (uploadResponse.status === 200) {
      } else {
        console.log("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      toast.error("Failed to upload Thumbnail");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Episode Data:", episodeData);
    console.log(selectedSeason);
    if (!selectedSeason || !selectedSeason._id) return;
    const obj: IEpisode = {
      description: episodeData.description,
      releaseDate: new Date(),
      episodeNumber: selectedSeason.episodes.length + 1,
      seasonId: selectedSeason._id,
      title: episodeData.title,
      videoUrl: null,
      thumbnailUrl: null,
      transcoding: "pending",
      key: "",
    };
    const res = await createEpisodeWithSignedUrl_API(obj);
    console.log(res);
    if (res.success && episodeData.videoUrl && episodeData.thumbnailUrl) {
      uploadFileToS3Movie(
        res.episode._id,
        res.movieSignedUrl.url,
        episodeData.videoUrl,
        res.key
      );
      setEpisodeDetails(res.episode);

      setSeries((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          seasons: prev.seasons?.map((s) =>
            s._id === res.episode.seasonId
              ? { ...s, episodes: [...s.episodes, res.episode] }
              : s
          ),
        };
      });

      //upload thumbnail
      uploadFileToS3Thumbnail(
        res.thumbnailSignedUrl.url,
        episodeData.thumbnailUrl
      );

      uploadFileToS3Thumbnail(
        res.thumbnailSignedUrl.url,
        episodeData.thumbnailUrl
      );
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center md:items-start p-6 max-w-4xl mx-auto shadow-lg rounded-lg">
        {loading && <>Loading....</>}
        {!series && !loading && <>Not found</>}
        <div className="md:w-1/2 text-left flex flex-col h-64">
          <h2 className="text-2xl font-bold text-gray-300 capitalize">{series?.title}</h2>
          <p className="text-gray-400 mt-2 capitalize">{series?.description}</p>
          <div className="mt-auto space-x-4 pt-4 flex items-center">
            <button
              className="px-4 py-3 border border-secondary bg-black text-white rounded-lg shadow-md hover:bg-gray-900 text-xs w-40"
              onClick={handleAddSeason}
            >
              ADD NEW SEASON
            </button>
            <button
              className={`px-4 py-3 border ${
                series?.isBlock ? "border-green-900" : "border-red-900"
              } bg-black text-white rounded-lg shadow-md hover:bg-gray-900 text-xs w-40`}
              onClick={handleBlockSeries}
            >
              {series?.isBlock ? "RELEASE" : "BLOCK"} SERIES
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            className="w-64 h-auto rounded-lg shadow-md object-cover"
            src={series?.posterImage || ""}
            alt={series?.title || "Series Poster"}
          />
        </div>
      </div>

      {series?.seasons.map((season) => (
        <div key={season._id} className="p-6">
          <h1 className="text-white text-3xl font-bold mb-5">
            Season {season.seasonNumber}
          </h1>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 mb-5"
            onClick={() => season && handleAddEpisode(season)}
          >
            Add Episode
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <HistoryCardSkeleton key={index} />
              ))
            ) : (
              <>
                {season.episodes.map((episode, i) => (
                  <HistoryCard
                    title={episode.title}
                    id={episode._id || ""}
                    image={
                      typeof episode.thumbnailUrl === "string"
                        ? episode.thumbnailUrl
                        : ""
                    }
                    description="something desc"
                    transcoding={episode.transcoding}
                    progress={uploadProgress}
                    seriesWatch={true}
                    uniqueKey={episode.key}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ))}

      {/* add episode Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black border border-secondary p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Episode</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={episodeData.title}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-secondary bg-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={episodeData.description}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-secondary bg-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Thumbnail
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "thumbnailUrl")}
                  className="mt-1 p-2 w-full border rounded-lg bg-black"
                  required
                />
                {episodeData.thumbnailUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(episodeData.thumbnailUrl)}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "videoUrl")}
                  className="mt-1 p-2 w-full border rounded-lg bg-black"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SeriesManagement;
