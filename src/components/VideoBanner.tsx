import backgroundVideo from "../assets/Avathar.mp4";

const VideoBanner = () => {
  return (
    <div className=" w-full h-[90vh] ">
      <video
        className="w-full h-full object-cover opacity-80"
        src={backgroundVideo}
        autoPlay
        loop
        muted
      ></video>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary to-transparent"></div>

      <div className="absolute top-20 md:top-64 left-16 text-white space-y-4">
        <h1 className=" text-md md:text-4xl font-bold drop-shadow-md">
          Experience the Adventure
        </h1>
        <p className="text-xs md:text-lg  drop-shadow-md">
          Discover the epic journey with our exclusive content.
        </p>
        <button className="px-6 md:px-12 py-3 bg-secondary text-black opacity-90 hover:opacity-100 font-semibold rounded-md shadow-md">
          Watch Now
        </button>
      </div>
    </div>
  );
};

export default VideoBanner;
