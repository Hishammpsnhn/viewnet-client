import React, { useState, ChangeEvent, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CreateSeries_API } from "../../api/seriesApi";
import { ISeries } from "../../model/types/series.types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllGenre_API } from "../../api/genreApi";
import { Genre } from "../../model/types/genrePage";

interface SeriesUploadPageProps {}

const SeriesUploadPage: React.FC<SeriesUploadPageProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [desc, setDesc] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [audience, setAudience] = useState<"kids" | "adults">("kids");
  const navigate = useNavigate();

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setThumbnail(e.target.files[0]);
    }
  };

  const uploadFileToS3Thumbnail = async (
    url: string,
    file: File,
    id: string
  ): Promise<void> => {
    try {
      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      if (uploadResponse.status === 200) {
        navigate(`/series/${id}`);
      } else {
        console.log("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      toast.error("Failed to upload file");
    }
  };
  const handleUpload = async () => {
    if (!title || !desc || !thumbnail || !genre) {
      console.log(genre)
      toast.error(
        "Please fill in all required fields and add at least one episode."
      );
      return;
    }
    // await subscriptionPlan.validate(formData, { abortEarly: false });

    const formData: ISeries = {
      title,
      description: desc,
      genre,
      audience,
      rating: 0,
      releaseDate: new Date(),
      seasons: [],
    };
    const res = await CreateSeries_API(formData);
    if (res.success) {
      if (res.thumbnailSignedUrl && thumbnail) {
        uploadFileToS3Thumbnail(
          res.thumbnailSignedUrl.url,
          thumbnail,
          res.data._id
        );
      }
    }
  };
  useEffect(() => {
    async function getGenres() {
      try {
        const res = await getAllGenre_API();
        if (res.success) {
          setGenres(res.data);
          if (!genre) setGenre(res.data[0]?.id);
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    }
    getGenres();
  }, []);

  return (
    <div className="flex flex-col space-y-10 p-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Upload Series</h2>

      {/* Form */}
      <div className="flex space-x-10">
        {/* Left Side */}
        <div className="w-1/2">
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter series title"
              className="w-full p-2 border border-secondary rounded-md bg-black"
            />
          </div>

          <div className="mb-4">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter series description"
              className="w-full p-2 border border-secondary bg-black rounded-md h-32"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium mb-2"
            >
              Release Date and Time
            </label>
            <input
              type="datetime-local"
              id="releaseDate"
              //value={releaseDate}
              //onChange={handleReleaseDateChange}
              className="w-full p-2 border border-secondary rounded-md bg-black text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="flex items-center">
              <input
                type="file"
                id="thumbnailInput"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              <label htmlFor="thumbnailInput" className="cursor-pointer">
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
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
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-2 border border-secondary bg-black rounded-md"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Audience</label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  value="kids"
                  checked={audience === "kids"}
                  onChange={() => setAudience("kids")}
                  className="mr-2"
                />
                For Kids
              </label>
              <label>
                <input
                  type="radio"
                  value="adults"
                  checked={audience === "adults"}
                  onChange={() => setAudience("adults")}
                  className="mr-2"
                />
                For Adults
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-3 bg-secondary text-black w-full rounded-md self-center"
      >
        Upload Series
      </button>
    </div>
  );
};

export default SeriesUploadPage;
