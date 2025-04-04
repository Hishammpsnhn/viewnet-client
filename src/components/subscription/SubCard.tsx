import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MdEdit } from "react-icons/md";
import { Payment_API } from "../../api/PlansApi";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";

interface SubCardProps {
  planId: string;
  name: string;
  price: string;
  discount?: number;
  isActive: boolean;
  uhd: boolean;
  live: boolean;
  ads: boolean;
  sessionLimit: number;
  onEdit: () => void;
}
const SubCard: React.FC<SubCardProps> = ({
  planId,
  name,
  price,
  onEdit,
  isActive,
  uhd,
  live,
  ads,
  sessionLimit,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (user) {
        const res = await Payment_API(planId, user?._id,user.email);
        if (res.success) {
          window.location.href = res.data.url
        }
      }else{
        toast.error("Please login to make a payment");
        return;
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-800 shadow-2xl rounded-lg p-8 max-w-lg mx-auto ${
        !isActive && "hidden"
      }`}
    >
      {user?.isAdmin && (
        <button
          onClick={onEdit}
          className="text-gray-800 bg-gray-500 rounded-full mb-5 p-2"
        >
          <MdEdit />
        </button>
      )}

      <h2 className="text-3xl font-bold text-white mb-4">{name}</h2>
      <div className="flex items-center justify-between mb-6">
        <span className="text-4xl font-semibold text-yellow-400">
          ₹ {price}{" "}
        </span>
        {/* {discount && (
          <span className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )} */}
      </div>
      <ul className="space-y-3 mb-6">
        {sessionLimit && (
          <li className="text-white flex items-center">
            <TickIcon />
            up to {sessionLimit} device
          </li>
        )}
        {live ? (
          <li className="text-white flex items-center">
            <TickIcon />
            Live Streaming Available
          </li>
        ) : (
          <li className="text-white flex items-center">
            <XIcon />
            Live Streaming Available
          </li>
        )}
        {ads ? (
          <li className="text-white flex items-center">
            <TickIcon />
            Ad-free
          </li>
        ) : (
          <li className="text-white flex items-center">
            <XIcon />
            Ad-free
          </li>
        )}
        {uhd ? (
          <li className="text-white flex items-center">
            <TickIcon />
            4K Available
          </li>
        ) : (
          <li className="text-white flex items-center">
            <XIcon />
            4K Available
          </li>
        )}
      </ul>
      <button
        disabled={loading}
        onClick={handlePayment}
        className="w-full bg-secondary text-black p-2 rounded-lg hover:bg-primary-dark transition duration-300 text-xl font-semibold flex items-center justify-center"
      >
        {loading ? <LoadingSpinner /> : "BUY"}
      </button>

      {/* {isModalOpen && (
        <PaymentModal
          clientSecret={clientSecret}
          planId={planId}
          price={parseInt(price)}
          closeModal={closeModal}
        />
      )} */}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default SubCard;

const XIcon = () => {
  return (
    <svg
      // className={`${size} ${color} ${className}`}
      className="w-6 h-6 text-red-700 mr-3"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
};
const TickIcon = () => {
  return (
    <svg
      className="w-6 h-6 text-green-500 mr-3"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};
