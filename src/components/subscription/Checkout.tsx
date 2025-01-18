import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const CheckoutPage = ({
  planId,
  amount,
  clientSecret,
}: {
  planId: string;
  amount: number;
  clientSecret: string;
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted"); 
    e.preventDefault();
  
    if (!stripe || !elements || !user) {
      console.error("Stripe, Elements, or User is missing");
      return;
    }
  
    try {
      // Submit the elements
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Submit error:", submitError.message);
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }
  
      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:5173/payment-success?amount=${amount}&plan_id=${planId}`,
        },
      });
  
      if (error) {
        console.error("Payment confirmation error:", error.message);
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }
  
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="text-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <form className="p-4" onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        type="submit"
        className="mt-4 bg-secondary text-black font-semibold w-full p-2 rounded"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
