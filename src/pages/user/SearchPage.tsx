import GenreCard from "../../components/card/GenreCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchPage = () => {
  const { searchMeta, loading } = useSelector(
    (state: RootState) => state.movies
  );
  console.log(searchMeta);

  return (
    <div className="flex gap-6 flex-wrap px-10 py-5 bg-gradient-to-b from-gray-900 to-primary mx-auto">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {searchMeta.map((genre, index) => (
            <GenreCard key={index} genre={genre} />
          ))}
        </>
      )}
    </div>
  );
};

export default SearchPage;
