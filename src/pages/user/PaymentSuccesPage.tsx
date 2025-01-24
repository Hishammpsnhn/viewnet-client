import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Payment_Success_API } from "../../api/Sub-Plan/Plans";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PaymentSuccessPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");
  const paymentIntent = queryParams.get("payment_intent");
  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful! 🎉
      </h1>
        <>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for your payment. We have successfully received your
            payment of <span className="font-semibold">₹{amount}</span>.
          </p>
          <div className="bg-black border text-white shadow-md rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">
              Payment Details
            </h2>
            <div className="text-gray-500">
              <p className="mb-2">
                <span className="font-medium">Amount Paid:</span> ₹{amount}
              </p>
              <p className="mb-2">
                <span className="font-medium">Transaction ID:</span>{" "}
                {paymentIntent}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </>

      <button
        className="mt-6 px-6 py-2 bg-secondary font-medium rounded hover:opacity-90 text-black transition duration-200"
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
