import React, { useState, ChangeEvent } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface MovieUploadPageProps {}

const MovieUploadPage: React.FC<MovieUploadPageProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [audience, setAudience] = useState<"kids" | "adults">("kids");
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);

  const handleMovieUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMovieFile(e.target.files[0]);
    }
  };

  const handleTrailerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTrailerFile(e.target.files[0]);
    }
  };

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const formData = {
      title,
      description: desc,
      genre,
      audience,
      thumbnail: thumbnail ? thumbnail.name : null,
      movieFile: movieFile ? movieFile.name : null,
      trailerFile: trailerFile ? trailerFile.name : null,
    };

    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex flex-col space-y-8 p-8">
      {/* Form Fields */}
      <div className="flex space-x-10">
        {/* Left Side */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">Upload Movie</h2>

          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie title"
              className="w-full p-2 border border-secondary rounded-md bg-black"
            />
          </div>

          <div className="mb-4">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter movie description"
              className="w-full p-2 border border-secondary bg-black rounded-md h-32"
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
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-6">Upload Movie File</h2>

          <div className="mb-6">
            <label htmlFor="movieInput" className="block text-sm font-medium mb-2">
              Movie Trailer
            </label>
            <div className="flex items-center justify-center">
              <input
                type="file"
                id="movieInput"
                onChange={handleMovieUpload}
                className="hidden"
              />
              <label htmlFor="movieInput" className="cursor-pointer">
                {movieFile ? (
                  <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-black font-medium">File Selected</span>
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                    <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                    <span className="text-white text-sm">Upload Trailer</span>
                  </div>
                )}
              </label>
            </div>
            {movieFile && (
              <p className="mt-2 text-sm text-gray-600">
                File selected: {movieFile.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="movieFileInput" className="block text-sm font-medium mb-2">
              Movie File
            </label>
            <div className="flex items-center justify-center">
              <input
                type="file"
                id="movieFileInput"
                onChange={handleTrailerUpload}
                className="hidden"
              />
              <label htmlFor="movieFileInput" className="cursor-pointer">
                {trailerFile ? (
                  <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-black font-medium">File Selected</span>
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-black border border-secondary flex flex-col items-center justify-center rounded-md">
                    <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                    <span className="text-white text-sm">Upload Movie File</span>
                  </div>
                )}
              </label>
            </div>
            {trailerFile && (
              <p className="mt-2 text-sm text-gray-600">
                File selected: {trailerFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MovieUploadPage;
