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
    <div className="max-w-48 rounded overflow-hidden shadow-lg bg-white relative">
      {/* Movie Image */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={movie.image}
          alt={movie.title}
        />
        {/* Title at the Top */}
        <div className="absolute top-0 left-0 w-full text-white p-2">
          <h2 className="font-bold text-lg">{movie.title}</h2>
        </div>
        {/* Buttons at the Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-col ">
          <div className="flex justify-between w-full">
            <button className="bg-gray-700 opacity-80 text-white font-bold rounded px-3 ">
              +
            </button>
            <button className="bg-secondary text-white text-sm p-2 rounded">
              Watch Now
            </button>
          </div>
          {/* Genre */}
          <div className="mt-1  font-bold text-[10px] text-end text-gray-500 ">
            {movie.genre}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
