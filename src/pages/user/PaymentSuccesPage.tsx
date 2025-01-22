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

  // Extract the query parameters
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");
  const planId = queryParams.get("plan_id");
  const paymentIntent = queryParams.get("payment_intent");
  const paymentIntentClientSecret = queryParams.get(
    "payment_intent_client_secret"
  );

  const [paymentStatus, setPaymentStatus] = useState<string | null>("Payment Successful");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiCallFlag = useRef(false); 

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      console.log("verifyPaymentStatus called");
      console.log(planId, user, paymentIntent);
      try {
        if (!planId || !user || !paymentIntent) {
          return;
        }
        const response = await Payment_Success_API(planId, user._id, paymentIntent);

        if (response.data.status === "succeeded") {
          setPaymentStatus("Payment Successful");
        } else {
          setPaymentStatus("Payment Failed");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("Failed to verify payment status.");
      } finally {
        setLoading(false);
      }
    };

    if (!apiCallFlag.current && paymentIntent && paymentIntentClientSecret) {
      apiCallFlag.current = true; 
      verifyPaymentStatus();
    }

    console.log(paymentIntent, paymentIntentClientSecret, paymentIntent);
  }, [planId, user, paymentIntent, paymentIntentClientSecret]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment{" "}
        {paymentStatus === "Payment Successful" ? "Successful" : "Failed"}! 🎉
      </h1>
      {paymentStatus === "Payment Successful" ? (
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
      ) : (
        <p className="text-lg text-red-500 mb-6">
          {error || "Payment failed. Please try again."}
        </p>
      )}
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
