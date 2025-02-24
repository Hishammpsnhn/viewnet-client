import React, { useState } from "react";
import { MetaData } from "../model/types/movie.types";
import { UpdataMetadata_API, updateThumbnail_API } from "../api/movieUploadApi";
import axios from "axios";

interface EditMovieModalProps {
  movie: MetaData;
  onClose: () => void;
  onSave: (updatedMovie: MetaData) => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({
  movie,
  onClose,
  onSave,
}) => {
  const [newTitle, setNewTitle] = useState<string>(movie.title);
  const [newDescription, setNewDescription] = useState<string>(
    movie.description || ""
  );
  const [newGenre, setNewGenre] = useState<string>(movie.genre || "");
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(movie.thumbnailUrl);

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setNewThumbnail(event.target.files[0]);
      setThumbnailUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      if (newThumbnail) {
        const response = await updateThumbnail_API(movie,newThumbnail);
        const {signedUrl  } = response;
        await axios.put(signedUrl.url, newThumbnail, {
          headers: {
            "Content-Type": newThumbnail.type,
          },
        });
      }

      // Step 4: Update the movie metadata with the new title, description, genre, and thumbnail URL
      const updateResponse = await UpdataMetadata_API(movie._id, {
        title: newTitle,
        description: newDescription,
        genre: newGenre,
      });

      if (updateResponse.success) {
        onSave(updateResponse.data); // Pass the updated movie data to the parent
        onClose(); // Close the modal
      } else {
        console.error("Failed to update movie details");
      }
    } catch (error) {
      console.error("Error saving movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg border border-secondary w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Movie Details</h2>

        {/* Display the existing thumbnail */}
        <div className="relative mb-4">
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => document.getElementById("thumbnail-input")?.click()}
            className="absolute top-2 right-2 text-white bg-black p-2 rounded-full"
          >
            <span className="text-lg">...</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border border-secondary rounded-lg bg-black"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border border-secondary rounded-lg bg-black"
            />
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-semibold">
              Genre
            </label>
            <input
              id="genre"
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className="w-full p-2 border border-secondary rounded-lg bg-black"
            />
          </div>
          {/* Hidden file input for selecting new thumbnail */}
          <input
            id="thumbnail-input"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg bg-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg bg-black"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
