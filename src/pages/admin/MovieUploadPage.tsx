import React, { useState, ChangeEvent, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { movieUpload } from "../../utils/Validation";
import * as Yup from "yup";
import { MovieFormData } from "../../model/types/movie.types";
import {
  UpdataMetadata_API,
  UploadMetadataAndGenerateSingedURL_API,
} from "../../api/movieUploadApi";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Genre } from "../../model/types/genrePage";
import { getAllGenre_API } from "../../api/genreApi";

interface MovieUploadPageProps {}

const MovieUploadPage: React.FC<MovieUploadPageProps> = () => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    description: "",
    genre: "",
    audience: "kids",
    releaseDateTime: "",
    thumbnail: null as File | null,
    movieFile: null as File | null,
    trailerFile: null as File | null,
  });
  const [genres, setGenres] = useState<Genre[]>([]);

  const [uploadProgress, setUploadProgress] = useState<{
    movie: number;
    thumbnail: number;
  }>({
    movie: 0,
    thumbnail: 0,
  });
  const [uploadingStart, setLoadingStart] = useState(false);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const uploadFileToS3Movie = async (
    id: string,
    url: string,
    file: File
  ): Promise<void> => {
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
            setUploadProgress((prev) => ({ ...prev, movie: percentCompleted }));
          }
        },
      });

      if (uploadResponse.status === 200) {
        UpdataMetadata_API(id, { uploadStatus: "success" });
        setUploadProgress({ movie: 0, thumbnail: 0 });
        navigate("/uploads/details");
      } else {
        console.log("Failed to upload file");
        toast.error("Failed to upload file");
      }
    } catch (error) {
      UpdataMetadata_API(id, { uploadStatus: "failed" });
      console.error("Error uploading file to S3:", error);
      toast.error("Failed to upload file");
    } finally {
      setLoadingStart(false);
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
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total !== undefined) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              thumbnail: percentCompleted,
            }));
          }
        },
      });
      if (uploadResponse.status === 200) {
        console.log("File thumbnail uploaded successfully");
      } else {
        console.log("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    setLoadingStart(true);
    try {
      await movieUpload.validate(formData, { abortEarly: false });
      const data = await UploadMetadataAndGenerateSingedURL_API(formData);
      if (data.signedUrls) {
        const { movieSignedUrl, thumbnailSignedUrl } = data.signedUrls;

        // Proceed with uploading the file to S3 using the presigned URL
        if (formData.movieFile)
          uploadFileToS3Movie(
            data.data._id,
            movieSignedUrl.url,
            formData.movieFile
          );
        if (formData.thumbnail)
          uploadFileToS3Thumbnail(thumbnailSignedUrl.url, formData.thumbnail);
      }
    } catch (error) {
      setLoadingStart(false);
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  useEffect(() => {
    async function getGenres() {
      try {
        const res = await getAllGenre_API();
        if (res.success) {
          setGenres(res.data);
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    }
    getGenres();
  }, []);
  return (
    <div className="flex flex-col space-y-8 p-8">
      {/* Form Fields */}
      <div className={`flex space-x-10 ${uploadingStart && "opacity-50"}`}>
        {/* Left Side */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">Upload Movie</h2>

          <div className="mb-4">
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
            <input
              type="text"
              name="title"
              disabled={uploadingStart}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter movie title"
              className="w-full p-2 border border-secondary rounded-md bg-black"
            />
          </div>

          <div className="mb-4">
            {validationErrors.description && (
              <p className="text-red-500 text-sm">
                {validationErrors.description}
              </p>
            )}
            <input
              type="text"
              disabled={uploadingStart}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter movie description"
              className="w-full p-2 border border-secondary bg-black rounded-md h-32"
            />
          </div>

          <div className="mb-4">
            {validationErrors.releaseDateTime && (
              <p className="text-red-500 text-sm">
                {validationErrors.releaseDateTime}
              </p>
            )}
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium mb-2"
            >
              Release Date and Time
            </label>
            <input
              disabled={uploadingStart}
              type="datetime-local"
              id="releaseDate"
              name="releaseDateTime"
              value={formData.releaseDateTime}
              onChange={handleChange}
              className="w-full p-2 border border-secondary rounded-md bg-black text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="flex items-center">
              <input
                disabled={uploadingStart}
                type="file"
                id="thumbnailInput"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                className="hidden"
              />
              <label htmlFor="thumbnailInput" className="cursor-pointer">
                {formData.thumbnail ? (
                  <img
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                    <FaCloudUploadAlt className="text-white text-2xl mb-2" />
                    <span className="text-white text-sm">Upload Thumbnail</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="mb-4">
            {validationErrors.genre && (
              <p className="text-red-500 text-sm">{validationErrors.genre}</p>
            )}
            <select
              disabled={uploadingStart}
              value={formData.genre}
              name="genre"
              onChange={handleChange}
              className="w-full p-2 border border-secondary bg-black rounded-md"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Audience</label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  disabled={uploadingStart}
                  type="radio"
                  value="kids"
                  name="audience"
                  checked={formData.audience === "kids"}
                  onChange={handleChange}
                  className="mr-2"
                />
                For Kids
              </label>
              <label>
                <input
                  type="radio"
                  name="audience"
                  value="adult"
                  checked={formData.audience === "adult"}
                  onChange={handleChange}
                  className="mr-2"
                />
                For Adults
              </label>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-6">Upload Movie File</h2>

          {/* <div className="mb-6">
            <label
              htmlFor="movieInput"
              className="block text-sm font-medium mb-2"
            >
              Movie Trailer
            </label>
            <div className="flex items-center justify-center">
              <input
                disabled={uploadingStart}
                type="file"
                id="movieInput"
                onChange={(e) => handleFileChange(e, "trailerFile")}
                className="hidden"
              />
              <label htmlFor="movieInput" className="cursor-pointer">
                {formData.movieFile ? (
                  <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-black font-medium">
                      File Selected
                    </span>
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                    <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                    <span className="text-white text-sm">Upload Trailer</span>
                  </div>
                )}
              </label>
            </div>
            {formData.movieFile && (
              <p className="mt-2 text-sm text-gray-600">File selected:</p>
            )}
          </div> */}

          <div>
            <label
              htmlFor="movieFileInput"
              className="block text-sm font-medium mb-2"
            >
              Movie File
            </label>
            <div className="flex items-center justify-center">
              <input
                disabled={uploadingStart}
                type="file"
                id="movieFileInput"
                onChange={(e) => handleFileChange(e, "movieFile")}
                className="hidden"
              />
              <label htmlFor="movieFileInput" className="cursor-pointer">
                {formData.movieFile ? (
                  <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-black font-medium">
                      File Selected
                    </span>
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                    <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                    <span className="text-white text-sm">
                      Upload Movie File
                    </span>
                  </div>
                )}
              </label>
            </div>
            {formData.trailerFile && (
              <p className="mt-2 text-sm text-gray-600">
                File selected:
                {/* File selected: {trailerFile.name} */}
              </p>
            )}
          </div>
        </div>
      </div>
      {uploadingStart && uploadProgress.movie ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Upload Progress</h3>
          <div className="mb-2">
            <span className="block text-sm">Movie File</span>
            <progress
              value={uploadProgress.movie}
              max={100}
              className="w-full h-2 bg-gray-300"
            />
            <span className="text-sm">{uploadProgress.movie}%</span>
          </div>
          {/* <div className="mb-2">
            <span className="block text-sm">Thumbnail</span>
            <progress
              value={uploadProgress.thumbnail}
              max={100}
              className="w-full h-2 bg-gray-300"
            />
            <span className="text-sm">{uploadProgress.thumbnail}%</span>
          </div> */}
        </div>
      ) : (
        <></>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          disabled={uploadingStart}
          onClick={handleSubmit}
          className={`bg-secondary flex justify-center items-center text-black w-full px-6 py-2 rounded-md hover:bg-primary-dark ${
            uploadingStart && "opacity-70"
          }`}
        >
          {!uploadingStart ? "Upload" : <LoadingSpinner />}
        </button>
      </div>
    </div>
  );
};

export default MovieUploadPage;
