import React, { useState, useEffect } from "react";
import IMG from "../assets/images/stranger-things-5-expect-header-1024x409.webp";
import IMG2 from "../assets/images/the-last-king-vikings.webp";
import IMG3 from "../assets/images/stranger-things-pictures-7fj1jv6tvf3izh0t.webp";
import { MetaData } from "../model/types/movie.types";
import { ISeriesResponse } from "../model/types/series.types";
import { useNavigate } from "react-router-dom";
interface CarouselProp {
  selectedMovie: MetaData | ISeriesResponse | null;
}
const Carousel = ({ selectedMovie }: CarouselProp) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    {
      src: IMG,
      title: "Ragnar Lodbrok",
      description: "The legendary Viking king",
      buttonText: "Watch Now",
    },
    {
      src: IMG2,
      title: "The Last King",
      description: "A tale of the last Viking king",
      buttonText: "Watch Now",
    },
    {
      src: IMG3,
      title: "The Last King",
      description: "A tale of the last Viking king",
      buttonText: "Watch Now",
    },
  ];

  // Function to go to the next slide
  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Automatically change slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000); // Change every 10 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div id="controls-carousel" className="relative w-full">
      {/* Carousel wrapper */}
      <div className="relative h-56 md:h-[65vh]">
        <div className={`duration-700 ease-in-out block`} data-carousel-item>
          {/* Image */}
          <img
            src={selectedMovie?.thumbnailUrl}
            className="absolute block w-full h-full object-fill"
            alt={`carousel-item-${selectedMovie?.title}`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary"></div>
        </div>

        {/* Title, description, and button */}
        <div className="absolute bottom-16 left-24 p-4 text-white">
          <h2 className="text-2xl font-bold text-start">
            {selectedMovie?.title}
          </h2>
          <p className="text-lg">{selectedMovie?.description}</p>
          <button
            className="mt-4 bg-secondary px-6 py-2 rounded-lg text-white hover:opacity-90 opacity-100"
            onClick={() => navigate(`/watch?v=${selectedMovie?._id}`)}
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

//<div className="relative h-56 md:h-[65vh]">
// {images.map((image, index) => (
//   <div
//     key={index}
//     className={`duration-700 ease-in-out ${
//       index === activeIndex ? "block" : "hidden"
//     }`}
//     data-carousel-item
//   >
//     {/* Image */}
//     <img
//       src={image.src}
//       className="absolute block w-full h-full object-fill"
//       alt={`carousel-item-${index}`}
//     />

//     {/* Gradient Overlay */}
//     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary"></div>
//   </div>
// ))}

{
  /* Title, description, and button */
}
{
  /* <div className="absolute bottom-16 left-24 p-4 text-white">
  <h2 className="text-2xl font-bold text-start">
    {images[activeIndex].title}
  </h2>
  <p className="text-lg">{images[activeIndex].description}</p>
  <button className="mt-4 bg-secondary px-6 py-2 rounded-lg text-white hover:opacity-90 opacity-100">
    {images[activeIndex].buttonText}
  </button>
</div> */
}
// </div>
