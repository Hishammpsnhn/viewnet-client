import  { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSocket } from "../../providers/socketProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";

const WatchParty = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { socket } = useSocket();
  const partyId = searchParams.get("partyId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (socket && partyId && user) {
      setIsModalOpen(true);
    }
  }, [socket, partyId, user]);

  const handleJoinParty = () => {
    if (socket && partyId && user) {
      socket.emit("joinParty", { partyId, profileId: user.defaultProfile });
      
      toast.success("Successfully joined the watch party!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setIsModalOpen(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <ToastContainer theme="dark" />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
       // style={modalStyles}
        className="outline-none"
      >
        <div className="bg-black dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {/* <Users className="w-6 h-6 text-blue-500" /> */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Join Watch Party
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Do you want to join the watch party with ID: {partyId}?
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinParty}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Join Party
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WatchParty;