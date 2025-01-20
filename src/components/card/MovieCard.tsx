import image from "../../assets/images/ragnar-lodbrok-digital-art-vikings-sword-wallpaper-preview.webp";

const MovieCard = () => {
  const movie = {
    id: 1,
    title: "Inception",
    description: "A mind-bending thriller by Christopher Nolan.",
    image: image,
    genre: "Sci-Fi",
    rating: 8.8,
    releaseDate: "2010-07-16",
  };

  return (
    <div className="relative min-w-[10rem] md:min-w-[18rem] max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      {/* Movie Image */}
      <div className="relative">
        <img
          className="w-full h-40 md:h-56 lg:h-64 object-cover"
          src={movie.image}
          alt={movie.title}
        />

        {/* Title at the Top */}
        <div className="absolute top-0 left-0 w-full text-white p-4">
          <h2 className="font-semibold text-sm md:text-lg truncate">
            {movie.title}
          </h2>
        </div>

        {/* Description Overlay (shown on hover) */}
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
          <p className="text-sm text-white">{movie.description}</p>
        </div>

        {/* Buttons at the Bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-2">
          <div className="flex justify-between w-full">
            <button className="bg-gray-700 opacity-90 text-white font-bold px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm transition-transform transform hover:scale-110">
              +
            </button>
            <button className="bg-secondary text-black font-semibold text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-primary-dark transition-colors">
              Watch Now
            </button>
          </div>
          {/* Genre */}
          <div className="mt-1 font-bold text-xs text-end text-gray-400">
            {movie.genre}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
