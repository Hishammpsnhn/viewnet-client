import React from "react";
import GenreCard from "../../components/card/GenreCard";
import Img from '../../assets/images/the-last-king-vikings.webp'
const genres = [
  {
    name: "Action",
    image: Img,
    description: "High-intensity movies with thrilling action sequences.",
  },
  {
    name: "Comedy",
    image: Img,
    description: "Movies that make you laugh with funny scenarios.",
  },
  {
    name: "Action",
    image: Img,
    description: "High-intensity movies with thrilling action sequences.",
  },
  {
    name: "Comedy",
    image: Img,
    description: "Movies that make you laugh with funny scenarios.",
  },
  {
    name: "Action",
    image: Img,
    description: "High-intensity movies with thrilling action sequences.",
  },
  {
    name: "Comedy",
    image: Img,
    description: "Movies that make you laugh with funny scenarios.",
  },
  {
    name: "Action",
    image: Img,
    description: "High-intensity movies with thrilling action sequences.",
  },
  {
    name: "Comedy",
    image: Img,
    description: "Movies that make you laugh with funny scenarios.",
  },
  {
    name: "Action",
    image: Img,
    description: "High-intensity movies with thrilling action sequences.",
  },
  {
    name: "Comedy",
    image: Img,
    description: "Movies that make you laugh with funny scenarios.",
  },
];
const SearchPage = () => {
  return (
    <div className="flex gap-6 flex-wrap px-10 py-5 bg-gradient-to-b from-gray-900 to-primary">
      {genres.map((genre, index) => (
        <GenreCard key={index} genre={genre} />
      ))}
    </div>
  );
};

export default SearchPage;
