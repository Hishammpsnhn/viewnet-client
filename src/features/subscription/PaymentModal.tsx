import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "../../components/subscription/Checkout";
import { loadStripe } from "@stripe/stripe-js";


interface PaymentModalProps {
  closeModal: () => void;
  price: number;
  planId: string;
  clientSecret:string
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal: React.FC<PaymentModalProps> = ({
  price,
  planId,
  closeModal,
  clientSecret
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full ">
      <div className="bg-black p-6 rounded-lg border relative w-1/2">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Payment
        </h2>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: price * 100,
            currency: "usd",
          }}
        >
          {/* <CheckoutPage  id={id} amount={price} /> */}
          <CheckoutPage planId={planId} amount={price}  clientSecret={clientSecret} />
        </Elements>

      </div>
    </div>
  );
};

export default PaymentModal;
