import React from 'react';
import { SearchMeta } from '../../model/types/movie.types';



interface GenreCardProps {
  genre: SearchMeta;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  return (
    <div className="w-72 rounded-lg shadow-lg overflow-hidden relative cursor-pointer hover:opacity-90">
      <img
        src={genre.thumbnailUrl}
        alt={genre.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <h3 className="text-white text-xl font-semibold">{genre.title}</h3>
      </div>

    </div>
  );
};

export default GenreCard;
