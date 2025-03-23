import React, { useEffect, useState } from "react";
import { GenreEditForm } from "../../components/genre/GenreEditForm";
import { Genre } from "../../model/types/genrePage";
import { GenreItem } from "../../components/genre/GenreItems";
import { FilterIcon, PlusIcon, SearchIcon } from "../../svg/svg";
import { createGenre_API, getAllGenre_API } from "../../api/genreApi";
import { genreValidation } from "../../utils/Validation";
import * as Yup from "yup";
import LoadingSpinner from "../../components/LoadingSpinner";

const GenrePage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  useEffect(() => {
    async function getGenres() {
      try {
        setIsLoading(true);
        const res = await getAllGenre_API();
        if (res.success) {
          setGenres(res.data);
        } else {
          setError("Failed to load genres");
        }
      } catch (err) {
        setError("Error loading genres");
      } finally {
        setIsLoading(false);
      }
    }
    getGenres();
  }, []);

  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredGenres = genres.filter((genre) => {
    const matchesSearch = genre.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && genre.isActive) ||
      (filter === "inactive" && !genre.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleAddGenre = () => {
    const newGenre: Genre = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      mediaCount: 0,
    };
    setEditingGenre(newGenre);
  };

  const handleSaveGenre = async (updatedGenre: Genre) => {
    try {
      setIsLoading(true);
      setError(null);
      await genreValidation.validate(updatedGenre, { abortEarly: false });
      
      console.log(updatedGenre)
      if (!updatedGenre.id) {
        const res = await createGenre_API(updatedGenre);
        if (res.success) {
          setGenres([...genres, res.data]);
        } else {
          setError("Failed to create genre");
        }
      } else {
        const res = await createGenre_API(updatedGenre);
        if (res.success) {
          setGenres(
            genres.map((genre) =>
              genre.id === updatedGenre.id ? updatedGenre : genre
            )
          );
        } else {
          setError("Failed to update genre");
        }
      }
      setEditingGenre(null);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      }
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return <LoadingSpinner/>
  }

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="container mx-auto">
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Genre Management</h1>
          <button
            onClick={handleAddGenre}
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            disabled={isLoading}
          >
            <PlusIcon /> Add Genre
          </button>
        </div>

        <div className="flex mb-6 space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 rounded-lg pl-10"
            />
            <div className="absolute left-3 top-3 text-gray-500">
              <SearchIcon />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              <FilterIcon />
            </div>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "active" | "inactive")
              }
              className="bg-gray-800 px-4 py-2 rounded-lg"
            >
              <option value="all">All Genres</option>
              <option value="active">Active Genres</option>
              <option value="inactive">Inactive Genres</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredGenres.map((genre) => (
            <div
              key={genre.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              {editingGenre?.id === genre.id ? (
                <GenreEditForm
                  validationErrors={validationErrors}
                  genre={editingGenre}
                  onSave={handleSaveGenre}
                  onCancel={() => setEditingGenre(null)}
                />
              ) : (
                <GenreItem
                  genre={genre}
                  onEdit={setEditingGenre}
                  // onDelete={handleDeleteGenre}
                />
              )}
            </div>
          ))}

          {/* Show form for new genre */}
          {editingGenre && !editingGenre.id && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <GenreEditForm
                genre={editingGenre}
                validationErrors={validationErrors}
                onSave={handleSaveGenre}
                onCancel={() => setEditingGenre(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
