import Carousel from "../../components/Carousel";
import MovieCard from "../../components/card/MovieCard";

export const HomePage = () => {
  return (
    <div className="">
      {/* Carousel Section */}
      <div className="mb-6">
        <Carousel />
      </div>

      {/* Horizontal Scroll Section */}
      <div className="ml-16 overflow-x-auto scrollbar-hidden">
        <h1 className="text-2xl font-bold pb-6">Recommended</h1>
        <div className="flex space-x-12 w-max scrollbar-hidden">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </div>
  );
};
