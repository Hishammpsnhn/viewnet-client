// pages/UploadDetailsPage.tsx

import React, { useEffect, useState } from "react";
import { GetAllMetadata_API } from "../../api/movieUploadApi";
import { MetaData } from "../../model/types/movie.types";
import EditMovieModal from "../../components/EditMovieModal";

const UploadDetailsPage = () => {
  const [movies, setMovies] = useState<MetaData[]>([]);

  const [editingMovie, setEditingMovie] = useState<MetaData | null>(null);

  useEffect(() => {
    const fetchAllMetadata = async () => {
      const data = await GetAllMetadata_API();
      console.log(data);
      if (data.success) {
        setMovies(data.data);
      }
    };

    fetchAllMetadata();
  }, []);

  const handleEditClick = (movie: MetaData): void => {
    setEditingMovie(movie);
  };

  const handleSaveEdit = (updatedMovie: MetaData): void => {
    console.log("upated data", updatedMovie);
    console.log("alredy ", movies);
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === updatedMovie._id ? updatedMovie : movie
      )
    );
    setEditingMovie(null);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto bg-black shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Upload Details</h1>
        <div className="space-y-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className={`flex items-center justify-between bg-gray-900 p-4 rounded-lg shadow-sm ${
                movie.transcoding?.status === "pending" ||
                movie.transcoding?.status === "processing"
                  ? "opacity-70"
                  : ""
              }`}
            >
              {movie.thumbnailUrl && (
                <img
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  className="rounded-lg w-1/6 h-20 bg-white object-cover"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {movie.title}
                </h2>
                <p
                  className={`text-sm font-medium ${
                    movie.uploadStatus === "success"
                      ? "text-green-400"
                      : movie.uploadStatus === "pending"
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  Status: {movie.uploadStatus}
                </p>
                <p className="text-sm text-gray-400">
                  Uploaded on: {movie.releaseDateTime}
                </p>

                {/* Transcoding Status */}
                {(movie.transcoding?.status === "pending" ||
                  movie.transcoding?.status === "processing") && (
                  <div className="text-sm text-yellow-400 mt-2">
                    <span className="animate-pulse">
                      Transcoding is {movie.transcoding.status} ...
                    </span>
                  </div>
                )}
              </div>

              {/* Button for editing movie details */}
              <button
                onClick={() => handleEditClick(movie)}
                className="text-blue-400 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for editing movie details */}
      {editingMovie && (
        <EditMovieModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default UploadDetailsPage;
