import React, { useState, useEffect } from "react";
import { MetaData } from "../model/types/movie.types";
import { ISeriesResponse } from "../model/types/series.types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useSocket } from "../providers/socketProvider";
import { toast, ToastContainer } from "react-toastify";
interface CarouselProp {
  selectedMovie: MetaData | ISeriesResponse | null;
  series: boolean;
}
const Carousel = ({ selectedMovie, series }: CarouselProp) => {
  const { planDetails, user, selectedProfile } = useSelector(
    (state: RootState) => state.user
  );
  const [paidUser, setPaidUser] = useState(false);
  const [party, setParty] = useState<any | null>(null);
  const [id, setId] = useState<string | null>(null);

  const { socket } = useSocket();

  const handleParty = () => {
    const partyId = Math.floor(Math.random() * 1000000).toString();
    if (socket && user) {
      socket.emit("joinParty", {
        partyId,
        profileId: user.defaultProfile,
      });

      const inviteLink = `${window.location.origin}/watch-party?partyId=${partyId}`;
      setId(partyId);
      navigator.clipboard.writeText(inviteLink).then(() => {
        toast.info("Invite link copied to clipboard!");
      });
    }
  };
  const handleWatch = () => {
    console.log("party: " + id);
    const partyQuery = id ? `&partyId=${id}` : "";
    navigate(`/watch?v=${selectedMovie?._id}`);
    if (id && socket) {
      console.log(id);
      socket.emit("selectedMovie", {
        link: `/watch?v=${selectedMovie?._id}&partyId=${id}`,
        partyId: id,
      });
    }
  };
  useEffect(() => {
    if (planDetails && planDetails.status === "active") {
      setPaidUser(true);
    }
  }, [planDetails]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("partyUpdate", (party) => {
      if (party.host === user?.defaultProfile) return;
      toast.info("someone has joined");
      console.log(party);
      if (party) setParty(party);
      // setParticipants(party.participants);
      // if (!isHost) {
      //   syncVideoState(party.videoState);
      // }
    });
  }, [socket]);

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
          {series ? (
            <></>
          ) : (
            <>
              {paidUser ? (
                <div className="gap-2 flex">
                  <button
                    className="mt-4 bg-secondary px-6 py-2 rounded-lg text-white hover:opacity-90 opacity-100"
                    onClick={handleWatch}
                  >
                    Watch Now
                  </button>
                  <button
                    className="mt-4 border border-secondary  px-6 py-2 rounded-lg text-white hover:opacity-90 opacity-100"
                    onClick={handleParty}
                  >
                    Invite
                  </button>
                </div>
              ) : (
                <button
                  className="mt-4 bg-secondary px-6 py-2 rounded-lg text-white hover:opacity-90 opacity-100"
                  onClick={() => navigate(`/plans`)}
                >
                  Purchase Plan
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
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
