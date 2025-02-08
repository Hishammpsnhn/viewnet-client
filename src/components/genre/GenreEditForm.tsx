import { useState } from "react";
import { Genre } from "../../model/types/genrePage";
import { SaveIcon } from "../../svg/svg";

export const GenreEditForm: React.FC<{
  genre: Genre;
  onSave: (genre: Genre) => void;
  validationErrors: any;
  onCancel: () => void;
}> = ({ genre, onSave, onCancel, validationErrors }) => {
  const [editedGenre, setEditedGenre] = useState<Genre>(genre);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <input
            value={editedGenre?.name}
            onChange={(e) =>
              setEditedGenre({ ...editedGenre, name: e.target.value })
            }
            placeholder="Genre Name"
            className="bg-gray-700 p-2 rounded"
          />
          {validationErrors.name && (
            <p className="text-sm text-red-700 mb-2 w-full">
              {validationErrors.name}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={editedGenre?.isActive}
            onChange={(e) =>
              setEditedGenre({ ...editedGenre, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <span>Active</span>
        </div>
      </div>
      <textarea
        value={editedGenre?.description}
        onChange={(e) =>
          setEditedGenre({ ...editedGenre, description: e.target.value })
        }
        placeholder="Genre Description"
        className="w-full bg-gray-700 p-2 rounded h-24"
      />
      {validationErrors.description && (
        <p className="text-sm text-red-700 mb-2 w-full">
          {validationErrors.description}
        </p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onSave(editedGenre)}
          className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mr-2"
        >
          <SaveIcon /> Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
