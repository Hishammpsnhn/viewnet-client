import React, { useState, ChangeEvent } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CreateSeries_API } from "../../api/seriesApi";
import { ISeries } from "../../model/types/series.types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SeriesUploadPageProps {}

interface Episode {
  title: string;
  file: File | null;
}

const SeriesUploadPage: React.FC<SeriesUploadPageProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [audience, setAudience] = useState<"kids" | "adults">("kids");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const navigate = useNavigate()

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0])
      setThumbnail(e.target.files[0]);
    }
  };

  const handleEpisodeTitleChange = (index: number, value: string) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index].title = value;
    setEpisodes(updatedEpisodes);
  };

  const handleEpisodeFileChange = (index: number, file: File | null) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index].file = file;
    setEpisodes(updatedEpisodes);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { title: "", file: null }]);
  };

  const removeEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };
  const uploadFileToS3Thumbnail = async (
    url: string,
    file: File,
    id:string,
  ): Promise<void> => {
    try {
      console.log("uplaoding")
      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      console.log(uploadResponse);
      if (uploadResponse.status === 200) {
        navigate(`/series/${id}`)
        
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
      alert("Please fill in all required fields and add at least one episode.");
      return;
    }

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
    console.log("Form Data Submitted:", res);
    if (res.success) {
      console.log(res.thumbnailSignedUrl,thumbnail)
      if (res.thumbnailSignedUrl && thumbnail ) {
        uploadFileToS3Thumbnail(res.thumbnailSignedUrl.url, thumbnail,res.data._id);
      }
    }
  };

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
              <option value="">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
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

        {/* Right Side */}
        {/* <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-6">Episodes</h2>
          {episodes.map((episode, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2">
                <input
                  type="text"
                  value={episode.title}
                  onChange={(e) =>
                    handleEpisodeTitleChange(index, e.target.value)
                  }
                  placeholder={`Episode ${index + 1} Title`}
                  className="w-full p-2 border border-secondary rounded-md bg-black"
                />
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  id={`episodeFile${index}`}
                  onChange={(e) =>
                    handleEpisodeFileChange(
                      index,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`episodeFile${index}`}
                  className="cursor-pointer"
                >
                  {episode.file ? (
                    <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
                      <span className="text-black font-medium">
                        File Selected
                      </span>
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                      <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                      <span className="text-white text-sm">Upload Episode</span>
                    </div>
                  )}
                </label>
                <button
                  onClick={() => removeEpisode(index)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addEpisode}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Episode
          </button>
        </div> */}
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
