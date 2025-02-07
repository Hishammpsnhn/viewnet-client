import { useNavigate } from "react-router-dom";
import image from "../../assets/images/ragnar-lodbrok-digital-art-vikings-sword-wallpaper-preview.webp";
import {
  addWatchLaterMovies_API,
  addWatchLaterSeries_API,
} from "../../api/watchLaterApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface CardTypes {
  title: string;
  id: string;
  description: string;
  image: string;
  url: string;
  series: boolean;
}

const MovieCard = ({
  title,
  id,
  url,
  description,
  image,
  series,
}: CardTypes) => {
  const navigate = useNavigate();
  const { selectedProfile } = useSelector((state: RootState) => state.user);

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    navigate('/watch-later');
    if (selectedProfile) {
      if (series) {
        addWatchLaterSeries_API(selectedProfile._id, id);
      } else {
        addWatchLaterMovies_API(selectedProfile._id, id);
      }
    }
  };

  return (
    <div
      className="relative min-w-[10rem] md:min-w-[18rem] max-w-sm rounded-lg overflow-hidden shadow-lg cursor-pointer bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
      onClick={() => navigate(url)}
    >
      {/* Movie Image */}
      <div className="relative">
        <img
          className="w-full h-48 md:h-64 lg:h-72 object-cover"
          src={image}
          alt={title}
        />

        {/* Title at the Top */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent">
          <h2 className="font-bold text-lg md:text-xl text-white truncate">{title}</h2>
        </div>

        {/* Description Overlay (shown on hover) */}
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
          <p className="text-sm text-gray-200">{description}</p>
        </div>

        {/* Buttons at the Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex justify-between items-center">
            <button
              className="bg-gray-700/90 text-white font-bold px-3 py-2 rounded-md text-sm transition-transform transform hover:scale-110 hover:bg-gray-600/90"
              onClick={handleWatchLater}
            >
              Watch Later
            </button>
            <button
              className="bg-secondary text-black font-semibold text-sm px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(url);
              }}
            >
              Watch Now
            </button>
          </div>
          {/* Genre */}
          <div className="mt-2 text-xs text-end text-gray-300">
            {"Action, Drama"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;