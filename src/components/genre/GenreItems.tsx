import { Genre } from "../../model/types/genrePage";
import { EditIcon, TrashIcon } from "../../svg/svg";

export const GenreItem: React.FC<{
  genre: Genre;
  onEdit: (genre: Genre) => void;
 // onDelete: (id: number) => void;
}> = ({ genre, onEdit }) => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold">{genre.name}</h2>
        <p className="text-gray-400 text-sm">{genre.description}</p>
        <div className="mt-2 text-sm">
          <span className={`px-2 py-1 rounded text-xs ${genre.isActive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {genre.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="ml-2 text-gray-500">
            {genre.mediaCount} Media Items
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit(genre)}
          className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-full"
        >
          <EditIcon />
        </button>
        {/* <button 
          onClick={() => onDelete(genre.id)}
          className="text-red-500 hover:bg-red-500/10 p-2 rounded-full"
        >
          <TrashIcon />
        </button> */}
      </div>
    </>
  );
};

